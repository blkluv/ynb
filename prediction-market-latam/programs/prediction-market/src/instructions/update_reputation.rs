use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(accuracy_score: u8)]
pub struct UpdateReputation<'info> {
    #[account(
        mut,
        seeds = [b"user_profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    
    #[account(
        constraint = updater.key() == user_profile.user @ ErrorCode::UnauthorizedAccess
    )]
    pub updater: Signer<'info>,
    
    pub user: SystemAccount<'info>,
}

pub fn handler(ctx: Context<UpdateReputation>, accuracy_score: u8) -> Result<()> {
    let user_profile = &mut ctx.accounts.user_profile;
    
    // Validate accuracy score
    require!(
        accuracy_score <= 100,
        ErrorCode::InvalidAccuracyScore
    );
    
    // Update reputation based on accuracy
    let reputation_change = match accuracy_score {
        90..=100 => 25,  // Excellent accuracy
        80..=89 => 15,   // Good accuracy
        70..=79 => 5,    // Average accuracy
        60..=69 => 0,    // Below average
        _ => -10,        // Poor accuracy - reputation penalty
    };
    
    if reputation_change > 0 {
        user_profile.reputation_score = user_profile.reputation_score.saturating_add(reputation_change);
    } else {
        user_profile.reputation_score = user_profile.reputation_score.saturating_sub(-reputation_change);
    }
    
    // Update accuracy statistics
    user_profile.correct_predictions += if accuracy_score >= 70 { 1 } else { 0 };
    
    // Recalculate accuracy rate
    if user_profile.total_predictions > 0 {
        user_profile.accuracy_rate = ((user_profile.correct_predictions as f64 / user_profile.total_predictions as f64) * 100.0) as u8;
    }
    
    // Award badges based on performance
    if user_profile.accuracy_rate >= 85 && !user_profile.badges.contains(&Badge::HighAccuracy) {
        user_profile.badges.push(Badge::HighAccuracy);
    }
    
    user_profile.last_activity = Clock::get()?.unix_timestamp;
    
    msg!(
        "Reputation updated: {} (Score: {}, New Reputation: {})",
        ctx.accounts.user.key(),
        accuracy_score,
        user_profile.reputation_score
    );
    
    Ok(())
}







































