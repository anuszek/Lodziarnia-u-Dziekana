import React, { useState, useEffect } from "react";
import {
  Text,
  Button,
  SafeAreaView,
  Alert,
  Touchable,
  TouchableOpacity,
} from "react-native";
import GlobalStyles from "@/styles/GlobalStyles";
import { getAuth, signOut, deleteUser, updateProfile } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import { useRouter } from "expo-router";
import { ChangeUsernameModal } from "@/components/settings/ChangeUsernameModal";

const Settings = () => {
  const router = useRouter();
  const [showUsernameModal, setShowUsernameModal] = useState(false);
  const [currentUsername, setCurrentUsername] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;
    if (user) {
      setCurrentUsername(user.displayName || "");
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    if (auth.currentUser) {
      signOut(auth)
        .then(() => {
          router.dismissAll();
          router.replace("/");
          console.log("User signed out");
        })
        .catch((error) => {
          console.error("Sign-out error", error);
        });
    } else {
      console.log("No user is currently signed in");
    }
  };

  const handleUsernameChange = async (newUsername: string) => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: newUsername });
        setCurrentUsername(newUsername);
        Alert.alert("Sukces", "Nazwa użytkownika została zmieniona.");
        router.dismissAll();
        router.replace("/");
      }
    } catch (error) {
      Alert.alert("Błąd", "Nie udało się zmienić nazwy użytkownika.");
      console.error(error);
    }
  };

  const handleRemoveUser = () => {
    Alert.alert(
      "Usuń Konto",
      "Czy na pewno chcesz usunąć swoje konto? Tej akcji nie można cofnąć.",
      [
        {
          text: "Anuluj",
          style: "cancel",
        },
        {
          text: "Usuń",
          style: "destructive",
          onPress: () => {
            handleLogout();
            deleteUserAndData();
          },
        },
      ]
    );
  };

  const deleteUserAndData = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    if (user) {
      user
        .delete()
        .then(() => {
          console.log("User deleted");
          // Remove user data from the database
          const userRef = ref(db, "users/" + user.uid);
          remove(userRef)
            .then(() => {
              console.log("User data removed from database");
              deleteUser(auth.currentUser!)
                .then(() => {
                  router.dismissAll();
                  router.replace("/");
                })
                .catch((error) => {
                  console.error("Error deleting user", error);
                });
            })
            .catch((error) => {
              console.error("Error removing user data from database", error);
            });
        })
        .catch((error) => {
          console.error("Error deleting user", error);
        });
    } else {
      console.log("No user is currently signed in");
    }
  };

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Ustawienia</Text>
      <TouchableOpacity style={GlobalStyles.button} onPress={handleLogout}>
        <Text style={GlobalStyles.buttonText}>Wyloguj</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={GlobalStyles.button}
        onPress={() => setShowUsernameModal(true)}
      >
        <Text style={GlobalStyles.buttonText}>Zmień nazwę użytkownika</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[GlobalStyles.button, { backgroundColor: '#e80000ff' }]} onPress={handleRemoveUser}>
        <Text style={GlobalStyles.buttonText}>Usuń Konto</Text>
      </TouchableOpacity>

      <ChangeUsernameModal
        visible={showUsernameModal}
        onClose={() => setShowUsernameModal(false)}
        onConfirm={handleUsernameChange}
        currentUsername={currentUsername}
      />
    </SafeAreaView>
  );
};

export default Settings;
