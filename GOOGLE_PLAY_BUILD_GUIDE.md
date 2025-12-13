# Google Play Store Build Guide

## Overview
This guide explains how to build an Android App Bundle (AAB) for Google Play Store submission.

## Method 1: EAS Build (Recommended) ✅ Currently Running

### Advantages:
- ✅ Automatic signing (EAS manages your keystore securely)
- ✅ Cloud-based (no local setup required)
- ✅ Consistent builds across machines
- ✅ Handles all build configurations automatically

### Current Build Status:
```bash
# Check build status
eas build:list

# View build logs
eas build:view [BUILD_ID]
```

### Download the AAB:
Once the build completes:
1. Visit: https://expo.dev/accounts/[your-account]/projects/baihub-mobile/builds
2. Download the `.aab` file
3. Upload to Google Play Console

### Build Command:
```bash
eas build --platform android --profile production
```

---

## Method 2: Local Gradle Build (Alternative)

### Prerequisites:
1. **Generate a Keystore** (if you don't have one):
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore baihub-release-key.keystore -alias baihub-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. **Create `android/keystore.properties`**:
```properties
storePassword=YOUR_STORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=baihub-key-alias
storeFile=../baihub-release-key.keystore
```

3. **Update `android/app/build.gradle`**:
```gradle
def keystorePropertiesFile = rootProject.file("keystore.properties")
def keystoreProperties = new Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        release {
            if (keystorePropertiesFile.exists()) {
                keyAlias keystoreProperties['keyAlias']
                keyPassword keystoreProperties['keyPassword']
                storeFile file(keystoreProperties['storeFile'])
                storePassword keystoreProperties['storePassword']
            }
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            // ... rest of config
        }
    }
}
```

4. **Build the AAB**:
```bash
cd android
./gradlew bundleRelease
```

5. **Find the AAB**:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## Uploading to Google Play Store

### Steps:
1. **Go to Google Play Console**: https://play.google.com/console
2. **Select your app** (or create a new one)
3. **Go to**: Production → Create new release
4. **Upload the AAB file** you downloaded/built
5. **Fill in release notes**
6. **Review and publish**

### Important Notes:
- ✅ AAB is required (APK is not accepted for new apps)
- ✅ First upload: Complete app listing, privacy policy, screenshots
- ✅ Signing: EAS handles this automatically, or use your keystore for local builds
- ✅ Version: Update `version` in `app.config.js` before each release

---

## Version Management

Before each release, update:
- `app.config.js`: `version: "1.0.0"` → `version: "1.0.1"`
- `android/app/build.gradle`: `versionCode` and `versionName`

---

## Troubleshooting

### Build Fails:
- Check EAS build logs: `eas build:view [BUILD_ID]`
- Verify `app.config.js` is correct
- Ensure all dependencies are installed: `npm install`

### Signing Issues:
- EAS Build: Signing is automatic, no action needed
- Local Build: Verify keystore path and passwords in `keystore.properties`

### AAB Too Large:
- Already optimized with:
  - R8 code shrinking
  - Resource shrinking
  - ABI splits (disabled for AAB - Play Store handles this)

---

## Current Configuration

Your `eas.json` is configured for:
- ✅ Production builds: `app-bundle` format
- ✅ Distribution: `store` (for Play Store)
- ✅ Channel: `production` (for OTA updates)

Build command: `eas build --platform android --profile production`



