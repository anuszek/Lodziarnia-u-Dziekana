import React from "react";
import MapView, { Marker } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";

export default function MapScreen() {
  console.log("key: ", process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider="google"
        initialRegion={{
          latitude: 52.2297, // Warsaw
          longitude: 21.0122,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        {/* Add a marker for a specific point */}
        <Marker
          coordinate={{ latitude: 37.78825, longitude: -122.4324 }}
          title={"A Famous Place"}
          description={"This is a description of the place."}
        />
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
