# Location Data Safety Configuration Guide

## ✅ You've Selected Both Location Types
- Approximate location ✅
- Precise location ✅

## 🔧 Next Steps: Configure Each Location Type

### Step 1: Click on "Approximate location"

You should see a blue arrow or clickable link next to "Approximate location". Click it to open the configuration modal.

### Step 2: Configure "Approximate location"

In the modal that opens, configure:

#### **"Is this data collected, shared, or both?"**
- ✅ **Collected**: Check this box
- ❌ **Shared**: Leave unchecked (coordinates are used locally, not sent to backend)

#### **"Is this data processed ephemerally?"**
- ✅ **Select: "Yes, this collected data is processed ephemerally"**
- **Reason**: Location coordinates are only used in memory to reverse geocode and get the city name. They are not stored anywhere.

#### **"Is this data required for your app?"**
- ✅ **Select: "Users can choose whether this data is collected"**
- **Reason**: Location is optional - users can enter city manually if they don't grant permission

#### **"Why is this user data collected? Select all that apply:"**
- ✅ **Check: "App functionality"**
  - Used for features in your app (city auto-detection)
  - Required to enable functionality (optional feature)

#### **Click "Save"**

---

### Step 3: Click on "Precise location"

Repeat the same configuration as above.

#### **"Is this data collected, shared, or both?"**
- ✅ **Collected**: Check this box
- ❌ **Shared**: Leave unchecked

#### **"Is this data processed ephemerally?"**
- ✅ **Select: "Yes, this collected data is processed ephemerally"**

#### **"Is this data required for your app?"**
- ✅ **Select: "Users can choose whether this data is collected"**

#### **"Why is this user data collected?"**
- ✅ **Check: "App functionality"**

#### **Click "Save"**

---

## 📋 Quick Reference

| Setting | Approximate Location | Precise Location |
|---------|---------------------|------------------|
| **Collected** | ✅ Yes | ✅ Yes |
| **Shared** | ❌ No | ❌ No |
| **Ephemeral** | ✅ Yes | ✅ Yes |
| **Required** | ❌ No (Optional) | ❌ No (Optional) |
| **Purpose** | App functionality | App functionality |

---

## ⚠️ If You Don't See Configuration Options

If clicking on the location types doesn't open a configuration modal:

1. **Check if you're in the right section**
   - Make sure you're in "Data collected" → "Location"
   - Not in "Data shared" section

2. **Try expanding the section**
   - Look for a "Show details" or expand arrow
   - Click to expand the location section

3. **Check if you need to go back**
   - You might need to go back to the "Data types" step
   - Then click on "Location" category
   - Then configure each location type

4. **Refresh the page**
   - Sometimes the form needs a refresh to show all options

---

## 🎯 Expected Behavior

After configuring both location types:
- Both should show as "Completed" with green checkmarks
- You should be able to proceed to the next section
- The "Next" button should become enabled

---

## 💡 Key Points

1. **Ephemeral = Yes** because coordinates are only used in memory
2. **Shared = No** because coordinates aren't sent to backend
3. **Required = No** because it's optional (users can enter city manually)
4. **Purpose = App functionality** for city auto-detection

---

## ✅ After Configuration

Once both location types are configured:
1. Both should show "Completed" status
2. You can proceed to the next section
3. Continue with the rest of the Data Safety form

