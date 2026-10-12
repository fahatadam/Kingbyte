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
import { X, CreditCard, Building2, Smartphone } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FUND_METHODS = [
  {
    id: 'transfer',
    title: 'Bank Transfer',
    subtitle: 'Send from any Nigerian bank to your Kingbyte virtual account',
    icon: Building2,
  },
  {
    id: 'card',
    title: 'Debit/Credit Card',
    subtitle: 'Add funds with Mastercard or Visa (coming soon)',
    icon: CreditCard,
    disabled: true,
  },
  {
    id: 'ussd',
    title: 'USSD Top-Up',
    subtitle: '*770# and similar bank USSD codes (coming soon)',
    icon: Smartphone,
    disabled: true,
  },
];

const QUICK_AMOUNTS = [1000, 2000, 5000, 10000, 50000];

export default function FundWalletScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { wallet, refresh } = useWallet();

  const [method, setMethod] = useState('transfer');
  const [amount, setAmount] = useState('5000');
  const [loading, setLoading] = useState(false);

  const balance = Number(wallet?.balance ?? 0);
  const numAmount = Number(amount) || 0;
  const virtualAccountNum = wallet?.virtual_account_number || '0123456789';
  const virtualBank = wallet?.virtual_account_bank || 'Wema Bank / Kingbyte';
  const virtualName = wallet?.virtual_account_name || profile?.full_name || 'Kingbyte Customer';

  const handleSimulateFunding = async () => {
    if (numAmount < 100) {
      Alert.alert('Minimum Amount', 'Minimum wallet funding is ₦100.');
      return;
    }

    setLoading(true);
    try {
      const reference = `FND-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user!.id,
        reference,
        type: 'wallet_fund',
        status: 'successful',
        amount: numAmount,
        description: `Wallet funded via ${method} — ₦${numAmount.toLocaleString()}`,
        provider: method,
      });

      if (txError) throw txError;

      await supabase
        .from('wallets')
        .update({ balance: balance + numAmount })
        .eq('user_id', user!.id);

      await refresh();
      setLoading(false);

      Alert.alert(
        '✅ Wallet Funded Successfully',
        `₦${numAmount.toLocaleString()} has been added to your Kingbyte wallet.\nRef: ${reference}`,
        [{ text: 'Done', onPress: () => router.back() }]
      );
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Failed', e.message || 'Could not process funding.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Add Money</Text>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.closeButton}>
          <X size={22} color={Palette.white} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* Current balance */}
        <Card style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Current Balance</Text>
          <Text style={styles.balanceAmount}>
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </Text>
        </Card>

        {/* Virtual Account */}
        <Card style={styles.virtualCard}>
          <Text style={styles.virtualTitle}>🏦 Your Dedicated Bank Account</Text>
          <Text style={styles.virtualSub}>Transfer from any bank app — funds arrive instantly</Text>

          <View style={styles.accountDetail}>
            <Text style={styles.accountLabel}>Account Number</Text>
            <Text style={styles.accountNum}>{virtualAccountNum}</Text>
          </View>
          <View style={styles.accountDetail}>
            <Text style={styles.accountLabel}>Bank Name</Text>
            <Text style={styles.accountVal}>{virtualBank}</Text>
          </View>
          <View style={styles.accountDetail}>
            <Text style={styles.accountLabel}>Account Name</Text>
            <Text style={styles.accountVal}>{virtualName}</Text>
          </View>
        </Card>

        {/* Funding Methods */}
        <Text style={styles.sectionLabel}>Payment Method</Text>
        {FUND_METHODS.map((m) => {
          const IconComp = m.icon;
          const isSelected = method === m.id;
          return (
            <Pressable
              key={m.id}
              disabled={m.disabled}
              onPress={() => setMethod(m.id)}
              style={[
                styles.methodCard,
                isSelected && styles.methodCardSelected,
                m.disabled && styles.methodCardDisabled,
              ]}>
              <IconComp size={20} color={isSelected ? Palette.royalBlueLight : Palette.textSecondary} />
              <View style={styles.methodTextContainer}>
                <Text style={[styles.methodTitle, m.disabled && { color: Palette.textMuted }]}>
                  {m.title}
                  {m.disabled ? '  (Coming Soon)' : ''}
                </Text>
                <Text style={styles.methodSub}>{m.subtitle}</Text>
              </View>
              {isSelected && <View style={styles.selectedDot} />}
            </Pressable>
          );
        })}

        {/* Amount */}
        <Input
          label="Amount to Fund (₦)"
          placeholder="5000"
          keyboardType="number-pad"
          value={amount}
          onChangeText={setAmount}
          containerStyle={{ marginTop: Spacing.lg }}
        />

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

        <Text style={styles.simulateNote}>
          ⚠️ In development mode, tapping below simulates a wallet credit. In production, the virtual account receives the real bank transfer automatically.
        </Text>

        <Button
          title={`Simulate Fund — ₦${numAmount.toLocaleString()}`}
          variant="accent"
          onPress={handleSimulateFunding}
          loading={loading}
          size="lg"
          style={{ marginTop: Spacing.lg }}
        />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Palette.midnightSlate },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Palette.cardBorder,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Palette.white },
  closeButton: { padding: Spacing.xs },
  scrollContent: { padding: Spacing.lg, paddingBottom: Spacing.huge },
  balanceCard: {
    backgroundColor: Palette.elevatedCard,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  balanceLabel: { fontSize: 13, color: Palette.textSecondary },
  balanceAmount: { fontSize: 26, fontWeight: '800', color: Palette.white, marginTop: 4 },
  virtualCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.06)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
  },
  virtualTitle: { fontSize: 15, fontWeight: '700', color: Palette.white },
  virtualSub: { fontSize: 12, color: Palette.textMuted, marginTop: 2, marginBottom: Spacing.md },
  accountDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Palette.cardBorder,
  },
  accountLabel: { fontSize: 12, color: Palette.textMuted },
  accountNum: { fontSize: 16, fontWeight: '800', color: Palette.gold, letterSpacing: 1.5 },
  accountVal: { fontSize: 13, fontWeight: '600', color: Palette.white },
  sectionLabel: { fontSize: 13, fontWeight: '600', color: Palette.textSecondary, marginBottom: Spacing.sm },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Palette.elevatedCard,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginBottom: Spacing.sm,
  },
  methodCardSelected: { borderColor: Palette.royalBlue, backgroundColor: 'rgba(37, 99, 235, 0.12)' },
  methodCardDisabled: { opacity: 0.5 },
  methodTextContainer: { flex: 1, gap: 2 },
  methodTitle: { fontSize: 14, fontWeight: '600', color: Palette.white },
  methodSub: { fontSize: 12, color: Palette.textMuted },
  selectedDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: Palette.royalBlue },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, marginBottom: Spacing.sm },
  quickChip: {
    width: '30%',
    backgroundColor: Palette.elevatedCard,
    paddingVertical: Spacing.md,
    borderRadius: Radius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  quickChipActive: { backgroundColor: Palette.royalBlue, borderColor: Palette.royalBlue },
  quickText: { fontSize: 12, fontWeight: '600', color: Palette.textSecondary },
  quickTextActive: { color: Palette.white },
  simulateNote: {
    fontSize: 11,
    color: Palette.textMuted,
    lineHeight: 16,
    marginTop: Spacing.md,
    padding: Spacing.sm,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: Radius.sm,
    borderLeftWidth: 2,
    borderLeftColor: Palette.gold,
  },
});
