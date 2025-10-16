# 🔮 PrismaFi Prediction Markets - Solana Smart Contracts

**Permisionless prediction markets para social accountability en LATAM**

[![Anchor](https://img.shields.io/badge/Anchor-v0.29.0-purple)](https://www.anchor-lang.com/)
[![Solana](https://img.shields.io/badge/Solana-v1.17-blue)](https://solana.com/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-Passing-brightgreen)](#tests)

---

## 📋 Características

### 🎯 Core Functionality
- ✅ **Creación de mercados permissionless** con requerimientos de evidencia configurables
- ✅ **Trading AMM-style** con constant product formula y slippage protection
- ✅ **Provisión de liquidez** con LP tokens y fee sharing
- ✅ **Resolución con oráculos** (Chainlink, Switchboard, custom)
- ✅ **Sistema de reputación** on-chain con badges y accuracy tracking
- ✅ **Fee structure transparente**: 0.5% platform fee

### 🔒 Seguridad y Gobernanza
- ✅ **Verificación humana** (Proof of Humanity, BrightID, Gitcoin Passport)
- ✅ **DAO voting** para eligibilidad de mercados
- ✅ **Moderación comunitaria** con reportes y resolución de disputas
- ✅ **Emergency controls** con multisig authority
- ✅ **Meta-prediction markets** para análisis de precisión mediática

### 🌐 Integraciones
- ✅ **Oracle integration** para resolución automática
- ✅ **Evidence submission** con credibility scoring
- ✅ **Multi-outcome markets** (Yes/No/Other)
- ✅ **Time-based resolution** con dispute windows

---

## 🏗️ Arquitectura

```
prediction-market-latam/
├── programs/
│   └── prediction-market/
│       ├── src/
│       │   ├── lib.rs                 # Entry point
│       │   ├── state.rs               # Account structures
│       │   ├── error.rs               # Error codes
│       │   ├── utils.rs               # Helper functions
│       │   └── instructions/
│       │       ├── create_market.rs          ✅
│       │       ├── place_prediction.rs       ✅
│       │       ├── sell_position.rs          ✅
│       │       ├── add_liquidity.rs          ✅
│       │       ├── remove_liquidity.rs       ✅
│       │       ├── claim_winnings.rs         ✅
│       │       ├── resolve_market_with_oracle.rs ✅
│       │       ├── submit_evidence.rs        ✅
│       │       ├── vote_on_eligibility.rs    ✅
│       │       ├── report_content.rs         ✅
│       │       ├── emergency_pause_market.rs ✅
│       │       ├── verify_human_identity.rs  ✅
│       │       ├── create_meta_prediction.rs ✅
│       │       └── update_reputation.rs      ✅
│       └── Cargo.toml
├── tests/
│   └── prediction-market.ts          # Comprehensive test suite
├── sdk/
│   ├── index.ts                      # TypeScript SDK
│   └── README.md                     # SDK documentation
├── Anchor.toml                       # Anchor configuration
├── DEPLOYMENT.md                     # Deployment guide
└── README.md                         # This file
```

---

## 🚀 Quick Start

### Prerequisitos

```bash
# 1. Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# 2. Install Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/v1.17.0/install)"

# 3. Install Anchor
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install latest
avm use latest
```

### Instalación

```bash
# Clone el repositorio
git clone https://github.com/prismafi/prediction-market-latam
cd prediction-market-latam

# Instalar dependencias
npm install

# Build
anchor build

# Run tests
anchor test
```

---

## 📚 Accounts & Instructions

### Main Accounts

#### `PredictionMarket`
```rust
pub struct PredictionMarket {
    pub authority: Pubkey,              // Market creator
    pub creator: Pubkey,                // Original creator
    pub status: MarketStatus,           // Active | Paused | Resolved | Disputed
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
    pub reputation_threshold: u8,
    pub human_verified_required: bool,
    pub oracle_integration: Option<OracleIntegration>,
    pub meta_markets: Vec<Pubkey>,
}
```

#### `UserPosition`
```rust
pub struct UserPosition {
    pub user: Pubkey,
    pub market: Pubkey,
    pub outcome: Outcome,               // Yes | No | Other(u8)
    pub amount: u64,
    pub entry_price: u64,               // Price in basis points
    pub created_at: i64,
    pub last_update: i64,
}
```

#### `UserProfile`
```rust
pub struct UserProfile {
    pub user: Pubkey,
    pub reputation_score: u32,          // Starts at 100
    pub total_predictions: u32,
    pub correct_predictions: u32,
    pub accuracy_rate: u8,              // Percentage
    pub human_verified: bool,
    pub human_proof: Option<HumanProofData>,
    pub created_at: i64,
    pub last_activity: i64,
    pub badges: Vec<Badge>,
}
```

#### `LiquidityPosition`
```rust
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
```

### Key Instructions

| Instruction | Description | Accounts Required |
|------------|-------------|-------------------|
| `create_market` | Creates a new prediction market | market, user_profile, creator |
| `place_prediction` | Buy position in market | market, user_position, user_profile, token_accounts |
| `sell_position` | Sell position before resolution | market, seller_position, token_accounts, treasury |
| `add_liquidity` | Provide liquidity to market | market, liquidity_position, token_accounts |
| `remove_liquidity` | Withdraw liquidity | market, liquidity_position, token_accounts |
| `claim_winnings` | Claim winnings after resolution | market, user_position, user_profile, token_accounts |
| `resolve_market_with_oracle` | Resolve market using oracle data | market, oracle_authority |
| `submit_evidence` | Submit evidence for market | market, evidence, submitter |
| `vote_on_eligibility` | Vote on market eligibility (DAO) | market, eligibility_vote, voter |
| `report_content` | Report market for moderation | market, content_report, reporter |
| `emergency_pause_market` | Pause market (multisig only) | market, multisig_governance |
| `verify_human_identity` | Verify human proof | user_profile, verifier |
| `create_meta_prediction` | Create meta-market | parent_market, meta_market, creator |
| `update_reputation` | Update user reputation score | user_profile, authority |

---

## 💡 SDK Usage

### Installation

```bash
npm install @prismafi/prediction-market-sdk
```

### Basic Example

```typescript
import { PredictionMarketSDK } from "@prismafi/prediction-market-sdk";
import { Connection } from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");
const sdk = new PredictionMarketSDK(connection, wallet);

// Create a market
const tx = await sdk.createMarket(
  wallet.publicKey,
  {
    question: "Will Bitcoin reach $100k by end of 2025?",
    description: "Bitcoin price prediction",
    category: "Crypto",
    resolutionDate: Date.now() / 1000 + 86400 * 180,
    initialLiquidity: 10_000_000,
  },
  {
    minEvidenceCount: 3,
    requiredTypes: [],
    oracleRequired: true,
    scientificPeerReview: false,
    governmentSourceRequired: false,
  }
);

// Place a prediction
const [marketPda] = sdk.findMarketPda("Your question");
await sdk.placePrediction(
  wallet.publicKey,
  marketPda,
  1_000_000, // 1 token
  { yes: {} },
  userTokenAccount
);

// Get market data
const market = await sdk.getMarket(marketPda);
console.log("YES Pool:", market.yesPool.toString());
console.log("NO Pool:", market.noPool.toString());

// Calculate price
const yesPrice = sdk.calculatePrice(market, "yes");
console.log("YES Price:", yesPrice.toFixed(2), "%");
```

Ver [SDK Documentation](./sdk/README.md) para más ejemplos.

---

## 🧪 Tests

```bash
# Run all tests
anchor test

# Run with detailed logs
anchor test -- --nocapture

# Run specific test
anchor test --test prediction-market
```

### Test Coverage

- ✅ Program initialization
- ✅ User profile creation
- ✅ Market creation with validations
- ✅ Placing predictions (buy positions)
- ✅ Adding liquidity to pools
- ✅ Selling positions (AMM pricing)
- ✅ Market resolution with oracle
- ✅ Claiming winnings with fee calculation
- ✅ Removing liquidity

---

## 🔐 Security

### Implemented Safeguards

1. **Math overflow protection** - All arithmetic uses `checked_` operations
2. **Slippage protection** - 2% max slippage on sells
3. **Fee validation** - 0.5% transparent platform fee
4. **Access control** - PDAs and signer validations
5. **Status checks** - Market status validations (Active/Resolved)
6. **Reputation gates** - Minimum reputation requirements
7. **Human verification** - Optional proof of humanity
8. **Emergency pause** - Multisig-controlled circuit breaker

### Audit Status

⚠️ **Pre-audit** - Do NOT use in production without professional security audit.

Recommended auditors:
- [Halborn](https://halborn.com/)
- [OtterSec](https://osec.io/)
- [Trail of Bits](https://www.trailofbits.com/)

---

## 📊 Fee Structure

| Action | Fee | Recipient |
|--------|-----|-----------|
| Create Market | Free | - |
| Buy Position | Free | - |
| Sell Position | 0.5% | Treasury |
| Claim Winnings | 0.5% | Treasury |
| Add Liquidity | Free | - |
| Remove Liquidity | Free | - |

---

## 🌍 Deployment

### Devnet

```bash
# Configure Solana CLI
solana config set --url devnet

# Deploy
anchor deploy --provider.cluster devnet

# Initialize
ts-node scripts/initialize.ts
```

### Mainnet

Ver [DEPLOYMENT.md](./DEPLOYMENT.md) para guía completa.

⚠️ **Checklist antes de mainnet:**
- [ ] Security audit completed
- [ ] Multisig setup for upgrade authority
- [ ] Circuit breakers implemented
- [ ] Monitoring infrastructure ready
- [ ] Bug bounty program launched

---

## 📖 Documentation

- [Deployment Guide](./DEPLOYMENT.md)
- [SDK Documentation](./sdk/README.md)
- [Architecture Overview](./docs/architecture.md) *(próximamente)*
- [API Reference](./docs/api-reference.md) *(próximamente)*

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

## 📜 License

MIT License - see [LICENSE](LICENSE) for details

---

## 🔗 Links

- **Website**: https://prismafi.io
- **Twitter**: [@PrismaFi](https://twitter.com/PrismaFi)
- **Discord**: https://discord.gg/prismafi
- **Docs**: https://docs.prismafi.io

---

## 👨‍💻 Team

Built by the PrismaFi team for the Cypherpunk Hackathon 2025

---

**⚡ Powered by Solana | Built with Anchor**
