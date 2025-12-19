import { Colors } from '@/constants/theme';
import auth, { db } from '@/service/firebaseConfig';
import { cleanOldTrash, deleteNotePermanently, toggleTrashNote } from '@/service/notesServices';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, useColorScheme, View } from 'react-native';

interface Note {
  id: string,
  title: string,
  content: string,
  isPinned: boolean,
  isArchived: boolean,
  isTrashed: boolean,
  cretedAt: any,
  updatedAt: any
}

export default function sampah() {
  const colorScheme = useColorScheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const isSelectionMode = selectedIds.length > 0;
  const navigation = useNavigation();
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    Alert.alert(
      "Hapus Permanent",
      "Catatan ini akan dihapus selamanya dan tidak bisa dikembalikan, Yakin?",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Ya",
          style: "destructive",
          onPress: async () => {
            for (const id of selectedIds) {
              const note = notes.find(n => n.id == id);
              if (note) {
                await deleteNotePermanently(id)
              }
              setSelectedIds([])
            }
          }
        }
      ]
    )
  }

  const handleUndelete = async () => {
    Alert.alert(
      "Pulihkan Catatan",
      "Catatan akan dipulihkan",
      [
        {
          text: "Batal",
          style: "cancel"
        },
        {
          text: "Ya",
          style: "destructive",
          onPress: async () => {
            for (const ID of selectedIds) {
              await toggleTrashNote(ID, true);
            }
            setSelectedIds([]);
          }
        }
      ]
    )
  }

  useEffect(() => {
    const runCleanup = async () => {
      const result = await cleanOldTrash();
    };
    runCleanup();
  }, []);

  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const q = query(
          collection(db, 'users', user.uid, 'notes'),
          where('isTrashed', '==', true),
          where('isArchived', '==', false),
          orderBy('updatedAt', 'desc')
        );
        const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
          const notesData: Note[] = [];
          snapshot.forEach((doc) => {
            notesData.push({ id: doc.id, ...doc.data() } as Note);
          });
          setNotes(notesData),
            setLoading(false)
        });
        return () => unsubscribeAuth();
      }
    })
  })

  const filteredNotes = notes.filter(note => {
    const query = searchQuery.toLowerCase();
    return (
      note.title.toLocaleLowerCase().includes(query) ||
      note.content.toLocaleLowerCase().includes(query)
    )
  })

  useEffect(() => {
    if (isSelectionMode) {
      // TAMPILAN HEADER SAAT MEMILIH
      navigation.setOptions({
        headerTitle: `${selectedIds.length} Dipilih`,
        headerRight: () => (
          <View style={{ flexDirection: "row", marginRight: 10 }}>
            <Pressable onPress={() => setSelectedIds([])}>
              <Ionicons name="close" size={24} color="black" style={{ marginRight: 20 }} />
            </Pressable>
            <Pressable onPress={handleUndelete}>
              <Ionicons name="sync-outline" size={24} color="black" style={{ marginRight: 20 }} />
            </Pressable>
            <Pressable onPress={handleDelete}>
              <Ionicons name="trash-outline" size={24} color="black" />
            </Pressable>
          </View>
        )
      });
    } else {
      navigation.setOptions({
        headerTitle: 'Sampah',
        headerRight: null
      });
    }
  }, [navigation, isSelectionMode, selectedIds]);

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
            isArchived: item.isArchived.toString(),
            origin: 'delete'
          }
        })
      }
    }
  };

  return (
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
        <View style={{alignItems: 'center', padding: 15}}>
          <Text>Catatan akan otomatis terhapus secara permanen setelah 30 hari</Text>
        </View>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center' }}>
            <ActivityIndicator size='large' color='#4B0082' />
          </View>
        ) : (
          <FlatList
            data={filteredNotes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingHorizontal: 10
            }}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 50 }}>
                <Text style={{ color: '#8e8e93' }}>Tidak ada catatan yang di arsipkan</Text>
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
                    ) : null
                    }
                  </View>
                  <Text style={styles.contentText}>{item.content}</Text>
                  <Text style={styles.cardDate}>
                    {item.updatedAt?.toDate ? item.updatedAt.toDate().toLocaleDateString('id-ID') : ''}
                  </Text>
                </Pressable>
              );
            }}
          />
        )
        }
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10
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
})
