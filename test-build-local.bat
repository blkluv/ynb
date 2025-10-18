@echo off
echo ========================================
echo   TEST BUILD LOCAL - PRISMAFI
echo ========================================
echo.

cd prediction-market

echo [1/4] Limpiando cache anterior...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [2/4] Instalando dependencias...
call npm install --legacy-peer-deps
if errorlevel 1 (
    echo ERROR: Fallo en npm install
    pause
    exit /b 1
)

echo [3/4] Creando .env.local temporal...
(
echo NEXT_PUBLIC_PRIVY_APP_ID=clzmzasg80013jxlxmvimrjmo
echo NEXT_PUBLIC_SOLANA_RPC_URL=https://api.devnet.solana.com
) > .env.local

echo [4/4] Ejecutando build...
call npm run build
if errorlevel 1 (
    echo.
    echo ========================================
    echo   ERROR: BUILD FALLO
    echo ========================================
    echo.
    echo Revisa los errores arriba y corrigelos antes de hacer push.
    pause
    exit /b 1
)

echo.
echo ========================================
echo   BUILD EXITOSO!
echo ========================================
echo.
echo Puedes hacer push a Vercel con confianza:
echo   git add .
echo   git commit -m "fix: production build fixes"
echo   git push origin main
echo.
echo O iniciar el servidor local para probar:
echo   npm start
echo.
pause

