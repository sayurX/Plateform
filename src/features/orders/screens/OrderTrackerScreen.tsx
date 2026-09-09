import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';

const STATUS_CONFIG: any = {
  'pending': { index: 0, text: 'Order Placed', heroText: 'Waiting for restaurant approval...', heroIcon: 'receipt-outline' },
  'accepted': { index: 1, text: 'Order Confirmed', heroText: 'Restaurant is reviewing your order...', heroIcon: 'checkmark-circle-outline' },
  'preparing': { index: 2, text: 'Chef is cooking', heroText: 'Your food is being prepared!', heroIcon: 'restaurant-outline' },
  'out_for_delivery': { index: 3, text: 'Out for Delivery', heroText: 'Your order is on the way!', heroIcon: 'bicycle-outline' },
  'delivered': { index: 4, text: 'Delivered', heroText: 'Enjoy your meal!', heroIcon: 'home-outline' },
};

const ORDER_STATES = [
  { id: 'pending', title: 'Order Placed', icon: 'receipt-outline' },
  { id: 'preparing', title: 'Chef is cooking', icon: 'restaurant-outline' },
  { id: 'out_for_delivery', title: 'Out for Delivery', icon: 'bicycle-outline' },
  { id: 'delivered', title: 'Delivered', icon: 'home-outline' },
];

export default function OrderTrackerScreen({ navigation, route }: any) {
  const { orderId } = route.params || {};
  const { trackingOrder, loadOrderDetails } = useStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      loadOrderDetails(orderId).finally(() => setLoading(false));
      
      // Setup polling every 10s
      const interval = setInterval(() => {
        loadOrderDetails(orderId);
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [orderId]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!trackingOrder) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text>Order not found</Text>
        <AppButton title="BACK HOME" onPress={() => navigation.navigate('Home')} />
      </View>
    );
  }

  const currentStatus = trackingOrder.status as string;
  const config = STATUS_CONFIG[currentStatus] || STATUS_CONFIG['pending'];
  const currentStateIndex = config.index;

  // Derive display times (in a real app, these would come from the backend timestamps)
  const orderTime = new Date(trackingOrder.createdAt || Date.now());
  const formattedTime = (mins: number) => {
    const d = new Date(orderTime.getTime() + mins * 60000);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Track Order</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Estimated Time Header */}
        <View style={styles.etaContainer}>
          <Text style={styles.etaLabel}>Estimated Delivery</Text>
          <Text style={styles.etaTime}>{formattedTime(40)}</Text>
        </View>

        {/* Hero Graphic */}
        <View style={styles.mapGraphic}>
           <View style={styles.heroIconCircle}>
             <Ionicons name={config.heroIcon as any} size={48} color={Colors.primary} />
           </View>
           <Text style={styles.heroText}>{config.heroText}</Text>
        </View>

        {/* Timeline */}
        <View style={styles.timelineContainer}>
          {ORDER_STATES.map((step, index) => {
            // Map status to our timeline steps
            // Step 0: Placed (pending or later)
            // Step 1: Cooking (preparing or later)
            // Step 2: Delivery (out_for_delivery or later)
            // Step 3: Delivered (delivered)
            
            let isCompleted = false;
            let isActive = false;
            
            if (currentStatus === 'delivered') {
               isCompleted = index < 3;
               isActive = index === 3;
            } else if (currentStatus === 'out_for_delivery') {
               isCompleted = index < 2;
               isActive = index === 2;
            } else if (currentStatus === 'preparing') {
               isCompleted = index < 1;
               isActive = index === 1;
            } else {
               isCompleted = false;
               isActive = index === 0;
            }

            const isPending = !isCompleted && !isActive;

            return (
              <View key={step.id} style={styles.timelineStep}>
                {index !== ORDER_STATES.length - 1 && (
                  <View style={[styles.timelineLine, isCompleted ? styles.timelineLineCompleted : styles.timelineLinePending]} />
                )}
                
                <View style={[
                  styles.timelineNode, 
                  isCompleted && styles.timelineNodeCompleted,
                  isActive && styles.timelineNodeActive,
                  isPending && styles.timelineNodePending
                ]}>
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={20} color={Colors.white} />
                  ) : (
                    <Ionicons name={step.icon as any} size={20} color={isActive ? Colors.white : '#A0A5BA'} />
                  )}
                </View>

                <View style={styles.stepContent}>
                  <Text style={[styles.stepTitle, (isCompleted || isActive) && styles.stepTitleActive]}>{step.title}</Text>
                  <Text style={styles.stepTime}>{index <= (isCompleted ? index : isActive ? index : -1) ? formattedTime(index * 10) : 'Pending...'}</Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Driver Profile Card */}
        {['out_for_delivery', 'delivered'].includes(currentStatus) && (
          <View style={styles.driverCard}>
            <View style={styles.driverAvatar}>
               <Ionicons name="person" size={24} color={Colors.white} />
            </View>
            <View style={styles.driverInfo}>
              <Text style={styles.driverName}>Robert Fox</Text>
              <Text style={styles.driverRole}>Delivery Partner</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
               <Ionicons name="call" size={22} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}

        {/* Home Button */}
        <View style={{ marginTop: 40, marginBottom: 40 }}>
          <AppButton title="BACK TO HOME" onPress={() => navigation.navigate('Home')} />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
  
  etaContainer: { alignItems: 'center', marginTop: 12, marginBottom: 32 },
  etaLabel: { fontSize: 14, color: Colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
  etaTime: { fontSize: 36, fontWeight: 'bold', color: Colors.text },
  
  mapGraphic: { backgroundColor: 'rgba(255, 122, 40, 0.08)', borderRadius: 32, padding: 32, alignItems: 'center', marginBottom: 40 },
  heroIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: 'rgba(255, 122, 40, 0.15)', justifyContent: 'center', alignItems: 'center' },
  heroText: { fontSize: 16, fontWeight: 'bold', color: Colors.primary, marginTop: 16 },

  timelineContainer: { paddingLeft: 10, paddingBottom: 10 },
  timelineStep: { flexDirection: 'row', marginBottom: 40, position: 'relative' },
  timelineLine: { position: 'absolute', left: 23, top: 48, width: 2, height: 40, zIndex: -1 },
  timelineLineCompleted: { backgroundColor: '#00E58F' }, 
  timelineLinePending: { backgroundColor: '#F0F5FA' },
  
  timelineNode: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 20 },
  timelineNodeCompleted: { backgroundColor: '#00E58F' },
  timelineNodeActive: { backgroundColor: Colors.primary, borderWidth: 6, borderColor: '#FFE4CA' },
  timelineNodePending: { backgroundColor: '#F6F8FA' },
  
  stepContent: { flex: 1, justifyContent: 'center' },
  stepTitle: { fontSize: 16, fontWeight: '600', color: '#A0A5BA', marginBottom: 6 },
  stepTitleActive: { color: Colors.text, fontWeight: 'bold' },
  stepTime: { fontSize: 14, color: '#A0A5BA', fontWeight: '500' },
  
  driverCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F8FA', borderRadius: 24, padding: 16, marginTop: 10 },
  driverAvatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#A0A5BA', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  driverInfo: { flex: 1 },
  driverName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  driverRole: { fontSize: 14, color: Colors.textSecondary },
  callButton: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#00E58F', justifyContent: 'center', alignItems: 'center' },
});
