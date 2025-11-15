#!/bin/bash
# ============================================
# Environment Setup Script
# ============================================
# Usage: bash setup-env.sh

set -e

echo "🔧 Cowtion Environment Setup"
echo "=============================="
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
  echo "✅ .env.local already exists"
  
  # Check if CRON_SECRET is already set
  if grep -q "CRON_SECRET" .env.local; then
    echo "⚠️  CRON_SECRET already configured"
    read -p "Do you want to regenerate it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
      echo "Skipping CRON_SECRET generation"
      exit 0
    fi
  fi
else
  echo "📝 Creating .env.local file"
  touch .env.local
fi

# Generate a new secret
echo ""
echo "🔐 Generating CRON_SECRET..."

# Try openssl first, fall back to node
if command -v openssl &> /dev/null; then
  SECRET=$(openssl rand -hex 32)
  echo "Generated using openssl"
else
  SECRET=$(node -e "console.log(require('crypto').randomBytes(16).toString('hex'))")
  echo "Generated using Node.js"
fi

echo "Secret: $SECRET"
echo ""

# Add or update CRON_SECRET in .env.local
if grep -q "^CRON_SECRET=" .env.local; then
  # Update existing
  sed -i.bak "s/^CRON_SECRET=.*/CRON_SECRET=$SECRET/" .env.local
  rm -f .env.local.bak
  echo "✅ Updated CRON_SECRET in .env.local"
else
  # Add new
  echo "CRON_SECRET=$SECRET" >> .env.local
  echo "✅ Added CRON_SECRET to .env.local"
fi

echo ""
echo "🎯 Next Steps:"
echo "1. If using Vercel:"
echo "   - Add CRON_SECRET=$SECRET to Vercel environment variables"
echo "   - Or use: vercel env add CRON_SECRET"
echo ""
echo "2. If using GitHub Actions:"
echo "   - Add CRON_SECRET=$SECRET to GitHub Secrets"
echo "   - Settings → Secrets and variables → Actions"
echo ""
echo "3. If using EasyCron:"
echo "   - Go to https://www.easycron.com"
echo "   - Add header: Authorization: Bearer $SECRET"
echo ""
echo "✅ Setup complete!"
echo ""
