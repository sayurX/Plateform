import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

const ALL_CATEGORIES = [
  { id: '1', name: 'Hot Dog', icon: '🌭', color: '#FFF0E6' },
  { id: '2', name: 'Burger', icon: '🍔', color: '#F9E5FF' },
  { id: '3', name: 'Pizza', icon: '🍕', color: '#E4F9F0' },
  { id: '4', name: 'Mexican', icon: '🌮', color: '#E0E8F2' },
  { id: '5', name: 'Asian', icon: '🍜', color: '#FFF0E6' },
  { id: '6', name: 'Dessert', icon: '🍰', color: '#F9E5FF' },
  { id: '7', name: 'Drink', icon: '🥤', color: '#E4F9F0' },
  { id: '8', name: 'Salad', icon: '🥗', color: '#E0E8F2' },
];

export default function CategoriesScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Categories</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.gridContainer}>
          {ALL_CATEGORIES.map((cat) => (
             <TouchableOpacity key={cat.id} style={styles.gridItem} onPress={() => navigation.navigate('CategoryDetails', { category: cat.name })}>
               <View style={[styles.iconContainer, { backgroundColor: cat.color }]}>
                 <Text style={styles.emoji}>{cat.icon}</Text>
               </View>
               <Text style={styles.catName}>{cat.name}</Text>
             </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, paddingTop: 16 },
  gridContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 16 },
  gridItem: { 
    width: '47%', 
    backgroundColor: '#F6F8FA', 
    borderRadius: 24, 
    padding: 24, 
    alignItems: 'center',
    marginBottom: 4,
  },
  iconContainer: {
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', marginBottom: 16
  },
  emoji: { fontSize: 32 },
  catName: { fontSize: 15, fontWeight: 'bold', color: Colors.text }
});
