#!/bin/bash

echo "🚀 Creating Prediction Market project..."

# Prompt for project name
read -p "Project name (default: prediction-market): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-prediction-market}

# Create Next.js project
npx create-next-app@latest $PROJECT_NAME \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --turbopack \
  --import-alias "@/*" \
  --use-npm \
  --yes

cd $PROJECT_NAME

echo "📦 Installing dependencies..."
npm install \
  @solana/web3.js \
  @solana/wallet-adapter-base \
  @solana/wallet-adapter-react \
  @solana/wallet-adapter-react-ui \
  @solana/wallet-adapter-wallets \
  @headlessui/react \
  @heroicons/react \
  lucide-react \
  clsx \
  tailwind-merge \
  @tanstack/react-query \
  zustand \
  swr \
  recharts \
  react-hot-toast \
  date-fns \
  numeral \
  -D @types/numeral

echo "📁 Creating folder structure..."
mkdir -p src/components/{layout,market,filters,prophets,impact,nft,share,ui}
mkdir -p src/app/{market,portfolio,activity,squads,prophets,truth-mirror}
mkdir -p src/{lib,store,styles,types}

echo "✅ Setup complete!"
echo "📂 Project created in: $PROJECT_NAME"
echo ""
echo "Next steps:"
echo "1. cd $PROJECT_NAME"
echo "2. npm run dev"
echo "3. cursor ."
echo ""
echo "🚀 Ready to build!"































