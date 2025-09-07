import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, StyleSheet } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
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
    <SafeAreaView style={GlobalStyles.container}>
            <View style={styles.header}>
                <Text style={GlobalStyles.title}>Lodziarnia u Dziekana</Text>
                <Hamburger
                    active={menuOpen}
                    type="spinCross"
                    onPress={() => setMenuOpen(!menuOpen)}
                    color="#e663d0ff"
                    style={styles.hamburger}
                />
            </View>

            {menuOpen && (
                <View style={styles.menuContainer}>
                    <View style={styles.buttonsContainer}>
                        {user ? (
                            <>  
                                <TouchableOpacity
                                    style={GlobalStyles.button}
                                    onPress={() => navigateTo('profile')}
                                >
                                    <Text style={GlobalStyles.buttonText}>Profil</Text>
                                </TouchableOpacity>
                            </>
                        ) : (
                            <TouchableOpacity
                                style={GlobalStyles.button}
                                onPress={() => {
                                    setMenuOpen(false);
                                    router.push('/auth/login');
                                }}
                            >
                                <Text style={GlobalStyles.buttonText}>Zaloguj</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            )}
            {user && (
                <Text>Witaj, {user.displayName}!</Text>
            )}
            <View style={styles.section}>
            <Text style={styles.sectionTitle}>Artykuły</Text>
            <Text style={styles.article}>➡ Jak używać Firebase w Expo</Text>
            <Text style={styles.article}>➡ React Native – podstawy</Text>
            <Text style={styles.article}>➡ Nowości 2025</Text>
      </View>
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 0,
    },
    hamburger: {
        position: 'absolute',
        right: 10,   
        top: 10,
    },
    menuContainer: {
    },
    buttonsContainer: {
        flexDirection: 'column',
        rowGap: 20,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#e663d0ff',
    },
    article: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
});

export default Home;