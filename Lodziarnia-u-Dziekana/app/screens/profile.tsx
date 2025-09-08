import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import GlobalStyles from "@/styles/GlobalStyles";
import { getAuth } from "firebase/auth";
import { get, getDatabase, onValue, ref } from "firebase/database";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const Profile = () => {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const pointsRef = user ? ref(db, "users/" + user.uid + "/points") : null;
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (pointsRef) {
      const unsubscribe = onValue(pointsRef, (snapshot) => {
        const data = snapshot.val();
        setPoints(data);
      });
      return unsubscribe;
    }
  }, [pointsRef]);

  const [rewardsArray, setRewardsArray] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const rewardsRef = ref(db, "users/" + user.uid + "/rewards");
    get(rewardsRef).then((snapshot) => {
      if (snapshot.exists()) {
        const rewardsData = snapshot.val();
        const rewardsArray = Object.values(rewardsData);
        setRewardsArray(rewardsArray);
      } else {
        setRewardsArray([]);
        console.log("No rewards found");
      }
    });
  }, [user, db]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Profil</Text>
      <TouchableOpacity
        style={{ position: "absolute", top: 85, right: 20 }}
        onPress={() => router.push("/screens/settings")}
      >
        <MaterialCommunityIcons name="account-cog" size={24} color="red" />
      </TouchableOpacity>
      <Text style={styles.header}>
        Twoje Punkty: <Text style={styles.varText}>{points || 0}</Text>
      </Text>
      <Text style={styles.hardText}>
        Imię:{" "}
        <Text style={styles.varText}>
          {" "}
          {user ? user.displayName || "No Name" : "No Name"}
        </Text>
      </Text>
      <Text style={styles.hardText}>
        Email:{" "}
        <Text style={styles.varText}>
          {" "}
          {user ? user.email || "No Email" : "No Email"}
        </Text>
      </Text>
      <View style={{ marginTop: 20 }}>
        <Text style={styles.header}>Twoje Nagrody:</Text>
        {rewardsArray.length === 0 && (
          <Text style={styles.varText}>Brak nagród do wyświetlenia.</Text>
        )}
        <FlatList
          data={rewardsArray}
          keyExtractor={(item, index) =>
            item.id ? String(item.id) : String(index)
          }
          renderItem={({ item, index }) => (
            <View
              style={styles.articleCard}
              key={item.id ? String(item.id) : String(index)}
            >
              <Text style={styles.articleTitle}>{item.title}</Text>
              <Text style={styles.articleContent}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = {
  varText: {
    color: "#333",
    fontSize: 20,
    fontWeight: "bold" as "bold",
    textAlign: "center" as "center",
    marginTop: 0,
    marginBottom: 20,
  },
  hardText: {
    color: "#e663d0ff",
    fontWeight: "bold" as "bold",
    textAlign: "left" as "left",
    fontSize: 16,
    marginVertical: 4,
  },
  header: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold" as "bold",
    color: "#e663d0ff",
    textAlign: "center" as "center",
  },
  articleCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold" as const,
    marginBottom: 4,
  },
  articleContent: {
    fontSize: 14,
    marginBottom: 4,
  },
};

export default Profile;
