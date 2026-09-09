import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, Image, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/Avatar';
import * as ImagePicker from 'expo-image-picker';

import { API_BASE_URL as API_URL } from '@/api/config';

export default function PersonalInfoScreen({ navigation }: any) {
  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);
  const token = useStore((state) => state.token);

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Allow access to gallery to change your profile picture.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      setAvatarUrl(result.assets[0].uri);
    }
  };

  const handleSave = async () => {
    if (!fullName) {
      Alert.alert('Error', 'Full name is required');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/update-profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          phone,
          bio,
          avatarUrl
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setUser(data.user);
        Alert.alert('Success', 'Profile updated successfully', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      } else {
        Alert.alert('Error', data.message || 'Failed to update profile');
      }
    } catch (error) {
      Alert.alert('Error', 'Connection failed');
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
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Avatar Area */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarWrapper}>
              <Avatar uri={avatarUrl} name={fullName} size={100} />
              <TouchableOpacity style={styles.editBadge} onPress={pickImage}>
                <Ionicons name="pencil" size={14} color={Colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>FULL NAME</Text>
              <TextInput 
                style={styles.input} 
                value={fullName} 
                onChangeText={setFullName}
                placeholder="Your full name"
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput 
                style={[styles.input, { opacity: 0.6 }]} 
                value={user?.email} 
                editable={false}
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>PHONE NUMBER</Text>
              <TextInput 
                style={styles.input} 
                value={phone} 
                onChangeText={setPhone}
                placeholder="e.g. +1 234 567 890"
                keyboardType="phone-pad" 
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>BIO</Text>
              <TextInput 
                style={[styles.input, styles.textArea]} 
                value={bio} 
                onChangeText={setBio}
                placeholder="Tell us about yourself"
                multiline 
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor={Colors.textSecondary} 
              />
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <AppButton title="SAVE" onPress={handleSave} loading={isLoading} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },
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
  avatarContainer: { alignItems: 'center', marginTop: 24, marginBottom: 32 },
  avatarWrapper: { position: 'relative' },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.white,
  },
  form: { flex: 1 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.textSecondary, marginBottom: 8, letterSpacing: 0.5 },
  input: {
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: Colors.text,
  },
  textArea: { minHeight: 100, paddingTop: 16 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },
});
