#!/bin/bash
set -e

echo "=================================="
echo "🚀 SETUP SOLANA LOCAL - AUTOMÁTICO"
echo "=================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# PASO 1: Instalar Solana CLI
echo -e "${YELLOW}📦 Paso 1: Instalando Solana CLI...${NC}"
if command -v solana &> /dev/null; then
    echo -e "${GREEN}✅ Solana CLI ya instalado$(NC}"
    solana --version
else
    echo "Instalando Solana CLI..."
    sh -c "$(curl -sSfL https://release.solana.com/v1.18.0/install)"
    
    # Agregar al PATH
    export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
    
    echo -e "${GREEN}✅ Solana CLI instalado${NC}"
    solana --version
fi
echo ""

# PASO 2: Configurar Devnet
echo -e "${YELLOW}🌐 Paso 2: Configurando Devnet...${NC}"
solana config set --url https://api.devnet.solana.com
echo -e "${GREEN}✅ Devnet configurado${NC}"
echo ""

# PASO 3: Crear/Verificar Wallet
echo -e "${YELLOW}👛 Paso 3: Configurando wallet...${NC}"
if [ -f ~/.config/solana/id.json ]; then
    echo -e "${GREEN}✅ Wallet ya existe${NC}"
else
    echo "Creando nuevo wallet..."
    mkdir -p ~/.config/solana
    solana-keygen new --outfile ~/.config/solana/id.json --no-bip39-passphrase --force
    echo -e "${GREEN}✅ Wallet creado${NC}"
fi

WALLET_ADDRESS=$(solana address)
echo "📍 Wallet Address: $WALLET_ADDRESS"
echo ""

# PASO 4: Airdrop
echo -e "${YELLOW}💰 Paso 4: Solicitando SOL de prueba...${NC}"
solana balance
echo "Solicitando airdrop..."
solana airdrop 2 || echo "⚠️  Airdrop falló (rate limit), continúa si ya tienes SOL"
sleep 2
solana balance
echo ""

# PASO 5: Build
echo -e "${YELLOW}🔨 Paso 5: Building contrato...${NC}"
cd "/mnt/c/Users/edgar/cypherpunk hackathon2025/prediction-market-contract"
anchor build
echo -e "${GREEN}✅ Build completo${NC}"
echo ""

# PASO 6: Deploy
echo -e "${YELLOW}🚀 Paso 6: Deploying a Devnet...${NC}"
anchor deploy --provider.cluster devnet
echo -e "${GREEN}✅ Deploy completo${NC}"
echo ""

# PASO 7: Program ID
PROGRAM_ID=$(solana address -k target/deploy/prediction_market-keypair.json)
echo "=================================="
echo -e "${GREEN}✨ DEPLOYMENT EXITOSO ✨${NC}"
echo "=================================="
echo ""
echo "📍 Program ID: $PROGRAM_ID"
echo "🌐 Network: Devnet"
echo "👛 Wallet: $WALLET_ADDRESS"
echo ""

# PASO 8: Copiar IDL
echo -e "${YELLOW}📄 Paso 7: Copiando IDL...${NC}"
mkdir -p "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/idl"
cp target/idl/prediction_market.json "/mnt/c/Users/edgar/cypherpunk hackathon2025/src/idl/prediction_market.json"
echo -e "${GREEN}✅ IDL copiado${NC}"
echo ""

echo "=================================="
echo "🎉 SETUP COMPLETO"
echo "=================================="
echo ""
echo "🎯 PRÓXIMOS PASOS:"
echo ""
echo "1. Actualiza el Program ID en src/lib/solana-integration.ts:"
echo "   export const PROGRAM_ID = new PublicKey(\"$PROGRAM_ID\");"
echo ""
echo "2. Ejecuta el frontend:"
echo "   npm run dev"
echo ""
echo "3. ¡Conecta tu wallet y prueba!"
echo ""
echo "📊 Verifica tu deploy en Solana Explorer:"
echo "https://explorer.solana.com/address/$PROGRAM_ID?cluster=devnet"
echo ""

