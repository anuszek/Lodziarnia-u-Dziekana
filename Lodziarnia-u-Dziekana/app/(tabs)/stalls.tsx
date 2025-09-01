import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Platform, Alert } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import * as Location from "expo-location";

type AppState = {
  loading: boolean;
  location: Location.LocationObject | null;
  errorMsg: string | null;
};

export default function Stalls() {
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('Requesting location permissions...');
        let { status } = await Location.requestForegroundPermissionsAsync();
        console.log('Permission status:', status);
        
        if (status !== 'granted') {
          console.log('Permission denied');
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        console.log('Getting current position...');
        let locationResult = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
          // maximumAge: 10000,
        });
        console.log('Location received:', locationResult);
        
        setLocation(locationResult);
        setLoading(false);
        console.log('Loading set to false');
      } catch (error) {
        console.error('Location error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setErrorMsg(`Failed to get location: ${errorMessage}`);
        setLoading(false);
      }
    })();
  }, []);

  console.log('Render - loading:', loading, 'hasLocation:', !!location, 'error:', errorMsg);

  if (loading) {
    console.log('Showing loading screen');
    return (
      <View style={styles.centerContainer}>
        <Text>Loading location...</Text>
      </View>
    );
  }

  if (errorMsg) {
    console.log('Showing error screen');
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  if (!location) {
    console.log('Showing no location screen');
    return (
      <View style={styles.centerContainer}>
        <Text>No location data available</Text>
      </View>
    );
  }

  console.log('Showing map');
  const region = {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  return (
    <View style={styles.container}>
      <Text style={{ position: 'absolute', top: 50, left: 20, zIndex: 1000, backgroundColor: 'red', color: 'white', padding: 10 }}>
        MAP IS RENDERING - Loading: {loading.toString()}
      </Text>
      <MapView
        style={styles.map}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        initialRegion={region}
        showsUserLocation={true}
        showsMyLocationButton={true}
        onMapReady={() => console.log('Map is ready')}
        // loadingEnabled={true}
      >
        <Marker
          coordinate={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }}
          title="Your Location"
          description="You are here"
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  map: {
    flex: 1,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
  },
  debugText: {
    color: "gray",
    marginTop: 10,
  },
});
