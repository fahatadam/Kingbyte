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
import { ArrowLeft, Tv, Hash } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const PROVIDERS = [
  {
    id: 'dstv',
    name: 'DStv',
    plans: [
      { id: 'padi', name: 'DStv Padi', price: 2950 },
      { id: 'yanga', name: 'DStv Yanga', price: 4150 },
      { id: 'confam', name: 'DStv Confam', price: 9250 },
      { id: 'compact', name: 'DStv Compact', price: 16600 },
      { id: 'premium', name: 'DStv Premium', price: 29500 },
    ],
  },
  {
    id: 'gotv',
    name: 'GOtv',
    plans: [
      { id: 'lite', name: 'GOtv Lite', price: 900 },
      { id: 'jinja', name: 'GOtv Jinja', price: 2700 },
      { id: 'jolli', name: 'GOtv Jolli', price: 4850 },
      { id: 'max', name: 'GOtv Max', price: 7200 },
      { id: 'supa', name: 'GOtv Supa', price: 9600 },
    ],
  },
  {
    id: 'startimes',
    name: 'StarTimes',
    plans: [
      { id: 'nova', name: 'StarTimes Nova', price: 900 },
      { id: 'basic', name: 'StarTimes Basic', price: 2500 },
      { id: 'smart', name: 'StarTimes Smart', price: 4200 },
      { id: 'classic', name: 'StarTimes Classic', price: 5500 },
      { id: 'super', name: 'StarTimes Super', price: 7600 },
    ],
  },
];

export default function CableScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { wallet, refresh } = useWallet();

  const [providerIdx, setProviderIdx] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState(PROVIDERS[0].plans[0]);
  const [smartcardNo, setSmartcardNo] = useState('');
  const [loading, setLoading] = useState(false);

  const provider = PROVIDERS[providerIdx];
  const balance = Number(wallet?.balance ?? 0);

  const handleProviderChange = (idx: number) => {
    setProviderIdx(idx);
    setSelectedPlan(PROVIDERS[idx].plans[0]);
  };

  const handlePay = async () => {
    if (!smartcardNo.trim()) {
      Alert.alert('Required', 'Please enter your smartcard / IUC number.');
      return;
    }
    if (selectedPlan.price > balance) {
      Alert.alert('Insufficient Balance', 'Please top up your Kingbyte wallet first.');
      return;
    }

    setLoading(true);
    try {
      const reference = `CAB-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user!.id,
        reference,
        type: 'cable',
        status: 'successful',
        amount: selectedPlan.price,
        description: `${provider.name} ${selectedPlan.name} — Smartcard: ${smartcardNo}`,
        provider: provider.id,
      });

      if (txError) throw txError;

      await supabase
        .from('wallets')
        .update({ balance: balance - selectedPlan.price })
        .eq('user_id', user!.id);

      await refresh();
      setLoading(false);

      Alert.alert(
        '📺 Cable TV Renewed',
        `${provider.name} ${selectedPlan.name} activated for smartcard ${smartcardNo}.\nRef: ${reference}`,
        [{ text: 'Done', onPress: () => router.replace('/(tabs)/transactions') }]
      );
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Payment Failed', e.message || 'Could not process payment.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <ArrowLeft size={22} color={Palette.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Cable TV Subscription</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card style={styles.balanceBar}>
          <Text style={styles.balanceBarLabel}>Available Balance:</Text>
          <Text style={styles.balanceBarAmount}>
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </Text>
        </Card>

        {/* Provider Selector */}
        <Text style={styles.sectionLabel}>Select Provider</Text>
        <View style={styles.providerRow}>
          {PROVIDERS.map((p, idx) => (
            <Pressable
              key={p.id}
              onPress={() => handleProviderChange(idx)}
              style={[styles.providerChip, providerIdx === idx && styles.providerChipActive]}>
              <Tv size={16} color={providerIdx === idx ? Palette.white : Palette.textSecondary} />
              <Text style={[styles.providerText, providerIdx === idx && styles.providerTextActive]}>
                {p.name}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Smartcard Input */}
        <Input
          label="Smartcard / IUC Number"
          placeholder="1234567890"
          keyboardType="number-pad"
          value={smartcardNo}
          onChangeText={setSmartcardNo}
          leftIcon={<Hash size={18} color={Palette.textSecondary} />}
        />

        {/* Plans */}
        <Text style={styles.sectionLabel}>Select Subscription Package</Text>
        {provider.plans.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
              style={[styles.planCard, isSelected && styles.planCardSelected]}>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{plan.name}</Text>
                <Text style={styles.planValidity}>Monthly renewal</Text>
              </View>
              <Text style={[styles.planPrice, isSelected && { color: Palette.gold }]}>
                ₦{plan.price.toLocaleString()}
              </Text>
            </Pressable>
          );
        })}

        <Button
          title={`Pay ₦${selectedPlan.price.toLocaleString()} — ${selectedPlan.name}`}
          onPress={handlePay}
          loading={loading}
          size="lg"
          style={{ marginTop: Spacing.xl }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.deepNavy },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.cardBorder,
  },
  backButton: { padding: Spacing.xs },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Palette.white },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.huge },
  balanceBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    marginBottom: Spacing.lg,
  },
  balanceBarLabel: { fontSize: 13, color: Palette.textSecondary },
  balanceBarAmount: { fontSize: 15, fontWeight: '700', color: Palette.gold },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Palette.textSecondary, marginBottom: Spacing.sm },
  providerRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  providerChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  providerChipActive: { backgroundColor: Palette.royalBlue, borderColor: Palette.royalBlue },
  providerText: { fontSize: 13, fontWeight: '700', color: Palette.textSecondary },
  providerTextActive: { color: Palette.white },
  planCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginBottom: Spacing.sm,
  },
  planCardSelected: { borderColor: Palette.royalBlue, backgroundColor: 'rgba(37, 99, 235, 0.1)' },
  planInfo: { gap: 2 },
  planName: { fontSize: 14, fontWeight: '700', color: Palette.white },
  planValidity: { fontSize: 12, color: Palette.textMuted },
  planPrice: { fontSize: 15, fontWeight: '800', color: Palette.textSecondary },
});
