use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(amount_yes: u64, amount_no: u64)]
pub struct AddLiquidity<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump,
        constraint = market.status == MarketStatus::Active @ ErrorCode::MarketNotActive
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        init_if_needed,
        payer = provider,
        space = 8 + LiquidityPosition::LEN,
        seeds = [b"liquidity", provider.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub liquidity_position: Account<'info, LiquidityPosition>,
    
    #[account(
        mut,
        constraint = provider_token_account.owner == provider.key() @ ErrorCode::InvalidAccount,
        constraint = provider_token_account.amount >= amount_yes + amount_no @ ErrorCode::InsufficientFunds
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
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<AddLiquidity>, amount_yes: u64, amount_no: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let liquidity_position = &mut ctx.accounts.liquidity_position;
    
    // Validate amounts
    require!(
        amount_yes > 0 && amount_no > 0,
        ErrorCode::InvalidAmount
    );
    
    // Check price balance (should maintain current ratio)
    let current_ratio = (market.yes_pool as f64) / (market.no_pool as f64);
    let provided_ratio = (amount_yes as f64) / (amount_no as f64);
    
    // Allow 5% deviation from current ratio
    let ratio_deviation = (current_ratio - provided_ratio).abs() / current_ratio;
    require!(
        ratio_deviation <= 0.05,
        ErrorCode::ImbalancedLiquidity
    );
    
    let total_amount = amount_yes
        .checked_add(amount_no)
        .ok_or(ErrorCode::MathOverflow)?;
    
    // Transfer tokens to market pool
    let transfer_instruction = Transfer {
        from: ctx.accounts.provider_token_account.to_account_info(),
        to: ctx.accounts.market_pool_account.to_account_info(),
        authority: ctx.accounts.provider.to_account_info(),
    };
    
    let cpi_ctx = CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        transfer_instruction,
    );
    
    token::transfer(cpi_ctx, total_amount)?;
    
    // Calculate LP tokens to mint (proportional to pool share)
    let total_supply = market.total_pool;
    let lp_tokens = if total_supply == 0 {
        // First LP: mint 1:1
        total_amount
    } else {
        // Subsequent LPs: proportional to share
        (total_amount as u128)
            .checked_mul(liquidity_position.lp_tokens as u128)
            .ok_or(ErrorCode::MathOverflow)?
            .checked_div(total_supply as u128)
            .ok_or(ErrorCode::MathOverflow)? as u64
    };
    
    // Update market pools
    market.yes_pool = market.yes_pool
        .checked_add(amount_yes)
        .ok_or(ErrorCode::MathOverflow)?;
    
    market.no_pool = market.no_pool
        .checked_add(amount_no)
        .ok_or(ErrorCode::MathOverflow)?;
    
    market.total_pool = market.total_pool
        .checked_add(total_amount)
        .ok_or(ErrorCode::MathOverflow)?;
    
    // Update liquidity position
    if liquidity_position.provider == Pubkey::default() {
        // Initialize new position
        liquidity_position.provider = ctx.accounts.provider.key();
        liquidity_position.market = market.key();
        liquidity_position.lp_tokens = lp_tokens;
        liquidity_position.amount_yes = amount_yes;
        liquidity_position.amount_no = amount_no;
        liquidity_position.created_at = Clock::get()?.unix_timestamp;
    } else {
        // Update existing position
        liquidity_position.lp_tokens = liquidity_position.lp_tokens
            .checked_add(lp_tokens)
            .ok_or(ErrorCode::MathOverflow)?;
        
        liquidity_position.amount_yes = liquidity_position.amount_yes
            .checked_add(amount_yes)
            .ok_or(ErrorCode::MathOverflow)?;
        
        liquidity_position.amount_no = liquidity_position.amount_no
            .checked_add(amount_no)
            .ok_or(ErrorCode::MathOverflow)?;
    }
    
    liquidity_position.last_update = Clock::get()?.unix_timestamp;
    
    msg!(
        "Liquidity added: {} YES + {} NO tokens ({} LP tokens minted)",
        amount_yes,
        amount_no,
        lp_tokens
    );
    
    Ok(())
}





























