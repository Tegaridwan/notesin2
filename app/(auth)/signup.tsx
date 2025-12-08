import { registerEmail } from '@/service/auth/emailAuth';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan Password wajib diisi.');
      return;
    }

    setLoading(true);
    const result = await registerEmail(email, password);
    setLoading(false);

    if (result.success) {
      Alert.alert('Success', 'Registrasi berhasil!');
      router.replace('/(tabs)');
    } else {
      // Alert.alert('Error', 'Registrasi gagal. Silakan coba lagi.' + result.error);
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
          <Text style={{ fontSize: 55, fontWeight: 'bold', marginTop: 10, marginBottom: 10, color: '#673ab7' }}>Hi!</Text>
          <Text style={{ fontSize: 18, color: 'gray' }}>Create a new account</Text>
          {/* <View style={[styles.inputContainerName,]}>
            <Ionicons name="person-outline" size={24} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Name..."
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />
          </View> */}
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
              <Ionicons name={isPasswordVisible ? 'eye-outline' : 'eye-off-outline'} size={24} style={styles.inputIcon} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleRegister} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Sign Up</Text>
          </TouchableOpacity>
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
          <View style={{ flexDirection: 'row', marginTop: 20 }}>
            <Text style={{ marginLeft: 5 }}>You have already account</Text>
            <Link href="/(auth)/login" style={{ color: '#673ab7', }}>
              Sign In
            </Link>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

export default signup

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  inputContainerName: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 15,
    width: '80%',
    borderColor: '#673ab7',
  },
  inputContainerEmail: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 55,
    marginTop: 12,
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
    marginTop: 12,
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
    marginBottom: 20,
    marginTop: 20,
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