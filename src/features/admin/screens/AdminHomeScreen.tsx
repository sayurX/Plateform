import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY_TEXT = '#9E9E9E';

const POPULAR = [
  {
    name: 'Butter Chicken',
    uri: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80',
    orders: 124,
  },
  {
    name: 'Spring Rolls',
    uri: 'https://images.unsplash.com/photo-1548869190-2a99cf3b5a16?w=300&q=80',
    orders: 98,
  },
];

const TABS = [
  { icon: 'grid-outline',     label: 'Dashboard', screen: 'AdminHome'          },
  { icon: 'list-outline',     label: 'Orders',    screen: 'AdminOrders'        },
  { icon: 'people-outline',   label: 'Users',     screen: 'AdminUsers'         },
  { icon: 'notifications-outline', label: 'Alerts', screen: 'AdminNotifications' },
];

function timeAgo(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}

export default function AdminHomeScreen({ navigation }: any) {
  const { user, orders, loadOrders, users, loadUsers } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadOrders();
    loadUsers();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(0);
      loadOrders();
      loadUsers();
    }, [])
  );

  const totalOrders = orders.length;
  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const userCount = users.length;
  const revenueToday = Math.round(
    orders
      .filter(o => o.status === 'delivered')
      .reduce((acc, o) => acc + o.totalAmount, 0)
  );

  // Build dynamic activity feed from real order events
  const recentActivity = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8)
    .map(o => {
      const customerName = (o.user as any)?.fullName || 'Customer';
      const itemName = o.items?.[0]?.food?.name || 'item';
      switch (o.status) {
        case 'delivered':
          return { icon: 'bag-check', text: `${customerName}'s order delivered`, time: timeAgo(o.createdAt), color: '#2DB87E' };
        case 'out_for_delivery':
          return { icon: 'bicycle', text: `Delivery in progress → ${customerName}`, time: timeAgo(o.createdAt), color: '#A855F7' };
        case 'ready_for_pickup':
          return { icon: 'bag-handle', text: `${itemName} ready for pickup`, time: timeAgo(o.createdAt), color: '#4C8EFF' };
        case 'preparing':
          return { icon: 'flame', text: `Preparing ${itemName} for ${customerName}`, time: timeAgo(o.createdAt), color: ORANGE };
        case 'accepted':
          return { icon: 'checkmark-circle', text: `Order accepted for ${customerName}`, time: timeAgo(o.createdAt), color: '#2DB87E' };
        case 'cancelled':
          return { icon: 'close-circle', text: `Order cancelled by ${customerName}`, time: timeAgo(o.createdAt), color: '#FF4B4B' };
        case 'pending':
        default:
          return { icon: 'time', text: `New order from ${customerName}`, time: timeAgo(o.createdAt), color: '#4C8EFF' };
      }
    });

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.menuBtn} />

        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>ADMIN PANEL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.locationName}>{user?.fullName ?? 'Administrator'}</Text>
            <Ionicons name="chevron-down" size={14} color={NAVY} />
          </View>
        </View>

        {/* Avatar → navigates to AdminProfile */}
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => navigation?.navigate?.('AdminProfile')}
        >
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Row 1 */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation?.navigate?.('AdminOrders')}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>TOTAL ORDERS</Text>
              <Ionicons name="arrow-forward" size={14} color={ORANGE} />
            </View>
            <Text style={styles.statNumber}>{totalOrders}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation?.navigate?.('AdminOrders')}>
            <Text style={styles.statLabel}>PENDING</Text>
            <Text style={styles.statNumber}>{pendingCount}</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Row 2 */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={[styles.statCard, { borderLeftWidth: 3, borderLeftColor: '#4C8EFF' }]}
            onPress={() => navigation?.navigate?.('AdminUsers')}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>TOTAL USERS</Text>
              <Ionicons name="arrow-forward" size={14} color="#4C8EFF" />
            </View>
            <Text style={[styles.statNumber, { color: '#4C8EFF' }]}>{userCount}</Text>
          </TouchableOpacity>
          <View style={[styles.statCard, { borderLeftWidth: 3, borderLeftColor: '#2DB87E' }]}>
            <Text style={styles.statLabel}>TOTAL REVENUE</Text>
            <Text
              style={[styles.statNumber, { color: '#2DB87E', fontSize: 26 }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              Rs.{revenueToday.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Reviews */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Platform Rating</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All Reviews</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewRow}>
            <Ionicons name="star" size={22} color="#FFB800" />
            <Text style={styles.ratingNum}>4.8</Text>
            <Text style={styles.ratingMeta}>  Total 512 Reviews</Text>
          </View>
        </View>

        {/* Popular Items */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Popular Items This Week</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.popularGrid}>
            {POPULAR.map((item, i) => (
              <View key={i} style={styles.popularCard}>
                <Image source={{ uri: item.uri }} style={styles.popularImage} resizeMode="cover" />
                <View style={styles.popularOverlay}>
                  <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                  <Text style={styles.popularOrders}>{item.orders} orders</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'people-outline',      label: 'Users',     color: '#4C8EFF', screen: 'AdminUsers'    },
              { icon: 'fast-food-outline',   label: 'Menu',      color: ORANGE,    screen: 'AdminMenu'     },
              { icon: 'list-outline',        label: 'Orders',    color: '#2DB87E', screen: 'AdminOrders'   },
              { icon: 'cube-outline',        label: 'Stock',     color: '#A855F7', screen: 'AdminInventory' },
              { icon: 'business-outline',    label: 'Vendors',   color: '#4C8EFF', screen: 'AdminSuppliers' },
              { icon: 'trash-outline',       label: 'Waste',     color: '#FF4B4B', screen: 'AdminWasteLog'  },
              { icon: 'bar-chart-outline',   label: 'Reports',   color: '#2DB87E', screen: 'AdminReports'  },
            ].map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.actionBtn, { backgroundColor: a.color }]}
                onPress={() => navigation?.navigate?.(a.screen)}
              >
                <Ionicons name={a.icon as any} size={26} color={WHITE} />
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('AdminOrders')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {recentActivity.length === 0 ? (
            <Text style={{ color: GREY_TEXT, fontSize: 13, textAlign: 'center', paddingVertical: 16 }}>No activity yet</Text>
          ) : (
            recentActivity.map((item, i) => (
              <View key={i} style={[styles.activityRow, i === recentActivity.length - 1 && { borderBottomWidth: 0 }]}>
                <View style={[styles.activityIcon, { backgroundColor: item.color + '20' }]}>
                  <Ionicons name={item.icon as any} size={16} color={item.color} />
                </View>
                <Text style={styles.activityText} numberOfLines={1}>{item.text}</Text>
                <Text style={styles.activityTime}>{item.time}</Text>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
      {/* FAB — Add New Item */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation?.navigate?.('AdminAddItem')}
      >
        <Ionicons name="add" size={28} color={WHITE} />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {TABS.map((tab, i) => {
          const isActive = activeTab === i;
          return (
            <TouchableOpacity
              key={i}
              style={styles.navItem}
              onPress={() => {
                setActiveTab(i);
                if (tab.screen !== 'AdminHome') navigation?.navigate?.(tab.screen);
              }}
            >
              <Ionicons name={tab.icon as any} size={24} color={isActive ? ORANGE : GREY_TEXT} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT_BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: LIGHT_BG,
  },
  menuBtn: { width: 32 },
  locationRow: { flex: 1, alignItems: 'center' },
  locationLabel: { fontSize: 10, fontWeight: '700', color: ORANGE, letterSpacing: 1.2 },
  locationName: { fontSize: 14, fontWeight: '700', color: NAVY },
  avatarWrap: { width: 40, height: 40, borderRadius: 20, overflow: 'hidden' },
  avatar: { width: 40, height: 40 },

  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 20 },

  statsRow: { flexDirection: 'row', gap: 14, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 18,
    paddingVertical: 20,
    paddingHorizontal: 18,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  statNumber: { fontSize: 38, fontWeight: '800', color: NAVY, lineHeight: 46, marginTop: 8 },
  statCardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  statLabel: { fontSize: 10, fontWeight: '700', color: GREY_TEXT, letterSpacing: 0.8, marginTop: 4 },

  card: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 18,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: NAVY },
  seeAll: { fontSize: 13, color: ORANGE, fontWeight: '600' },

  reviewRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  ratingNum: { fontSize: 22, fontWeight: '800', color: NAVY },
  ratingMeta: { fontSize: 13, color: GREY_TEXT },

  popularGrid: { flexDirection: 'row', gap: 12 },
  popularCard: { flex: 1, height: 120, borderRadius: 14, overflow: 'hidden', backgroundColor: LIGHT_BG },
  popularImage: { width: '100%', height: '100%' },
  popularOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.4)', paddingHorizontal: 8, paddingVertical: 6,
  },
  popularName: { color: WHITE, fontWeight: '700', fontSize: 11 },
  popularOrders: { color: 'rgba(255,255,255,0.8)', fontSize: 10, marginTop: 1 },

  activityRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  activityIcon: {
    width: 32, height: 32, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  activityText: { flex: 1, fontSize: 13, color: NAVY, fontWeight: '500' },
  activityTime: { fontSize: 11, color: GREY_TEXT },

  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionBtn: {
    borderRadius: 16,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    gap: 8,
  },
  actionLabel: { color: WHITE, fontWeight: '700', fontSize: 13 },

  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ORANGE,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
    zIndex: 999,
  },

  navbar: {
    position: 'absolute',
    bottom: 20, left: 20, right: 20,
    height: 64,
    backgroundColor: WHITE,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
    paddingHorizontal: 10,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
