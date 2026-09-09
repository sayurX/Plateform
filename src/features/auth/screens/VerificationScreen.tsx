import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { AuthHeader } from '../components/AuthHeader';
import { useStore } from '@/store/useStore';

import { API_BASE_URL as API_URL } from '@/api/config';

export default function VerificationScreen({ navigation, route }: any) {
  const { email = 'example@gmail.com', mode, devCode } = route.params || {};
  const [otp, setOtp] = useState(
    devCode ? devCode.split('') : ['', '', '', '', '', '']
  );
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(50);
  const [emailFailed, setEmailFailed] = useState(!!devCode);

  // Refs for each input box
  const inputRefs = useRef<any[]>([]);

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      // Handle paste or multiple characters
      value = value.slice(-1);
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus move logic
    if (value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    setIsLoading(true);
    try {
      const endpoint = mode === 'resetPassword' ? 'verify-reset-code' : 'verify-email';
      const response = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        if (mode === 'resetPassword') {
          navigation.navigate('ResetPassword', { email, code });
        } else {
          // Set user + token in store → AppNavigator detects token and
          // automatically switches to the App stack with the correct initial route
          if (data.user && data.token) {
            useStore.getState().setUser(data.user);
            useStore.getState().setToken(data.token);
            useStore.getState().setJustLoggedIn(true);
          } else if (data.user) {
            useStore.getState().setUser(data.user);
          }
          // No navigation.replace needed — AppNavigator handles it reactively
        }
      } else {
        Alert.alert('Error', data.message || 'Verification failed');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    try {
      const response = await fetch(`${API_URL}/auth/resend-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setTimer(50);
        Alert.alert('Success', 'Verification code resent!');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeader
        title="Verification"
        subtitle={
          <Text style={{ fontSize: 14, color: Colors.white, opacity: 0.8, marginTop: 8, textAlign: 'center', lineHeight: 22 }}>
            {'We have sent a 6-digit code to\n'}
            <Text style={{ fontWeight: 'bold', color: Colors.white }}>{email}</Text>
          </Text>
        }
        onBack={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {/* Dev fallback notice */}
        {emailFailed && (
          <View style={styles.devBanner}>
            <Text style={styles.devBannerText}>⚠️ Email delivery failed — code has been pre-filled for you.</Text>
          </View>
        )}
        <View style={styles.codeHeaderRow}>
          <Text style={styles.codeLabel}>CODE</Text>
          <View style={styles.resendRow}>
            <TouchableOpacity onPress={handleResend}>
              <Text style={[styles.resendLink, timer > 0 && { opacity: 0.5 }]}>Resend</Text>
            </TouchableOpacity>
            {timer > 0 && <Text style={styles.timerText}> in {timer}sec</Text>}
          </View>
        </View>

        <View style={styles.otpRow}>
          {otp.map((digit: string, index: number) => (
            <TextInput
              key={index}
              ref={(ref) => (inputRefs.current[index] = ref)}
              style={styles.otpInput}
              keyboardType="numeric"
              maxLength={1}
              value={digit}
              onChangeText={(text) => handleOtpChange(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              selectTextOnFocus
            />
          ))}
        </View>

        <AppButton 
          title="VERIFY" 
          onPress={handleVerify} 
          loading={isLoading}
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
    padding: 24,
    marginTop: -20,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    flex: 1,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
  },
  otpInput: {
    width: 48,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F0F5FA',
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.text,
  },
  codeHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  codeLabel: {
    fontSize: 13,
    color: '#8A8A9D',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendLink: {
    fontSize: 14,
    color: Colors.text,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  timerText: {
    fontSize: 14,
    color: '#8A8A9D',
  },
  devBanner: {
    backgroundColor: '#FFF3CD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB01D',
  },
  devBannerText: {
    fontSize: 12,
    color: '#856404',
    lineHeight: 18,
  },
});
