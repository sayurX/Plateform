import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#FF7A28';
const NAVY   = '#1C1C2E';
const GREY   = '#9E9E9E';
const WHITE  = '#FFFFFF';
const BG     = '#F8F9FA';

export default function DriverSettingsScreen({ navigation }: any) {
  const [notifications, setNotifications] = useState(true);
  const [orderAlerts,   setOrderAlerts]   = useState(true);
  const [locationShare, setLocationShare] = useState(true);
  const [darkMode,      setDarkMode]      = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.card}>
          <ToggleRow
            icon="notifications-outline"
            label="Push Notifications"
            sub="Receive app notifications"
            value={notifications}
            onToggle={setNotifications}
          />
          <Divider />
          <ToggleRow
            icon="restaurant-outline"
            label="New Order Alerts"
            sub="Alert when a new order is available"
            value={orderAlerts}
            onToggle={setOrderAlerts}
          />
        </View>

        {/* Privacy */}
        <Text style={styles.sectionLabel}>Privacy</Text>
        <View style={styles.card}>
          <ToggleRow
            icon="location-outline"
            label="Share Location"
            sub="Allow real-time location tracking"
            value={locationShare}
            onToggle={setLocationShare}
          />
          <Divider />
          <ToggleRow
            icon="moon-outline"
            label="Dark Mode"
            sub="Coming soon"
            value={darkMode}
            onToggle={setDarkMode}
            disabled
          />
        </View>

        {/* App info */}
        <Text style={styles.sectionLabel}>App</Text>
        <View style={styles.card}>
          <NavRow icon="globe-outline" label="Language" value="English" />
          <Divider />
          <NavRow icon="information-circle-outline" label="App Version" value="1.0.0" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const ToggleRow = ({ icon, label, sub, value, onToggle, disabled = false }: any) => (
  <View style={styles.row}>
    <View style={[styles.iconBox, { backgroundColor: ORANGE + '18' }]}>
      <Ionicons name={icon} size={20} color={ORANGE} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={[styles.rowLabel, disabled && { color: GREY }]}>{label}</Text>
      {sub && <Text style={styles.rowSub}>{sub}</Text>}
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      disabled={disabled}
      trackColor={{ false: '#E0E0E0', true: ORANGE + '88' }}
      thumbColor={value ? ORANGE : '#FFF'}
    />
  </View>
);

const NavRow = ({ icon, label, value }: any) => (
  <View style={styles.row}>
    <View style={[styles.iconBox, { backgroundColor: '#F0F0F0' }]}>
      <Ionicons name={icon} size={20} color={GREY} />
    </View>
    <Text style={[styles.rowLabel, { flex: 1 }]}>{label}</Text>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const Divider = () => <View style={{ height: 1, backgroundColor: '#EDEFF2', marginHorizontal: 16 }} />;

const styles = StyleSheet.create({
  safe:         { flex: 1, backgroundColor: WHITE },
  header:       { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle:  { fontSize: 18, fontWeight: '700', color: NAVY },
  scroll:       { paddingHorizontal: 24, paddingBottom: 60, paddingTop: 10 },
  sectionLabel: { fontSize: 12, color: GREY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10, marginTop: 4 },
  card:         { backgroundColor: BG, borderRadius: 20, marginBottom: 20, overflow: 'hidden' },
  row:          { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  iconBox:      { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  rowLabel:     { fontSize: 15, color: NAVY, fontWeight: '600' },
  rowSub:       { fontSize: 12, color: GREY, marginTop: 2 },
  rowValue:     { fontSize: 14, color: GREY },
});
