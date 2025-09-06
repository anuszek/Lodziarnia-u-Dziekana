import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Marker } from "react-native-maps";

interface IceCreamStall {
  id: string;
  name: string;
  coordinate: {
    latitude: number;
    longitude: number;
  };
  description: string;
  rating: number;
  openHours: string;
  specialties: string[];
}

interface IceCreamMarkerProps {
  stall: IceCreamStall;
  onStallPress: (stall: IceCreamStall) => void;
}

export function IceCreamMarker({ stall, onStallPress }: IceCreamMarkerProps) {
  return (
    <Marker coordinate={stall.coordinate} onPress={() => onStallPress(stall)}>
      {/* Custom marker design */}
      <View style={styles.markerContainer}>
        <View style={styles.marker}>
          <Text style={styles.markerText}>🍦</Text>
        </View>
        <View style={styles.markerTriangle} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: "center",
  },
  marker: {
    backgroundColor: "#FF69B4",
    padding: 8,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  markerText: {
    fontSize: 20,
    textAlign: "center",
  },
  markerTriangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#FF69B4",
    marginTop: -1,
  },
});
