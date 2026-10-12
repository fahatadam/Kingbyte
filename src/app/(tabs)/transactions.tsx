import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  RefreshControl,
  Modal,
} from 'react-native';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  CheckCircle2,
  Clock,
  XCircle,
  X,
  Share2,
} from 'lucide-react-native';
import { useWallet, Transaction } from '@/hooks/use-wallet';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const FILTERS = ['All', 'Airtime', 'Data', 'Bills', 'Fund'];

export default function TransactionsScreen() {
  const insets = useSafeAreaInsets();
  const { transactions, refreshing, refresh } = useWallet();
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const filteredTransactions = transactions.filter((tx) => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Airtime') return tx.type === 'airtime';
    if (activeFilter === 'Data') return tx.type === 'data';
    if (activeFilter === 'Bills') return tx.type === 'electricity' || tx.type === 'cable';
    if (activeFilter === 'Fund') return tx.type === 'wallet_fund';
    return true;
  });

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerSubtitle}>ACCOUNT LEDGER</Text>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterScroll}>
        {FILTERS.map((f) => (
          <Pressable
            key={f}
            onPress={() => setActiveFilter(f)}
            style={[styles.filterChip, activeFilter === f && styles.filterChipActive]}>
            <Text
              style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
              {f}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* List */}
      <FlatList
        data={filteredTransactions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={Palette.gold}
            colors={[Palette.royalBlue, Palette.gold]}
          />
        }
        ListEmptyComponent={
          <Card style={styles.emptyCard}>
            <Receipt size={36} color={Palette.textMuted} />
            <Text style={styles.emptyTitle}>No transactions found</Text>
            <Text style={styles.emptySubtitle}>
              Transactions matching "{activeFilter}" will appear here once initiated.
            </Text>
          </Card>
        }
        renderItem={({ item }) => {
          const isCredit = item.type === 'wallet_fund' || item.type === 'cashback';
          const statusVariant =
            item.status === 'successful'
              ? 'success'
              : item.status === 'pending'
              ? 'warning'
              : 'danger';

          return (
            <Pressable onPress={() => setSelectedTx(item)}>
              <Card style={styles.txCard}>
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
                    <Text style={styles.txTitle} numberOfLines={1}>
                      {item.description || item.type.toUpperCase()}
                    </Text>
                    <Text style={styles.txRef}>Ref: {item.reference}</Text>
                    <Text style={styles.txDate}>
                      {new Date(item.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
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
                      {isCredit ? '+' : '-'}₦{Number(item.amount).toLocaleString()}
                    </Text>
                    <Badge label={item.status} variant={statusVariant} style={{ marginTop: 4 }} />
                  </View>
                </View>
              </Card>
            </Pressable>
          );
        }}
      />

      {/* Digital Receipt Modal */}
      <Modal visible={Boolean(selectedTx)} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Transaction Receipt</Text>
              <Pressable onPress={() => setSelectedTx(null)} hitSlop={10}>
                <X size={20} color={Palette.textSecondary} />
              </Pressable>
            </View>

            {selectedTx ? (
              <View style={styles.receiptBody}>
                <View style={styles.receiptAmountBox}>
                  <Text style={styles.receiptAmountLabel}>Amount</Text>
                  <Text style={styles.receiptAmount}>
                    ₦{Number(selectedTx.amount).toLocaleString('en-NG', { minimumFractionDigits: 2 })}
                  </Text>
                  <Badge
                    label={selectedTx.status.toUpperCase()}
                    variant={
                      selectedTx.status === 'successful'
                        ? 'success'
                        : selectedTx.status === 'pending'
                        ? 'warning'
                        : 'danger'
                    }
                    style={{ alignSelf: 'center', marginTop: Spacing.sm }}
                  />
                </View>

                <View style={styles.receiptDivider} />

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptKey}>Service / Type</Text>
                  <Text style={styles.receiptVal}>{selectedTx.type.toUpperCase()}</Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptKey}>Reference</Text>
                  <Text style={[styles.receiptVal, { color: Palette.gold }]}>
                    {selectedTx.reference}
                  </Text>
                </View>

                <View style={styles.receiptRow}>
                  <Text style={styles.receiptKey}>Date & Time</Text>
                  <Text style={styles.receiptVal}>
                    {new Date(selectedTx.created_at).toLocaleString()}
                  </Text>
                </View>

                {selectedTx.description ? (
                  <View style={styles.receiptRow}>
                    <Text style={styles.receiptKey}>Description</Text>
                    <Text style={styles.receiptVal}>{selectedTx.description}</Text>
                  </View>
                ) : null}

                <Button
                  title="Close Receipt"
                  variant="outline"
                  onPress={() => setSelectedTx(null)}
                  style={{ marginTop: Spacing.xl }}
                />
              </View>
            ) : null}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Palette.deepNavy,
  },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    marginBottom: Spacing.md,
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
  filterScroll: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.lg,
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  filterChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: Palette.midnightSlate,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  filterChipActive: {
    backgroundColor: Palette.royalBlue,
    borderColor: Palette.royalBlue,
  },
  filterText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },
  filterTextActive: {
    color: Palette.white,
  },
  listContent: {
    padding: Spacing.lg,
    paddingBottom: Spacing.huge,
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
  txTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.white,
  },
  txRef: {
    fontSize: 11,
    color: Palette.textMuted,
    marginTop: 2,
  },
  txDate: {
    fontSize: 11,
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
  emptyCard: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
    marginTop: Spacing.xl,
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

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Palette.midnightSlate,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.xl,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Palette.white,
  },
  receiptBody: {
    paddingVertical: Spacing.sm,
  },
  receiptAmountBox: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: Radius.lg,
  },
  receiptAmountLabel: {
    fontSize: 12,
    color: Palette.textMuted,
  },
  receiptAmount: {
    fontSize: 30,
    fontWeight: '800',
    color: Palette.white,
    marginTop: Spacing.xs,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Palette.cardBorder,
    marginVertical: Spacing.lg,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.xs,
  },
  receiptKey: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  receiptVal: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.white,
  },
});
