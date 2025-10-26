#!/bin/bash

# Script para verificar el servidor Next.js
# Uso: bash check-server.sh

echo ""
echo "🔍 Verificando servidor Next.js..."
echo ""

# Verificar puerto 3000
if nc -z localhost 3000 2>/dev/null || curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Servidor corriendo en: http://localhost:3000"
    echo ""
    echo "📱 Abre tu navegador en:"
    echo "   👉 http://localhost:3000"
    echo "   👉 http://localhost:3000/create-market"
    echo ""
    exit 0
fi

# Verificar puerto 3001
if nc -z localhost 3001 2>/dev/null || curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Servidor corriendo en: http://localhost:3001"
    echo ""
    echo "📱 Abre tu navegador en:"
    echo "   👉 http://localhost:3001"
    echo "   👉 http://localhost:3001/create-market"
    echo ""
    exit 0
fi

# Verificar puerto 3002
if nc -z localhost 3002 2>/dev/null || curl -s http://localhost:3002 >/dev/null 2>&1; then
    echo "✅ Servidor corriendo en: http://localhost:3002"
    echo ""
    echo "📱 Abre tu navegador en:"
    echo "   👉 http://localhost:3002"
    echo "   👉 http://localhost:3002/create-market"
    echo ""
    exit 0
fi

# No se encontró el servidor
echo "❌ Servidor no está corriendo"
echo ""
echo "💡 Para iniciar el servidor:"
echo "   cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market"
echo "   npm run dev"
echo ""
echo "⏳ Espera unos segundos y ejecuta este script de nuevo:"
echo "   bash check-server.sh"
echo ""

