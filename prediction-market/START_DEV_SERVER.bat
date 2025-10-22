@echo off
echo ========================================
echo   PrismaFi - Starting Development Server
echo ========================================
echo.
echo Project: PrismaFi Prediction Markets
echo Directory: %~dp0
echo.
cd /d "%~dp0"
echo Checking if dependencies are installed...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install --legacy-peer-deps
)
echo.
echo Starting Next.js development server...
echo.
echo ========================================
echo   Server will be available at:
echo   http://localhost:3000
echo ========================================
echo.
call npm run dev
pause


























