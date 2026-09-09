import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';
import { addPaymentMethodApi } from '@/api/paymentApi';

export default function AddCardScreen({ navigation }: any) {
  const { token, user, setPaymentMethods } = useStore();
  const [cardHolder, setCardHolder] = useState(user?.fullName || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCardNumberChange = (text: string) => {
    const formatted = text.replace(/\D/g, '')
      .replace(/(\d{4})(?=\d)/g, '$1 ')
      .substring(0, 19);
    setCardNumber(formatted);
  };

  const handleExpiryChange = (text: string) => {
    const clean = text.replace(/\D/g, '').substring(0, 4);
    if (clean.length > 2) {
      setExpiryDate(clean.substring(0, 2) + '/' + clean.substring(2));
    } else {
      setExpiryDate(clean);
    }
  };

  const validate = () => {
    if (!cardHolder.trim()) {
      Alert.alert('Validation Error', 'Please enter card holder name');
      return false;
    }

    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (cleanNumber.length !== 16) {
      Alert.alert('Validation Error', 'Card number must be 16 digits');
      return false;
    }

    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert('Validation Error', 'Expiry date must be in MM/YY format');
      return false;
    }

    const [month, yearShort] = expiryDate.split('/').map(Number);
    if (month < 1 || month > 12) {
      Alert.alert('Validation Error', 'Invalid month in expiry date');
      return false;
    }

    const now = new Date();
    const fullYear = 2000 + yearShort;
    const expiry = new Date(fullYear, month - 1);
    if (expiry < new Date(now.getFullYear(), now.getMonth())) {
      Alert.alert('Validation Error', 'Card has expired');
      return false;
    }

    if (cvc.length < 3 || cvc.length > 4) {
      Alert.alert('Validation Error', 'CVC must be 3 or 4 digits');
      return false;
    }

    return true;
  };

  const handleSave = async () => {
    if (!validate()) return;

    if (!token) {
      Alert.alert('Error', 'Session expired. Please log in again.');
      return;
    }

    setIsLoading(true);
    try {
      const cleanNumber = cardNumber.replace(/\s/g, '');
      const cardType = cleanNumber.startsWith('4') ? 'Visa' : 'Mastercard';
      const paymentData = {
        cardHolder,
        cardNumber: cleanNumber,
        expiryDate,
        cardType,
        cvc, // Note: Storing CVC is generally not recommended for PCI compliance
        isDefault: false
      };
      const updatedMethods = await addPaymentMethodApi(token, paymentData);
      setPaymentMethods(updatedMethods);
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to save card');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="close" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Card</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.inputGroup}>
            <Text style={styles.label}>CARD HOLDER NAME</Text>
            <TextInput 
              style={styles.input} 
              value={cardHolder}
              onChangeText={setCardHolder}
              placeholder="Full Name" 
              placeholderTextColor={Colors.textSecondary} 
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>CARD NUMBER</Text>
            <TextInput 
              style={styles.input} 
              value={cardNumber}
              onChangeText={handleCardNumberChange}
              placeholder="XXXX XXXX XXXX XXXX" 
              keyboardType="numeric" 
              maxLength={19}
              placeholderTextColor={Colors.textSecondary} 
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 12 }]}>
              <Text style={styles.label}>EXPIRE DATE</Text>
              <TextInput 
                style={styles.input} 
                value={expiryDate}
                onChangeText={handleExpiryChange}
                placeholder="mm/yy" 
                keyboardType="numeric"
                maxLength={5}
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>CVC</Text>
              <TextInput 
                style={styles.input} 
                value={cvc}
                onChangeText={(text) => setCvc(text.replace(/\D/g, '').substring(0, 4))}
                placeholder="***" 
                secureTextEntry 
                keyboardType="numeric" 
                maxLength={4}
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>
          </View>

        </ScrollView>

        <View style={styles.footer}>
          <AppButton title="ADD CARD" onPress={handleSave} loading={isLoading} />
        </View>
      </KeyboardAvoidingView>
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
  
  inputGroup: { marginBottom: 20 },
  row: { flexDirection: 'row' },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },
});
