import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { getAuth, signOut } from "firebase/auth";
import { getDatabase, ref, remove } from 'firebase/database';
import { useEffect, useState } from 'react';


// Custom hook to get active user and update on auth state change
function useActiveUser() {
    const [activeUser, setActiveUser] = useState({
        name: 'No Name',
        email: 'No Email',
    });

    useEffect(() => {
        const auth = getAuth();
        const updateUser = (user: any) => {
            setActiveUser({
                name: user?.displayName || 'No Name',
                email: user?.email || 'No Email',
            });
        };

        updateUser(auth.currentUser);

        const unsubscribe = auth.onAuthStateChanged(updateUser);

        return () => unsubscribe();
    }, []);

    return activeUser;
}

const activeUser = useActiveUser();

const handleLogout = () => {
    const auth = getAuth();
    if (auth.currentUser) {
        signOut(auth).then(() => {
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

export default function Profile() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>User Profile</Text>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{activeUser.name}</Text>
            <Text style={styles.label}>Email:</Text>
            <Text style={styles.value}>{activeUser.email}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Log out" onPress={handleLogout} color="#d9534f" />
                <View style={{ marginTop: 16 }}>
                    <Button title="Remove User" onPress={handleRemoveUser} color="#6c757d" />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    label: {
        fontSize: 16,
        color: '#888',
        marginTop: 12,
    },
    value: {
        fontSize: 18,
        marginBottom: 8,
    },
    buttonContainer: {
        marginTop: 40,
    },
});