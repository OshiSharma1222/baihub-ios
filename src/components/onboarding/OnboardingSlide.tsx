import React from 'react';
import { Dimensions, Image, StyleSheet, Text, View } from 'react-native';
import type { OnboardingSlide as OnboardingSlideType } from '../../constants/onboarding';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

const ILLUSTRATION_SOURCE = require('../../../assets/character.jpg');

interface OnboardingSlideProps {
  slide: OnboardingSlideType;
  height?: number;
}

export function OnboardingSlide({ slide, height }: OnboardingSlideProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: slide.backgroundColor },
        height ? { height } : undefined,
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {slide.title}
        </Text>
        <Text style={styles.description} numberOfLines={3}>
          {slide.description}
        </Text>
        <View style={styles.illustrationWrap}>
          <Image
            source={ILLUSTRATION_SOURCE}
            style={styles.illustration}
            resizeMode="contain"
            accessibilityLabel="Home care helper illustration"
          />
        </View>
      </View>
    </View>
  );
}

const ILLUSTRATION_SIZE = Math.min(SCREEN_WIDTH * 0.7, 300);

const styles = StyleSheet.create({
  container: {
    width: SCREEN_WIDTH,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 10,
    maxWidth: 300,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 15,
    fontWeight: '400',
    color: '#4A4A4A',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
    maxWidth: 300,
  },
  illustrationWrap: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustration: {
    width: ILLUSTRATION_SIZE,
    height: ILLUSTRATION_SIZE,
  },
});
