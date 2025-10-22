#!/bin/bash

echo "========================================="
echo "  PrismaFi - Starting Development Server"
echo "========================================="
echo ""
echo "Project: PrismaFi Prediction Markets"
echo "Directory: $(pwd)"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install --legacy-peer-deps
fi

echo ""
echo "Starting Next.js development server..."
echo ""
echo "========================================="
echo "  Server will be available at:"
echo "  http://localhost:3000"
echo "========================================="
echo ""

npm run dev


























