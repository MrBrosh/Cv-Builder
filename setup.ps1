# CV Builder Setup Script
# Run this script to install all dependencies

Write-Host "Setting up CV Builder project..." -ForegroundColor Green

# Client setup
Write-Host "`nInstalling client dependencies..." -ForegroundColor Yellow
Set-Location client
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Client installation failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

# Server setup
Write-Host "`nInstalling server dependencies..." -ForegroundColor Yellow
Set-Location server
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "Server installation failed!" -ForegroundColor Red
    exit 1
}
Set-Location ..

Write-Host "`nSetup complete! 🎉" -ForegroundColor Green
Write-Host "`nTo start development:" -ForegroundColor Cyan
Write-Host "  Client: cd client && npm run dev" -ForegroundColor White
Write-Host "  Server: cd server && npm run dev" -ForegroundColor White
