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

export default function ChefOrdersScreen({ navigation }: any) {
  const { user, orders, loadOrders, updateOrderStatusRemote } = useStore();
  const [activeTab, setActiveTab] = useState<'running' | 'requests'>('running');

  useEffect(() => {
    // Load all orders for chef to see counts
    loadOrders();
    
    // Poll periodically to catch admin approvals
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const runningOrders = orders.filter((o) => o.status === 'preparing');
  const pendingRequests = orders.filter((o) => o.status === 'accepted');

  const handleStartCooking = (id: string) => {
    updateOrderStatusRemote(id, 'preparing');
    setActiveTab('running');
  };

  const handleFinishCooking = (id: string) => {
    updateOrderStatusRemote(id, 'ready_for_pickup');
  };

  const markPreparing = (id: string) => {
    updateOrderStatusRemote(id, 'preparing');
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
    
    const price = item.totalAmount;
    const isPending = item.status === 'pending';

    return (
      <View style={styles.orderCard}>
        <Image source={{ uri: foodImage }} style={styles.foodImage} resizeMode="cover" />
        <View style={styles.orderInfo}>
          <Text style={styles.categoryTag}>#{food?.category?.name || 'Lunch'}</Text>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.orderId}>ID: {item._id.slice(-6).toUpperCase()}</Text>
          <View style={styles.priceRow}>
            <Text style={styles.price}>Rs.{price}</Text>
          </View>
          <View style={styles.actionRow}>
            {activeTab === 'requests' ? (
               <TouchableOpacity style={[styles.doneBtn, { flex: 1 }]} onPress={() => handleStartCooking(item._id)}>
                 <Text style={styles.doneBtnText}>Start Cooking</Text>
               </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={[styles.doneBtn, { flex: 1 }]} onPress={() => handleFinishCooking(item._id)}>
                  <Text style={styles.doneBtnText}>✅ Ready for Pickup</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => markCancelled(item._id)}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </>
            )}
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
          <Text style={styles.locationLabel}>LOCATION</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={styles.locationName}>{user?.address || 'Plateform Kitchen'}</Text>
            <Ionicons name="chevron-down" size={14} color={NAVY} />
          </View>
        </View>

        <TouchableOpacity style={styles.avatarWrap} onPress={() => navigation?.navigate?.('ChefProfile')}>
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80' }}
            style={styles.avatar}
          />
        </TouchableOpacity>
      </View>

      {/* Stats / Tabs */}
      <View style={styles.statsBg}>
        <View style={styles.statsRow}>
          <TouchableOpacity 
            style={[styles.bigStatBox, activeTab === 'running' && styles.activeTabBox]} 
            onPress={() => setActiveTab('running')}
          >
            <Text style={[styles.bigStatLabel, activeTab === 'running' && { color: ORANGE }]}>ACTIVE COOKING</Text>
            <Text style={[styles.bigNum, activeTab === 'running' && { color: ORANGE }]}>{runningOrders.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.bigStatBox, activeTab === 'requests' && styles.activeTabBox]} 
            onPress={() => setActiveTab('requests')}
          >
            <Text style={[styles.bigStatLabel, activeTab === 'requests' && { color: ORANGE }]}>WAITING REQUESTS</Text>
            <Text style={[styles.bigNum, activeTab === 'requests' && { color: ORANGE }]}>{pendingRequests.length.toString().padStart(2, '0')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Orders list */}
      <View style={styles.listContainer}>
        <Text style={styles.listTitle}>
          {activeTab === 'running' ? `${runningOrders.length} Items being Prepared` : `${pendingRequests.length} Approved Requests`}
        </Text>
        <FlatList
          data={activeTab === 'running' ? runningOrders : pendingRequests}
          keyExtractor={(item) => item._id}
          renderItem={renderOrder}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="checkmark-circle" size={48} color={ORANGE} />
              <Text style={styles.emptyText}>{activeTab === 'running' ? 'All orders done! 🎉' : 'No new requests'}</Text>
            </View>
          }
        />
      </View>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline', screen: 'ChefHome' },
          { icon: 'list-outline', screen: 'ChefOrders', active: true },
          { icon: 'fast-food-outline', screen: 'ChefFoodList' },
          { icon: 'notifications-outline', screen: 'ChefNotifications' },
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
  menuBtn: { padding: 4 },
  locationRow: { flex: 1, alignItems: 'center' },
  locationLabel: { fontSize: 10, fontWeight: '700', color: ORANGE, letterSpacing: 1.2 },
  locationName: { fontSize: 14, fontWeight: '700', color: NAVY },
  avatarWrap: { width: 38, height: 38, borderRadius: 19, overflow: 'hidden' },
  avatar: { width: 38, height: 38, borderRadius: 19 },

  statsBg: { backgroundColor: BG, paddingHorizontal: 20, paddingBottom: 16 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-evenly' },
  bigStatBox: { flex: 1, alignItems: 'center', paddingVertical: 10, borderRadius: 16 },
  activeTabBox: { backgroundColor: 'rgba(255,122,40,0.08)' },
  bigNum: { fontSize: 44, fontWeight: '900', color: NAVY, textAlign: 'center' },
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
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  price: { fontSize: 15, fontWeight: '800', color: NAVY },
  actionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 8 },
  doneBtn: { backgroundColor: ORANGE, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, alignItems: 'center' },
  doneBtnText: { color: WHITE, fontSize: 12, fontWeight: '700' },
  cancelBtn: { borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7, borderWidth: 1.5, borderColor: '#E0E0E0', alignItems: 'center' },
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

