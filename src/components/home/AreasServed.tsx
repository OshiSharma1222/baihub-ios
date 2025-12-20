// Areas Served component

import React from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Text, Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { AreasServed as AreasServedType } from '../../types/home.types';

interface AreasServedProps {
  areas: AreasServedType;
  onAreaPress?: (areaId: string, areaName: string) => void;
  onViewAll?: () => void;
}

export const AreasServed: React.FC<AreasServedProps> = ({
  areas,
  onAreaPress,
  onViewAll,
}) => {
  if (!areas || !areas.cities || areas.cities.length === 0) {
    return null;
  }

  // Helper function to check if icon is a URL
  const isIconUrl = (icon: string | undefined): boolean => {
    if (!icon) return false;
    return icon.startsWith('http://') || icon.startsWith('https://');
  };

  // Helper function to render icon (URL or icon name)
  const renderIcon = (icon: string | undefined, size: number = 48) => {
    if (!icon) {
      return <Icon name="map-marker" size={size} color="#f9cb00" />;
    }
    
    if (isIconUrl(icon)) {
      return (
        <Image
          source={{ uri: icon }}
          style={{ width: size, height: size, borderRadius: 48 }}
          resizeMode="contain"
        />
      );
    }
    
    return <Icon name={icon} size={size} color="#f9cb00" />;
  };

  // Show top 6 cities, rest can be viewed via "View All"
  const displayedCities = areas.cities.slice(0, 6);
  const hasMore = areas.cities.length > 6;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text variant="titleLarge" style={styles.title}>
          Areas We Serve
        </Text>
        {hasMore && onViewAll && (
          <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
            <Text variant="bodyMedium" style={styles.viewAll}>
              View All ({areas.totalAreas})
            </Text>
          </TouchableOpacity>
        )}
      </View>
      <View style={styles.grid}>
        {displayedCities.map((city, index) => (
          <TouchableOpacity
            key={city.id || index}
            style={styles.cityCard}
            onPress={() => onAreaPress?.(city.id || '', city.name)}
            activeOpacity={0.7}
          >
            {renderIcon(city.icon)}
            <Text variant="bodyMedium" style={styles.cityName}>
              {city.name}
            </Text>
            <Text variant="bodySmall" style={styles.serviceCount}>
              {city.serviceCount} services
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontWeight: 'bold',
    color: '#000000',
  },
  viewAll: {
    color: '#f9cb00',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cityCard: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    alignItems: 'center',
  },
  cityName: {
    fontWeight: '600',
    color: '#000000',
    marginTop: 8,
    marginBottom: 4,
    textAlign: 'center',
  },
  serviceCount: {
    color: '#666666',
    fontSize: 12,
  },
});








