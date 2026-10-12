import * as SecureStore from 'expo-secure-store';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { Config } from '@/constants/config';
import type { Database } from '@/types/database.types';

/**
 * Secure Store Adapter for Supabase Auth in React Native.
 * On Android, this uses the Android Keystore to encrypt the user's
 * JWT tokens and session data at rest.
 */
const ExpoSecureStoreAdapter = {
  getItem: (key: string) => {
    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    return SecureStore.setItemAsync(key, value);
  },
  removeItem: (key: string) => {
    return SecureStore.deleteItemAsync(key);
  },
};

export const supabase = createClient<Database>(
  Config.supabaseUrl,
  Config.supabaseAnonKey,
  {
    auth: {
      storage: Platform.OS !== 'web' ? ExpoSecureStoreAdapter : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
