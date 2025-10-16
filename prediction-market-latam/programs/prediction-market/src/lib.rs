use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

pub mod error;
pub mod instructions;
pub mod state;
pub mod utils;

use instructions::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod prediction_market {
    use super::*;

    /// Initialize the prediction market program
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        instructions::initialize::handler(ctx)
    }

    /// Create a new prediction market
    pub fn create_market(
        ctx: Context<CreateMarket>,
        market_data: MarketData,
        evidence_requirements: EvidenceRequirements,
    ) -> Result<()> {
        instructions::create_market::handler(ctx, market_data, evidence_requirements)
    }

    /// Submit evidence for a market
    pub fn submit_evidence(
        ctx: Context<SubmitEvidence>,
        evidence_data: EvidenceData,
    ) -> Result<()> {
        instructions::submit_evidence::handler(ctx, evidence_data)
    }

    /// Place a prediction
    pub fn place_prediction(
        ctx: Context<PlacePrediction>,
        amount: u64,
        outcome: Outcome,
    ) -> Result<()> {
        instructions::place_prediction::handler(ctx, amount, outcome)
    }

    /// Vote on market eligibility (DAO governance)
    pub fn vote_on_eligibility(
        ctx: Context<VoteOnEligibility>,
        vote: bool,
        reason: String,
    ) -> Result<()> {
        instructions::vote_on_eligibility::handler(ctx, vote, reason)
    }

    /// Report content for moderation
    pub fn report_content(
        ctx: Context<ReportContent>,
        report_type: ModerationType,
        reason: String,
    ) -> Result<()> {
        instructions::report_content::handler(ctx, report_type, reason)
    }

    /// Emergency pause market (Multisig only)
    pub fn emergency_pause_market(
        ctx: Context<EmergencyPauseMarket>,
        reason: String,
    ) -> Result<()> {
        instructions::emergency_pause_market::handler(ctx, reason)
    }

    /// Verify human identity (Proof of Humanity integration)
    pub fn verify_human_identity(
        ctx: Context<VerifyHumanIdentity>,
        proof_data: HumanProofData,
    ) -> Result<()> {
        instructions::verify_human_identity::handler(ctx, proof_data)
    }

    /// Create meta-prediction market
    pub fn create_meta_prediction(
        ctx: Context<CreateMetaPrediction>,
        parent_market: Pubkey,
        meta_data: MetaPredictionData,
    ) -> Result<()> {
        instructions::create_meta_prediction::handler(ctx, parent_market, meta_data)
    }

    /// Resolve market with oracle data
    pub fn resolve_market_with_oracle(
        ctx: Context<ResolveMarketWithOracle>,
        oracle_data: OracleData,
    ) -> Result<()> {
        instructions::resolve_market_with_oracle::handler(ctx, oracle_data)
    }

    /// Update reputation based on prediction accuracy
    pub fn update_reputation(
        ctx: Context<UpdateReputation>,
        accuracy_score: u8,
    ) -> Result<()> {
        instructions::update_reputation::handler(ctx, accuracy_score)
    }
    
    /// Claim winnings from a resolved market
    pub fn claim_winnings(ctx: Context<ClaimWinnings>) -> Result<()> {
        instructions::claim_winnings::handler(ctx)
    }
    
    /// Sell position before market resolution
    pub fn sell_position(ctx: Context<SellPosition>, amount: u64) -> Result<()> {
        instructions::sell_position::handler(ctx, amount)
    }
    
    /// Add liquidity to market pool
    pub fn add_liquidity(
        ctx: Context<AddLiquidity>,
        amount_yes: u64,
        amount_no: u64,
    ) -> Result<()> {
        instructions::add_liquidity::handler(ctx, amount_yes, amount_no)
    }
    
    /// Remove liquidity from market pool
    pub fn remove_liquidity(ctx: Context<RemoveLiquidity>, lp_tokens: u64) -> Result<()> {
        instructions::remove_liquidity::handler(ctx, lp_tokens)
    }
}

