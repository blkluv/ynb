use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;

#[derive(Accounts)]
#[instruction(amount: u64, outcome: Outcome)]
pub struct PlacePrediction<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump,
        constraint = market.status == MarketStatus::Active @ ErrorCode::MarketNotActive
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        init_if_needed,
        payer = user,
        space = 8 + UserPosition::LEN,
        seeds = [b"position", user.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,
    
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump,
        constraint = user_profile.reputation_score >= market.reputation_threshold @ ErrorCode::InsufficientReputation,
        constraint = !market.human_verified_required || user_profile.human_verified @ ErrorCode::HumanVerificationRequired
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        mut,
        constraint = user_token_account.owner == user.key() @ ErrorCode::InvalidAccount,
        constraint = user_token_account.amount >= amount @ ErrorCode::InsufficientFunds
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"market_pool", market.key().as_ref()],
        bump
    )]
    pub market_pool_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<PlacePrediction>, amount: u64, outcome: Outcome) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let user_position = &mut ctx.accounts.user_position;
    let user_profile = &mut ctx.accounts.user_profile;
    
    // Validate prediction amount
    require!(
        amount >= 1000, // Minimum 0.001 tokens (assuming 6 decimals)
        ErrorCode::PredictionAmountTooSmall
    );
    
    // Check if market resolution date has passed
    require!(
        Clock::get()?.unix_timestamp < market.resolution_date,
        ErrorCode::MarketResolutionDatePassed
    );
    
    // Calculate current price (in basis points, 10000 = 100%)
    let current_price = match outcome {
        Outcome::Yes => {
            (market.yes_pool as u128)
                .checked_mul(10000)
                .ok_or(ErrorCode::MathOverflow)?
                .checked_div(market.total_pool as u128)
                .ok_or(ErrorCode::MathOverflow)? as u64
        },
        Outcome::No => {
            (market.no_pool as u128)
                .checked_mul(10000)
                .ok_or(ErrorCode::MathOverflow)?
                .checked_div(market.total_pool as u128)
                .ok_or(ErrorCode::MathOverflow)? as u64
        },
        _ => return Err(ErrorCode::InvalidInputParameters.into()),
    };
    
    // Transfer tokens to market pool
    let transfer_instruction = Transfer {
        from: ctx.accounts.user_token_account.to_account_info(),
        to: ctx.accounts.market_pool_account.to_account_info(),
        authority: ctx.accounts.user.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );
    
    token::transfer(cpi_ctx, amount)?;
    
    // Update market pools
    match outcome {
        Outcome::Yes => {
            market.yes_pool += amount;
        },
        Outcome::No => {
            market.no_pool += amount;
        },
        Outcome::Other(_) => {
            return Err(ErrorCode::InvalidInputParameters.into());
        },
    }
    
    market.total_pool += amount;
    
    // Initialize or update user position
    if user_position.user == Pubkey::default() {
        // Initialize new position
        user_position.user = ctx.accounts.user.key();
        user_position.market = market.key();
        user_position.outcome = outcome;
        user_position.amount = amount;
        user_position.entry_price = current_price;
        user_position.created_at = Clock::get()?.unix_timestamp;
        user_position.last_update = Clock::get()?.unix_timestamp;
        
        market.total_participants += 1;
    } else {
        // Update existing position (average entry price)
        let total_value = (user_position.amount as u128)
            .checked_mul(user_position.entry_price as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_add(
                (amount as u128)
                    .checked_mul(current_price as u128)
                    .ok_or(ErrorCode::MathOverflow)?
            )
            .ok_or(ErrorCode::MathOverflow)?;
        
        user_position.amount = user_position.amount
            .checked_add(amount)
            .ok_or(ErrorCode::MathOverflow)?;
        
        user_position.entry_price = total_value
            .checked_div(user_position.amount as u128)
            .ok_or(ErrorCode::MathOverflow)? as u64;
        
        user_position.last_update = Clock::get()?.unix_timestamp;
    }
    
    // Update user profile
    user_profile.total_predictions += 1;
    user_profile.last_activity = Clock::get()?.unix_timestamp;
    
    msg!(
        "Prediction placed: {} tokens on {} at price {} (Market: {})",
        amount,
        match outcome {
            Outcome::Yes => "YES",
            Outcome::No => "NO",
            _ => "OTHER"
        },
        current_price,
        market.question
    );
    
    Ok(())
}











