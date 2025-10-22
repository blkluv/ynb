#!/bin/bash
# Script para actualizar el IDL en el frontend después del deployment

set -e

echo "🔄 Actualizando IDL en el frontend"
echo "==================================="

# Cargar entorno
source ~/.cargo/env
export PATH="$HOME/.local/share/solana/install/active_release/bin:$PATH"

# Directorios
CONTRACT_DIR="$(dirname "$0")/prediction-market-contract"
FRONTEND_DIR="$(dirname "$0")/prediction-market"

echo ""
echo "1️⃣ Generando IDL desde el contrato..."
cd "$CONTRACT_DIR"

# Generar IDL
anchor idl parse -f programs/prediction_market/src/lib.rs > /tmp/prediction_market_idl.json

echo ""
echo "2️⃣ Obteniendo Program ID..."
if [ -f "target/deploy/prediction_market-keypair.json" ]; then
    PROGRAM_ID=$(solana address -k target/deploy/prediction_market-keypair.json)
    echo "Program ID: $PROGRAM_ID"
else
    echo "⚠️  Keypair no encontrado, usa el ID existente"
    PROGRAM_ID="6b4kfh6kr9X6ka2H5C1qhK1jdnGmX65Ni85pC5qzLQB7"
fi

echo ""
echo "3️⃣ Generando archivo TypeScript para el frontend..."

cat > "$FRONTEND_DIR/src/lib/solana/idl.ts" << EOF
// IDL generado automáticamente - NO EDITAR MANUALMENTE
// Generado: $(date)
// Program ID: $PROGRAM_ID

export const IDL = $(cat /tmp/prediction_market_idl.json | jq ". + {address: \"$PROGRAM_ID\", metadata: {name: \"prediction_market\", version: \"0.1.0\", spec: \"0.1.0\", address: \"$PROGRAM_ID\"}}") as const

export type PredictionMarket = typeof IDL;
EOF

echo ""
echo "4️⃣ Actualizando Program ID en programId.ts..."
sed -i "s|new PublicKey('[^']*')|new PublicKey('$PROGRAM_ID')|" "$FRONTEND_DIR/src/lib/solana/programId.ts"

echo ""
echo "✅ IDL actualizado correctamente!"
echo ""
echo "📝 Archivos actualizados:"
echo "   - $FRONTEND_DIR/src/lib/solana/idl.ts"
echo "   - $FRONTEND_DIR/src/lib/solana/programId.ts"
echo ""
echo "🔄 Recuerda reiniciar el servidor de desarrollo:"
echo "   cd prediction-market && npm run dev"

