# Data Safety Form - Exact Settings for Each Data Type

## ✅ Already Completed (Don't Change)
- **Name**: ✅ Completed
- **User IDs**: ✅ Completed  
- **Address**: ✅ Completed

---

## ⚠️ Need to Configure

### 1. **Phone Number** (Personal info)

Click on "Phone number" → Configure:

#### **Is this data processed ephemerally?**
- **Select: "No, this collected data is not processed ephemerally"**
- **Reason**: Phone numbers are stored in your backend database for authentication and user accounts

#### **Is this data required for your app?**
- **Select: "Data collection is required (users can't turn off this data collection)"**
- **Reason**: Phone number is required for OTP authentication - users cannot use the app without it

#### **Why is this user data collected? Select all that apply:**
- ✅ **Check: "App functionality"**
  - Used for features in your app (OTP authentication, account creation)
  - Required to enable functionality

#### **Data Sharing:**
- ✅ **Shared with third parties**: Yes
  - Backend API (your server)
  - Firebase Analytics (for analytics events)

---

### 2. **Financial Info** (0 of 1 completed)

Click on the financial info section → You'll see "Purchase history" → Configure:

#### **Is this data processed ephemerally?**
- **Select: "No, this collected data is not processed ephemerally"**
- **Reason**: Purchase/order data is stored on your backend server for order management

#### **Is this data required for your app?**
- **Select: "Data collection is required (users can't turn off this data collection)"**
- **Reason**: Required to process payments and manage orders - users cannot complete purchases without it

#### **Why is this user data collected? Select all that apply:**
- ✅ **Check: "App functionality"**
  - Used for features in your app (payment processing, order management)
  - Required to enable functionality

#### **Data Sharing:**
- ✅ **Shared with third parties**: Yes
  - **Razorpay** (payment processor)
  - **Backend API** (your server for order management)

---

## 📋 Quick Reference Table

| Data Type | Ephemeral? | Required? | Purpose | Shared? |
|-----------|------------|-----------|---------|---------|
| **Phone number** | ❌ No | ✅ Yes | App functionality | ✅ Yes (Backend, Firebase) |
| **Purchase history** | ❌ No | ✅ Yes | App functionality | ✅ Yes (Razorpay, Backend) |

---

## 🔄 Step-by-Step Process

### For Phone Number:
1. Click on "Phone number" (blue arrow icon)
2. Select: **"No"** for ephemeral
3. Select: **"Data collection is required"**
4. Check: **"App functionality"**
5. Declare sharing: **Backend API, Firebase Analytics**
6. Click **"Save"**

### For Financial Info:
1. Click on **"Financial info"** section
2. Click on **"Purchase history"** (or similar)
3. Select: **"No"** for ephemeral
4. Select: **"Data collection is required"**
5. Check: **"App functionality"**
6. Declare sharing: **Razorpay, Backend API**
7. Click **"Save"**

---

## ⚠️ Important Notes

1. **Ephemeral = "No"** for all data types
   - Your app stores data on backend servers
   - Ephemeral means "only in memory, not stored"

2. **Required = "Yes"** for both
   - Phone number: Required for authentication
   - Purchase history: Required for payments

3. **Purpose = "App functionality"** for both
   - Both are core features of your app

4. **Third-party sharing = "Yes"** for both
   - Phone number: Shared with Backend API, Firebase
   - Purchase history: Shared with Razorpay, Backend API

---

## ✅ After Completing Both

Once you complete:
- ✅ Phone number
- ✅ Purchase history

The "Next" button should become enabled, and you can proceed to the next section (Data usage and handling).

---

## 🚨 Common Mistakes to Avoid

- ❌ Don't select "Ephemeral = Yes" (your data is stored on servers)
- ❌ Don't select "Optional" for phone number (it's required for app use)
- ❌ Don't forget to declare third-party sharing
- ❌ Don't skip the purpose selection

---

## 📝 Summary

**Phone Number:**
- Ephemeral: **No**
- Required: **Yes**
- Purpose: **App functionality**
- Shared: **Yes** (Backend API, Firebase Analytics)

**Purchase History:**
- Ephemeral: **No**
- Required: **Yes**
- Purpose: **App functionality**
- Shared: **Yes** (Razorpay, Backend API)



