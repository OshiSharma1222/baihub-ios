# BaiHub Mobile App - Permissions Documentation for App Store Reviewers

## 📱 App Overview

**App Name**: BaiHub Mobile  
**Bundle ID**: com.baihub.app  
**Version**: 1.0.0  
**Platform**: React Native (Expo) - iOS & Android

**App Purpose**: BaiHub is a service marketplace mobile application that connects users with verified, background-checked household service providers (helpers). The app allows users to:
- Browse service categories (home cleaning, maintenance, etc.)
- Select service areas and time slots
- Choose subscription plans
- Book and manage service orders
- Process payments via Razorpay
- View order history and manage profile

**Key Functionality**:
- User authentication via OTP (phone number-based)
- Service discovery and booking
- Payment processing
- Order management
- Location-based service area selection (optional)

---

## 🔐 Permissions Requested and Justifications

### ANDROID PERMISSIONS

#### 1. INTERNET ✅ REQUIRED - Core Functionality
**Permission**: `android.permission.INTERNET`

**Why This Permission is Essential**:
The BaiHub app is a service marketplace that requires constant internet connectivity to function. Without internet access, the app cannot:
- Authenticate users via OTP verification
- Fetch service categories, plans, and pricing
- Display service areas and availability
- Process bookings and orders
- Handle payment transactions through Razorpay
- Sync user profile data
- Load testimonials and promotional banners
- Update order status in real-time

**Technical Implementation**:
- All API calls use HTTPS endpoints
- Axios HTTP client with interceptors for authentication
- Token-based authentication system
- Real-time data synchronization

**User Impact**: If internet is disabled, the app will display appropriate error messages and cannot perform any core functions. This is expected behavior for a service marketplace app.

**App Store Justification**: Standard permission for any app requiring network connectivity. No alternative implementation possible.

---

#### 2. ACCESS_FINE_LOCATION ✅ OPTIONAL - User Experience Enhancement
**Permission**: `android.permission.ACCESS_FINE_LOCATION`

**Why This Permission is Requested**:
The app requests location permission to automatically detect the user's city during the registration/setup process. This provides a better user experience by:
- Pre-filling the city field in the user profile
- Reducing manual data entry
- Ensuring accurate service area matching

**How It's Used**:
- **When**: Only requested when the user explicitly taps the "Detect Location" button during registration
- **Frequency**: One-time use during initial setup
- **Data Collected**: Only current location coordinates (latitude/longitude)
- **Data Processing**: Coordinates are immediately reverse-geocoded to city name
- **Data Storage**: Location coordinates are NOT stored. Only the derived city name is saved to user profile.
- **Data Sharing**: Location data is never shared with third parties

**User Control**:
- Permission is completely optional
- User can deny permission and manually enter their city
- App functions fully without location permission
- No features are disabled if permission is denied

**Code Reference**: `src/screens/auth/UserDetailsScreen.tsx` - Uses `expo-location` library's `requestForegroundPermissionsAsync()` method

**Privacy Compliance**:
- Location is only accessed when app is in foreground
- No background location tracking
- No continuous location monitoring
- Data is used solely for city detection, not stored or shared

**App Store Justification**: Optional convenience feature. App provides clear alternative (manual entry) if permission is denied. Location is only used for one-time city detection, not tracking.

---

#### 3. ACCESS_COARSE_LOCATION ✅ OPTIONAL - Fallback for Location Services
**Permission**: `android.permission.ACCESS_COARSE_LOCATION`

**Why This Permission is Requested**:
This is a fallback permission that provides approximate location (city-level accuracy) when fine location is not available. This is sufficient for our use case since we only need to determine the user's city, not exact coordinates.

**How It's Used**:
- Same usage as ACCESS_FINE_LOCATION
- Used as fallback when fine location is unavailable
- Provides city-level accuracy which is sufficient for service area matching

**User Control**: Same as ACCESS_FINE_LOCATION - completely optional

**App Store Justification**: Standard Android permission pair. Coarse location provides sufficient accuracy for city detection use case.

---

#### 4. VIBRATE ✅ STANDARD - User Experience Enhancement
**Permission**: `android.permission.VIBRATE`

