use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(lp_tokens: u64)]
pub struct RemoveLiquidity<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump,
        constraint = market.status == MarketStatus::Active || market.status == MarketStatus::Resolved @ ErrorCode::MarketNotActive
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        mut,
        seeds = [b"liquidity", provider.key().as_ref(), market.key().as_ref()],
        bump,
        constraint = liquidity_position.lp_tokens >= lp_tokens @ ErrorCode::InsufficientLiquidity
    )]
    pub liquidity_position: Account<'info, LiquidityPosition>,
    
    #[account(
        mut,
        constraint = provider_token_account.owner == provider.key() @ ErrorCode::InvalidAccount
    )]
    pub provider_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"market_pool", market.key().as_ref()],
        bump
    )]
    pub market_pool_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub provider: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<RemoveLiquidity>, lp_tokens: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let liquidity_position = &mut ctx.accounts.liquidity_position;
    
    // Validate amount
    require!(lp_tokens > 0, ErrorCode::InvalidAmount);
    
    // Calculate proportional share of pool
    let total_lp_supply = liquidity_position.lp_tokens; // In real impl, track global LP supply
    
    let share_yes = (market.yes_pool as u128)
        .checked_mul(lp_tokens as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(total_lp_supply as u128)
        .ok_or(ErrorCode::MathOverflow)? as u64;
    
    let share_no = (market.no_pool as u128)
        .checked_mul(lp_tokens as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(total_lp_supply as u128)
        .ok_or(ErrorCode::MathOverflow)? as u64;
    
    let total_withdrawal = share_yes
        .checked_add(share_no)
        .ok_or(ErrorCode::MathOverflow)?;
    
    // Update market pools
    market.yes_pool = market.yes_pool
        .checked_sub(share_yes)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    market.no_pool = market.no_pool
        .checked_sub(share_no)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    market.total_pool = market.total_pool
        .checked_sub(total_withdrawal)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    // Update liquidity position
    liquidity_position.lp_tokens = liquidity_position.lp_tokens
        .checked_sub(lp_tokens)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    liquidity_position.amount_yes = liquidity_position.amount_yes
        .checked_sub(share_yes)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    liquidity_position.amount_no = liquidity_position.amount_no
        .checked_sub(share_no)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    liquidity_position.last_update = Clock::get()?.unix_timestamp;
    
    // Transfer tokens back to provider
    let market_key = market.key();
    let seeds = &[
        b"market_pool",
        market_key.as_ref(),
        &[ctx.bumps.market_pool_account],
    ];
    let signer = &[&seeds[..]];
    
    let withdrawal_transfer = Transfer {
        from: ctx.accounts.market_pool_account.to_account_info(),
        to: ctx.accounts.provider_token_account.to_account_info(),
        authority: ctx.accounts.market_pool_account.to_account_info(),
    };
    
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            withdrawal_transfer,
            signer,
        ),
        total_withdrawal,
    )?;
    
    msg!(
        "Liquidity removed: {} LP tokens for {} YES + {} NO tokens",
        lp_tokens,
        share_yes,
        share_no
    );
    
    Ok(())
}


























