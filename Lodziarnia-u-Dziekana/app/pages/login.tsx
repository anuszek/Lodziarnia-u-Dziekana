import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getDatabase } from 'firebase/database';
import { ref, get } from 'firebase/database';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');

    const handleLogin = () => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            const db = getDatabase();
            const userRef = ref(db, `users/${user.uid}`);
            get(userRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    router.push('/(tabs)/home');
                } else {
                    console.log("Brak danych użytkownika w bazie");
                }
            });
        })
        .catch((error) => {
            console.error('Error logging in:', error);
            console.log('Logger: Error caught in login:', error);
        });
};

    const handleRegisterRedirect = () => {
        router.push('/pages/register');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <TouchableOpacity onPress={handleRegisterRedirect} style={styles.registerLink}>
                <Text style={styles.registerText}>Don't have an account? Register</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 24,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 32,
        marginBottom: 32,
        textAlign: 'center',
        fontWeight: 'bold',
    },
    input: {
        height: 48,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 16,
        paddingHorizontal: 12,
        fontSize: 16,
    },
    registerLink: {
        marginTop: 16,
        alignItems: 'center',
    },
    registerText: {
        color: '#007bff',
        fontSize: 16,
    },
});

export default Login;