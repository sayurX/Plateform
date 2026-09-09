import React, { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';

type RoleType = 'All' | 'Customer' | 'Chef' | 'Driver';

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: 'Customer' | 'Chef' | 'Driver';
  avatar: string;
  status: 'active' | 'inactive';
}

// Removed static USERS array in favor of dynamic store data

const ROLE_COLOR: Record<string, string> = {
  Customer: '#4C8EFF',
  Chef: ORANGE,
  Driver: '#2DB87E',
};

export default function AdminUsersScreen({ navigation }: any) {
  const { users, loadUsers } = useStore();
  const [activeRole, setActiveRole] = useState<RoleType>('All');

  useEffect(() => {
    loadUsers();
  }, []);

  // Map backend users to local UserItem interface
  const mappedUsers: UserItem[] = (users || []).map((u: any) => {
    const rawRole = u.role || 'customer';
    const capitalised = rawRole.charAt(0).toUpperCase() + rawRole.slice(1).toLowerCase();
    
    // Assign specific faces for the demo users so they look distinct
    let avatar = u.avatarUrl;
    if (!avatar) {
       if (u.email === 'admin@plateform.com') avatar = 'https://i.pravatar.cc/150?img=68';
       else if (u.email === 'chef@plateform.com') avatar = 'https://i.pravatar.cc/150?img=44';
       else if (u.email === 'driver@plateform.com') avatar = 'https://i.pravatar.cc/150?img=66';
       else avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(u.fullName || 'User')}&background=random&color=fff`;
    }

    return {
      id: u._id,
      name: u.fullName || 'User',
      email: u.email,
      role: capitalised as any,
      avatar,
      status: 'active',
    };
  });

  const filtered = activeRole === 'All' ? mappedUsers : mappedUsers.filter((u) => u.role === activeRole);

  const totalCount     = mappedUsers.length;
  const customersCount = mappedUsers.filter(u => u.role === 'Customer').length;
  const chefsCount     = mappedUsers.filter(u => u.role === 'Chef').length;
  const driversCount   = mappedUsers.filter(u => u.role === 'Driver').length;

  const renderUser = ({ item }: { item: UserItem }) => (
    <View style={styles.userCard}>
      <View style={styles.avatarWrap}>
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={[styles.statusDot, { backgroundColor: item.status === 'active' ? '#2DB87E' : '#E0E0E0' }]} />
      </View>
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.name}</Text>
        <Text style={styles.userEmail}>{item.email}</Text>
      </View>
      <View style={[styles.roleBadge, { backgroundColor: ROLE_COLOR[item.role] + '18' }]}>
        <Text style={[styles.roleText, { color: ROLE_COLOR[item.role] }]}>{item.role}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Management</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Stats row */}
      <View style={styles.miniStatsRow}>
        {[
          { label: 'Total', count: totalCount, color: NAVY },
          { label: 'Customers', count: customersCount, color: '#4C8EFF' },
          { label: 'Chefs', count: chefsCount, color: ORANGE },
          { label: 'Drivers', count: driversCount, color: '#2DB87E' },
        ].map((s, i) => (
          <View key={i} style={styles.miniStat}>
            <Text style={[styles.miniStatNum, { color: s.color }]}>{s.count}</Text>
            <Text style={styles.miniStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {(['All', 'Customer', 'Chef', 'Driver'] as RoleType[]).map((role) => {
          const active = activeRole === role;
          return (
            <TouchableOpacity
              key={role}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveRole(role)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{role}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* User list */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderUser}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyBox}>
            <Ionicons name="people-outline" size={48} color={GREY} />
            <Text style={styles.emptyText}>No users found</Text>
          </View>
        }
      />

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline', screen: 'AdminHome' },
          { icon: 'list-outline', screen: 'AdminOrders' },
          { icon: 'people-outline', screen: 'AdminUsers', active: true },
          { icon: 'notifications-outline', screen: 'AdminNotifications' },
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

  miniStatsRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: BG,
    gap: 0,
    justifyContent: 'space-around',
  },
  miniStat: { alignItems: 'center' },
  miniStatNum: { fontSize: 24, fontWeight: '800' },
  miniStatLabel: { fontSize: 11, color: GREY, marginTop: 2 },

  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EFEFEF',
    paddingHorizontal: 20,
    backgroundColor: WHITE,
  },
  tab: { paddingBottom: 12, paddingHorizontal: 4, marginRight: 20 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: ORANGE },
  tabText: { fontSize: 14, color: GREY, fontWeight: '500' },
  tabTextActive: { color: ORANGE, fontWeight: '700' },

  list: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 },

  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F2',
    gap: 12,
  },
  avatarWrap: { position: 'relative' },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  statusDot: {
    position: 'absolute', bottom: 1, right: 1,
    width: 12, height: 12, borderRadius: 6,
    borderWidth: 2, borderColor: WHITE,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 14, fontWeight: '700', color: NAVY },
  userEmail: { fontSize: 12, color: GREY, marginTop: 2 },
  roleBadge: {
    paddingHorizontal: 12, paddingVertical: 4,
    borderRadius: 20,
  },
  roleText: { fontSize: 12, fontWeight: '700' },

  emptyBox: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { color: GREY, fontSize: 16 },

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
