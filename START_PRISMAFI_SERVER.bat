@echo off
echo ========================================
echo  PrismaFi Development Server Starter
echo ========================================
echo.
cd "C:\Users\edgar\cypherpunk hackathon2025\prediction-market"
echo Current directory: %CD%
echo.
echo Checking package.json...
findstr /C:"prismafi" package.json >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Correct project: prismafi
) else (
    echo [ERROR] Wrong project!
    pause
    exit /b 1
)
echo.
echo Starting Next.js development server...
echo.
npm run dev









