import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import {getAuth, signOut, User} from 'firebase/auth';

const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    const handleSignOut = () => {
        const auth = getAuth();
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
                onPress={() => navigateTo('profile')}
            >
                <Text style={styles.buttonText}>Profil</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigateTo('minesweeper')}
            >
                <Text style={styles.buttonText}>Saper</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => navigateTo('wires_game')}
            >
                <Text style={styles.buttonText}>ඞ Amogus ඞ</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button} 
                onPress={() => router.push('/auth/login')}
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
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    welcome: {
        fontSize: 16,
        color: '#666',
    },
    buttonsContainer: {
        flex: 1,
        justifyContent: 'center',
        gap: 20,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
    logoutButton: {
        backgroundColor: '#FF3B30',
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    logoutText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default Home;