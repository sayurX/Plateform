import React, { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#FF7A28';
const NAVY   = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';

export default function DriverWalletScreen({ navigation }: any) {
  const { orders, loadOrders } = useStore();

  useEffect(() => {
    loadOrders();
  }, []);

  const deliveredOrders = orders.filter(o => o.status === 'delivered');
  const balance = deliveredOrders.reduce((acc, o) => acc + (o.totalAmount * 0.25), 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Earnings Wallet</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scroll}>
         <View style={styles.card}>
            <Text style={styles.cardLabel}>Available Balance</Text>
            <Text style={styles.cardAmount}>Rs.{balance.toFixed(2)}</Text>
         </View>
         <View style={styles.emptyBox}>
            <Ionicons name="card-outline" size={48} color={GREY} />
            <Text style={styles.emptyText}>No recent transactions.</Text>
         </View>
      </ScrollView>
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',          screen: 'DriverHome' },
          { icon: 'list-outline',          screen: 'DriverOrders' },
          { icon: 'wallet-outline',        screen: 'DriverWallet' },
          { icon: 'person-outline',        screen: 'DriverProfile' },
        ].map((tab: any, i) => (
          <TouchableOpacity key={i} style={styles.navItem} onPress={() => navigation.navigate(tab.screen)}>
            <Ionicons name={tab.icon} size={24} color={i === 2 ? ORANGE : GREY} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT_BG },
  header: { padding: 20, backgroundColor: LIGHT_BG },
  headerTitle: { fontSize: 22, fontWeight: '800', color: NAVY },
  scroll: { padding: 20, gap: 40, paddingBottom: 100 },
  card: { backgroundColor: NAVY, borderRadius: 20, padding: 24, shadowColor: NAVY, shadowOpacity: 0.2, shadowRadius: 15, elevation: 8, alignItems: 'center' },
  cardLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500', marginBottom: 8 },
  cardAmount: { color: WHITE, fontSize: 36, fontWeight: '800' },
  emptyBox: { alignItems: 'center', opacity: 0.6, marginTop: 40 },
  emptyText: { marginTop: 12, fontSize: 16, color: NAVY, fontWeight: '600' },
  navbar: { position: 'absolute', bottom: 20, left: 20, right: 20, height: 64, backgroundColor: WHITE, borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', elevation: 12, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, paddingHorizontal: 10 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
