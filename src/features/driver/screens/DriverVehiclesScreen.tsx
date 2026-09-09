import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#FF7A28';
const NAVY   = '#1C1C2E';
const GREY   = '#9E9E9E';
const WHITE  = '#FFFFFF';
const BG     = '#F8F9FA';

const VEHICLE_TYPES = [
  { id: 'bicycle', label: 'Bicycle', icon: 'bicycle-outline' },
  { id: 'motorcycle', label: 'Motorcycle', icon: 'car-sport-outline' },
  { id: 'car', label: 'Car', icon: 'car-outline' },
  { id: 'van', label: 'Van / Truck', icon: 'bus-outline' },
];

export default function DriverVehiclesScreen({ navigation }: any) {
  const [selected, setSelected] = useState('motorcycle');

  const handleSave = () => {
    Alert.alert('Saved', `Vehicle type set to: ${VEHICLE_TYPES.find(v => v.id === selected)?.label}`);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Vehicles</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.subtitle}>Select your delivery vehicle type</Text>

        {VEHICLE_TYPES.map((v) => {
          const active = selected === v.id;
          return (
            <TouchableOpacity
              key={v.id}
              style={[styles.vehicleCard, active && styles.vehicleCardActive]}
              onPress={() => setSelected(v.id)}
            >
              <View style={[styles.vehicleIconBox, active && { backgroundColor: ORANGE }]}>
                <Ionicons name={v.icon as any} size={28} color={active ? WHITE : GREY} />
              </View>
              <Text style={[styles.vehicleLabel, active && { color: ORANGE, fontWeight: '700' }]}>
                {v.label}
              </Text>
              <Ionicons
                name={active ? 'checkmark-circle' : 'ellipse-outline'}
                size={22}
                color={active ? ORANGE : '#DEDEDE'}
              />
            </TouchableOpacity>
          );
        })}

        {/* Vehicle info card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={20} color={ORANGE} />
          <Text style={styles.infoText}>
            Your vehicle type affects the delivery orders assigned to you. Larger vehicles may be assigned to bulk orders.
          </Text>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          <Text style={styles.saveBtnText}>Save Vehicle</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:            { flex: 1, backgroundColor: WHITE },
  header:          { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle:     { fontSize: 18, fontWeight: '700', color: NAVY },
  scroll:          { paddingHorizontal: 24, paddingBottom: 60, paddingTop: 10 },
  subtitle:        { fontSize: 14, color: GREY, marginBottom: 20 },

  vehicleCard:     { flexDirection: 'row', alignItems: 'center', backgroundColor: BG, borderRadius: 18, padding: 18, marginBottom: 14, borderWidth: 2, borderColor: 'transparent' },
  vehicleCardActive:{ borderColor: ORANGE, backgroundColor: '#FFF6EF' },
  vehicleIconBox:  { width: 52, height: 52, borderRadius: 14, backgroundColor: '#EDEFF2', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  vehicleLabel:    { flex: 1, fontSize: 16, color: NAVY, fontWeight: '600' },

  infoCard:        { flexDirection: 'row', backgroundColor: '#FFF6EF', borderRadius: 14, padding: 14, marginBottom: 24, gap: 10, alignItems: 'flex-start' },
  infoText:        { flex: 1, fontSize: 13, color: '#8C4A00', lineHeight: 19 },

  saveBtn:         { backgroundColor: ORANGE, borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center' },
  saveBtnText:     { color: WHITE, fontSize: 16, fontWeight: '700' },
});
