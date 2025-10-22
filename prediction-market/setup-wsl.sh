#!/bin/bash

echo "========================================="
echo "  PrismaFi - WSL Setup"
echo "========================================="
echo ""

# Limpiar instalaciones de Windows
echo "🧹 Cleaning Windows installation..."
rm -rf node_modules
rm -rf .next
rm -rf package-lock.json

echo ""
echo "📦 Installing dependencies for WSL/Linux..."
npm install --legacy-peer-deps

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server, run:"
echo "  npm run dev"
echo ""


























