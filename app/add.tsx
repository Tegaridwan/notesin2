import { Colors } from '@/constants/theme';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, Text } from "react-native";
// 1. Perbaiki spasi pada import
import { Platform, StatusBar, StyleSheet, TextInput, TouchableOpacity, View, useColorScheme } from 'react-native';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { SafeAreaView } from 'react-native-safe-area-context';

const add = () => {
    // 2. WAJIB: Panggil hook ini agar variabel colorScheme tersedia
    const colorScheme = useColorScheme();

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => { }}>
                    <Ionicons name="arrow-back" size={28} color="black" />
                </TouchableOpacity>
                <View style={{ flex: 1 }} />
                <Menu style={{ paddingRight: 15 }}>
                    <MenuTrigger>
                        <Ionicons name="ellipsis-vertical" size={24} color="black" />
                    </MenuTrigger>
                    <MenuOptions customStyles={{ optionsContainer: { marginTop: 40, borderRadius: 8 } }}>
                        <MenuOption onSelect={() => Alert.alert('Menu Pin Ditekan')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                <Ionicons name="pin-outline" size={20} color="#444" style={{ marginRight: 10 }} />
                                <Text>Sematkan (Pinned)</Text>
                            </View>
                        </MenuOption>

                        <MenuOption onSelect={() => Alert.alert('Menu Hapus Ditekan')}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10 }}>
                                <Ionicons name="trash-outline" size={20} color="#444" style={{ marginRight: 10 }} />
                                <Text>Hapusss</Text>
                            </View>
                        </MenuOption>

                    </MenuOptions>
                </Menu>
            </View>
            <View style={{ backgroundColor: 'white', flex: 1, padding: 20 }}>
                <View style={{ flex: 1 }}>
                    <TextInput
                        placeholder="Titlee"
                        style={{ height: 50, borderColor: 'gray', marginBottom: 10, paddingHorizontal: 10, fontSize: 20, fontWeight: 'bold', color: Colors[colorScheme ?? 'light'].text }}
                    />
                    <TextInput
                        placeholder='Deskripsi'
                        placeholderTextColor="#888"
                        multiline={true}
                        numberOfLines={4}
                        style={{
                            borderColor: 'gray',
                            flex: 1,
                            // height: '100%' dihapus atau diganti flex: 1 agar mengisi sisa ruang
                            fontSize: 18,
                            // Sekarang ini tidak akan error lagi
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

export default add

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