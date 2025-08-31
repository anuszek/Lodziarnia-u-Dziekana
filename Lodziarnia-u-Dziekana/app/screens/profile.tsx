import React from 'react';
import { View, Text, Button, StyleSheet, SafeAreaView } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';


// Custom hook to get active user and update on auth state change
// const activeUser = {
//     name: 'No Name',
//     email: 'No Email',
// };

// const handleLogout = () => {
//     const auth = getAuth();
//     if (auth.currentUser) {
//         signOut(auth).then(() => {
//             console.log('User signed out');
//         }).catch((error) => {
//             console.error('Sign-out error', error);
//         });
//     } else {
//         console.log('No user is currently signed in');
//     }
// };

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
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Profile Screen</Text>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
  },
  title: {
      fontSize: 24,
      fontWeight: 'bold',
  },
});

export default Profile;