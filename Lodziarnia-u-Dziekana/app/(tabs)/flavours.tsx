// DailyFlavors.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from "react-native";
import { getDatabase, ref, get, child, set } from "firebase/database";
import { app } from "../../firebase";
import { getAuth } from "firebase/auth";
type Flavour = {
  name: string;
  description: string;
};
const user = getAuth(app).currentUser;

const DailyFlavors: React.FC = () => {
  const [flavors, setFlavors] = useState<Flavour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchFlavors = async () => {
    try {
      setLoading(true);
      const dbRef = ref(getDatabase(app));
      const snapshot = await get(child(dbRef, "todayFlavours"));

      if (snapshot.exists()) {
        setFlavors(snapshot.val());
      } else {
        setFlavors([]);
      }
    } catch (error) {
      console.error("Błąd pobierania smaków:", error);
    } finally {
      setLoading(false);
    }
  };

  const randomizeFlavors = async (count = 3) => {
    try {
      setLoading(true);
      const db = getDatabase(app);
      const snapshot = await get(ref(db, "allFlavours"));
      if (!snapshot.exists()) {
        Alert.alert("Błąd", "Brak danych w allFlavours");
        setLoading(false);
        return;
      }

      const allFlavours = snapshot.val();
      const flavoursArray = Array.isArray(allFlavours)
        ? allFlavours
        : Object.values(allFlavours);

      // Losowanie
      const shuffled = [...flavoursArray].sort(() => Math.random() - 0.5);
      const todayFlavours = shuffled.slice(0, count);

      await set(ref(db, "todayFlavours"), todayFlavours);
      Alert.alert("Sukces", "Wylosowano nowe smaki!");
      await fetchFlavors();
    } catch (error) {
      console.error(error);
      Alert.alert("Błąd", "Nie udało się ustawić smaków");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlavors();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dzisiejsze smaki:</Text>
      {flavors.length > 0 ? (
        <>
        <FlatList
        data={flavors}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ marginBottom: 10 }}>
            <Text style={styles.flavor}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
        </View>
        )}
  />
   {user && (
      <Button
        title="Dodaj do ulubionych"
        onPress={() => set(ref(getDatabase(app), `users/${user.uid}/favourites`), flavors)}
      />
    )}
  </>

      ) : (
        <Text style={styles.noFlavors}>Brak smaków na dziś</Text>
      )}
      <Button title="🎲 Wylosuj smaki" onPress={() => randomizeFlavors(3)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  flavor: {
    fontSize: 18,
    paddingVertical: 5,
  },
  noFlavors: {
    fontSize: 18,
    color: "gray",
  },
  description: {
  fontSize: 14,
  color: "gray",
},
});

export default DailyFlavors;
