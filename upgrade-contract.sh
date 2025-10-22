#!/bin/bash
# Script para hacer upgrade del contrato en Devnet

set -e

echo "🔄 Upgrade del Smart Contract"
echo "=============================="

# Configurar PATH completo
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/releases/stable-5466f4592b1983adb13ba0a5d53f41ea2de69fba/solana-release/bin:$PATH"

# Cambiar a directorio del contrato
cd "$(dirname "$0")/prediction-market-contract"

# Program ID
PROGRAM_ID="5RkwWAaXDWKhEDmw8XQsoDqUvbZAphqoeZNX5tFmE6o8"

echo ""
echo "1️⃣ Configurando Solana para Devnet..."
solana config set --url https://api.devnet.solana.com

echo ""
echo "2️⃣ Verificando balance..."
BALANCE=$(solana balance)
echo "Balance: $BALANCE"

echo ""
echo "3️⃣ Haciendo upgrade del programa..."
echo "Program ID: $PROGRAM_ID"
echo "Binary: target/deploy/prediction_market.so"

solana program deploy \
  --program-id $PROGRAM_ID \
  target/deploy/prediction_market.so \
  --url devnet

echo ""
echo "✅ ¡Upgrade exitoso!"
echo ""
echo "🔗 Explorador: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
echo "📝 El contrato ahora tiene el Program ID correcto en declare_id!"




