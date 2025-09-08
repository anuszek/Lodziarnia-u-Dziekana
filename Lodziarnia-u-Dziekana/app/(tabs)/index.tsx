import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { getAuth, signOut, User } from "firebase/auth";
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
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
useEffect(() => {
  registerForPushNotificationsAsync()
    .then((token) => {
      setExpoPushToken(token ?? "");
      console.log("Expo Push Token:", token);
    })
    .catch((error: any) => {
      setExpoPushToken(`${error}`);
      console.log("Expo Push Token Error:", error);
    });

  const notificationListener = Notifications.addNotificationReceivedListener(
    (notification) => {
      setNotification(notification);
    }
  );

  const responseListener =
    Notifications.addNotificationResponseReceivedListener((response) => {
      console.log(response);
    });

  return () => {
    notificationListener.remove();
    responseListener.remove();
  };
}, []);
useEffect(() => {
  // Save token to Realtime Database under user's UID when both are available
  if (user && expoPushToken) {
    const db = getDatabase();
    set(ref(db, `users/${user.uid}/expoPushToken`), expoPushToken);
  }
}, [user, expoPushToken]);

  useEffect(() => {
    const auth = getAuth();
    setUser(auth.currentUser);
  }, []);

const handleSignOut = async () => {
  const auth = getAuth();
  // Remove token from Realtime Database on logout
  if (user) {
    const db = getDatabase();
    await remove(ref(db, `users/${user.uid}/expoPushToken`));
  }
  signOut(auth);
};

  const navigateTo = (screen: string) => {
    router.push(`/screens/${screen}` as any);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Lodziarnia u Dziekana</Text>
        <Text style={styles.welcome}>Witaj, {user?.email}</Text>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("profile")}
        >
          <Text style={styles.buttonText}>Profil</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("minesweeper")}
        >
          <Text style={styles.buttonText}>Saper</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigateTo("wires_game")}
        >
          <Text style={styles.buttonText}>ඞ Amogus ඞ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/auth/login")}
        >
          <Text style={styles.buttonText}>Zaloguj</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
        <Text style={styles.logoutText}>Wyloguj</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  welcome: {
    fontSize: 16,
    color: "#666",
  },
  buttonsContainer: {
    flex: 1,
    justifyContent: "center",
    gap: 20,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default Home;