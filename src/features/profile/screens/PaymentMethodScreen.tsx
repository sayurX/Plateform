import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';
import { removePaymentMethodApi } from '@/api/paymentApi';

const CashLogo = () => (
  <View style={{ width: 48, height: 32, borderRadius: 6, borderWidth: 3, borderColor: '#FF7A28', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: '#FF7A28', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>1</Text>
    </View>
  </View>
);

const VisaLogo = () => (
  <View style={{ width: 48, height: 32, borderRadius: 6, backgroundColor: '#1A1F71', justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ color: 'white', fontSize: 15, fontWeight: 'bold', fontStyle: 'italic', letterSpacing: 0.5 }}>VISA</Text>
  </View>
);

const MastercardLogo = () => (
  <View style={{ width: 48, height: 32, borderRadius: 6, backgroundColor: '#EB001B', justifyContent: 'center', alignItems: 'center' }}>
    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF', marginRight: -5, zIndex: 1 }} />
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: '#FFFFFF', opacity: 0.8 }} />
    </View>
    <Text style={{ color: 'white', fontSize: 7, fontWeight: '600', letterSpacing: 0.2 }}>mastercard</Text>
  </View>
);


export default function PaymentMethodScreen({ navigation, route }: any) {
  const { token, cart, paymentMethods, loadPaymentMethods, setPaymentMethods, placeNewOrder, currentAddress, deliveryMeta, isCalculatingDelivery } = useStore();
  const [loading, setLoading] = useState(false);
  
  const subtotal = cart.reduce((sum, item) => sum + (item.food.price * item.qty), 0);
  const deliveryFee = cart.length > 0 ? (deliveryMeta?.fee ?? 0) : 0;
  const total = subtotal + deliveryFee;
  const isManageMode = route.params?.mode === 'manage';
  const [selectedMethodId, setSelectedMethodId] = useState(isManageMode ? (paymentMethods[0]?._id || '') : 'cash');

  useEffect(() => {
    const fetchMethods = async () => {
      await loadPaymentMethods();
    };
    fetchMethods();
  }, []);

  useEffect(() => {
    if (isManageMode && paymentMethods.length > 0 && !selectedMethodId) {
      setSelectedMethodId(paymentMethods[0]._id);
    }
  }, [paymentMethods, isManageMode]);

  const handleDelete = (id: string) => {
    Alert.alert('Remove Card', 'Are you sure you want to remove this payment method?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Remove', 
        style: 'destructive',
        onPress: async () => {
          if (!token) return;
          try {
            const updatedMethods = await removePaymentMethodApi(token, id);
            setPaymentMethods(updatedMethods);
            if (selectedMethodId === id) setSelectedMethodId('cash');
          } catch (error) {
            Alert.alert('Error', 'Failed to remove card');
          }
        }
      }
    ]);
  };
  const handleCardActions = () => {
    if (selectedMethodId === 'cash') {
      Alert.alert('Payment Method', `This is your Cash option.`);
      return;
    }

    const method = paymentMethods.find(m => m._id === selectedMethodId);
    if (!method) return;

    Alert.alert(
      'Card Options',
      'Choose an action for this card',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'View Details',
          onPress: () => {
            Alert.alert(
              'Card Details',
              `Holder: ${method.cardHolder}\nNumber: •••• •••• •••• ${method.cardNumber.slice(-4)}\nExpiry: ${method.expiryDate}`
            );
          }
        },
        { 
          text: 'Delete Card', 
          style: 'destructive', 
          onPress: () => handleDelete(selectedMethodId) 
        }
      ]
    );
  };

  const handlePayAndConfirm = async () => {
    if (cart.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before placing an order.');
      return;
    }
    
    setLoading(true);
    try {
      const order = await placeNewOrder();
      if (order?._id) {
        navigation.navigate('PaymentSuccess', { orderId: order._id });
      } else {
        navigation.navigate('PaymentSuccess');
      }
    } catch (error) {
      Alert.alert('Order Failed', 'Something went wrong while placing your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedMethod = paymentMethods.find(m => m._id === selectedMethodId) || 
                         { _id: 'cash', cardType: 'Cash', cardNumber: 'Pay on delivery' };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isManageMode ? 'Manage Cards' : 'Payment'}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Horizontal Payment Selection */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.methodScroll} contentContainerStyle={styles.methodScrollContent}>
          
          {!isManageMode && (
            <View style={styles.methodWrapper}>
              <View style={{ position: 'relative' }}>
                <TouchableOpacity 
                  style={[styles.methodCard, selectedMethodId === 'cash' && styles.methodCardActive]}
                  onPress={() => setSelectedMethodId('cash')}
                >
                  <CashLogo />
                </TouchableOpacity>
                {selectedMethodId === 'cash' && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={14} color={Colors.white} />
                  </View>
                )}
              </View>
              <Text style={styles.methodName}>Cash</Text>
            </View>
          )}

          {/* Dynamic: Saved Cards */}
          {paymentMethods.map(method => {
            const isSelected = selectedMethodId === method._id;
            return (
              <View key={method._id} style={styles.methodWrapper}>
                <View style={{ position: 'relative' }}>
                  <TouchableOpacity 
                    style={[styles.methodCard, isSelected && styles.methodCardActive]}
                    onPress={() => setSelectedMethodId(method._id)}
                    onLongPress={() => handleDelete(method._id)}
                  >
                    {method.cardType === 'Visa' ? <VisaLogo /> : <MastercardLogo />}
                  </TouchableOpacity>
                  
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={14} color={Colors.white} />
                    </View>
                  )}
                </View>
                <Text style={styles.methodName}>{method.cardType}</Text>
              </View>
            );
          })}

          {/* Paypal block removed */}

        </ScrollView>

        {/* Selected Card UI */}
        <View style={styles.cardInfoBox}>
          <View style={styles.cardInfoLeft}>
            <Text style={styles.cardInfoTitle}>
              {selectedMethodId === 'cash' ? 'Cash on Delivery' : 
               (selectedMethod as any).cardType || 'Credit Card'}
            </Text>
            <View style={styles.cardNumberContainer}>
              {selectedMethodId === 'cash' ? (
                 <Ionicons name="cash" size={20} color="#FF7A28" style={{marginRight: 8}} />
              ) : (
                <FontAwesome5 
                  name={(selectedMethod as any).cardType === 'Visa' ? 'cc-visa' : 'cc-mastercard'} 
                  size={20} 
                  color={(selectedMethod as any).cardType === 'Visa' ? '#1A1F71' : '#EB001B'} 
                  style={{marginRight: 8}} 
                />
              )}
              <Text style={styles.cardNumber}>
                {selectedMethodId === 'cash' ? 'Pay when you receive' : 
                 `•••• •••• •••• ${(selectedMethod as any).cardNumber?.slice(-4) || 'XXXX'}`}
              </Text>
            </View>
          </View>
          <TouchableOpacity onPress={handleCardActions} style={{ padding: 4 }}>
            <Ionicons name="chevron-down" size={20} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Add New Button */}
        <TouchableOpacity style={styles.addNewButton} onPress={() => navigation.navigate('AddCard')}>
          <Ionicons name="add" size={20} color={Colors.primary} />
          <Text style={styles.addNewText}>ADD NEW</Text>
        </TouchableOpacity>

      </ScrollView>

      {/* Footer Area - Only show in checkout mode */}
      {!isManageMode && (
        <View style={styles.footer}>
          <View style={styles.totalRow}>
            <Text style={styles.totalValue}>Rs.{total}</Text>
          </View>
          <AppButton 
            title={loading ? "PROCESSING..." : "PAY & CONFIRM"} 
            onPress={handlePayAndConfirm}
            loading={loading}
            disabled={loading}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingBottom: 40 },
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
  
  methodScroll: { marginVertical: 24 },
  methodScrollContent: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 12, gap: 16 },
  methodWrapper: { alignItems: 'center', gap: 10 },
  methodCard: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  methodCardActive: { borderColor: Colors.primary, backgroundColor: Colors.white },
  checkBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
    zIndex: 10,
    elevation: 5,
  },
  methodName: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },

  cardInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#F6F8FA',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 24,
    marginBottom: 20,
  },
  cardInfoLeft: {},
  cardInfoTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, marginBottom: 8 },
  cardNumberContainer: { flexDirection: 'row', alignItems: 'center' },
  cardNumber: { fontSize: 14, color: Colors.textSecondary, letterSpacing: 1 },

  addNewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E8EAED',
    borderStyle: 'solid',
    gap: 8,
  },
  addNewText: { fontSize: 14, fontWeight: 'bold', color: Colors.primary },

  footer: { paddingHorizontal: 24, paddingBottom: 20, paddingTop: 16 },
  totalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 12, marginBottom: 16 },
  totalLabel: { fontSize: 14, color: Colors.textSecondary, fontWeight: '600', letterSpacing: 1 },
  totalValue: { fontSize: 32, color: Colors.text, fontWeight: 'bold' },
});
