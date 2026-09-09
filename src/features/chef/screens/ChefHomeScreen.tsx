import React, { useState, useCallback } from 'react';
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

const TABS = [
  { icon: 'grid-outline',          label: 'Dashboard', screen: 'ChefHome'          },
  { icon: 'list-outline',          label: 'Orders',    screen: 'ChefOrders'        },
  { icon: 'fast-food-outline',     label: 'Food List', screen: 'ChefFoodList'      },
  { icon: 'notifications-outline', label: 'Alerts',    screen: 'ChefNotifications' },
];

export default function ChefHomeScreen({ navigation }: any) {
  const { user, chefStats, loadChefStats } = useStore();
  const [activeTab, setActiveTab] = useState(0);

  useFocusEffect(
    useCallback(() => {
      setActiveTab(0);
      loadChefStats();
      
      const interval = setInterval(() => {
        loadChefStats();
      }, 5000);
      
      return () => clearInterval(interval);
    }, [loadChefStats])
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.menuBtn} />

        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>LOCATION</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.locationName}>{user?.address || 'Plateform Kitchen'}</Text>
            <Ionicons name="chevron-down" size={14} color={NAVY} />
          </View>
        </View>

        {/* Avatar → navigates to ChefProfile */}
        <TouchableOpacity
          style={styles.avatarWrap}
          onPress={() => navigation?.navigate?.('ChefProfile')}
        >
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation?.navigate?.('ChefOrders')}>
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>ACTIVE COOKING</Text>
              <Ionicons name="arrow-forward" size={14} color={ORANGE} />
            </View>
            <Text style={styles.statNumber}>{chefStats?.runningOrders ?? '0'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation?.navigate?.('ChefOrders')}>
            <Text style={styles.statLabel}>WAITING REQUESTS</Text>
            <Text style={styles.statNumber}>{chefStats?.orderRequests?.toString().padStart(2, '0') ?? '00'}</Text>
          </TouchableOpacity>
        </View>

        {/* Reviews */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Reviews</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All Reviews</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.reviewRow}>
            <Ionicons name="star" size={22} color="#FFB800" />
            <Text style={styles.ratingNum}>{chefStats?.averageRating ?? '4.5'}</Text>
            <Text style={styles.ratingMeta}>  Total {chefStats?.totalReviews ?? '20'} Reviews</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Inventory Actions</Text>
          </View>
          <View style={styles.actionsGrid}>
            {[
              { icon: 'trash-outline', label: 'Waste Log', color: '#FF4B4B', screen: 'AdminWasteLog'  },
              { icon: 'cube-outline',  label: 'Stock View', color: '#A855F7', screen: 'AdminInventory' },
            ].map((a, i) => (
              <TouchableOpacity
                key={i}
                style={[styles.actionBtn, { backgroundColor: a.color }]}
                onPress={() => navigation?.navigate?.(a.screen)}
              >
                <Ionicons name={a.icon as any} size={24} color={WHITE} />
                <Text style={styles.actionLabel}>{a.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular Items */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.sectionTitle}>Popular Items This Week</Text>
            <TouchableOpacity onPress={() => navigation?.navigate?.('ChefFoodList')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.popularGrid}>
            {(chefStats?.popularItems || []).length > 0 ? (
              chefStats?.popularItems.slice(0, 4).map((item: any, i: number) => (
                <View key={i} style={styles.popularCard}>
                  <Image
                    source={{ uri: item.uri || item.imageUrl || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80' }}
                    style={styles.popularImage}
                    resizeMode="cover"
                    onError={() => {}}
                  />
                  <View style={styles.popularOverlay}>
                    <Text style={styles.popularName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.popularOrders}>{item.orders} orders</Text>
                  </View>
                </View>
              ))
            ) : (
              <View style={{flex: 1, height: 80, justifyContent: 'center', alignItems: 'center'}}>
                <Text style={{color: GREY_TEXT}}>No sales data yet</Text>
              </View>
            )}
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

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
                if (tab.screen !== 'ChefHome') navigation?.navigate?.(tab.screen);
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
  statNumber: { fontSize: 38, fontWeight: '800', color: NAVY, lineHeight: 44, marginTop: 6 },
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
  actionsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  actionLabel: { color: WHITE, fontWeight: '700', fontSize: 13 },
});
