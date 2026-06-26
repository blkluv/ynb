# 🎯 PredicTok.fun - Transparent Prediction Markets on Solana

> **Transparent, Verifiable, On-Chain.** A next-generation prediction market platform built on Solana with full transparency and instant settlements. Every bet, resolution, and payout is verifiable on-chain.

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://predictok.fun)
[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://solana.com)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)

---

## 🌟 What Makes PredicTok.fun Different?

Traditional prediction markets suffer from opacity and trust issues. You never know if odds are manipulated or if your payout will arrive.

**PrismaFi changes the game:**
- 🔍 **Full Transparency**: Every bet, resolution, and payout is verifiable on-chain
- ⚡ **Instant Settlements**: Claims settle in <1 second with Solana's speed
- 💰 **Ultra-Low Fees**: $0.00025 per transaction vs $5-50 on Ethereum
- 🔗 **Permissionless**: Anyone can create markets without gatekeepers
- 🎨 **Beautiful UX**: Minimalist-brutalist design with real-time updates

---

## 🚀 Live Demo

**👉 [Try it now on Solana Devnet](https://predictok.fun)**

### Quick Start (No Installation):
1. Install [Phantom Wallet](https://phantom.app/)
2. Switch to Solana Devnet
3. Get free SOL from [Solana Faucet](https://faucet.solana.com/)
4. Visit the demo and start trading!

---

## ✨ Features

### 🎯 Core Trading
- **Create Markets** - Anyone can create prediction markets with custom questions
- **Binary Betting** - Place bets on Yes/NO outcomes with real SOL
- **Market Resolution** - Market creators resolve with the final outcome
- **Claim Winnings** - Winners get proportional payouts based on pool distribution
- **Real-Time Odds** - Live probability updates as bets come in

### 🔮 **NEW: Oracle-Powered Markets** (Pyth Network Integration)
- **Trustless Resolution** - Markets automatically resolve using real-world price data from Pyth Network
- **Zero Human Intervention** - No manual resolution needed, eliminates manipulation risk
- **Instant Settlements** - Resolves immediately when market expires with latest price feed
- **Verifiable Outcomes** - Anyone can verify the Pyth price feed used for resolution
- **Price Feeds Available**:
  - 📈 BTC/USD - Bitcoin price markets
  - 📊 ETH/USD - Ethereum price markets
  - ⚡ SOL/USD - Solana price markets
  - 💵 Stablecoin pairs (USDC, USDT)
  - 🪙 Top altcoins (BNB, ADA, MATIC)
- **Flexible Conditions** - Set markets for price above/below/equals specific thresholds
- **Real-Time Price Display** - See current Pyth price vs your threshold live on market page
- **Auto-Resolve Button** - Anyone can trigger resolution after expiry (fully permissionless)

**Example Oracle Markets:**
- "Will BTC reach $100,000 by Dec 31, 2025?" → Auto-resolves YES/NO based on Pyth price
- "Will ETH stay above $3,500 for next 24 hours?" → Trustless verification
- "SOL price above $200 on Jan 1, 2026?" → Instant settlement at exact time

### 🤖 AI-Powered Insights (Swarms Integration)
- **Multi-Agent Analysis** - Three specialized AI agents working together
- **SentimentAgent** - Analyzes social media sentiment and community discussions
- **DataAgent** - Examines historical market patterns and win rates
- **StrategyAgent** - Recommends optimal position sizing and confidence levels
- **Actionable Insights** - Get AI reasoning, not just recommendations

### 🔮 Oracle Resolution (Pyth Network Integration)
- **Automatic Resolution** - Markets resolve automatically based on real-world price data
- **Trustless** - No human bias or manipulation possible
- **Instant** - Resolves immediately after end time
- **Verifiable** - Anyone can verify the oracle price on-chain
- **Price Feeds** - Support for BTC/USD, ETH/USD, SOL/USD, and more

### 📊 User Experience
- **Personal Dashboard** - Track all your bets, stats, and P&L in one place
- **Global Leaderboard** - See top traders ranked by win rate, ROI, and profit
- **Activity Feed** - Real-time blockchain events (bets, markets, resolutions)
- **Public Profiles** - View any user's trading history and performance
- **Social Sharing** - Share markets, profiles, and winning bets on Twitter/X

### ⚡ Real-Time System
- **Auto-Refresh** - All pages update automatically (configurable intervals)
- **Manual Controls** - Refresh button and pause/resume toggle on every page
- **Live Indicators** - Visual status showing when data was last updated
- **SSR-Compatible** - Works with Next.js server-side rendering

### 🔍 Discovery & Filters
- **Search Markets** - Find markets by question or description
- **Category Filter** - Browse by Crypto, Sports, Politics, Tech, etc.
- **Status Filter** - Show active, resolved, or all markets
- **Activity Filter** - Filter events by type (bets, markets, resolutions)

---

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 14 (React 18) - Server & client rendering
- TypeScript 5.0 - Type safety
- Tailwind CSS - Styling
- Lucide Icons - Icon library

**Blockchain:**
- Solana (Devnet) - L1 blockchain
- Anchor 0.30 - Smart contract framework
- Solana Wallet Adapter - Wallet integration
- @solana/web3.js - Blockchain interactions

**Smart Contract:**
- Rust - Contract language
- Anchor Framework - Development framework
- UMA-style resolution - Optimistic oracle pattern
- Pyth Network - Price oracle integration

**AI Layer:**
- Swarms - Multi-agent AI orchestration
- SentimentAgent - Social media analysis
- DataAgent - Historical pattern recognition
- StrategyAgent - Trade recommendations

**Oracle Layer:**
- Pyth Network - Real-time price feeds
- Automatic resolution - Trustless market settlement
- Multiple price feeds - BTC, ETH, SOL, USDC, and more

**Deployment:**
- Vercel - Frontend hosting
- Solana Devnet - Smart contract deployment
- Swarms API - AI insights engine
- Pyth Hermes - Price oracle endpoint

### Smart Contract Architecture

```
┌─────────────────────────────────────────┐
│         Prediction Market Program        │
├─────────────────────────────────────────┤
│                                          │
│  Instructions:                           │
│  ├─ initialize()                         │
│  ├─ create_market()                      │
│  ├─ place_bet()                          │
│  ├─ resolve_market()                     │
│  └─ claim_winnings()                     │
│                                          │
│  Accounts:                               │
│  ├─ GlobalState (singleton)             │
│  ├─ Market (per market)                 │
│  └─ Bet (per user per market)           │
│                                          │
└─────────────────────────────────────────┘
```

### Frontend Architecture

```
┌─────────────────────────────────────────┐
│            Next.js Frontend              │
├─────────────────────────────────────────┤
│                                          │
│  Pages:                                  │
│  ├─ /markets (10s refresh)              │
│  ├─ /markets/[id] (5s refresh)          │
│  ├─ /dashboard (8s refresh)             │
│  ├─ /leaderboard (15s refresh)          │
│  ├─ /activity (6s refresh)              │
│  └─ /profile/[wallet] (12s refresh)     │
│                                          │
│  Custom Hooks:                           │
│  ├─ useRealTimeData (polling + state)   │
│  └─ useAnchorWallet (Solana wallet)     │
│                                          │
│  Components:                             │
│  ├─ RealTimeStatus (live indicator)     │
│  ├─ BinaryTradingInterface (betting)    │
│  ├─ ResolveMarketInterface (creator)    │
│  ├─ ClaimWinnings (winners)             │
│  ├─ MarketAnalyzer (AI insights)        │
│  └─ ShareProfile/Market/Bet (social)    │
│                                          │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│         Swarms AI Layer                  │
├─────────────────────────────────────────┤
│                                          │
│  Multi-Agent Orchestration:              │
│  ├─ SentimentAgent (social analysis)    │
│  ├─ DataAgent (historical patterns)     │
│  └─ StrategyAgent (recommendations)     │
│                                          │
│  Output:                                 │
│  ├─ Market sentiment score              │
│  ├─ Historical win rate analysis        │
│  ├─ Optimal bet size suggestion         │
│  └─ Confidence level + reasoning        │
│                                          │
└─────────────────────────────────────────┘
```

---

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ and npm
- Rust 1.70+ (for smart contract)
- Solana CLI 1.18+
- Anchor CLI 0.30+
- Phantom or Solflare wallet

### 1. Clone Repository
```bash
git clone https://github.com/Edgadafi/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025
```

### 2. Setup Frontend
```bash
cd prediction-market
npm install --legacy-peer-deps
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PROGRAM_ID=your_deployed_program_id
```

### 3. Setup Smart Contract
```bash
cd ../prediction-market-latam
anchor build
anchor deploy --provider.cluster devnet
```

Copy the deployed program ID to your `.env.local` file.

### 4. Update IDL
```bash
cp target/idl/prediction_market.json ../prediction-market/src/idl/
```

### 5. Run Development Server
```bash
cd ../prediction-market
npm run dev
```

Visit `http://localhost:3000`

---

## 🎮 Usage Guide

### Creating a Market

1. Connect your Phantom wallet
2. Click "Create Market" button
3. Fill in:
   - Question (e.g., "Will Bitcoin reach $100k in 2025?")
   - Description with resolution criteria
   - Category (Crypto, Sports, Politics, etc.)
   - End date/time
4. Confirm transaction (~0.01 SOL)
5. Market goes live immediately!

### Placing a Bet

1. Browse markets on `/markets`
2. Click on a market to see details
3. Choose Yes or No
4. Enter amount in SOL
5. Confirm transaction
6. Your bet appears in your Dashboard

### Resolving a Market

1. Only market creator can resolve
2. Navigate to your created market after end time
3. Select the winning outcome (Yes or No)
4. Confirm resolution transaction
5. Winners can now claim their winnings

### Claiming Winnings

1. Go to market detail page or Dashboard
2. If you won, you'll see "Claim Winnings" button
3. Click to claim your proportional share
4. Winnings transferred to your wallet
5. Bet marked as claimed

### 🔮 Using Oracle Markets (NEW!)

**Creating an Oracle Market:**
1. Click "Create Market"
2. Select "🔮 Oracle Market" tab
3. Choose asset (BTC/USD, ETH/USD, SOL/USD, etc.)
4. Set threshold price (e.g., $100,000 for BTC)
5. Choose comparison (Above / Below / Equals)
6. Set end date/time when resolution occurs
7. Add question and description
8. Confirm and deploy

**Betting on Oracle Markets:**
- Same as standard markets
- See real-time Pyth price updates
- Threshold and current price displayed
- "Would Resolve As" indicator shows prediction

**Auto-Resolution:**
1. After end time, market is ready to resolve
2. Anyone can click "Auto-Resolve with Oracle"
3. Smart contract fetches Pyth price feed
4. Compares price vs threshold using your condition
5. Market resolves YES or NO instantly
6. Winners claim as usual

**Benefits:**
- ✅ No trust in market creator needed
- ✅ No waiting for manual resolution
- ✅ Cryptographically verifiable outcome
- ✅ Zero manipulation risk
- ✅ Instant settlement

---

## 📊 Key Metrics & Stats

### User Stats
- **Total Bets** - Number of bets placed
- **Active Bets** - Unresolved markets
- **Win Rate** - % of bets won
- **Total Wagered** - SOL bet across all markets
- **Profit/Loss** - Net P&L (won - wagered)
- **ROI** - Return on investment %

### Market Stats
- **Total Yes/No** - Amount bet on each outcome
- **Implied Probability** - Current odds (Yes%)
- **Total Volume** - Sum of all bets
- **Participants** - Unique bettors

### Leaderboard Rankings
- Ranked by total profit (descending)
- Secondary sort by win rate
- Shows top 50 traders
- Updates every 15 seconds

---

## 🛣️ Roadmap

### ✅ Phase 1: MVP (Complete)
- [x] Core betting functionality
- [x] Market creation & resolution
- [x] User dashboard
- [x] Real-time updates
- [x] Social features
- [x] Leaderboard & activity feed
- [x] **Oracle-powered auto-resolution (Pyth Network)** 🆕

### 🚧 Phase 2: Enhanced UX (In Progress)
- [ ] Advanced charts & analytics
- [ ] Notification system
- [ ] Mobile app (React Native)
- [ ] Email/SMS alerts
- [ ] Portfolio tracking

### 🔮 Phase 3: Advanced Features (Planned)
- [ ] **Scalar Markets** - Bet on continuous values
- [ ] Liquidity pools & AMM
- [ ] Conditional markets ("If A then B")
- [ ] Market maker interface
- [ ] API for trading bots

### 💰 Phase 4: Stablecoins & Multi-Token Support (v2)
- [ ] **USDC/USDT Support** - Bet using stablecoins for price stability
- [ ] **On-Ramp Integration** - Direct fiat-to-crypto (Ramp, Moonpay, Transak)
- [ ] **Off-Ramp Integration** - Convert winnings to fiat
- [ ] **SPL Token Program** - Support for multiple token types
- [ ] **Migration Path** - Seamless transition from SOL-only to multi-token
- [ ] **Token Selection UI** - Choose between SOL, USDC, USDT when betting

### 🌍 Phase 5: Mainnet & Growth
- [ ] Solana mainnet deployment
- [ ] Partnerships with data providers
- [ ] Integration with Pyth/Chainlink oracles
- [ ] Mobile app launch
- [ ] Marketing campaign
- [ ] Governance token ($PRISMA)

---

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create market with wallet connected
- [ ] Place Yes/No bets on different markets
- [ ] Verify dashboard shows correct stats
- [ ] Resolve market as creator
- [ ] Claim winnings as winner
- [ ] View leaderboard and activity feed
- [ ] Share market/profile on social media
- [ ] Test real-time refresh (pause/resume)

### Automated Tests (Coming Soon)
```bash
# Frontend tests
npm test

# Smart contract tests
anchor test
```

---

## 🤝 Contributing

We welcome contributions! See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

**Quick Start:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript strict mode
- Use Tailwind for styling
- Write meaningful commit messages
- Test on Solana Devnet before PR
- Update documentation for new features

**See also:**
- [ROADMAP.md](./ROADMAP.md) - Future features and plans
- [CHANGELOG.md](./CHANGELOG.md) - Version history
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Common issues and solutions

---

## 🐛 Known Issues & Limitations

### Current Limitations
- **Devnet Only** - Not on mainnet yet (use test SOL)
- **SOL-Only Betting** - Currently supports only SOL for betting. Stablecoin support (USDC/USDT) planned for v2
- **Binary Markets** - Scalar markets coming in Phase 3
- **Manual Resolution** - Creator must manually resolve (automation planned via oracles)
- **No Dispute Mechanism** - Trust-based resolution (UMA integration planned)
- **No On-Ramp/Off-Ramp** - Direct fiat-to-crypto conversion not yet integrated

### Planned Fixes (v2)
- [x] Automated resolution via Pyth Network oracles ✅ (Completed)
- [ ] **Stablecoin Support (USDC/USDT)** - Bet using stablecoins instead of SOL
- [ ] **On-Ramp Integration** - Direct fiat-to-crypto via Ramp, Moonpay, etc.
- [ ] **Off-Ramp Integration** - Convert winnings back to fiat
- [ ] **SPL Token Program Integration** - Support for multiple token types
- [ ] Dispute mechanism for incorrect resolutions
- [ ] Gas optimization for claim transactions
- [ ] Improved error messages

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain infrastructure
- **Anchor Framework** - For simplifying smart contract development
- **Vercel** - For seamless frontend deployment
- **Cypherpunk Hackathon 2025** - For the opportunity and inspiration

---

## 📞 Contact & Links

- **Live Demo**: https://predictok.fun
- **GitHub**: https://github.com/Edgadafi/cypherpunk-hackathon2025

---

## 🎯 Built for Cypherpunk Hackathon 2025

**Project**: PrismaFi  
**Team**: Edgadafi  
**Category**: DeFi / Prediction Markets  
**Blockchain**: Solana (Devnet)  
**Demo**: [Live on Vercel](https://predictok.fun)

---

### 🌟 Star this repo if you find it useful!

**Made with ❤️ for the Solana ecosystem**
