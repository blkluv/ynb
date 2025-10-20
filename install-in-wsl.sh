#!/bin/bash
# Script de instalación de Solana + Anchor en WSL

echo "=================================================="
echo "  Instalando Solana Development Tools en WSL   "
echo "=================================================="
echo ""

# Colores
GREEN='\033[0;32m'
CYAN='\033[0;36m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 1. Actualizar sistema
echo -e "${CYAN}[1/5] Actualizando sistema...${NC}"
sudo apt-get update -qq
sudo apt-get upgrade -y -qq

# 2. Instalar dependencias
echo -e "${CYAN}[2/5] Instalando dependencias...${NC}"
sudo apt-get install -y -qq \
    build-essential \
    pkg-config \
    libudev-dev \
    llvm \
    libclang-dev \
    protobuf-compiler \
    libssl-dev \
    curl \
    git

echo -e "${GREEN}✓ Dependencias instaladas${NC}"

# 3. Instalar Rust (si no está instalado)
echo -e "${CYAN}[3/5] Verificando Rust...${NC}"
if ! command -v rustc &> /dev/null; then
    echo -e "${YELLOW}Instalando Rust...${NC}"
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "$HOME/.cargo/env"
    echo -e "${GREEN}✓ Rust instalado${NC}"
else
    echo -e "${GREEN}✓ Rust ya instalado: $(rustc --version)${NC}"
fi

# Asegurar que cargo esté en el PATH
export PATH="$HOME/.cargo/bin:$PATH"

# 4. Instalar Solana CLI
echo -e "${CYAN}[4/5] Instalando Solana CLI...${NC}"
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"

# Agregar Solana al PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"
echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc

# Verificar instalación
solana --version
echo -e "${GREEN}✓ Solana CLI instalado${NC}"

# 5. Instalar Anchor
echo -e "${CYAN}[5/5] Instalando Anchor Framework...${NC}"
echo -e "${YELLOW}Esto puede tomar 10-15 minutos...${NC}"

# Instalar AVM (Anchor Version Manager)
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force

# Agregar cargo bin al PATH si no está
export PATH="$HOME/.cargo/bin:$PATH"

# Instalar Anchor 0.29.0
avm install 0.29.0
avm use 0.29.0

echo -e "${GREEN}✓ Anchor instalado${NC}"

# Verificar instalaciones
echo ""
echo "=================================================="
echo -e "${GREEN}  ✓ Instalación Completada${NC}"
echo "=================================================="
echo ""
echo "Herramientas instaladas:"
echo "  Rust:   $(rustc --version)"
echo "  Cargo:  $(cargo --version)"
echo "  Solana: $(solana --version)"
echo "  Anchor: $(anchor --version)"
echo ""

# 6. Configurar Solana
echo -e "${CYAN}Configurando Solana para Devnet...${NC}"
solana config set --url https://api.devnet.solana.com

echo ""
echo "=================================================="
echo -e "${GREEN}  🎉 ¡Todo listo para desarrollar!${NC}"
echo "=================================================="
echo ""
echo "Próximos pasos:"
echo "  1. Generar wallet: solana-keygen new"
echo "  2. Obtener SOL:    solana airdrop 2"
echo "  3. cd /mnt/c/Users/edgar/cypherpunk\ hackathon2025/prediction-market-latam"
echo "  4. Build:          anchor build"
echo "  5. Deploy:         anchor deploy --provider.cluster devnet"
echo ""







