import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { router } from 'expo-router';

const MoreScreen = () => {
    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.title}>Minigierki</Text>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/screens/minesweeper')}
            >
                <Text style={GlobalStyles.buttonText}>Saper</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/screens/wires_game')}
            >
                <Text style={GlobalStyles.buttonText}>Wires Game</Text>
            </TouchableOpacity>
        </View>
        
    );
};

const styles = {
    button: {
        backgroundColor: '#e663d0ff',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
        width: '80%',
    },
};

export default MoreScreen;