import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, SafeAreaView, Alert, StyleSheet, FlatList, Image } from 'react-native';
import GlobalStyles from '../../styles/GlobalStyles';
import { useRouter } from 'expo-router';
import {getAuth, signOut, User} from 'firebase/auth';


import { MaterialIcons } from '@expo/vector-icons';
import { query, getDocs, orderBy, collection } from 'firebase/firestore';
import { dbFirestore } from '../../firebase'; // Adjust the path if your firebase config is elsewhere



const Home = () => {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [menuOpen, setMenuOpen] = useState(false);
    const [articles, setArticles] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const auth = getAuth();
        setUser(auth.currentUser);
    }, []);

// Articles fetching is currently disabled
// Remind when i'll care
// Head hurts :<<<<<<<<
//     useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const q = query(collection(dbFirestore, 'articles'));
//         const snapshot = await getDocs(q);
//         const list: any[] = [];
//         snapshot.forEach((doc) => {
//           list.push({ id: doc.id, ...doc.data() });
//         });
//         setArticles(list);
//       } catch (error) {
//         console.error('Error fetching articles:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchArticles();
//   }, []);
  
    return (
    <SafeAreaView style={GlobalStyles.container}>
            <View style={styles.header}>
                <Text style={GlobalStyles.title}>Lodziarnia u Dziekana</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity
                        onPress={() => {
                            setMenuOpen(false);
                            if (user) {
                                router.push('/screens/profile');
                            } else {
                                router.push('/auth/login');
                            }
                        }}
                        style={styles.profileIcon}
                    >
                        <MaterialIcons name={user ? 'person' : 'login'} size={30} color="#e663d0ff" />
                    </TouchableOpacity>
                </View>
            </View>
            {user && (
                <Text>Witaj, {user.displayName}!</Text>
            )}
            <FlatList
                data={articles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.articleCard}>
                        <Image
                            source={{ uri: `https://picsum.photos/seed/${item.id}/400/200` }}
                            style={styles.articleImage}
                        />
                        <Text style={styles.article}>➡ {item.title}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};


const styles = StyleSheet.create({
    header: {
        alignItems: 'center',
        marginBottom: 0,
        marginTop: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
    },
    headerIcons: {
        flexDirection: 'row',
        position: 'absolute',
        right: 10,
        top: 41,
        alignItems: 'center',
        gap: 10,
    },
    profileIcon: {
        // Optionally add padding or margin
    },
    menuContainer: {
    },
    buttonsContainer: {
        flexDirection: 'column',
        rowGap: 20,
    },
    section: {
        marginTop: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#e663d0ff',
    },
    article: {
        fontSize: 16,
        marginBottom: 6,
        color: '#333',
    },
    articleCard: {
        marginVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    articleImage: {
        width: '100%',
        height: 150,
        borderRadius: 8,
        marginBottom: 8,
    },
});

export default Home;

