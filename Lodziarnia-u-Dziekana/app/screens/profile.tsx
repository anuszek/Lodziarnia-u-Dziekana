import React from 'react';
import { View, Text, Button, SafeAreaView } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const router = useRouter();


const handleLogout = () => {
    const auth = getAuth();
    if (auth.currentUser) {
        signOut(auth).then(() => {
            router.dismissAll();
            router.replace('/');
            console.log('User signed out');
        }).catch((error) => {
            console.error('Sign-out error', error);
        });
    } else {
        console.log('No user is currently signed in');
    }
};

const handleRemoveUser = () => {
    const auth = getAuth();
    const user = auth.currentUser;
    const db = getDatabase();
    if (user) {
        user.delete().then(() => {
            console.log('User deleted');
            // Remove user data from the database
            const userRef = ref(db, 'users/' + user.uid);
            remove(userRef).then(() => {
                console.log('User data removed from database');
            }).catch((error) => {
                console.error('Error removing user data from database', error);
            });
        }).catch((error) => {
            console.error('Error deleting user', error);
        });
    } else {
        console.log('No user is currently signed in');
    }
};


const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const PUNKTY = user ? ref(db, 'users/' + user.uid + '/points') : null;


  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Profil</Text>
      <Text style={styles.header}>MOJE PUNKTY: </Text>
      <Text style={styles.hardText}>Imię: </Text>
      <Text style={styles.varText}> {user ? user.displayName || 'No Name' : 'No Name'}</Text>
      <Text style={styles.hardText}>Email: </Text>
      <Text style={styles.varText}> {user ? user.email || 'No Email' : 'No Email'}</Text>
      <Button title="Wyloguj" onPress={handleLogout} />
      <Button title="Usuń Konto" onPress={handleRemoveUser} color="red" />
    </SafeAreaView>
  )
};

const styles = {
  varText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  hardText: {
    color: '#e663d0ff',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
};

export default Profile;