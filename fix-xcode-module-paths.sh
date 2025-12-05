#!/bin/bash
set -e

echo "🔧 Fixing Xcode Module Map Paths"
echo "=================================="
echo ""

cd "$(dirname "$0")"

PROJECT_FILE="ios/baihubmobile.xcodeproj/project.pbxproj"

if [ ! -f "$PROJECT_FILE" ]; then
    echo "❌ Xcode project file not found"
    exit 1
fi

echo "Step 1: Fixing module map paths in Xcode project..."
echo "Changing iphoneos → iphonesimulator in module map paths"

# Backup
cp "$PROJECT_FILE" "$PROJECT_FILE.backup"

# Fix module map paths for simulator
sed -i '' 's|build/Debug-iphoneos/Expo/Expo.modulemap|build/Debug-iphonesimulator/Expo/Expo.modulemap|g' "$PROJECT_FILE"
sed -i '' 's|build/Release-iphoneos/Expo/Expo.modulemap|build/Release-iphonesimulator/Expo/Expo.modulemap|g' "$PROJECT_FILE"

echo "✅ Fixed module map paths"
echo ""

# Step 2: Reinstall pods
echo "Step 2: Reinstalling pods..."
cd ios
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
pod install
cd ..

echo ""
echo "✅ Done!"
echo ""
echo "Now try building in Xcode:"
echo "  1. Product → Clean Build Folder (Shift + Cmd + K)"
echo "  2. Product → Build (Cmd + B)"

