import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    useColorScheme
} from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
// Pastikan nama file import ini SESUAI dengan nama file service kamu
// Kalau file service kamu namanya 'firebaseConfig.ts' atau 'noteService.ts', sesuaikan di sini:
import auth, { db } from '@/service/firebaseConfig';
import { saveOrUpdateNote, toggleArchiveNote, togglePinNote, toggleTrashNote, } from '@/service/notesServices';
import { doc, getDoc } from 'firebase/firestore';

export default function NoteScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    // Tambahkan di dalam NoteScreen
    const [imageRatio, setImageRatio] = useState(1); // Default 1 (Kotak)
    // State untuk UI (Icon berubah warna kalau aktif)
    const [isPinned, setIsPinned] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const [isTrashed, setIsTrashed] = useState(false);
    const [noteId, setNoteId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null)
    const navigation = useNavigation();


    useEffect(() => {
        if (imageUrl) {
            Image.getSize(imageUrl, (width, height) => {
                const ratio = width / height;
                setImageRatio(ratio);
            }, (error) => {
                console.error("Gagal mendapatkan ukuran gambar:", error);
            });
        }
    }, [imageUrl]);
    // 1. Ambil data jika ini mode Edit
    useEffect(() => {
            if (params.id) {
                setNoteId(params.id as string);
                setTitle(params.title as string || '');
                setContent(params.content as string || '');
                setIsPinned(params.isPinned === 'true');
                setIsArchived(params.isArchived === 'true');
                // if (params.imageUrl && params.imageUrl !== 'null') {
                //     setImageUrl(params.imageUrl as string)
                // }
                const fetchImageFromDb = async () => {
                try {
                    const user = auth.currentUser;
                    if (!user) return;

                    const docRef = doc(db, "users", user.uid, "notes", params.id as string);
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        
                        // Set Image URL
                        if (data.imageUrl) {
                            setImageUrl(data.imageUrl); 
                            Image.getSize(data.imageUrl, (width, height) => {
                                setImageRatio(width / height);
                            }, (err) => console.log("Gagal hitung rasio", err));
                        }
                        
                        setTitle(data.title);
                        setContent(data.content);
                    }
                } catch (error) {
                    console.log("Gagal memuat detail:", error);
                }
            };
            fetchImageFromDb();
            }

    }, [params]);

    // const handleBack = async () => {
    //     // Panggil service simpan
    //     await saveOrUpdateNote(noteId, title, content);
    //     router.back();
    // };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            // aspect: [4, 3],
            quality: 0.3,
            base64: true,
        });

        if (!result.canceled && result.assets[0].base64) {
            const imageBase64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
            setImageUrl(imageBase64);
        }
    };

    const handleBack = async () => {
        if (isSaving) return;
        if (!title && !content && !imageUrl && !noteId) {
            router.back()
            return
        }
        setIsSaving(true);

        try {
            await saveOrUpdateNote(noteId, title, content, imageUrl);

            if (navigation.canGoBack()) {
                router.back();
            } else {
                if (params.origin === 'archive') {
                    router.replace('/arsip');
                } else if (params.origin === 'delete') {
                    router.replace('/(tabs)/sampah')
                }
                else {
                    router.replace('/');
                }
            }
        } catch (error) {
            console.log(error);
            Alert.alert("Ukuran gambar mungkin terlalu besar")
        } finally {
            setIsSaving(false); // Buka kunci (opsional, krn layar sdh pindah)
        }
    };

    const isTrashMode = params.origin === 'delete';

    const handlePin = async () => {
        if (!noteId) {
            Alert.alert("Info", "Simpan catatan terlebih dahulu untuk menyematkan.");
            return;
        }

        const result = await togglePinNote(noteId, isPinned);
        if (result?.success) {
            router.back()
        }
    };

    // 4. Fungsi Arsip
    const handleArchive = async () => {
        if (!noteId) {
            Alert.alert("Info", "Simpan catatan terlebih dahulu untuk mengarsipkan.");
            return;
        }
        const result = await toggleArchiveNote(noteId, isArchived);
        if (result?.success) {
            router.back();
        }
    };

    //fungsi hapus
    const handleDelete = async () => {
        if (!noteId) return;
        Alert.alert(
            "KOnfirmasi Hapus",
            "Apakah kamu yakin ingin menghapus catatan ini?",
            [
                {
                    text: "Batal",
                    style: "cancel"
                },
                {
                    text: "Ya",
                    style: "destructive",
                    onPress: async () => {
                        const result = await toggleTrashNote(noteId, isTrashed);
                        if (result?.success) {
                            router.back();
                        }
                    }
                }
            ]
        )
    }

    const themeTextColor = Colors[colorScheme ?? 'light'].text;

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={28} color={themeTextColor} />
                </TouchableOpacity>

                <View style={{ flex: 1 }} />
                {!isTrashMode && (
                    <TouchableOpacity onPress={pickImage} style={{ marginRight: 15 }}>
                        <Ionicons name='image-outline' size={24} color="black" />
                    </TouchableOpacity>
                )}
                <Menu style={{ paddingRight: 15 }}>
                    <MenuTrigger>
                        <Ionicons name="ellipsis-vertical" size={24} color={themeTextColor} />
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: styles.menuOptions }}>
                        <MenuOption onSelect={handlePin}>
                            <View style={styles.menuItem}>
                                <MaterialCommunityIcons
                                    name={isPinned ? "pin" : "pin-outline"}
                                    size={20}
                                    color={isPinned ? "#4B0082" : "#444"}
                                    style={{ marginRight: 10 }}
                                />
                                <Text style={{ color: isPinned ? "#4B0082" : "#000" }}>
                                    {isPinned ? "Lepas Sematan" : "Sematkan"}
                                </Text>
                            </View>
                        </MenuOption>
                        <MenuOption onSelect={handleArchive}>
                            <View style={styles.menuItem}>
                                <Ionicons
                                    name={isArchived ? "archive-outline" : "arrow-up-circle-outline"}
                                    size={20}
                                    color="#444"
                                    style={{ marginRight: 10 }}
                                />
                                <Text>{isArchived ? "Pulihkan" : "Arsipkan"}</Text>
                            </View>
                        </MenuOption>
                        <MenuOption onSelect={handleDelete}>
                            <View style={styles.menuItem}>
                                <Ionicons
                                    name='trash-outline'
                                    size={20}
                                    color="#444"
                                    style={{ marginRight: 10 }}
                                />
                                <Text>Hapus</Text>
                            </View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>

            <ScrollView>
                <View style={[styles.contentContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
                    <TextInput
                        placeholder="Judul"
                        placeholderTextColor="#999"
                        value={title}
                        onChangeText={setTitle}
                        editable={!isTrashMode}
                        style={[styles.titleInput, { color: themeTextColor }]}
                    />
                    {imageUrl && (
                        <View style={{ marginBottom: 20 }}>
                            <Image
                                source={{ uri: imageUrl }}
                                style={{
                                    width: '100%',
                                    aspectRatio: imageRatio,
                                    borderRadius: 12,
                                    backgroundColor: '#f0f0f0',
                                    borderWidth: 1,
                                    borderColor: '#eee',
                                    maxHeight: 500,
                                }}
                            />
                            {isTrashMode && (
                                <TouchableOpacity onPress={() => setImageUrl(null)} style={styles.removeImageBtn}>
                                    <Ionicons name='close' size={20} color='white' />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                    <TextInput
                        placeholder="Ketik sesuatu..."
                        placeholderTextColor="#999"
                        value={content}
                        onChangeText={setContent}
                        editable={!isTrashMode}
                        multiline={true}
                        style={[styles.contentInput, { color: themeTextColor }]}
                    />
                </View>
            </ScrollView>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        // Sesuaikan background dengan tema jika perlu
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        height: 60,
    },
    contentContainer: {
        flex: 1,
        padding: 20,
    },
    titleInput: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    contentInput: {
        flex: 1,
        fontSize: 18,
        textAlignVertical: 'top', // Agar teks mulai dari atas di Android
    },
    menuOptions: {
        marginTop: 40,
        borderRadius: 12,
        padding: 5,
        // Tambahkan shadow agar cantik
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10
    },
    previewImage: {
        width: '100%',
        height: 600,
        borderRadius: 12,
        resizeMode: 'cover',
        borderWidth: 1,
        borderColor: '#eee'
    },
    removeImageBtn: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: 5,
        borderRadius: 20
    },
});