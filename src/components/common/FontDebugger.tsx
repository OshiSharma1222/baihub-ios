// Font Debugger Component - Use this to verify fonts are loaded correctly
// Remove this component before production

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';

export default function FontDebugger() {
  const testFonts = [
    { name: 'Inter-Regular', weight: '400' },
    { name: 'Inter-Light', weight: '300' },
    { name: 'Inter-Medium', weight: '500' },
    { name: 'Inter-Bold', weight: '700' },
    { name: 'System', weight: '400' }, // For comparison
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Font Loading Debugger</Text>
      <Text style={styles.subtitle}>Platform: {Platform.OS}</Text>
      
      {testFonts.map((font) => (
        <View key={font.name} style={styles.fontRow}>
          <Text style={styles.fontName}>{font.name}</Text>
          <Text
            style={[
              styles.testText,
              { fontFamily: font.name, fontWeight: font.weight },
            ]}
          >
            The quick brown fox jumps over the lazy dog
          </Text>
          <Text style={styles.fontInfo}>
            Weight: {font.weight} | Family: {font.name}
          </Text>
        </View>
      ))}

      <View style={styles.comparison}>
        <Text style={styles.comparisonTitle}>Visual Comparison:</Text>
        <Text style={[styles.comparisonText, { fontFamily: 'Inter-Regular' }]}>
          Inter-Regular: ABCDEFGHIJKLMNOPQRSTUVWXYZ
        </Text>
        <Text style={[styles.comparisonText, { fontFamily: 'System' }]}>
          System Font: ABCDEFGHIJKLMNOPQRSTUVWXYZ
        </Text>
        <Text style={styles.note}>
          If both lines look identical, Inter may not be loading correctly.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  fontRow: {
    marginBottom: 30,
    padding: 15,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  fontName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  testText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000',
  },
  fontInfo: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Inter-Regular',
  },
  comparison: {
    marginTop: 20,
    padding: 15,
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
  },
  comparisonTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Inter-Bold',
  },
  comparisonText: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: 'Inter-Regular',
  },
  note: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#666',
    marginTop: 10,
    fontFamily: 'Inter-Regular',
  },
});


