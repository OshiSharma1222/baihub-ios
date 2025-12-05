# Final iOS Build Fix - Module Map Issues

## The Problem
Swift modules (Expo, Firebase, etc.) aren't generating their module maps, causing "No such module" errors.

## Complete Solution

### Run These Commands in Terminal:

```bash
cd /Users/aj/code/baihub-mobile

# 1. Nuclear clean - remove EVERYTHING
echo "🧹 Step 1: Complete cleanup..."
rm -rf ~/Library/Developer/Xcode/DerivedData
rm -rf ~/Library/Caches/CocoaPods
rm -rf ios/build
rm -rf ios/Pods
rm -rf ios/Podfile.lock
rm -rf node_modules/.cache

# 2. Reinstall pods with clean cache
echo "📦 Step 2: Fresh pod install..."
cd ios
pod repo update
pod deintegrate
pod install --repo-update
cd ..

# 3. Build ONLY the pods first (not the app)
echo "🔨 Step 3: Pre-building all pods..."
cd ios
xcodebuild \
  -workspace baihubmobile.xcworkspace \
  -scheme baihubmobile \
  -configuration Debug \
  -sdk iphonesimulator \
  -arch arm64 \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  -onlyUsePackageVersionsFromResolvedFile \
  build \
  -target Pods-baihubmobile

# 4. NOW build the actual app
echo "🏗️  Step 4: Building app..."
xcodebuild \
  -workspace baihubmobile.xcworkspace \
  -scheme baihubmobile \
  -configuration Debug \
  -sdk iphonesimulator \
  -arch arm64 \
  -destination 'platform=iOS Simulator,name=iPhone 15' \
  build

cd ..
echo "✅ Build complete!"
```

## If That Still Fails

Try disabling New Architecture temporarily:

```bash
cd /Users/aj/code/baihub-mobile

# Disable new architecture
export RCT_NEW_ARCH_ENABLED=0

# Clean and rebuild
rm -rf ios/Pods ios/Podfile.lock
cd ios
pod install
cd ..

# Build with Expo (should work now)
npx expo run:ios
```

## Alternative: EAS Build (Expo's Cloud Build)

If local builds keep failing, use Expo's cloud build service:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure
eas build:configure

# Build for simulator
eas build --platform ios --profile development

# This builds in the cloud and downloads a .app file
# Then install with: xcrun simctl install booted path/to/app.app
```

## Why This Happens

1. **New Architecture**: Expo's new architecture requires all pods to support Swift module maps
2. **Build Order**: Some pods must be built before others
3. **Architecture Mismatch**: arm64 vs x86_64 confusion on Apple Silicon

## Success Indicators

You'll know it's working when you see:
```
▸ Building Expo [arm64]
▸ Building ExpoModulesCore [arm64]
▸ Building FirebaseCore [arm64]
✓ Build Succeeded
```

No "module map not found" errors!

