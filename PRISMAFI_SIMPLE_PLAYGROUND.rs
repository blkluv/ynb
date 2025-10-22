use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod prediction_market {
    use super::*;

    pub fn create_market(
        ctx: Context<CreateMarket>,
        question: String,
        description: String,
        end_time: i64,
        category: String,
    ) -> Result<()> {
        require!(question.len() <= 200, PredictionMarketError::QuestionTooLong);
        require!(description.len() <= 1000, PredictionMarketError::DescriptionTooLong);
        require!(category.len() <= 50, PredictionMarketError::CategoryTooLong);
        require!(end_time > Clock::get()?.unix_timestamp, PredictionMarketError::InvalidEndTime);

        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.question = question;
        market.description = description;
        market.end_time = end_time;
        market.category = category;
        market.total_yes_amount = 0;
        market.total_no_amount = 0;
        market.resolved = false;
        market.winning_outcome = None;
        market.created_at = Clock::get()?.unix_timestamp;
        market.bump = ctx.bumps.market;

        Ok(())
    }

    pub fn place_bet(
        ctx: Context<PlaceBet>,
        outcome: bool,
        amount: u64,
    ) -> Result<()> {
        require!(amount > 0, PredictionMarketError::InvalidAmount);
        
        let market = &mut ctx.accounts.market;
        require!(!market.resolved, PredictionMarketError::MarketResolved);
        require!(
            Clock::get()?.unix_timestamp < market.end_time,
            PredictionMarketError::MarketExpired
        );

        let position = &mut ctx.accounts.position;
        position.user = ctx.accounts.user.key();
        position.market = market.key();
        position.outcome = outcome;
        position.amount = position.amount.checked_add(amount).unwrap();
        position.claimed = false;
        position.bump = ctx.bumps.position;

        if outcome {
            market.total_yes_amount = market.total_yes_amount.checked_add(amount).unwrap();
        } else {
            market.total_no_amount = market.total_no_amount.checked_add(amount).unwrap();
        }

        let cpi_context = CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.user.to_account_info(),
                to: ctx.accounts.market_vault.to_account_info(),
            },
        );
        anchor_lang::system_program::transfer(cpi_context, amount)?;

        Ok(())
    }

    pub fn resolve_market(
        ctx: Context<ResolveMarket>,
        winning_outcome: bool,
    ) -> Result<()> {
        let market = &mut ctx.accounts.market;
        
        require!(!market.resolved, PredictionMarketError::AlreadyResolved);
        require!(
            Clock::get()?.unix_timestamp >= market.end_time,
            PredictionMarketError::MarketNotExpired
        );
        require!(
            ctx.accounts.authority.key() == market.authority,
            PredictionMarketError::Unauthorized
        );

        market.resolved = true;
        market.winning_outcome = Some(winning_outcome);

        Ok(())
    }

    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        let market = &ctx.accounts.market;
        let position = &mut ctx.accounts.position;

        require!(market.resolved, PredictionMarketError::MarketNotResolved);
        require!(!position.claimed, PredictionMarketError::AlreadyClaimed);
        require!(
            position.user == ctx.accounts.user.key(),
            PredictionMarketError::Unauthorized
        );

        let winning_outcome = market.winning_outcome.unwrap();
        require!(
            position.outcome == winning_outcome,
            PredictionMarketError::LosingPosition
        );

        let total_pool = market.total_yes_amount + market.total_no_amount;
        let winning_total = if winning_outcome {
            market.total_yes_amount
        } else {
            market.total_no_amount
        };

        let winnings = (position.amount as u128)
            .checked_mul(total_pool as u128)
            .unwrap()
            .checked_div(winning_total as u128)
            .unwrap() as u64;

        let vault_seeds = &[
            b"vault",
            market.key().as_ref(),
            &[ctx.bumps.market_vault],
        ];
        let signer = &[&vault_seeds[..]];

        let cpi_context = CpiContext::new_with_signer(
            ctx.accounts.system_program.to_account_info(),
            anchor_lang::system_program::Transfer {
                from: ctx.accounts.market_vault.to_account_info(),
                to: ctx.accounts.user.to_account_info(),
            },
            signer,
        );
        anchor_lang::system_program::transfer(cpi_context, winnings)?;

        position.claimed = true;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(question: String)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 4 + 200 + 4 + 1000 + 4 + 50 + 8 + 8 + 8 + 1 + 2 + 8 + 1,
        seeds = [b"market", authority.key().as_ref(), question.as_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + 32 + 32 + 1 + 8 + 1 + 1,
        seeds = [b"position", market.key().as_ref(), user.key().as_ref()],
        bump
    )]
    pub position: Account<'info, UserPosition>,
    
    /// CHECK: This is the market vault
    #[account(
        mut,
        seeds = [b"vault", market.key().as_ref()],
        bump
    )]
    pub market_vault: AccountInfo<'info>,
    
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
    #[account(mut)]
    pub market: Account<'info, Market>,
    
    #[account(mut)]
    pub position: Account<'info, UserPosition>,
    
    /// CHECK: This is the market vault
    #[account(
        mut,
        seeds = [b"vault", market.key().as_ref()],
        bump
    )]
    pub market_vault: AccountInfo<'info>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Market {
    pub authority: Pubkey,
    pub question: String,
    pub description: String,
    pub category: String,
    pub end_time: i64,
    pub total_yes_amount: u64,
    pub total_no_amount: u64,
    pub resolved: bool,
    pub winning_outcome: Option<bool>,
    pub created_at: i64,
    pub bump: u8,
}

#[account]
pub struct UserPosition {
    pub user: Pubkey,
    pub market: Pubkey,
    pub outcome: bool,
    pub amount: u64,
    pub claimed: bool,
    pub bump: u8,
}

#[error_code]
pub enum PredictionMarketError {
    #[msg("Question too long (max 200 characters)")]
    QuestionTooLong,
    #[msg("Description too long (max 1000 characters)")]
    DescriptionTooLong,
    #[msg("Category too long (max 50 characters)")]
    CategoryTooLong,
    #[msg("End time must be in the future")]
    InvalidEndTime,
    #[msg("Invalid bet amount")]
    InvalidAmount,
    #[msg("Market is already resolved")]
    MarketResolved,
    #[msg("Market has expired")]
    MarketExpired,
    #[msg("Market is already resolved")]
    AlreadyResolved,
    #[msg("Market has not expired yet")]
    MarketNotExpired,
    #[msg("Unauthorized")]
    Unauthorized,
    #[msg("Market is not resolved yet")]
    MarketNotResolved,
    #[msg("Winnings already claimed")]
    AlreadyClaimed,
    #[msg("This is a losing position")]
    LosingPosition,
}



