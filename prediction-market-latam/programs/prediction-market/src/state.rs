use anchor_lang::prelude::*;
use anchor_spl::token::TokenAccount;
use std::collections::BTreeMap;

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum MarketStatus {
    Active,
    Paused,
    Resolved,
    Disputed,
    Blacklisted,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum Outcome {
    Yes,
    No,
    Other(u8), // For multi-outcome markets
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum EvidenceType {
    Scientific,
    Governmental,
    Media,
    Community,
    ChainlinkOracle,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum ModerationType {
    Automatic,   // AI-filtered
    Community,   // DAO-voted
    Legal,       // Legal entity flagged
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum HumanProofType {
    ProofOfHumanity,
    BrightID,
    GitcoinPassport,
}

#[account]
pub struct PredictionMarket {
    pub authority: Pubkey,
    pub creator: Pubkey,
    pub status: MarketStatus,
    pub created_at: i64,
    pub resolution_date: i64,
    pub question: String,
    pub description: String,
    pub category: String,
    pub evidence_requirements: EvidenceRequirements,
    pub total_pool: u64,
    pub yes_pool: u64,
    pub no_pool: u64,
    pub total_participants: u32,
    pub resolution_data: Option<ResolutionData>,
    pub moderation_flags: Vec<ModerationFlag>,
    pub reputation_threshold: u8, // Minimum reputation to participate
    pub human_verified_required: bool,
    pub oracle_integration: Option<OracleIntegration>,
    pub meta_markets: Vec<Pubkey>, // Related meta-prediction markets
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct EvidenceRequirements {
    pub min_evidence_count: u8,
    pub required_types: Vec<EvidenceType>,
    pub oracle_required: bool,
    pub scientific_peer_review: bool,
    pub government_source_required: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct EvidenceData {
    pub evidence_type: EvidenceType,
    pub source_url: String,
    pub description: String,
    pub credibility_score: u8,
    pub verified: bool,
    pub submitted_at: i64,
    pub verifier: Option<Pubkey>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct ResolutionData {
    pub outcome: Outcome,
    pub resolved_at: i64,
    pub oracle_data: Option<OracleData>,
    pub evidence_used: Vec<Pubkey>,
    pub resolution_method: ResolutionMethod,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum ResolutionMethod {
    Oracle,
    CommunityVote,
    ExpertPanel,
    TimeBased,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct OracleData {
    pub oracle_provider: String, // "chainlink", "switchboard", etc.
    pub data_source: String,
    pub value: String,
    pub confidence: u8,
    pub timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct OracleIntegration {
    pub provider: String,
    pub feed_address: Pubkey,
    pub update_frequency: u64, // seconds
    pub threshold_confidence: u8,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct ModerationFlag {
    pub flag_type: ModerationType,
    pub reason: String,
    pub flagged_by: Pubkey,
    pub flagged_at: i64,
    pub resolved: bool,
    pub resolution: Option<String>,
}

#[account]
pub struct Evidence {
    pub market: Pubkey,
    pub submitter: Pubkey,
    pub evidence_data: EvidenceData,
    pub votes: Vec<EvidenceVote>,
    pub total_score: i64,
    pub verified: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct EvidenceVote {
    pub voter: Pubkey,
    pub credibility_score: i8, // -10 to +10
    pub reason: String,
    pub voted_at: i64,
}

#[account]
pub struct UserProfile {
    pub user: Pubkey,
    pub reputation_score: u32,
    pub total_predictions: u32,
    pub correct_predictions: u32,
    pub accuracy_rate: u8, // percentage
    pub human_verified: bool,
    pub human_proof: Option<HumanProofData>,
    pub created_at: i64,
    pub last_activity: i64,
    pub badges: Vec<Badge>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct HumanProofData {
    pub proof_type: HumanProofType,
    pub proof_id: String,
    pub verified_at: i64,
    pub verifier: Pubkey,
    pub expires_at: Option<i64>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum Badge {
    HighAccuracy,
    EarlyAdopter,
    EvidenceContributor,
    CommunityModerator,
    OracleValidator,
}

#[account]
pub struct EligibilityVote {
    pub market: Pubkey,
    pub voter: Pubkey,
    pub vote: bool,
    pub reason: String,
    pub voted_at: i64,
    pub reputation_weight: u32,
}

#[account]
pub struct EligibilityRegistry {
    pub market: Pubkey,
    pub total_votes: u32,
    pub yes_votes: u32,
    pub no_votes: u32,
    pub weighted_yes: u64,
    pub weighted_no: u64,
    pub threshold: u8, // percentage required for eligibility
    pub eligible: bool,
    pub created_at: i64,
    pub updated_at: i64,
}

#[account]
pub struct MetaPredictionMarket {
    pub parent_market: Pubkey,
    pub creator: Pubkey,
    pub question: String,
    pub description: String,
    pub prediction_type: MetaPredictionType,
    pub media_analysis: Option<MediaAnalysisData>,
    pub created_at: i64,
    pub resolution_date: i64,
    pub status: MarketStatus,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum MetaPredictionType {
    MediaAccuracy,     // Will media report X accurately?
    PublicReaction,    // How will public react to X?
    MarketInfluence,   // Will X influence the parent market?
    ExpertOpinion,     // What do experts think about X?
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct MediaAnalysisData {
    pub sentiment_score: i8, // -10 to +10
    pub bias_detection: Vec<String>,
    pub source_credibility: u8,
    pub fact_check_results: Vec<FactCheckResult>,
    pub analysis_timestamp: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct FactCheckResult {
    pub claim: String,
    pub verdict: FactCheckVerdict,
    pub confidence: u8,
    pub sources: Vec<String>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum FactCheckVerdict {
    True,
    False,
    Misleading,
    Unverified,
}

#[account]
pub struct MultisigGovernance {
    pub authority: Pubkey,
    pub signers: Vec<Pubkey>,
    pub threshold: u8,
    pub trusted_entities: Vec<TrustedEntity>,
    pub emergency_pause_authority: bool,
    pub created_at: i64,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct TrustedEntity {
    pub pubkey: Pubkey,
    pub name: String,
    pub organization: String, // "EFF", "ACLU", etc.
    pub verified: bool,
}

#[account]
pub struct EmergencyAction {
    pub market: Pubkey,
    pub action_type: EmergencyActionType,
    pub reason: String,
    pub initiator: Pubkey,
    pub created_at: i64,
    pub signatures: Vec<Pubkey>,
    pub executed: bool,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum EmergencyActionType {
    PauseMarket,
    BlacklistMarket,
    FreezeFunds,
    ForceResolution,
}

#[account]
pub struct ContentReport {
    pub reporter: Pubkey,
    pub market: Pubkey,
    pub report_type: ModerationType,
    pub reason: String,
    pub created_at: i64,
    pub status: ReportStatus,
    pub moderation_result: Option<ModerationResult>,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum ReportStatus {
    Pending,
    UnderReview,
    Resolved,
    Dismissed,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct ModerationResult {
    pub action_taken: ModerationAction,
    pub moderator: Pubkey,
    pub resolved_at: i64,
    pub explanation: String,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub enum ModerationAction {
    NoAction,
    Warning,
    ContentFlag,
    MarketPause,
    MarketRemoval,
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Debug, PartialEq)]
pub struct MarketData {
    pub question: String,
    pub description: String,
    pub category: String,
    pub resolution_date: i64,
    pub initial_liquidity: u64,
}

const DISCRIMINATOR_LENGTH: usize = 8;
const PUBKEY_LENGTH: usize = 32;
const STRING_LENGTH_PREFIX: usize = 4;
const BOOL_LENGTH: usize = 1;
const U8_LENGTH: usize = 1;
const U32_LENGTH: usize = 4;
const U64_LENGTH: usize = 8;
const I64_LENGTH: usize = 8;
const ENUM_LENGTH: usize = 1;

impl PredictionMarket {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBKEY_LENGTH * 2 // authority + creator
        + ENUM_LENGTH // status
        + I64_LENGTH * 2 // created_at + resolution_date
        + STRING_LENGTH_PREFIX + 200 // question
        + STRING_LENGTH_PREFIX + 500 // description
        + STRING_LENGTH_PREFIX + 50 // category
        + 50 // evidence_requirements
        + U64_LENGTH * 3 // pools
        + U32_LENGTH * 2 // participants + flags
        + 100 // resolution_data
        + 200 // moderation_flags
        + U8_LENGTH * 2 // reputation_threshold + human_verified_required
        + 100 // oracle_integration
        + 100; // meta_markets
}

impl UserProfile {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBKEY_LENGTH // user
        + U32_LENGTH * 3 // reputation + predictions
        + U8_LENGTH * 2 // accuracy + verified
        + 100 // human_proof
        + I64_LENGTH * 2 // timestamps
        + 50; // badges
}

#[account]
pub struct UserPosition {
    pub user: Pubkey,
    pub market: Pubkey,
    pub outcome: Outcome,
    pub amount: u64,
    pub entry_price: u64, // Price at purchase (in basis points)
    pub created_at: i64,
    pub last_update: i64,
}

impl UserPosition {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBKEY_LENGTH * 2 // user + market
        + ENUM_LENGTH // outcome
        + U64_LENGTH * 2 // amount + entry_price
        + I64_LENGTH * 2; // timestamps
}

#[account]
pub struct LiquidityPosition {
    pub provider: Pubkey,
    pub market: Pubkey,
    pub lp_tokens: u64,
    pub amount_yes: u64,
    pub amount_no: u64,
    pub created_at: i64,
    pub last_update: i64,
    pub fees_earned: u64,
}

impl LiquidityPosition {
    pub const LEN: usize = DISCRIMINATOR_LENGTH
        + PUBKEY_LENGTH * 2 // provider + market
        + U64_LENGTH * 4 // lp_tokens + amounts + fees
        + I64_LENGTH * 2; // timestamps
}

