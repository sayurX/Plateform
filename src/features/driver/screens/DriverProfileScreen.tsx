import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { Colors } from '@/theme/colors';
import { Avatar } from '@/components/Avatar';

const ORANGE   = '#FF7A28';
const NAVY     = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE    = '#FFFFFF';
const GREY     = '#9E9E9E';
const RED      = '#FF4B4B';

const MENU_GROUPS = [
  [
    { id: '1', title: 'Personal Info',     icon: 'person-outline',       color: ORANGE,     route: 'DriverPersonalInfo' },
    { id: '2', title: 'My Vehicles',       icon: 'bicycle-outline',      color: '#5C61F4',  route: 'DriverVehicles'    },
  ],
  [
    { id: '3', title: 'Earnings & Wallet', icon: 'wallet-outline',       color: '#2DB87E',  route: 'DriverWallet'      },
    { id: '4', title: 'Delivery History',  icon: 'list-outline',         color: '#2B84EA',  route: 'DriverOrders'      },
  ],
  [
    { id: '5', title: 'Settings',          icon: 'settings-outline',     color: '#5C61F4',  route: 'DriverSettings'    },
    { id: '6', title: 'Support Context',   icon: 'help-circle-outline',  color: ORANGE,     route: 'DriverSupport'     },
  ]
];

export default function DriverProfileScreen({ navigation }: any) {
  const { user, logout } = useStore();

  const handleLogout = () => {
    Alert.alert(
      'Log Out',
      'Are you sure you want to log out and go offline?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Log Out', style: 'destructive', onPress: logout }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={LIGHT_BG} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Driver Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar uri={user?.avatarUrl} name={user?.fullName || 'Delivery Partner'} size={80} style={{ marginRight: 16 }} />
          <View style={styles.profileTexts}>
            <Text style={styles.nameText}>{user?.fullName || 'Delivery Partner'}</Text>
            <Text style={styles.roleText}>{user?.email || 'driver@plateform.com'}</Text>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Online & Ready</Text>
            </View>
          </View>
        </View>

        {/* Menu Groups */}
        {MENU_GROUPS.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.menuGroup}>
            {group.map((item, index) => (
              <React.Fragment key={item.id}>
                <TouchableOpacity 
                  style={styles.menuItem} 
                  onPress={() => navigation.navigate(item.route)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.iconCircle}>
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
                </TouchableOpacity>
                {index < group.length - 1 && <View style={styles.divider} />}
              </React.Fragment>
            ))}
          </View>
        ))}

        {/* Dedicated Logout Section */}
        <View style={[styles.menuGroup, { marginTop: 10, borderColor: '#FFEBEB', borderWidth: 1 }]}>
          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <View style={styles.menuItemLeft}>
              <View style={[styles.iconCircle, { backgroundColor: '#FFEBEB' }]}>
                <Ionicons name="log-out-outline" size={20} color={RED} />
              </View>
              <Text style={[styles.menuItemText, { color: RED, fontWeight: '700' }]}>Log Out</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={RED} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',          screen: 'DriverHome' },
          { icon: 'list-outline',          screen: 'DriverOrders' },
          { icon: 'wallet-outline',        screen: 'DriverWallet' },
          { icon: 'person-outline',        screen: 'DriverProfile' },
        ].map((tab: any, i) => (
          <TouchableOpacity key={i} style={styles.navItem} onPress={() => navigation.navigate(tab.screen)}>
            <Ionicons name={tab.icon} size={24} color={i === 3 ? ORANGE : GREY} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16 },
  headerIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: LIGHT_BG, justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  scroll: { paddingHorizontal: 24, paddingBottom: 120, paddingTop: 10 },
  
  profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
  profileTexts: { flex: 1 },
  nameText: { fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 4 },
  roleText: { fontSize: 14, color: GREY, marginBottom: 8 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#E4F9F0', alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#00E58F' },
  statusText: { fontSize: 12, color: '#00E58F', fontWeight: 'bold' },

  menuGroup: { backgroundColor: '#F8F9FA', borderRadius: 20, paddingVertical: 8, marginBottom: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16 },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 40, height: 40, borderRadius: 12, backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center', marginRight: 16, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  menuItemText: { fontSize: 15, fontWeight: '600', color: NAVY },
  divider: { height: 1, backgroundColor: '#EDEFF2', marginHorizontal: 16 },

  navbar: { position: 'absolute', bottom: 20, left: 20, right: 20, height: 64, backgroundColor: '#FFFFFF', borderRadius: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 20, elevation: 12 },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
