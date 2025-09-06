import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

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

interface StallDetailsModalProps {
  stall: IceCreamStall | null;
  visible: boolean;
  onClose: () => void;
}

export function StallDetailsModal({
  stall,
  visible,
  onClose,
}: StallDetailsModalProps) {
  if (!stall) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.header}>
          <Text style={styles.title}>{stall.name}</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🍦 Informacje</Text>
            <Text style={styles.description}>{stall.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>⭐ Ocena</Text>
            <Text style={styles.rating}>{stall.rating}/5</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🕒 Godziny otwarcia</Text>
            <Text style={styles.hours}>{stall.openHours}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>🌟 Specjalności</Text>
            {stall.specialties.map((specialty, index) => (
              <View key={index} style={styles.specialtyItem}>
                <Text style={styles.specialty}>• {specialty}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.directionsButton}>
            <Text style={styles.directionsButtonText}>📍 Wyznacz trasę</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingTop: 60, // Account for status bar
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  closeButton: {
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  closeButtonText: {
    fontSize: 18,
    color: "#666",
  },
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#666",
  },
  rating: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FF69B4",
  },
  hours: {
    fontSize: 16,
    color: "#666",
  },
  specialtyItem: {
    marginBottom: 4,
  },
  specialty: {
    fontSize: 16,
    color: "#666",
  },
  directionsButton: {
    backgroundColor: "#FF69B4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },
  directionsButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
