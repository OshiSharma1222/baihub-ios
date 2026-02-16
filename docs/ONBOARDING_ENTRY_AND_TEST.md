# Onboarding as first screen – entry point and how to test

## 1. Entry point (no Home first)

- **App.tsx** mounts **RootNavigator** only. There is no other navigator as the root.
- **RootNavigator** uses a gate (`showMainApp` in `RootNavigationContext`):
  - **`showMainApp === false`** (default on every cold start):  
    Renders a stack with **only** `Onboarding` and `Auth`.  
    **`initialRouteName="Onboarding"`** – so the first screen is always Onboarding.  
    The **Main/Home** screen is not in this stack, so the app cannot open on Home.
  - **`showMainApp === true`**:  
    Renders the main app stack (Main, AreaSelection, Checkout, etc.) with **`initialRouteName="Main"`**.

So after the native splash, the first React screen is **Onboarding**, not Home.

## 2. No “first launch” flag that skips onboarding

- We do **not** use `hasSeenOnboarding` (or similar) in AsyncStorage to skip onboarding.
- On app load, **App.tsx** removes any legacy keys (`hasSeenOnboarding`, `has_seen_onboarding`, `onboarding_complete`) from AsyncStorage so an old build cannot force-skip onboarding.
- **`showMainApp`** is React state only (not persisted). Every cold start it is `false`, so onboarding stack is shown first.

## 3. No splash-screen redirect to Home

- There is no splash component that does `navigation.replace("Home")` or `navigation.replace("Main")`.
- The only way to show the main app is to call **`setShowMainApp(true)`** from:
  - Onboarding screen: “Continue to Home”
  - OTP screen: after successful OTP for existing user
  - User details screen: after new user completes details
  - (After logout we call **`setShowMainApp(false)`** so the user is sent back to Onboarding.)

## 4. Which navigator is used

- **App.js / App.tsx** renders **RootNavigator** only.
- **RootNavigator** is the only root; it conditionally renders either the Onboarding stack or the Main app stack (see above).
- **AuthNavigator** and **MainNavigator** are children of RootNavigator, not alternate roots.

## 5. Metro cache and seeing changes

If you still see Home first after these changes:

1. **Clear Metro cache and restart:**
   ```bash
   npm run start:reset
   ```
   or:
   ```bash
   npx expo start --dev-client --clear
   ```

2. **Rebuild and reinstall:**
   - **iOS:** Uninstall the app from simulator/device, then `npx expo run:ios`.
   - **Android:** Uninstall the app, then `npx expo run:android`.

3. **Optional – clear app storage (dev):**  
   Uninstall the app and install again, or clear app data in device/simulator settings so no old AsyncStorage state is used.

## 6. Route name

- The first screen is registered as **`Onboarding`** (capital O, rest lowercase).
- Navigation and types use **`"Onboarding"`** consistently (no `OnBoarding` or other spelling).

## 7. Quick check that onboarding is wired

- After native splash, you should see the **Onboarding** screen (four slides + phone + Get Started).
- If you still see Home, the navigator tree in use is not the one that has **`initialRouteName="Onboarding"`** for the initial stack, or an old bundle is being used – follow step 5 (cache + reinstall).
