import React, { useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IceCreamMarker } from "@/components/stalls/IceCreamMarker";
import { StallDetailsModal } from "@/components/stalls/StallDetailModal";
import GlobalStyles from "@/styles/GlobalStyles";

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
    <View style={GlobalStyles.container}>
      <Text style={[GlobalStyles.title, styles.title]}>Nasza Lodziarnia</Text>
      <SafeAreaView style={styles.container}>
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
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    // marginTop: 16, // Reduced margin since SafeAreaView already handles safe area
  },
  map: {
    flex: 1,
  },
});
