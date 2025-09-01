import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getDatabase, ref, set, update } from 'firebase/database';
import { getAuth, User, updateProfile } from "firebase/auth";
import { router } from 'expo-router';

const SetupTab: React.FC = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');
    const [age, setAge] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    const handleLogin = async () => {
        if (name.trim().length === 0 || lastName.trim().length === 0 || age.trim().length === 0) {
            Alert.alert('Please fill in all fields');
            return;
        }
        if (isNaN(Number(age)) || Number(age) <= 0) {
            Alert.alert('Please enter a valid age');
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('No user is logged in');
                return;
            }
            const db = getDatabase();
            updateProfile(user, {
                displayName: `${name} ${lastName}`,
            }).catch(() => {
                Alert.alert('Error updating profile');
            });
            await update(ref(db, `users/${user.uid}/`), {
                name: name,
                lastName: lastName,
                age: Number(age),
            });
            setLoggedIn(true);
            //router.push('/(pages)/flavours');
        } catch (error) {
            Alert.alert('Error saving user data');
        }
    };

    // Always call all hooks before returning JSX!
    return (
        <View style={styles.container}>
            {loggedIn ? (
                <>
                    <Text style={styles.welcome}>
                        Welcome, {name} {lastName}!
                    </Text>
                    <Text>Your age: {age}</Text>
                    <Text>You are now logged in.</Text>
                </>
            ) : (
                <>
                    <Text style={styles.title}>Create New User</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter name"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter last name"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Enter age"
                        value={age}
                        onChangeText={setAge}
                        keyboardType="numeric"
                    />
                    <Button title="Continue" onPress={handleLogin} />
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
    title: { fontSize: 24, marginBottom: 16 },
    input: { width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 16, borderRadius: 4 },
    welcome: { fontSize: 20, marginBottom: 8 },
});

export default SetupTab;