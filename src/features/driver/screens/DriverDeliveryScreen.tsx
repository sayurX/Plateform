import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, StatusBar, Linking, Alert, ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore, getDeliveryMeta } from '@/store/useStore';

const GREEN   = '#2DB87E';
const ORANGE  = '#FF7A28';
const NAVY    = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE   = '#FFFFFF';
const GREY    = '#9E9E9E';
const RED     = '#FF4D4F';

export default function DriverDeliveryScreen({ navigation, route }: any) {
  const { orderId } = route.params as { orderId: string };
  const { orders, updateOrderStatusRemote, loadOrders } = useStore();
  const [completing, setCompleting] = useState(false);

  const order = orders.find(o => o._id === orderId);

  if (!order) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <View style={styles.center}>
          <Ionicons name="warning-outline" size={48} color={GREY} />
          <Text style={styles.emptyText}>Order not found.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const customer = order.user as any;
  const customerName  = customer?.fullName  || 'Unknown Customer';
  const customerPhone = customer?.phone     || null;
  const customerEmail = customer?.email     || null;
  const deliveryAddr  = order.deliveryAddress || 'Customer Location';

  const openGoogleMaps = () => {
    const encodedAddress = encodeURIComponent(deliveryAddr);
    // Explicitly navigate FROM Sulthan Palace (Plateform Location)
    const encodedOrigin = encodeURIComponent("6.914604,79.8650047");
    const url = `https://www.google.com/maps/dir/?api=1&origin=${encodedOrigin}&destination=${encodedAddress}&travelmode=driving`;
    Linking.openURL(url).catch(() =>
      Alert.alert('Error', 'Could not open Google Maps.')
    );
  };

  const callCustomer = () => {
    if (!customerPhone) {
      Alert.alert('No Phone', 'Customer has not provided a phone number.');
      return;
    }
    Linking.openURL(`tel:${customerPhone}`);
  };

  const handleCompleteDelivery = async () => {
    Alert.alert(
      'Complete Delivery',
      'Confirm that the order has been delivered to the customer?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'default',
          onPress: async () => {
            setCompleting(true);
            try {
              await updateOrderStatusRemote(order._id, 'delivered');
              await loadOrders();
              Alert.alert('Delivered! 🎉', 'Order marked as delivered.', [
                { text: 'OK', onPress: () => navigation.navigate('DriverHome') }
              ]);
            } catch (e) {
              Alert.alert('Error', 'Failed to complete delivery. Please try again.');
            } finally {
              setCompleting(false);
            }
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backCircle} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={20} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Active Delivery</Text>
        <View style={styles.statusBadge}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>En Route</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Navigate Button */}
        {/* Navigate Button */}
        <TouchableOpacity style={styles.mapBtn} onPress={openGoogleMaps} activeOpacity={0.85}>
          <View style={styles.mapBtnLeft}>
            <View style={styles.mapIconBox}>
              <Ionicons name="navigate" size={24} color={WHITE} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.mapBtnTitle}>Open Navigation</Text>
              <Text style={styles.mapBtnSub} numberOfLines={1}>{deliveryAddr}</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 12 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="map-outline" size={14} color={ORANGE} />
                  <Text style={{ color: WHITE, fontSize: 12, fontWeight: '600' }}>Sulthan Palace to Customer</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="bicycle-outline" size={14} color={GREEN} />
                  <Text style={{ color: WHITE, fontSize: 12, fontWeight: '800' }}>
                    {order.deliveryDistance ? `${order.deliveryDistance.toFixed(1)} km` : getDeliveryMeta(deliveryAddr).dist}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Ionicons name="time-outline" size={14} color={'#4C8EFF'} />
                  <Text style={{ color: WHITE, fontSize: 12, fontWeight: '800' }}>
                    {order.deliveryTime ? `~${order.deliveryTime} min` : getDeliveryMeta(deliveryAddr).time}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={WHITE} />
        </TouchableOpacity>

        {/* Customer Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="person-circle-outline" size={20} color={NAVY} />
            <Text style={styles.cardTitle}>Customer Details</Text>
          </View>

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="person-outline" size={16} color={ORANGE} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Full Name</Text>
              <Text style={styles.detailValue}>{customerName}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="location-outline" size={16} color={GREEN} />
            </View>
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Delivery Address</Text>
              <Text style={styles.detailValue}>{deliveryAddr}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.detailRow}>
            <View style={styles.detailIcon}>
              <Ionicons name="call-outline" size={16} color={'#4C8EFF'} />
            </View>
            <View style={[styles.detailContent, { flex: 1 }]}>
              <Text style={styles.detailLabel}>Phone</Text>
              <Text style={styles.detailValue}>{customerPhone || 'Not provided'}</Text>
            </View>
            <TouchableOpacity style={styles.callBtn} onPress={callCustomer}>
              <Ionicons name="call" size={14} color={WHITE} />
              <Text style={styles.callBtnText}>Call</Text>
            </TouchableOpacity>
          </View>

          {customerEmail && (
            <>
              <View style={styles.divider} />
              <View style={styles.detailRow}>
                <View style={styles.detailIcon}>
                  <Ionicons name="mail-outline" size={16} color={GREY} />
                </View>
                <View style={styles.detailContent}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{customerEmail}</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* Order Items Card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="fast-food-outline" size={20} color={NAVY} />
            <Text style={styles.cardTitle}>Order Items</Text>
            <View style={styles.totalBadge}>
              <Text style={styles.totalBadgeText}>Rs.{order.totalAmount}</Text>
            </View>
          </View>

          {order.items?.map((item: any, i: number) => (
            <React.Fragment key={i}>
              {i > 0 && <View style={styles.divider} />}
              <View style={styles.itemRow}>
                <View style={styles.qtyBadge}>
                  <Text style={styles.qtyText}>{item.quantity}x</Text>
                </View>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.food?.name || 'Item'}</Text>
                  {item.size ? (
                    <Text style={styles.itemSub}>{item.size}</Text>
                  ) : null}
                </View>
                <Text style={styles.itemPrice}>Rs.{item.price * item.quantity}</Text>
              </View>
            </React.Fragment>
          ))}

          <View style={[styles.divider, { marginVertical: 12 }]} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Amount</Text>
            <Text style={styles.totalValue}>Rs.{order.totalAmount}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Your Earning (Est.)</Text>
            <Text style={[styles.totalValue, { color: GREEN }]}>
              Rs.{(order.deliveryFee || getDeliveryMeta(deliveryAddr).fee).toFixed(2)}
            </Text>
          </View>
        </View>

      </ScrollView>

      {/* Complete Delivery Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.completeBtn, completing && { opacity: 0.7 }]}
          onPress={handleCompleteDelivery}
          disabled={completing}
          activeOpacity={0.85}
        >
          {completing ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={22} color={WHITE} />
              <Text style={styles.completeBtnText}>Complete Delivery</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:           { flex: 1, backgroundColor: LIGHT_BG },
  center:         { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyText:      { color: GREY, fontSize: 16, fontWeight: '600' },
  backBtn:        { backgroundColor: ORANGE, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 8 },
  backBtnText:    { color: WHITE, fontWeight: '700' },

  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 20, paddingVertical: 16, backgroundColor: LIGHT_BG,
  },
  backCircle:    { width: 40, height: 40, borderRadius: 20, backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center' },
  headerTitle:   { flex: 1, fontSize: 18, fontWeight: '800', color: NAVY },
  statusBadge:   { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: GREEN + '15', borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6 },
  statusDot:     { width: 8, height: 8, borderRadius: 4, backgroundColor: GREEN },
  statusText:    { color: GREEN, fontWeight: '700', fontSize: 12 },

  scroll: { padding: 20, paddingBottom: 120 },

  mapBtn: {
    backgroundColor: NAVY, borderRadius: 20, padding: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 20, shadowColor: NAVY, shadowOpacity: 0.25, shadowRadius: 12, elevation: 8,
  },
  mapBtnLeft:    { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  mapIconBox:    { width: 44, height: 44, borderRadius: 14, backgroundColor: ORANGE, justifyContent: 'center', alignItems: 'center' },
  mapBtnTitle:   { color: WHITE, fontWeight: '800', fontSize: 16 },
  mapBtnSub:     { color: 'rgba(255,255,255,0.6)', fontSize: 12, marginTop: 2, maxWidth: 180 },

  card: {
    backgroundColor: WHITE, borderRadius: 20, padding: 20,
    marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 10, elevation: 3,
  },
  cardHeader:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  cardTitle:     { fontSize: 15, fontWeight: '800', color: NAVY, flex: 1 },
  totalBadge:    { backgroundColor: GREEN + '15', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  totalBadgeText:{ color: GREEN, fontWeight: '800', fontSize: 13 },

  detailRow:     { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  detailIcon:    { width: 34, height: 34, borderRadius: 10, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center' },
  detailContent: { flex: 1 },
  detailLabel:   { fontSize: 11, color: GREY, fontWeight: '600', marginBottom: 2 },
  detailValue:   { fontSize: 14, fontWeight: '700', color: NAVY },
  divider:       { height: 1, backgroundColor: '#F5F5F5', marginVertical: 8 },

  callBtn:       { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#4C8EFF', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 },
  callBtnText:   { color: WHITE, fontWeight: '700', fontSize: 12 },

  itemRow:       { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 6 },
  qtyBadge:      { backgroundColor: ORANGE + '15', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4, minWidth: 32, alignItems: 'center' },
  qtyText:       { color: ORANGE, fontWeight: '800', fontSize: 12 },
  itemInfo:      { flex: 1 },
  itemName:      { fontSize: 14, fontWeight: '700', color: NAVY },
  itemSub:       { fontSize: 11, color: GREY, marginTop: 2 },
  itemPrice:     { fontSize: 14, fontWeight: '800', color: NAVY },

  totalRow:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  totalLabel:    { fontSize: 13, color: GREY, fontWeight: '600' },
  totalValue:    { fontSize: 15, fontWeight: '800', color: NAVY },

  footer: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: WHITE, paddingHorizontal: 20, paddingVertical: 16,
    paddingBottom: 30, borderTopWidth: 1, borderTopColor: '#F0F0F0',
  },
  completeBtn: {
    backgroundColor: GREEN, borderRadius: 18, paddingVertical: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: GREEN, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  completeBtnText: { color: WHITE, fontWeight: '800', fontSize: 17 },
});
