# PrismaFi Product Requirements Document

## 1. Product Overview

- **Name:** PrismaFi
- **Tagline:** "The open prediction layer for Solana."
- **Summary:** A decentralized, non-custodial protocol for creating and trading prediction markets using Solana's fast and low-cost infrastructure.
- **Vision:** To democratize forecasting by enabling anyone to express, trade, and monetize information with transparent, permissionless markets.

## 2. Problem Statement

- Current prediction markets are limited by slow finality, high fees, or closed participation.
- Many are centralized, creating censorship or liquidity risks.
- Information markets lack interoperability with DeFi primitives and composable infrastructure on Solana.

## 3. Target Users & Personas

- **Retail traders:** Seek to profit from knowledge or speculation.
- **Communities / DAOs:** Use prediction markets to coordinate beliefs and decisions.
- **Validators / Oracles:** Secure event resolution for reputation and staking rewards.
- **Developers:** Integrate PrismaFi's markets and data feeds into DeFi apps or dashboards.

## 4. User Stories

- _As a user_, I want to create a new market about an event so others can trade on its outcome.
- _As a trader_, I want to buy and sell outcome shares easily using my wallet.
- _As a validator_, I want to report and validate results to earn reputation and staking rewards.
- _As a DAO_, I want to integrate markets to forecast community proposals or metrics.

## 5. Core Features

| Feature                      | Priority | Description                                                                                   |
| ---------------------------- | -------- | --------------------------------------------------------------------------------------------- |
| Market Creation              | Must     | Permissionless creation of new prediction markets with parameters (event, options, end date). |
| Trading Engine               | Must     | Users trade outcome tokens using an AMM (e.g. LMSR-style).                                    |
| Resolution Protocol          | Must     | Validators resolve outcomes with staking + reputation incentives.                             |
| Governance                   | Should   | Token-weighted proposals for adding markets or updating parameters.                           |
| Analytics Dashboard          | Could    | Aggregated data visualization of active markets and liquidity.                                |
| AI-assisted Market Discovery | Could    | Optional integration of AI models to suggest trending topics or events.                       |

## 6. User Flow (Text-based Diagram)

1. User connects Phantom or Backpack wallet.
2. Creates or joins an existing market.
3. Trades YES/NO outcome tokens via on-chain AMM.
4. Event closes → validators submit results.
5. Disputes handled via staking and slashing.
6. Final settlement → payouts to winning token holders.

## 7. Technical Requirements

### Stack

- **Frontend:** Next.js + TypeScript + Tailwind + Solana Wallet Adapter
- **Smart Contracts:** Anchor Framework (Rust)
- **Network:** Solana Mainnet / Devnet
- **Oracles / Data Feeds:** Switchboard or Pyth
- **Storage:** IPFS / Arweave for event metadata

### Integrations

- Phantom, Backpack, Solflare wallets
- Serum or Jupiter for liquidity routing
- Optional: Helium or Drift SDK for real-world data references

## 8. Success Metrics

| Metric                   | Target                  |
| ------------------------ | ----------------------- |
| Markets created          | 100+ in first 3 months  |
| Daily active traders     | 1,000+ unique wallets   |
| Total Value Locked (TVL) | $500K+ in SPL liquidity |
| Average latency          | < 400ms per transaction |
| Validator uptime         | > 99% availability      |

## 9. Open Questions / Next Steps

- Should market resolution be fully decentralized or hybrid (validators + oracle fallback)?
- How will market creation fees and revenue be distributed among validators and treasury?
- Should AI curation (for trending topics) be part of the MVP or v2?

## 10. Priorities & Risks Summary

| Priority | Area                | Risk                    | Mitigation                            |
| -------- | ------------------- | ----------------------- | ------------------------------------- |
| High     | Market liquidity    | Low early participation | Incentivize initial market makers     |
| Medium   | Oracle reliability  | Manipulation or delay   | Use multi-source resolution + staking |
| Medium   | UX complexity       | Confusion for new users | Simplify with guided onboarding       |
| Low      | Regulatory exposure | Varies by jurisdiction  | Operate as protocol, not custodian    |

---

## 11. Technical Architecture

### Smart Contract Structure

