import { Colors } from '@/constants/theme';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    Platform,
    SafeAreaView,
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
import { saveOrUpdateNote, toggleArchiveNote, togglePinNote, toggleTrashNote, } from '@/service/notesServices';

export default function NoteScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    
    // State untuk UI (Icon berubah warna kalau aktif)
    const [isPinned, setIsPinned] = useState(false);
    const [isArchived, setIsArchived] = useState(false);
    const [isTrashed, setIsTrashed] = useState(false);
    const [noteId, setNoteId] = useState<string | null>(null);

    // 1. Ambil data jika ini mode Edit
    useEffect(() => {
        if (params.id) {
            setNoteId(params.id as string);
            setTitle(params.title as string || '');
            setContent(params.content as string || '');
            setIsPinned(params.isPinned === 'true');
            setIsArchived(params.isArchived === 'true');
        }
    }, [params]);

    // 2. Fungsi Simpan saat tombol Back ditekan
    const handleBack = async () => {
        // Panggil service simpan
        await saveOrUpdateNote(noteId, title, content);
        router.back();
    };

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
                                <Text style={{color: isPinned ? "#4B0082" : "#000"}}>
                                    {isPinned ? "Lepas Sematan" : "Sematkan"}
                                </Text>
                            </View>
                        </MenuOption>
                        <MenuOption onSelect={handleArchive}>
                            <View style={styles.menuItem}>
                                <Ionicons 
                                    name="archive-outline" 
                                    size={20} 
                                    color="#444" 
                                    style={{ marginRight: 10 }} 
                                />
                                <Text>Arsipkan</Text>
                            </View>
                        </MenuOption>
                        <MenuOption onSelect={handleDelete}>
                            <View style={styles.menuItem}>
                                <Ionicons
                                    name='trash-outline'
                                    size={20}
                                    color="#444"
                                    style={{marginRight: 10}}
                                />
                                <Text>Hapus</Text>
                            </View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>

            <View style={[styles.contentContainer, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
                <TextInput
                    placeholder="Judul"
                    placeholderTextColor="#999"
                    value={title}
                    onChangeText={setTitle}
                    style={[styles.titleInput, { color: themeTextColor }]}
                />
                <TextInput
                    placeholder="Ketik sesuatu..."
                    placeholderTextColor="#999"
                    value={content}
                    onChangeText={setContent}
                    multiline={true}
                    style={[styles.contentInput, { color: themeTextColor }]}
                />
            </View>
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
    }
});