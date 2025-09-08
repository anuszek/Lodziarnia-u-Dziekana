import React from "react";
import { View, Text, Button, SafeAreaView, Alert } from "react-native";
import GlobalStyles from "@/styles/GlobalStyles";
import { getAuth, signOut, deleteUser, updateProfile } from "firebase/auth";
import { getDatabase, ref, remove } from "firebase/database";
import { useRouter } from "expo-router";

const Settings = () => {
  const router = useRouter();

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
      <View style={GlobalStyles.button}>
        <Button title="Wyloguj" onPress={handleLogout} color="black" />
      </View>
      <Button title="Usuń Konto" onPress={handleRemoveUser} color="red" />
      <View style={GlobalStyles.button}>
        <Button
          title="Zmień nazwę użytkownika"
          onPress={() => {
            Alert.prompt(
              "Zmień nazwę użytkownika",
              "Wprowadź nową nazwę użytkownika:",
              [
                {
                  text: "Anuluj",
                  style: "cancel",
                },
                {
                  text: "Zmień",
                  onPress: async (newUsername) => {
                    if (!newUsername) return;
                    try {
                      const auth = getAuth();
                      const user = auth.currentUser;
                      if (user) {
                        await updateProfile(user, { displayName: newUsername });
                        Alert.alert(
                          "Sukces",
                          "Nazwa użytkownika została zmieniona."
                        );
                        router.dismissAll();
                        router.replace("/");
                      }
                    } catch (error) {
                      Alert.alert(
                        "Błąd",
                        "Nie udało się zmienić nazwy użytkownika."
                      );
                      console.error(error);
                    }
                  },
                },
              ],
              "plain-text"
            );
          }}
          color="blue"
        />
      </View>
    </SafeAreaView>
  );
};

export default Settings;
