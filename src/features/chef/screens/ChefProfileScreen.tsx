import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const LIGHT_BG = '#F2F3F7';
const GREY = '#9E9E9E';

export default function ChefProfileScreen({ navigation }: any) {
  const { user, logout } = useStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Avatar card */}
      <View style={styles.avatarCard}>
        <View style={styles.avatarRing}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=200&q=80' }}
            style={styles.avatar}
          />
        </View>
        <Text style={styles.name}>{user?.fullName ?? 'Chef'}</Text>
        <View style={styles.roleBadge}>
          <Ionicons name="restaurant-outline" size={13} color={ORANGE} />
          <Text style={styles.roleText}>Chef</Text>
        </View>
      </View>

      {/* Info rows */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="person-outline" size={18} color={ORANGE} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Full Name</Text>
            <Text style={styles.infoValue}>{user?.fullName ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="mail-outline" size={18} color={ORANGE} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Email</Text>
            <Text style={styles.infoValue}>{user?.email ?? '—'}</Text>
          </View>
        </View>

        <View style={styles.infoDivider} />

        <View style={styles.infoRow}>
          <View style={styles.infoIconWrap}>
            <Ionicons name="shield-checkmark-outline" size={18} color={ORANGE} />
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Role</Text>
            <Text style={styles.infoValue}>Chef</Text>
          </View>
        </View>
      </View>

      {/* Spacer */}
      <View style={{ flex: 1 }} />

      {/* Logout button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={22} color={WHITE} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT_BG },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: NAVY },

  // Avatar card
  avatarCard: {
    alignItems: 'center',
    paddingVertical: 28,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: ORANGE,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: ORANGE,
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  avatar: { width: '100%', height: '100%' },
  name: { fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 8 },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: ORANGE + '18',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 20,
  },
  roleText: { fontSize: 13, fontWeight: '700', color: ORANGE },

  // Info card
  infoCard: {
    marginHorizontal: 20,
    backgroundColor: WHITE,
    borderRadius: 18,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 14,
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: ORANGE + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 11, color: GREY, fontWeight: '600', marginBottom: 2 },
  infoValue: { fontSize: 14, fontWeight: '700', color: NAVY },
  infoDivider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 52 },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    backgroundColor: '#E53935',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#E53935',
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  logoutText: { fontSize: 16, fontWeight: '800', color: WHITE },
});
