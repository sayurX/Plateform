import React, { useState } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Colors } from '@/theme/colors';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { AuthHeader } from '../components/AuthHeader';

import { API_BASE_URL as API_URL } from '@/api/config';

export default function ResetPasswordScreen({ navigation, route }: any) {
  const { email, code } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, password }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Password reset successfully!', [
          { text: 'Login Now', onPress: () => navigation.navigate('Login') }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AuthHeader
        title="Reset Password"
        subtitle="Please enter your new password"
        onBack={() => navigation.goBack()}
      />

      <View style={styles.form}>
        <AppInput
          label="NEW PASSWORD"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <AppInput
          label="CONFIRM PASSWORD"
          placeholder="********"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <AppButton
          title="RESET PASSWORD"
          onPress={handleReset}
          loading={isLoading}
          style={{ marginTop: 24 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flexGrow: 1,
  },
  form: {
    paddingHorizontal: 24,
    paddingTop: 40,
    marginTop: -20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
});
