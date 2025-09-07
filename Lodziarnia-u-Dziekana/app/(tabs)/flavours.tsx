// DailyFlavors.tsx
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet, Button, Alert } from "react-native";
import { getDatabase, ref, get, child, set, update } from "firebase/database";
import { app } from "../../firebase";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import GlobalStyles from "@/styles/GlobalStyles";
type Flavour = {
  name: string;
  description: string;
};


const DailyFlavors: React.FC = () => {
  const [flavors, setFlavors] = useState<Flavour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [usrlog, setUsrlog] = useState(false);

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
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setUsrlog(!!firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    fetchFlavors();
  }, []);

  if (loading) {
    return (
      <View style={GlobalStyles.container}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Dzisiejsze smaki:</Text>
      {flavors.length > 0 ? (
        <>
          <FlatList
            data={flavors}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
  <View style={styles.flavourRow}>
        <View style={{ flex: 1 }}>
      <Text style={styles.flavor}>{item.name}</Text>
      <Text style={styles.description}>{item.description}</Text>
    </View>
    {usrlog && (
      <Button
        title="★"
        onPress={async () => {
          if (!user) {
            Alert.alert("Error", "User is not logged in.");
            return;
          }
          try {
            const db = getDatabase(app);
            const favRef = ref(db, `users/${user.uid}/favourites`);
            const favSnap = await get(favRef);
            let currentFavs: string[] = favSnap.exists() ? favSnap.val() : [];
            if (!Array.isArray(currentFavs)) {
              currentFavs = Object.values(currentFavs);
            }
            if (!currentFavs.includes(item.name)) {
              const updatedFavs = [...currentFavs, item.name];
              await set(favRef, updatedFavs);
              Alert.alert("Sukces", `${item.name} dodano do ulubionych!`);
            } else {
              Alert.alert("Info", `${item.name} jest już w ulubionych.`);
            }
          } catch (error) {
            Alert.alert("Błąd", "Nie udało się dodać do ulubionych.");
          }
        }}
      />
    )}
  </View>
  
)}
          />

        </>

      ) : (
        <Text style={styles.noFlavors}>Brak smaków na dziś</Text>
      )}
      <Button title="🎲 Wylosuj smaki" onPress={() => randomizeFlavors(3)} />
    </View>
  );
};

const styles = StyleSheet.create({
  flavor: {
    fontSize: 18,
    paddingVertical: 5,
  },
  noFlavors: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 20,
    fontWeight: "bold",
    color: "red",
  },
  description: {
  fontSize: 14,
  color: "gray",
},
  flavourRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
},
});

export default DailyFlavors;
