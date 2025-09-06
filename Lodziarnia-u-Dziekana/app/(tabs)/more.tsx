import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const MoreScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>asdfghjk</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fafafa',
    },
    text: {
        fontSize: 20,
        color: '#888',
    },
});

export default MoreScreen;