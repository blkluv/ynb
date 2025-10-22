use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(market_data: MarketData, evidence_requirements: EvidenceRequirements)]
pub struct CreateMarket<'info> {
    #[account(
        init,
        payer = creator,
        space = 8 + PredictionMarket::LEN,
        seeds = [b"market", market_data.question.as_bytes()],
        bump
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        mut,
        constraint = user_profile.reputation_score >= 50 @ ErrorCode::InsufficientReputation
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(
    ctx: Context<CreateMarket>, 
    market_data: MarketData, 
    evidence_requirements: EvidenceRequirements
) -> Result<()> {
    let market = &mut ctx.accounts.market;
    let user_profile = &ctx.accounts.user_profile;
    
    // Validate market data
    require!(
        market_data.question.len() > 10 && market_data.question.len() <= 200,
        ErrorCode::InvalidQuestionLength
    );
    
    require!(
        market_data.description.len() <= 500,
        ErrorCode::InvalidDescriptionLength
    );
    
    require!(
        market_data.resolution_date > Clock::get()?.unix_timestamp,
        ErrorCode::InvalidResolutionDate
    );
    
    // Check for human verification requirement
    let human_verified_required = evidence_requirements.government_source_required || 
                                 evidence_requirements.scientific_peer_review;
    
    // Initialize market
    market.authority = ctx.accounts.creator.key();
    market.creator = ctx.accounts.creator.key();
    market.status = MarketStatus::Active;
    market.created_at = Clock::get()?.unix_timestamp;
    market.resolution_date = market_data.resolution_date;
    market.question = market_data.question;
    market.description = market_data.description;
    market.category = market_data.category;
    market.evidence_requirements = evidence_requirements;
    market.total_pool = market_data.initial_liquidity;
    market.yes_pool = market_data.initial_liquidity / 2;
    market.no_pool = market_data.initial_liquidity / 2;
    market.total_participants = 0;
    market.resolution_data = None;
    market.moderation_flags = vec![];
    market.reputation_threshold = if user_profile.reputation_score >= 200 { 0 } else { 25 };
    market.human_verified_required = human_verified_required;
    market.oracle_integration = None;
    market.meta_markets = vec![];
    
    msg!(
        "Market created: {} (Category: {}, Resolution: {})",
        market.question,
        market.category,
        market.resolution_date
    );
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Insufficient reputation to create market")]
    InsufficientReputation,
    #[msg("Question must be between 10 and 200 characters")]
    InvalidQuestionLength,
    #[msg("Description must be less than 500 characters")]
    InvalidDescriptionLength,
    #[msg("Resolution date must be in the future")]
    InvalidResolutionDate,
}




































