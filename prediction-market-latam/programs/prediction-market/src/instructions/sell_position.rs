use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct SellPosition<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump,
        constraint = market.status == MarketStatus::Active @ ErrorCode::MarketNotActive
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        mut,
        seeds = [b"position", seller.key().as_ref(), market.key().as_ref()],
        bump
    )]
    pub seller_position: Account<'info, UserPosition>,
    
    #[account(
        mut,
        constraint = seller_token_account.owner == seller.key() @ ErrorCode::InvalidAccount
    )]
    pub seller_token_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"market_pool", market.key().as_ref()],
        bump
    )]
    pub market_pool_account: Account<'info, TokenAccount>,
    
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub treasury: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
}

pub fn handler(ctx: Context<SellPosition>, amount: u64) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let seller_position = &mut ctx.accounts.seller_position;
    
    // Validate amount
    require!(
        amount > 0 && amount <= seller_position.amount,
        ErrorCode::InvalidAmount
    );
    
    // Calculate current price based on constant product AMM
    // Price = opposite_pool / (opposite_pool + same_pool)
    let (same_pool, opposite_pool) = match seller_position.outcome {
        Outcome::Yes => (market.yes_pool, market.no_pool),
        Outcome::No => (market.no_pool, market.yes_pool),
        _ => return Err(ErrorCode::InvalidInputParameters.into()),
    };
    
    // Calculate tokens to receive using constant product formula
    // k = yes_pool * no_pool (constant)
    // After sell: same_pool' = same_pool - amount
    // opposite_pool' = k / same_pool'
    // tokens_out = opposite_pool' - opposite_pool
    
    let k = (same_pool as u128)
        .checked_mul(opposite_pool as u128)
        .ok_or(ErrorCode::MathOverflow)?;
    
    let new_same_pool = same_pool
        .checked_sub(amount)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    let new_opposite_pool = k
        .checked_div(new_same_pool as u128)
        .ok_or(ErrorCode::MathOverflow)? as u64;
    
    let tokens_out = new_opposite_pool
        .checked_sub(opposite_pool)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    // Apply 0.5% sell fee
    let fee_bps: u64 = 50; // 0.5%
    let fee_amount = tokens_out
        .checked_mul(fee_bps)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::MathOverflow)?;
    
    let net_tokens_out = tokens_out
        .checked_sub(fee_amount)
        .ok_or(ErrorCode::MathOverflow)?;
    
    // Apply 2% slippage protection
    let min_tokens_out = tokens_out
        .checked_mul(98)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(100)
        .ok_or(ErrorCode::MathOverflow)?;
    
    require!(
        net_tokens_out >= min_tokens_out,
        ErrorCode::SlippageExceeded
    );
    
    // Update market pools
    match seller_position.outcome {
        Outcome::Yes => {
            market.yes_pool = market.yes_pool
                .checked_sub(amount)
                .ok_or(ErrorCode::InsufficientLiquidity)?;
            market.no_pool = new_opposite_pool;
        },
        Outcome::No => {
            market.no_pool = market.no_pool
                .checked_sub(amount)
                .ok_or(ErrorCode::InsufficientLiquidity)?;
            market.yes_pool = new_opposite_pool;
        },
        _ => return Err(ErrorCode::InvalidInputParameters.into()),
    }
    
    // Update seller position
    seller_position.amount = seller_position.amount
        .checked_sub(amount)
        .ok_or(ErrorCode::InsufficientLiquidity)?;
    
    // Transfer fee to treasury
    let market_key = market.key();
    let seeds = &[
        b"market_pool",
        market_key.as_ref(),
        &[ctx.bumps.market_pool_account],
    ];
    let signer = &[&seeds[..]];
    
    let fee_transfer = Transfer {
        from: ctx.accounts.market_pool_account.to_account_info(),
        to: ctx.accounts.treasury.to_account_info(),
        authority: ctx.accounts.market_pool_account.to_account_info(),
    };
    
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            fee_transfer,
            signer,
        ),
        fee_amount,
    )?;
    
    // Transfer tokens to seller
    let tokens_transfer = Transfer {
        from: ctx.accounts.market_pool_account.to_account_info(),
        to: ctx.accounts.seller_token_account.to_account_info(),
        authority: ctx.accounts.market_pool_account.to_account_info(),
    };
    
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            tokens_transfer,
            signer,
        ),
        net_tokens_out,
    )?;
    
    msg!(
        "Position sold: {} shares for {} tokens (fee: {})",
        amount,
        net_tokens_out,
        fee_amount
    );
    
    Ok(())
}


























