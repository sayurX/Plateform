import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/theme/colors';
import { AppInput } from '@/components/AppInput';
import { AppButton } from '@/components/AppButton';
import { AuthHeader } from '../components/AuthHeader';

import { API_BASE_URL as API_URL } from '@/api/config';

export default function SignUpScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!name || !email || !phone || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    if (password !== retypePassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    // Basic phone validation
    const cleanPhone = phone.trim().replace(/\s/g, '');
    if (cleanPhone.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName: name, email, phone: cleanPhone, password }),
      });

      const data = await response.json();

      if (response.ok) {
        navigation.navigate('Verification', { email, devCode: data.devCode });
      } else {
        Alert.alert('Error', data.message || 'Registration failed');
      }
    } catch (error: any) {
      Alert.alert('Connection Error', `Failed to connect to ${API_URL}. \n\nError: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <AuthHeader 
        title="Sign Up" 
        subtitle="Please sign up to get started" 
        onBack={() => navigation.goBack()} 
      />
      
      <View style={styles.form}>
        <AppInput 
          label="NAME" 
          placeholder="John Doe" 
          value={name} 
          onChangeText={setName} 
        />
        <AppInput 
          label="EMAIL" 
          placeholder="example@gmail.com" 
          value={email} 
          onChangeText={setEmail} 
          keyboardType="email-address"
        />
        <AppInput
          label="PHONE NUMBER"
          placeholder="+94 77 123 4567"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
          textContentType="telephoneNumber"
          autoComplete="tel"
        />
        <AppInput
          label="PASSWORD"
          placeholder="********"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="newPassword"
          autoComplete="password-new"
        />
        <AppInput
          label="RE-TYPE PASSWORD"
          placeholder="********"
          value={retypePassword}
          onChangeText={setRetypePassword}
          secureTextEntry
          textContentType="none"
          autoComplete="off"
        />

        <AppButton 
          title="SIGN UP" 
          onPress={handleSignUp} 
          loading={isLoading}
          style={{ marginTop: 24 }}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginText}>LOG IN</Text>
          </TouchableOpacity>
        </View>
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
    padding: 24,
    marginTop: -20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 24,
    marginBottom: 40,
  },
  footerText: {
    color: Colors.textSecondary,
  },
  loginText: {
    color: Colors.primary,
    fontWeight: 'bold',
  },
});

