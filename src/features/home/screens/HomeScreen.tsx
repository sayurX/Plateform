import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { useStore } from '@/store/useStore';

// Local mock data removed in favor of store data

export default function HomeScreen({ navigation }: any) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, currentAddress, foods, categories, cart, loadFoods, loadCategories } = useStore();

  // Map category names to emojis
  const CATEGORY_EMOJI: Record<string, string> = {
    'All': '🔥',
    'Hot Dog': '🌭',
    'Burger': '🍔',
    'Pizza': '🍕',
    'Mexican': '🌮',
    'Asian': '🍜',
    'Dessert': '🍰',
    'Drink': '🥤',
    'Salad': '🥗',
  };

  useFocusEffect(
    useCallback(() => {
      loadFoods();
      loadCategories();
    }, [])
  );

  const filteredFoods = foods.filter(food => {
    const matchesCategory =
      activeCategory === 'All' ||
      (typeof food.category === 'string' && food.category === activeCategory) ||
      (food.category?.name === activeCategory);

    const matchesSearch =
      searchQuery.trim() === '' ||
      food.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (food.description || '').toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning!';
    if (hour < 17) return 'Good Afternoon!';
    return 'Good Evening!';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton} onPress={() => navigation.navigate('Profile')}>
            <Ionicons name="menu-outline" size={24} color={Colors.text} />
          </TouchableOpacity>
          <View style={styles.addressContainer}>
            <Text style={styles.deliverTo}>DELIVER TO</Text>
            <TouchableOpacity style={styles.addressDropdown} onPress={() => navigation.navigate('Addresses')}>
              <Text style={styles.addressText} numberOfLines={1}>{currentAddress}</Text>
              <Ionicons name="chevron-down" size={16} color={Colors.text} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate('Cart')}>
            <Ionicons name="bag-handle-outline" size={20} color={Colors.white} />
            {cart.length > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cart.reduce((sum, item) => sum + item.qty, 0)}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <Text style={styles.greeting}>Hey {user?.fullName?.split(' ')[0] || 'User'}, <Text style={styles.greetingBold}>{getGreeting()}</Text></Text>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color={Colors.textSecondary} style={styles.searchIcon} />
          <TextInput 
            style={styles.searchInput}
            placeholder="Search dishes, restaurants"
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
            clearButtonMode="while-editing"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={Colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Categories</Text>
          <TouchableOpacity style={styles.seeAllButton} onPress={() => navigation.navigate('Categories')}>
            <Text style={styles.seeAllText}>See All</Text>
            <Ionicons name="chevron-forward" size={14} color={Colors.textSecondary} />
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {[{ _id: 'all', name: 'All' }, ...categories].map(cat => {
            const isActive = activeCategory === cat.name;
            return (
              <TouchableOpacity 
                key={cat._id} 
                style={[styles.categoryCard, isActive && styles.categoryCardActive]}
                onPress={() => setActiveCategory(cat.name)}
              >
                <View style={[styles.categoryIconCircle, isActive ? styles.categoryIconCircleActive : styles.categoryIconCircleInactive]}>
                  <Text style={styles.emoji}>
                    {CATEGORY_EMOJI[cat.name] ?? '🍽️'}
                  </Text>
                </View>
                <Text style={[styles.categoryName, isActive && styles.categoryNameActive]}>{cat.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            {searchQuery.trim() !== '' ? `Results for "${searchQuery}"` : 'Available Foods'}
          </Text>
        </View>

        <View style={styles.foodList}>
          {filteredFoods.map(food => (
            <TouchableOpacity 
              key={food._id} 
              style={styles.foodCard} 
              onPress={() => navigation.navigate('FoodDetails', { foodId: food._id })}
            >
              <View style={styles.foodImageContainer}>
                 <Image source={{ uri: food.imageUrl }} style={{ width: '100%', height: '100%', borderRadius: 20 }} resizeMode="cover" />
              </View>
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{food.name}</Text>
                
                <View style={styles.foodMetaRow}>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={12} color={Colors.white} style={{ marginRight: 4 }} />
                    <Text style={styles.ratingText}>{food.rating || '0.0'}</Text>
                  </View>
                  <Text style={styles.foodPrice}>Rs.{food.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {filteredFoods.length === 0 && (
             <Text style={styles.emptyText}>No available foods in this category.</Text>
          )}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  menuButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#F6F8FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addressContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  deliverTo: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  addressDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  addressText: {
    fontWeight: '600',
    color: Colors.text,
    textAlign: 'center',
  },
  cartButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#1A1D2E',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: Colors.primary,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: 'bold',
  },
  greeting: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginTop: 20,
    marginBottom: 16,
  },
  greetingBold: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F8FA',
    borderRadius: 16,
    height: 52,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    height: '100%',
    color: Colors.text,
    fontSize: 15,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seeAllText: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginRight: 4,
  },
  categoriesScroll: {
    marginHorizontal: -24,
    marginBottom: 24,
  },
  categoriesContent: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    paddingTop: 5,
  },
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    paddingRight: 16,
    backgroundColor: Colors.white,
    borderRadius: 30,
    marginRight: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  categoryCardActive: {
    backgroundColor: Colors.primary,
  },
  categoryIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryIconCircleInactive: {
    backgroundColor: '#F6F8FA',
  },
  categoryIconCircleActive: {
    backgroundColor: Colors.white,
  },
  emoji: {
    fontSize: 20,
  },
  categoryName: {
    fontWeight: '600',
    color: Colors.text,
    fontSize: 15,
  },
  categoryNameActive: {
    color: Colors.white,
  },
  
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
    width: 100,
    height: 100,
    borderRadius: 20,
    backgroundColor: '#FFD29F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  foodInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  foodMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A28',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ratingText: {
    color: Colors.white,
    fontSize: 13,
    fontWeight: 'bold',
  },
  foodPrice: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    fontSize: 15,
    marginTop: 20,
  }
});
