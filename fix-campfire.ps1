Write-Host "🔥 Solom's Healing Campfire Auto-Fix Script"
Write-Host "---------------------------------------------------" -ForegroundColor Yellow

# STEP 1 — Confirm project directory
$dir = Get-Location
Write-Host "📁 Project directory: $dir"

# STEP 2 — Delete node_modules
if (Test-Path "node_modules") {
    Write-Host "🗑 Removing node_modules..."
    Remove-Item -Recurse -Force "node_modules"
} else {
    Write-Host "✔ node_modules already removed."
}

# STEP 3 — Delete package-lock.json
if (Test-Path "package-lock.json") {
    Write-Host "🗑 Removing package-lock.json..."
    Remove-Item -Force "package-lock.json"
} else {
    Write-Host "✔ package-lock.json already removed."
}

# STEP 4 — Write clean package.json (forced stable versions)
Write-Host "🛠 Writing clean package.json..."
@"
{
  "name": "healing-campfire",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.2.3",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "howler": "^2.2.3",
    "framer-motion": "^11.0.0"
  }
}
"@ | Set-Content -Path "package.json" -Encoding UTF8

# STEP 5 — Rebuild next.config.js
Write-Host "🛠 Writing clean next.config.js..."
@"
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false
};

module.exports = nextConfig;
"@ | Set-Content -Path "next.config.js" -Encoding UTF8

# STEP 6 — Install correct deps (block auto-upgrades)
Write-Host "📦 Installing dependencies with --legacy-peer-deps..."
npm install --legacy-peer-deps

# STEP 7 — Verify Next.js version
Write-Host "🔍 Checking installed Next.js version..."
$nextVer = (npx next --version) 2>$null

Write-Host "   Next version:"
Write-Host "   $nextVer" -ForegroundColor Cyan

if ($nextVer -notlike "*14.2.3*") {
    Write-Host "❌ ERROR: Next.js version is still NOT 14.2.3" -ForegroundColor Red
    Write-Host "This means npm auto-upgraded again. Running forced downgrade..." -ForegroundColor Red

    npm uninstall next -f
    npm install next@14.2.3 --legacy-peer-deps -f

    $nextVer2 = (npx next --version) 2>$null
    Write-Host "   New Next version: $nextVer2" -ForegroundColor Cyan
} else {
    Write-Host "✔ Next.js 14.2.3 installed successfully." -ForegroundColor Green
}

# STEP 8 — Start the dev server
Write-Host "---------------------------------------------------"
Write-Host "🔥 Starting Healing Campfire..."
Write-Host "---------------------------------------------------"
npm run dev
