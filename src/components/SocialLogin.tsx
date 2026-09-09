import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/theme/colors';
import { Ionicons } from '@expo/vector-icons';

export const SocialLogin: React.FC = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#3b5998' }]}>
        <Ionicons name="logo-facebook" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#34A853' }]}>
        <Ionicons name="logo-google" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, { backgroundColor: '#000000' }]}>
        <Ionicons name="logo-apple" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginVertical: 20,
  },
  button: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
