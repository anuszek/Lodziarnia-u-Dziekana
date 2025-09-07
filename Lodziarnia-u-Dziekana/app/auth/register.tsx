import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { getAuth, createUserWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";
import { router } from 'expo-router';

const RegisterScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const email_pattern = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/);
    const [name, setName] = useState('');

    const handleRegister = () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Błąd', 'Wszystkie pola są wymagane.');
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert('Błąd', 'Hasła nie pasują do siebie.');
            return;
        }
        if (!email_pattern.test(email)) {
            Alert.alert('Błąd', 'Nieprawidłowy format adresu e-mail.');
            return;
        }
        const auth = getAuth();
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                //success
                const user = userCredential.user;
                // Update user profile with display name
                if (user) {
                    await updateProfile(user, { displayName: name });
                }
                // Store additional user info in Realtime Database
                var data = {"email": email, "points": 0};
                const db = getDatabase();
                await set(ref(db, 'users/' + user.uid), data);
                
                router.dismissAll();
                router.push('/');
            })
            .catch((error) => {
                Alert.alert('Błąd', error.message);
            });
    };

    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.title}>Register</Text>
            <TextInput
                style={GlobalStyles.input}
                placeholder="Imię"
                placeholderTextColor="#181717ff"
                value={name}
                onChangeText={setName}
            />
            <TextInput
                style={GlobalStyles.input}
                placeholder="Email"
                placeholderTextColor="#181717ff"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={GlobalStyles.input}
                placeholder="Hasło"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#181717ff"
            />
            <TextInput
                style={GlobalStyles.input}
                placeholder="Potwierdź Hasło"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholderTextColor="#181717ff"
            />
            <Button title="Zarejestruj" onPress={handleRegister} />
        </View>
    );
};



export default RegisterScreen;