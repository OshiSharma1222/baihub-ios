# Android Icon Cropping Fix Guide

## ⚠️ Problem: Icon Cropping on App Listing

Your Android adaptive icon is cropping because:
- **Adaptive icons** have a **safe zone** (center ~66% of the image)
- Content outside the safe zone gets cropped/masked by different launchers
- Your `adaptive-icon.png` (1080x1080) likely has important content near the edges

## ✅ Solution: Fix the Adaptive Icon (Don't Remove It)

**DO NOT remove `adaptiveIcon`** - Android requires it for modern launchers.

### Option 1: Use the Same Icon for Both (Recommended)

If `icon.png` looks good, use it for Android adaptive icon too:

```javascript
android: {
  adaptiveIcon: {
    foregroundImage: './assets/icon.png',  // Use same icon
    backgroundColor: '#ffffff',
  },
}
```

**Requirements:**
- Icon should be **1024x1024px** (or larger, will be resized)
- Important content should be in the **center 66%** (safe zone)
- Background color should match your icon's background

### Option 2: Create Proper Adaptive Icon

If you need a separate adaptive icon:

1. **Size**: 1080x1080px (you have this ✅)
2. **Safe Zone**: Keep important content in center 66% (about 712x712px area)
3. **Padding**: Add padding around edges so nothing important is near borders
4. **Background**: Use solid color that matches your design

### Option 3: Use Icon with Padding

Create a new adaptive icon with:
- Same icon as iOS
- White/transparent padding around edges
- Total size: 1080x1080px
- Icon content in center, padded

---

## 🔧 Quick Fix: Use icon.png for Adaptive Icon

Since your `icon.png` (512x512) looks good on iOS, let's use it for Android too:

```javascript
android: {
  adaptiveIcon: {
    foregroundImage: './assets/icon.png',  // Same as iOS
    backgroundColor: '#ffffff',  // Or your brand color
  },
}
```

**Note:** Expo will automatically resize it to 1024x1024 for Android.

---

## 📋 Android Adaptive Icon Requirements

- **Size**: 1024x1024px (minimum)
- **Format**: PNG with transparency
- **Safe Zone**: Center 66% (important content should be here)
- **Background**: Solid color (no transparency)
- **Shape**: Will be masked to circle/square by launcher

---

## 🎯 Recommended Action

1. **Keep `adaptiveIcon`** (required for Android)
2. **Use `icon.png` for both** if it looks good
3. **Or create a properly padded adaptive icon** with safe zones

The cropping happens because Android adaptive icons are designed to be masked/cropped by different launchers. The solution is to ensure your icon content fits within the safe zone, not to remove the adaptive icon.



