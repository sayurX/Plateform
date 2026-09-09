import React, { useEffect, useState, useCallback } from 'react';
import { useStore } from '@/store/useStore';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { fetchAllNotificationsApi } from '@/api/notificationApi';

const ORANGE = '#FF7A28';
const NAVY  = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY  = '#9E9E9E';

// Icon + colour per notification type
const TYPE_META: Record<string, { icon: string; color: string }> = {
  ORDER_STATUS: { icon: 'bag-check-outline',       color: '#2B84EA' },
  PROMOTION:    { icon: 'pricetag-outline',         color: ORANGE    },
  ACCOUNT:      { icon: 'person-circle-outline',    color: '#A855F7' },
  default:      { icon: 'notifications-outline',    color: GREY      },
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

export default function AdminNotificationsScreen({ navigation }: any) {
  const { token } = useStore();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchAllNotificationsApi(token);
      setNotifications(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const renderItem = ({ item }: { item: any }) => {
    const meta = TYPE_META[item.type] ?? TYPE_META['default'];
    const senderName = item.user?.fullName || 'System';
    const avatarLetter = senderName.charAt(0).toUpperCase();

    return (
      <View style={[styles.row, !item.isRead && styles.unreadRow]}>
        {/* Avatar circle with initials */}
        <View style={[styles.avatarCircle, { backgroundColor: meta.color + '22' }]}>
          <Text style={[styles.avatarLetter, { color: meta.color }]}>{avatarLetter}</Text>
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            <Text style={styles.bold}>{senderName} </Text>
            {item.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>{item.message}</Text>
          <Text style={styles.time}>{relativeTime(item.createdAt)}</Text>
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
        <TouchableOpacity onPress={load}>
          <Ionicons name="refresh-outline" size={22} color={NAVY} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator color={ORANGE} style={{ marginTop: 60 }} />
      ) : (
        <FlatList
          data={notifications}
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
          { icon: 'grid-outline',          screen: 'AdminHome'          },
          { icon: 'list-outline',          screen: 'AdminOrders'        },
          { icon: 'people-outline',        screen: 'AdminUsers'         },
          { icon: 'notifications-outline', screen: 'AdminNotifications', active: true },
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

  list: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 100 },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    gap: 12,
  },
  unreadRow: {
    backgroundColor: ORANGE + '08',
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  avatarCircle: {
    width: 46, height: 46, borderRadius: 23,
    justifyContent: 'center', alignItems: 'center',
  },
  avatarLetter: { fontSize: 18, fontWeight: '800' },
  content: { flex: 1 },
  title: { fontSize: 13, color: NAVY, lineHeight: 19 },
  bold: { fontWeight: '700' },
  message: { fontSize: 12, color: GREY, marginTop: 2, lineHeight: 17 },
  time: { fontSize: 11, color: GREY, marginTop: 4 },
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
