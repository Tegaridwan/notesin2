import { IconSymbol } from '@/components/ui/icon-symbol';
import { useColorScheme } from '@/hooks/use-color-scheme';
import Ionicons from '@expo/vector-icons/Ionicons';
import { DrawerContentComponentProps, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DrawerLayout() {
  const colorScheme = useColorScheme();


  function CustomDrawerContent(props: DrawerContentComponentProps) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ paddingBottom: 20, paddingTop: 25, paddingHorizontal: 25 }}>
          <Text style={{ fontSize: 24, fontWeight: '600', color: colorScheme === 'dark' ? 'white' : 'black' }}>
            Notesin
          </Text>
        </View>
        <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      </SafeAreaView>
    )
  }

  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerActiveTintColor: '#4B0082',
        drawerInactiveTintColor: 'black',
        headerShadowVisible: false,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'Notesin',
          drawerIcon: ({ color }: { color: string }) => <Ionicons size={28} name="reader-outline" color={color} />,
          // headerRight: () => (
          //   <View style={{ flexDirection: 'row' }}>
          //     <Pressable onPress={() => { }}>
          //       <Ionicons name='moon-outline' size={29} style={{ marginRight: 15 }} />
          //     </Pressable>
          //     <Pressable onPress={() => {}}>
          //       <Ionicons name='person-circle-outline' size={33} style={{ marginRight: 15 }} />
          //     </Pressable>
          //   </View>
          // )
        }}
      />
      <Drawer.Screen
        name="arsip"
        options={{
          title: 'Arsip',
          drawerIcon: ({ color }: { color: string }) => <Ionicons size={28} name="archive-outline" color={color} />,
        }}
      />
      <Drawer.Screen
        name="sampah"
        options={{
          title: 'Sampah',
          drawerIcon: ({ color }: { color: string }) => <Ionicons size={28} name="trash-outline" color={color} />,
        }}
      />
      <Drawer.Screen
        name="setting"
        options={{
          title: 'Pengaturan',
          drawerIcon: ({ color }: { color: string }) => <Ionicons size={28} name="settings-outline" color={color} />,
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'Explore',
          drawerIcon: ({ color }: { color: string }) => <IconSymbol size={28} name="paperplane.fill" color={color} />,
        }}
      />
    </Drawer>
  );
}
