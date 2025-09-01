import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const SetupFlavours = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Setup Flavours Page</Text>
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
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default SetupFlavours;
