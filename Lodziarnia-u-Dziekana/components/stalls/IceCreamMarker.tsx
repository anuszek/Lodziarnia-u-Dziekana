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
    <Marker
      coordinate={stall.coordinate}
      onPress={() => onStallPress(stall)}
      renderToHardwareTextureAndroid={true}
    >
      <View style={styles.markerContainer}>
        <View style={styles.diamond}>
          <View style={styles.innerDiamond} />
        </View>
        <View style={styles.pointer} />
      </View>
    </Marker>
  );
}

const styles = StyleSheet.create({
  markerContainer: {
    alignItems: 'center',
  },
  diamond: {
    width: 24,
    height: 24,
    // backgroundColor: '#00fffbff',
    transform: [{ rotate: '45deg' }],
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDiamond: {
    width: 16,
    height: 16,
    backgroundColor: '#FF69B4',
  },
  pointer: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderBottomWidth: 0,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#FF69B4',
    marginTop: -4,
  },
});
