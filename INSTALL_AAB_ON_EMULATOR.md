# Why AAB Files Can't Be Installed Directly on Emulators

## The Issue

**AAB (Android App Bundle) files are NOT installable directly on devices or emulators.** They are:
- ✅ **Upload-only format** for Google Play Store
- ✅ **Optimized for distribution** - Play Store generates device-specific APKs
- ❌ **NOT installable** - Cannot be installed via `adb install`

## Why This Happens

1. **AAB Structure**: AAB files contain all architectures, resources, and code in a compressed bundle format
2. **Play Store Processing**: Google Play Store processes the AAB and generates optimized APKs for each device
3. **No Direct Installation**: Android doesn't have native support to install AAB files directly

## Solutions for Testing on Emulator

### Option 1: Build Release APK Locally (Recommended) ⭐

**Fastest and most reliable method:**

```bash
cd android
./gradlew assembleRelease
```

**Install the APK:**
```bash
adb install -r android/app/build/outputs/apk/release/app-arm64-v8a-release.apk
```

**Advantages:**
- ✅ Properly signed
- ✅ Works immediately
- ✅ Same code as AAB
- ✅ Faster than converting AAB

### Option 2: Use Bundletool (Complex)

**Extract APK from AAB:**

1. Download bundletool:
```bash
curl -L -o /tmp/bundletool.jar https://github.com/google/bundletool/releases/download/1.15.6/bundletool-all-1.15.6.jar
```

2. Extract universal APK:
```bash
java -jar /tmp/bundletool.jar build-apks \
  --bundle=your-app.aab \
  --output=app.apks \
  --mode=universal
```

3. Extract and sign:
```bash
unzip app.apks -d extracted/
jarsigner -keystore android/app/debug.keystore \
  -storepass android \
  -keypass android \
  extracted/universal.apk androiddebugkey
```

4. Install:
```bash
adb install extracted/universal.apk
```

**Issues with this method:**
- ⚠️ Universal APK may have native library extraction issues
- ⚠️ Requires manual signing
- ⚠️ More complex setup

### Option 3: Use EAS Build Preview Profile

**Build APK directly from EAS:**

Update `eas.json`:
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"  // Change from "app-bundle" to "apk"
      }
    }
  }
}
```

Then build:
```bash
eas build --platform android --profile preview
```

This gives you an installable APK directly.

## Summary

| Method | Speed | Reliability | Use Case |
|--------|-------|-------------|----------|
| **Local APK Build** | ⚡ Fast | ✅ Reliable | Testing before AAB upload |
| **Bundletool Extract** | 🐌 Slow | ⚠️ Issues | Only if you only have AAB |
| **EAS Preview APK** | 🐌 Slow | ✅ Reliable | Cloud-based testing |

## Recommendation

**For testing on emulator:** Use `./gradlew assembleRelease` to build a release APK locally. It's:
- ✅ Fast (2-5 minutes)
- ✅ Reliable (properly signed)
- ✅ Same code as your AAB
- ✅ No conversion needed

**For Play Store:** Upload the AAB file - it's the correct format and Play Store will handle optimization.

