import React, { useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Alert } from 'react-native';
import { Colors } from '@/theme/colors';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { AuthHeader } from '../components/AuthHeader';

const { height } = Dimensions.get('window');
import { API_BASE_URL as API_URL } from '@/api/config';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendCode = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Verification', { email, mode: 'resetPassword' });
      } else {
        Alert.alert('Error', data.message || 'Failed to send code');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Forgot Password"
        subtitle="Please enter your email to receive a reset code"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        <AppInput
          label="EMAIL"
          placeholder="example@gmail.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <AppButton
          title="SEND CODE"
          onPress={handleSendCode}
          loading={isLoading}
          style={{ marginTop: 24 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginTop: -20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
});
