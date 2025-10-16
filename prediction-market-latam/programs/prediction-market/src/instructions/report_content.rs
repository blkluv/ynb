use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(report_type: ModerationType, reason: String)]
pub struct ReportContent<'info> {
    #[account(
        constraint = market.key() == market_account.key() @ ErrorCode::InvalidMarket
    )]
    pub market_account: Account<'info, PredictionMarket>,
    
    #[account(
        init,
        payer = reporter,
        space = 8 + ContentReport::LEN,
        seeds = [b"content_report", market.key().as_ref(), reporter.key().as_ref()],
        bump
    )]
    pub content_report: Account<'info, ContentReport>,
    
    #[account(
        mut,
        constraint = user_profile.reputation_score >= 25 @ ErrorCode::InsufficientReputation
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(mut)]
    pub reporter: Signer<'info>,
    
    pub market: SystemAccount<'info>,
    
    pub system_program: Program<'info, System>,
}

impl ContentReport {
    pub const LEN: usize = 8 + 32 * 2 + 32 + 1 + 4 + 200 + 8 + 1 + 100; // Approximate size
}

pub fn handler(
    ctx: Context<ReportContent>, 
    report_type: ModerationType, 
    reason: String
) -> Result<()> {
    let content_report = &mut ctx.accounts.content_report;
    let market_account = &mut ctx.accounts.market_account;
    
    // Validate reason
    require!(
        reason.len() > 10 && reason.len() <= 200,
        ErrorCode::InvalidReasonLength
    );
    
    // Initialize content report
    content_report.reporter = ctx.accounts.reporter.key();
    content_report.market = ctx.accounts.market.key();
    content_report.report_type = report_type.clone();
    content_report.reason = reason.clone();
    content_report.created_at = Clock::get()?.unix_timestamp;
    content_report.status = ReportStatus::Pending;
    content_report.moderation_result = None;
    
    // Add moderation flag to market
    let moderation_flag = ModerationFlag {
        flag_type: report_type,
        reason: reason.clone(),
        flagged_by: ctx.accounts.reporter.key(),
        flagged_at: Clock::get()?.unix_timestamp,
        resolved: false,
        resolution: None,
    };
    
    market_account.moderation_flags.push(moderation_flag);
    
    // Apply automatic moderation based on report type
    match report_type {
        ModerationType::Automatic => {
            // AI-based filtering - check for dangerous keywords
            if contains_dangerous_keywords(&market_account.question) || 
               contains_dangerous_keywords(&market_account.description) {
                market_account.status = MarketStatus::Paused;
                msg!("Market automatically paused due to dangerous content");
            }
        },
        ModerationType::Community => {
            // Community-based moderation - requires DAO vote
            msg!("Community moderation report submitted - awaiting DAO vote");
        },
        ModerationType::Legal => {
            // Legal-based moderation - immediate pause pending review
            market_account.status = MarketStatus::Paused;
            msg!("Market paused due to legal concerns - pending review");
        },
    }
    
    msg!(
        "Content report submitted: {} (Type: {:?}, Market: {})",
        reason,
        report_type,
        ctx.accounts.market.key()
    );
    
    Ok(())
}

fn contains_dangerous_keywords(text: &str) -> bool {
    let dangerous_keywords = [
        "death", "kill", "murder", "suicide", "violence", "harm",
        "threat", "danger", "illegal", "criminal", "terrorism"
    ];
    
    let text_lower = text.to_lowercase();
    dangerous_keywords.iter().any(|keyword| text_lower.contains(keyword))
}

#[error_code]
pub enum ErrorCode {
    #[msg("Invalid market")]
    InvalidMarket,
    #[msg("Insufficient reputation to report content")]
    InsufficientReputation,
    #[msg("Reason must be between 10 and 200 characters")]
    InvalidReasonLength,
}













