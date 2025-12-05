// Custom Toast configuration for beautiful toast messages

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export const toastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={[styles.toast, styles.successToast]}>
      <Icon name="check-circle" size={24} color="#fff" style={styles.icon} />
      <View style={styles.content}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),

  error: ({ text1, text2 }: any) => (
    <View style={[styles.toast, styles.errorToast]}>
      <Icon name="alert-circle" size={24} color="#fff" style={styles.icon} />
      <View style={styles.content}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),

  info: ({ text1, text2 }: any) => (
    <View style={[styles.toast, styles.infoToast]}>
      <Icon name="information" size={24} color="#fff" style={styles.icon} />
      <View style={styles.content}>
        {text1 && <Text style={styles.title}>{text1}</Text>}
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  toast: {
    height: 'auto',
    minHeight: 60,
    width: '90%',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  successToast: {
    backgroundColor: '#4caf50',
  },
  errorToast: {
    backgroundColor: '#f44336',
  },
  infoToast: {
    backgroundColor: '#2196F3',
  },
  icon: {
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 4,
  },
  message: {
    color: '#fff',
    fontSize: 13,
    lineHeight: 18,
  },
});

