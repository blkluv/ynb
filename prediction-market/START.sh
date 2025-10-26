#!/bin/bash

# Script para iniciar el servidor de predicción de mercados
# Uso: bash START.sh

clear

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║   🎯 PrismaFi - Accountability Markets for LATAM          ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Verificar si ya hay un servidor corriendo
if curl -s http://localhost:3000 >/dev/null 2>&1; then
    echo "✅ Servidor ya está corriendo en: http://localhost:3000"
    echo ""
    echo "📱 Abre tu navegador en:"
    echo "   👉 http://localhost:3000"
    echo ""
    exit 0
fi

if curl -s http://localhost:3001 >/dev/null 2>&1; then
    echo "✅ Servidor ya está corriendo en: http://localhost:3001"
    echo ""
    echo "📱 Abre tu navegador en:"
    echo "   👉 http://localhost:3001"
    echo ""
    exit 0
fi

# Matar procesos anteriores si existen
echo "🧹 Limpiando procesos anteriores..."
pkill -f "next dev" 2>/dev/null
sleep 1

# Iniciar servidor
echo "🚀 Iniciando servidor de desarrollo..."
echo ""
echo "⏳ Espera 5-10 segundos..."
echo ""

cd /home/edgadafi/cypherpunk-hackathon2025/prediction-market

# Verificar que node_modules exista
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules no encontrado. Instalando dependencias..."
    npm install
    echo ""
fi

# Iniciar servidor
npm run dev

