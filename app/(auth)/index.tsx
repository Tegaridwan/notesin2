import { router } from 'expo-router'
import React from 'react'
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const index = () => {
  const localImage = require('../../assets/images/logo.png')
  const image2 = require('../../assets/images/3236267.jpg')

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1}}>
      <View>
        <View style={{ flexDirection: 'row', marginTop: 10, marginBottom: 30 }}>
          <Image source={localImage} style={styles.logo} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', marginTop: 30, marginLeft: -10,}}>NotesIn</Text>
        </View>
        <Image source={image2} style={styles.image2} />
        <View style={{flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20}}>
          <Text style={{fontSize: 30, fontWeight: 'bold', color: '#673ab7'}}>Hello!</Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')} style={styles.daftarButton}>
            <Text style={styles.daftarButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default index

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  image2: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginTop: -20,
  },
  loginButton: {
    backgroundColor: '#673ab7',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 12,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  daftarButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#673ab7',
    paddingVertical: 10,
    paddingHorizontal: 70,
    borderRadius: 12,
  },
  daftarButtonText: {
    color: '#4B0082',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },

})