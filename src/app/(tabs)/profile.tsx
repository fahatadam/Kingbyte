import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {
  User,
  Shield,
  KeyRound,
  Fingerprint,
  Share2,
  Copy,
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { profile, user, signOut } = useAuth();
  const { wallet } = useWallet();
  const [biometricsEnabled, setBiometricsEnabled] = useState(
    Boolean(profile?.biometric_enabled)
  );
  const [copiedRef, setCopiedRef] = useState(false);

  const referralCode = profile?.referral_code || 'KINGBYTE';
  const dailyLimit = Number(wallet?.daily_limit ?? 50000);
  const monthlyLimit = Number(wallet?.monthly_limit ?? 300000);

  const copyReferral = async () => {
    await Clipboard.setStringAsync(referralCode);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
    Alert.alert('Referral Code Copied', `Your code ${referralCode} was copied!`);
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to log out of Kingbyte?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>ACCOUNT & SECURITY</Text>
          <Text style={styles.headerTitle}>User Profile</Text>
        </View>

        {/* User Card */}
        <Card elevated style={styles.userCard}>
          <View style={styles.avatarRow}>
            <View style={styles.avatarCircle}>
              <User size={30} color={Palette.gold} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{profile?.full_name || 'Kingbyte User'}</Text>
              <Text style={styles.userEmail}>{user?.email || 'user@kingbyte.app'}</Text>
              <Text style={styles.userPhone}>{profile?.phone || 'No phone set'}</Text>
            </View>
          </View>

          <View style={styles.kycRow}>
            <View style={styles.kycBadgeContainer}>
              <ShieldCheck size={16} color={Palette.success} />
              <Text style={styles.kycText}>
                {profile?.agent_tier?.toUpperCase() || 'TIER 1 VERIFIED'}
              </Text>
            </View>
            <Text style={styles.limitText}>
              Limit: ₦{dailyLimit.toLocaleString()}/day
            </Text>
          </View>
        </Card>

        {/* Referral Card */}
        <Card style={styles.referralCard}>
          <View style={styles.referralTop}>
            <Text style={styles.referralLabel}>YOUR REFERRAL CODE</Text>
            <Pressable onPress={copyReferral} style={styles.refCopyBtn}>
              <Copy size={13} color={Palette.gold} />
              <Text style={styles.refCopyText}>{copiedRef ? 'Copied' : 'Copy'}</Text>
            </Pressable>
          </View>
          <Text style={styles.refCodeText}>{referralCode}</Text>
          <Text style={styles.refDesc}>
            Share with friends and colleagues to earn instant commissions on their transactions.
          </Text>
        </Card>

        {/* Security Section */}
        <Text style={styles.sectionTitle}>Security Settings</Text>
        <Card style={styles.settingsCard}>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Fingerprint size={20} color={Palette.royalBlueLight} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Biometric Authentication</Text>
                <Text style={styles.settingSub}>Fingerprint / Face ID unlock</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={setBiometricsEnabled}
              trackColor={{ false: Palette.cardBorder, true: Palette.royalBlue }}
              thumbColor={biometricsEnabled ? Palette.white : Palette.textMuted}
            />
          </View>

          <View style={styles.divider} />

          <Pressable
            onPress={() => Alert.alert('Change PIN', 'Transaction PIN update initiated.')}
            style={styles.settingItemClickable}>
            <View style={styles.settingLeft}>
              <KeyRound size={20} color={Palette.gold} />
              <View style={styles.settingTextContainer}>
                <Text style={styles.settingTitle}>Transaction PIN</Text>
                <Text style={styles.settingSub}>Change 4-digit transfer PIN</Text>
              </View>
            </View>
            <ChevronRight size={18} color={Palette.textMuted} />
          </Pressable>
        </Card>

        {/* Support Section */}
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <Card style={styles.settingsCard}>
          <Pressable
            onPress={() => Alert.alert('Support', 'Contact Kingbyte support at support@kingbyte.app')}
            style={styles.settingItemClickable}>
            <View style={styles.settingLeft}>
              <HelpCircle size={20} color={Palette.textSecondary} />
              <Text style={styles.settingTitle}>Help & Support Center</Text>
            </View>
            <ChevronRight size={18} color={Palette.textMuted} />
          </Pressable>
        </Card>

        {/* Log Out */}
        <Button
          title="Sign Out"
          variant="danger"
          icon={<LogOut size={18} color={Palette.white} />}
          onPress={handleSignOut}
          style={{ marginTop: Spacing.xl }}
        />
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
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  headerSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.gold,
    letterSpacing: 1.5,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '700',
    color: Palette.white,
    marginTop: 2,
  },
  userCard: {
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  avatarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  avatarCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.white,
  },
  userEmail: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  userPhone: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  kycRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Palette.cardBorder,
  },
  kycBadgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  kycText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.success,
  },
  limitText: {
    fontSize: 12,
    color: Palette.textSecondary,
  },

  // Referral
  referralCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
  },
  referralTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  referralLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.gold,
    letterSpacing: 1,
  },
  refCopyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.sm,
  },
  refCopyText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.gold,
  },
  refCodeText: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: 2,
    marginVertical: Spacing.xs,
  },
  refDesc: {
    fontSize: 12,
    color: Palette.textMuted,
    lineHeight: 16,
  },

  // Settings
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  settingsCard: {
    padding: 0,
    marginBottom: Spacing.lg,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingItemClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingTextContainer: {
    gap: 2,
  },
  settingTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.white,
  },
  settingSub: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: Palette.cardBorder,
  },
});
