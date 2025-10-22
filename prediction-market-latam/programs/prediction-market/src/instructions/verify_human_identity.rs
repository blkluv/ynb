use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(proof_data: HumanProofData)]
pub struct VerifyHumanIdentity<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        constraint = verifier.key() == proof_data.verifier @ ErrorCode::UnauthorizedVerifier
    )]
    pub verifier: Signer<'info>,
    
    pub user: SystemAccount<'info>,
}

pub fn handler(ctx: Context<VerifyHumanIdentity>, proof_data: HumanProofData) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    
    // Validate proof data
    require!(
        !proof_data.proof_id.is_empty(),
        ErrorCode::InvalidProofId
    );
    
    require!(
        proof_data.verified_at <= Clock::get()?.unix_timestamp,
        ErrorCode::InvalidVerificationTime
    );
    
    // Check if verification has expired
    if let Some(expires_at) = proof_data.expires_at {
        require!(
            expires_at > Clock::get()?.unix_timestamp,
            ErrorCode::VerificationExpired
        );
    }
    
    // Verify proof type and set appropriate reputation bonus
    match proof_data.proof_type {
        HumanProofType::ProofOfHumanity => {
            // PoH verification - highest reputation boost
            user_profile.reputation_score = user_profile.reputation_score.saturating_add(100);
        },
        HumanProofType::BrightID => {
            // BrightID verification - moderate reputation boost
            user_profile.reputation_score = user_profile.reputation_score.saturating_add(75);
        },
        HumanProofType::GitcoinPassport => {
            // Gitcoin Passport - lower reputation boost but still valuable
            user_profile.reputation_score = user_profile.reputation_score.saturating_add(50);
        },
    }
    
    // Update user profile
    user_profile.human_verified = true;
    user_profile.human_proof = Some(proof_data.clone());
    user_profile.last_activity = Clock::get()?.unix_timestamp;
    
    // Add verification badge
    if !user_profile.badges.contains(&Badge::EarlyAdopter) {
        user_profile.badges.push(Badge::EarlyAdopter);
    }
    
    msg!(
        "Human identity verified: {} via {}",
        ctx.accounts.user.key(),
        match proof_data.proof_type {
            HumanProofType::ProofOfHumanity => "Proof of Humanity",
            HumanProofType::BrightID => "BrightID",
            HumanProofType::GitcoinPassport => "Gitcoin Passport",
        }
    );
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized verifier for this proof type")]
    UnauthorizedVerifier,
    #[msg("Invalid proof ID")]
    InvalidProofId,
    #[msg("Invalid verification timestamp")]
    InvalidVerificationTime,
    #[msg("Verification has expired")]
    VerificationExpired,
}







































