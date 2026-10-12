import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { router, Link } from 'expo-router';
import { Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      setError('Please fill in both email and password.');
      return;
    }

    setError('');
    setLoading(true);

    const { error: signInError } = await signIn(email, password);
    setLoading(false);

    if (signInError) {
      setError(signInError.message || 'Login failed. Please check credentials.');
    } else {
      router.replace('/(tabs)' as any);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Brand Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={36} color={Palette.gold} />
          </View>
          <Text style={styles.brandTitle}>KINGBYTE</Text>
          <Text style={styles.brandSubtitle}>Secure Digital Banking & VTU</Text>
        </View>

        {/* Login Card */}
        <Card elevated style={styles.card}>
          <Text style={styles.cardTitle}>Welcome Back</Text>
          <Text style={styles.cardSub}>Sign in to your Kingbyte account</Text>

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <Input
            label="Email Address"
            placeholder="you@kingbyte.app"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={18} color={Palette.textSecondary} />}
          />

          <Input
            label="Password"
            placeholder="••••••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color={Palette.textSecondary} />}
          />

          <Button
            title="Sign In"
            onPress={handleLogin}
            loading={loading}
            style={{ marginTop: Spacing.md }}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')}>
              <Text style={styles.linkText}>Register here</Text>
            </Pressable>
          </View>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.deepNavy,
  },
  scrollContent: {
    padding: Spacing.xl,
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  brandTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 4,
  },
  card: {
    padding: Spacing.xl,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.white,
  },
  cardSub: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  formError: {
    backgroundColor: Palette.dangerSurface,
    color: Palette.danger,
    padding: Spacing.md,
    borderRadius: Radius.md,
    fontSize: 13,
    marginBottom: Spacing.md,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: Spacing.xl,
  },
  footerText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  linkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.gold,
  },
});
