use anchor_lang::prelude::*;

#[error_code]
pub enum ErrorCode {
    // Market Creation Errors
    #[msg("Insufficient reputation to create market")]
    InsufficientReputation,
    #[msg("Question must be between 10 and 200 characters")]
    InvalidQuestionLength,
    #[msg("Description must be less than 500 characters")]
    InvalidDescriptionLength,
    #[msg("Resolution date must be in the future")]
    InvalidResolutionDate,
    
    // Market Status Errors
    #[msg("Market is not in active status")]
    MarketNotActive,
    #[msg("Market is already paused")]
    MarketAlreadyPaused,
    #[msg("Market has already been resolved")]
    MarketAlreadyResolved,
    
    // Oracle Errors
    #[msg("Oracle confidence below threshold")]
    InsufficientOracleConfidence,
    #[msg("Oracle data is invalid or corrupted")]
    InvalidOracleData,
    
    // Human Verification Errors
    #[msg("Unauthorized verifier for this proof type")]
    UnauthorizedVerifier,
    #[msg("Invalid proof ID")]
    InvalidProofId,
    #[msg("Invalid verification timestamp")]
    InvalidVerificationTime,
    #[msg("Verification has expired")]
    VerificationExpired,
    #[msg("Human verification required for this market")]
    HumanVerificationRequired,
    
    // Eligibility Voting Errors
    #[msg("Insufficient reputation to vote on market eligibility")]
    InsufficientReputationForVoting,
    #[msg("Already voted on this market's eligibility")]
    AlreadyVotedOnEligibility,
    
    // Meta Prediction Errors
    #[msg("Invalid parent market")]
    InvalidParentMarket,
    #[msg("Parent market is not active")]
    ParentMarketNotActive,
    #[msg("Insufficient reputation to create meta-prediction")]
    InsufficientReputationForMetaPrediction,
    
    // Moderation Errors
    #[msg("Invalid market for reporting")]
    InvalidMarket,
    #[msg("Insufficient reputation to report content")]
    InsufficientReputationForReporting,
    #[msg("Reason must be between 10 and 200 characters")]
    InvalidReasonLength,
    #[msg("Content already reported")]
    ContentAlreadyReported,
    
    // Emergency Action Errors
    #[msg("Unauthorized to perform emergency actions")]
    UnauthorizedEmergencyAction,
    #[msg("Signer not authorized for multisig")]
    UnauthorizedSigner,
    #[msg("Insufficient signatures for emergency action")]
    InsufficientSignatures,
    
    // Evidence Errors
    #[msg("Evidence requirements not met")]
    EvidenceRequirementsNotMet,
    #[msg("Invalid evidence type")]
    InvalidEvidenceType,
    #[msg("Evidence already submitted")]
    EvidenceAlreadySubmitted,
    
    // Prediction Errors
    #[msg("Insufficient funds for prediction")]
    InsufficientFunds,
    #[msg("Prediction amount too small")]
    PredictionAmountTooSmall,
    #[msg("Market resolution date has passed")]
    MarketResolutionDatePassed,
    
    // Reputation Errors
    #[msg("Reputation update failed")]
    ReputationUpdateFailed,
    #[msg("Invalid accuracy score")]
    InvalidAccuracyScore,
    
    // General Errors
    #[msg("Invalid account")]
    InvalidAccount,
    #[msg("Account not initialized")]
    AccountNotInitialized,
    #[msg("Unauthorized access")]
    UnauthorizedAccess,
    #[msg("Invalid input parameters")]
    InvalidInputParameters,
    
    // Trading Errors
    #[msg("Market is not resolved")]
    MarketNotResolved,
    #[msg("Position is not winning")]
    PositionNotWinning,
    #[msg("Math operation overflow")]
    MathOverflow,
    #[msg("Invalid amount")]
    InvalidAmount,
    #[msg("Insufficient liquidity")]
    InsufficientLiquidity,
    #[msg("Slippage tolerance exceeded")]
    SlippageExceeded,
    #[msg("Imbalanced liquidity provision")]
    ImbalancedLiquidity,
}











