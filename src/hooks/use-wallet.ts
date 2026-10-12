import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from './use-auth';
import type { Database } from '@/types/database.types';

export type Wallet = Database['public']['Tables']['wallets']['Row'];
export type Transaction = Database['public']['Tables']['transactions']['Row'];

export function useWallet() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    if (!user?.id) {
      setWallet(null);
      setTransactions([]);
      setLoading(false);
      return;
    }

    try {
      const [walletRes, txRes] = await Promise.all([
        supabase
          .from('wallets')
          .select('*')
          .eq('user_id', user.id)
          .maybeSingle(),
        supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20),
      ]);

      if (walletRes.data) {
        setWallet(walletRes.data);
      }
      if (txRes.data) {
        setTransactions(txRes.data);
      }
    } catch (e) {
      console.error('[useWallet] Error fetching wallet data:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refresh = async () => {
    setRefreshing(true);
    await fetchData();
  };

  return {
    wallet,
    transactions,
    loading,
    refreshing,
    refresh,
  };
}
