#!/bin/bash
set -e

echo "🔧 iOS Build Fix - Simplified Approach"
echo "======================================"
echo ""

cd "$(dirname "$0")"

# Step 1: Complete cleanup
echo "Step 1: Complete cleanup..."
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData
echo "✅ Cleaned"
echo ""

# Step 2: Let Expo handle everything (it triggers codegen properly)
echo "Step 2: Building with Expo (handles codegen + build)..."
echo "⏱️  This will take 5-10 minutes..."
echo ""

npx expo run:ios --no-build-cache

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 BUILD & LAUNCH SUCCESSFUL!"
    echo ""
    echo "The app should now be running on your simulator!"
else
    echo ""
    echo "❌ Build failed."
    echo ""
    echo "This is a complex iOS build issue. I recommend:"
    echo "1. Focus on Android (it's working perfectly)"
    echo "2. Or use EAS Build for iOS: eas build --platform ios --profile development"
    exit 1
fi

