import React from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

export default function FavouriteScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favourite</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Item 1 */}
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <Ionicons name="fast-food" size={24} color={Colors.primary} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Spicy Chicken Burger</Text>
            <Text style={styles.cardSub}>Burger King • Rs.12.99</Text>
          </View>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="heart" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Item 2 */}
        <View style={styles.card}>
          <View style={[styles.iconContainer, { backgroundColor: '#F0F5FA' }]}>
            <Ionicons name="pizza" size={24} color={'#5C61F4'} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Pepperoni Pizza</Text>
            <Text style={styles.cardSub}>Dominos • Rs.15.00</Text>
          </View>
          <TouchableOpacity style={styles.actionIcon}>
            <Ionicons name="heart" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

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
  iconContainer: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.white, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: Colors.text, marginBottom: 4 },
  cardSub: { fontSize: 13, color: Colors.textSecondary },
  actionIcon: { padding: 8 },
});
