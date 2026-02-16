export interface OnboardingSlide {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
}

export const ONBOARDING_SLIDES: OnboardingSlide[] = [
  {
    id: '1',
    title: 'Clean Home, Peaceful Life',
    description: 'We make home care simple, quick & worryfree.',
    backgroundColor: '#FFF9E6',
  },
  {
    id: '2',
    title: 'Easy Booking & Scheduling',
    description: 'Choose service, select time & confirm as simple as that.',
    backgroundColor: '#FFE5EC',
  },
  {
    id: '3',
    title: 'Find Trusted Maids',
    description: 'Background checked, trained & verified professionals.',
    backgroundColor: '#E0F2F1',
  },
  {
    id: '4',
    title: 'On Demand Support',
    description: 'Our team is available to assist you whenever needed.',
    backgroundColor: '#E8F5E9',
  },
];

export const ONBOARDING_AUTO_ADVANCE_INTERVAL_MS = 3000;

export const PHONE_COUNTRY_PREFIX = '+91';
export const PHONE_MIN_DIGITS = 10;
export const PHONE_MAX_DIGITS = 15;
