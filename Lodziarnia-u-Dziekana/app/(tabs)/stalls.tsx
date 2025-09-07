import React, { useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Dimensions } from "react-native";
import { IceCreamMarker } from "@/components/stalls/IceCreamMarker";
import { StallDetailsModal } from "@/components/stalls/StallDetailModal";

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

const SAMPLE_STALLS: IceCreamStall[] = [
  {
    id: "1",
    name: "Lodziarnia u Dziekana",
    coordinate: { latitude: 50.06748570596136, longitude: 19.91592382195521 },
    description:
      "Najlepsze lody w mieście! Tradycyjne receptury i świeże składniki.",
    rating: 5.0,
    openHours: "10:00 - 22:00",
    specialties: ["Pistacjowe", "Czekoladowe", "Waniliowe", "Sezonowe smaki"],
  },
  {
    id: "2",
    name: "Sweet Dreams Ice Cream",
    coordinate: { latitude: 52.2407, longitude: 21.0194 },
    description:
      "Artystyczne lody z lokalnymi składnikami. Każdy smak to małe dzieło sztuki!",
    rating: 4.6,
    openHours: "12:00 - 20:00",
    specialties: ["Lawenda", "Róża", "Malina", "Karmel"],
  },
  {
    id: "3",
    name: "Gelato Paradise",
    coordinate: { latitude: 52.2187, longitude: 21.0052 },
    description: "Autentyczne włoskie gelato przygotowywane codziennie rano.",
    rating: 4.9,
    openHours: "11:00 - 23:00",
    specialties: ["Tiramisu", "Stracciatella", "Limoncello", "Nutella"],
  },
];

export default function MapScreen() {
  const [selectedStall, setSelectedStall] = useState<IceCreamStall | null>(
    null
  );
  const [modalVisible, setModalVisible] = useState(false);

  const handleStallPress = (stall: IceCreamStall) => {
    setSelectedStall(stall);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedStall(null);
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: 50.06748570596136,
          longitude: 19.91592382195521,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        // loadingIndicatorColor="red"
        // loadingBackgroundColor="yellow"
        mapType="standard"
        rotateEnabled={true}
        scrollEnabled={true}
        zoomEnabled={true}
      >
        {/* Render ice cream stall markers */}
        {SAMPLE_STALLS.map((stall) => (
          <IceCreamMarker
            key={stall.id}
            stall={stall}
            onStallPress={handleStallPress}
          />
        ))}
      </MapView>

      {/* Stall details modal */}
      <StallDetailsModal
        stall={selectedStall}
        visible={modalVisible}
        onClose={closeModal}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});
