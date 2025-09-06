// DailyFlavors.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { getDatabase, ref, get, child, set, update } from "firebase/database";
import { app } from "../../firebase";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { TouchableOpacity } from "react-native";

import { getAuth, onAuthStateChanged, User } from "firebase/auth";
type Flavour = {
  name: string;
  description: string;
};

const DailyFlavors: React.FC = () => {
  const [flavors, setFlavors] = useState<Flavour[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<User | null>(null);
  const [usrlog, setUsrlog] = useState(false);
  const [favourites, setFavourites] = useState<string[]>([]);
  
  const fetchFlavors = async () => {
  try {
    setLoading(true);
    const today = new Date().toISOString().split("T")[0]; // e.g. "2025-09-01"
    const db = getDatabase(app);
    const todayRef = ref(db, `todayFlavours/${today}`);
    const snapshot = await get(todayRef);

    if (snapshot.exists()) {
      setFlavors(snapshot.val());
    } else {
      // Randomize and save for today
      const allSnapshot = await get(ref(db, "allFlavours"));
      if (!allSnapshot.exists()) {
        Alert.alert("Błąd", "Brak danych w allFlavours");
        setFlavors([]);
        return;
      }
      const allFlavours = Array.isArray(allSnapshot.val())
        ? allSnapshot.val()
        : Object.values(allSnapshot.val());
      const shuffled = [...allFlavours].sort(() => Math.random() - 0.5);
      const todayFlavours = shuffled.slice(0, 3);
      await set(todayRef, todayFlavours);
      setFlavors(todayFlavours);
    }
  } catch (error) {
    console.error("Błąd pobierania smaków:", error);
    setFlavors([]);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    if (user) {
      const db = getDatabase(app);
      const favRef = ref(db, `users/${user.uid}/favourites`);
      get(favRef).then((favSnap) => {
        let favs: string[] = favSnap.exists() ? favSnap.val() : [];
        if (!Array.isArray(favs)) favs = Object.values(favs);
        setFavourites(favs);
      });
    } else {
      setFavourites([]);
    }
  }, [user]);

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
              <View style={styles.flavourRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.flavor}>{item.name}</Text>
                  <Text style={styles.description}>{item.description}</Text>
                </View>
                {usrlog && (
                  <TouchableOpacity
                    style={styles.starButton}
                    onPress={async () => {
                      if (!user) {
                        Alert.alert("Error", "User is not logged in.");
                        return;
                      }
                      try {
                        const db = getDatabase(app);
                        const favRef = ref(db, `users/${user.uid}/favourites`);
                        let updatedFavs: string[];
                        const isFavourite = favourites.includes(item.name);
                        if (isFavourite) {
                          updatedFavs = favourites.filter(
                            (f) => f !== item.name
                          );
                        } else {
                          updatedFavs = [...favourites, item.name];
                        }
                        await set(favRef, updatedFavs);
                        setFavourites(updatedFavs);
                      } catch (error) {
                        Alert.alert("Error", "Could not update favourites.");
                      }
                    }}
                  >
                    <MaterialCommunityIcons
                      name={
                        favourites.includes(item.name) ? "star" : "star-outline"
                      }
                      size={32}
                      color={
                        favourites.includes(item.name) ? "#ffe066" : "#ccc"
                      }
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        </>
      ) : (
        <Text style={styles.noFlavors}>Brak smaków na dziś</Text>
      )}
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
  flavourRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  starButton: {
    padding: 6,
    borderRadius: 20,
    minWidth: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default DailyFlavors;
