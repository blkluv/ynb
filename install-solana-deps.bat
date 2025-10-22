@echo off
echo ========================================
echo Installing Solana Dependencies
echo ========================================
echo.

echo [1/4] Installing @solana/web3.js...
call npm install @solana/web3.js

echo.
echo [2/4] Installing @project-serum/anchor...
call npm install @project-serum/anchor

echo.
echo [3/4] Installing js-sha256...
call npm install js-sha256

echo.
echo [4/4] Installing @coral-xyz/anchor...
call npm install @coral-xyz/anchor

echo.
echo ========================================
echo ✅ Installation Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Deploy smart contract to Solana Playground
echo 2. Copy Program ID and update src/lib/solana-integration.ts
echo 3. Download IDL and save to src/idl/prediction_market.json
echo.
pause



