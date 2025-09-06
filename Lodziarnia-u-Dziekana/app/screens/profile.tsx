import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';

const router = useRouter();


// Custom hook to get active user and update on auth state change
// const activeUser = {
//     name: 'No Name',
//     email: 'No Email',
// };

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

// const handleRemoveUser = () => {
//     const auth = getAuth();
//     const user = auth.currentUser;
//     const db = getDatabase();
//     if (user) {
//         user.delete().then(() => {
//             console.log('User deleted');
//             // Remove user data from the database
//             const userRef = ref(db, 'users/' + user.uid);
//             remove(userRef).then(() => {
//                 console.log('User data removed from database');
//             }).catch((error) => {
//                 console.error('Error removing user data from database', error);
//             });
//         }).catch((error) => {
//             console.error('Error deleting user', error);
//         });
//     } else {
//         console.log('No user is currently signed in');
//     }
// };


const Profile = () => {
  const auth = getAuth();
  const user = auth.currentUser;

  const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
      
  },
});

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>No user is currently signed in.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      <Text>Name: {user.displayName || 'No Name'}</Text>
      <Text>Email: {user.email || 'No Email'}</Text>
      <Button title="Logout" onPress={handleLogout} />
    </SafeAreaView>
  )
};


export default Profile;