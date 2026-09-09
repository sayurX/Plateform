import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';
import { updateAddressApi } from '@/api/addressApi';

export default function EditAddressScreen({ navigation, route }: any) {
  const { address: initialAddress } = route.params || {};
  console.log('Edit Screen: loaded address:', initialAddress);
  
  const [label, setLabel] = useState(initialAddress?.label || 'Home');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [postCode, setPostCode] = useState(initialAddress?.postCode || '');
  const [apartment, setApartment] = useState(initialAddress?.apartment || '');
  const [isLoading, setIsLoading] = useState(false);

  const { token, setAddresses } = useStore();

  useEffect(() => {
    if (!initialAddress) {
      Alert.alert('Error', 'No address data found');
      navigation.goBack();
    }
  }, [initialAddress]);

  const handleSave = async () => {
    if (!street || !city) {
      Alert.alert('Error', 'Please fill in required fields (Street and City)');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Session expired. Please log in again.');
      return;
    }

    if (!initialAddress?._id) {
      Alert.alert('Error', 'Invalid address ID');
      return;
    }

    setIsLoading(true);
    try {
      const addressData = { label, street, city, postCode, apartment };
      const updatedAddresses = await updateAddressApi(token, initialAddress._id, addressData);
      setAddresses(updatedAddresses);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        
        {/* Map Header Area */}
        <View style={styles.mapContainer}>
          <Image source={require('@/assets/images/add_address_map.png')} style={styles.mapImage} resizeMode="cover" />
          
          <TouchableOpacity 
            style={{ position: 'absolute', top: 0, left: 0, width: 140, height: 140, zIndex: 10, elevation: 10 }} 
            onPress={() => navigation.goBack()}
          />
        </View>

        {/* Bottom Sheet Form */}
        <View style={styles.bottomSheet}>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CITY</Text>
              <View style={styles.addressInputContainer}>
                <Ionicons name="location-sharp" size={20} color={Colors.textSecondary} style={styles.addressIcon} />
                <TextInput 
                  style={styles.addressInput} 
                  value={city}
                  onChangeText={setCity}
                  placeholder="San Francisco" 
                  placeholderTextColor={Colors.textSecondary} 
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>STREET</Text>
                <TextInput 
                  style={styles.input} 
                  value={street}
                  onChangeText={setStreet}
                  placeholder="Market St" 
                  placeholderTextColor={Colors.textSecondary} 
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>POST CODE</Text>
                <TextInput 
                  style={styles.input} 
                  value={postCode}
                  onChangeText={setPostCode}
                  placeholder="13204" 
                  placeholderTextColor={Colors.textSecondary} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>APPARTMENT</Text>
              <TextInput 
                style={styles.input} 
                value={apartment}
                onChangeText={setApartment}
                placeholder="2118" 
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>LABEL AS</Text>
              <View style={styles.labelChips}>
                {['Home', 'Work', 'Other'].map((l) => (
                  <TouchableOpacity 
                    key={l} 
                    style={[styles.chip, label === l && styles.chipActive]}
                    onPress={() => setLabel(l)}
                  >
                    <Text style={[styles.chipText, label === l && styles.chipTextActive]}>{l}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

          </ScrollView>

          <View style={styles.footer}>
            <AppButton title="SAVE CHANGES" onPress={handleSave} loading={isLoading} />
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  mapContainer: { height: 320, width: '100%', position: 'relative' },
  mapImage: { width: '100%', height: '100%' },
  bottomSheet: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    marginTop: -32,
    paddingTop: 32,
  },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 20 },
  inputGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: Colors.text,
  },
  addressInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    paddingHorizontal: 16,
  },
  addressIcon: { marginRight: 8 },
  addressInput: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 15,
    color: Colors.text,
  },
  labelChips: { flexDirection: 'row', gap: 12 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#F6F8FA',
  },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: 14, color: Colors.text, fontWeight: '500' },
  chipTextActive: { color: Colors.white },
  footer: { paddingHorizontal: 24, paddingBottom: 34, paddingTop: 10, backgroundColor: Colors.white },
});
