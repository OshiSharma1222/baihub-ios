#!/bin/bash
set -e

echo "🔄 iOS Complete Rebuild from Scratch"
echo "====================================="
echo ""

cd "$(dirname "$0")"

# Step 1: Remove iOS directory completely
echo "Step 1: Removing existing iOS directory..."
if [ -d "ios" ]; then
    rm -rf ios
    echo "✅ Removed"
else
    echo "✅ No iOS directory found"
fi
echo ""

# Step 2: Clean all caches
echo "Step 2: Cleaning all build caches..."
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ~/Library/Caches/CocoaPods
rm -rf node_modules/.cache
echo "✅ Caches cleaned"
echo ""

# Step 3: Regenerate iOS project
echo "Step 3: Regenerating iOS project from app.config.js..."
npx expo prebuild --platform ios --clean

if [ ! -d "ios" ]; then
    echo "❌ Failed to generate iOS project"
    exit 1
fi
echo "✅ iOS project generated"
echo ""

# Step 4: Install pods
echo "Step 4: Installing CocoaPods dependencies..."
cd ios
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
pod install
cd ..
echo "✅ Pods installed"
echo ""

# Step 5: Clean derived data one more time
echo "Step 5: Final cleanup before build..."
rm -rf ~/Library/Developer/Xcode/DerivedData
echo "✅ Ready to build"
echo ""

# Step 6: Build with Expo
echo "Step 6: Building iOS app..."
echo "⏱️  This will take 5-10 minutes..."
echo ""

npx expo run:ios --no-build-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! iOS app is running!"
else
    echo ""
    echo "❌ Build failed again."
    echo ""
    echo "Next steps:"
    echo "1. Check the error message above"
    echo "2. Share it with iOS expert on Expo Discord"
    echo "3. Or try EAS Build: eas build --platform ios --profile development --clear-cache"
    exit 1
fi

