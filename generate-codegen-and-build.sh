#!/bin/bash
set -e

echo "🎯 iOS Build - Business Critical Fix"
echo "====================================="
echo ""

cd "$(dirname "$0")"

# Step 1: Clean everything
echo "Step 1: Nuclear cleanup..."
rm -rf ios/build
rm -rf ~/Library/Developer/Xcode/DerivedData
echo "✅ Cleaned"
echo ""

# Step 2: Generate codegen files FIRST
echo "Step 2: Generating codegen files manually..."
cd ios

# Run the codegen script that Expo uses
echo "Running FBReactNativeSpec codegen..."
node -e "
const path = require('path');
const execSync = require('child_process').execSync;
const projectRoot = path.resolve(__dirname, '..');

console.log('Generating codegen artifacts...');

try {
  // This triggers the codegen generation
  execSync('npx expo prebuild --platform ios --no-install', {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  console.log('✅ Codegen generation complete');
} catch (error) {
  console.log('⚠️ Codegen had issues, continuing...');
}
"

cd ..
echo ""

# Step 3: Try expo run:ios (it should work now)
echo "Step 3: Building and launching iOS app..."
echo "⏱️  This will take 5-10 minutes..."
echo ""

npx expo run:ios

if [ $? -eq 0 ]; then
    echo ""
    echo "🎉 SUCCESS! App is running on simulator!"
else
    echo ""
    echo "❌ Build still failing."
    echo ""
    echo "RECOMMENDATION: Use EAS Build (Expo's cloud build service)"
    echo "It's the most reliable way for complex iOS builds."
    echo ""
    echo "Run: eas build --platform ios --profile development"
    exit 1
fi

