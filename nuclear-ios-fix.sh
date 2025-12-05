#!/bin/bash

# Nuclear iOS Fix - Complete rebuild from scratch
# Fixes: "No such module 'Expo'" and module map errors

set -e

cd "$(dirname "$0")"

echo "☢️  NUCLEAR IOS FIX"
echo "=================="
echo ""
echo "This will completely clean and rebuild everything."
echo "Time: 10-15 minutes"
echo ""
read -p "Press Enter to continue..."

# Step 1: Nuclear clean
echo ""
echo "🧹 Step 1/5: Nuclear cleanup..."
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ~/Library/Caches/CocoaPods
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf node_modules/.cache
rm -rf $TMPDIR/metro-* 2>/dev/null || true
echo "✅ Everything cleaned"

# Step 2: CocoaPods setup
echo ""
echo "📦 Step 2/5: Setting up CocoaPods..."
cd ios
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
pod repo update
echo "✅ CocoaPods repo updated"

# Step 3: Install pods
echo ""
echo "📦 Step 3/5: Installing pods (2-3 minutes)..."
pod install --repo-update --verbose
echo "✅ Pods installed"
cd ..

# Step 4: Try building with Expo first (simpler)
echo ""
echo "🔨 Step 4/5: Attempting build with Expo CLI..."
if npx expo run:ios --configuration Debug 2>&1 | tee /tmp/ios-build.log; then
    echo ""
    echo "🎉 SUCCESS! App built and launched!"
    exit 0
else
    echo ""
    echo "⚠️  Expo build failed. Trying xcodebuild..."
fi

# Step 5: Fallback to xcodebuild
echo ""
echo "🔨 Step 5/5: Building with xcodebuild..."
cd ios

# Build pods target first
echo "Building Pods..."
xcodebuild \
  -workspace baihubmobile.xcworkspace \
  -scheme baihubmobile \
  -configuration Debug \
  -sdk iphonesimulator \
  -arch arm64 \
  -derivedDataPath ./build \
  clean build \
  ONLY_ACTIVE_ARCH=YES \
  EXCLUDED_ARCHS=x86_64 \
  CODE_SIGNING_ALLOWED=NO

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "📱 To install and run:"
    echo "  1. Open Simulator"
    echo "  2. Run: xcrun simctl install booted ios/build/Build/Products/Debug-iphonesimulator/baihubmobile.app"
    echo "  3. Run: xcrun simctl launch booted com.baihub.app"
else
    echo ""
    echo "❌ Build failed. Check logs above."
    echo ""
    echo "Next steps:"
    echo "1. Check /tmp/ios-build.log for details"
    echo "2. Try: open ios/baihubmobile.xcworkspace"
    echo "3. In Xcode: Product → Clean Build Folder → Build"
    exit 1
fi

