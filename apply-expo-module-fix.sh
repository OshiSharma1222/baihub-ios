#!/bin/bash
set -e

echo "🔧 Applying GitHub Solution: use_frameworks! :linkage => :static"
echo "================================================================"
echo ""

cd "$(dirname "$0")"

# Step 1: Clean
echo "Step 1: Cleaning..."
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ios/build
echo "✅ Cleaned"
echo ""

# Step 2: Reinstall pods with static frameworks
echo "Step 2: Reinstalling pods with static frameworks fix..."
cd ios
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
pod install

if [ $? -ne 0 ]; then
    echo "❌ Pod install failed"
    exit 1
fi

cd ..
echo "✅ Pods reinstalled with static frameworks"
echo ""

# Step 3: Build
echo "Step 3: Building iOS app..."
echo "⏱️  This will take 5-10 minutes..."
echo ""

# Try building via Xcode directly (better build order)
cd ios

# Use iPhone 16 (available on your system)
SIMULATOR_ID="A5843344-30F0-491D-AB9F-936C6D384367"
echo "Using simulator: iPhone 16 (ID: $SIMULATOR_ID)"

xcodebuild \
  -workspace baihubmobile.xcworkspace \
  -scheme baihubmobile \
  -configuration Debug \
  -sdk iphonesimulator \
  -destination "platform=iOS Simulator,id=$SIMULATOR_ID" \
  clean build \
  CODE_SIGNING_ALLOWED=NO \
  ONLY_ACTIVE_ARCH=YES \
  EXCLUDED_ARCHS=x86_64

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD SUCCESSFUL!"
    echo ""
    echo "Installing on simulator..."
    APP_PATH="$(pwd)/build/Build/Products/Debug-iphonesimulator/baihubmobile.app"
    
    # Boot the simulator we used for build
    xcrun simctl boot "$SIMULATOR_ID" 2>/dev/null || true
    open -a Simulator
    
    # Wait for simulator
    sleep 3
    
    # Install app
    xcrun simctl install booted "$APP_PATH"
    
    # Launch app
    xcrun simctl launch booted com.baihub.app
    echo ""
    echo "✅ App launched!"
else
    echo ""
    echo "❌ Build failed"
    echo ""
    echo "Try opening in Xcode:"
    echo "  open ios/baihubmobile.xcworkspace"
    echo "  Then: Product → Clean Build Folder → Build"
    exit 1
fi

