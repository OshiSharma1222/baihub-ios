# BaiHub First Four Pages – Implementation Plan

This document outlines how to implement the four onboarding/entry screens from the design: carousel with themed headers, shared illustration, fixed bottom section (logo, phone input, Get Started, legal links), with logic in hooks and clean code.

---

## 1. Design Summary

### 1.1 Layout Structure

- **Top half (carousel):** One slide per screen. Each slide has:
  - Themed background color (rounded bottom) – yellow, pink, teal, green
  - Title (large, bold, dark grey)
  - Description (smaller, dark grey)
  - Same illustration on all slides: character with broom in circle, smartphone with checklist, house outline, hand with coin, star accents

- **Bottom half (fixed, same on all slides):**
  - Baihub logo (house icon + “baihub” text)
  - Short horizontal separator line
  - Text: “Login or signup to continue”
  - Phone input: “+91-” prefix, placeholder “Enter your phone no”, white rounded field; valid state shows green checkmark
  - “Get Started” button: yellow background, dark grey text, sparkle/star icon on the right
  - Legal: “By proceeding ahead you agree to our” + “Terms of use & Privacy Policy” (tappable)

### 1.2 Four Slides Content

| # | Theme (background) | Title                     | Description                                                                 |
|---|--------------------|---------------------------|-----------------------------------------------------------------------------|
| 1 | Light yellow       | Clean Home, Peaceful Life | We make home care simple, quick & worryfree.                               |
| 2 | Light pink         | Easy Booking & Scheduling | Choose service, select time & confirm as simple as that.                   |
| 3 | Light teal         | Find Trusted Maids        | Background checked, trained & verified professionals.                      |
| 4 | Light green        | On Demand Support         | Our team is available to assist you whenever needed.                       |

### 1.3 Icons to Match Exactly

- **Logo:** House icon (with roof/chimney) + “baihub” wordmark
- **Separator:** Short dark grey horizontal line under logo
- **Phone field:** Standard input; valid state = green circle with white checkmark
- **Get Started button:** Sparkle/star icon to the right of “Get Started” text
- **Illustration:** Single asset (or composite) – character with broom, smartphone checklist, house outline, hand with coin, small star accents

---

## 2. Architecture Principles

- **Logic in hooks:** Carousel index, auto-advance, phone validation, formatting, and navigation/analytics in custom hooks. Screen component only renders and delegates.
- **Clean code:** No emojis in UI or comments. Clear names, small functions, typed interfaces.
- **Exact icons:** Use design assets (or SVG) for logo, separator, sparkle, checkmark; no generic icon set unless it matches the design.

---

## 3. File Structure

```
src/
  screens/
    auth/
      OnboardingSplashScreen.tsx   # Refactor: only UI, uses hooks
  hooks/
    useOnboardingCarousel.ts       # Carousel index, scroll, auto-advance
    useOnboardingPhone.ts          # Phone value, validation, format, submit
    index.ts                       # Export new hooks
  constants/
    onboarding.ts                  # Slide content, theme colors (or in theme)
  components/
    onboarding/
      OnboardingSlide.tsx          # Single slide (header + illustration)
      OnboardingFooter.tsx         # Logo, separator, CTA text, input, button, legal
  assets/
    onboarding/
      logo.png                    # House + "baihub" (replace if needed)
      illustration.png            # Shared illustration
      icon-sparkle.png            # Get Started icon
      icon-check.png              # Valid phone checkmark (or use vector)
```

Optional: `icon-house.tsx` (or similar) for logo if using SVG for sharpness.

---

## 4. Implementation Steps

### Phase 1: Constants and Types

1. **`src/constants/onboarding.ts`**
   - `ONBOARDING_SLIDES`: array of `{ id, title, description, backgroundColor }` for the four slides.
   - `ONBOARDING_HEADER_COLORS`: map or array of background hex values (yellow, pink, teal, green).
   - Export types: `OnboardingSlide`, `OnboardingTheme`.

2. **Theme colors (from design)**
   - Slide 1: light yellow (e.g. `#FFF9E6` or from screenshot)
   - Slide 2: light pink (e.g. `#FFE5EC`)
   - Slide 3: light teal (e.g. `#E0F2F1`)
   - Slide 4: light green (e.g. `#E8F5E9`)
   - Button: yellow `#FFCC00` or `#F9CB00`, text dark grey/black
   - Separator, body text: dark grey

### Phase 2: Hooks

3. **`useOnboardingCarousel.ts`**
   - State: `currentIndex` (0–3).
   - Refs: `flatListRef`, `autoAdvanceTimerRef`.
   - Logic: `scrollToIndex(index)`, `onScroll` (update index from offset), `startAutoAdvance`, `stopAutoAdvance`, cleanup on unmount.
   - Config: slide count, auto-advance interval (e.g. 3s), optional pause on touch.
   - Return: `{ currentIndex, flatListRef, scrollToIndex, onScroll, startAutoAdvance, stopAutoAdvance }`.

