import React from 'react';
import { View, Button, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';

// List of page routes and labels (add your actual page names here)
const pages = [
    { label: 'flavours', route: '/pages/flavours' },
    { label: 'login', route: '/pages/login' },
    { label: 'profile', route: '/pages/profile' },
    { label: 'register', route: '/pages/register' },
    { label: 'setup', route: '/pages/setup' },
    // Add more pages as needed
];

const Home = () => {
    const router = useRouter();

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {pages.map((page) => (
                <View key={page.route} style={styles.buttonContainer}>
                    <Button
                        title={`Go to ${page.label}`}
                        onPress={() => router.push(page.route as any)}
                    />
                </View>
            ))}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {
        marginVertical: 8,
        width: '100%',
    },
});

export default Home;