use anchor_lang::prelude::*;
use crate::state::*;

pub fn calculate_market_probability(market: &PredictionMarket) -> Result<f64> {
    if market.total_pool == 0 {
        return Ok(0.5); // Default 50/50 if no liquidity
    }
    
    let yes_probability = market.yes_pool as f64 / market.total_pool as f64;
    Ok(yes_probability)
}

pub fn calculate_payout(amount: u64, outcome: &Outcome, market: &PredictionMarket) -> Result<u64> {
    let total_pool = market.total_pool;
    let winning_pool = match outcome {
        Outcome::Yes => market.yes_pool,
        Outcome::No => market.no_pool,
        _ => return Err(ErrorCode::InvalidInputParameters.into()),
    };
    
    if winning_pool == 0 {
        return Ok(0);
    }
    
    // Calculate proportional payout
    let payout = (amount * total_pool) / winning_pool;
    Ok(payout)
}

pub fn is_market_eligible_for_resolution(market: &PredictionMarket) -> Result<bool> {
    let current_time = Clock::get()?.unix_timestamp;
    
    // Check if resolution date has passed
    if current_time < market.resolution_date {
        return Ok(false);
    }
    
    // Check if market has sufficient evidence
    let requirements = &market.evidence_requirements;
    if requirements.oracle_required && market.oracle_integration.is_none() {
        return Ok(false);
    }
    
    // Check if market is not paused or blacklisted
    if market.status == MarketStatus::Paused || market.status == MarketStatus::Blacklisted {
        return Ok(false);
    }
    
    Ok(true)
}

pub fn validate_human_proof(proof: &HumanProofData) -> Result<bool> {
    // Check if proof has expired
    if let Some(expires_at) = proof.expires_at {
        if Clock::get()?.unix_timestamp > expires_at {
            return Ok(false);
        }
    }
    
    // Validate proof ID format based on type
    match proof.proof_type {
        HumanProofType::ProofOfHumanity => {
            // PoH registrations are Ethereum addresses
            if proof.proof_id.len() != 42 || !proof.proof_id.starts_with("0x") {
                return Ok(false);
            }
        },
        HumanProofType::BrightID => {
            // BrightID uses base58 encoding
            if proof.proof_id.len() < 20 {
                return Ok(false);
            }
        },
        HumanProofType::GitcoinPassport => {
            // Gitcoin Passport uses numeric IDs
            if proof.proof_id.parse::<u64>().is_err() {
                return Ok(false);
            }
        },
    }
    
    Ok(true)
}

pub fn calculate_quadratic_voting_weight(reputation: u32) -> u64 {
    // Quadratic voting: weight = sqrt(reputation)
    let weight = (reputation as f64).sqrt() as u64;
    weight
}

pub fn is_dangerous_content(text: &str) -> bool {
    let dangerous_patterns = [
        // Violence-related
        "kill", "murder", "death", "suicide", "violence", "harm",
        "attack", "bomb", "terrorism", "assassination",
        
        // Legal issues
        "illegal", "criminal", "fraud", "scam", "money laundering",
        
        // Personal information
        "personal information", "private data", "identity theft",
        
        // Market manipulation
        "pump and dump", "market manipulation", "insider trading",
        
        // Hate speech indicators
        "hate speech", "discrimination", "racism", "sexism",
    ];
    
    let text_lower = text.to_lowercase();
    dangerous_patterns.iter().any(|pattern| text_lower.contains(pattern))
}

pub fn calculate_evidence_credibility_score(evidence: &Evidence) -> u8 {
    let mut score = evidence.evidence_data.credibility_score;
    
    // Adjust based on votes
    if !evidence.votes.is_empty() {
        let avg_vote_score = evidence.votes.iter()
            .map(|vote| vote.credibility_score)
            .sum::<i8>() as f64 / evidence.votes.len() as f64;
        
        score = ((score as f64 + avg_vote_score) / 2.0) as u8;
    }
    
    // Bonus for verified evidence
    if evidence.verified {
        score = score.saturating_add(10);
    }
    
    score.min(100) // Cap at 100
}

pub fn should_trigger_emergency_pause(market: &PredictionMarket) -> bool {
    // Check for multiple legal flags
    let legal_flags = market.moderation_flags.iter()
        .filter(|flag| flag.flag_type == ModerationType::Legal && !flag.resolved)
        .count();
    
    if legal_flags >= 3 {
        return true;
    }
    
    // Check for dangerous content
    if is_dangerous_content(&market.question) || is_dangerous_content(&market.description) {
        return true;
    }
    
    // Check for suspicious activity patterns
    if market.total_participants > 1000 && market.total_pool > 1_000_000_000 { // 1000 SOL
        // Large market with many participants - additional scrutiny
        let community_flags = market.moderation_flags.iter()
            .filter(|flag| flag.flag_type == ModerationType::Community && !flag.resolved)
            .count();
        
        if community_flags >= 5 {
            return true;
        }
    }
    
    false
}
























