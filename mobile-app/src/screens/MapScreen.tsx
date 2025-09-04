import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Alert,
  TouchableOpacity,
  Text,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ParkingSpot, Location as LocationType } from '../types/ParkingSpot';
import ApiService from '../services/api';

const { width, height } = Dimensions.get('window');

interface MapScreenProps {
  onSpotSelect: (spot: ParkingSpot) => void;
}

const MapScreen: React.FC<MapScreenProps> = ({ onSpotSelect }) => {
  const [location, setLocation] = useState<LocationType | null>(null);
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const mapRef = useRef<MapView>(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required to find parking spots.');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const currentLocation: LocationType = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(currentLocation);
      await fetchParkingSpots(currentLocation);
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Unable to get your location. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchParkingSpots = async (userLocation: LocationType) => {
    try {
      setLoading(true);
      const spots = await ApiService.getParkingSpots(userLocation, {
        radius: 1000,
        availability: true,
      });
      setParkingSpots(spots);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      Alert.alert('Error', 'Unable to fetch parking spots. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerPress = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    onSpotSelect(spot);
  };

  const getMarkerColor = (spot: ParkingSpot) => {
    if (spot.availability.current === 0) return '#EF4444'; // Red
    if (spot.availability.current < 10) return '#F59E0B'; // Orange
    if (spot.availability.current < 30) return '#10B981'; // Green
    return '#3B82F6'; // Blue
  };

  const centerMapOnLocation = () => {
    if (location && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading map...</Text>
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.errorContainer}>
        <Text>Unable to get your location</Text>
        <TouchableOpacity style={styles.retryButton} onPress={getCurrentLocation}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        showsUserLocation
        showsMyLocationButton={false}
      >
        {/* User location marker */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="Your Location"
          pinColor="blue"
        />

        {/* Parking spot markers */}
        {parkingSpots.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{
              latitude: spot.coordinates.latitude,
              longitude: spot.coordinates.longitude,
            }}
            title={spot.name}
            description={`${spot.availability.current} spots available`}
            onPress={() => handleMarkerPress(spot)}
          >
            <View style={[styles.marker, { backgroundColor: getMarkerColor(spot) }]}>
              <Text style={styles.markerText}>
                {spot.availability.current}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>

      {/* Map controls */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.controlButton} onPress={centerMapOnLocation}>
          <Text style={styles.controlButtonText}>📍</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlButton} onPress={getCurrentLocation}>
          <Text style={styles.controlButtonText}>🔄</Text>
        </TouchableOpacity>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Availability</Text>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.legendText}>Full</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#F59E0B' }]} />
          <Text style={styles.legendText}>Limited</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: '#10B981' }]} />
          <Text style={styles.legendText}>Available</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  retryButton: {
    backgroundColor: '#1E3A8A',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  marker: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  markerText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  controls: {
    position: 'absolute',
    top: 50,
    right: 20,
    flexDirection: 'column',
  },
  controlButton: {
    backgroundColor: 'white',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  controlButtonText: {
    fontSize: 20,
  },
  legend: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  legendTitle: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  legendColor: {
    width: 15,
    height: 15,
    borderRadius: 7.5,
    marginRight: 10,
  },
  legendText: {
    fontSize: 12,
  },
});

export default MapScreen;
