#!/bin/bash
# Script de deployment a Devnet

set -e

echo "🚀 Deployment a Solana Devnet"
echo "=============================="

# Cargar entorno completo
source ~/.cargo/env
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/releases/stable-5466f4592b1983adb13ba0a5d53f41ea2de69fba/solana-release/bin:$PATH"

# Cambiar a directorio del contrato
cd "$(dirname "$0")/prediction-market-contract"

echo ""
echo "1️⃣ Configurando Solana para Devnet..."
solana config set --url https://api.devnet.solana.com

echo ""
echo "2️⃣ Verificando balance de la wallet..."
BALANCE=$(solana balance 2>/dev/null || echo "0")
echo "Balance actual: $BALANCE SOL"

if [[ "$BALANCE" == "0 SOL" ]] || [[ "$BALANCE" == "0" ]]; then
    echo ""
    echo "⚠️  Balance bajo, solicitando airdrop..."
    solana airdrop 2 || echo "⚠️  Airdrop falló (puede ser rate limit)"
fi

echo ""
echo "3️⃣ Compilando contrato..."
anchor build

echo ""
echo "4️⃣ Desplegando a Devnet..."
anchor deploy

echo ""
echo "5️⃣ Obteniendo Program ID..."
PROGRAM_ID=$(solana address -k target/deploy/prediction_market-keypair.json)
echo ""
echo "✅ ¡Deployment exitoso!"
echo ""
echo "📍 Program ID: $PROGRAM_ID"
echo ""
echo "🔗 Explorador: https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""
echo "📝 Próximos pasos:"
echo "   1. Copia el Program ID"
echo "   2. Actualízalo en: prediction-market/src/lib/solana/programId.ts"
echo "   3. Genera el nuevo IDL: anchor idl parse -f programs/prediction_market/src/lib.rs"
echo "   4. Actualiza el IDL en: prediction-market/src/lib/solana/idl.ts"

