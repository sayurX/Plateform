import React, { useState } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

export default function SettingsScreen({ navigation }: any) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [faceIdEnabled, setFaceIdEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.card} onPress={() => setPushEnabled(!pushEnabled)} activeOpacity={0.8}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Push Notifications</Text>
            <Text style={styles.cardText}>Receive alerts for your orders.</Text>
          </View>
          <View style={[styles.switchTrack, pushEnabled && styles.switchTrackActive]}>
             <View style={[styles.switchThumb, pushEnabled && styles.switchThumbActive]} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => setFaceIdEnabled(!faceIdEnabled)} activeOpacity={0.8}>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Face ID / Touch ID</Text>
            <Text style={styles.cardText}>Enable biometric authentication.</Text>
          </View>
          <View style={[styles.switchTrack, faceIdEnabled && styles.switchTrackActive]}>
             <View style={[styles.switchThumb, faceIdEnabled && styles.switchThumbActive]} />
          </View>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F6F8FA', borderRadius: 16, padding: 16, marginBottom: 16 },
  cardInfo: { flex: 1, paddingRight: 16 },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text, marginBottom: 6 },
  cardText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  switchTrack: { width: 44, height: 24, borderRadius: 12, backgroundColor: '#E8EAED', justifyContent: 'center', paddingHorizontal: 2 },
  switchTrackActive: { backgroundColor: Colors.primary },
  switchThumb: { width: 20, height: 20, borderRadius: 10, backgroundColor: Colors.white },
  switchThumbActive: { transform: [{ translateX: 20 }] },
});
