import React, { useState, useEffect, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

const ORANGE   = '#FF7A28';
const NAVY     = '#1C1C2E';
const WHITE    = '#FFFFFF';
const GREY     = '#9E9E9E';
const LIGHT_BG = '#F2F3F7';

type Period = 'Today' | 'Week' | 'Month';

const BAR_LABELS: Record<Period, string[]> = {
  Today: ['9am', '11am', '1pm', '3pm', '5pm', '7pm', '9pm'],
  Week:  ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  Month: ['W1',  'W2',  'W3',  'W4',  'W5',  'W6',  'W7'],
};

const getStartOf = (period: Period): Date => {
  const now = new Date();
  if (period === 'Today') {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (period === 'Week') {
    const d = new Date(now);
    d.setDate(now.getDate() - now.getDay());
    d.setHours(0, 0, 0, 0);
    return d;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

const getBucketIndex = (date: Date, period: Period): number => {
  const now = new Date();
  if (period === 'Today') {
    const hr = date.getHours();
    if (hr < 10) return 0;
    if (hr < 12) return 1;
    if (hr < 14) return 2;
    if (hr < 16) return 3;
    if (hr < 18) return 4;
    if (hr < 20) return 5;
    return 6;
  }
  if (period === 'Week') return date.getDay(); // 0=Sun…6=Sat
  const weekOfMonth = Math.min(Math.floor((date.getDate() - 1) / 7), 6);
  return weekOfMonth;
};

export default function AdminReportsScreen({ navigation }: any) {
  const { orders, loadOrders } = useStore();
  const [period,  setPeriod]  = useState<Period>('Today');
  const [loading, setLoading] = useState(true);

  useFocusEffect(useCallback(() => {
    (async () => { setLoading(true); await loadOrders(); setLoading(false); })();
  }, []));

  // Filter orders by selected period
  const periodOrders = useMemo(() => {
    const start = getStartOf(period);
    return orders.filter(o => new Date(o.createdAt) >= start);
  }, [orders, period]);

  const deliveredOrders = useMemo(() => periodOrders.filter(o => o.status === 'delivered'), [periodOrders]);
  const revenue  = useMemo(() => deliveredOrders.reduce((acc, o) => acc + o.totalAmount, 0), [deliveredOrders]);
  const avgOrder = deliveredOrders.length > 0 ? (revenue / deliveredOrders.length).toFixed(1) : '0';

  // Bar chart buckets — count orders per time bucket
  const bars = useMemo(() => {
    const buckets = new Array(7).fill(0);
    periodOrders.forEach(o => {
      const idx = getBucketIndex(new Date(o.createdAt), period);
      if (idx >= 0 && idx < 7) buckets[idx] += o.totalAmount;
    });
    return buckets;
  }, [periodOrders, period]);

  const maxBar = Math.max(...bars, 1);

  // Top selling items
  const topItems = useMemo(() => {
    const stats: Record<string, { name: string; orders: number; revenue: number; chef: string }> = {};
    deliveredOrders.forEach(order => {
      order.items.forEach(item => {
        const name = item.food?.name || 'Unknown Item';
        if (!stats[name]) stats[name] = { name, orders: 0, revenue: 0, chef: item.food?.chef || 'Main Kitchen' };
        stats[name].orders  += item.quantity;
        stats[name].revenue += item.price * item.quantity;
      });
    });
    return Object.values(stats).sort((a, b) => b.orders - a.orders).slice(0, 5).map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [deliveredOrders]);

  // Chef performance
  const chefPerformance = useMemo(() => {
    const stats: Record<string, { name: string; orders: number; rating: number }> = {};
    deliveredOrders.forEach(order => {
      const chef = order.items?.[0]?.food?.chef || 'Main Kitchen';
      if (!stats[chef]) stats[chef] = { name: chef, orders: 0, rating: 4.9 };
      stats[chef].orders += 1;
    });
    return Object.values(stats).sort((a, b) => b.orders - a.orders);
  }, [deliveredOrders]);

  const labels = BAR_LABELS[period];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reports & Analytics</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period selector */}
        <View style={styles.periodRow}>
          {(['Today', 'Week', 'Month'] as Period[]).map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Text style={[styles.periodBtnText, period === p && styles.periodBtnTextActive]}>
                {p}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Cards */}
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { borderLeftColor: ORANGE }]}>
            <Text style={styles.kpiLabel}>TOTAL REVENUE</Text>
            <Text style={styles.kpiValue}>Rs.{revenue.toLocaleString()}</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#4C8EFF' }]}>
            <Text style={styles.kpiLabel}>TOTAL ORDERS</Text>
            <Text style={[styles.kpiValue, { color: '#4C8EFF' }]}>{orders.length}</Text>
          </View>
        </View>
        <View style={styles.kpiRow}>
          <View style={[styles.kpiCard, { borderLeftColor: '#2DB87E' }]}>
            <Text style={styles.kpiLabel}>DELIVERED</Text>
            <Text style={[styles.kpiValue, { color: '#2DB87E' }]}>{deliveredOrders.length}</Text>
          </View>
          <View style={[styles.kpiCard, { borderLeftColor: '#A855F7' }]}>
            <Text style={styles.kpiLabel}>AVG ORDER</Text>
            <Text style={[styles.kpiValue, { color: '#A855F7' }]}>Rs.{avgOrder}</Text>
          </View>
        </View>

        {/* Bar Chart */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revenue Overview</Text>
          <View style={styles.chartArea}>
            {bars.map((val: number, i: number) => {
              const heightPct = (val / maxBar) * 100;
              return (
                <View key={i} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: `${heightPct}%` as any,
                          backgroundColor: i === bars.indexOf(maxBar) ? ORANGE : ORANGE + '55',
                        },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{labels[i]}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Items Table */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Top Selling Items</Text>

          {/* Table header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.thCell, { flex: 0.4 }]}>#</Text>
            <Text style={[styles.thCell, { flex: 2 }]}>Item</Text>
            <Text style={[styles.thCell, { flex: 1, textAlign: 'right' }]}>Orders</Text>
            <Text style={[styles.thCell, { flex: 1.2, textAlign: 'right' }]}>Revenue</Text>
          </View>

          {topItems.map((item) => (
            <View key={item.name} style={styles.tableRow}>
              <View style={[styles.rankCircle, item.rank <= 3 && styles.rankCircleTop]}>
                <Text style={[styles.rankText, item.rank <= 3 && styles.rankTextTop]}>
                  {item.rank}
                </Text>
              </View>
              <View style={{ flex: 2 }}>
                <Text style={styles.itemName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.itemChef}>{item.chef}</Text>
              </View>
              <Text style={[styles.tdCell, { flex: 1, textAlign: 'right' }]}>{item.orders}</Text>
              <Text style={[styles.tdCell, { flex: 1.2, textAlign: 'right', color: '#2DB87E', fontWeight: '700' }]}>
                Rs.{item.revenue.toLocaleString()}
              </Text>
            </View>
          ))}
          {topItems.length === 0 && (
            <Text style={{ textAlign: 'center', color: GREY, marginVertical: 20 }}>No items sold yet.</Text>
          )}
        </View>

        {/* Chef Performance */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Chef Performance</Text>
          {chefPerformance.map((c, i) => (
            <View key={i} style={styles.chefRow}>
              <View style={styles.chefAvatarCircle}>
                <Text style={styles.chefInitial}>{c.name[0]}</Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.chefRowTop}>
                  <Text style={styles.chefName}>{c.name}</Text>
                  <View style={styles.ratingPill}>
                    <Ionicons name="star" size={11} color="#FFB800" />
                    <Text style={styles.ratingPillText}>{c.rating}</Text>
                  </View>
                </View>
                <Text style={styles.chefOrders}>{c.orders} successful deliveries</Text>
                <View style={styles.progressTrack}>
                  <View style={[styles.progressBar, { width: `${Math.min(c.orders * 10, 100)}%` as any }]} />
                </View>
              </View>
            </View>
          ))}
          {chefPerformance.length === 0 && (
             <Text style={{ textAlign: 'center', color: GREY, marginVertical: 10 }}>No chef activity yet.</Text>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',          screen: 'AdminHome' },
          { icon: 'list-outline',          screen: 'AdminOrders' },
          { icon: 'people-outline',        screen: 'AdminUsers' },
          { icon: 'notifications-outline', screen: 'AdminNotifications' },
        ].map((tab: any, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigation?.navigate?.(tab.screen)}
          >
            <Ionicons name={tab.icon} size={24} color={GREY} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT_BG },

  header: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14,
    backgroundColor: LIGHT_BG,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: NAVY },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 4 },

  periodRow: {
    flexDirection: 'row', gap: 8,
    marginBottom: 16,
  },
  periodBtn: {
    flex: 1, paddingVertical: 10, borderRadius: 20,
    backgroundColor: WHITE, alignItems: 'center',
    shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  periodBtnActive: { backgroundColor: ORANGE },
  periodBtnText: { fontSize: 13, fontWeight: '600', color: GREY },
  periodBtnTextActive: { color: WHITE },

  kpiRow: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  kpiCard: {
    flex: 1, backgroundColor: WHITE, borderRadius: 16,
    paddingVertical: 18, paddingHorizontal: 16,
    borderLeftWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  kpiLabel: { fontSize: 10, fontWeight: '700', color: GREY, letterSpacing: 0.8, marginBottom: 6 },
  kpiValue: { fontSize: 24, fontWeight: '900', color: NAVY },

  card: {
    backgroundColor: WHITE, borderRadius: 18,
    padding: 18, marginBottom: 14,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, elevation: 2,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: NAVY, marginBottom: 16 },

  // Bar chart
  chartArea: {
    flexDirection: 'row', alignItems: 'flex-end',
    height: 140, gap: 6,
  },
  barCol: { flex: 1, alignItems: 'center' },
  barTrack: {
    flex: 1, width: '100%',
    backgroundColor: LIGHT_BG, borderRadius: 6,
    justifyContent: 'flex-end', overflow: 'hidden',
  },
  bar: { width: '100%', borderRadius: 6 },
  barLabel: { fontSize: 9, color: GREY, marginTop: 5, fontWeight: '600' },

  // Table
  tableHeader: {
    flexDirection: 'row', alignItems: 'center',
    paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
    marginBottom: 8,
  },
  thCell: { fontSize: 10, fontWeight: '700', color: GREY, letterSpacing: 0.5 },

  tableRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F8F8F8',
    gap: 8,
  },
  rankCircle: {
    width: 26, height: 26, borderRadius: 13,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center', alignItems: 'center',
    flex: 0.4,
  },
  rankCircleTop: { backgroundColor: ORANGE },
  rankText: { fontSize: 12, fontWeight: '800', color: GREY },
  rankTextTop: { color: WHITE },
  itemName: { fontSize: 13, fontWeight: '700', color: NAVY },
  itemChef: { fontSize: 11, color: GREY, marginTop: 1 },
  tdCell: { fontSize: 13, color: NAVY },

  // Chef performance
  chefRow: {
    flexDirection: 'row', alignItems: 'flex-start',
    paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0',
  },
  chefAvatarCircle: {
    width: 42, height: 42, borderRadius: 21,
    backgroundColor: ORANGE + '20',
    justifyContent: 'center', alignItems: 'center',
  },
  chefInitial: { fontSize: 16, fontWeight: '800', color: ORANGE },
  chefRowTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 },
  chefName: { fontSize: 14, fontWeight: '700', color: NAVY },
  ratingPill: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#FFF8E1', borderRadius: 20,
    paddingHorizontal: 8, paddingVertical: 3,
  },
  ratingPillText: { fontSize: 11, fontWeight: '700', color: '#E6A800' },
  chefOrders: { fontSize: 11, color: GREY, marginBottom: 8 },
  progressTrack: {
    height: 6, backgroundColor: LIGHT_BG, borderRadius: 3, overflow: 'hidden',
  },
  progressBar: {
    height: '100%', backgroundColor: ORANGE, borderRadius: 3,
  },

  navbar: {
    position: 'absolute',
    bottom: 20, left: 20, right: 20,
    height: 64,
    backgroundColor: WHITE, borderRadius: 32,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly',
    shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, elevation: 12,
    paddingHorizontal: 10,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
