import React, { useState, useCallback, useRef } from 'react';
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
  ScrollView,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';

const CATEGORIES = ['All', 'Breakfast', 'Lunch', 'Dinner'];

export default function ChefFoodListScreen({ navigation }: any) {
  const { foods, loadFoods, categories, loadCategories } = useStore();
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
    try {
      navigation.navigate('ChefFoodDetails', { item });
    } catch (err: any) {
      Alert.alert('Nav Error', err?.message ?? String(err));
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => goToDetails(item)}
      style={({ pressed }) => [styles.foodCard, { opacity: pressed ? 0.85 : 1 }]}
    >
      <Image 
        source={{ uri: item.imageUrl || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&q=80' }} 
        style={styles.foodImage} 
        resizeMode="cover" 
      />
      <View style={styles.foodInfo}>
        <View style={styles.cardTopRow}>
          <Text style={styles.foodName}>{item.name}</Text>
          <TouchableOpacity
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            onPress={(e) => {
              e.stopPropagation();
              Alert.alert(
                'Item Info',
                `View details for "${item.name}"?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'View Details', 
                    onPress: () => goToDetails(item)
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
        <View style={styles.priceRow}>
          <Text style={styles.price}>Rs.{item.price}</Text>
          <Text style={styles.pickupLabel}>{item.pickupType}</Text>
        </View>
        <View style={styles.ratingRow}>
          <Ionicons name="star" size={13} color="#FFB800" />
          <Text style={styles.ratingText}>{item.rating}</Text>
          <Text style={styles.reviewCount}>({item.reviews} Review)</Text>
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
        <Text style={styles.headerTitle}>My Food List</Text>
        <View style={{ width: 28 }} />
      </View>

      {/* Category Tabs - horizontal scroll */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsContent}
      >
        {['All', ...categories.map((c: any) => c.name)].map((cat, idx) => {
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
      </ScrollView>

      {/* Item count */}
      <Text style={styles.totalCount}>Total {filtered.length.toString().padStart(2, '0')} items</Text>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Nav */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline', screen: 'ChefHome' },
          { icon: 'list-outline', screen: 'ChefOrders' },
          { icon: 'fast-food-outline', screen: 'ChefFoodList', active: true },
          { icon: 'notifications-outline', screen: 'ChefNotifications' },
        ].map((tab: any, i) => (
          <TouchableOpacity
            key={i}
            style={styles.navItem}
            onPress={() => navigation?.navigate?.(tab.screen)}
          >
            <Ionicons name={tab.icon} size={24} color={tab.active ? ORANGE : GREY} />
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

  tabsScroll: {
    paddingVertical: 8,
    maxHeight: 56,
  },
  tabsContent: {
    paddingHorizontal: 20,
    gap: 8,
    alignItems: 'center',
    flexDirection: 'row',
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
  foodImage: { width: 90, height: 90, borderRadius: 12 },
  foodInfo: { flex: 1, paddingHorizontal: 12, paddingVertical: 8 },

  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 5,
  },
  foodName: { fontSize: 14, fontWeight: '700', color: NAVY, flex: 1, marginRight: 8 },

  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: ORANGE + '20',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  categoryBadgeText: { fontSize: 11, fontWeight: '600', color: ORANGE },

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
