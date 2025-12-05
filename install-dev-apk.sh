#!/bin/bash
set -e

echo "🔨 Building and Installing Dev APK"
echo "===================================="
echo ""

cd "$(dirname "$0")"

# Set up environment
export JAVA_HOME="/Applications/Android Studio.app/Contents/jbr/Contents/Home"
export PATH="$JAVA_HOME/bin:$PATH"
export ANDROID_HOME="$HOME/Library/Android/sdk"
export PATH="$ANDROID_HOME/platform-tools:$PATH"

# Check if device is connected
echo "Checking for connected devices..."
DEVICES=$(adb devices | grep -v "List" | grep "device" | wc -l | tr -d ' ')

if [ "$DEVICES" -eq "0" ]; then
    echo "❌ No Android device/emulator connected!"
    echo "Please start an emulator or connect a device, then run this script again."
    exit 1
fi

echo "✅ Device found"
echo ""

# Build debug APK
echo "Step 1: Building debug APK..."
cd android
./gradlew assembleDebug

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ APK built successfully"
echo ""

# Install APK
echo "Step 2: Installing APK..."
APK_PATH="app/build/outputs/apk/debug/app-debug.apk"

if [ ! -f "$APK_PATH" ]; then
    echo "❌ APK not found at $APK_PATH"
    exit 1
fi

adb install -r "$APK_PATH"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ APK installed successfully!"
    echo ""
    echo "Step 3: Starting Metro bundler..."
    cd ..
    npx expo start
else
    echo "❌ Installation failed"
    exit 1
fi