**Why This Permission is Requested**:
Provides haptic feedback for user interactions, enhancing the user experience with tactile responses to button presses and notifications.

**How It's Used**:
- Standard React Native/Expo framework functionality
- Provides feedback for button interactions
- Used by notification system (if implemented)

**User Control**: User can disable via device settings

**App Store Justification**: Standard permission for haptic feedback. No privacy implications.

---

### PERMISSIONS REMOVED (Not Used)

#### READ_EXTERNAL_STORAGE ❌ REMOVED
**Status**: This permission was initially declared but has been removed as it is not used.

**Why It's Not Needed**:
- App uses `AsyncStorage` for internal data storage (authentication tokens, user preferences)
- No file picker functionality
- No image upload from gallery
- No document access
- No external file reading

**Impact**: None - app doesn't require this permission for any functionality.

---

#### WRITE_EXTERNAL_STORAGE ❌ REMOVED
**Status**: This permission was initially declared but has been removed as it is not used.

**Why It's Not Needed**:
- No file downloads
- No image saving to gallery
- No document creation
- No external file writing

**Impact**: None - app doesn't require this permission for any functionality.

---

### iOS PERMISSIONS

#### 1. NSLocationWhenInUseUsageDescription ✅ OPTIONAL - User Experience Enhancement
**Permission Key**: `NSLocationWhenInUseUsageDescription`  
**User-Facing Description**: "This app needs access to your location to automatically detect your city. You can enter your city manually if you prefer not to share your location."

**Why This Permission is Requested**:
Same as Android - to automatically detect user's city during registration for better user experience.

**How It's Used**:
- Requested only when user taps location button
- Uses `expo-location` library's `requestForegroundPermissionsAsync()` method
- One-time use during registration
- Only accesses location when app is in foreground
- Coordinates are reverse-geocoded to city name
- Location coordinates are NOT stored

**User Control**:
- Completely optional
- User can deny and enter city manually
- App functions fully without permission

**Privacy Compliance**:
- Foreground-only access
- No background tracking
- No data storage or sharing
- One-time use only

**App Store Justification**: Optional convenience feature with clear user benefit. Provides manual alternative. Complies with Apple's location permission guidelines.

---

#### 2. NSLocationAlwaysUsageDescription ❌ REMOVED
**Status**: This permission was initially declared but has been removed.

**Why It Was Removed**:
- App only uses foreground location (`requestForegroundPermissionsAsync()`)
- No background location tracking functionality
- No location-based notifications
- No continuous location monitoring
- Not needed for app functionality

**Impact**: None - app doesn't require background location access.

---

#### 3. NSLocationAlwaysAndWhenInUseUsageDescription ❌ REMOVED
**Status**: This permission was initially declared but has been removed.

**Why It Was Removed**: Same as above - only foreground location is needed.

---

## 📋 Data Collection and Privacy

### Location Data
- **What**: Current location coordinates (latitude/longitude)
- **When**: Only when user explicitly requests city detection
- **How**: Reverse geocoded to city name
- **Storage**: Coordinates are NOT stored. Only city name is saved to user profile.
- **Sharing**: Never shared with third parties
- **Retention**: City name stored in user profile (can be updated by user)

### User Data
- **Authentication**: Phone number-based OTP (stored securely)
- **Profile**: Name, email, city (user-provided)
- **Orders**: Service bookings and payment information
- **Storage**: All data stored in app's internal storage (AsyncStorage)
- **Sharing**: User data is not shared with third parties except payment processor (Razorpay) for transaction processing

### Analytics
- **Service**: Firebase Analytics
- **Data**: App usage, screen views, user interactions
- **Purpose**: Improve app experience and understand user behavior
- **Privacy**: Complies with Firebase privacy policies

---

## ✅ App Store Submission Notes

### Google Play Store - Data Safety Section

**Location Data**:
- **Collection**: Optional - only for city detection
- **Purpose**: Improve user experience by auto-filling city
- **Sharing**: Not shared with third parties
- **Retention**: City name stored in user profile (user can update)
- **Required**: No - app works without location permission

