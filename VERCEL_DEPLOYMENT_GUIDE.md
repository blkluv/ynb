# 🚀 Vercel Deployment Guide - PrismaFi

## Quick Deploy

### Method 1: Vercel Dashboard (Recommended)

1. **Go to Vercel**: https://vercel.com/new
2. **Import Git Repository**:

   - Click "Import Project"
   - Select "Import Git Repository"
   - Paste: `https://github.com/Edgadafi/prismafi-prediction-market`
   - Click "Import"

3. **Configure Project**:

   ```
   Project Name: prismafi-prediction-market
   Framework Preset: Next.js
   Root Directory: ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install --legacy-peer-deps
   ```

4. **Environment Variables**:
   Add these variables in the "Environment Variables" section:

   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=devnet
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
   ```

5. **Click "Deploy"** and wait ~2-3 minutes

6. **Your app will be live at**:
   ```
   https://prismafi-prediction-market.vercel.app
   ```

---

### Method 2: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy from project directory
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market"
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (select your account)
# - Link to existing project? No
# - Project name: prismafi-prediction-market
# - Directory: ./
# - Override settings? No

# For production deployment
vercel --prod
```

---

## ⚙️ Vercel Configuration Files

The project already includes:

### `vercel.json`

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "framework": "nextjs",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### `package.json` scripts

```json
{
  "dev": "next dev --turbopack",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

---

## 🔧 Post-Deployment Checklist

After deployment, verify:

- [ ] Landing page loads correctly
- [ ] Wallet connection works (Phantom, Solflare)
- [ ] Markets page displays mock data
- [ ] Portfolio page shows when wallet connected
- [ ] Create Market page has wallet gate
- [ ] All images load (logo, icons)
- [ ] Tailwind styles applied correctly
- [ ] No console errors

---

## 🌐 Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Domains"
3. Add your custom domain:
   ```
   prismafi.io
   www.prismafi.io
   ```
4. Follow DNS configuration instructions
5. Wait for SSL certificate (automatic)

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module '@solana/wallet-adapter-react'`
**Fix**: Ensure `installCommand` is set to `npm install --legacy-peer-deps`

### Environment Variables Not Working

**Error**: Variables showing as `undefined`
**Fix**:

1. Go to Project Settings → Environment Variables
2. Add variables for **Production**, **Preview**, and **Development**
3. Redeploy

### Turbopack Warning in Production

**Error**: Turbopack warning in build logs
**Fix**: Already fixed - `package.json` uses `next build` (not `--turbopack`)

### Wallet Connection Issues

**Error**: Wallet adapter errors
**Fix**:

1. Check that RPC URL is accessible
2. Verify network is set to `devnet` or `mainnet-beta`
3. Check browser console for specific errors

---

## 📊 Performance Optimization

### Recommended Vercel Settings

- **Build & Development Settings**:

  - Node.js Version: 18.x (or later)
  - Install Command: `npm install --legacy-peer-deps`
  - Build Command: `npm run build`
  - Output Directory: `.next`

- **Git Integration**:

  - Auto-deploy: `main` branch
  - Preview deployments: All PRs
  - Deployment protection: None (for hackathon)

- **Edge Functions**: Not needed for this project

---

## 🎯 Production Deployment

For mainnet deployment:

1. Update environment variables:

   ```env
   NEXT_PUBLIC_SOLANA_NETWORK=mainnet-beta
   NEXT_PUBLIC_SOLANA_RPC_URL=https://api.mainnet-beta.solana.com
   ```

2. Consider using a dedicated RPC provider:

   - **Helius**: https://helius.xyz
   - **QuickNode**: https://quicknode.com
   - **Alchemy**: https://alchemy.com

3. Update Program ID to mainnet deployment

4. Deploy:
   ```bash
   vercel --prod
   ```

---

## 📈 Monitoring

Vercel provides built-in analytics:

- **Performance**: Response times, TTFB
- **Visitors**: Page views, unique visitors
- **Errors**: Runtime errors, build failures

Access at: https://vercel.com/[your-username]/prismafi-prediction-market/analytics

---

## 🔄 Continuous Deployment

Automatic deployments are configured for:

- ✅ **Push to `main`** → Production deployment
- ✅ **Pull Requests** → Preview deployment
- ✅ **Branch pushes** → Preview deployment

---

## 📞 Support

If you encounter issues:

1. Check Vercel deployment logs
2. Review browser console errors
3. Verify environment variables
4. Check GitHub Actions (if configured)

---

**Deployment Status**: ⏳ Ready to deploy
**Repository**: https://github.com/Edgadafi/prismafi-prediction-market
**Estimated Deploy Time**: 2-3 minutes

---

Good luck! 🚀









