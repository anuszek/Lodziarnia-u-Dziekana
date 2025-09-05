import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { getAuth, User, updateProfile } from "firebase/auth";
import { router } from 'expo-router';

const SetupTab: React.FC = () => {
    const [name, setName] = useState('');
    const [lastName, setLastName] = useState('');

    const handleLogin = async () => {
        if (name.trim().length === 0 || lastName.trim().length === 0) {
            Alert.alert('Please fill in all fields');
            return;
        }

        try {
            const auth = getAuth();
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('No user is logged in');
                return;
            }
            updateProfile(user, {
                displayName: `${name} ${lastName}`,
            }).catch(() => {
                Alert.alert('Error updating profile');
            });
            router.dismissAll();
            router.replace('/'); // Navigate to the main screen after setup
        } catch (error) {
            Alert.alert('Error saving user data');
        }
    };

    // Always call all hooks before returning JSX!
    return (
        <View style={styles.container}>
            {(
                <>
                    <Text style={styles.title}>Create New User</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Imie"
                        value={name}
                        onChangeText={setName}
                        autoCapitalize="words"
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Nazwisko"
                        value={lastName}
                        onChangeText={setLastName}
                        autoCapitalize="words"
                    />
                    <Button title="Zatwierdź" onPress={handleLogin} />
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