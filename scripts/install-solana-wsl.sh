#!/bin/bash
# Script de instalación de Solana en WSL

set -e

echo "🚀 Instalando Solana CLI..."

# Configurar variables
SOLANA_VERSION="v1.18.22"
INSTALL_DIR="$HOME/.local/share/solana"

# Crear directorio
mkdir -p "$INSTALL_DIR"

# Descargar e instalar
if command -v curl &> /dev/null; then
    sh -c "$(curl -sSfL https://release.solana.com/$SOLANA_VERSION/install)"
elif command -v wget &> /dev/null; then
    sh -c "$(wget -qO- https://release.solana.com/$SOLANA_VERSION/install)"
else
    echo "❌ Error: curl o wget requeridos"
    exit 1
fi

# Configurar PATH
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Agregar a .bashrc si no existe
if ! grep -q "solana/install/active_release/bin" ~/.bashrc; then
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
fi

# Verificar instalación
if solana --version; then
    echo "✅ Solana CLI instalado correctamente"
else
    echo "❌ Error en la instalación"
    exit 1
fi




