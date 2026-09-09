import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { useStore } from '@/store/useStore';

const FOOD_DATABASE = [
  { id: '1', name: 'Pizza Calzone European', restaurant: 'Uttora Coffe House', price: 32, rating: 4.7, category: 'Pizza', icon: 'pizza' },
  { id: '1b', name: 'Classic Margherita', restaurant: 'Italiano', price: 28, rating: 4.6, category: 'Pizza', icon: 'pizza' },
  
  { id: '2', name: 'Spicy Chili Hot Dog', restaurant: 'NYC Grill', price: 12, rating: 4.5, category: 'Hot Dog', icon: 'fast-food' },
  { id: '2b', name: 'Classic NYC Dog', restaurant: 'NYC Grill', price: 9, rating: 4.2, category: 'Hot Dog', icon: 'fast-food' },

  { id: '3', name: 'Beef Double Burger', restaurant: 'Burger King', price: 18, rating: 4.8, category: 'Burger', icon: 'fast-food' },
  { id: '3b', name: 'Cheese Burger', restaurant: 'Burger Shack', price: 15, rating: 4.6, category: 'Burger', icon: 'fast-food' },

  { id: '5', name: 'Spicy Ramen', restaurant: 'Tokyo Bistro', price: 22, rating: 4.9, category: 'Asian', icon: 'restaurant' },
  { id: '6', name: 'Beef Tacos', restaurant: 'Mexican Fiesta', price: 14, rating: 4.5, category: 'Mexican', icon: 'restaurant' },
  { id: '7', name: 'Caesar Salad', restaurant: 'Green Bowl', price: 16, rating: 4.7, category: 'Salad', icon: 'leaf' },
  { id: '8', name: 'Chocolate Cake', restaurant: 'Sweet Treats', price: 8, rating: 4.8, category: 'Dessert', icon: 'ice-cream' },
  { id: '9', name: 'Iced Latte', restaurant: 'Coffee Hub', price: 5, rating: 4.4, category: 'Drink', icon: 'cafe' },
];

export default function CategoryDetailsScreen({ route, navigation }: any) {
  const { category } = route.params;
  const { foods } = useStore();
  
  const filteredFoods = foods.filter(food => 
    (typeof food.category === 'string' && food.category === category) ||
    (food.category?.name === category)
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <View style={styles.foodList}>
          {filteredFoods.map(food => (
            <TouchableOpacity 
              key={food._id} 
              style={styles.foodCard} 
              onPress={() => navigation.navigate('FoodDetails', { foodId: food._id })}
            >
              <View style={styles.foodImageContainer}>
                {food.imageUrl ? (
                  <Image
                    source={{ uri: food.imageUrl }}
                    style={{ width: '100%', height: '100%', borderRadius: 20 }}
                    resizeMode="cover"
                  />
                ) : (
                  <Ionicons name="fast-food" size={40} color={Colors.white} />
                )}
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                <Text style={styles.foodDesc} numberOfLines={1}>{food.description}</Text>
                
                <View style={styles.foodMetaRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.white} style={{ marginRight: 4 }} />
                    <Text style={styles.ratingText}>{food.rating || '4.5'}</Text>
                  </View>
                  <Text style={styles.foodPrice}>Rs.{food.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          
          {filteredFoods.length === 0 && (
             <View style={styles.emptyContainer}>
               <Ionicons name="fast-food-outline" size={64} color="#E8EAED" />
               <Text style={styles.emptyText}>No available foods in this category yet.</Text>
             </View>
          )}
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

  foodList: { marginTop: 4 },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  foodImageContainer: {
    width: 100, height: 100, borderRadius: 20, backgroundColor: '#FFD29F', justifyContent: 'center', alignItems: 'center', marginRight: 16,
  },
  foodInfo: { flex: 1, justifyContent: 'center' },
  foodName: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 4 },
  foodDesc: { fontSize: 13, color: Colors.textSecondary, marginBottom: 12 },
  foodMetaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF7A28', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  ratingText: { color: Colors.white, fontSize: 13, fontWeight: 'bold' },
  foodPrice: { color: Colors.text, fontSize: 18, fontWeight: 'bold' },
  
  emptyContainer: { alignItems: 'center', marginTop: 80 },
  emptyText: { textAlign: 'center', color: Colors.textSecondary, fontSize: 15, marginTop: 16 },
});
