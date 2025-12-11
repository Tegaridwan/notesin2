import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import auth, { db } from '@/service/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation, useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'; // 1. Tambahkan Text
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActivityIndicator, FAB, PaperProvider } from 'react-native-paper';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

// const notesData = [
//   { id: 1, title: 'Catatan Pertama', content: 'Ini adalah isi dari catatan pertama saya.' },
//   { id: 2, title: 'Belanja', content: 'Beli susu, roti, dan telur di toko.' },
//   { id: 3, title: 'Ide Proyek', content: 'Membuat aplikasi catatan sederhana menggunakan React Native.' },
//   { id: 4, title: 'Meeting dengan Tim', content: 'Jangan lupa meeting dengan tim pada hari Jumat jam 10 pagi.' },
//   { id: 5, title: 'Liburan', content: 'Rencanakan liburan ke Bali bulan depan.' },
//   { id: 6, title: 'Buku yang Ingin Dibaca', content: 'The Pragmatic Programmer, Clean Code, dan Design Patterns.' },
//   { id: 7, title: 'Resep Masakan', content: 'Coba resep baru untuk membuat pasta carbonara.' },
//   { id: 8, title: 'Olahraga', content: 'Jadwalkan olahraga rutin setiap pagi selama 30 menit.' },
//   { id: 9, title: 'Proyek Sampingan', content: 'Mulai proyek sampingan untuk belajar lebih banyak tentang AI.' },
//   { id: 10, title: 'Catatan Penting', content: 'Ingat untuk selalu backup data penting secara berkala.' },
// ];

interface Note {
  id: string,
  title: string,
  content: string,
  isPinned: boolean,
  isArchived: boolean,
  cretedAt: any,
  updatedAt: any
}

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSelectionMode = selectedIds.length > 0;
  const navigation = useNavigation();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    Alert.alert(
      "Konfirmasi Keluar",
      "Apakkah kamu yakin ingin logout?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Ya",
          onPress: () => signOut(auth)
        }
      ]
    )

  };

