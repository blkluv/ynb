#!/bin/bash

echo "========================================"
echo "  TEST BUILD LOCAL - PRISMAFI"
echo "========================================"
echo ""

cd prediction-market

echo "[1/4] Limpiando cache anterior..."
rm -rf .next
rm -rf node_modules/.cache

echo "[2/4] Instalando dependencias..."
npm install --legacy-peer-deps
if [ $? -ne 0 ]; then
    echo "❌ ERROR: Fallo en npm install"
    exit 1
fi

echo "[3/4] Creando .env.local temporal..."
cat > .env.local << EOF
NEXT_PUBLIC_PRIVY_APP_ID=clzmzasg80013jxlxmvimrjmo
NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
EOF

echo "[4/4] Ejecutando build..."
npm run build
if [ $? -ne 0 ]; then
    echo ""
    echo "========================================"
    echo "  ❌ ERROR: BUILD FALLÓ"
    echo "========================================"
    echo ""
    echo "Revisa los errores arriba y corrigelos antes de hacer push."
    exit 1
fi

echo ""
echo "========================================"
echo "  ✅ BUILD EXITOSO!"
echo "========================================"
echo ""
echo "Puedes hacer push a Vercel con confianza:"
echo "  git add ."
echo "  git commit -m \"fix: production build fixes\""
echo "  git push origin main"
echo ""
echo "O iniciar el servidor local para probar:"
echo "  npm start"
echo ""




