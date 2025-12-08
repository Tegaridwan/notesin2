// app/(auth)/_layout.tsx
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack initialRouteName='index'>
      <Stack.Screen name="index" options={{ headerShown: false, headerShadowVisible: false }} />
      <Stack.Screen name="login" options={{ headerTitle: '', headerShadowVisible: false }} />
      <Stack.Screen name="signup" options={{ headerTitle: '', headerShadowVisible: false }} />
    </Stack>
  );
}