**User Data**:
- **Collection**: Phone number, name, email, city (user-provided)
- **Purpose**: Account creation, service booking, order management
- **Sharing**: Only with payment processor (Razorpay) for transactions
- **Retention**: Stored until user account deletion
- **Security**: HTTPS encryption, secure token storage

**Payment Data**:
- **Collection**: Payment information processed by Razorpay
- **Purpose**: Service booking payment processing
- **Sharing**: With Razorpay (payment processor)
- **Retention**: Handled by Razorpay per their privacy policy
- **Security**: PCI-DSS compliant payment processing

### Apple App Store - Privacy Manifest

**Location Data**:
- **Type**: Precise Location (when-in-use)
- **Purpose**: City detection for user convenience
- **Optional**: Yes - user can deny and enter manually
- **Collection**: One-time during registration
- **Storage**: Only city name stored, not coordinates
- **Sharing**: Not shared

**User Data**:
- **Type**: Account information, service bookings
- **Purpose**: App functionality, order management
- **Collection**: User-provided during registration
- **Storage**: Internal app storage
- **Sharing**: Only with payment processor for transactions

---

## 🔒 Security and Privacy Measures

1. **HTTPS Only**: All API communications use HTTPS encryption
2. **Token-Based Auth**: Secure JWT token authentication
3. **Secure Storage**: Authentication tokens stored in app's secure internal storage
4. **No Background Tracking**: Location only accessed when app is in use
5. **Minimal Data Collection**: Only collects data necessary for app functionality
6. **User Control**: Users can deny permissions and still use the app
7. **Data Minimization**: Location coordinates not stored, only derived city name

---

## 📝 Reviewer Notes Template

### For Google Play Store Reviewers:

**App Category**: Service Marketplace / Home Services  
**Primary Function**: Connect users with verified service providers

**Permission Justifications**:
1. **INTERNET**: Required for all app functionality (service listings, bookings, payments)
2. **LOCATION**: Optional feature for city auto-detection. User can manually enter city if denied.
3. **VIBRATE**: Standard haptic feedback for user interactions

**Privacy Compliance**:
- Location is optional and only used for one-time city detection
- No background location tracking
- Location coordinates not stored
- User data not shared except with payment processor
- All communications encrypted via HTTPS

**User Experience**:
- App functions fully without location permission
- Clear permission prompts with explanations
- Manual alternatives provided for all optional features

### For Apple App Store Reviewers:

**App Category**: Lifestyle / Service Marketplace  
**Primary Function**: Service booking and management platform

**Permission Justifications**:
1. **Location (When In Use)**: Optional feature for city auto-detection during registration. User can deny and enter manually.

**Privacy Compliance**:
- Foreground-only location access
- One-time use during registration
- Location coordinates not stored
- Clear permission description explaining optional nature
- Complies with Apple's location permission guidelines

**User Experience**:
- Permission is optional - app works without it
- Clear explanation of why location is requested
- Manual city entry available as alternative

---

## ✅ Compliance Checklist

- [x] All permissions have clear, documented justifications
- [x] Unused permissions have been removed
- [x] Location permission is optional (app works without it)
- [x] Location is only accessed when app is in foreground
- [x] Location coordinates are not stored
- [x] User can deny permissions without breaking app functionality
- [x] Permission descriptions are clear and user-friendly
- [x] Privacy policy covers all data collection
- [x] No background location tracking
- [x] No unnecessary data collection
- [x] All communications encrypted (HTTPS)
- [x] User data not shared except with payment processor

---

## 📞 Support Information

**Developer Contact**: [Your contact information]  
**Privacy Policy URL**: [Your privacy policy URL]  
**Terms of Service URL**: [Your terms URL]  
**Support Email**: [Your support email]

---

## 🔄 Version History

**v1.0.0** (Current):
- Initial release
- Removed unused storage permissions
- Removed unused background location permissions
- Only requests necessary permissions with clear justifications

---

**END OF DOCUMENT**

*This document is ready to be used as input for generating comprehensive app store reviewer notes. Copy and paste this entire document into ChatGPT with the prompt: "Using this permissions documentation, create comprehensive notes for app store reviewers (both Google Play Store and Apple App Store) that clearly explain each permission, its justification, and privacy compliance."*
