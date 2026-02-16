import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useCallback, useState } from 'react';
import {
    Dimensions,
    FlatList,
    LayoutChangeEvent,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { OnboardingFooter, OnboardingSlide } from '../../components/onboarding';
import { ONBOARDING_SLIDES } from '../../constants/onboarding';
import { useOnboardingCarousel } from '../../hooks/useOnboardingCarousel';
import { useOnboardingPhone } from '../../hooks/useOnboardingPhone';
import { useRootNavigationOptional } from '../../navigation/RootNavigationContext';
import type { LoginV2StackParamList } from '../../navigation/types';
import { useAuthStore } from '../../store';

type Props = NativeStackScreenProps<LoginV2StackParamList, 'Onboarding'>;

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
// So slides show immediately even before onLayout (avoids blank carousel)
const DEFAULT_CAROUSEL_HEIGHT = Math.max(280, SCREEN_HEIGHT * 0.4);

export default function OnboardingSplashScreen({ navigation, route }: Props) {
  const useSlidesOnlyFlow = (route.params as { useSlidesOnlyFlow?: boolean } | undefined)?.useSlidesOnlyFlow === true;
  const { isAuthenticated, isNewUser } = useAuthStore();
  const rootNav = useRootNavigationOptional();
  const setShowMainApp = rootNav?.setShowMainApp;
  const showContinueToHome = isAuthenticated && !isNewUser;

  // Measure carousel container height so slides get explicit dimensions; start with default so slides show right away
  const [carouselHeight, setCarouselHeight] = useState(DEFAULT_CAROUSEL_HEIGHT);
  const onCarouselLayout = useCallback((e: LayoutChangeEvent) => {
    const h = e.nativeEvent.layout.height;
    if (h > 0) setCarouselHeight(h);
  }, []);

  const handleContinueToHome = () => {
    setShowMainApp?.(true);
  };

  const {
    currentIndex,
    flatListRef,
    onScroll,
  } = useOnboardingCarousel({
    screenWidth: SCREEN_WIDTH,
    enabled: true,
  });

  const {
    displayValue,
    setPhone,
    isValid,
    error,
    isLoading,
    handleGetStarted,
  } = useOnboardingPhone({ navigation: navigation as Parameters<typeof useOnboardingPhone>[0]['navigation'] });

  const handleGetStartedSlidesOnly = () => {
    navigation.navigate('Auth' as never);
  };

  const renderSlide = ({ item }: { item: (typeof ONBOARDING_SLIDES)[0] }) => (
    <OnboardingSlide slide={item} height={carouselHeight} />
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Carousel area — flex: 1 fills remaining space above footer; FlatList always mounts so slides are visible */}
      <View style={styles.carouselWrapper} onLayout={onCarouselLayout}>
        <FlatList
          ref={flatListRef}
          data={ONBOARDING_SLIDES}
          renderItem={renderSlide}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          getItemLayout={(_, index) => ({
            length: SCREEN_WIDTH,
            offset: SCREEN_WIDTH * index,
            index,
          })}
        />
      </View>

      {/* Pagination dots */}
      <View style={styles.dotsContainer}>
        {ONBOARDING_SLIDES.map((slide, index) => (
          <View
            key={slide.id}
            style={[
              styles.dot,
              index === currentIndex ? styles.dotActive : styles.dotInactive,
            ]}
          />
        ))}
      </View>

      {useSlidesOnlyFlow ? (
        <View style={styles.slidesOnlyFooter}>
          <TouchableOpacity
            style={styles.getStartedButton}
            onPress={handleGetStartedSlidesOnly}
            activeOpacity={0.85}
          >
            <Text style={styles.getStartedText}>Get Started</Text>
          </TouchableOpacity>
          {showContinueToHome && (
            <TouchableOpacity
              onPress={handleContinueToHome}
              style={styles.continueWrap}
              activeOpacity={0.7}
            >
              <Text style={styles.continueText}>Continue to Home</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <OnboardingFooter
          phoneDisplayValue={displayValue}
          onPhoneChange={setPhone}
          isValid={isValid}
          error={error}
          isLoading={isLoading}
          onGetStarted={handleGetStarted}
          showContinueToHome={showContinueToHome}
          onContinueToHome={handleContinueToHome}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF9E6',
  },
  carouselWrapper: {
    flex: 1,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFF9E6',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: '#FFCC00',
    width: 24,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#D9D9D9',
  },
  slidesOnlyFooter: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 12,
  },
  getStartedButton: {
    backgroundColor: '#FFCC00',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  getStartedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 17,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  continueWrap: {
    alignItems: 'center',
  },
  continueText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    color: '#424242',
    textDecorationLine: 'underline',
  },
});
