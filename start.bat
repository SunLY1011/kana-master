d:\Japanese\Janpan-software\50音+单词\假名大师 Kana Master\start.bat
@echo off
setlocal enabledelayedexpansion

title Kana Master - Dev Server

cd /d "%~dp0"

echo ===============================================
echo     Kana Master - Quick Start
echo ===============================================
echo.

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js not found. Install from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm not available.
    echo.
    pause
    exit /b 1
)

REM === Port auto-detection ===
set "START_PORT=5173"
set "MAX_PORT=5200"
set "PORT=%START_PORT%"

echo [1/2] Finding available port...

:CHECK_PORT
set "OCCUPIED="
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":%PORT%" ^| findstr LISTENING') do (
    set "OCCUPIED=%%a"
)
if defined OCCUPIED (
    echo   - Port %PORT% in use, trying next...
    set /a PORT+=1
    if !PORT! gtr %MAX_PORT% (
        echo [ERROR] No free port in range %START_PORT%-%MAX_PORT%
        echo.
        pause
        exit /b 1
    )
    goto CHECK_PORT
) else (
    echo   [OK] Using port: %PORT%
)

echo.
echo [2/2] Starting dev server at http://localhost:%PORT%
echo.

REM Auto-open browser after 5 seconds
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:%PORT%"

REM Run dev server directly (no install)
call npm run dev -- --port %PORT% --host 127.0.0.1

REM Keep window open after exit
echo.
if %errorlevel% neq 0 (
    echo [Server exited with code %errorlevel%]
    echo   If this is your first run, do: npm install
) else (
    echo [Server stopped]
)
echo.
echo Press any key to close...
pause >nul
endlocal
