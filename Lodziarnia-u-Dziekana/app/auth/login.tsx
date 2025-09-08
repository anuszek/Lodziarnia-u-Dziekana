import React from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import GlobalStyles from "../../styles/GlobalStyles";
import { useRouter } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { ref, get } from "firebase/database";

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        const db = getDatabase();
        const userRef = ref(db, `users/${user.uid}`);
        get(userRef).then((snapshot) => {
          if (snapshot.exists()) {
            console.log("User logged");
            console.log(user);
            router.dismissAll();
            router.replace("/"); // Replace the current route with the home screen (or your desired route)
          } else {
            console.log("No user data in db");
          }
        });
      })
      .catch((error) => {
        console.error("Error logging in:", error);
      });
  };

  const handleRegisterRedirect = () => {
    router.push("/auth/register");
  };

  return (
    <View style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Logowanie</Text>
      <TextInput
        style={GlobalStyles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
        placeholderTextColor="#181717ff"
      />
      <TextInput
        style={GlobalStyles.input}
        placeholder="Hasło"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#181717ff"
      />
      <Button title="Zaloguj się" onPress={handleLogin} />
      <TouchableOpacity
        onPress={handleRegisterRedirect}
        style={{ marginTop: 16, alignItems: "center" }}
      >
        <Text style={{ color: "#007bff", fontSize: 16 }}>
          Nie masz konta? Zarejestruj się
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Login;
