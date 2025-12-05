#!/bin/bash

# Build Production AAB Script
# This script builds a production-ready Android App Bundle (AAB) with correct API configuration

set -e  # Exit on error

echo "🚀 Building Production AAB for BaiHub Mobile"
echo "=============================================="

# Ensure we're in the project root
cd "$(dirname "$0")"

# Set production environment variables (override .env if present)
export NODE_ENV=production
export ENVIRONMENT=production
# Don't use .env file for production build - use app.config.js defaults
unset API_BASE_URL 2>/dev/null || true

echo ""
echo "📦 Step 1: Installing dependencies..."
npm install

echo ""
echo "🧹 Step 2: Cleaning previous builds..."
cd android
./gradlew clean || echo "⚠️  Clean had some warnings (this is usually OK)"

echo ""
echo "📱 Step 3: Building production AAB..."
echo "   This will bundle all assets and JavaScript..."
cd ..
npx expo prebuild --platform android --clean

echo ""
echo "🔨 Step 4: Generating release AAB..."
cd android
./gradlew bundleRelease

echo ""
echo "✅ Build Complete!"
echo ""
echo "📦 AAB Location:"
find app/build/outputs/bundle/release -name "*.aab" -type f | head -1
echo ""
echo "📊 AAB Size:"
ls -lh app/build/outputs/bundle/release/*.aab 2>/dev/null | awk '{print $5}' || echo "AAB not found"
echo ""
echo "✨ Ready for Google Play Store upload!"

