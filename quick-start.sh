#!/bin/bash

# Cowtion Quick Start Script

echo "🚀 Starting Cowtion Setup..."
echo ""

# Check Node.js installation
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if we're in the cowtion directory
if [ ! -f "package.json" ]; then
    echo "❌ package.json not found. Are you in the cowtion directory?"
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"
echo ""

# Check for .env.local
if [ ! -f ".env.local" ]; then
    echo "⚠️  .env.local file not found"
    echo "📝 Copying .env.local.example to .env.local..."
    cp .env.local.example .env.local
    echo "✅ Environment file created"
    echo ""
    echo "📋 Please edit .env.local with your Firebase and Gemini API credentials"
    echo "   See SETUP.md for detailed instructions"
else
    echo "✅ .env.local file found"
fi

echo ""
echo "🎯 Quick Next Steps:"
echo "  1. Edit .env.local with your Firebase credentials"
echo "  2. Run: npm run dev"
echo "  3. Open http://localhost:3000"
echo ""
echo "📖 For detailed setup instructions, see SETUP.md"
echo ""
echo "✨ Cowtion is ready!"
