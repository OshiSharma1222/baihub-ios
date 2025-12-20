// Category Tiles component

import React from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Category } from '../../types/home.types';

interface CategoryTilesProps {
  categories: Category[];
  onCategoryPress?: (category: Category) => void;
}

export const CategoryTiles: React.FC<CategoryTilesProps> = ({
  categories,
  onCategoryPress,
}) => {
  if (!categories || categories.length === 0) {
    return null;
  }

  // Helper function to check if icon is a URL
  const isIconUrl = (icon: string | undefined): boolean => {
    if (!icon) return false;
    return icon.startsWith('http://') || icon.startsWith('https://');
  };

  // Helper function to render icon (URL or icon name)
  const renderIcon = (icon: string | undefined, size: number = 54) => {
    if (!icon) {
      return <Icon name="folder" size={size} color="#f9cb00" />;
    }
    
    if (isIconUrl(icon)) {
      return (
        <Image
          source={{ uri: icon }}
          style={{ width: size, height: size }}
          resizeMode="contain"
        />
      );
    }
    
    return <Icon name={icon} size={size} color="#f9cb00" />;
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Browse Categories
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.tile}
            onPress={() => onCategoryPress?.(category)}
            activeOpacity={0.7}
          >
            <View style={styles.iconContainer}>
              {renderIcon(category.icon)}
            </View>
            <Text variant="bodyMedium" style={styles.name} numberOfLines={2}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000000',
  },
  scrollContent: {
    paddingRight: 16,
  },
  tile: {
    width: 100,
    marginRight: 12,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    textAlign: 'center',
    color: '#000000',
    fontSize: 12,
  },
});









