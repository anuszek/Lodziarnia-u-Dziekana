import { useRouter } from 'expo-router';
import React from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';

const router = useRouter();

const LogoutScreen = () => {
    const handleOk = () => {
        router.replace('/'); // Navigate to home or login screen
    };

    return (
        <View style={styles.container}>
            <Text style={styles.message}>Zostałeś wylogowany.</Text>
            <Button title="OK" onPress={handleOk} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    message: {
        fontSize: 18,
        marginBottom: 20,
    },
});

export default LogoutScreen;