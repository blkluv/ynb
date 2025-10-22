#!/bin/bash
# Script completo de instalación de Anchor stack en WSL

set -e

echo "🚀 Instalación completa de Anchor Stack"
echo "========================================"

# 1. Cargar entorno Rust
source ~/.cargo/env

# 2. Configurar PATH de Solana
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# 3. Verificar Rust
echo ""
echo "📦 Verificando Rust..."
cargo --version || { echo "❌ Rust no instalado"; exit 1; }
echo "✅ Rust OK"

# 4. Verificar Solana
echo ""
echo "⛓️  Verificando Solana CLI..."
solana --version || { echo "❌ Solana no instalado"; exit 1; }
echo "✅ Solana OK"

# 5. Instalar AVM
echo ""
echo "🔧 Instalando AVM (Anchor Version Manager)..."
if ! command -v avm &> /dev/null; then
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    echo "✅ AVM instalado"
else
    echo "✅ AVM ya instalado"
fi

# 6. Actualizar PATH para AVM
export PATH="$HOME/.cargo/bin:$PATH"

# 7. Instalar Anchor CLI 0.31.2
echo ""
echo "⚓ Instalando Anchor CLI 0.31.2..."
avm install 0.31.2
avm use 0.31.2

# 8. Agregar PATHs a .bashrc
echo ""
echo "📝 Configurando .bashrc..."
if ! grep -q "solana/install/active_release/bin" ~/.bashrc; then
    echo 'export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"' >> ~/.bashrc
fi

if ! grep -q ".avm/bin" ~/.bashrc; then
    echo 'export PATH="$HOME/.avm/bin:$PATH"' >> ~/.bashrc
fi

# 9. Verificar instalación
echo ""
echo "🧪 Verificando instalación completa..."
echo ""
echo "Rust: $(cargo --version)"
echo "Solana: $(solana --version)"
echo "AVM: $(avm --version)"
echo "Anchor: $(anchor --version)"

echo ""
echo "✅ ¡Instalación completa!"
echo ""
echo "💡 Para usar en nuevas sesiones, ejecuta:"
echo "   source ~/.bashrc"




