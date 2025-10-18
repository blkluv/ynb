# 🚀 Script de Instalación Automática - Solana + Anchor en Windows
# Ejecuta como Administrador en PowerShell

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host "  Instalador de Herramientas Solana Development  " -ForegroundColor Cyan
Write-Host "====================================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si está corriendo como Admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")
if (-not $isAdmin) {
    Write-Host "⚠️  Este script necesita ejecutarse como Administrador" -ForegroundColor Yellow
    Write-Host "Haz click derecho en PowerShell y selecciona 'Ejecutar como administrador'" -ForegroundColor Yellow
    pause
    exit
}

Write-Host "✓ Corriendo como Administrador" -ForegroundColor Green
Write-Host ""

# 1. Verificar/Instalar Rust
Write-Host "[1/4] Verificando Rust..." -ForegroundColor Cyan
try {
    $rustVersion = rustc --version 2>$null
    Write-Host "✓ Rust ya instalado: $rustVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Rust no encontrado. Instalando..." -ForegroundColor Yellow
    Write-Host "Descarga e instala Rust desde: https://rustup.rs/" -ForegroundColor Yellow
    Start-Process "https://rustup.rs/"
    Write-Host "Por favor, instala Rust y vuelve a ejecutar este script." -ForegroundColor Yellow
    pause
    exit
}

# 2. Verificar/Instalar Solana CLI
Write-Host ""
Write-Host "[2/4] Verificando Solana CLI..." -ForegroundColor Cyan
try {
    $solanaVersion = solana --version 2>$null
    Write-Host "✓ Solana CLI ya instalado: $solanaVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Solana CLI no encontrado. Instalando..." -ForegroundColor Yellow
    
    # Descargar instalador
    $solanaInstaller = "$env:TEMP\solana-install-tmp"
    New-Item -ItemType Directory -Force -Path $solanaInstaller | Out-Null
    
    Write-Host "Descargando Solana CLI..." -ForegroundColor Yellow
    Invoke-WebRequest -Uri "https://github.com/solana-labs/solana/releases/download/v1.18.4/solana-install-init-x86_64-pc-windows-msvc.exe" -OutFile "$solanaInstaller\solana-install.exe"
    
    Write-Host "Instalando Solana CLI..." -ForegroundColor Yellow
    Start-Process -FilePath "$solanaInstaller\solana-install.exe" -ArgumentList "-y" -Wait
    
    # Agregar a PATH
    $solanaPath = "$env:USERPROFILE\.local\share\solana\install\active_release\bin"
    [Environment]::SetEnvironmentVariable("Path", $env:Path + ";$solanaPath", [System.EnvironmentVariableTarget]::User)
    $env:Path = $env:Path + ";$solanaPath"
    
    Write-Host "✓ Solana CLI instalado" -ForegroundColor Green
}

# 3. Verificar/Instalar Anchor
Write-Host ""
Write-Host "[3/4] Verificando Anchor..." -ForegroundColor Cyan
try {
    $anchorVersion = anchor --version 2>$null
    Write-Host "✓ Anchor ya instalado: $anchorVersion" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Anchor no encontrado. Instalando (esto puede tomar 10-15 minutos)..." -ForegroundColor Yellow
    
    # Instalar AVM (Anchor Version Manager)
    Write-Host "Instalando Anchor Version Manager..." -ForegroundColor Yellow
    cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
    
    # Instalar Anchor 0.29.0
    Write-Host "Instalando Anchor 0.29.0..." -ForegroundColor Yellow
    avm install 0.29.0
    avm use 0.29.0
    
    Write-Host "✓ Anchor instalado" -ForegroundColor Green
}

# 4. Verificar Node.js y Yarn
Write-Host ""
Write-Host "[4/4] Verificando Node.js y Yarn..." -ForegroundColor Cyan
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✓ Node.js ya instalado: $nodeVersion" -ForegroundColor Green
    
    try {
        $yarnVersion = yarn --version 2>$null
        Write-Host "✓ Yarn ya instalado: $yarnVersion" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Yarn no encontrado. Instalando..." -ForegroundColor Yellow
        npm install -g yarn
        Write-Host "✓ Yarn instalado" -ForegroundColor Green
    }
} catch {
    Write-Host "⚠️  Node.js no encontrado." -ForegroundColor Yellow
    Write-Host "Por favor, instala Node.js desde: https://nodejs.org/" -ForegroundColor Yellow
    Start-Process "https://nodejs.org/"
    pause
    exit
}

# Resumen
Write-Host ""
Write-Host "====================================================" -ForegroundColor Green
Write-Host "  ✓ Instalación Completada" -ForegroundColor Green
Write-Host "====================================================" -ForegroundColor Green
Write-Host ""

Write-Host "Herramientas instaladas:" -ForegroundColor Cyan
Write-Host "  ✓ Rust: $(rustc --version)" -ForegroundColor White
Write-Host "  ✓ Solana: $(solana --version)" -ForegroundColor White
Write-Host "  ✓ Anchor: $(anchor --version)" -ForegroundColor White
Write-Host "  ✓ Node.js: $(node --version)" -ForegroundColor White
Write-Host "  ✓ Yarn: v$(yarn --version)" -ForegroundColor White

Write-Host ""
Write-Host "🎯 Próximos pasos:" -ForegroundColor Cyan
Write-Host "  1. Cierra y abre una nueva terminal PowerShell" -ForegroundColor White
Write-Host "  2. Ejecuta: solana config set --url https://api.devnet.solana.com" -ForegroundColor White
Write-Host "  3. Ejecuta: solana-keygen new" -ForegroundColor White
Write-Host "  4. Ejecuta: solana airdrop 2" -ForegroundColor White
Write-Host "  5. cd prediction-market-latam" -ForegroundColor White
Write-Host "  6. Ejecuta: yarn install" -ForegroundColor White
Write-Host "  7. Ejecuta: anchor build" -ForegroundColor White
Write-Host ""

pause

