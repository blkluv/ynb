use anchor_lang::prelude::*;

declare_id!("9t6KXNy5xW8b6GyZmwUpqbHeQUKqxbvnfPy8oiRp9rka");

#[program]
pub mod prediction_market {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let global_state = &mut ctx.accounts.global_state;
        global_state.authority = ctx.accounts.authority.key();
        global_state.total_markets = 0;
        global_state.total_volume = 0;
        Ok(())
    }

    pub fn create_market(
        ctx: Context<CreateMarket>,
        question: String,
        description: String,
        end_time: i64,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let clock = Clock::get()?;
        
        require!(question.len() <= 200, ErrorCode::QuestionTooLong);
        require!(end_time > clock.unix_timestamp, ErrorCode::InvalidEndTime);
        
        market.authority = ctx.accounts.authority.key();
        market.question = question;
        market.description = description;
        market.end_time = end_time;
        market.created_at = clock.unix_timestamp;
        market.yes_amount = 0;
        market.no_amount = 0;
        market.resolved = false;
        market.winning_outcome = false;
        
        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        amount: u64,
        bet_yes: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let bet = &mut ctx.accounts.bet;
        let clock = Clock::get()?;
        
        require!(!market.resolved, ErrorCode::MarketResolved);
        require!(clock.unix_timestamp < market.end_time, ErrorCode::MarketExpired);
        require!(amount >= 10_000_000, ErrorCode::BetTooSmall); // 0.01 SOL min
        
        // Transfer SOL to market account
        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &market.key(),
            amount,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                market.to_account_info(),
            ],
        )?;
        
        // Update market totals
        if bet_yes {
            market.yes_amount = market.yes_amount.checked_add(amount).ok_or(ErrorCode::MathOverflow)?;
        } else {
            market.no_amount = market.no_amount.checked_add(amount).ok_or(ErrorCode::MathOverflow)?;
        }
        
        // Record individual bet
        bet.user = ctx.accounts.user.key();
        bet.market = market.key();
        bet.amount = amount;
        bet.outcome = bet_yes;
        bet.claimed = false;
        bet.timestamp = clock.unix_timestamp;
        
        Ok(())
    }

    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        outcome: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let clock = Clock::get()?;
        
        require!(!market.resolved, ErrorCode::AlreadyResolved);
        require!(clock.unix_timestamp >= market.end_time, ErrorCode::MarketNotExpired);
        require!(ctx.accounts.authority.key() == market.authority, ErrorCode::Unauthorized);
        
        market.resolved = true;
        market.winning_outcome = outcome;
        
        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let market = &ctx.accounts.market;
        let bet = &mut ctx.accounts.bet;
        
        // Validate market is resolved
        require!(market.resolved, ErrorCode::MarketNotResolved);
        
        // Validate user bet on winning outcome
        require!(bet.outcome == market.winning_outcome, ErrorCode::WrongOutcome);
        
        // Validate not already claimed
        require!(!bet.claimed, ErrorCode::AlreadyClaimed);
        
        // Calculate winnings
        let total_pool = market.yes_amount.checked_add(market.no_amount).ok_or(ErrorCode::MathOverflow)?;
        let winning_pool = if market.winning_outcome {
            market.yes_amount
        } else {
            market.no_amount
        };
        
        require!(winning_pool > 0, ErrorCode::NoWinnings);
        
        // Calculate user's share: (user_bet / winning_pool) * total_pool
        let winnings = (bet.amount as u128)
            .checked_mul(total_pool as u128).ok_or(ErrorCode::MathOverflow)?
            .checked_div(winning_pool as u128).ok_or(ErrorCode::MathOverflow)?
            as u64;
        
        require!(winnings > 0, ErrorCode::NoWinnings);
        
        // Transfer winnings from market to user
        **market.to_account_info().try_borrow_mut_lamports()? = market
            .to_account_info()
            .lamports()
            .checked_sub(winnings)
            .ok_or(ErrorCode::MathOverflow)?;
        
        **ctx.accounts.user.to_account_info().try_borrow_mut_lamports()? = ctx
            .accounts
            .user
            .to_account_info()
            .lamports()
            .checked_add(winnings)
            .ok_or(ErrorCode::MathOverflow)?;
        
        // Mark as claimed
        bet.claimed = true;
        
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 8 + 8)]
    pub global_state: Account<'info, GlobalState>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct CreateMarket<'info> {
    #[account(init, payer = authority, space = 8 + 32 + 200 + 500 + 8 + 8 + 8 + 8 + 1 + 1)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 32 + 8 + 1 + 1 + 8,
        seeds = [b"bet", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        mut,
        seeds = [b"bet", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub bet: Account<'info, Bet>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct GlobalState {
    pub authority: Pubkey,
    pub total_markets: u64,
    pub total_volume: u64,
}

#[account]
pub struct Market {
    pub authority: Pubkey,           // 32
    pub question: String,             // 4 + 200
    pub description: String,          // 4 + 500
    pub end_time: i64,                // 8
    pub created_at: i64,              // 8
    pub yes_amount: u64,              // 8
    pub no_amount: u64,               // 8
    pub resolved: bool,               // 1
    pub winning_outcome: bool,        // 1
}

#[account]
pub struct Bet {
    pub user: Pubkey,                 // 32
    pub market: Pubkey,               // 32
    pub amount: u64,                  // 8
    pub outcome: bool,                // 1 (true = YES, false = NO)
    pub claimed: bool,                // 1
    pub timestamp: i64,               // 8
}

#[error_code]
pub enum ErrorCode {
    #[msg("Question too long (max 200 characters)")]
    QuestionTooLong,
    #[msg("Invalid end time")]
    InvalidEndTime,
    #[msg("Market already resolved")]
    MarketResolved,
    #[msg("Market expired")]
    MarketExpired,
    #[msg("Bet too small (min 0.01 SOL)")]
    BetTooSmall,
    #[msg("Already resolved")]
    AlreadyResolved,
    #[msg("Market not expired yet")]
    MarketNotExpired,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Math overflow")]
    MathOverflow,
    #[msg("Market not resolved yet")]
    MarketNotResolved,
    #[msg("Wrong outcome (you bet on the losing side)")]
    WrongOutcome,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("No winnings available")]
    NoWinnings,
}
