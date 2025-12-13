# How to Verify Info.plist in EAS Build

## Method 1: Download and Extract from .ipa (Recommended)

### Step 1: Download the .ipa file
```bash
# Get the build URL from EAS
eas build:list --platform ios --limit 1

# Download the .ipa file (use the Application Archive URL)
curl -L "https://expo.dev/artifacts/eas/cA7eArHdaxpTkRtTQidTbx.ipa" -o build.ipa
```

### Step 2: Extract and Inspect Info.plist
```bash
# Create a temporary directory
mkdir -p /tmp/ipa-inspect
cd /tmp/ipa-inspect

# Unzip the .ipa file
unzip ~/Downloads/build.ipa

# Extract the app bundle
unzip Payload/*.app

# View Info.plist (binary format - use plutil to convert)
plutil -p Payload/*.app/Info.plist | grep -A 2 NSPhotoLibraryUsageDescription

# Or convert to XML and view
plutil -convert xml1 Payload/*.app/Info.plist
cat Payload/*.app/Info.plist | grep -A 2 NSPhotoLibraryUsageDescription
```

## Method 2: Use Online IPA Inspector

1. Download the .ipa from EAS
2. Upload to: https://www.diawi.com/ or use any IPA inspector tool
3. View the Info.plist contents

## Method 3: Check Build Logs

```bash
# View build logs
eas build:view <build-id>

# Or open the logs URL from build list
# Look for "Processing Info.plist" or "Copying Info.plist" in the logs
```

## Method 4: Use `plistutil` (if installed)

```bash
# After extracting .ipa
plistutil -i Payload/*.app/Info.plist -f xml | grep NSPhotoLibraryUsageDescription
```

## Quick Verification Script

Save this as `check-info-plist.sh`:

```bash
#!/bin/bash

IPA_URL="$1"
if [ -z "$IPA_URL" ]; then
  echo "Usage: ./check-info-plist.sh <ipa-url>"
  exit 1
fi

TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "Downloading IPA..."
curl -L "$IPA_URL" -o app.ipa

echo "Extracting IPA..."
unzip -q app.ipa

echo "Extracting app bundle..."
unzip -q Payload/*.app

echo "Checking Info.plist..."
if plutil -p Payload/*.app/Info.plist | grep -q "NSPhotoLibraryUsageDescription"; then
  echo "✅ NSPhotoLibraryUsageDescription found!"
  plutil -p Payload/*.app/Info.plist | grep -A 2 "NSPhotoLibraryUsageDescription"
else
  echo "❌ NSPhotoLibraryUsageDescription NOT found!"
fi

# Cleanup
cd -
rm -rf "$TEMP_DIR"
```

## Method 5: Check in Xcode (if you download the build)

1. Download the .ipa from EAS
2. Rename `.ipa` to `.zip`
3. Extract the zip
4. Open `Payload/*.app` in Xcode
5. View Info.plist in Xcode

## Your Current Build

Based on your latest build:
- **Build ID**: `5dd7a7cf-924e-48ad-abb2-ec8aa727b3bf`
- **Application Archive URL**: `https://expo.dev/artifacts/eas/cA7eArHdaxpTkRtTQidTbx.ipa`
- **Version**: 1.0.2
- **Build Number**: 2

You can download and verify this build using Method 1 above.



