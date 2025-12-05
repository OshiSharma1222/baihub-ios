#!/bin/bash
set -e

echo "🔧 Fixing Podfile After Prebuild"
echo "=================================="
echo ""

cd "$(dirname "$0")"

PODFILE_PATH="ios/Podfile"

if [ ! -f "$PODFILE_PATH" ]; then
    echo "❌ Podfile not found at $PODFILE_PATH"
    echo "Run 'npx expo prebuild --platform ios --clean' first"
    exit 1
fi

echo "Step 1: Adding use_modular_headers! to Podfile..."

# Read Podfile
PODFILE_CONTENT=$(cat "$PODFILE_PATH")

# Check if already added
if echo "$PODFILE_CONTENT" | grep -q "use_modular_headers!"; then
    echo "✅ use_modular_headers! already present"
else
    # Add use_modular_headers! after use_expo_modules!
    PODFILE_CONTENT=$(echo "$PODFILE_CONTENT" | sed 's/\(use_expo_modules!\)/\1\n  use_modular_headers!/')
    
    echo "$PODFILE_CONTENT" > "$PODFILE_PATH"
    echo "✅ Added use_modular_headers! to Podfile"
fi

echo ""
echo "Step 2: Installing pods..."

cd ios
export LANG=en_US.UTF-8
export LC_ALL=en_US.UTF-8
pod install

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Pods installed successfully!"
    echo ""
    echo "Now you can build:"
    echo "  npx expo run:ios"
else
    echo ""
    echo "❌ Pod install failed"
    exit 1
fi

