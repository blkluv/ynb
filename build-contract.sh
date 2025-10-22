#!/bin/bash
# Script para compilar el contrato con el PATH correcto

set -e

echo "🔨 Compilando contrato de predicción..."
echo "========================================"

# Configurar PATH completo
export PATH="$HOME/.cargo/bin:$HOME/.local/share/solana/install/releases/stable-5466f4592b1983adb13ba0a5d53f41ea2de69fba/solana-release/bin:$PATH"

# Verificar herramientas
echo ""
echo "✅ Verificando herramientas..."
echo "Rust: $(cargo --version)"
echo "Anchor: $(anchor --version)"
echo "Solana: $(solana --version)"
echo "cargo-build-sbf: $(cargo-build-sbf --version)"

# Ir al directorio del contrato
cd "$(dirname "$0")/prediction-market-contract"

echo ""
echo "📦 Compilando con Anchor..."
anchor build

echo ""
echo "✅ ¡Compilación exitosa!"
echo ""
echo "📁 Archivos generados:"
ls -lh target/deploy/*.so target/deploy/*.json 2>/dev/null || true

echo ""
echo "🔄 Próximo paso: Desplegar a Devnet"
echo "    Ejecuta: ./deploy-to-devnet.sh"