useEffect(() => {
  const unsubscribeAuth = auth.onAuthStateChanged((user) => {
    if (user) {
      const q = query(
        collection(db, 'users', user.uid, 'notes'),
        where('isTrashed', '==', false),
        where('isArchived', '==', false),
        // PERBAIKAN: Tambahkan 'd' menjadi 'updatedAt'
        orderBy('updatedAt', 'desc') 
      );

      const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
        const notesData: Note[] = [];
        snapshot.forEach((doc) => {
          notesData.push({ id: doc.id, ...doc.data() } as Note);
        });

        const pinned = notesData.filter(n => n.isPinned);
        const regular = notesData.filter(n => !n.isPinned);
        setNotes([...pinned, ...regular]);
        setLoading(false);
      }, (error) => {
        console.log("Error Firestore:", error); 
        setLoading(false);
      });

      return () => unsubscribeSnapshot();
    } else {
      setLoading(false);
      setNotes([]);
    }
  });

  return () => unsubscribeAuth();
}, []);

  // const renderItem = ({ item }: { item: Note }) => (
  //   <TouchableOpacity
  //     style={styles.card}
  //     onPress={() => router.push({pathname: '/add',
  //       params: {
  //         id: item.id,
  //         title: item.title,
  //         content: item.content,
  //         isPinned: item.isPinned.toString(),
  //         isArchived: item.isArchived.toString()
  //       }
  //     })}
  //   >
  //     <View style={styles.cardHeader}>
  //       <Text style={styles.cardTitle} numberOfLines={1}>
  //         {item.title || "Tanpa Judul"}
  //       </Text>
  //       {item.isPinned && <Ionicons name="pin" size={16} color="#4B0082"/>}
  //     </View>
  //     <Text style={styles.cardContent} numberOfLines={3}>
  //       {item.content || "Tidak ada isi teks..."}
  //     </Text>
  //     <Text style={styles.cardDate}>
  //       {item.updateAt?.toDate().toLocaleDateString('id-ID')}
  //     </Text>
  //   </TouchableOpacity>
  // );

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLocaleLowerCase().includes(query) ||
      note.content.toLocaleLowerCase().includes(query)
    )
  })

  useEffect(() => {
    if (isSelectionMode) {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: "row", marginRight: 10 }}>
            <Pressable onPress={() => setSelectedIds([])}>
              <Ionicons name="close" size={24} color="black" style={{ marginRight: 15 }} />
            </Pressable>
            <Pressable onPress={() => alert('Sematkan')}>
              <Ionicons name="pin-outline" size={24} color="black" style={{ marginRight: 20 }} />
            </Pressable>
            <Pressable onPress={() => alert('arsipkan')}>
              <Ionicons name="archive-outline" size={24} color="black" style={{ marginRight: 20 }} />
            </Pressable>
            <Pressable onPress={() => alert('hapus')}>
              <Ionicons name="trash-outline" size={24} color="black" style={{ marginRight: 15 }} />
            </Pressable>
          </View>
        )
      });
    } else {
      navigation.setOptions({
        headerRight: () => (
          <View style={{ flexDirection: 'row' }}>
            <Pressable onPress={() => { }}>
              <Ionicons name='moon-outline' size={29} style={{ marginRight: 15 }} />
            </Pressable>
            <Menu>
              <MenuTrigger>
                <Ionicons name='person-circle-outline' size={33} style={{ marginRight: 15 }} />
              </MenuTrigger>
              <MenuOptions customStyles={{ optionsContainer: { marginTop: 30, borderRadius: 10, padding: 5 } }}>
                <MenuOption onSelect={() => alert('Profile')} text='Profile' />
                <MenuOption onSelect={async () => {
                  await signOut(auth);
                  router.replace('/(auth)/signup');
                }} text='Buat Akun Baru' />
                <MenuOption onSelect={handleLogout} text='Logout' />
              </MenuOptions>
            </Menu>
            {/* <Pressable onPress={handleLogout}>
              <Ionicons name='person-circle-outline' size={33} style={{ marginRight: 15 }} />
            </Pressable> */}
          </View>
        )
      });
    }
  }, [navigation, isSelectionMode, selectedIds]
  );

    const handleLongPress = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handlePress = (id: string) => {
    if (isSelectionMode) {
      handleLongPress(id);
    } else {
      const item = notes.find(n => n.id === id);
      if (item) {
        router.push({
          pathname: '/add',
          params: {
            id: item.id,
            title: item.title,
            content: item.content,
            isPinned: item.isPinned.toString(),
            isArchived: item.isArchived.toString()
          }
        })
      }
    }
  };



  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background as string }}>
        <View style={styles.container}>
          <View style={[
            styles.searchContainer,
            {
              backgroundColor: colorScheme === 'dark' ? '#1c1c1e' : '#fff',
              borderColor: colorScheme === 'dark' ? '#3a3a3c' : '#ccc'
            }]}>
            <Ionicons
              name="search-outline"
              size={24}
              color={colorScheme === 'dark' ? '#8e8e93' : '#8e8e93'}
              style={styles.searchIcon}
            />
            <TextInput
              placeholder='Cari...'
              style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text }]}
              placeholderTextColor={colorScheme === 'dark' ? '#8e8e93' : '#8e8e93'}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            {searchQuery.length > 0 && (
              <Ionicons name="close-circle" size={20} color="8e8e93" onPress={() => setSearchQuery('')} />
            )}
          </View>
          {loading ? (
            <View style={{flex: 1, justifyContent: 'center'}}>
              <ActivityIndicator size='large' color='#4B0082'/>
            </View>
          ): (
            <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingHorizontal: 10 // Samakan dengan padding container
            }}
            ListEmptyComponent={
              <View style={{alignItems: 'center', marginTop: 50}}>
                <Text style={{color: '#8e8e93'}}>Catatan belum dibuat</Text>
              </View>
            }
            renderItem={({ item }) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <Pressable
                  onLongPress={() => handleLongPress(item.id)}
                  onPress={() => handlePress(item.id)}
                  style={[
                    styles.cardItem,
                    isSelected ? styles.cardSelected : styles.cardNormal
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.titleText} numberOfLines={1}>{item.title}</Text>
                    {isSelected ? (
                      <Ionicons name="checkmark-circle" size={24} color="#4B0082" />
                    ) : item.isPinned ? (
                      <Ionicons name="pin" size={20} color="#4B0082" />
                    ) : null
                  }
                  </View>
                  <Text style={styles.contentText}>{item.content}</Text>
                  <Text style={styles.cardDate}>
                    {item.updatedAt?.toDate ? item.updatedAt.toDate().toLocaleDateString('id-ID'): ''}
                  </Text>
                </Pressable>
              );
            }}
          />
          )
        }
          
          {!isSelectionMode && (
            <FAB
              style={[styles.fab, { backgroundColor: '#4B0082' }]}
              icon="plus" color='white'
              onPress={() => router.push('/add')}
            // location="bottom right" <-- Bisa juga menggunakan prop location di versi terbaru paper
            />
          )}

        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: 10, // Tambahkan margin horizontal
    paddingVertical: 1,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  fab: {
    position: 'absolute',
    right: 30,
    bottom: 65,
  },
  cardItem: {
    padding: 16,               // p-4
    marginBottom: 12,          // mb-3
    borderRadius: 16,          // rounded-2xl
    borderWidth: 1,
    backgroundColor: 'white'        // border
  },
  cardNormal: {
    backgroundColor: 'white',  // bg-white
    borderColor: '#D1D5DB',    // border-gray-300
  },
  cardSelected: {
    backgroundColor: '#F3E8FF', // bg-purple-100 (kira-kira)
    borderColor: '#A855F7',     // border-purple-500 (kira-kira)
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    // Efek Bayangan (Shadow)
    elevation: 2, // Android
    shadowColor: '#000', // iOS
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    borderWidth: 1,
    borderColor: '#eee'
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1, // Agar tidak nabrak icon pin
    marginRight: 10,
  },
  cardContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 10,
  },
  cardDate: {
    fontSize: 12,
    color: '#999',
    alignSelf: 'flex-end', // Rata kanan bawah
  },
  titleText: {
    fontWeight: 'bold',         // font-bold
    fontSize: 18,               // text-lg
    color: '#000',    
    flex: 1          // default text color
  },
  contentText: {
    color: '#6B7280',           // text-gray-500
    marginTop: 4,  
    marginBottom: 10             // mt-1
  },
});
