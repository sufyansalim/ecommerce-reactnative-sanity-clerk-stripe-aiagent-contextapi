import * as SplashScreen from 'expo-splash-screen';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';
import React, { useState, useEffect, useCallback } from 'react';
import { Platform, StatusBar, StyleSheet, View, LogBox } from 'react-native';

// Ignore SSRProvider warning from native-base (not needed in React 18)
LogBox.ignoreLogs(['In React 18, SSRProvider is not necessary']);
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { NativeBaseProvider } from 'native-base';
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import * as SecureStore from 'expo-secure-store';
import Colors from './constants/Colors';

// Context Providers
import { AppProvider, CartProvider, WishlistProvider, AuthProvider } from './context';

import AppNavigator from './navigation/AppNavigator';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

// Clerk token cache for secure storage
const tokenCache = {
  async getToken(key) {
    try {
      return SecureStore.getItemAsync(key);
    } catch (err) {
      return null;
    }
  },
  async saveToken(key, value) {
    try {
      return SecureStore.setItemAsync(key, value);
    } catch (err) {
      return;
    }
  },
};

// Get Clerk publishable key from environment
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function App(props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await loadResourcesAsync();
      } catch (e) {
        console.warn(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (isLoadingComplete) {
      await SplashScreen.hideAsync();
    }
  }, [isLoadingComplete]);

  if (!isLoadingComplete) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <ClerkLoaded>
        <SafeAreaProvider>
          <View style={styles.container} onLayout={onLayoutRootView}>
            {Platform.OS === 'ios' && <StatusBar barStyle="default" />}
            <NativeBaseProvider config={{ suppressColorAccessibilityWarning: true }}>
              <AuthProvider>
                <AppProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <AppNavigator />
                    </WishlistProvider>
                  </CartProvider>
                </AppProvider>
              </AuthProvider>
            </NativeBaseProvider>
          </View>
        </SafeAreaProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}

async function loadResourcesAsync() {
  await Promise.all([
    Asset.loadAsync([
      require('./assets/images/robot-dev.png'),
      require('./assets/images/robot-prod.png'),
    ]),
    Font.loadAsync({
      // This is the font that we are using for our tab bar
      ...Ionicons.font,
      // We include SpaceMono because we use it in HomeScreen.js. Feel free to
      // remove this if you are not using it in your app
      'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
    }),
  ]);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
});
