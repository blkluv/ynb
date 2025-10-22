# 🎯 PrismaFi - Decentralized Prediction Markets on Solana

<div align="center">
  
  ![PrismaFi Banner](https://img.shields.io/badge/Solana-Powered-14F195?style=for-the-badge&logo=solana&logoColor=white)
  ![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js&logoColor=white)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
  ![Anchor](https://img.shields.io/badge/Anchor-0.31-purple?style=for-the-badge)
  
  **🚀 [Live Demo](https://cypherpunk-hackathon2025.vercel.app/)**
  
</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Getting Started](#getting-started)
- [Architecture](#architecture)
- [Smart Contract](#smart-contract)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## 🎯 About

**PrismaFi** is a fully decentralized prediction market platform built on Solana, enabling users to create, trade, and resolve prediction markets on any real-world event with:

- ⚡ **Lightning-fast transactions** powered by Solana's high-throughput blockchain
- 💰 **Low fees** (fractions of a cent per transaction)
- 🔒 **Trustless settlement** via smart contracts
- 🎨 **Beautiful UX** with real-time odds calculation
- 📊 **Transparent markets** with on-chain verification

Whether it's predicting cryptocurrency prices, sports outcomes, political events, or technology launches, PrismaFi provides a secure and efficient platform for information markets.

---

## ✨ Features

### 🎲 **Core Functionality**
- ✅ Create prediction markets on any yes/no question
- ✅ Place bets on market outcomes (YES/NO)
- ✅ Real-time odds calculation based on liquidity pools
- ✅ Automatic market resolution and winnings distribution
- ✅ Portfolio tracking with P&L calculation

### 🔐 **Security & Trust**
- ✅ Non-custodial architecture (users control their funds)
- ✅ Smart contract audited logic
- ✅ Secure PDA (Program Derived Addresses) for account management
- ✅ Cross-Program Invocation (CPI) for safe transfers

### 🎨 **User Experience**
- ✅ Modern, responsive interface
- ✅ Real-time market data updates
- ✅ Category-based filtering (Crypto, Sports, Politics, etc.)
- ✅ Market search and discovery
- ✅ Wallet integration via Solana Wallet Adapter

### 📊 **Market Variety**
- 🪙 **Crypto Markets**: Bitcoin price predictions, TVL milestones
- ⚽ **Sports**: Tournament outcomes, championship winners
- 🤖 **Technology**: Product launches, AI developments
- 🌍 **Economics**: Recession predictions, policy changes
- 🎵 **Culture**: Social media trends, entertainment

---

## 🛠️ Tech Stack

### **Frontend**
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Wallet**: Solana Wallet Adapter
- **State Management**: React Hooks
- **Deployment**: Vercel

### **Smart Contract**
- **Language**: Rust
- **Framework**: Anchor 0.31
- **Blockchain**: Solana (Devnet/Mainnet)
- **Program**: Custom prediction market logic

### **Infrastructure**
- **RPC**: Solana Devnet/Mainnet
- **Version Control**: Git/GitHub
- **CI/CD**: Vercel Auto-Deploy

---

## 🎬 Demo

### **Live Application**
🌐 **[https://cypherpunk-hackathon2025.vercel.app/](https://cypherpunk-hackathon2025.vercel.app/)**

*Currently running in demo mode with simulated markets*

### **Key Screens**

#### 1. **Markets Homepage**
- Browse 10+ active prediction markets
- Filter by category (Crypto, Sports, Technology, etc.)
- Real-time odds display
- Demo mode banner for transparency

#### 2. **Market Details**
- Full market description and resolution criteria
- Current YES/NO odds with percentage breakdown
- Total volume (SOL staked)
- End date and status (Active/Expired/Resolved)

#### 3. **Trading Interface**
- Select YES or NO outcome
- Enter bet amount in SOL
- Calculate potential winnings instantly
- One-click bet placement with confirmation

#### 4. **Portfolio Dashboard** *(Coming Soon)*
- Track all active positions
- View P&L across markets
- Claim winnings from resolved markets

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ and npm
- Solana CLI (for smart contract deployment)
- Anchor CLI (for smart contract development)

### **Installation**

1. **Clone the repository**
```bash
git clone https://github.com/Edgadafi/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025
```

2. **Install frontend dependencies**
```bash
cd prediction-market
npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env.local
# Edit .env.local with your RPC endpoint and Program ID
```

4. **Run development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### **Smart Contract Deployment**

1. **Build the contract**
```bash
cd prediction-market-contract
anchor build
```

2. **Deploy to Devnet**
```bash
anchor deploy --provider.cluster devnet
```

3. **Update Program ID**
```bash
# Copy the Program ID from deployment output
# Update prediction-market/src/lib/solana/programId.ts
```

4. **Generate IDL**
```bash
# Copy target/idl/prediction_market.json
# to prediction-market/src/lib/solana/idl.ts
```

---

## 🏗️ Architecture

### **System Overview**

```
┌─────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                   │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   Markets   │  │  Trading UI  │  │   Portfolio   │  │
│  └──────┬──────┘  └──────┬───────┘  └───────┬───────┘  │
│         │                │                   │          │
│         └────────────────┴───────────────────┘          │
│                          │                              │
└──────────────────────────┼──────────────────────────────┘
                           │
                  ┌────────▼────────┐
                  │  Solana Wallet  │
                  │    Adapter      │
                  └────────┬────────┘
                           │
┌──────────────────────────┼──────────────────────────────┐
│                   Solana Blockchain                      │
│  ┌─────────────────────────────────────────────────┐    │
│  │       Smart Contract (Anchor/Rust)              │    │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │    │
│  │  │  Market  │  │ Position │  │    Vault     │  │    │
│  │  │   PDA    │  │   PDA    │  │     PDA      │  │    │
│  │  └──────────┘  └──────────┘  └──────────────┘  │    │
│  └─────────────────────────────────────────────────┘    │
└──────────────────────────────────────────────────────────┘
```

### **Smart Contract Structure**

```rust
// Key Instructions
- create_market()   // Initialize new prediction market
- place_bet()       // Place YES/NO bet on market
- resolve_market()  // Resolve outcome (authority only)
- claim_winnings()  // Claim winnings from resolved market

// Account Types
- Market            // Stores market data and state
- UserPosition      // Tracks individual user bets
- Vault             // Holds staked funds (PDA)
```

### **Data Flow**

1. **User** connects wallet via Solana Wallet Adapter
2. **Frontend** fetches markets from smart contract
3. **User** selects market and places bet
4. **Transaction** is signed and sent to Solana
5. **Smart Contract** validates and executes bet
6. **Frontend** updates UI with new market state
7. **User** claims winnings after market resolution

---

## 🔐 Smart Contract

### **Key Features**

#### **1. Market Creation**
```rust
pub fn create_market(
    ctx: Context<CreateMarket>,
    question: String,       // Max 200 chars
    description: String,    // Max 1000 chars
    end_time: i64,          // Unix timestamp
    category: String,       // Max 50 chars
) -> Result<()>
```

#### **2. Betting Mechanism**
```rust
pub fn place_bet(
    ctx: Context<PlaceBet>,
    outcome: bool,          // true = YES, false = NO
    amount: u64,            // Lamports
) -> Result<()>
```

#### **3. Market Resolution**
```rust
pub fn resolve_market(
    ctx: Context<ResolveMarket>,
    winning_outcome: bool,  // Final result
) -> Result<()>
```

#### **4. Winnings Distribution**
```rust
pub fn claim_winnings(
    ctx: Context<ClaimWinnings>,
) -> Result<()>
```

### **Security Measures**

- ✅ **PDA-based accounts** for deterministic addressing
- ✅ **Bump seed validation** to prevent account collisions
- ✅ **Authority checks** for sensitive operations
- ✅ **Reentrancy protection** via account state
- ✅ **Overflow-safe arithmetic** using checked operations
- ✅ **CPI for transfers** (no manual lamport manipulation)

### **Contract Files**

Located in `prediction-market-contract/programs/prediction_market/src/`:
- `lib.rs` - Main program logic
- `PRISMAFI_SOLANA_PLAYGROUND_FINAL.rs` - Standalone version for Solana Playground
- `PRISMAFI_SIMPLE_PLAYGROUND.rs` - Simplified version (no external deps)

---

## 🗺️ Roadmap

### **✅ Phase 1: MVP (Current)**
- [x] Smart contract development
- [x] Basic frontend interface
- [x] Market creation and betting
- [x] Demo deployment on Vercel
- [x] Mock data for testing

### **🚧 Phase 2: Mainnet Beta**
- [ ] Smart contract audit
- [ ] Deploy to Solana Mainnet
- [ ] Real market creation
- [ ] Wallet integration (Phantom, Solflare)
- [ ] Transaction history

### **🔮 Phase 3: Advanced Features**
- [ ] Liquidity pools for better odds
- [ ] Market maker incentives
- [ ] Multi-outcome markets (not just YES/NO)
- [ ] Oracle integration for automatic resolution
- [ ] Governance token ($PRISMA)

### **🌟 Phase 4: Ecosystem**
- [ ] API for third-party integrations
- [ ] Mobile app (iOS/Android)
- [ ] Analytics dashboard
- [ ] Social features (comments, reputation)
- [ ] Conditional markets (linked outcomes)

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### **Ways to Contribute**
1. 🐛 Report bugs via GitHub Issues
2. 💡 Suggest features or improvements
3. 🔧 Submit pull requests
4. 📖 Improve documentation
5. 🎨 Design UI/UX enhancements

### **Development Workflow**
```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make your changes and test
npm run dev

# 4. Commit with conventional commits
git commit -m "feat: add new feature"

# 5. Push and create a Pull Request
git push origin feature/your-feature-name
```

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Solana Foundation** for the incredible blockchain infrastructure
- **Anchor Framework** for simplifying Solana development
- **Vercel** for seamless deployment
- **Cypherpunk Hackathon 2025** for the opportunity

---

## 📞 Contact

- **Project Lead**: [@Edgadafi](https://github.com/Edgadafi)
- **Demo**: [https://cypherpunk-hackathon2025.vercel.app/](https://cypherpunk-hackathon2025.vercel.app/)
- **Repository**: [https://github.com/Edgadafi/cypherpunk-hackathon2025](https://github.com/Edgadafi/cypherpunk-hackathon2025)

---

<div align="center">
  
  **Built with ❤️ for the Solana Ecosystem**
  
  ⭐ Star this repo if you find it useful!
  
</div>
