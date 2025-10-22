# Start Next.js Development Server
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan

# Check if running in correct directory
if (!(Test-Path "package.json")) {
    Write-Host "❌ Error: No se encuentra package.json" -ForegroundColor Red
    Write-Host "Asegúrate de estar en el directorio prediction-market" -ForegroundColor Yellow
    exit 1
}

Write-Host "📦 Verificando dependencias..." -ForegroundColor Yellow

# Start the dev server
Write-Host "▶️  Arrancando Next.js con Turbopack..." -ForegroundColor Green
npm run dev

# This will keep running until Ctrl+C































