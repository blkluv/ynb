use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(reason: String)]
pub struct EmergencyPauseMarket<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        mut,
        seeds = [b"multisig_governance"],
        bump,
        constraint = multisig_governance.emergency_pause_authority @ ErrorCode::UnauthorizedEmergencyAction
    )]
    pub multisig_governance: Account<'info, MultisigGovernance>,
    
    #[account(
        init,
        payer = signer,
        space = 8 + EmergencyAction::LEN,
        seeds = [b"emergency_action", market.key().as_ref(), signer.key().as_ref()],
        bump
    )]
    pub emergency_action: Account<'info, EmergencyAction>,
    
    #[account(
        constraint = multisig_governance.signers.contains(&signer.key()) @ ErrorCode::UnauthorizedSigner
    )]
    pub signer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

impl EmergencyAction {
    pub const LEN: usize = 8 + 32 * 2 + 1 + 4 + 200 + 32 + 8 + 32 * 9 + 1; // Approximate size
}

pub fn handler(ctx: Context<EmergencyPauseMarket>, reason: String) -> Result<()> {
    let emergency_action = &mut ctx.accounts.emergency_action;
    let market = &mut ctx.accounts.market;
    let multisig_governance = &ctx.accounts.multisig_governance;
    
    // Validate reason
    require!(
        reason.len() > 10 && reason.len() <= 200,
        ErrorCode::InvalidReasonLength
    );
    
    // Check if market is already paused
    require!(
        market.status != MarketStatus::Paused,
        ErrorCode::MarketAlreadyPaused
    );
    
    // Initialize emergency action
    emergency_action.market = ctx.accounts.market.key();
    emergency_action.action_type = EmergencyActionType::PauseMarket;
    emergency_action.reason = reason.clone();
    emergency_action.initiator = ctx.accounts.signer.key();
    emergency_action.created_at = Clock::get()?.unix_timestamp;
    emergency_action.signatures = vec![ctx.accounts.signer.key()];
    emergency_action.executed = false;
    
    // Check if we have enough signatures to execute
    let required_signatures = multisig_governance.threshold;
    let current_signatures = emergency_action.signatures.len();
    
    if current_signatures >= required_signatures as usize {
        // Execute the emergency pause
        market.status = MarketStatus::Paused;
        emergency_action.executed = true;
        
        // Add moderation flag
        let moderation_flag = ModerationFlag {
            flag_type: ModerationType::Legal,
            reason: format!("Emergency pause: {}", reason),
            flagged_by: ctx.accounts.signer.key(),
            flagged_at: Clock::get()?.unix_timestamp,
            resolved: false,
            resolution: None,
        };
        
        market.moderation_flags.push(moderation_flag);
        
        msg!(
            "Emergency pause executed on market: {} (Reason: {})",
            market.question,
            reason
        );
    } else {
        msg!(
            "Emergency action initiated: {}/{} signatures required",
            current_signatures,
            required_signatures
        );
    }
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Unauthorized to perform emergency actions")]
    UnauthorizedEmergencyAction,
    #[msg("Signer not authorized for multisig")]
    UnauthorizedSigner,
    #[msg("Reason must be between 10 and 200 characters")]
    InvalidReasonLength,
    #[msg("Market is already paused")]
    MarketAlreadyPaused,
}







































