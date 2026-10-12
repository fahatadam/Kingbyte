import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  RefreshControl,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import {
  Eye,
  EyeOff,
  PlusCircle,
  Send,
  Smartphone,
  Wifi,
  Zap,
  Tv,
  Copy,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
} from 'lucide-react-native';
import { useAuth } from '@/hooks/use-auth';
import { useWallet } from '@/hooks/use-wallet';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Palette, Radius, Spacing, Typography } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { profile, user } = useAuth();
  const { wallet, transactions, refreshing, refresh } = useWallet();
  const [showBalance, setShowBalance] = useState(true);
  const [copied, setCopied] = useState(false);

  const balance = Number(wallet?.balance ?? 0);
  const ledgerBalance = Number(wallet?.ledger_balance ?? 0);
  const commissionBalance = Number(wallet?.commission_balance ?? 0);

  const virtualAccountNum = wallet?.virtual_account_number || '0123456789';
  const virtualBank = wallet?.virtual_account_bank || 'Wema Bank / Kingbyte';
  const virtualName = wallet?.virtual_account_name || profile?.full_name || 'Kingbyte Customer';

  const copyAccountNumber = async () => {
    await Clipboard.setStringAsync(virtualAccountNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    Alert.alert('Account Copied', `Account number ${virtualAccountNum} copied to clipboard.`);
  };

  const displayName = profile?.full_name?.split(' ')[0] || user?.email?.split('@')[0] || 'User';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Palette.gold}
            colors={[Palette.royalBlue, Palette.gold]}
          />
        }>
        {/* 1. Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandSubtitle}>KINGBYTE FINTECH</Text>
            <Text style={styles.greeting}>Hello, {displayName} 👋</Text>
          </View>
          <View style={styles.headerRight}>
            <Badge
              label={profile?.agent_tier?.toUpperCase() || 'TIER 1'}
              variant="gold"
            />
          </View>
        </View>

        {/* 2. Wallet Balance Card */}
        <Card elevated style={styles.balanceCard}>
          <View style={styles.balanceTopRow}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Pressable
              onPress={() => setShowBalance(!showBalance)}
              hitSlop={10}
              style={styles.eyeButton}>
              {showBalance ? (
                <Eye size={18} color={Palette.textSecondary} />
              ) : (
                <EyeOff size={18} color={Palette.textSecondary} />
              )}
            </Pressable>
          </View>

          <Text style={styles.balanceAmount}>
            {showBalance ? `₦${balance.toLocaleString('en-NG', { minimumFractionDigits: 2 })}` : '₦ ••••••••'}
          </Text>

          <View style={styles.subBalanceRow}>
            <View style={styles.subBalanceItem}>
              <Text style={styles.subBalanceLabel}>Ledger</Text>
              <Text style={styles.subBalanceValue}>
                {showBalance ? `₦${ledgerBalance.toLocaleString()}` : '••••'}
              </Text>
            </View>
            <View style={styles.subBalanceDivider} />
            <View style={styles.subBalanceItem}>
              <Text style={styles.subBalanceLabel}>Commission</Text>
              <Text style={styles.subBalanceValue}>
                {showBalance ? `₦${commissionBalance.toLocaleString()}` : '••••'}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.actionRow}>
            <Pressable
              onPress={() => router.push('/fund-wallet')}
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}>
              <View style={[styles.actionIconCircle, { backgroundColor: Palette.royalBlue }]}>
                <PlusCircle size={20} color={Palette.white} />
              </View>
              <Text style={styles.actionText}>Add Money</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push('/fund-wallet')}
              style={({ pressed }) => [styles.actionButton, pressed && styles.actionPressed]}>
              <View style={[styles.actionIconCircle, { backgroundColor: Palette.goldDark }]}>
                <Send size={20} color={Palette.goldBright} />
              </View>
              <Text style={styles.actionText}>Transfer</Text>
            </Pressable>
          </View>
        </Card>

        {/* 3. Dedicated Virtual Account Card */}
        <Card style={styles.virtualCard}>
          <View style={styles.virtualCardHeader}>
            <View style={styles.virtualHeaderLeft}>
              <ShieldCheck size={18} color={Palette.gold} />
              <Text style={styles.virtualBankTitle}>{virtualBank}</Text>
            </View>
            <Pressable
              onPress={copyAccountNumber}
              hitSlop={8}
              style={styles.copyBtn}>
              <Copy size={14} color={copied ? Palette.success : Palette.gold} />
              <Text style={[styles.copyBtnText, copied && { color: Palette.success }]}>
                {copied ? 'Copied' : 'Copy'}
              </Text>
            </Pressable>
          </View>

          <Text style={styles.virtualAccountNum}>{virtualAccountNum}</Text>
          <Text style={styles.virtualAccountName}>{virtualName}</Text>
          <Text style={styles.virtualNote}>
            Instant auto-funding: Transfer funds from any Nigerian bank app to this account number.
          </Text>
        </Card>

        {/* 4. Quick Services */}
        <Text style={styles.sectionTitle}>Essential Services</Text>
        <View style={styles.servicesGrid}>
          <Pressable
            onPress={() => router.push('/airtime')}
            style={({ pressed }) => [styles.serviceItem, pressed && styles.serviceItemPressed]}>
            <View style={[styles.serviceIconContainer, { backgroundColor: '#FDE047' }]}>
              <Smartphone size={22} color="#000000" />
            </View>
            <Text style={styles.serviceItemTitle}>Airtime</Text>
            <Text style={styles.serviceItemSub}>MTN, Glo, 9mobile</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/data')}
            style={({ pressed }) => [styles.serviceItem, pressed && styles.serviceItemPressed]}>
            <View style={[styles.serviceIconContainer, { backgroundColor: Palette.royalBlueLight }]}>
              <Wifi size={22} color={Palette.white} />
            </View>
            <Text style={styles.serviceItemTitle}>Data Bundle</Text>
            <Text style={styles.serviceItemSub}>Instant Top-up</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/electricity')}
            style={({ pressed }) => [styles.serviceItem, pressed && styles.serviceItemPressed]}>
            <View style={[styles.serviceIconContainer, { backgroundColor: '#EF4444' }]}>
              <Zap size={22} color={Palette.white} />
            </View>
            <Text style={styles.serviceItemTitle}>Electricity</Text>
            <Text style={styles.serviceItemSub}>Prepaid Tokens</Text>
          </Pressable>

          <Pressable
            onPress={() => router.push('/cable')}
            style={({ pressed }) => [styles.serviceItem, pressed && styles.serviceItemPressed]}>
            <View style={[styles.serviceIconContainer, { backgroundColor: Palette.gold }]}>
              <Tv size={22} color="#000000" />
            </View>
            <Text style={styles.serviceItemTitle}>Cable TV</Text>
            <Text style={styles.serviceItemSub}>DStv, GOtv, StarTimes</Text>
          </Pressable>
        </View>

        {/* 5. Recent Transactions */}
        <View style={styles.transactionsHeader}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <Pressable onPress={() => router.push('/(tabs)/transactions')}>
            <Text style={styles.seeAllText}>See all</Text>
          </Pressable>
        </View>

        {transactions.length === 0 ? (
          <Card style={styles.emptyCard}>
            <Clock size={32} color={Palette.textMuted} />
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySubtitle}>
              Top up your wallet or purchase airtime to see your history here.
            </Text>
          </Card>
        ) : (
          transactions.slice(0, 5).map((tx) => {
            const isCredit = tx.type === 'wallet_fund' || tx.type === 'cashback';
            const statusVariant =
              tx.status === 'successful'
                ? 'success'
                : tx.status === 'pending'
                ? 'warning'
                : 'danger';

            return (
              <Card key={tx.id} style={styles.txCard}>
                <View style={styles.txRow}>
                  <View
                    style={[
                      styles.txIconCircle,
                      {
                        backgroundColor: isCredit
                          ? Palette.successSurface
                          : Palette.dangerSurface,
                      },
                    ]}>
                    {isCredit ? (
                      <ArrowDownLeft size={18} color={Palette.success} />
                    ) : (
                      <ArrowUpRight size={18} color={Palette.danger} />
                    )}
                  </View>
                  <View style={styles.txInfo}>
                    <Text style={styles.txDesc} numberOfLines={1}>
                      {tx.description || tx.type.replace('_', ' ').toUpperCase()}
                    </Text>
                    <Text style={styles.txDate}>
                      {new Date(tx.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </Text>
                  </View>
                  <View style={styles.txAmountContainer}>
                    <Text
                      style={[
                        styles.txAmount,
                        { color: isCredit ? Palette.success : Palette.white },
                      ]}>
                      {isCredit ? '+' : '-'}₦{Number(tx.amount).toLocaleString()}
                    </Text>
                    <Badge label={tx.status} variant={statusVariant} style={styles.txBadge} />
                  </View>
                </View>
              </Card>
            );
          })
        )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  brandSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.gold,
    letterSpacing: 1.5,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: Palette.white,
    marginTop: 2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Balance Card
  balanceCard: {
    backgroundColor: Palette.midnightSlate,
    borderColor: 'rgba(37, 99, 235, 0.3)',
    borderWidth: 1,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    marginBottom: Spacing.lg,
  },
  balanceTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLabel: {
    fontSize: 13,
    color: Palette.textSecondary,
    fontWeight: '500',
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: '800',
    color: Palette.white,
    marginVertical: Spacing.md,
  },
  subBalanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Palette.cardBorder,
    marginBottom: Spacing.lg,
  },
  subBalanceItem: {
    flex: 1,
  },
  subBalanceDivider: {
    width: 1,
    height: 24,
    backgroundColor: Palette.cardBorder,
    marginHorizontal: Spacing.md,
  },
  subBalanceLabel: {
    fontSize: 11,
    color: Palette.textMuted,
  },
  subBalanceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 2,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.elevatedCard,
    borderRadius: Radius.md,
    paddingVertical: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  actionPressed: {
    opacity: 0.7,
  },
  actionIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  actionText: {
    color: Palette.white,
    fontSize: 14,
    fontWeight: '600',
  },

  // Virtual Account Card
  virtualCard: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderColor: 'rgba(245, 158, 11, 0.25)',
    marginBottom: Spacing.xl,
    padding: Spacing.lg,
    borderRadius: Radius.lg,
  },
  virtualCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  virtualHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  virtualBankTitle: {
    color: Palette.gold,
    fontSize: 13,
    fontWeight: '700',
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: Radius.sm,
  },
  copyBtnText: {
    color: Palette.gold,
    fontSize: 12,
    fontWeight: '700',
  },
  virtualAccountNum: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.white,
    letterSpacing: 2,
    marginTop: Spacing.xs,
  },
  virtualAccountName: {
    fontSize: 13,
    color: Palette.textSecondary,
    marginTop: 2,
  },
  virtualNote: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: Spacing.sm,
    lineHeight: 16,
  },

  // Services Grid
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.white,
    marginBottom: Spacing.md,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  serviceItem: {
    width: '47%',
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  serviceItemPressed: {
    borderColor: Palette.royalBlue,
  },
  serviceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  serviceItemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.white,
  },
  serviceItemSub: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },

  // Transactions
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  seeAllText: {
    fontSize: 13,
    color: Palette.gold,
    fontWeight: '600',
  },
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.white,
    marginTop: Spacing.md,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Palette.textMuted,
    textAlign: 'center',
    marginTop: Spacing.xs,
    paddingHorizontal: Spacing.lg,
  },
  txCard: {
    padding: Spacing.md,
    marginBottom: Spacing.sm,
  },
  txRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  txInfo: {
    flex: 1,
  },
  txDesc: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.white,
  },
  txDate: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
  txAmountContainer: {
    alignItems: 'flex-end',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  txBadge: {
    marginTop: Spacing.xs,
  },
});
