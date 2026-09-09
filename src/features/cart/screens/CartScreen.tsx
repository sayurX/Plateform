import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';

// Local mock items removed

export default function CartScreen({ navigation }: any) {
  const { cart, updateCartQty, removeFromCart, currentAddress, deliveryMeta, isCalculatingDelivery } = useStore();

  const subtotal = cart.reduce((sum, item) => sum + (item.food.price * item.qty), 0);
  const deliveryFee = cart.length > 0 ? (deliveryMeta?.fee ?? 0) : 0;
  const total = subtotal + deliveryFee;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.topArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.headerDone}>DONE</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.itemsScroll}>
        {cart.map((item) => (
          <View key={`${item.food._id}-${item.size}`} style={styles.cartItem}>
            <View style={styles.itemImageContainer}>
               <Image source={{ uri: item.food.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 15 }} resizeMode="cover" />
            </View>
            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.food.name}</Text>
              <Text style={styles.itemPrice}>Rs.{item.food.price * item.qty}</Text>
              <Text style={styles.itemSize}>{item.size}</Text>
              
              <View style={styles.qtyControls}>
                 <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.food._id, item.size, -1)}>
                   <Ionicons name="remove" size={16} color={Colors.white}/>
                 </TouchableOpacity>
                 <Text style={styles.qtyText}>{item.qty}</Text>
                 <TouchableOpacity style={styles.qtyBtn} onPress={() => updateCartQty(item.food._id, item.size, 1)}>
                   <Ionicons name="add" size={16} color={Colors.white}/>
                 </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(item.food._id, item.size)}>
              <Ionicons name="close" size={16} color={Colors.white} />
            </TouchableOpacity>
          </View>
        ))}
        {cart.length === 0 && (
          <View style={{ alignItems: 'center', marginTop: 100 }}>
            <Ionicons name="cart-outline" size={80} color="rgba(255,255,255,0.1)" />
            <Text style={{ color: Colors.white, opacity: 0.5, marginTop: 20 }}>Your cart is empty</Text>
          </View>
        )}
      </ScrollView>

      {/* Bottom Sheet Area */}
      <View style={styles.bottomSheet}>
        <View style={styles.deliveryRow}>
           <Text style={styles.deliveryLabel}>DELIVERY ADDRESS</Text>
           <TouchableOpacity onPress={() => navigation.navigate('Addresses')}><Text style={styles.editLabel}>EDIT</Text></TouchableOpacity>
        </View>
        <View style={styles.addressBox}>
           <Text style={styles.addressText}>{currentAddress || 'No address selected'}</Text>
        </View>

        <View style={styles.totalRow}>
           <View style={{flexDirection:'row', alignItems:'baseline', gap:8}}>
             <Text style={styles.totalLabel}>TOTAL:</Text>
             {isCalculatingDelivery ? (
               <Text style={[styles.totalValue, { fontSize: 18, color: Colors.textSecondary }]}>Calculating...</Text>
             ) : (
               <Text style={styles.totalValue}>Rs.{total}</Text>
             )}
           </View>
           <TouchableOpacity onPress={() => navigation.navigate('PaymentBreakdown')}><Text style={styles.breakdownText}>Breakdown {'>'}</Text></TouchableOpacity>
        </View>
        
        {/* Delivery fee mini-row */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 13, color: Colors.textSecondary }}>
            Delivery fee ({deliveryMeta?.dist ?? '...'}, {typeof deliveryMeta?.time === 'number' ? `~${deliveryMeta.time} min` : (deliveryMeta?.time ?? '...')})
          </Text>
          <Text style={{ fontSize: 13, color: Colors.textSecondary, fontWeight: '600' }}>
            {isCalculatingDelivery ? '...' : `Rs.${deliveryFee}`}
          </Text>
        </View>
        
        <AppButton title="PLACE ORDER" onPress={() => navigation.navigate('PaymentMethod')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1A1D2E' }, // Match dark navy
  topArea: { backgroundColor: '#1A1D2E' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { flex: 1, fontSize: 18, fontWeight: '600', color: Colors.white, marginLeft: 16 },
  headerDone: { fontSize: 14, color: '#00E58F', fontWeight: 'bold', letterSpacing: 1 },
  
  itemsScroll: { flex: 1, paddingHorizontal: 24, paddingTop: 30 },
  cartItem: { flexDirection: 'row', marginBottom: 30, position: 'relative' },
  itemImageContainer: { width: 100, height: 100, borderRadius: 20, backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  itemDetails: { flex: 1, justifyContent: 'center' },
  itemName: { color: Colors.white, fontSize: 16, fontWeight: '500', marginBottom: 4, paddingRight: 30 },
  itemPrice: { color: Colors.white, fontSize: 22, fontWeight: 'bold', marginBottom: 4 },
  itemSize: { color: '#A0A5BA', fontSize: 14 },
  qtyControls: { flexDirection: 'row', alignItems: 'center', position: 'absolute', bottom: 0, right: 0, gap: 14 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  qtyText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  deleteBtn: { position: 'absolute', top: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: '#FF3F3f', justifyContent: 'center', alignItems: 'center', zIndex: 10 },

  bottomSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 32,
  },
  deliveryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  deliveryLabel: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, letterSpacing: 1 },
  editLabel: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },
  addressBox: { backgroundColor: '#F6F8FA', borderRadius: 12, padding: 16, marginBottom: 24, justifyContent: 'center' },
  addressText: { fontSize: 15, color: Colors.text, fontWeight: '400' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  totalLabel: { fontSize: 16, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 0.5 },
  totalValue: { fontSize: 32, color: Colors.text, fontWeight: 'bold' },
  breakdownText: { fontSize: 14, color: Colors.primary, fontWeight: '500' },
});
