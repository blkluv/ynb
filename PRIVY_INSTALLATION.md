# Privy Installation Guide for PrismaFi

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Privy App ID (get one at https://dashboard.privy.io)

## Installation Steps

### 1. Install Privy Dependencies

```bash
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market"

# Install Privy
npm install @privy-io/react-auth --legacy-peer-deps

# Or with exact version (recommended)
npm install @privy-io/react-auth@1.77.0 --legacy-peer-deps
```

### 2. Get Your Privy App ID

1. Go to https://dashboard.privy.io
2. Create a new app or use existing
3. Copy your App ID
4. Add it to your `.env.local` file

### 3. Configure Environment Variables

Create or update `.env.local` in the project root:

```env
# Privy Configuration
NEXT_PUBLIC_PRIVY_APP_ID=your-privy-app-id-here

# Solana Configuration
NEXT_PUBLIC_SOLANA_NETWORK=devnet
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com

# Optional: For production
# NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
# NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
```

### 4. Verify Installation

```bash
npm run dev
```

Visit http://localhost:3000 and click "Connect Wallet"

## Privy Features Enabled

✅ **Email Login** - Users can sign in with email
✅ **Social Logins** - Google, Twitter, Discord, etc.
✅ **Wallet Connection** - Phantom, Solflare, etc.
✅ **Embedded Wallets** - Auto-created wallets for users
✅ **Multi-chain Support** - Solana ready
✅ **Session Management** - Persistent authentication
✅ **Security** - MFA, biometrics support

## Troubleshooting

### Issue: ERESOLVE errors during installation

**Solution:**
```bash
npm install @privy-io/react-auth --legacy-peer-deps --force
```

### Issue: Module not found after installation

**Solution:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: Privy App ID not found

**Solution:**
- Make sure `.env.local` exists in project root
- Restart dev server after adding env variables
- Check that variable name matches: `NEXT_PUBLIC_PRIVY_APP_ID`

## Solana Wallet Adapter Alternative

If you prefer to use the standard Solana wallet adapter instead of Privy:

```bash
# Already installed in this project:
npm install @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets
```

## Next Steps

After installation:
1. ✅ Configure Privy App ID
2. ✅ Test wallet connection in development
3. ✅ Configure production settings
4. ✅ Enable desired login methods in Privy dashboard
5. ✅ Test transaction signing

## Resources

- 📚 Privy Docs: https://docs.privy.io
- 🎯 Privy Dashboard: https://dashboard.privy.io
- 💬 Privy Discord: https://discord.gg/privy
- 🔗 Solana Docs: https://docs.solana.com

---

**Note:** The integration code has been created and is ready to use once you install the dependency.
















