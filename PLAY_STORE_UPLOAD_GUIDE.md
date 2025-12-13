# Google Play Store Internal Testing Upload Guide

## ✅ Your AAB File is Ready

- **File**: `application-bd463ce6-dadd-47bc-828b-6345dccbc9a4.aab`
- **Size**: 73MB (normal - contains all architectures)
- **Build**: Production profile with proper signing
- **Status**: ✅ Ready for upload

## Method 1: Manual Upload (Recommended for First Time)

### Prerequisites

1. **Google Play Console Account**
   - Go to: https://play.google.com/console
   - Sign in with your developer account
   - Pay the $25 one-time registration fee (if not done)

2. **Create App Listing** (if not exists)
   - Click "Create app"
   - Fill in:
     - App name: "BaiHub" (or your app name)
     - Default language: English
     - App or game: App
     - Free or paid: Free
     - Declarations: Accept all required

### Upload Steps

1. **Go to Internal Testing**
   - In Play Console → Your app → Testing → Internal testing
   - Click "Create new release"

2. **Upload AAB**
   - Click "Upload" under "App bundles"
   - Select: `/Users/aj/Downloads/application-bd463ce6-dadd-47bc-828b-6345dccbc9a4.aab`
   - Wait for upload and processing (5-10 minutes)

3. **Add Release Notes**
   - Enter release notes (e.g., "Initial release for internal testing")
   - Click "Save"

4. **Review and Rollout**
   - Review the release
   - Click "Review release"
   - Click "Start rollout to Internal testing"

5. **Add Testers**
   - Go to "Testers" tab
   - Create a tester list or use email addresses
   - Share the testing link with your team

### What Happens Next

- ✅ Google Play processes your AAB (5-10 minutes)
- ✅ Generates optimized APKs for different devices
- ✅ Makes app available to your testers
- ✅ Testers can install via the testing link

---

## Method 2: Automated Upload with EAS Submit

### Prerequisites

1. **Service Account Setup**
   - Go to: Google Cloud Console → IAM & Admin → Service Accounts
   - Create a service account
   - Download JSON key file
   - Save as: `google-play-service-account.json` in project root
   - Grant "App Manager" role in Play Console

2. **Update eas.json** (already configured)
   ```json
   {
     "submit": {
       "production": {
         "android": {
           "serviceAccountKeyPath": "./google-play-service-account.json",
           "track": "internal"  // Change to "alpha", "beta", or "production" as needed
         }
       }
     }
   }
   ```

### Automated Upload

```bash
# Submit to internal testing track
eas submit --platform android --profile production
```

**Advantages:**
- ✅ Automated upload
- ✅ No manual steps
- ✅ Can be integrated into CI/CD

---

## Important Notes

### Before First Upload

1. **Complete App Listing** (Required)
   - App name, description, screenshots
   - Privacy policy URL
   - Content rating questionnaire
   - Store listing graphics

2. **Version Information**
   - Current version: `1.0.0` (from app.config.js)
   - Version code: `1` (auto-incremented by Play Store)
   - For future releases, increment version in `app.config.js`

3. **Signing**
   - ✅ Your AAB is already signed by EAS
   - ✅ EAS manages your upload keystore securely
   - ✅ Future builds must use the same keystore (EAS handles this)

### Testing Tracks

- **Internal testing**: Up to 100 testers, fastest review
- **Closed testing (Alpha/Beta)**: More testers, longer review
- **Open testing**: Public beta, anyone can join
- **Production**: Public release

### After Upload

1. **Processing Time**: 5-10 minutes for Play Store to process
2. **Testing Link**: Share with testers after processing
3. **Updates**: Upload new AABs to same track for updates
4. **Version**: Must increment version for each new release

---

## Troubleshooting

### Upload Fails

- **Check file size**: 73MB is fine (max 150MB for AAB)
- **Check signing**: EAS handles this automatically
- **Check version**: Must be higher than previous uploads

### Testers Can't Install

- **Wait for processing**: Can take 5-10 minutes
- **Check tester list**: Ensure emails are added
- **Check device compatibility**: Some devices may not be supported

### Version Conflicts

- **Error**: "Version code already used"
- **Solution**: Increment version in `app.config.js` and rebuild

---

## Next Steps After Internal Testing

1. **Gather Feedback**: Collect tester feedback
2. **Fix Issues**: Address any bugs found
3. **Update Version**: Increment to `1.0.1` in `app.config.js`
4. **Rebuild**: Create new AAB with fixes
5. **Upload Again**: Upload to same track or move to production

---

## Quick Checklist

- [ ] Google Play Console account created
- [ ] App listing created (name, description, screenshots)
- [ ] Privacy policy URL added
- [ ] Content rating completed
- [ ] AAB file ready (✅ Done - 73MB)
- [ ] Testers list prepared
- [ ] Upload to Internal testing track
- [ ] Share testing link with team

---

## Your Current Status

✅ **AAB File**: Ready (73MB, properly signed)  
✅ **EAS Config**: Configured for internal testing  
⚠️ **Service Account**: Need to set up for automated upload  
✅ **Manual Upload**: Ready to go

**Recommendation**: Start with **Method 1 (Manual Upload)** for your first release to familiarize yourself with the process. Use **Method 2 (EAS Submit)** for future automated releases.