```
PrismaFi Protocol
├── Market Factory
│   ├── Create Market
│   ├── Market Parameters
│   └── Market Registry
├── Trading Engine
│   ├── AMM Pool Management
│   ├── Order Matching
│   └── Liquidity Provision
├── Resolution System
│   ├── Validator Registry
│   ├── Outcome Submission
│   ├── Dispute Resolution
│   └── Final Settlement
└── Governance
    ├── Proposal System
    ├── Voting Mechanism
    └── Parameter Updates
```

### Data Flow

1. **Market Creation:** User submits market parameters → Factory creates market contract → Event metadata stored on IPFS
2. **Trading:** User places trade → AMM calculates price → SPL tokens transferred → Position recorded
3. **Resolution:** Event occurs → Validators submit outcomes → Dispute period → Final settlement → Payouts distributed

## 12. Security Considerations

### Smart Contract Security

- Comprehensive audit before mainnet deployment
- Formal verification for critical functions
- Emergency pause mechanisms for market manipulation
- Multi-signature requirements for protocol upgrades

### Economic Security

- Minimum stake requirements for validators
- Slashing conditions for malicious behavior
- Liquidity incentives to prevent market manipulation
- Gradual decentralization of resolution authority

## 13. Compliance & Legal

### Regulatory Considerations

- Protocol operates as infrastructure, not custodian
- Users maintain custody of their tokens
- No centralized control over market outcomes
- Transparent, auditable resolution process

### Jurisdictional Compliance

- Monitor regulatory developments in key markets
- Implement geo-blocking where required
- Maintain legal entity structure for compliance
- Regular legal review of protocol operations

## 14. Development Roadmap

### Phase 1: MVP (Months 1-3)

- Core smart contracts deployed on devnet
- Basic frontend with wallet integration
- Simple binary markets (YES/NO)
- Manual resolution by admin

### Phase 2: Decentralization (Months 4-6)

- Validator network implementation
- Dispute resolution mechanism
- Governance token launch
- Multi-outcome markets

### Phase 3: Advanced Features (Months 7-12)

- AI-assisted market discovery
- Advanced analytics dashboard
- Cross-chain integration
- Mobile application

## 15. Tokenomics

### PRISMA Token Distribution

- **Validators:** 40% - Rewards for securing the network
- **Community:** 30% - Airdrops and incentives
- **Team:** 20% - 4-year vesting with 1-year cliff
- **Treasury:** 10% - Protocol development and operations

### Fee Structure

- **Market Creation:** 0.1% of initial liquidity
- **Trading Fees:** 0.3% per trade (0.1% to protocol, 0.2% to liquidity providers)
- **Resolution Fees:** 0.05% of market volume
- **Governance Proposals:** 100 PRISMA tokens

## 16. Integration Ecosystem

### DeFi Integrations

- **Lending Protocols:** Use prediction market positions as collateral
- **DEX Aggregators:** Route trades through PrismaFi markets
- **Yield Farming:** Stake PRISMA tokens for additional rewards
- **Insurance:** Hedge against market volatility

### Data Integrations

- **Oracle Networks:** Pyth, Switchboard, Chainlink
- **Social Media:** Twitter, Reddit sentiment analysis
- **News APIs:** Real-time event detection
- **Sports Data:** ESPN, The Athletic integration

## 17. Risk Management

### Technical Risks

- **Smart Contract Bugs:** Comprehensive testing and auditing
- **Oracle Manipulation:** Multiple data sources and validation
- **Network Congestion:** Optimized transaction batching
- **Key Management:** Hardware wallet integration

### Economic Risks

- **Liquidity Shortage:** Incentive programs for market makers
- **Market Manipulation:** Anti-manipulation mechanisms
- **Regulatory Changes:** Flexible architecture for compliance
- **Competition:** Focus on unique value propositions

## 18. Success Criteria

### Short-term (3 months)

- 50+ active markets
- $100K+ TVL
- 500+ unique traders
- 99%+ uptime

### Medium-term (6 months)

- 200+ active markets
- $1M+ TVL
- 2,000+ unique traders
- Full decentralization

### Long-term (12 months)

- 1,000+ active markets
- $10M+ TVL
- 10,000+ unique traders
- Cross-chain expansion

---

_This PRD serves as the foundational document for PrismaFi development. It should be reviewed and updated regularly as the protocol evolves and new requirements emerge._
