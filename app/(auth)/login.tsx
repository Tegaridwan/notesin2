import { loginEmail } from '@/service/auth/emailAuth'
import { Ionicons } from '@expo/vector-icons'
import { Link, router } from 'expo-router'
import React, { useState } from 'react'
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

const login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handelLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password wajib diisi.');
      return;
    }
    try {
      setLoading(true);
      const result = await loginEmail(email, password);

      if (result.success) {
        Alert.alert('Success', 'Login berhasil!');
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', result.error || 'Login gagal. Silakan coba lagi.');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Login gagal karena kesalahan tak terduga.');
    } finally {
      setLoading(false);
    }
  }

  const tooglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  }

  return (
    <SafeAreaView style={{ backgroundColor: '#fff', flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <View style={styles.container}>
          <Text style={{ fontSize: 55, fontWeight: 'bold', marginTop: 30, marginBottom: 10, color: '#673ab7' }}>Welcome</Text>
          <Text style={{ fontSize: 18, color: 'gray' }}>Sign in to continue</Text>
          <View style={[styles.inputContainerEmail,]}>
            <Ionicons name="mail-outline" size={24} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email..."
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>
          <View style={[styles.inputContainerPassword,]}>
            <Ionicons name="key-outline" size={24} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password..."
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
              autoCapitalize="none"
            />
             <TouchableOpacity onPress={tooglePasswordVisibility}>
              <Ionicons name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} style={styles.inputIcon}/>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handelLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
          <Link href="/(auth)/signup" style={{ marginTop: 15, color: '#673ab7', }}>
            Forgot Password?
          </Link>
          {/* Divider Section (OR) */}
          {/* <View style={styles.dividerContainer}>
            <View style={[styles.dividerLine, { backgroundColor: '#E0E0E0' }]} />
            <Text style={{ marginHorizontal: 10, color: 'gray' }}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: '#E0E0E0' }]} />
          </View>
          <View style={styles.socialIconsWrapper}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity style={styles.socialIconButton}>
                <Image source={require('../../assets/images/google-removebg-preview(1).png')} style={styles.socialIconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconButton}>
                <Image source={require('../../assets/images/Facebook-removebg-preview.png')} style={styles.socialIconImage} resizeMode="contain" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialIconButton}>
                <Image source={require('../../assets/images/x-removebg-preview.png')} style={styles.socialIconImage} resizeMode="contain" />
              </TouchableOpacity>
            </View>
          </View> */}
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <Text style={{marginLeft: 5}}>Don't have an account?</Text>
             <Link href="/(auth)/signup" style={{ color: '#673ab7', }}>
            Sign Up
          </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default login

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  inputContainerEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 30,
    width: '80%',
    borderColor: '#673ab7',
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    color: '#000',
  },
  inputIcon: {
    marginRight: 10,
    color: '#673ab7',
  },
  inputContainerPassword: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 20,
    width: '80%',
    borderColor: '#673ab7',
  },
  loginButton: {
    backgroundColor: '#673ab7',
    paddingVertical: 10,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginTop: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 15,
    width: '80%', 
    color: 'black'
  },
  dividerLine: {
    flex: 1,
    height: 1,
    flexDirection: 'row',
  },
  socialIconImage: {
    width: 55,
    height: 55
  },
  socialIconsWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // gunakan margin pada tombol ikon untuk jarak yang konsisten
  },
  socialIconButton: {
    marginHorizontal: 10,
  },
})