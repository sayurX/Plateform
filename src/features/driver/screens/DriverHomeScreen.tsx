import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar, Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getDeliveryMeta } from '@/store/useStore';

// Helper: read from saved order data, fall back to offline calc
const getOrderFee = (o: any): number => o.deliveryFee || getDeliveryMeta(o.deliveryAddress).fee;
const getOrderDist = (o: any): number => o.deliveryDistance || getDeliveryMeta(o.deliveryAddress).distNum;

const GREEN  = '#2DB87E';
const ORANGE = '#FF7A28';
const NAVY   = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';

export default function DriverHomeScreen({ navigation }: any) {
  const { user, logout, orders, loadOrders, updateOrderStatusRemote } = useStore();
  const [online, setOnline] = useState(true);

  useEffect(() => {
    loadOrders(); // Load all orders to calculate stats
  }, []);

  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const preparingOrders = orders.filter(o => o.status === 'ready_for_pickup');
  const incoming = preparingOrders.length > 0 ? preparingOrders[0] : null;

  // Calculate dynamic stats from saved order data
  const todayEarnings = deliveredOrders.reduce((acc, o) => acc + getOrderFee(o), 0);
  const tripsCount = deliveredOrders.length;
  const totalDistance = deliveredOrders.reduce((acc, o) => acc + getOrderDist(o), 0).toFixed(1);

  const handleAccept = async () => {
    if (incoming) {
      await updateOrderStatusRemote(incoming._id, 'out_for_delivery');
      navigation.navigate('DriverDelivery', { orderId: incoming._id });
    }
  };

  const orderMeta = incoming ? { 
    dist: incoming.deliveryDistance ? `${incoming.deliveryDistance.toFixed(1)} km` : getDeliveryMeta(incoming.deliveryAddress).dist,
    time: incoming.deliveryTime ? `~${incoming.deliveryTime} min` : getDeliveryMeta(incoming.deliveryAddress).time,
    fee: getOrderFee(incoming),
  } : null;


  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      {/* Header */}
      <View style={styles.header}>
        {/* Menu Icon Placeholder */}
        <TouchableOpacity style={styles.menuBtn} onPress={() => navigation.navigate('DriverProfile')}>
           <Ionicons name="person-circle-outline" size={28} color={NAVY} />
        </TouchableOpacity>

        <View style={styles.locationRow}>
          <Text style={styles.locationLabel}>DRIVER STATUS</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={styles.locationName}>{user?.fullName || 'Delivery Partner'}</Text>
          </View>
        </View>

        {/* Online Toggle & Avatar */}
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={[styles.statusToggle, { backgroundColor: online ? GREEN : '#8E8E93' }]}
            onPress={() => setOnline((v) => !v)}
          >
            <View style={[styles.dot, { left: online ? 22 : 2 }]} />
          </TouchableOpacity>
          <Image
            source={{ uri: user?.avatarUrl || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80' }}
            style={styles.avatar}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Earnings Summary */}
        <View style={styles.earningsCard}>
          <Text style={styles.earningsLabel}>Your Total Earnings (Est.)</Text>
          <Text style={styles.earningsValue}>Rs.{todayEarnings.toFixed(2)}</Text>
          <View style={styles.earningsRow}>
            {[
              { label: 'Trips',    value: tripsCount.toString() },
              { label: 'Distance', value: `${totalDistance} km` },
              { label: 'Online',   value: online ? 'Online Now' : 'Offline' },
            ].map((e, i) => (
              <View key={i} style={styles.earningsItem}>
                <Text style={styles.earnItemValue}>{e.value}</Text>
                <Text style={styles.earnItemLabel}>{e.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Map Placeholder */}
        <View style={styles.mapBox}>
          <Ionicons name="map" size={56} color="#C0CDD8" />
          <Text style={styles.mapLabel}>Live map coming soon</Text>
        </View>

        {/* Delivery Request */}
        <Text style={styles.sectionTitle}>
          {online ? 'Incoming Delivery' : 'You are Offline'}
        </Text>

        {online ? (
          incoming ? (
            <View style={styles.deliveryCard}>
              <View style={styles.deliveryHeader}>
                <View style={styles.newBadge}>
                  <Ionicons name="flash" size={14} color={WHITE} />
                  <Text style={styles.newText}>READY</Text>
                </View>
                <Text style={styles.deliveryNew}>{incoming.items?.[0]?.food?.name || 'Order Request'}</Text>
              </View>

              {[
                { 
                  icon: 'storefront-outline',  
                  label: 'PICKUP FROM',   
                  value: incoming.pickupLocation || 'Sulthan Palace, Dr. C.W.W. Kannangara Mawatha' 
                },
                { 
                  icon: 'location-outline',    
                  label: 'DROP OFF TO', 
                  value: `${incoming.user?.fullName ? incoming.user.fullName + ' · ' : ''}${incoming.deliveryAddress || 'Customer Location'}` 
                },
              ].map((r, i) => (
                <View key={i} style={styles.routeRow}>
                  <View style={[styles.routeIcon, { backgroundColor: i === 0 ? ORANGE + '15' : GREEN + '15' }]}>
                    <Ionicons name={r.icon as any} size={18} color={i === 0 ? ORANGE : GREEN} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.routeLabel}>{r.label}</Text>
                    <Text style={styles.routeValue} numberOfLines={1}>{r.value}</Text>
                  </View>
                </View>
              ))}

              <View style={styles.deliveryMeta}>
                <View style={[styles.metaChip, { backgroundColor: GREEN + '08' }]}>
                  <Text style={[styles.metaTag, { color: GREEN }]}>EARNING</Text>
                  <Text style={[styles.metaValue, { color: GREEN }]}>Rs.{orderMeta?.fee || '0'}</Text>
                  <Text style={[styles.metaSub, { color: GREEN }]}>Estimated</Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: '#4C8EFF08' }]}>
                  <Text style={[styles.metaTag, { color: '#4C8EFF' }]}>DISTANCE</Text>
                  <Text style={[styles.metaValue, { color: '#4C8EFF' }]}>{orderMeta?.dist || '2.4 km'}</Text>
                  <Text style={[styles.metaSub, { color: '#4C8EFF' }]}>Route</Text>
                </View>
                <View style={[styles.metaChip, { backgroundColor: ORANGE + '08' }]}>
                  <Text style={[styles.metaTag, { color: ORANGE }]}>TIME</Text>
                  <Text style={[styles.metaValue, { color: ORANGE }]}>{orderMeta?.time || '~8 min'}</Text>
                  <Text style={[styles.metaSub, { color: ORANGE }]}>Est. Arrival</Text>
                </View>
              </View>

              <View style={styles.deliveryBtns}>
                <TouchableOpacity style={styles.declineBtn}>
                  <Text style={styles.declineBtnText}>Decline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.acceptBtn]}
                  onPress={handleAccept}
                >
                  <Text style={styles.acceptBtnText}>Accept & Pickup</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View>
              {/* Waiting pulse indicator */}
              <View style={styles.waitingCard}>
                <View style={styles.waitingLeft}>
                  <View style={styles.pulseOuter}>
                    <View style={styles.pulseInner} />
                  </View>
                  <View>
                    <Text style={styles.waitingTitle}>Waiting for orders</Text>
                    <Text style={styles.waitingSubtitle}>You'll be notified instantly</Text>
                  </View>
                </View>
                <Ionicons name="notifications-outline" size={22} color={ORANGE} />
              </View>

              {/* Income Summary Section */}
              {deliveredOrders.length > 0 && (
                <>
                  <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Income Summary</Text>

                  {/* Summary Stats */}
                  <View style={styles.incomeSummaryRow}>
                    <View style={[styles.incomeStatBox, { backgroundColor: GREEN + '12' }]}>
                      <Ionicons name="cash-outline" size={20} color={GREEN} />
                      <Text style={[styles.incomeStatValue, { color: GREEN }]}>
                        Rs.{todayEarnings.toFixed(0)}
                      </Text>
                      <Text style={styles.incomeStatLabel}>Total Earned</Text>
                    </View>
                    <View style={[styles.incomeStatBox, { backgroundColor: '#4C8EFF12' }]}>
                      <Ionicons name="bicycle-outline" size={20} color="#4C8EFF" />
                      <Text style={[styles.incomeStatValue, { color: '#4C8EFF' }]}>
                        {tripsCount}
                      </Text>
                      <Text style={styles.incomeStatLabel}>Deliveries</Text>
                    </View>
                    <View style={[styles.incomeStatBox, { backgroundColor: ORANGE + '12' }]}>
                      <Ionicons name="navigate-outline" size={20} color={ORANGE} />
                      <Text style={[styles.incomeStatValue, { color: ORANGE }]}>
                        {totalDistance} km
                      </Text>
                      <Text style={styles.incomeStatLabel}>Total Distance</Text>
                    </View>
                  </View>

                  {/* Recent Deliveries */}
                  <Text style={[styles.sectionTitle, { marginTop: 20, fontSize: 14 }]}>Recent Deliveries</Text>
                  {deliveredOrders.slice(0, 4).map((o, i) => {
                    const customer = (o.user as any);
                    const earned = getOrderFee(o).toFixed(2);
                    return (
                      <View key={o._id} style={styles.recentCard}>
                        <View style={styles.recentLeft}>
                          <View style={[styles.recentIcon, { backgroundColor: i % 2 === 0 ? GREEN + '15' : ORANGE + '15' }]}>
                            <Ionicons name="checkmark-circle" size={20} color={i % 2 === 0 ? GREEN : ORANGE} />
                          </View>
                          <View style={{ flex: 1 }}>
                            <Text style={styles.recentName} numberOfLines={1}>
                              {o.items?.[0]?.food?.name || 'Order'}
                              {o.items?.length > 1 ? ` +${o.items.length - 1}` : ''}
                            </Text>
                            <Text style={styles.recentAddr} numberOfLines={1}>
                              {customer?.fullName ? customer.fullName + ' · ' : ''}{o.deliveryAddress || 'Delivered'}
                            </Text>
                          </View>
                        </View>
                        <View style={styles.recentRight}>
                          <Text style={styles.recentEarned}>+Rs.{earned}</Text>
                          <Text style={styles.recentDist}>{getOrderDist(o).toFixed(1)} km</Text>
                        </View>
                      </View>
                    );
                  })}
                </>
              )}
            </View>
          )
        ) : (
          <View style={styles.offlineBox}>
            <Ionicons name="moon-outline" size={48} color={GREY} />
            <Text style={styles.offlineText}>Go online to receive delivery requests</Text>
            <TouchableOpacity style={styles.goOnlineBtn} onPress={() => setOnline(true)}>
              <Text style={styles.goOnlineText}>Go Online</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Bottom Nav to match other dashboards */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',          screen: 'DriverHome' },
          { icon: 'list-outline',          screen: 'DriverOrders' },
          { icon: 'wallet-outline',        screen: 'DriverWallet' },
          { icon: 'person-outline',        screen: 'DriverProfile' },
        ].map((tab: any, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigation.navigate(tab.screen)}
          >
            <Ionicons name={tab.icon} size={24} color={i === 0 ? ORANGE : GREY} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: LIGHT_BG },
  header:          { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: LIGHT_BG 
  },
  menuBtn:         { width: 44, height: 44, borderRadius: 22, backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center' },
  locationRow:     { alignItems: 'center' },
  locationLabel:   { fontSize: 10, color: ORANGE, fontWeight: '800', letterSpacing: 0.5, marginBottom: 2 },
  locationName:    { fontSize: 14, color: NAVY, fontWeight: '700' },
  headerRight:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar:          { width: 40, height: 40, borderRadius: 20 },
  
  statusToggle:    { width: 44, height: 24, borderRadius: 12, justifyContent: 'center' },
  dot:             { position: 'absolute', width: 18, height: 18, borderRadius: 9, backgroundColor: '#fff', top: 3 },
  
  scroll:          { padding: 20, paddingBottom: 110 },
  earningsCard:    { backgroundColor: NAVY, borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: NAVY, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8 },
  earningsLabel:   { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500' },
  earningsValue:   { color: '#fff', fontSize: 36, fontWeight: '800', marginVertical: 8 },
  earningsRow:     { flexDirection: 'row', borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.15)', paddingTop: 16, marginTop: 8 },
  earningsItem:    { flex: 1, alignItems: 'center' },
  earnItemValue:   { color: '#fff', fontWeight: '800', fontSize: 16 },
  earnItemLabel:   { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2 },
  
  mapBox:          { backgroundColor: WHITE, borderRadius: 20, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 24 },
  mapLabel:        { color: GREY, marginTop: 8, fontWeight: '500' },
  
  sectionTitle:    { fontSize: 16, fontWeight: '800', color: NAVY, marginBottom: 14 },
  
  deliveryCard:    { backgroundColor: WHITE, borderRadius: 24, padding: 20, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 15, elevation: 4 },
  deliveryHeader:  { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 20 },
  newBadge:        { backgroundColor: ORANGE, flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  newText:         { color: WHITE, fontWeight: '900', fontSize: 10 },
  deliveryNew:     { color: NAVY, fontWeight: '800', fontSize: 16, flex: 1 },
  
  routeRow:        { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 18 },
  routeIcon:       { width: 42, height: 42, borderRadius: 21, justifyContent: 'center', alignItems: 'center' },
  routeLabel:      { fontSize: 10, color: GREY, fontWeight: '800', marginBottom: 2, letterSpacing: 0.2 },
  routeValue:      { fontSize: 14, fontWeight: '700', color: NAVY },
  
  deliveryMeta:    { flexDirection: 'row', gap: 10, marginVertical: 20, borderTopWidth: 1, borderTopColor: '#F5F5F5', paddingTop: 20 },
  metaChip:        { flex: 1, alignItems: 'center', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 4 },
  metaTag:         { fontSize: 9, fontWeight: '900', marginBottom: 4, letterSpacing: 0.5 },
  metaValue:       { fontWeight: '800', fontSize: 15, marginBottom: 2 },
  metaSub:         { fontSize: 9, fontWeight: '600', opacity: 0.8 },
  
  deliveryBtns:    { flexDirection: 'row', gap: 12, marginTop: 4 },
  declineBtn:      { flex: 1, borderWidth: 1.5, borderColor: '#F0F0F0', borderRadius: 16, paddingVertical: 16, alignItems: 'center' },
  declineBtnText:  { fontWeight: '700', color: GREY },
  acceptBtn:       { flex: 2, backgroundColor: ORANGE, borderRadius: 16, paddingVertical: 16, alignItems: 'center', shadowColor: ORANGE, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  acceptBtnText:   { color: WHITE, fontWeight: '800', fontSize: 16 },
  
  offlineBox:      { backgroundColor: WHITE, borderRadius: 20, padding: 40, alignItems: 'center' },
  offlineText:     { color: GREY, textAlign: 'center', marginTop: 12, marginBottom: 24, fontWeight: '500', lineHeight: 20 },
  goOnlineBtn:     { backgroundColor: GREEN, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 14 },
  goOnlineText:    { color: WHITE, fontWeight: '800', fontSize: 15 },

  // Waiting card
  waitingCard:     { backgroundColor: WHITE, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 },
  waitingLeft:     { flexDirection: 'row', alignItems: 'center', gap: 14 },
  pulseOuter:      { width: 38, height: 38, borderRadius: 19, backgroundColor: ORANGE + '20', justifyContent: 'center', alignItems: 'center' },
  pulseInner:      { width: 18, height: 18, borderRadius: 9, backgroundColor: ORANGE },
  waitingTitle:    { fontSize: 14, fontWeight: '800', color: NAVY },
  waitingSubtitle: { fontSize: 11, color: GREY, marginTop: 2 },

  // Income summary
  incomeSummaryRow: { flexDirection: 'row', gap: 10 },
  incomeStatBox:    { flex: 1, alignItems: 'center', borderRadius: 18, paddingVertical: 16, gap: 4 },
  incomeStatValue:  { fontSize: 18, fontWeight: '900' },
  incomeStatLabel:  { fontSize: 10, fontWeight: '700', color: GREY, letterSpacing: 0.3 },

  // Recent deliveries
  recentCard:    { backgroundColor: WHITE, borderRadius: 16, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 6, elevation: 1 },
  recentLeft:    { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  recentIcon:    { width: 38, height: 38, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  recentName:    { fontSize: 13, fontWeight: '700', color: NAVY },
  recentAddr:    { fontSize: 11, color: GREY, marginTop: 2 },
  recentRight:   { alignItems: 'flex-end', gap: 2 },
  recentEarned:  { fontSize: 14, fontWeight: '800', color: GREEN },
  recentDist:    { fontSize: 11, color: GREY },


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
