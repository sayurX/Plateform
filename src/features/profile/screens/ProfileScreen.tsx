import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/Avatar';

const MENU_GROUPS = [
  [
    { id: '1', title: 'Personal Info', icon: 'person-outline', color: '#FF7A28', route: 'PersonalInfo' },
    { id: '2', title: 'Addresses', icon: 'map-outline', color: '#5C61F4', route: 'Addresses' },
  ],
  [
    { id: '3', title: 'Cart', icon: 'bag-outline', color: '#2B84EA', route: 'Cart' },
    { id: 'new', title: 'Order History', icon: 'receipt-outline', color: '#00E58F', route: 'OrderHistory' },
    { id: '5', title: 'Notifications', icon: 'notifications-outline', color: '#FFB01D', route: 'Notifications' },
    { id: '6', title: 'Payment Method', icon: 'card-outline', color: '#2B84EA', route: 'PaymentMethod' },
  ],
  [
    { id: '7', title: 'FAQs', icon: 'help-circle-outline', color: '#FF7A28', route: 'FAQs' },
    { id: '8', title: 'User Reviews', icon: 'chatbubbles-outline', color: '#23C4D7', route: 'UserReviews' },
    { id: '9', title: 'Settings', icon: 'settings-outline', color: '#5C61F4', route: 'Settings' },
  ],
  [
    { id: '10', title: 'Log Out', icon: 'log-out-outline', color: '#FF4B4B', route: 'Login' },
  ]
];

export default function ProfileScreen({ navigation }: any) {
  const user = useStore((state) => state.user);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('PersonalInfo')}>
            <Ionicons name="ellipsis-horizontal" size={24} color={Colors.text} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <Avatar uri={user?.avatarUrl} name={user?.fullName} size={80} style={{ marginRight: 16 }} />
          <View style={styles.profileTexts}>
            <Text style={styles.name}>{user?.fullName || 'Vishal Khadok'}</Text>
            <Text style={styles.bio}>{user?.email || 'I love fast food'}</Text>
          </View>
        </View>

        {/* Menu Groups */}
        {MENU_GROUPS.map((group, groupIndex) => (
          <View key={groupIndex} style={styles.menuGroup}>
            {group.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem} 
                onPress={() => {
                  if (item.title === 'Log Out') {
                    useStore.getState().logout();
                  } else {
                    navigation.navigate(item.route, item.route === 'PaymentMethod' ? { mode: 'manage' } : undefined);
                  }
                }}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconCircle}>
                    <Ionicons name={item.icon as any} size={20} color={item.color} />
                  </View>
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={Colors.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  profileTexts: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  menuGroup: {
    backgroundColor: '#F7F8F9',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: Colors.text,
  },
});
