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
import { ArrowLeft, Smartphone, CheckCircle2, ShieldCheck } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NETWORKS = [
  { id: 'MTN', name: 'MTN', bg: '#FDE047', text: '#000000' },
  { id: 'Airtel', name: 'Airtel', bg: '#EF4444', text: '#FFFFFF' },
  { id: 'Glo', name: 'Glo', bg: '#10B981', text: '#FFFFFF' },
  { id: '9mobile', name: '9mobile', bg: '#047857', text: '#FFFFFF' },
] as const;

const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

export default function AirtimeScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { wallet, refresh } = useWallet();
  const [network, setNetwork] = useState<(typeof NETWORKS)[number]['id']>('MTN');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [amount, setAmount] = useState('1000');
  const [loading, setLoading] = useState(false);

  const balance = Number(wallet?.balance ?? 0);
  const numAmount = Number(amount) || 0;

  const handleBuy = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('Invalid Phone', 'Please enter a valid 11-digit Nigerian phone number.');
      return;
    }
    if (numAmount < 50) {
      Alert.alert('Minimum Amount', 'The minimum airtime recharge is ₦50.');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Insufficient Balance', 'Please top up your Kingbyte wallet first.');
      return;
    }

    setLoading(true);
    try {
      const reference = `AIR-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      // 1. Record the transaction in Supabase
      const { data: tx, error: txError } = await supabase
        .from('transactions')
        .insert({
          user_id: user!.id,
          reference,
          type: 'airtime',
          status: 'successful',
          amount: numAmount,
          description: `${network} ₦${numAmount.toLocaleString()} Airtime to ${phone}`,
          provider: network.toLowerCase(),
        })
        .select()
        .single();

      if (txError) throw txError;

      // 2. Debit the wallet balance
      const newBalance = balance - numAmount;
      await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user!.id);

      await refresh();
      setLoading(false);

      Alert.alert(
        'Airtime Successful!',
        `₦${numAmount.toLocaleString()} ${network} airtime sent to ${phone}.\nReference: ${reference}`,
        [{ text: 'View Receipt', onPress: () => router.replace('/(tabs)/transactions') }]
      );
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Purchase Failed', e.message || 'Could not complete airtime purchase.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <ArrowLeft size={22} color={Palette.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Buy Airtime</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Balance Chip */}
        <Card style={styles.balanceBar}>
          <Text style={styles.balanceBarLabel}>Wallet Balance:</Text>
          <Text style={styles.balanceBarAmount}>
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </Text>
        </Card>

        {/* Network Selector */}
        <Text style={styles.sectionLabel}>Select Network</Text>
        <View style={styles.networkGrid}>
          {NETWORKS.map((n) => {
            const isSelected = network === n.id;
            return (
              <Pressable
                key={n.id}
                onPress={() => setNetwork(n.id)}
                style={[styles.networkCard, isSelected && styles.networkSelected]}>
                <View style={[styles.networkCircle, { backgroundColor: n.bg }]}>
                  <Text style={[styles.networkInitial, { color: n.text }]}>
                    {n.name.slice(0, 3)}
                  </Text>
                </View>
                <Text style={styles.networkName}>{n.name}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* Phone Input */}
        <Input
          label="Recipient Phone Number"
          placeholder="08012345678"
          keyboardType="phone-pad"
          maxLength={11}
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Smartphone size={18} color={Palette.textSecondary} />}
        />

        {/* Amount Input */}
        <Input
          label="Amount (₦)"
          placeholder="1000"
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
        />

        {/* Quick Amounts */}
        <Text style={styles.sectionLabel}>Quick Amount</Text>
        <View style={styles.quickGrid}>
          {QUICK_AMOUNTS.map((q) => (
            <Pressable
              key={q}
              onPress={() => setAmount(String(q))}
              style={[
                styles.quickChip,
                numAmount === q && styles.quickChipActive,
              ]}>
              <Text
                style={[
                  styles.quickText,
                  numAmount === q && styles.quickTextActive,
                ]}>
                ₦{q.toLocaleString()}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Submit */}
        <Button
          title={`Pay ₦${numAmount.toLocaleString()} Airtime`}
          onPress={handleBuy}
          loading={loading}
          size="lg"
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.cardBorder,
  },
  backButton: {
    padding: Spacing.xs,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.white,
  },
  scrollContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  balanceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  balanceBarLabel: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  balanceBarAmount: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.gold,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginBottom: Spacing.sm,
  },
  networkGrid: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  networkCard: {
    flex: 1,
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  networkSelected: {
    borderColor: Palette.royalBlue,
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
  },
  networkCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xs,
  },
  networkInitial: {
    fontSize: 10,
    fontWeight: '800',
  },
  networkName: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.white,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  quickChip: {
    width: '31%',
    backgroundColor: Palette.midnightSlate,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  quickChipActive: {
    backgroundColor: Palette.royalBlue,
    borderColor: Palette.royalBlue,
  },
  quickText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  quickTextActive: {
    color: Palette.white,
  },
});
