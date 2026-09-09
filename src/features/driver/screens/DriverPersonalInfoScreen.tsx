import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { Avatar } from '@/components/Avatar';

const ORANGE = '#FF7A28';
const NAVY   = '#1C1C2E';
const GREY   = '#9E9E9E';
const WHITE  = '#FFFFFF';
const BG     = '#F8F9FA';

export default function DriverPersonalInfoScreen({ navigation }: any) {
  const { user } = useStore();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.avatarRow}>
          <Avatar uri={user?.avatarUrl} name={user?.fullName || 'D'} size={90} />
          <Text style={styles.avatarHint}>Tap to change photo</Text>
        </View>

        {/* Fields — read-only display */}
        <View style={styles.card}>
          <InfoRow icon="person-outline" label="Full Name" value={user?.fullName || '—'} />
          <Divider />
          <InfoRow icon="mail-outline"   label="Email"     value={user?.email    || '—'} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const InfoRow = ({ icon, label, value }: { icon: string; label: string; value: string }) => (
  <View style={styles.fieldRow}>
    <Ionicons name={icon as any} size={20} color={ORANGE} style={{ marginRight: 12 }} />
    <View style={{ flex: 1 }}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Text style={styles.fieldValue}>{value}</Text>
    </View>
  </View>
);

const Divider = () => <View style={{ height: 1, backgroundColor: '#EDEFF2', marginHorizontal: 16 }} />;

const styles = StyleSheet.create({
  safe:        { flex: 1, backgroundColor: WHITE },
  header:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: NAVY },
  scroll:      { paddingHorizontal: 24, paddingBottom: 60, paddingTop: 10 },
  avatarRow:   { alignItems: 'center', marginBottom: 28 },
  avatarHint:  { fontSize: 12, color: GREY, marginTop: 8 },
  card:        { backgroundColor: BG, borderRadius: 20, overflow: 'hidden' },
  fieldRow:    { flexDirection: 'row', alignItems: 'center', padding: 16 },
  fieldLabel:  { fontSize: 11, color: GREY, textTransform: 'uppercase', marginBottom: 4 },
  fieldValue:  { fontSize: 15, color: NAVY, fontWeight: '600' },
});
