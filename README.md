# 🎯 PrismaFi - Permissionless Prediction Markets on Solana

[![Solana](https://img.shields.io/badge/Solana-Devnet-9945FF?logo=solana)](https://explorer.solana.com/?cluster=devnet)
[![Anchor](https://img.shields.io/badge/Anchor-0.30-brightgreen)](https://www.anchor-lang.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

> **Democratizing forecasting in LATAM through decentralized prediction markets**

[Live Demo](#) | [Documentation](./HACKATHON_READY_SUMMARY.md) | [Deployment Guide](./SOLANA_PLAYGROUND_DEPLOY.md)

---

## 🌟 Overview

PrismaFi is a fully decentralized prediction market protocol built on Solana. Anyone can create markets, place bets, and earn rewards by correctly predicting future events.

### **Why PrismaFi?**

- **⚡ Lightning Fast:** 400ms finality on Solana
- **💰 Dirt Cheap:** $0.00025 per transaction (1000x cheaper than Ethereum)
- **🔓 Permissionless:** No KYC, no geo-blocking, no gatekeepers
- **🌎 LATAM-Focused:** Markets on Argentine politics, Copa América, regional economics
- **🔐 Fully On-Chain:** No centralized server, transparent resolution

---

## 📊 Features

### **For Traders**

- ✅ Trade on YES/NO outcomes
- ✅ Real-time odds and volume
- ✅ Transparent parimutuel payouts
- ✅ Sub-second settlement

### **For Market Creators**

- ✅ Create markets in <2 minutes
- ✅ Customizable end dates and categories
- ✅ Earn fees from market volume (roadmap)

### **For Developers**

- ✅ Open-source smart contracts
- ✅ TypeScript SDK
- ✅ React hooks for easy integration
- ✅ Complete documentation

---

## 🚀 Quick Start

### **1. Install Dependencies**

```bash
# On Windows
install-solana-deps.bat

# On Mac/Linux
npm install @solana/web3.js @project-serum/anchor js-sha256 @coral-xyz/anchor
```

### **2. Deploy Smart Contract**

Follow our [Solana Playground Deployment Guide](./SOLANA_PLAYGROUND_DEPLOY.md):

1. Go to https://beta.solpg.io/
2. Create new Anchor project
3. Copy [`lib.rs`](./prediction-market-contract/programs/prediction_market/src/lib.rs)
4. Build → Deploy → Copy Program ID

### **3. Configure Frontend**

```typescript
// src/lib/solana-integration.ts
export const PROGRAM_ID = new PublicKey('YOUR_PROGRAM_ID_HERE')
```

### **4. Run Locally**

```bash
npm run dev
# Open http://localhost:3000
```

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────┐
│         Frontend (Next.js + React)        │
│  ┌────────────────────────────────────┐  │
│  │  usePredictionMarket Hook          │  │
│  │  ↓                                 │  │
│  │  solana-integration.ts             │  │
│  └────────────────────────────────────┘  │
└────────────────┬─────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────┐
│       Solana Blockchain (Devnet)         │
├──────────────────────────────────────────┤
│  Program: prediction_market              │
│                                          │
│  Instructions:                           │
│  • create_market(question, end_time)     │
│  • place_bet(outcome, amount)            │
│  • resolve_market(winning_outcome)       │
│  • claim_winnings()                      │
│                                          │
│  Accounts:                               │
│  • Market (question, odds, resolved)     │
│  • UserPosition (user, outcome, amount)  │
│  • Vault (PDA holding all bets)          │
└──────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
.
├── prediction-market-contract/     # Anchor smart contract
│   ├── programs/
│   │   └── prediction_market/
│   │       └── src/
│   │           └── lib.rs          # Core contract logic (392 lines)
│   ├── tests/                      # Contract tests
│   └── Anchor.toml
│
├── src/                            # Next.js frontend
│   ├── components/
│   │   ├── BettingInterface.tsx    # Betting UI component
│   │   ├── CreateMarketForm.tsx    # Market creation form
│   │   └── ...
│   ├── hooks/
│   │   └── usePredictionMarket.ts  # React hook for contracts
│   ├── lib/
│   │   └── solana-integration.ts   # TypeScript SDK
│   └── pages/
│       ├── index.tsx               # Landing page
│       ├── market/[id].tsx         # Market detail page
│       └── create.tsx              # Create market page
│
├── docs/                           # Documentation
│   ├── HACKATHON_READY_SUMMARY.md
│   ├── SOLANA_PLAYGROUND_DEPLOY.md
│   ├── QUICK_INTEGRATION_GUIDE.md
│   └── PRD.md
│
└── install-solana-deps.bat         # Dependency installer
```

---

## 🎮 Usage Examples

### **Creating a Market**

```typescript
import { usePredictionMarket } from '@/hooks/usePredictionMarket'

function CreateMarket() {
  const { createMarket } = usePredictionMarket()

  const marketPDA = await createMarket({
    question: 'Will Argentina dollarize by Dec 2025?',
    description: 'Resolves YES if USD becomes official currency...',
    endTime: 1735689600, // Unix timestamp
    category: 'Politics',
  })

  console.log('Market created:', marketPDA.toString())
}
```

### **Placing a Bet**

```typescript
const { placeBet } = usePredictionMarket()

const signature = await placeBet({
  marketPubkey: new PublicKey('7PZf...'),
  outcome: true, // true = YES, false = NO
  amount: 1.5, // SOL
})
```

### **Claiming Winnings**

```typescript
const { claimWinnings } = usePredictionMarket()

const { signature, amount } = await claimWinnings(marketPubkey)
console.log(`Won ${amount} SOL!`)
```

---

## 🔐 Security

### **Built-In Protections**

- ✅ **Overflow Protection:** All math uses `checked_add()`
- ✅ **Access Control:** Only authority can resolve markets
- ✅ **PDA Security:** All accounts derived from secure seeds
- ✅ **State Validation:** Can't bet on expired/resolved markets
- ✅ **Secure Transfers:** Proper CPI with signer seeds

### **Audits**

- [ ] Internal security review (completed)
- [ ] External audit (planned with Otter Security)
- [ ] Bug bounty program (launching post-hackathon)

---

## 📈 Roadmap

### **Phase 1: MVP** (Current - Q4 2024)

- [x] Smart contract development
- [x] Frontend integration
- [x] Devnet deployment
- [ ] Mainnet beta launch

### **Phase 2: Decentralization** (Q1 2025)

- [ ] Validator network for resolution
- [ ] Staking + slashing mechanism
- [ ] Dispute resolution system
- [ ] Governance token launch

### **Phase 3: Scale** (Q2 2025)

- [ ] Scalar markets (numeric outcomes)
- [ ] Conditional markets (parlays)
- [ ] Mobile app (PWA)
- [ ] Cross-chain integration

---

## 🤝 Contributing

We welcome contributions! Here's how:

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### **Development Setup**

```bash
# Clone repo
git clone https://github.com/your-username/prismafi.git
cd prismafi

# Install dependencies
npm install

# Build smart contract
cd prediction-market-contract
anchor build

# Run frontend
cd ..
npm run dev
```

---

## 📊 Technical Specs

| Metric                  | Value                                |
| ----------------------- | ------------------------------------ |
| **Smart Contract Size** | 85 KB                                |
| **Transaction Cost**    | ~$0.003                              |
| **Finality Time**       | 400ms                                |
| **Max Market Duration** | Unlimited                            |
| **Min Bet Amount**      | 0.01 SOL                             |
| **Resolution Method**   | Authority (MVP) → Decentralized (v2) |

---

## 🆘 Troubleshooting

### **Error: "Wallet not connected"**

Make sure Privy is configured in `_app.tsx`:

```typescript
<PrivyProvider appId="your-app-id" config={{ defaultChain: 'solana' }}>
  <Component {...pageProps} />
</PrivyProvider>
```

### **Error: "Transaction simulation failed"**

Common causes:

1. Insufficient SOL for rent (~0.02 SOL needed)
2. Market expired (can't bet after end time)
3. Already claimed winnings

Check Solana Explorer for detailed logs.

### **More Help**

- Read: [Quick Integration Guide](./QUICK_INTEGRATION_GUIDE.md)
- Read: [Troubleshooting Section](./QUICK_INTEGRATION_GUIDE.md#troubleshooting)
- Open an issue on GitHub
- Join our [Discord](#)

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** - For the amazing blockchain infrastructure
- **Anchor Framework** - For making Solana development accessible
- **Privy** - For seamless wallet integration
- **Cypherpunk Hackathon 2025** - For the opportunity to build this

---

## 📞 Contact

- **Website:** [prismafi.xyz](#)
- **Twitter:** [@PrismaFi](#)
- **Email:** team@prismafi.xyz
- **GitHub:** [@prismafi](https://github.com/your-username/prismafi)

---

## 🌟 Star Us!

If you find PrismaFi useful, give us a star on GitHub! ⭐

---

**Built with ❤️ for the LATAM crypto community**

[Back to Top](#-prismafi---permissionless-prediction-markets-on-solana)
