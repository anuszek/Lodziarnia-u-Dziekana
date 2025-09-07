import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { router } from 'expo-router';
import { get, getDatabase, ref, update, set } from 'firebase/database';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { CircuitBoard } from 'lucide-react-native';
import type { User } from '@firebase/auth';

const MoreScreen = () => {
    const [rewardsData, setRewardsData] = useState<any[]>([]);
    const [userPoints, setUserPoints] = useState<number | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [db, setDb] = useState(getDatabase());


    useEffect(() => {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        setUser(currentUser);
        const rewardsRef = ref(db, 'rewards');
        get(rewardsRef).then((snapshot) => {
            if (snapshot.exists()) {
                const rewardsData = snapshot.val();
                // Convert object to array if needed
                const rewardsArray = Object.values(rewardsData);
                setRewardsData(rewardsArray);
            } else {
                console.log('No rewards found');
            }
        }).catch((error) => {
            console.error('Error fetching rewards:', error);
        });

        if (currentUser) {
            const userPointsRef = ref(db, `users/${currentUser.uid}/points`);
            get(userPointsRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const points = snapshot.val();
                    setUserPoints(points);
                } else {
                    console.log('No points data found for user');
                }
            }).catch((error) => {
                console.error('Error fetching user points:', error);
            });
        }
    }, []);
    
    return (
        <View style={GlobalStyles.container}>
            <Text style={GlobalStyles.title}>Gry i nagrody</Text>
            <Text style={GlobalStyles.title}>Twoje punkty: {userPoints !== null ? userPoints : '...'}</Text>
            <View style={styles.buttonRow}>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/screens/minesweeper')}
            >
                <MaterialCommunityIcons name='mine' size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
                style={styles.button}
                onPress={() => router.push('/screens/wires_game')}
            >
                <CircuitBoard size={32} color="#fff" />
            </TouchableOpacity>
            </View>
            <FlatList
            data={rewardsData}
            keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
            renderItem={({ item }) => {
                const isLoggedIn = userPoints !== null;
                const hasEnoughPoints = isLoggedIn && userPoints! >= item.points;
                return (
                <TouchableOpacity
                    disabled={!isLoggedIn || !hasEnoughPoints}
                    style={[
                    styles.articleCard,
                    (!isLoggedIn || !hasEnoughPoints) && { opacity: 0.5 }
                    ]}
                    onPress={() => {
                    if (isLoggedIn && hasEnoughPoints) {
                        Alert.alert("Czy na pewno chcesz odebrać nagrodę?", `${item.title}`, [
                            {
                                text: "Anuluj",
                                style: "cancel"
                            },
                            {
                                text: "OK",
                                onPress: () => {
                                    const newBalance = userPoints! - item.points;
                                    if (user) {
                                        const userPointsRef = ref(db, `users/${user.uid}/points`);
                                        set(userPointsRef, newBalance);
                                        alert(`Odbierasz nagrodę: ${item.title}`);
                                        setUserPoints(newBalance);
                                        const userRewardsRef = ref(db, `users/${user.uid}/rewards`);
                                        get(userRewardsRef).then((snapshot) => {
                                            const currentRewards = snapshot.exists() ? snapshot.val() : [];
                                            const updatedRewards = Array.isArray(currentRewards)
                                                ? [...currentRewards, item]
                                                : [item];
                                            set(userRewardsRef, updatedRewards);
                                        });
                                    }
                                }
                            }
                        ]);
                    }
                    }}
                >
                    <Text style={styles.articleTitle}>{item.title}</Text>
                    <Text style={styles.articleContent}>{item.description}</Text>
                    <Text style={styles.articleAuthor}>
                    Cena: {item.points}
                    {!isLoggedIn
                        ? ' (Zaloguj się, aby odebrać)'
                        : !hasEnoughPoints
                        ? ' (Za mało punktów)'
                        : ''}
                    </Text>
                </TouchableOpacity>
                );
            }}
            />
        </View>
    );
};

import { StyleSheet } from 'react-native';
import { getAuth } from '@firebase/auth';

const styles = StyleSheet.create({
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
    },
    button: {
        backgroundColor: '#e663d0ff',
        padding: 20,
        borderRadius: 10,
        marginHorizontal: 5,
        flex: 1,
        alignItems: 'center',
    },
    articleCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    articleImage: {
        width: '100%',
        height: 120,
        borderRadius: 8,
        marginBottom: 8,
    },
    articleTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    articleContent: {
        fontSize: 14,
        marginBottom: 4,
    },
    articleAuthor: {
        fontSize: 12,
        color: '#888',
    },
});

export default MoreScreen;