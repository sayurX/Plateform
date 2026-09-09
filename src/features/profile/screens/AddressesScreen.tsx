import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';
import { deleteAddressApi } from '@/api/addressApi';

export default function AddressesScreen({ navigation }: any) {
  const { addresses, loadAddresses, token, setAddresses, currentAddress } = useStore();

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    console.log('AddressesScreen: Current addresses in store:', addresses);
  }, [addresses]);

  const handleDelete = async (addressId: string) => {
    if (!token) return;
    
    Alert.alert(
      'Delete Address',
      'Are you sure you want to remove this address?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedAddresses = await deleteAddressApi(token, addressId);
              setAddresses(updatedAddresses);
            } catch (error) {
              Alert.alert('Error', 'Failed to delete address');
            }
          }
        }
      ]
    );
  };

  const getIconForLabel = (label: string) => {
    switch (label?.toUpperCase()) {
      case 'HOME': return 'home-outline';
      case 'WORK': return 'briefcase-outline';
      default: return 'location-outline';
    }
  };
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Address</Text>
      </View>
 
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Current Location Card */}
        <View style={[styles.addressCard, { borderLeftWidth: 4, borderLeftColor: Colors.primary }]}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={24} color={Colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>CURRENT LOCATION</Text>
              <View style={styles.cardActions}>
                <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
              </View>
            </View>
            <Text style={styles.cardAddress}>{currentAddress}</Text>
          </View>
        </View>

        {/* Dynamic Address Cards */}
        {addresses.map((address) => {
          const fullAddr = `${address.street}, ${address.city}`;
          const isSelected = currentAddress === fullAddr;
          return (
            <TouchableOpacity 
              key={address._id} 
              style={[styles.addressCard, isSelected && { borderColor: Colors.primary, borderWidth: 1 }]}
              onPress={() => {
                useStore.getState().setCurrentAddress(fullAddr);
                navigation.goBack();
              }}
            >
              <View style={styles.iconContainer}>
                <Ionicons name={getIconForLabel(address.label) as any} size={24} color={address.label?.toUpperCase() === 'WORK' ? '#5C61F4' : Colors.primary} />
              </View>
              <View style={styles.cardInfo}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{address.label?.toUpperCase()}</Text>
                  <View style={styles.cardActions}>
                    <TouchableOpacity 
                      style={styles.actionIcon} 
                      onPress={(e) => {
                        e.stopPropagation();
                        navigation.navigate('EditAddress', { address });
                      }}
                    >
                      <Ionicons name="create-outline" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.actionIcon} 
                      onPress={(e) => {
                        e.stopPropagation();
                        handleDelete(address._id);
                      }}
                    >
                      <Ionicons name="trash-outline" size={20} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={styles.cardAddress}>
                  {address.apartment ? `${address.apartment}, ` : ''}{address.street}, {address.city}{address.postCode ? ` ${address.postCode}` : ''}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {addresses.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved addresses found.</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <AppButton title="ADD NEW ADDRESS" onPress={() => navigation.navigate('AddNewAddress')} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
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
  addressCard: {
    flexDirection: 'row',
    backgroundColor: '#F6F8FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: { flex: 1 },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: Colors.text, letterSpacing: 0.5 },
  cardActions: { flexDirection: 'row', gap: 12 },
  actionIcon: { padding: 2 },
  cardAddress: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { color: Colors.textSecondary, fontSize: 16 }
});
