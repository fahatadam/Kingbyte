import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  Smartphone,
  Wifi,
  Zap,
  Tv,
  GraduationCap,
  Trophy,
  CreditCard,
  Building2,
  ChevronRight,
} from 'lucide-react-native';
import { Card } from '@/components/ui/Card';
import { Palette, Radius, Spacing } from '@/constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ServicesScreen() {
  const insets = useSafeAreaInsets();

  const services = [
    {
      category: 'Telecommunications',
      items: [
        {
          id: 'airtime',
          title: 'Airtime Recharge',
          subtitle: 'Instant discount on MTN, Airtel, Glo, 9mobile',
          icon: Smartphone,
          color: '#FDE047',
          route: '/airtime',
        },
        {
          id: 'data',
          title: 'Internet Data Bundles',
          subtitle: 'SME, Corporate & Gifting data plans',
          icon: Wifi,
          color: Palette.royalBlueLight,
          route: '/data',
        },
      ],
    },
    {
      category: 'Utilities & Bills',
      items: [
        {
          id: 'electricity',
          title: 'Electricity Token',
          subtitle: 'Prepaid & Postpaid for all Nigerian DISCOs',
          icon: Zap,
          color: '#EF4444',
          route: '/electricity',
        },
        {
          id: 'cable',
          title: 'Cable TV Subscription',
          subtitle: 'DStv, GOtv, StarTimes renewal',
          icon: Tv,
          color: Palette.gold,
          route: '/cable',
        },
      ],
    },
    {
      category: 'Finance & Banking',
      items: [
        {
          id: 'wallet',
          title: 'Instant Wallet Funding',
          subtitle: 'Virtual accounts, bank transfer & debit cards',
          icon: CreditCard,
          color: Palette.royalBlue,
          route: '/fund-wallet',
        },
      ],
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerSubtitle}>QUICK UTILITIES</Text>
          <Text style={styles.headerTitle}>Services & Bills</Text>
        </View>

        {services.map((section) => (
          <View key={section.category} style={styles.section}>
            <Text style={styles.categoryTitle}>{section.category}</Text>
            {section.items.map((item) => {
              const IconComp = item.icon;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => router.push(item.route as any)}
                  style={({ pressed }) => [styles.serviceItem, pressed && styles.itemPressed]}>
                  <View style={[styles.iconBox, { backgroundColor: item.color }]}>
                    <IconComp size={22} color="#000000" />
                  </View>
                  <View style={styles.itemTextContainer}>
                    <Text style={styles.itemTitle}>{item.title}</Text>
                    <Text style={styles.itemSub}>{item.subtitle}</Text>
                  </View>
                  <ChevronRight size={18} color={Palette.textMuted} />
                </Pressable>
              );
            })}
          </View>
        ))}
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
    marginBottom: Spacing.xl,
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
  section: {
    marginBottom: Spacing.xl,
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: Spacing.md,
  },
  serviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.midnightSlate,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Palette.cardBorder,
    marginBottom: Spacing.sm,
  },
  itemPressed: {
    borderColor: Palette.royalBlue,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.white,
  },
  itemSub: {
    fontSize: 12,
    color: Palette.textMuted,
    marginTop: 2,
  },
});
