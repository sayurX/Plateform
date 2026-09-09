import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore, Order } from '@/store/useStore';

const ORDERS = [
  {
    id: '1',
    date: 'Today, 12:05 PM',
    status: 'In Progress',
    items: ['2x Pizza Calzone European', '1x Sprite'],
    total: 96,
    active: true,
  },
  {
    id: '2',
    date: 'Oct 24, 2023, 08:30 PM',
    status: 'Delivered',
    items: ['1x Spicy Chili Hot Dog', '1x French Fries'],
    total: 24,
    active: false,
  },
  {
    id: '3',
    date: 'Oct 15, 2023, 01:15 PM',
    status: 'Delivered',
    items: ['1x Classic Margherita', '2x Garlic Bread'],
    total: 42,
    active: false,
  }
];

export default function OrderHistoryScreen({ navigation }: any) {
  const { orders, loadOrders } = useStore();

  useEffect(() => {
    loadOrders();
  }, []);

  const renderOrder = (order: Order) => {
    const isActive = ['pending', 'accepted', 'preparing', 'out_for_delivery'].includes(order.status);
    const date = new Date(order.createdAt || Date.now()).toLocaleString([], { 
      day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    return (
      <View key={order._id} style={styles.orderCard}>
        <View style={styles.cardHeader}>
          <Text style={styles.orderDate}>{date}</Text>
          <View style={[styles.statusBadge, isActive ? styles.statusActive : styles.statusDelivered]}>
            <Text style={[styles.statusText, isActive ? styles.statusTextActive : styles.statusTextDelivered]}>
              {order.status.toUpperCase()}
            </Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
               <Ionicons name="ellipse" size={6} color="#A0A5BA" style={{marginRight: 8}} />
               <Text style={styles.itemText}>{item.quantity}x {item.food?.name || 'Item'}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>Rs.{order.totalAmount.toFixed(2)}</Text>
        </View>

        <View style={styles.actionContainer}>
          {isActive ? (
            <AppButton 
              title="TRACK ORDER" 
              onPress={() => navigation.navigate('OrderTracker', { orderId: order._id })} 
            />
          ) : (
            <View style={styles.splitRow}>
              <TouchableOpacity style={styles.rateButton} onPress={() => navigation.navigate('RateFood', { foodName: order.items[0]?.food?.name })}>
                <Text style={styles.rateText}>RATE</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.reorderButton} onPress={() => navigation.navigate('Home')}>
                <Text style={styles.reorderText}>ORDER AGAIN</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {orders.map(order => renderOrder(order))}
        {orders.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 100 }}>
             <Ionicons name="receipt-outline" size={80} color="#F0F5FA" />
             <Text style={{ color: Colors.textSecondary, marginTop: 16 }}>No orders yet</Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 10 },
  
  orderCard: { backgroundColor: '#F6F8FA', borderRadius: 24, padding: 20, marginBottom: 20 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  orderDate: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusActive: { backgroundColor: '#E4F9F0' }, // Light green
  statusDelivered: { backgroundColor: '#E0E8F2' }, // Light grey
  statusText: { fontSize: 12, fontWeight: 'bold' },
  statusTextActive: { color: '#00E58F' },
  statusTextDelivered: { color: Colors.textSecondary },
  
  itemsList: { marginBottom: 16 },
  itemRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  itemText: { fontSize: 15, color: Colors.text, fontWeight: '500' },
  
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#E8EAED', paddingTop: 16, marginBottom: 20 },
  totalLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600' },
  totalValue: { fontSize: 18, color: Colors.primary, fontWeight: 'bold' },
  
  actionContainer: {  },
  splitRow: { flexDirection: 'row', gap: 12 },
  rateButton: { flex: 1, backgroundColor: Colors.white, borderRadius: 14, paddingVertical: 14, alignItems: 'center', borderWidth: 1, borderColor: '#E8EAED' },
  rateText: { color: Colors.text, fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
  reorderButton: { flex: 1, backgroundColor: Colors.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center' },
  reorderText: { color: Colors.white, fontSize: 14, fontWeight: 'bold', letterSpacing: 1 },
});
