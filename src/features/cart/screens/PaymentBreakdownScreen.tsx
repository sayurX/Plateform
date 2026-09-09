import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

import { useStore } from '@/store/useStore';

export default function PaymentBreakdownScreen({ navigation }: any) {
  const { cart, deliveryMeta, isCalculatingDelivery } = useStore();
  
  const subtotal = cart.reduce((sum, item) => sum + (item.food.price * item.qty), 0);
  const deliveryFee = cart.length > 0 ? (deliveryMeta?.fee ?? 0) : 0;
  const total = subtotal + deliveryFee;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Breakdown</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {cart.map((item) => (
            <View key={`${item.food._id}-${item.size}`} style={styles.row}>
              <Text style={styles.label}>{item.food.name} ({item.qty})</Text>
              <Text style={styles.value}>Rs.{item.food.price * item.qty}</Text>
            </View>
          ))}
          
          <View style={styles.divider} />
          
          <View style={[styles.row, { marginTop: 8 }]}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>Rs.{subtotal}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Delivery Fee</Text>
            <Text style={styles.value}>Rs.{deliveryFee}</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>Rs.{total}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F0F5FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  content: { padding: 24 },
  card: { backgroundColor: '#F6F8FA', borderRadius: 16, padding: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  label: { fontSize: 15, color: Colors.textSecondary, fontWeight: '500' },
  value: { fontSize: 15, color: Colors.text, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#E8EAED', borderStyle: 'dotted', marginVertical: 8, marginBottom: 24 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, color: Colors.text, fontWeight: '600' },
  totalValue: { fontSize: 24, color: Colors.primary, fontWeight: 'bold' },
});
