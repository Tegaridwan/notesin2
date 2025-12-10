import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text } from "react-native";
// 1. Perbaiki spasi pada import
import { saveOrUpdateNote, toggleArchiveNote, togglePinNote } from "@/service/notesServices";
import { Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const colorScheme = useColorScheme();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [ isPinned, setIsPinned ] = useState(false);
    const [ isArchived, setIsArchived ] = useState(false);

    const [noteId, setNoteId] = useState<string | null>(null)

    useEffect(() => {
        if (params.id) {
            setNoteId(params.id as string)
            setTitle(params.title as string || '')
            setContent(params.content as string || '')

            setIsPinned(params.isPinned === 'true');
            setIsArchived(params.isArchived === 'true');
        }
    },[params])

    const handleBack = async () => {
        await saveOrUpdateNote(noteId, title, content)
        router.back()
    }

    const handlePint = async() => {
        if (!noteId) return
        const result = await togglePinNote(noteId, isPinned);
        if (result?.success) {
            // setIsPinned(result.newStatus);
        }
    }

    const handleArchive = async () => {
        if (!noteId) return
        const result = await toggleArchiveNote(noteId, isArchived)
        if (result?.success) {
            router.back()
        }
    }
    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBack}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <Menu style={{ paddingRight: 15 }}>
                    <MenuTrigger>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: { marginTop: 40, borderRadius: 8 } }}>
                        <MenuOption onSelect={handlePint}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                <Ionicons name="pin-outline" size={20} color="#444" style={{ marginRight: 10 }} />
                                <Text>Sematkan</Text>
                            </View>
                        </MenuOption>

                        <MenuOption onSelect={handleArchive}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                <Ionicons name="archive-outline" size={20} color="#444" style={{ marginRight: 10 }} />
                                <Text>Arsip</Text>
                            </View>
                        </MenuOption>
                    </MenuOptions>
                </Menu>
            </View>
            <View style={{ backgroundColor: 'white', flex: 1, padding: 20 }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        placeholder="Titlee"
                        value={title}
                        onChangeText={setTitle}
                        style={{ height: 50, borderColor: 'gray', marginBottom: 10, paddingHorizontal: 10, fontSize: 20, fontWeight: 'bold', color: Colors[colorScheme ?? 'light'].text }}
                    />
                    <TextInput
                        placeholder='Deskripsi'
                        placeholderTextColor="#888"
                        value={content}
                        onChangeText={setContent}
                        multiline={true}
                        numberOfLines={4}
                        style={{
                            borderColor: 'gray',
                            flex: 1,
                            fontSize: 18,
                            color: Colors[colorScheme ?? 'light'].text,
                            paddingVertical: 10,
                            textAlignVertical: 'top',
                            paddingHorizontal: 10
                        }}
                    />
                </View>
            </View>
        </SafeAreaView>

    )
}

// export default add

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 5,
        paddingTop: 2,
        paddingEnd: 2,
        borderBottomColor: '#f0f0f0',
        height: 60,
        justifyContent: 'space-between'
    },
})