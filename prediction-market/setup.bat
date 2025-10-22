@echo off
echo 🚀 Creating Prediction Market project...

set /p PROJECT_NAME="Project name (default: prediction-market): "
if "%PROJECT_NAME%"=="" set PROJECT_NAME=prediction-market

echo Creating Next.js project...
npx create-next-app@latest %PROJECT_NAME% --typescript --tailwind --eslint --app --src-dir --turbopack --import-alias "@/*" --use-npm --yes

cd %PROJECT_NAME%

echo 📦 Installing dependencies...
npm install @solana/web3.js @solana/wallet-adapter-base @solana/wallet-adapter-react @solana/wallet-adapter-react-ui @solana/wallet-adapter-wallets @headlessui/react @heroicons/react lucide-react clsx tailwind-merge @tanstack/react-query zustand swr recharts react-hot-toast date-fns numeral -D @types/numeral

echo 📁 Creating folder structure...
mkdir src\components\layout
mkdir src\components\market
mkdir src\components\filters
mkdir src\components\prophets
mkdir src\components\impact
mkdir src\components\nft
mkdir src\components\share
mkdir src\components\ui
mkdir src\app\market
mkdir src\app\portfolio
mkdir src\app\activity
mkdir src\app\squads
mkdir src\app\prophets
mkdir src\app\truth-mirror
mkdir src\lib
mkdir src\store
mkdir src\styles
mkdir src\types

echo ✅ Setup complete!
echo 📂 Project created in: %PROJECT_NAME%
echo.
echo Next steps:
echo 1. cd %PROJECT_NAME%
echo 2. npm run dev
echo 3. cursor .
echo.
echo 🚀 Ready to build!
pause































