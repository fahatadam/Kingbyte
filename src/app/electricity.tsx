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
import { ArrowLeft, Zap, Hash } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const DISCOS = [
  { id: 'IKEDC', name: 'Ikeja Electric (Lagos)' },
  { id: 'EKEDC', name: 'Eko Electric (Lagos)' },
  { id: 'AEDC', name: 'Abuja Electricity' },
  { id: 'KANO', name: 'Kano Electricity' },
  { id: 'PHDC', name: 'Port Harcourt Electricity' },
  { id: 'EEDC', name: 'Enugu Electricity' },
];

const METER_TYPES = ['Prepaid', 'Postpaid'] as const;
const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 20000];

export default function ElectricityScreen() {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { wallet, refresh } = useWallet();

  const [disco, setDisco] = useState(DISCOS[0]);
  const [meterType, setMeterType] = useState<'Prepaid' | 'Postpaid'>('Prepaid');
  const [meterNumber, setMeterNumber] = useState('');
  const [amount, setAmount] = useState('5000');
  const [loading, setLoading] = useState(false);

  const balance = Number(wallet?.balance ?? 0);
  const numAmount = Number(amount) || 0;

  const handlePay = async () => {
    if (!meterNumber.trim()) {
      Alert.alert('Required', 'Please enter a valid meter number.');
      return;
    }
    if (numAmount < 1000) {
      Alert.alert('Minimum Amount', 'Minimum electricity payment is ₦1,000.');
      return;
    }
    if (numAmount > balance) {
      Alert.alert('Insufficient Balance', 'Please top up your Kingbyte wallet first.');
      return;
    }

    setLoading(true);
    try {
      const reference = `ELEC-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      const token = Array.from({ length: 5 }, () =>
        Math.floor(Math.random() * 10000)
          .toString()
          .padStart(4, '0')
      ).join('-');

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user!.id,
        reference,
        type: 'electricity',
        status: 'successful',
        amount: numAmount,
        description: `${disco.name} ${meterType} — Meter: ${meterNumber} | Token: ${token}`,
        provider: disco.id.toLowerCase(),
      });

      if (txError) throw txError;

      await supabase
        .from('wallets')
        .update({ balance: balance - numAmount })
        .eq('user_id', user!.id);

      await refresh();
      setLoading(false);

      Alert.alert(
        '⚡ Electricity Token Generated',
        `Meter: ${meterNumber}\nDISCO: ${disco.name}\nAmount: ₦${numAmount.toLocaleString()}\n\nYour Token:\n${token}\n\nRef: ${reference}`,
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
        <Text style={styles.headerTitle}>Electricity Token</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card style={styles.balanceBar}>
          <Text style={styles.balanceBarLabel}>Available Balance:</Text>
          <Text style={styles.balanceBarAmount}>
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </Text>
        </Card>

        {/* DISCO Selector */}
        <Text style={styles.sectionLabel}>Select Electricity Provider</Text>
        {DISCOS.map((d) => (
          <Pressable
            key={d.id}
            onPress={() => setDisco(d)}
            style={[styles.discoItem, disco.id === d.id && styles.discoItemSelected]}>
            <View style={[styles.iconCircle, { backgroundColor: '#EF4444' }]}>
              <Zap size={16} color={Palette.white} />
            </View>
            <Text style={styles.discoName}>{d.name}</Text>
            {disco.id === d.id && <View style={styles.selectedDot} />}
          </Pressable>
        ))}

        {/* Meter Type */}
        <Text style={[styles.sectionLabel, { marginTop: Spacing.lg }]}>Meter Type</Text>
        <View style={styles.meterTypeRow}>
          {METER_TYPES.map((mt) => (
            <Pressable
              key={mt}
              onPress={() => setMeterType(mt)}
              style={[styles.meterChip, meterType === mt && styles.meterChipActive]}>
              <Text style={[styles.meterChipText, meterType === mt && styles.meterChipTextActive]}>
                {mt}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Meter Number */}
        <Input
          label="Meter Number"
          placeholder="45291738201"
          keyboardType="number-pad"
          value={meterNumber}
          onChangeText={setMeterNumber}
          leftIcon={<Hash size={18} color={Palette.textSecondary} />}
        />

        {/* Amount */}
        <Input
          label="Amount (₦)"
          placeholder="5000"
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
        />

        <Text style={styles.sectionLabel}>Quick Amount</Text>
        <View style={styles.quickGrid}>
          {QUICK_AMOUNTS.map((q) => (
            <Pressable
              key={q}
              onPress={() => setAmount(String(q))}
              style={[styles.quickChip, numAmount === q && styles.quickChipActive]}>
              <Text style={[styles.quickText, numAmount === q && styles.quickTextActive]}>
                ₦{q.toLocaleString()}
              </Text>
            </Pressable>
          ))}
        </View>

        <Button
          title={`Pay ₦${numAmount.toLocaleString()} for Electricity`}
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
  discoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginBottom: Spacing.sm,
    gap: Spacing.md,
  },
  discoItemSelected: { borderColor: Palette.royalBlue, backgroundColor: 'rgba(37, 99, 235, 0.1)' },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  discoName: { flex: 1, fontSize: 14, fontWeight: '600', color: Palette.white },
  selectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.royalBlue },
  meterTypeRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.lg },
  meterChip: {
    flex: 1,
    paddingVertical: Spacing.md,
    alignItems: 'center',
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  meterChipActive: { backgroundColor: Palette.royalBlue, borderColor: Palette.royalBlue },
  meterChipText: { fontSize: 14, fontWeight: '600', color: Palette.textSecondary },
  meterChipTextActive: { color: Palette.white },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.lg },
  quickChip: {
    width: '30%',
    backgroundColor: Palette.midnightSlate,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  quickChipActive: { backgroundColor: Palette.royalBlue, borderColor: Palette.royalBlue },
  quickText: { fontSize: 13, fontWeight: '600', color: Palette.textSecondary },
  quickTextActive: { color: Palette.white },
});
