import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import auth from '@/service/firebaseConfig';
import Ionicons from '@expo/vector-icons/Ionicons';
import { router, useNavigation } from 'expo-router';
import { signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react'; // 1. Tambahkan Text
import { Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { FAB, PaperProvider } from 'react-native-paper';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';

const notesData = [
  { id: 1, title: 'Catatan Pertama', content: 'Ini adalah isi dari catatan pertama saya.' },
  { id: 2, title: 'Belanja', content: 'Beli susu, roti, dan telur di toko.' },
  { id: 3, title: 'Ide Proyek', content: 'Membuat aplikasi catatan sederhana menggunakan React Native.' },
  { id: 4, title: 'Meeting dengan Tim', content: 'Jangan lupa meeting dengan tim pada hari Jumat jam 10 pagi.' },
  { id: 5, title: 'Liburan', content: 'Rencanakan liburan ke Bali bulan depan.' },
  { id: 6, title: 'Buku yang Ingin Dibaca', content: 'The Pragmatic Programmer, Clean Code, dan Design Patterns.' },
  { id: 7, title: 'Resep Masakan', content: 'Coba resep baru untuk membuat pasta carbonara.' },
  { id: 8, title: 'Olahraga', content: 'Jadwalkan olahraga rutin setiap pagi selama 30 menit.' },
  { id: 9, title: 'Proyek Sampingan', content: 'Mulai proyek sampingan untuk belajar lebih banyak tentang AI.' },
  { id: 10, title: 'Catatan Penting', content: 'Ingat untuk selalu backup data penting secara berkala.' },
];

export default function HomeScreen() {
  const colorScheme = useColorScheme();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const isSelectionMode = selectedIds.length > 0;
  const navigation = useNavigation();

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
                <MenuOption onSelect={ async () => {await signOut(auth);
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

  const handlePress = (id: number) => {
    if (selectedIds.includes(id)) {
      // Jika ID sudah ada, hapus dari array (unselect)
      setSelectedIds(selectedIds.filter(selectedId => selectedId !== id));
    } else {
      // Jika ID belum ada, tambahkan ke array (select)
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleLongPress = (id: number) => {
    // Memulai mode seleksi dengan item yang ditekan lama
    handlePress(id);
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
            />
          </View>
          <FlatList
            data={notesData}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{
              paddingTop: 16,
              paddingBottom: 16,
              paddingHorizontal: 10 // Samakan dengan padding container
            }}
            renderItem={({ item }) => {
              const isSelected = selectedIds.includes(item.id);

              return (
                <Pressable
                  onLongPress={() => handleLongPress(item.id)}
                  onPress={() => {
                    if (isSelectionMode) {
                      handlePress(item.id);
                    } else {
                      // Nanti bisa ditambahkan navigasi ke detail catatan
                      alert(`Buka detail untuk: ${item.title}`);
                    }
                  }}
                  style={[
                    styles.cardItem,
                    isSelected ? styles.cardSelected : styles.cardNormal
                  ]}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.titleText}>{item.title}</Text>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={24} color="#4B0082" />
                    )}
                  </View>
                  <Text style={styles.contentText}>{item.content}</Text>
                </Pressable>
              );
            }}
          />
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
    borderWidth: 1,            // border
  },
  cardNormal: {
    backgroundColor: 'white',  // bg-white
    borderColor: '#D1D5DB',    // border-gray-300
  },
  cardSelected: {
    backgroundColor: '#F3E8FF', // bg-purple-100 (kira-kira)
    borderColor: '#A855F7',     // border-purple-500 (kira-kira)
  },
  cardHeader: {
    flexDirection: 'row',       // flex-row
    justifyContent: 'space-between', // justify-between
    alignItems: 'center',       // items-center
  },
  titleText: {
    fontWeight: 'bold',         // font-bold
    fontSize: 18,               // text-lg
    color: '#000',              // default text color
  },
  contentText: {
    color: '#6B7280',           // text-gray-500
    marginTop: 4,               // mt-1
  },
});
