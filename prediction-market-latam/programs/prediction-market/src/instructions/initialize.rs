use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + MultisigGovernance::LEN,
        seeds = [b"multisig_governance"],
        bump
    )]
    pub multisig_governance: Account<'info, MultisigGovernance>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

impl MultisigGovernance {
    pub const LEN: usize = 8 + 32 + 32 * 9 + 1 + 200 + 1 + 8; // Approximate size
}

pub fn handler(ctx: Context<Initialize>) -> Result<()> {
    let multisig_governance = &mut ctx.accounts.multisig_governance;
    
    // Initialize trusted entities (EFF, ACLU, etc.)
    let trusted_entities = vec![
        TrustedEntity {
            pubkey: Pubkey::default(), // Will be set to actual EFF key
            name: "Electronic Frontier Foundation".to_string(),
            organization: "EFF".to_string(),
            verified: true,
        },
        TrustedEntity {
            pubkey: Pubkey::default(), // Will be set to actual ACLU key
            name: "American Civil Liberties Union".to_string(),
            organization: "ACLU".to_string(),
            verified: true,
        },
        // Add more trusted entities as needed
    ];
    
    multisig_governance.authority = ctx.accounts.authority.key();
    multisig_governance.signers = vec![ctx.accounts.authority.key()]; // Initial signer
    multisig_governance.threshold = 5; // 5/9 multisig
    multisig_governance.trusted_entities = trusted_entities;
    multisig_governance.emergency_pause_authority = true;
    multisig_governance.created_at = Clock::get()?.unix_timestamp;
    
    msg!("Multisig governance initialized with trusted entities");
    
    Ok(())
}

