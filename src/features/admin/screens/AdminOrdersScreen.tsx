import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore, Order } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';

// Removing local INITIAL_ORDERS array and interface here in favor of global store

export default function AdminOrdersScreen({ navigation }: any) {
  const { user, orders, loadOrders, updateOrderStatusRemote } = useStore();
  const [prevCount, setPrevCount] = useState(0);

  useEffect(() => {
    loadOrders('pending');
    
    // Setup polling every 10s for new orders
    const interval = setInterval(() => {
      loadOrders('pending');
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const deliveredToday = orders.filter((o) => o.status === 'delivered').length;

  useEffect(() => {
    // Notify if new orders arrived
    if (pendingOrders.length > prevCount && prevCount !== 0) {
      Alert.alert('New Order!', 'You have a new order request waiting for approval.');
    }
    setPrevCount(pendingOrders.length);
  }, [pendingOrders.length]);

  const markAccepted = async (id: string) => {
    await updateOrderStatusRemote(id, 'accepted');
  };

  const markCancelled = (id: string) => {
    Alert.alert('Cancel Order', 'Are you sure you want to cancel this order?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => updateOrderStatusRemote(id, 'cancelled') },
    ]);
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const firstItem = item.items?.[0];
    const food = firstItem?.food;
    const foodName = food?.name || 'Multiple Items';
    const foodImage = food?.imageUrl || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&q=80';
    const customerName = item.user?.fullName || 'Customer';

    return (
      <View style={styles.orderCard}>
        <Image source={{ uri: foodImage }} style={styles.foodImage} resizeMode="cover" />
        <View style={styles.orderInfo}>
          <Text style={styles.categoryTag}>#{food?.category?.name || 'Lunch'}</Text>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.orderId}>ID: {item._id.slice(-6).toUpperCase()}  ·  {customerName}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs.{item.totalAmount}</Text>
            <TouchableOpacity style={styles.doneBtn} onPress={() => markAccepted(item._id)}>
              <Text style={styles.doneBtnText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => markCancelled(item._id)}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      {/* Header */}
      <View style={styles.header}>
        <View style={{ width: 32 }} />
        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>ADMIN PANEL</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.locationName}>Order Management</Text>
            <Ionicons name="chevron-down" size={14} color={NAVY} />
          </View>
        </View>
        <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation?.navigate?.('AdminProfile')}>
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsBg}>
        <View style={styles.statsRow}>
          <View style={styles.bigStatBox}>
            <Text style={styles.bigStatLabel}>NEW REQUESTS</Text>
            <Text style={styles.bigNum}>{pendingOrders.length.toString().padStart(2, '0')}</Text>
          </View>
          <View style={styles.bigStatBox}>
            <Text style={styles.bigStatLabel}>COMPLETED TODAY</Text>
            <Text style={styles.bigNum}>{deliveredToday.toString().padStart(2, '0')}</Text>
          </View>
        </View>
      </View>

      {/* Orders list */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>{pendingOrders.length} Running Orders</Text>
        <FlatList
          data={pendingOrders}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle" size={48} color={ORANGE} />
              <Text style={styles.emptyText}>All orders done! 🎉</Text>
            </View>
          }
        />
      </View>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline', screen: 'AdminHome' },
          { icon: 'list-outline', screen: 'AdminOrders', active: true },
          { icon: 'people-outline', screen: 'AdminUsers' },
          { icon: 'notifications-outline', screen: 'AdminNotifications' },
        ].map((tab: any, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigation?.navigate?.(tab.screen)}
          >
            <Ionicons name={tab.icon} size={24} color={tab.active ? ORANGE : GREY} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: BG },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: BG,
  },
  locationRow: { flex: 1, alignItems: 'center' },
  locationLabel: { fontSize: 10, fontWeight: '700', color: ORANGE, letterSpacing: 1.2 },
  locationName: { fontSize: 14, fontWeight: '700', color: NAVY },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden' },
  avatar: { width: 38, height: 38, borderRadius: 19 },

  statsBg: { backgroundColor: BG, paddingHorizontal: 20, paddingBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
  bigStatBox: { flex: 1, alignItems: 'center' },
  bigNum: { fontSize: 52, fontWeight: '900', color: NAVY, lineHeight: 56, textAlign: 'center' },
  bigStatLabel: { fontSize: 10, fontWeight: '700', color: GREY, letterSpacing: 0.8, marginBottom: 2, textAlign: 'center' },

  listContainer: {
    flex: 1,
    backgroundColor: WHITE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listTitle: { fontSize: 18, fontWeight: '800', color: NAVY, marginBottom: 16 },

  orderCard: {
    flexDirection: 'row',
    backgroundColor: WHITE,
    borderRadius: 14,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  foodImage: { width: 90, height: 90, borderRadius: 12 },
  orderInfo: { flex: 1, paddingHorizontal: 12, paddingVertical: 6, justifyContent: 'space-between' },
  categoryTag: { fontSize: 11, fontWeight: '700', color: ORANGE },
  foodName: { fontSize: 14, fontWeight: '700', color: NAVY, marginTop: 2 },
  orderId: { fontSize: 12, color: GREY, marginTop: 1 },
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  price: { fontSize: 15, fontWeight: '800', color: NAVY, marginRight: 4 },
  doneBtn: { backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6 },
  doneBtnText: { color: WHITE, fontSize: 12, fontWeight: '700' },
  cancelBtn: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, borderWidth: 1.5, borderColor: '#E0E0E0' },
  cancelBtnText: { color: NAVY, fontSize: 12, fontWeight: '600' },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: GREY, fontSize: 16 },

  navbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
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
