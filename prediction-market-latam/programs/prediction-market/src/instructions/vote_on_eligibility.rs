use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(vote: bool, reason: String)]
pub struct VoteOnEligibility<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        init_if_needed,
        payer = voter,
        space = 8 + EligibilityRegistry::LEN,
        seeds = [b"eligibility", market.key().as_ref()],
        bump
    )]
    pub eligibility_registry: Account<'info, EligibilityRegistry>,
    
    #[account(
        init,
        payer = voter,
        space = 8 + EligibilityVote::LEN,
        seeds = [b"eligibility_vote", market.key().as_ref(), voter.key().as_ref()],
        bump
    )]
    pub eligibility_vote: Account<'info, EligibilityVote>,
    
    #[account(
        mut,
        constraint = user_profile.reputation_score >= 100 @ ErrorCode::InsufficientReputation
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub voter: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

impl EligibilityRegistry {
    pub const LEN: usize = 8 + 32 + 4 * 2 + 8 * 2 + 1 + 1 + 8 * 2; // Approximate size
}

impl EligibilityVote {
    pub const LEN: usize = 8 + 32 * 2 + 1 + 4 + 32 + 8 + 4; // Approximate size
}

pub fn handler(ctx: Context<VoteOnEligibility>, vote: bool, reason: String) -> Result<()> {
    let eligibility_vote = &mut ctx.accounts.eligibility_vote;
    let eligibility_registry = &mut ctx.accounts.eligibility_registry;
    let user_profile = &ctx.accounts.user_profile;
    
    // Record the vote
    eligibility_vote.market = ctx.accounts.market.key();
    eligibility_vote.voter = ctx.accounts.voter.key();
    eligibility_vote.vote = vote;
    eligibility_vote.reason = reason;
    eligibility_vote.voted_at = Clock::get()?.unix_timestamp;
    eligibility_vote.reputation_weight = user_profile.reputation_score;
    
    // Update registry totals
    eligibility_registry.market = ctx.accounts.market.key();
    eligibility_registry.total_votes += 1;
    
    if vote {
        eligibility_registry.yes_votes += 1;
        eligibility_registry.weighted_yes += user_profile.reputation_score as u64;
    } else {
        eligibility_registry.no_votes += 1;
        eligibility_registry.weighted_no += user_profile.reputation_score as u64;
    }
    
    // Check if market becomes eligible/ineligible
    let total_weighted_votes = eligibility_registry.weighted_yes + eligibility_registry.weighted_no;
    if total_weighted_votes > 0 {
        let eligibility_percentage = if eligibility_registry.weighted_yes > eligibility_registry.weighted_no {
            (eligibility_registry.weighted_yes * 100) / total_weighted_votes
        } else {
            (eligibility_registry.weighted_no * 100) / total_weighted_votes
        };
        
        eligibility_registry.eligible = eligibility_percentage >= eligibility_registry.threshold as u64;
        
        // Update market status based on eligibility
        let market = &mut ctx.accounts.market;
        if !eligibility_registry.eligible && market.status == MarketStatus::Active {
            market.status = MarketStatus::Blacklisted;
            msg!("Market blacklisted due to community vote");
        } else if eligibility_registry.eligible && market.status == MarketStatus::Blacklisted {
            market.status = MarketStatus::Active;
            msg!("Market re-enabled due to community vote");
        }
    }
    
    eligibility_registry.updated_at = Clock::get()?.unix_timestamp;
    
    msg!(
        "Eligibility vote recorded: {} (weight: {})",
        if vote { "YES" } else { "NO" },
        user_profile.reputation_score
    );
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient reputation to vote on market eligibility")]
    InsufficientReputation,
}













