@echo off
echo Configurando WSL Ubuntu para usar root por defecto...
echo.

REM Crear archivo de configuracion de WSL
(
echo [user]
echo default=root
) > "%USERPROFILE%\.wslconfig"

echo Archivo .wslconfig creado en: %USERPROFILE%\.wslconfig
echo.
echo Reiniciando WSL para aplicar cambios...
wsl --shutdown
timeout /t 2 /nobreak >nul

echo.
echo ================================================
echo   Configuracion completada
echo ================================================
echo.
echo Ahora cuando abras WSL, seras root automaticamente.
echo No necesitaras contraseña para nada.
echo.
echo Prueba ejecutando: wsl
echo.
pause






















