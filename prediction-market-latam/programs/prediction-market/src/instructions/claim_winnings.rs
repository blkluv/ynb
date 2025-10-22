use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};
use crate::state::*;
use crate::error::ErrorCode;

#[derive(Accounts)]
pub struct ClaimWinnings<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump,
        constraint = market.status == MarketStatus::Resolved @ ErrorCode::MarketNotActive
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        mut,
        seeds = [b"position", user.key().as_ref(), market.key().as_ref()],
        bump,
        close = user
    )]
    pub user_position: Account<'info, UserPosition>,
    
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        mut,
        constraint = user_token_account.owner == user.key() @ ErrorCode::InvalidAccount
    )]
    pub user_token_account: Account<'info, TokenAccount>,
    
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
    pub user: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<ClaimWinnings>) -> Result<()> {
    let market = &ctx.accounts.market;
    let user_position = &ctx.accounts.user_position;
    let user_profile = &mut ctx.accounts.user_profile;
    
    // Get the resolution outcome
    let resolution_data = market.resolution_data.as_ref()
        .ok_or(ErrorCode::MarketNotResolved)?;
    
    // Check if user won
    let user_won = match resolution_data.outcome {
        Outcome::Yes => user_position.outcome == Outcome::Yes,
        Outcome::No => user_position.outcome == Outcome::No,
        Outcome::Other(val) => {
            if let Outcome::Other(user_val) = user_position.outcome {
                user_val == val
            } else {
                false
            }
        }
    };
    
    require!(user_won, ErrorCode::PositionNotWinning);
    
    // Calculate winnings
    let winning_pool = match resolution_data.outcome {
        Outcome::Yes => market.yes_pool,
        Outcome::No => market.no_pool,
        _ => return Err(ErrorCode::InvalidInputParameters.into()),
    };
    
    let losing_pool = market.total_pool - winning_pool;
    
    // Proportional share: (user_amount / winning_pool) * losing_pool
    let user_share_of_pool = (user_position.amount as u128)
        .checked_mul(losing_pool as u128)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(winning_pool as u128)
        .ok_or(ErrorCode::MathOverflow)?;
    
    // Total payout = original stake + share of losing pool
    let gross_payout = user_position.amount
        .checked_add(user_share_of_pool as u64)
        .ok_or(ErrorCode::MathOverflow)?;
    
    // Apply 0.5% platform fee
    let fee_bps: u64 = 50; // 0.5% = 50 basis points
    let fee_amount = gross_payout
        .checked_mul(fee_bps)
        .ok_or(ErrorCode::MathOverflow)?
        .checked_div(10000)
        .ok_or(ErrorCode::MathOverflow)?;
    
    let net_payout = gross_payout
        .checked_sub(fee_amount)
        .ok_or(ErrorCode::MathOverflow)?;
    
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
    
    // Transfer net winnings to user
    let winnings_transfer = Transfer {
        from: ctx.accounts.market_pool_account.to_account_info(),
        to: ctx.accounts.user_token_account.to_account_info(),
        authority: ctx.accounts.market_pool_account.to_account_info(),
    };
    
    token::transfer(
        CpiContext::new_with_signer(
            ctx.accounts.token_program.to_account_info(),
            winnings_transfer,
            signer,
        ),
        net_payout,
    )?;
    
    // Update user profile reputation
    user_profile.correct_predictions += 1;
    user_profile.reputation_score = user_profile.reputation_score
        .saturating_add(10); // +10 reputation for correct prediction
    
    // Calculate new accuracy rate
    if user_profile.total_predictions > 0 {
        user_profile.accuracy_rate = ((user_profile.correct_predictions as f64 
            / user_profile.total_predictions as f64) * 100.0) as u8;
    }
    
    // Award badges
    if user_profile.accuracy_rate >= 80 && user_profile.total_predictions >= 10 {
        if !user_profile.badges.contains(&Badge::HighAccuracy) {
            user_profile.badges.push(Badge::HighAccuracy);
        }
    }
    
    msg!(
        "Winnings claimed: {} tokens (gross: {}, fee: {})",
        net_payout,
        gross_payout,
        fee_amount
    );
    
    Ok(())
}


























