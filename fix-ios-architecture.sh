#!/bin/bash

# Fix iOS Architecture Issue for Apple Silicon
# This script fixes the x86_64 vs arm64 architecture mismatch

set -e

cd "$(dirname "$0")"

echo "🔧 Fixing iOS Architecture Issue"
echo "================================"
echo ""

# Step 1: Clean Xcode derived data
echo "Step 1: Cleaning Xcode derived data..."
rm -rf ~/Library/Developer/Xcode/DerivedData/baihubmobile-*
echo "✅ Cleaned"
echo ""

# Step 2: Clean iOS build
echo "Step 2: Cleaning iOS build directory..."
rm -rf ios/build
echo "✅ Cleaned"
echo ""

# Step 3: Reinstall pods
echo "Step 3: Reinstalling CocoaPods..."
cd ios
export LANG=en_US.UTF-8
pod install
cd ..
echo "✅ Pods installed"
echo ""

# Step 4: Build for arm64 simulator only
echo "Step 4: Building iOS app for arm64..."
echo "⏱️  This will take 5-10 minutes..."
echo ""

npx expo run:ios --simulator "iPhone 15"

echo ""
echo "🎉 Done!"

