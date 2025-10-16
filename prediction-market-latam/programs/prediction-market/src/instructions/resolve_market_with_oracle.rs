use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
#[instruction(oracle_data: OracleData)]
pub struct ResolveMarketWithOracle<'info> {
    #[account(
        mut,
        seeds = [b"market", market.key().as_ref()],
        bump,
        constraint = market.status == MarketStatus::Active @ ErrorCode::MarketNotActive
    )]
    pub market: Account<'info, PredictionMarket>,
    
    #[account(
        constraint = oracle_data.confidence >= market.oracle_integration.as_ref().unwrap().threshold_confidence @ ErrorCode::InsufficientOracleConfidence
    )]
    pub oracle_authority: Signer<'info>,
}

pub fn handler(ctx: Context<ResolveMarketWithOracle>, oracle_data: OracleData) -> Result<()> {
    let market = &mut ctx.accounts.market;
    
    // Verify oracle data meets requirements
    require!(
        oracle_data.confidence >= 80,
        ErrorCode::InsufficientOracleConfidence
    );
    
    // Determine outcome based on oracle data
    let outcome = match oracle_data.value.parse::<f64>() {
        Ok(value) => {
            if value > 0.5 {
                Outcome::Yes
            } else {
                Outcome::No
            }
        },
        Err(_) => {
            // For non-numeric data, use string comparison
            if oracle_data.value.to_lowercase().contains("yes") || 
               oracle_data.value.to_lowercase().contains("true") {
                Outcome::Yes
            } else {
                Outcome::No
            }
        }
    };
    
    // Create resolution data
    let resolution_data = ResolutionData {
        outcome,
        resolved_at: Clock::get()?.unix_timestamp,
        oracle_data: Some(oracle_data.clone()),
        evidence_used: vec![],
        resolution_method: ResolutionMethod::Oracle,
    };
    
    // Update market
    market.status = MarketStatus::Resolved;
    market.resolution_data = Some(resolution_data);
    
    msg!(
        "Market resolved via oracle: {} (confidence: {}%)",
        match outcome {
            Outcome::Yes => "YES",
            Outcome::No => "NO",
            _ => "OTHER"
        },
        oracle_data.confidence
    );
    
    Ok(())
}

#[error_code]
pub enum ErrorCode {
    #[msg("Market is not in active status")]
    MarketNotActive,
    #[msg("Oracle confidence below threshold")]
    InsufficientOracleConfidence,
}













