import React, {useEffect, useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {getAuth, signOut, User} from 'firebase/auth';

import Hamburger from 'react-native-hamburger';



const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

    const navigateTo = (screen: string) => {
        setMenuOpen(false);
        router.push(`/screens/${screen}` as any);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lodziarnia u Dziekana</Text>
                <Hamburger
                    active={menuOpen}
                    type="spinCross"
                    onPress={() => setMenuOpen(!menuOpen)}
                    color="#e663d0ff"
                    style={styles.hamburger}
                />
                {/* Welcome text removed as requested */}
            </View>

            {menuOpen && (
                <View style={styles.menuContainer}>
                    <View style={styles.buttonsContainer}>
                        {user ? (
                            <>
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
                            </>
                        ) : (
                            <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                    setMenuOpen(false);
                                    router.push('/auth/login');
                                }}
                            >
                                <Text style={styles.buttonText}>Zaloguj</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f1e7e7ff',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    hamburger: {
        marginLeft: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#000000ff',
        flex: 1,
        marginLeft: 40,
        textAlign: 'center',
    },
    welcome: {
        fontSize: 16,
        color: '#666',
        marginLeft: 10,
    },
    menuContainer: {

    },
    buttonsContainer: {
        flexDirection: 'column',
        rowGap: 20,
    },
    button: {
        backgroundColor: '#e663d0ff',
        alignItems: 'center',
        padding: 16,
        borderRadius: 8,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Home;