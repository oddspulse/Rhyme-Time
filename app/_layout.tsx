import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Audio } from 'expo-av';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameStore } from '../src/store/useGameStore';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  const initialize = useGameStore((state) => state.initialize);

  useEffect(() => {
    // Initialize audio
    Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });

    // Initialize store
    initialize();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#1a1a2e' },
          animation: 'fade',
        }}
      />
    </GestureHandlerRootView>
  );
}
