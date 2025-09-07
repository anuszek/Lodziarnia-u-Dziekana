import React from 'react';
import { View, Text, Button, SafeAreaView, Alert } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from 'firebase/database';
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
  Alert.alert(
    "Usuń Konto",
    "Czy na pewno chcesz usunąć swoje konto? Tej akcji nie można cofnąć.",
    [
      {
        text: "Anuluj",
        style: "cancel"
      },
      {
        text: "Usuń",
        style: "destructive",
        onPress: () => {
          deleteUserAndData();
        }
      }
    ]
  );
};

const deleteUserAndData = () => {
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
  const pointsRef = user ? ref(db, 'users/' + user.uid + '/points') : null;
  const [points, setPoints] = useState<number | null>(null);

  useEffect(() => {
    if (pointsRef) {
      const unsubscribe = onValue(pointsRef, (snapshot) => {
        const data = snapshot.val();
        setPoints(data);
      });
      return unsubscribe;
    }
  }, [pointsRef]);

  return (
    <SafeAreaView style={GlobalStyles.container}>
      <Text style={GlobalStyles.title}>Profil</Text>
      <Text style={styles.header}>Twoje Punkty: <Text style={styles.varText}>{points || 0}</Text></Text>
      <Text style={styles.hardText}>Imię: </Text>
      <Text style={styles.varText}> {user ? user.displayName || 'No Name' : 'No Name'}</Text>
      <Text style={styles.hardText}>Email: </Text>
      <Text style={styles.varText}> {user ? user.email || 'No Email' : 'No Email'}</Text>
      <Button title="Wyloguj" onPress={handleLogout} style={GlobalStyles.button} />
      <Button title="Usuń Konto" onPress={handleRemoveUser} color="red" />
    </SafeAreaView>
  )
};

const styles = {
  varText: {
    color: '#333',
    fontSize: 20,
    fontWeight: "bold",
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  hardText: {
    color: '#e663d0ff',
    fontWeight: "bold",
    textAlign: 'left',
    fontSize: 16,
    marginVertical: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 20,
    fontSize: 24,
    fontWeight: "bold",
    color: '#e663d0ff',
    textAlign: 'center',
  },
};

export default Profile;