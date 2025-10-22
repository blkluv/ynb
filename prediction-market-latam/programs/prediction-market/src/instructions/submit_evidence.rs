use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(evidence_data: EvidenceData)]
pub struct SubmitEvidence<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        init,
        payer = submitter,
        space = 8 + Evidence::LEN,
        seeds = [b"evidence", market.key().as_ref(), submitter.key().as_ref()],
        bump
    )]
    pub evidence: Account<'info, Evidence>,
    
    #[account(
        mut,
        constraint = user_profile.reputation_score >= 50 @ ErrorCode::InsufficientReputation
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub submitter: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

impl Evidence {
    pub const LEN: usize = 8 + 32 * 2 + 200 + 100 + 8 + 1; // Approximate size
}

pub fn handler(ctx: Context<SubmitEvidence>, evidence_data: EvidenceData) -> Result<()> {
    let evidence = &mut ctx.accounts.evidence;
    let market = &ctx.accounts.market;
    
    // Validate evidence data
    require!(
        !evidence_data.source_url.is_empty(),
        ErrorCode::InvalidInputParameters
    );
    
    require!(
        evidence_data.description.len() > 10 && evidence_data.description.len() <= 500,
        ErrorCode::InvalidInputParameters
    );
    
    require!(
        evidence_data.credibility_score <= 100,
        ErrorCode::InvalidInputParameters
    );
    
    // Check if evidence type is required for this market
    let requirements = &market.evidence_requirements;
    require!(
        requirements.required_types.contains(&evidence_data.evidence_type),
        ErrorCode::EvidenceRequirementsNotMet
    );
    
    // Initialize evidence
    evidence.market = ctx.accounts.market.key();
    evidence.submitter = ctx.accounts.submitter.key();
    evidence.evidence_data = evidence_data;
    evidence.votes = vec![];
    evidence.total_score = 0;
    evidence.verified = false;
    
    msg!(
        "Evidence submitted: {} (Type: {:?}, Market: {})",
        evidence.evidence_data.description,
        evidence.evidence_data.evidence_type,
        ctx.accounts.market.key()
    );
    
    Ok(())
}







































