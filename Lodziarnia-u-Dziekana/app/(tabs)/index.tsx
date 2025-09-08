import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Image,
  Platform,
} from "react-native";
import GlobalStyles from "@/styles/GlobalStyles";
import { useRouter } from "expo-router";
import { getAuth, User , signOut} from "firebase/auth";
import { MaterialIcons } from "@expo/vector-icons";
import { articles } from "@/assets/articles/articles";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { getDatabase, ref, set, remove } from "firebase/database";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

const Home = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <View style={styles.header}>
        <Text style={GlobalStyles.title}>Lodziarnia u Dziekana</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() => {
              setMenuOpen(false);
              if (user) {
                router.push("/screens/profile");
              } else {
                router.push("/auth/login");
              }
            }}
            style={styles.profileIcon}
          >
            <MaterialIcons
              name={user ? "person" : "login"}
              size={30}
              color="#e663d0ff"
            />
          </TouchableOpacity>
        </View>
      </View>
      {user && (
        <Text style={GlobalStyles.title}>Witaj, {user.displayName}!</Text>
      )}
      <FlatList
        data={articles}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.articleCard}>
            <Image
              source={{ uri: `https://picsum.photos/seed/${item.id}/400/200` }}
              style={styles.articleImage}
            />
            <Text style={styles.articleTitle}>{item.title}</Text>
            <Text style={styles.articleContent}>{item.content}</Text>
            <Text style={styles.articleAuthor}>Autor: {item.author}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {
    alignItems: "flex-start",
    marginBottom: 0,
    marginTop: 0,
    flexDirection: "row",
    justifyContent: "flex-start",
    position: "relative",
  },
  headerIcons: {
    flexDirection: "row",
    position: "absolute",
    right: 10,
    top: 41,
    alignItems: "center",
    gap: 10,
  },
  profileIcon: {
    // Optionally add padding or margin
  },
  menuContainer: {},
  buttonsContainer: {
    flexDirection: "column",
    rowGap: 20,
  },
  section: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#e663d0ff",
  },
  article: {
    fontSize: 16,
    marginBottom: 6,
    color: "#333",
  },
  articleCard: {
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  articleImage: {
    width: "100%",
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
  articleContent: {
    fontSize: 14,
    marginBottom: 6,
    color: "#555",
  },
  articleAuthor: {
    fontSize: 12,
    color: "#888",
  },
});

export default Home;
