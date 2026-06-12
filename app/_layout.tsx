import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuthStore } from '@/store/authStore';
import { Colors } from '@/constants/colors';

export default function RootLayout() {
  const { loadPersistedAuth } = useAuthStore();

  useEffect(() => {
    loadPersistedAuth();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.background }}>
      <SafeAreaProvider>
        <StatusBar style="dark" backgroundColor={Colors.background} />
        <Stack
          screenOptions={{
            headerShown:        false,
            contentStyle:       { backgroundColor: Colors.background },
            animation:          'fade_from_bottom',
            animationDuration:  250,
          }}
        >
          <Stack.Screen name="index"       options={{ animation: 'none' }} />
          <Stack.Screen name="auth"        options={{ animation: 'fade' }} />
          <Stack.Screen name="tabs"        options={{ animation: 'fade' }} />
          <Stack.Screen name="screens"     options={{ animation: 'slide_from_right' }} />
        </Stack>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
