import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { Mail, Lock, User, Phone, Tag, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RegisterScreen() {
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    if (!fullName.trim() || !email.trim() || !phone.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setLoading(true);

    const { error: signUpError } = await signUp(
      email,
      password,
      fullName,
      phone,
      referralCode
    );
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message || 'Registration failed.');
    } else {
      Alert.alert(
        'Account Created',
        'Your Kingbyte account has been created! Please log in to continue.',
        [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
      );
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.brandContainer}>
          <View style={styles.logoBadge}>
            <ShieldCheck size={36} color={Palette.gold} />
          </View>
          <Text style={styles.brandTitle}>KINGBYTE</Text>
          <Text style={styles.brandSubtitle}>Open a New Digital Account</Text>
        </View>

        {/* Register Card */}
        <Card elevated style={styles.card}>
          <Text style={styles.cardTitle}>Create Account</Text>
          <Text style={styles.cardSub}>Join thousands of users on Kingbyte</Text>

          {error ? <Text style={styles.formError}>{error}</Text> : null}

          <Input
            label="Full Name *"
            placeholder="Amina Bello"
            value={fullName}
            onChangeText={setFullName}
            leftIcon={<User size={18} color={Palette.textSecondary} />}
          />

          <Input
            label="Email Address *"
            placeholder="you@kingbyte.app"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            leftIcon={<Mail size={18} color={Palette.textSecondary} />}
          />

          <Input
            label="Phone Number (11 digits) *"
            placeholder="08012345678"
            keyboardType="phone-pad"
            maxLength={11}
            value={phone}
            onChangeText={setPhone}
            leftIcon={<Phone size={18} color={Palette.textSecondary} />}
          />

          <Input
            label="Password (min 6 characters) *"
            placeholder="••••••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            leftIcon={<Lock size={18} color={Palette.textSecondary} />}
          />

          <Input
            label="Referral Code (Optional)"
            placeholder="e.g. KINGBYTE"
            autoCapitalize="characters"
            value={referralCode}
            onChangeText={setReferralCode}
            leftIcon={<Tag size={18} color={Palette.gold} />}
          />

          <Button
            title="Create Account"
            variant="accent"
            onPress={handleRegister}
            loading={loading}
            style={{ marginTop: Spacing.md }}
          />

          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/login')}>
              <Text style={styles.linkText}>Sign In</Text>
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
    paddingBottom: Spacing.huge,
  },
  brandContainer: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  brandTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: 2,
  },
  brandSubtitle: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
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
