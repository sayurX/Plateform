import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';
import { addAddressApi } from '@/api/addressApi';

export default function AddNewAddressScreen({ navigation }: any) {
  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [postCode, setPostCode] = useState('');
  const [apartment, setApartment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { token, setAddresses } = useStore();

  const handleSave = async () => {
    console.log('SAVE pressed. Token:', token ? 'Exists' : 'MISSING');
    if (!street || !city) {
      Alert.alert('Error', 'Please fill in Street and City');
      return;
    }

    if (!token) {
      Alert.alert('Error', 'Session expired. Please log in again.');
      return;
    }

    setIsLoading(true);
    try {
      const addressData = {
        label,
        street,
        city,
        postCode,
        apartment,
        isDefault: false
      };
      console.log('Sending address data:', addressData);
      const updatedAddresses = await addAddressApi(token, addressData);
      console.log('Update success! New address count:', updatedAddresses.length);
      setAddresses(updatedAddresses);
      navigation.goBack();
    } catch (error: any) {
      console.error('Save address error:', error);
      Alert.alert('Error', `Failed to save address: ${error.message || 'Unknown error'}`);
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
          
          {/* Massive invisible hit area for back button, positioned at absolute top-left */}
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
                  placeholder="San Francisco" 
                  value={city}
                  onChangeText={setCity}
                  placeholderTextColor={Colors.textSecondary} 
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
                <Text style={styles.label}>STREET</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="Market St" 
                  value={street}
                  onChangeText={setStreet}
                  placeholderTextColor={Colors.textSecondary} 
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>POST CODE</Text>
                <TextInput 
                  style={styles.input} 
                  placeholder="94103" 
                  value={postCode}
                  onChangeText={setPostCode}
                  placeholderTextColor={Colors.textSecondary} 
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>APPARTMENT</Text>
              <TextInput 
                style={styles.input} 
                placeholder="Apt 123" 
                value={apartment}
                onChangeText={setApartment}
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
            <AppButton title="SAVE LOCATION" onPress={handleSave} loading={isLoading} />
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
  mapOverlay: { position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 10 },
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
