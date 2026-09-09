import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';



// Map notification type → icon name and colour
const TYPE_META: Record<string, { icon: string; color: string; label: string }> = {
  order_placed:    { icon: 'bag-check-outline',      color: '#2B84EA', label: 'Placed a new order' },
  order_accepted:  { icon: 'checkmark-circle-outline', color: '#00E58F', label: 'Order accepted' },
  order_preparing: { icon: 'restaurant-outline',      color: ORANGE,    label: 'Started preparing' },
  order_ready:     { icon: 'bicycle-outline',         color: '#A855F7', label: 'Order ready for pickup' },
  order_delivered: { icon: 'home-outline',            color: '#00E58F', label: 'Order delivered' },
  order_cancelled: { icon: 'close-circle-outline',    color: '#FF4B4B', label: 'Order cancelled' },
  review:          { icon: 'star-outline',            color: '#FFB01D', label: 'Left a review' },
  default:         { icon: 'notifications-outline',   color: GREY,      label: 'Notification' },
};

const relativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function ChefNotificationsScreen({ navigation }: any) {
  const { notifications, loadNotifications, user } = useStore();
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      const load = async () => {
        setLoading(true);
        await loadNotifications();
        if (active) setLoading(false);
      };
      load();
      return () => { active = false; };
    }, [])
  );

  const data = notifications;

  const renderItem = ({ item }: { item: any }) => {
    const meta = TYPE_META[item.type] ?? TYPE_META['default'];
    const senderName = item.sender?.fullName || item.title || 'System';
    const body = item.body || item.message || meta.label;
    const avatarUri = item.sender?.avatarUrl
      || `https://ui-avatars.com/api/?name=${encodeURIComponent(senderName)}&background=FF7A28&color=fff`;
    const thumbUri = item.foodImage
      || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=80&q=80';

    return (
      <View style={[styles.notifRow, !item.isRead && styles.unreadRow]}>
        <Image source={{ uri: avatarUri }} style={styles.notifAvatar} />
        <View style={styles.notifContent}>
          <Text style={styles.notifText} numberOfLines={2}>
            <Text style={styles.notifName}>{senderName} </Text>
            {body}
          </Text>
          <Text style={styles.notifTime}>{relativeTime(item.createdAt)}</Text>
        </View>
        <View style={[styles.iconCircle, { backgroundColor: meta.color + '18' }]}>
          <Ionicons name={meta.icon as any} size={20} color={meta.color} />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 28 }} />
      </View>


      {/* List */}
      {loading ? (
        <ActivityIndicator color={ORANGE} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Ionicons name="notifications-off-outline" size={52} color="#E0E0E0" />
              <Text style={styles.emptyText}>No notifications yet</Text>
            </View>
          }
        />
      )}

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',          screen: 'ChefHome' },
          { icon: 'list-outline',          screen: 'ChefOrders' },
          { icon: 'fast-food-outline',     screen: 'ChefFoodList' },
          { icon: 'notifications-outline', screen: 'ChefNotifications', active: true },
        ].map((tab: any, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigation?.navigate?.(tab.screen)}
          >
            <Ionicons name={tab.icon} size={24} color={tab.active ? ORANGE : '#9E9E9E'} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: WHITE,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: NAVY },


  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },

  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    gap: 12,
  },
  unreadRow: { backgroundColor: ORANGE + '08', marginHorizontal: -20, paddingHorizontal: 20 },
  notifAvatar: { width: 46, height: 46, borderRadius: 23 },
  notifContent: { flex: 1 },
  notifText: { fontSize: 13, color: NAVY, lineHeight: 19 },
  notifName: { fontWeight: '700', color: NAVY },
  notifTime: { fontSize: 11, color: GREY, marginTop: 4 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22,
    justifyContent: 'center', alignItems: 'center',
  },

  emptyBox: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { color: GREY, fontSize: 15 },

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
