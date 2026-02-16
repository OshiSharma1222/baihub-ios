import { useCallback, useEffect, useRef, useState } from 'react';
import type { FlatList, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
import { ONBOARDING_AUTO_ADVANCE_INTERVAL_MS, ONBOARDING_SLIDES } from '../constants/onboarding';

const SLIDE_COUNT = ONBOARDING_SLIDES.length;

interface UseOnboardingCarouselParams {
  screenWidth: number;
  enabled?: boolean;
}

interface UseOnboardingCarouselReturn {
  currentIndex: number;
  flatListRef: React.RefObject<FlatList<any> | null>;
  scrollToIndex: (index: number) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}

export function useOnboardingCarousel({
  screenWidth,
  enabled = true,
}: UseOnboardingCarouselParams): UseOnboardingCarouselReturn {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any> | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const currentIndexRef = useRef(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      const safeIndex = Math.max(0, Math.min(index, SLIDE_COUNT - 1));
      flatListRef.current?.scrollToIndex({
        index: safeIndex,
        animated: true,
      });
      setCurrentIndex(safeIndex);
      currentIndexRef.current = safeIndex;
    },
    []
  );

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetX = event.nativeEvent.contentOffset.x;
      const index = Math.round(offsetX / screenWidth);
      if (index >= 0 && index < SLIDE_COUNT && index !== currentIndexRef.current) {
        setCurrentIndex(index);
        currentIndexRef.current = index;
      }
    },
    [screenWidth]
  );

  useEffect(() => {
    if (!enabled) return;

    const advance = () => {
      const next = (currentIndexRef.current + 1) % SLIDE_COUNT;
      try {
        flatListRef.current?.scrollToIndex({
          index: next,
          animated: true,
        });
      } catch {
        // Ignore scroll errors if FlatList is not ready
      }
      setCurrentIndex(next);
      currentIndexRef.current = next;
    };

    timerRef.current = setInterval(advance, ONBOARDING_AUTO_ADVANCE_INTERVAL_MS);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled]);

  return {
    currentIndex,
    flatListRef,
    scrollToIndex,
    onScroll,
  };
}
