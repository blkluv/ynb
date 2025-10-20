# 🎯 PrismaFi - Decentralized Prediction Markets on Solana

> **Predict the future. Win tokens. Built on Solana.**

[![Deployed on Vercel](https://img.shields.io/badge/Deployed-Vercel-black?logo=vercel)](https://cypherpunk-hackathon2025.vercel.app)
[![Built with Next.js](https://img.shields.io/badge/Built_with-Next.js_14-000000?logo=next.js)](https://nextjs.org)
[![Solana](https://img.shields.io/badge/Blockchain-Solana-9945FF?logo=solana)](https://solana.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178C6?logo=typescript)](https://www.typescriptlang.org/)

---

## 🚀 **Live Demo**

**🌐 [cypherpunk-hackathon2025.vercel.app](https://cypherpunk-hackathon2025.vercel.app)**

---

## ✨ **Features**

### **For Users:**

- 🔐 **Seamless Wallet Connection** - Connect with Phantom, Solflare, or any Solana wallet via Privy
- 📊 **Real-time Trading** - Buy and sell prediction shares instantly
- 🎯 **Create Markets** - Launch your own prediction markets on any topic
- 💰 **Track Positions** - Monitor your P&L and active positions
- 📱 **Mobile-First Design** - Beautiful, responsive UI that works everywhere
- 🔔 **Toast Notifications** - Real-time feedback with Solana Explorer links
- 💾 **Data Persistence** - Your trades and markets persist using localStorage

### **For Developers:**

- ⚡ **Next.js 14** - Latest App Router architecture
- 🎨 **Tailwind CSS** - Modern, utility-first styling
- 🔷 **TypeScript** - 100% type-safe codebase
- 🔗 **Privy Auth** - Drop-in wallet authentication
- 🧪 **Production Ready** - Optimized build, zero errors
- 📦 **Clean Architecture** - Service layer, reusable components

---

## 🎬 **Quick Start**

### **Prerequisites**

- Node.js 18+
- npm or yarn
- A Solana wallet (Phantom recommended)

### **Installation**

```bash
# Clone repository
git clone https://github.com/Edgadafi/cypherpunk-hackathon2025.git
cd cypherpunk-hackathon2025

# Install dependencies
npm install --legacy-peer-deps

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### **Build for Production**

```bash
npm run build
npm start
```

---

## 📁 **Project Structure**

```
cypherpunk-hackathon2025/
├── src/
│   ├── app/                      # Next.js App Router pages
│   │   ├── page.tsx             # Landing page
│   │   ├── markets/             # Markets listing
│   │   ├── market/[id]/         # Individual market page
│   │   └── create-market/       # Market creation form
│   ├── components/              # React components
│   │   ├── layout/              # Layout components
│   │   └── market/              # Market-specific components
│   ├── lib/                     # Business logic
│   │   └── marketService.ts    # Core service layer
│   ├── hooks/                   # Custom React hooks
│   ├── providers/               # Context providers
│   ├── types/                   # TypeScript type definitions
│   └── styles/                  # Global styles
├── public/                      # Static assets
├── prediction-market-latam/     # Anchor smart contracts (Rust)
└── docs/                        # Documentation
```

---

## 🛠️ **Tech Stack**

### **Frontend**

- **Framework:** Next.js 14 (React 18)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** Headless UI, Heroicons
- **Notifications:** react-hot-toast
- **Wallet Auth:** Privy

### **Blockchain (In Development)**

- **Chain:** Solana
- **Framework:** Anchor 0.29.0
- **Language:** Rust
- **Network:** Devnet (testing), Mainnet (production)

### **Deployment**

- **Frontend:** Vercel
- **CI/CD:** GitHub Actions
- **Smart Contracts:** Solana Devnet → Mainnet

---

## 🎯 **How It Works**

### **1. Connect Your Wallet**

Use Privy to connect your Solana wallet (Phantom, Solflare, etc.)

### **2. Browse Markets**

Explore prediction markets on crypto, politics, technology, sports, and more.

### **3. Trade Predictions**

Buy "Yes" or "No" shares based on your prediction. Share prices reflect market sentiment.

### **4. Create Markets**

Launch your own markets. Set resolution dates, sources, and options.

### **5. Win Rewards**

When the market resolves, winners split the pool proportionally to their shares.

---

## 📊 **Current Status**

### **✅ Completed**

- [x] Full frontend implementation
- [x] Wallet integration with Privy
- [x] Trading interface with real-time updates
- [x] Market creation flow
- [x] Order book visualization
- [x] Trade history tracking
- [x] User positions management
- [x] Toast notifications with Solana Explorer links
- [x] LocalStorage persistence
- [x] Responsive design
- [x] Deployed to Vercel

### **🚧 In Development**

- [ ] Smart contract deployment to Solana Devnet
- [ ] Integration with on-chain programs
- [ ] Oracle integration for automatic resolution
- [ ] Enhanced AMM (Automated Market Maker)

### **🔮 Roadmap**

- [ ] Liquidity pools
- [ ] Governance token
- [ ] Staking and rewards
- [ ] Mobile app (React Native)
- [ ] Analytics dashboard
- [ ] Social features (comments, shares)

---

## 🎨 **Screenshots**

### Landing Page

![Landing Page](docs/screenshots/landing.png)

### Trading Interface

![Trading](docs/screenshots/trading.png)

### Market Creation

![Create Market](docs/screenshots/create-market.png)

---

## 📚 **Documentation**

Comprehensive documentation available in the `/docs` folder:

- **[PROYECTO_FINAL_HACKATHON.md](PROYECTO_FINAL_HACKATHON.md)** - Complete project overview
- **[TEST_MANUAL_RAPIDO.md](TEST_MANUAL_RAPIDO.md)** - Testing checklist
- **[RESUMEN_EJECUTIVO_FINAL.md](RESUMEN_EJECUTIVO_FINAL.md)** - Executive summary
- **[ALTERNATIVA_SIN_WSL.md](ALTERNATIVA_SIN_WSL.md)** - Development strategy

---

## 🧪 **Testing**

### **Run Tests**

```bash
# Build test (verify compilation)
npm run build

# Manual testing checklist
# See TEST_MANUAL_RAPIDO.md for detailed steps
```

### **Test Coverage**

- Landing page rendering
- Wallet connection flow
- Trading execution
- Market creation
- LocalStorage persistence
- Toast notifications
- Responsive design

---

## 🤝 **Contributing**

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 **Team**

- **Developer:** [Your Name]
- **Hackathon:** Cypherpunk 2025
- **Built with:** ❤️ and ☕

---

## 📞 **Contact**

- **Live Demo:** [https://cypherpunk-hackathon2025.vercel.app](https://cypherpunk-hackathon2025.vercel.app)
- **GitHub:** [https://github.com/Edgadafi/cypherpunk-hackathon2025](https://github.com/Edgadafi/cypherpunk-hackathon2025)
- **Issues:** [GitHub Issues](https://github.com/Edgadafi/cypherpunk-hackathon2025/issues)

---

## 🌟 **Acknowledgments**

- **Solana Foundation** - For building an incredible blockchain
- **Privy** - For seamless wallet authentication
- **Vercel** - For amazing deployment experience
- **Next.js Team** - For the best React framework
- **Cypherpunk Hackathon** - For the opportunity

---

## 🏆 **Hackathon Submission**

**Project:** PrismaFi - Decentralized Prediction Markets  
**Category:** DeFi / Prediction Markets  
**Built for:** Cypherpunk Hackathon 2025  
**Blockchain:** Solana  
**Status:** ✅ Demo Ready

### **Key Highlights:**

- ✨ Production-quality frontend
- ⚡ Real-time trading simulation
- 🔐 Privy wallet integration
- 💾 Persistent user data
- 🔔 Professional toast notifications
- 📱 Mobile-responsive design
- 🚀 Deployed on Vercel

---

<div align="center">

**Made with 💜 for the Solana ecosystem**

[Demo](https://cypherpunk-hackathon2025.vercel.app) • [GitHub](https://github.com/Edgadafi/cypherpunk-hackathon2025) • [Documentation](PROYECTO_FINAL_HACKATHON.md)

</div>
