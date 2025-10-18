use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(parent_market: Pubkey, meta_data: MetaPredictionData)]
pub struct CreateMetaPrediction<'info> {
    #[account(
        constraint = parent_market.key() == parent_market_account.key() @ ErrorCode::InvalidParentMarket
    )]
    pub parent_market_account: Account<'info, PredictionMarket>,
    
    #[account(
        init,
        payer = creator,
        space = 8 + MetaPredictionMarket::LEN,
        seeds = [b"meta_market", parent_market.key().as_ref(), meta_data.question.as_bytes()],
        bump
    )]
    pub meta_market: Account<'info, MetaPredictionMarket>,
    
    #[account(
        mut,
        constraint = user_profile.reputation_score >= 100 @ ErrorCode::InsufficientReputation
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub creator: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct MetaPredictionData {
    pub question: String,
    pub description: String,
    pub prediction_type: MetaPredictionType,
    pub media_analysis: Option<MediaAnalysisData>,
}

impl MetaPredictionMarket {
    pub const LEN: usize = 8 + 32 * 2 + 4 * 2 + 100 + 500 + 50 + 200 + 8 * 2 + 1; // Approximate size
}

pub fn handler(
    ctx: Context<CreateMetaPrediction>, 
    parent_market: Pubkey, 
    meta_data: MetaPredictionData
) -> Result<()> {
    let meta_market = &mut ctx.accounts.meta_market;
    let parent_market_account = &ctx.accounts.parent_market_account;
    
    // Validate meta prediction data
    require!(
        meta_data.question.len() > 10 && meta_data.question.len() <= 200,
        ErrorCode::InvalidQuestionLength
    );
    
    require!(
        meta_data.description.len() <= 500,
        ErrorCode::InvalidDescriptionLength
    );
    
    // Validate that parent market is active
    require!(
        parent_market_account.status == MarketStatus::Active,
        ErrorCode::ParentMarketNotActive
    );
    
    // Set resolution date to be before parent market resolution
    let resolution_date = parent_market_account.resolution_date - 86400; // 1 day before
    require!(
        resolution_date > Clock::get()?.unix_timestamp,
        ErrorCode::InvalidResolutionDate
    );
    
    // Initialize meta market
    meta_market.parent_market = parent_market;
    meta_market.creator = ctx.accounts.creator.key();
    meta_market.question = meta_data.question;
    meta_market.description = meta_data.description;
    meta_market.prediction_type = meta_data.prediction_type;
    meta_market.media_analysis = meta_data.media_analysis;
    meta_market.created_at = Clock::get()?.unix_timestamp;
    meta_market.resolution_date = resolution_date;
    meta_market.status = MarketStatus::Active;
    
    // Add meta market to parent market's list
    let parent_market_account = &mut ctx.accounts.parent_market_account;
    parent_market_account.meta_markets.push(meta_market.key());
    
    msg!(
        "Meta-prediction market created: {} (Type: {:?}, Parent: {})",
        meta_data.question,
        meta_data.prediction_type,
        parent_market
    );
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid parent market")]
    InvalidParentMarket,
    #[msg("Insufficient reputation to create meta-prediction")]
    InsufficientReputation,
    #[msg("Question must be between 10 and 200 characters")]
    InvalidQuestionLength,
    #[msg("Description must be less than 500 characters")]
    InvalidDescriptionLength,
    #[msg("Parent market is not active")]
    ParentMarketNotActive,
    #[msg("Resolution date must be in the future")]
    InvalidResolutionDate,
}


