4. **`useOnboardingPhone.ts`**
   - State: `phone`, `error`, `isValid` (for showing checkmark).
   - Logic: `formatPhone(value)` (digits only, optional spacing for display), `validatePhone(phone)` (e.g. 10 digits for India), `setPhone`, `clearError`.
   - Submit: `handleGetStarted(navigation)` – validate, then call auth/requestOtp and navigate to OTP (or Login) and analytics.
   - Return: `{ phone, setPhone, error, isValid, handleGetStarted, formatDisplayValue }`.

Keep components free of this logic; they only call hook functions and display state.

### Phase 3: Assets and Icons

5. **Assets**
   - Replace or add: one shared **illustration** (character + broom + checklist + house + coin + stars).
   - **Logo:** house icon + “baihub” (single image or text + icon).
   - **Sparkle/star icon** for Get Started button (right side).
   - **Checkmark icon** for valid phone (green circle + white check).
   - Ensure paths match `require('.../assets/onboarding/...')` from screens.

6. **Exact representation**
   - If design uses specific SVG, use `react-native-svg` and export same shapes.
   - If PNG, use @2x/@3x for resolution; no substitution with different icons.

### Phase 4: UI Components

7. **`OnboardingSlide.tsx`**
   - Props: `slide: OnboardingSlide`, `width` (screen width).
   - Renders: top section with `backgroundColor`, rounded bottom, title, description, illustration (same image for all).
   - No business logic; pure presentational.

8. **`OnboardingFooter.tsx`**
   - Renders: logo, separator line, “Login or signup to continue”, phone input (+91- prefix, placeholder, checkmark when valid), Get Started button (text + sparkle icon), legal text with links.
   - Props: `phone`, `onPhoneChange`, `isValid`, `error`, `onGetStarted`, `onTermsPress`, `onPrivacyPress`.
   - Uses `useOnboardingPhone` only in parent; footer is dumb component.

### Phase 5: Screen and Navigation

9. **`OnboardingSplashScreen.tsx` refactor**
   - Use `useOnboardingCarousel()` and `useOnboardingPhone()`.
   - Layout: top = horizontal `FlatList` (paging) of `OnboardingSlide`; bottom = `OnboardingFooter`.
   - FlatList: `ref`, `onScroll`, `getItemLayout`, `data=ONBOARDING_SLIDES`, no pagination dots in design (add only if required later).
   - Optional: pagination dots below carousel, above footer, if in design.
   - No emojis; no inline validation/formatting logic.

10. **Navigation and analytics**
    - Get Started: on valid phone, call `requestOtp` (or equivalent), then `navigation.navigate('OTPVerification', { phoneNumber })` (or 'Login' if flow differs).
    - Analytics: e.g. `logGetStartedClicked`, `logOtpRequested` from existing service, called from `useOnboardingPhone`.

### Phase 6: Polish

11. **Accessibility**
    - Label for phone input, button, and links.
    - Optional: announce slide change for screen readers.

12. **Legal links**
    - “Terms of use” and “Privacy Policy” open in-app WebView or Linking.openURL; handlers passed from screen or hook.

13. **Cleanup**
    - Remove old 3-slide copy and unused assets if fully replaced.
    - Ensure no duplicate onboarding logic; single source in hooks.

---

## 5. Data and Config (Reference)

```ts
// Example slide structure
interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
}

const ONBOARDING_SLIDES: OnboardingSlide[] = [
  { id: '1', title: 'Clean Home, Peaceful Life', description: 'We make home care simple, quick & worryfree.', backgroundColor: '#FFF9E6' },
  { id: '2', title: 'Easy Booking & Scheduling', description: 'Choose service, select time & confirm as simple as that.', backgroundColor: '#FFE5EC' },
  { id: '3', title: 'Find Trusted Maids', description: 'Background checked, trained & verified professionals.', backgroundColor: '#E0F2F1' },
  { id: '4', title: 'On Demand Support', description: 'Our team is available to assist you whenever needed.', backgroundColor: '#E8F5E9' },
];
```

Adjust hex values to match the exact screenshot.

---

## 6. Order of Implementation (Checklist)

1. [ ] Add `onboarding` constants and types.
2. [ ] Implement `useOnboardingCarousel` and `useOnboardingPhone`.
3. [ ] Add/update assets (illustration, logo, sparkle, checkmark).
4. [ ] Build `OnboardingSlide` and `OnboardingFooter`.
5. [ ] Refactor `OnboardingSplashScreen` to use hooks and new components.
6. [ ] Wire Get Started to auth and OTP screen; add analytics.
7. [ ] Add Terms/Privacy handlers and optional pagination.
8. [ ] Test on iOS/Android; verify icons match design.

---

## 7. Dependencies

- Existing: `react-native`, `@react-navigation`, `react-native-safe-area-context`, `react-native-paper` (optional for inputs).
- For SVG icons (if used): `react-native-svg`.
- No new dependencies required if using PNG assets and current stack.

---

This plan keeps logic in hooks, UI in components, and ensures the four pages and icons match the design before coding.
