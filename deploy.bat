@echo off
echo ========================================
echo Vanuatu IMTS Dashboard - GitHub Pages Deploy
echo ========================================
echo.

REM Check if token is provided
if "%1"=="" (
    echo ERROR: No GitHub token provided!
    echo.
    echo Usage: deploy.bat YOUR_GITHUB_TOKEN
    echo.
    echo To create a token:
    echo 1. Go to: https://github.com/settings/tokens/new
    echo 2. Select scope: repo
    echo 3. Generate and copy your token
    echo 4. Run: deploy.bat YOUR_TOKEN_HERE
    echo.
    exit /b 1
)

set TOKEN=%1

echo Setting up Git remote with token...
git remote set-url origin https://%TOKEN%@github.com/vbos-dashboards/trade.git

echo.
echo Building and deploying to GitHub Pages...
npm run deploy

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Dashboard deployed!
    echo ========================================
    echo.
    echo Your dashboard will be available at:
    echo https://vbos-dashboards.github.io/trade
    echo.
    echo Note: It may take a few minutes for GitHub Pages to update.
    echo.
) else (
    echo.
    echo ========================================
    echo DEPLOYMENT FAILED
    echo ========================================
    echo Please check the error messages above.
    echo.
)

REM Remove token from remote URL for security
git remote set-url origin https://github.com/vbos-dashboards/trade.git

echo Cleaned up credentials for security.
pause
