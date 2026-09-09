import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Pressable,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';
const LIGHT_BG = '#F2F3F7';

type Category = 'All' | 'Breakfast' | 'Lunch' | 'Dinner';

interface FoodItem {
  id: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  reviews: number;
  pickupType: string;
  chef: string;
  image: string;
}

const ALL_ITEMS: FoodItem[] = [
  {
    id: '1',
    name: 'Chicken Thai Biriyani',
    category: 'Breakfast',
    price: 60,
    rating: 4.9,
    reviews: 10,
    pickupType: 'Pick UP',
    chef: 'Chef Mario',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&q=80',
  },
  {
    id: '2',
    name: 'Chicken Bhuna',
    category: 'Breakfast',
    price: 30,
    rating: 4.9,
    reviews: 10,
    pickupType: 'Pick UP',
    chef: 'Chef Ana',
    image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200&q=80',
  },
  {
    id: '3',
    name: 'Mazalichiken Halim',
    category: 'Breakfast',
    price: 25,
    rating: 4.9,
    reviews: 10,
    pickupType: 'Pick UP',
    chef: 'Chef Mario',
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?w=200&q=80',
  },
  {
    id: '4',
    name: 'Grilled Salmon',
    category: 'Lunch',
    price: 55,
    rating: 4.8,
    reviews: 23,
    pickupType: 'Delivery',
    chef: 'Chef Ana',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&q=80',
  },
  {
    id: '5',
    name: 'Caesar Salad',
    category: 'Lunch',
    price: 22,
    rating: 4.7,
    reviews: 15,
    pickupType: 'Pick UP',
    chef: 'Chef Mario',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80',
  },
  {
    id: '6',
    name: 'Pasta Carbonara',
    category: 'Dinner',
    price: 40,
    rating: 4.9,
    reviews: 31,
    pickupType: 'Delivery',
    chef: 'Chef Ana',
    image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=200&q=80',
  },
  {
    id: '7',
    name: 'Butter Garlic Prawns',
    category: 'Dinner',
    price: 70,
    rating: 4.8,
    reviews: 18,
    pickupType: 'Pick UP',
    chef: 'Chef Mario',
    image: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=200&q=80',
  },
  {
    id: '8',
    name: 'Veggie Burrito Bowl',
    category: 'Lunch',
    price: 28,
    rating: 4.6,
    reviews: 12,
    pickupType: 'Delivery',
    chef: 'Chef Ana',
    image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=200&q=80',
  },
];

const CATEGORIES: Category[] = ['All', 'Breakfast', 'Lunch', 'Dinner'];

export default function AdminMenuScreen({ navigation }: any) {
  const { foods, categories, loadFoods, loadCategories, deleteProduct } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');

  useFocusEffect(
    useCallback(() => {
      loadFoods();
      loadCategories();
    }, [])
  );

  const filtered =
    selectedCategory === 'All'
      ? foods
      : foods.filter((v: any) => 
          (typeof v.category === 'string' && v.category === selectedCategory) || 
          (v.category?.name === selectedCategory)
        );

  const goToDetails = (item: any) => {
    navigation.navigate('AdminFoodDetails', { item });
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => goToDetails(item)}
      style={({ pressed }) => [styles.foodCard, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Image source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&q=80' }} style={styles.foodImage} resizeMode="cover" />
      <View style={styles.foodInfo}>
        <View style={styles.cardTopRow}>
          <Text style={styles.foodName}>{item.name}</Text>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={(e) => {
              e.stopPropagation();
              Alert.alert(
                'Manage Item',
                `What do you want to do with "${item.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                      await deleteProduct(item._id);
                    }
                  },
                  { 
                    text: 'Edit', 
                    onPress: () => navigation.navigate('AdminAddItem', { item }) 
                  },
                ]
              );
            }}
          >
            <Ionicons name="ellipsis-horizontal" size={18} color={GREY} />
          </TouchableOpacity>
        </View>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {item.category?.name || (typeof item.category === 'string' ? item.category : '') || 'Category'}
          </Text>
        </View>

        <Text style={styles.chefLabel}>👨‍🍳 {item.chef || 'Chef Mario'}</Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs.{item.price}</Text>
          <Text style={styles.pickupLabel}>{item.isAvailable ? 'Available' : 'Sold Out'}</Text>
        </View>

        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating || '0.0'}</Text>
          <Text style={styles.reviewCount}>(0 Reviews)</Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Platform Menu</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Category Tabs */}
      <View style={styles.tabs}>
        {['All', ...categories.map((c: any) => c.name)].map((cat) => {
          const active = selectedCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              style={[styles.catTab, active && styles.catTabActive]}
              onPress={() => setSelectedCategory(cat)}
            >
              <Text style={[styles.catTabText, active && styles.catTabTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Item count */}
      <Text style={styles.totalCount}>
        Total {filtered.length.toString().padStart(2, '0')} items
      </Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB — Add New Item */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation?.navigate?.('AdminAddItem')}
      >
        <Ionicons name="add" size={28} color={WHITE} />
      </TouchableOpacity>

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',          screen: 'AdminHome' },
          { icon: 'list-outline',          screen: 'AdminOrders' },
          { icon: 'people-outline',        screen: 'AdminUsers' },
          { icon: 'notifications-outline', screen: 'AdminNotifications' },
        ].map((tab: any, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigation?.navigate?.(tab.screen)}
          >
            <Ionicons name={tab.icon} size={24} color={GREY} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: WHITE },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: NAVY },

  tabs: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 8,
    gap: 6,
  },
  catTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#EDEDED',
  },
  catTabActive: {
    backgroundColor: ORANGE + '18',
    borderColor: ORANGE,
  },
  catTabText: { fontSize: 12, fontWeight: '600', color: GREY },
  catTabTextActive: { color: ORANGE },

  totalCount: {
    fontSize: 13,
    color: GREY,
    marginLeft: 20,
    marginBottom: 8,
  },

  list: { paddingHorizontal: 20, paddingBottom: 100 },

  foodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 14,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  foodImage: { width: 90, height: 100, borderRadius: 12 },
  foodInfo: { flex: 1, paddingHorizontal: 12, paddingVertical: 8 },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  foodName: { fontSize: 14, fontWeight: '700', color: NAVY, flex: 1, marginRight: 8 },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ORANGE + '20',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 4,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '600', color: ORANGE },

  chefLabel: { fontSize: 11, color: GREY, marginBottom: 4 },

  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: { fontSize: 16, fontWeight: '800', color: NAVY },
  pickupLabel: { fontSize: 11, color: GREY, fontWeight: '500' },

  ratingRow: { flexDirection: 'row', alignItems: 'center', gap: 3 },
  ratingText: { fontSize: 12, fontWeight: '700', color: NAVY },
  reviewCount: { fontSize: 11, color: GREY },

  fab: {
    position: 'absolute',
    bottom: 100,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: ORANGE,
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 10,
  },

  navbar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    height: 64,
    backgroundColor: WHITE,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
    paddingHorizontal: 10,
  },
  navItem: { flex: 1, alignItems: 'center', paddingVertical: 10 },
});
