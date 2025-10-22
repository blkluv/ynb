# PrismaFi: Decentralized Prediction Markets on Solana

## Whitepaper v1.0

**Building the Future of Decentralized Forecasting**

---

## Abstract

PrismaFi is a decentralized prediction market protocol built on Solana that enables permissionless creation and participation in forecasting markets for real-world events. By leveraging Solana's high throughput and low transaction costs, PrismaFi democratizes access to prediction markets while maintaining transparency, security, and efficiency through blockchain technology.

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Introduction](#introduction)
3. [Problem Statement](#problem-statement)
4. [Solution](#solution)
5. [Technical Architecture](#technical-architecture)
6. [Protocol Mechanics](#protocol-mechanics)
7. [Use Cases](#use-cases)
8. [Security & Auditing](#security--auditing)
9. [Roadmap](#roadmap)
10. [Conclusion](#conclusion)

---

## 1. Executive Summary

Prediction markets have proven to be powerful tools for aggregating collective intelligence and forecasting future events. However, traditional prediction markets suffer from:

- Centralized control and potential manipulation
- High fees and barriers to entry
- Geographic restrictions
- Limited transparency
- Slow settlement times

**PrismaFi addresses these challenges by:**

- Building on Solana's high-performance blockchain
- Implementing fully transparent, auditable smart contracts
- Enabling permissionless market creation
- Providing near-instant settlement
- Reducing transaction costs by 99% compared to Ethereum-based alternatives

### Key Metrics:

- **Transaction Cost:** ~$0.00025 per bet (vs $5-50 on Ethereum)
- **Settlement Time:** 400ms average confirmation
- **Market Creation:** Permissionless, anyone can create markets
- **Transparency:** All transactions verifiable on-chain

---

## 2. Introduction

### 2.1 What are Prediction Markets?

Prediction markets are exchange-traded markets where participants buy and sell contracts based on the outcome of future events. These markets have historically outperformed polls, expert opinions, and statistical models in forecasting accuracy.

### 2.2 The Power of Collective Intelligence

When individuals place their capital behind their beliefs, prediction markets create powerful incentives for accurate forecasting. The "wisdom of the crowd" phenomenon aggregates diverse information sources into a single, actionable probability.

### 2.3 Why Blockchain?

Blockchain technology provides:

- **Immutability:** Historical data cannot be altered
- **Transparency:** All bets and outcomes are publicly verifiable
- **Trustlessness:** No central authority required
- **Global Access:** Permissionless participation
- **Programmability:** Automated execution through smart contracts

### 2.4 Why Solana?

Solana offers unique advantages for prediction markets:

- **Speed:** 400ms block times enable real-time market updates
- **Cost:** Sub-cent transaction fees make micro-markets viable
- **Scalability:** 65,000 TPS theoretical capacity supports millions of users
- **Developer Experience:** Anchor framework accelerates development
- **Growing Ecosystem:** Integration with DeFi protocols and wallets

---

## 3. Problem Statement

### 3.1 Centralized Prediction Markets

Traditional platforms like PredictIt, Polymarket (pre-decentralization), and Betfair suffer from:

**Regulatory Risk:**

- Subject to geographic restrictions
- Risk of shutdown (e.g., PredictIt's 2023 challenges)
- Compliance overhead limits innovation

**Operational Limitations:**

- High fees (5-10% of profits)
- Withdrawal restrictions
- Position limits ($850 on PredictIt)
- Limited market offerings

**Trust Issues:**

- Centralized control of funds
- Opaque resolution processes
- Potential for manipulation
- Poor transparency in dispute resolution

### 3.2 Existing Blockchain Solutions

First-generation blockchain prediction markets face challenges:

**Ethereum-based platforms (Augur, Gnosis):**

- Prohibitive gas fees ($50-200 per transaction during peak times)
- Slow confirmation times (15 seconds to 5 minutes)
- Poor user experience due to network congestion
- Limited to high-value markets due to cost structure

**Scalability Issues:**

- Unable to support micro-markets or frequent trading
- High costs prevent market maker participation
- Limited to sophisticated DeFi users

### 3.3 Market Gap

There is a clear need for a prediction market platform that combines:

1. Low transaction costs of centralized platforms
2. Transparency and trustlessness of blockchain
3. Speed and responsiveness of modern applications
4. Accessibility for mainstream users

**PrismaFi fills this gap.**

---

## 4. Solution

### 4.1 Platform Overview

PrismaFi is a fully decentralized prediction market protocol consisting of:

1. **Smart Contract Layer:** Rust-based Anchor programs on Solana
2. **Frontend Interface:** Modern web application with wallet integration
3. **Oracle System:** (Roadmap) Decentralized event resolution
4. **Market Maker Tools:** (Roadmap) Automated liquidity provision

### 4.2 Core Innovations

#### 4.2.1 Zero-Knowledge Market Creation

Any user can create a prediction market without permission, censorship, or approval. Market creators define:

- Question/event description
- Resolution criteria
- End date/time
- Category

#### 4.2.2 Binary Outcome Design

Version 1.0 focuses on binary (Yes/No) markets for simplicity and clarity:

- Will Bitcoin reach $100k by Dec 31, 2025?
- Will candidate X win the election?
- Will team Y win the championship?

Future versions will support scalar and categorical outcomes.

#### 4.2.3 Transparent Resolution

All market resolutions are recorded on-chain with full audit trails. Initially resolved by trusted administrators, with a roadmap to decentralized oracle integration.

#### 4.2.4 Instant Payouts

Winners can claim their payouts immediately after market resolution through a simple on-chain transaction. No waiting periods or withdrawal restrictions.

### 4.3 User Experience

**For Traders:**

- Connect any Solana wallet (Phantom, Solflare, Backpack)
- Browse markets by category or search
- Place bets with one click
- Track portfolio performance
- View real-time market statistics

**For Market Creators:**

- Simple form-based market creation
- Instant deployment to blockchain
- Track market participation
- Earn reputation/rewards (future)

**For Developers:**

- Open-source smart contracts
- Comprehensive SDK documentation
- REST API (roadmap)
- GraphQL integration (roadmap)

---

## 5. Technical Architecture

### 5.1 System Overview

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend Layer                       │
│  (Next.js, React, TypeScript, Solana Wallet Adapter)   │
└─────────────────────┬───────────────────────────────────┘
                      │
                      │ RPC Calls
                      │
┌─────────────────────▼───────────────────────────────────┐
│                  Solana Blockchain                       │
│  ┌─────────────────────────────────────────────────┐   │
│  │         PrismaFi Smart Contract                  │   │
│  │  (Rust/Anchor - Program ID: 6b4k...LQB7)       │   │
│  │                                                   │   │
│  │  • create_market()                               │   │
│  │  • place_bet()                                   │   │
│  │  • resolve_market()                              │   │
│  │  • claim_winnings()                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │            On-Chain State                        │   │
│  │  • Market Accounts                               │   │
│  │  • User Position Accounts                        │   │
│  │  • Program Derived Addresses (PDAs)             │   │
│  └─────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### 5.2 Smart Contract Architecture

#### 5.2.1 Program Structure

**Language:** Rust  
**Framework:** Anchor 0.30.1  
**Deployed:** Solana Devnet (Production: Mainnet-Beta)  
**Program ID:** `6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7`

#### 5.2.2 Core Instructions

**1. `create_market`**

```rust
pub struct CreateMarket<'info> {
    #[account(mut)]
    pub creator: Signer<'info>,
    #[account(
        init,
        payer = creator,
        space = 8 + Market::INIT_SPACE,
        seeds = [b"market", creator.key().as_ref(), &market_id.to_le_bytes()],
        bump
    )]
    pub market: Account<'info, Market>,
    pub system_program: Program<'info, System>,
}
```

- Creates a new prediction market
- Stores question, description, category, end date
- Initializes betting pools for YES/NO outcomes
- Emits MarketCreated event

**2. `place_bet`**

```rust
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub bettor: Signer<'info>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        init_or_extend,
        payer = bettor,
        space = 8 + UserPosition::INIT_SPACE,
        seeds = [b"position", market.key().as_ref(), bettor.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,
    pub system_program: Program<'info, System>,
}
```

- Transfers SOL from bettor to market pool
- Records position in user_position account
- Updates pool statistics (total_yes_bets, total_no_bets)
- Calculates current odds
- Emits BetPlaced event

**3. `resolve_market`**

```rust
pub struct ResolveMarket<'info> {
    #[account(mut, has_one = creator)]
    pub market: Account<'info, Market>,
    pub creator: Signer<'info>,
}
```

- Marks market as resolved
- Records winning outcome (YES or NO)
- Prevents additional bets
- Enables payout claims
- Emits MarketResolved event

**4. `claim_winnings`**

```rust
pub struct ClaimWinnings<'info> {
    #[account(mut)]
    pub winner: Signer<'info>,
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(
        mut,
        seeds = [b"position", market.key().as_ref(), winner.key().as_ref()],
        bump
    )]
    pub user_position: Account<'info, UserPosition>,
}
```

- Verifies user bet on winning outcome
- Calculates proportional payout from losing pool
- Transfers winnings to user
- Marks position as claimed
- Emits WinningsClaimed event

#### 5.2.3 Account Structures

**Market Account:**

```rust
#[account]
pub struct Market {
    pub creator: Pubkey,           // Market creator's public key
    pub market_id: u64,            // Unique market identifier
    pub question: String,          // Market question (max 200 chars)
    pub description: String,       // Detailed description (max 500 chars)
    pub category: String,          // Category (max 50 chars)
    pub end_date: i64,            // Unix timestamp
    pub total_yes_bets: u64,      // Total lamports bet on YES
    pub total_no_bets: u64,       // Total lamports bet on NO
    pub is_resolved: bool,         // Resolution status
    pub winning_outcome: Option<Outcome>, // Winning side (if resolved)
    pub bump: u8,                  // PDA bump seed
}
```

**UserPosition Account:**

```rust
#[account]
pub struct UserPosition {
    pub market: Pubkey,            // Market public key
    pub bettor: Pubkey,            // Bettor's public key
    pub outcome: Outcome,          // YES or NO
    pub amount: u64,               // Bet amount in lamports
    pub claimed: bool,             // Payout claim status
    pub bump: u8,                  // PDA bump seed
}
```

**Outcome Enum:**

```rust
#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum Outcome {
    Yes,
    No,
}
```

#### 5.2.4 Security Features

**Access Control:**

- Only market creator can resolve markets
- Only winning bettors can claim payouts
- Single claim per position (claimed flag)

**Data Validation:**

- Market end date must be in the future
- Bet amounts must be positive
- No bets after end date
- No claims before resolution

**PDA Security:**

- Deterministic account derivation
- Prevents account spoofing
- Ensures unique markets and positions

**Error Handling:**

```rust
#[error_code]
pub enum ErrorCode {
    #[msg("Market has ended")]
    MarketEnded,
    #[msg("Market not yet resolved")]
    MarketNotResolved,
    #[msg("Already claimed")]
    AlreadyClaimed,
    #[msg("Not a winner")]
    NotAWinner,
    #[msg("Invalid outcome")]
    InvalidOutcome,
}
```

### 5.3 Frontend Architecture

#### 5.3.1 Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.0+
- **Styling:** TailwindCSS 3.4
- **Blockchain:** @solana/web3.js, @coral-xyz/anchor
- **Wallet:** @solana/wallet-adapter-react
- **State Management:** React Context + Hooks
- **Deployment:** Vercel Edge Network

#### 5.3.2 Key Components

**Wallet Integration:**

```typescript
// Multi-wallet support
const wallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
  new BackpackWalletAdapter(),
]
```

**Contract Interaction:**

```typescript
// Type-safe contract methods
export const createMarket = async (
  program: Program,
  wallet: WalletContextState,
  marketData: MarketData
): Promise<string> => {
  // Implementation
}
```

**Real-time Updates:**

- WebSocket connections for live market data
- Automatic balance refresh after transactions
- Optimistic UI updates with rollback on error

### 5.4 Infrastructure

#### 5.4.1 RPC Endpoints

**Devnet:**

- Primary: `https://api.devnet.solana.com`
- Backup: `https://rpc.ankr.com/solana_devnet`

**Mainnet (Production):**

- Helius RPC (recommended)
- QuickNode RPC (backup)
- Fallback to public endpoints

#### 5.4.2 Data Storage

**On-Chain:**

- All market data
- All bet positions
- Resolution outcomes
- Claim records

**Off-Chain (Roadmap):**

- Market images/media
- User profiles
- Social features
- Analytics caching

---

## 6. Protocol Mechanics

### 6.1 Market Lifecycle

```
CREATE → ACTIVE → ENDED → RESOLVED → CLAIMED
```

**1. Creation Phase:**

- Creator deploys market with question and parameters
- Market enters ACTIVE state
- Betting opens immediately

**2. Active Phase:**

- Users place bets on YES or NO
- Odds update dynamically based on pool ratios
- Market displayed in browse interface

**3. Ended Phase:**

- End date reached
- No new bets accepted
- Awaiting resolution

**4. Resolution Phase:**

- Authorized resolver determines outcome
- Winning side declared
- Payout calculations finalized

**5. Claim Phase:**

- Winners claim proportional payouts
- Losers receive nothing
- Market moves to historical archive

### 6.2 Payout Mechanics

#### 6.2.1 Winning Calculation

**Formula:**

```
Payout = BetAmount + (BetAmount / WinningPool) × LosingPool
```

**Example:**

- Market: "Will BTC hit $100k?"
- Total YES bets: 100 SOL (1000 SOL total from 10 users)
- Total NO bets: 50 SOL (500 SOL total from 5 users)
- Outcome: YES

**Winner Payouts:**

- User A bet 10 SOL on YES
- User A's payout = 10 + (10/100) × 50 = 15 SOL
- **50% ROI**

#### 6.2.2 Edge Cases

**No bets on losing side:**

- Winners receive original bet amount only
- No profit (100% refund)

**Market cancelled:**

- All participants receive full refunds
- No winners or losers

**Disputed resolution:**

- (Roadmap) Escalation to DAO governance
- Voting period for community resolution
- Potential for split outcomes in edge cases

### 6.3 Fee Structure

**Current (MVP):**

- **0% platform fee** - all winnings go to winners
- Only Solana network fees (~$0.00025 per transaction)

**Future (Sustainable Model):**

- 2% platform fee on winnings
- 50% to treasury for development
- 50% to token stakers (governance token holders)

**Comparison:**
| Platform | Fee | Blockchain Fee |
|----------|-----|----------------|
| PrismaFi | 0-2% | $0.00025 |
| PredictIt | 10% | $0 |
| Polymarket | 2% | $0.50-5.00 |
| Augur | 1% | $5-50 |

---

## 7. Use Cases

### 7.1 Financial Markets

**Cryptocurrency Predictions:**

- "Will ETH reach $5,000 by Q4 2025?"
- "Will Solana flip Ethereum in TVL?"
- "Will Bitcoin halving happen before May 2024?"

**Traditional Finance:**

- "Will S&P 500 hit 6,000 by year end?"
- "Will Fed cut rates in next meeting?"
- "Will gold outperform stocks this quarter?"

### 7.2 Politics & Governance

**Elections:**

- Presidential, congressional, and local elections
- Party leadership contests
- Referendum outcomes

**Policy:**

- "Will bill X pass in Congress?"
- "Will regulation Y be implemented?"
- "Will treaty Z be ratified?"

### 7.3 Sports

**Major Events:**

- Super Bowl, World Cup, Olympics
- Championship series
- Individual game outcomes

**Season-long:**

- MVP predictions
- Championship winners
- Playoff qualifications

### 7.4 Technology & Culture

**Product Launches:**

- "Will Apple announce AR glasses in 2025?"
- "Will GPT-5 be released this year?"

**Cultural Events:**

- Award show winners (Oscars, Grammys)
- Box office predictions
- Viral trend forecasting

### 7.5 Weather & Natural Events

- Hurricane landfall predictions
- Snowfall totals
- Temperature records
- Earthquake probabilities

### 7.6 Corporate

**Internal Use:**

- Project deadline predictions
- Sales target forecasting
- Resource allocation optimization

**Benefits:**

- Aggregates team knowledge
- Reveals hidden information
- Improves decision-making

---

## 8. Security & Auditing

### 8.1 Security Measures

#### 8.1.1 Smart Contract Security

**Best Practices Implemented:**

- ✅ Anchor framework security constraints
- ✅ PDA validation for all accounts
- ✅ Access control on privileged functions
- ✅ Reentrancy protection
- ✅ Integer overflow protection (Rust)
- ✅ Input validation and sanitization

**Security Features:**

```rust
// Example: Access control
#[account(mut, has_one = creator)]
pub market: Account<'info, Market>,
pub creator: Signer<'info>,

// Only market creator can resolve
require!(
    market.creator == *creator.key,
    ErrorCode::Unauthorized
);
```

#### 8.1.2 Frontend Security

- Input validation and sanitization
- HTTPS/TLS encryption
- Content Security Policy headers
- XSS prevention
- CSRF protection

#### 8.1.3 Wallet Security

- No private key storage
- Users maintain custody
- Transaction simulation before signing
- Clear transaction details in wallet prompts

### 8.2 Audit Roadmap

**Phase 1 (Current):**

- Internal code review
- Unit and integration testing
- Community bug bounty (testnet)

**Phase 2 (Pre-Mainnet):**

- Professional security audit (Halborn, Kudelski, or OtterSec)
- Formal verification of critical functions
- Stress testing and edge case analysis

**Phase 3 (Post-Launch):**

- Ongoing monitoring
- Bug bounty program (Immunefi)
- Quarterly security reviews

### 8.3 Risk Mitigation

**Smart Contract Risks:**

- **Mitigation:** Upgradeable contracts with multisig
- **Insurance:** Reserve fund for critical bugs
- **Limits:** Initial position limits during beta

**Oracle Risks:**

- **Mitigation:** Multi-source resolution data
- **Fallback:** Community dispute resolution
- **Transparency:** On-chain resolution evidence

**Economic Risks:**

- **Mitigation:** Fee structure adjustments
- **Reserve:** Treasury for market making
- **Monitoring:** Analytics dashboard for suspicious activity

---

## 9. Roadmap

### Q1 2025: Foundation ✅

- [x] Smart contract development
- [x] Core instructions (create, bet, resolve, claim)
- [x] Unit and integration tests
- [x] Frontend MVP
- [x] Wallet integration
- [x] Devnet deployment
- [x] Demo with mock data

### Q2 2025: Beta Launch

- [ ] Professional security audit
- [ ] Mainnet deployment
- [ ] Public beta launch
- [ ] Community market creation
- [ ] Enhanced UI/UX
- [ ] Mobile responsive design
- [ ] Real-time market updates

### Q3 2025: Growth & Features

- [ ] Decentralized oracle integration (Pyth, Switchboard)
- [ ] Automated market maker (AMM) for liquidity
- [ ] Market categories and advanced filtering
- [ ] User profiles and reputation system
- [ ] Social features (comments, sharing)
- [ ] Analytics dashboard
- [ ] REST API for developers

### Q4 2025: Scaling & Governance

- [ ] Governance token launch (PRISMA)
- [ ] DAO governance implementation
- [ ] Community-driven market resolution
- [ ] Advanced market types (scalar, categorical)
- [ ] Cross-chain bridge (Ethereum, BSC)
- [ ] Mobile app (iOS/Android)
- [ ] Institutional features (API, bulk operations)

### 2026: Enterprise & Ecosystem

- [ ] B2B prediction market infrastructure
- [ ] White-label solutions
- [ ] Advanced analytics and ML predictions
- [ ] Integration with major DeFi protocols
- [ ] Derivatives and options markets
- [ ] Global expansion and compliance
- [ ] Academic partnerships for research

---

## 10. Tokenomics (Future)

### 10.1 PRISMA Token

**Utility:**

- Governance voting rights
- Market creation fee discounts
- Staking rewards (share of platform fees)
- Access to premium features
- Liquidity mining rewards

**Distribution:**

- Community (40%): Airdrops, rewards, liquidity mining
- Team (20%): 4-year vesting
- Investors (15%): 2-year vesting
- Treasury (15%): DAO controlled
- Ecosystem (10%): Partnerships, grants

**Supply:**

- Initial supply: 1,000,000,000 PRISMA
- Max supply: 1,000,000,000 (non-inflationary)
- Circulating at launch: ~100,000,000 (10%)

### 10.2 Governance

**Proposal Types:**

- Protocol upgrades
- Fee structure changes
- Market resolution disputes
- Treasury spending
- Partnership approvals

**Voting:**

- 1 PRISMA = 1 vote
- Minimum holding period: 7 days
- Quorum: 10% of total supply
- Approval: 51% majority

---

## 11. Competitive Analysis

### 11.1 Market Comparison

| Feature             | PrismaFi       | Polymarket   | Augur          | PredictIt    |
| ------------------- | -------------- | ------------ | -------------- | ------------ |
| **Blockchain**      | Solana         | Polygon      | Ethereum       | None         |
| **Avg TX Cost**     | $0.00025       | $0.10-1.00   | $5-50          | $0           |
| **Settlement**      | 400ms          | 2-5s         | 15s-5min       | 1-3 days     |
| **Platform Fee**    | 0-2%           | 2%           | 1%             | 10%          |
| **Position Limit**  | None           | None         | None           | $850         |
| **KYC Required**    | No             | No           | No             | Yes          |
| **Geographic**      | Global         | Global       | Global         | US only      |
| **Market Creation** | Permissionless | Permissioned | Permissionless | Permissioned |

### 11.2 Competitive Advantages

**1. Cost Efficiency:**

- 100-1000x cheaper than Ethereum-based platforms
- Enables micro-markets and frequent trading

**2. Speed:**

- Near-instant confirmations
- Real-time odds updates
- Responsive user experience

**3. Accessibility:**

- No KYC requirements
- Global participation
- No position limits

**4. Developer-Friendly:**

- Open-source smart contracts
- Comprehensive documentation
- SDK and API support

---

## 12. Legal & Compliance

### 12.1 Regulatory Landscape

**Current Status:**

- PrismaFi is a decentralized protocol
- No central entity controls markets
- Users interact directly with smart contracts
- No custody of user funds

**Considerations:**

- Prediction markets may be regulated as derivatives
- Different regulations by jurisdiction
- Ongoing dialogue with regulators

### 12.2 Compliance Strategy

**Phase 1 (Current):**

- Focus on non-regulated markets (crypto, pop culture)
- Avoid political markets in restricted jurisdictions
- Clear disclaimers and terms of service

**Phase 2 (Future):**

- Geo-blocking for restricted jurisdictions (if required)
- Partnership with licensed operators
- Regulatory licenses in friendly jurisdictions

**Phase 3 (Long-term):**

- Industry advocacy for clear crypto regulations
- Self-regulatory organization participation
- Compliance-first feature development

### 12.3 Disclaimers

- PrismaFi is experimental software
- Users participate at their own risk
- No guarantees of profits or returns
- Market outcomes determined by real-world events
- Protocol may change based on regulatory requirements

---

## 13. Team & Community

### 13.1 Core Team

**Development:**

- Full-stack blockchain developers
- Rust/Solana specialists
- Frontend engineers

**Operations:**

- Product management
- Community management
- Marketing and growth

### 13.2 Community

**Channels:**

- Discord: Community hub and support
- Twitter: Announcements and updates
- GitHub: Open-source collaboration
- Forum: Governance discussions

**Contribution:**

- Bug bounties
- Feature suggestions
- Market creation ideas
- Documentation improvements

---

## 14. Conclusion

PrismaFi represents the next evolution of prediction markets: combining the wisdom of crowds with the transparency and efficiency of blockchain technology. By building on Solana, we deliver an experience that rivals centralized platforms while maintaining the core benefits of decentralization.

### Our Vision

A world where anyone, anywhere can:

- **Forecast** future events and profit from accurate predictions
- **Create** markets on topics they care about
- **Participate** in collective intelligence aggregation
- **Trust** in transparent, automated execution

### Why Now?

- Solana's infrastructure has matured
- Web3 UX has reached mainstream usability
- Regulatory clarity is emerging
- Demand for decentralized alternatives is growing

### Join Us

Whether you're a trader seeking better odds, a market creator with unique insights, or a developer building on our protocol, PrismaFi welcomes you to the future of forecasting.

**Get Started:**

- Website: https://prismafi-prediction-market.vercel.app
- Documentation: https://github.com/Edgadafi/prismafi-prediction-market
- Smart Contract: `6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7`
- Community: [Discord/Twitter links]

---

## Appendix A: Technical Specifications

### A.1 Smart Contract Deployment

**Program ID (Devnet):**

```
6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7
```

**Anchor Version:**

```
0.30.1
```

**Solana Version:**

```
1.18+
```

### A.2 Account Size Calculations

**Market Account:**

```
8 (discriminator)
+ 32 (creator)
+ 8 (market_id)
+ 4 + 200 (question)
+ 4 + 500 (description)
+ 4 + 50 (category)
+ 8 (end_date)
+ 8 (total_yes_bets)
+ 8 (total_no_bets)
+ 1 (is_resolved)
+ 2 (winning_outcome option)
+ 1 (bump)
= ~838 bytes
```

**UserPosition Account:**

```
8 (discriminator)
+ 32 (market)
+ 32 (bettor)
+ 1 (outcome)
+ 8 (amount)
+ 1 (claimed)
+ 1 (bump)
= ~83 bytes
```

### A.3 Gas Estimates

| Instruction    | Compute Units | Typical Cost (SOL) |
| -------------- | ------------- | ------------------ |
| create_market  | ~50,000       | 0.000025           |
| place_bet      | ~30,000       | 0.000015           |
| resolve_market | ~20,000       | 0.00001            |
| claim_winnings | ~40,000       | 0.00002            |

---

## Appendix B: Glossary

**Binary Market:** Prediction market with two possible outcomes (Yes/No)

**Lamports:** Smallest unit of SOL (1 SOL = 1,000,000,000 lamports)

**Market Maker:** Entity that provides liquidity by betting on both sides

**Odds:** Ratio of potential payout to bet amount

**Oracle:** System for bringing real-world data on-chain

**PDA (Program Derived Address):** Deterministic account address owned by a program

**Resolution:** Process of determining the outcome of a prediction market

**Scalar Market:** Market with numerical outcome range (e.g., "What will BTC price be?")

**Smart Contract:** Self-executing code deployed on blockchain

**TPS (Transactions Per Second):** Blockchain throughput metric

---

## Appendix C: References

1. Solana Documentation: https://docs.solana.com
2. Anchor Framework: https://www.anchor-lang.com
3. "The Wisdom of Crowds" by James Surowiecki
4. Augur Whitepaper: https://augur.net/whitepaper.pdf
5. Polymarket Documentation: https://docs.polymarket.com
6. Hanson, Robin. "Shall We Vote on Values, But Bet on Beliefs?" (2013)
7. Arrow, Kenneth J. "The Promise of Prediction Markets" (2008)
8. Berg, Joyce E., et al. "Results from a Dozen Years of Election Futures Markets Research" (2008)

---

## Document Information

**Version:** 1.0  
**Date:** January 2025  
**Authors:** PrismaFi Core Team  
**Contact:** [Contact information]  
**License:** This document is provided for informational purposes only and does not constitute financial, legal, or investment advice.

---

**© 2025 PrismaFi. All rights reserved.**
