import React from 'react';
import { View, Text, Button, SafeAreaView, Alert, TouchableOpacity } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { deleteUser } from 'firebase/auth';
import { MaterialCommunityIcons } from '@expo/vector-icons';


const router = useRouter();



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
      <TouchableOpacity
        style={{ position: 'absolute', top: 85, right: 20 }}
        onPress={() => router.push('/screens/settings')}
      >
        <MaterialCommunityIcons name="account-cog" size={24} color="red" />
      </TouchableOpacity>
      <Text style={styles.header}>Twoje Punkty: <Text style={styles.varText}>{points || 0}</Text></Text>
      <Text style={styles.hardText}>Imię: <Text style={styles.varText}> {user ? user.displayName || 'No Name' : 'No Name'}</Text></Text>
      <Text style={styles.hardText}>Email: <Text style={styles.varText}> {user ? user.email || 'No Email' : 'No Email'}</Text></Text>
    </SafeAreaView>
  )
};

const styles = {
  varText: {
    color: '#333',
    fontSize: 20,
    fontWeight: 'bold' as 'bold',
    textAlign: 'center' as 'center',
    marginTop: 0,
    marginBottom: 20,
  },
  hardText: {
    color: '#e663d0ff',
    fontWeight: 'bold' as 'bold',
    textAlign: 'left' as 'left',
    fontSize: 16,
    marginVertical: 4,
  },
  header: {
    marginBottom: 10,
    marginTop: 20,
    fontSize: 24,
    fontWeight: 'bold' as 'bold',
    color: '#e663d0ff',
    textAlign: 'center' as 'center',
  },
};

export default Profile;