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
import { ArrowLeft, Wifi, Smartphone, Check } from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { supabase } from '@/lib/supabase';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const NETWORKS = [
  { id: 'MTN', name: 'MTN', bg: '#FDE047', text: '#000000' },
  { id: 'Airtel', name: 'Airtel', bg: '#EF4444', text: '#FFFFFF' },
  { id: 'Glo', name: 'Glo', bg: '#10B981', text: '#FFFFFF' },
  { id: '9mobile', name: '9mobile', bg: '#047857', text: '#FFFFFF' },
] as const;

const PLANS = [
  { id: '1gb', name: '1GB Daily', validity: '1 Day', price: 300 },
  { id: '2.5gb', name: '2.5GB 2-Days', validity: '2 Days', price: 600 },
  { id: '5gb', name: '5GB Weekly', validity: '7 Days', price: 1500 },
  { id: '10gb', name: '10GB Monthly', validity: '30 Days', price: 3500 },
  { id: '20gb', name: '20GB Monthly', validity: '30 Days', price: 6000 },
];

export default function DataScreen() {
  const insets = useSafeAreaInsets();
  const { user, profile } = useAuth();
  const { wallet, refresh } = useWallet();
  const [network, setNetwork] = useState<(typeof NETWORKS)[number]['id']>('MTN');
  const [selectedPlan, setSelectedPlan] = useState(PLANS[2]);
  const [phone, setPhone] = useState(profile?.phone || '');
  const [loading, setLoading] = useState(false);

  const balance = Number(wallet?.balance ?? 0);

  const handleBuyData = async () => {
    if (!phone || phone.length !== 11) {
      Alert.alert('Invalid Phone', 'Please enter a valid 11-digit phone number.');
      return;
    }
    if (selectedPlan.price > balance) {
      Alert.alert('Insufficient Balance', 'Please top up your Kingbyte wallet first.');
      return;
    }

    setLoading(true);
    try {
      const reference = `DAT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

      const { error: txError } = await supabase.from('transactions').insert({
        user_id: user!.id,
        reference,
        type: 'data',
        status: 'successful',
        amount: selectedPlan.price,
        description: `${network} ${selectedPlan.name} to ${phone}`,
        provider: network.toLowerCase(),
      });

      if (txError) throw txError;

      const newBalance = balance - selectedPlan.price;
      await supabase
        .from('wallets')
        .update({ balance: newBalance })
        .eq('user_id', user!.id);

      await refresh();
      setLoading(false);

      Alert.alert(
        'Data Activated!',
        `${network} ${selectedPlan.name} sent to ${phone}.\nRef: ${reference}`,
        [{ text: 'OK', onPress: () => router.replace('/(tabs)/transactions') }]
      );
    } catch (e: any) {
      setLoading(false);
      Alert.alert('Failed', e.message || 'Could not purchase data plan.');
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={10} style={styles.backButton}>
          <ArrowLeft size={22} color={Palette.white} />
        </Pressable>
        <Text style={styles.headerTitle}>Buy Data Bundle</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        <Card style={styles.balanceBar}>
          <Text style={styles.balanceBarLabel}>Available Balance:</Text>
          <Text style={styles.balanceBarAmount}>
            ₦{balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}
          </Text>
        </Card>

        {/* Network */}
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

        {/* Phone */}
        <Input
          label="Phone Number"
          placeholder="08012345678"
          keyboardType="phone-pad"
          maxLength={11}
          value={phone}
          onChangeText={setPhone}
          leftIcon={<Smartphone size={18} color={Palette.textSecondary} />}
        />

        {/* Plan List */}
        <Text style={styles.sectionLabel}>Select Data Bundle</Text>
        {PLANS.map((plan) => {
          const isSelected = selectedPlan.id === plan.id;
          return (
            <Pressable
              key={plan.id}
              onPress={() => setSelectedPlan(plan)}
              style={[styles.planCard, isSelected && styles.planSelected]}>
              <View style={styles.planInfo}>
                <Text style={styles.planTitle}>{plan.name}</Text>
                <Text style={styles.planValidity}>Validity: {plan.validity}</Text>
              </View>
              <Text style={styles.planPrice}>₦{plan.price.toLocaleString()}</Text>
            </Pressable>
          );
        })}

        <Button
          title={`Pay ₦${selectedPlan.price.toLocaleString()} for ${selectedPlan.name}`}
          onPress={handleBuyData}
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
  planSelected: {
    borderColor: Palette.royalBlue,
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
  },
  planInfo: {
    gap: 2,
  },
  planTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.white,
  },
  planValidity: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  planPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.gold,
  },
});
