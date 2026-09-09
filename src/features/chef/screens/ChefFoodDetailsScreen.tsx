import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';
const LIGHT_BG = '#F2F3F7';

const W = Dimensions.get('window').width;
const HERO_H = 240;

// ── Ingredient data ──────────────────────────────────────────────────────────
interface Ingredient {
  label: string;
  emoji: string;
  allergy?: boolean;
}

const INGREDIENTS: Ingredient[] = [
  { label: 'Salt',     emoji: '🧂' },
  { label: 'Chicken', emoji: '🍗' },
  { label: 'Onion',   emoji: '🧅', allergy: true },
  { label: 'Garlic',  emoji: '🧄' },
  { label: 'Pappers', emoji: '🌶️', allergy: true },
  { label: 'Ginger',  emoji: '🫚' },
  { label: 'Broccoli',emoji: '🥦' },
  { label: 'Orange',  emoji: '🍊' },
  { label: 'Walnut',  emoji: '🥜' },
];

// ── Default recipe steps ───────────────────────────────────────────────────────
const DEFAULT_RECIPE: string[] = [
  'Marinate chicken with spices, yogurt, and lemon juice for at least 1 hour.',
  'Heat oil in a pan and sauté onions until golden brown.',
  'Add garlic, ginger paste and cook for 2 minutes until fragrant.',
  'Add marinated chicken and cook on medium heat for 10 minutes.',
  'Pour in coconut milk and simmer for 15 minutes, stirring occasionally.',
  'Wash and soak basmati rice, then cook separately until 70% done.',
  'Layer rice over the curry, seal the pot and dum cook for 20 minutes.',
  'Garnish with fried onions, fresh coriander and serve hot.',
];

// ── Dot indicator ─────────────────────────────────────────────────────────────
const Dots = ({ count, active }: { count: number; active: number }) => (
  <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
    {Array.from({ length: count }).map((_, i) => (
      <View
        key={i}
        style={{
          width: i === active ? 18 : 6,
          height: 6,
          borderRadius: 3,
          backgroundColor: i === active ? WHITE : 'rgba(255,255,255,0.5)',
        }}
      />
    ))}
  </View>
);

export default function ChefFoodDetailsScreen({ route, navigation }: any) {
  // Accept item passed from ChefFoodListScreen, fallback to demo data
  const item = route?.params?.item ?? {
    name: 'Chicken Thai Biriyani',
    category: 'Breakfast',
    price: 60,
    rating: 4.9,
    reviews: 10,
    pickupType: 'Delivery',
    location: 'Kentucky 39495',
    image: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80',
    description:
      'Lorem ipsum dolor sit amet, consetdur Maton adipiscing elit. Bibendum in vel, mattis et amet dui mauris turpis.',
    ingredients: INGREDIENTS,
    recipe: DEFAULT_RECIPE,
  };

  const [activeSlide, setActiveSlide] = useState(0);

  // ── Ingredient chip ────────────────────────────────────────────────────────
  const IngredientChip = ({ item: ing }: { item: any }) => (
    <View style={styles.ingChipWrap}>
      <View style={styles.ingCircle}>
        <Text style={styles.ingEmoji}>{ing.emoji}</Text>
      </View>
      <Text style={styles.ingLabel}>{ing.label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Food Details</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>

        {/* ── Hero Image ──────────────────────────────────────────────────── */}
        <View style={styles.heroWrap}>
          <Image
            source={{ uri: item.imageUrl || item.image || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=600&q=80' }}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Overlay badges */}
          <View style={styles.heroBadgeRow}>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>
                {item.category?.name || (typeof item.category === 'string' ? item.category : '') || 'Category'}
              </Text>
            </View>
            <View style={styles.heroDots}>
              <Dots count={3} active={activeSlide} />
            </View>
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>{item.pickupType}</Text>
            </View>
          </View>
        </View>

        {/* ── Title Row ────────────────────────────────────────────────────── */}
        <View style={styles.titleRow}>
          <Text style={styles.foodName}>{item.name}</Text>
          <Text style={styles.foodPrice}>Rs.{item.price}</Text>
        </View>

        {/* ── Meta Row ─────────────────────────────────────────────────────── */}
        <View style={styles.metaRow}>
          <View style={styles.metaLeft}>
            <Ionicons name="location-outline" size={13} color={GREY} />
            <Text style={styles.metaLocation}>{item.location ?? 'Kentucky 39495'}</Text>
          </View>
          <View style={styles.metaRight}>
            <Ionicons name="star" size={14} color="#FFB800" />
            <Text style={styles.ratingText}>{item.rating}</Text>
            <Text style={styles.reviewText}>({item.reviews} Reviews)</Text>
          </View>
        </View>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Ingredients ──────────────────────────────────────────────────── */}
        {item.ingredients && item.ingredients.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>INGREDIENTS</Text>
            <View style={styles.ingGrid}>
              {item.ingredients.map((ing: any, i: number) => (
                <IngredientChip key={i} item={ing} />
              ))}
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* ── Description ──────────────────────────────────────────────────── */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{item.description}</Text>

        {/* ── Divider ─────────────────────────────────────────────────────── */}
        <View style={styles.divider} />

        {/* ── Recipe ────────────────────────────────────────────────────────── */}
        {item.recipe && item.recipe.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>RECIPE</Text>
            <View style={styles.recipeList}>
              {item.recipe.map((step: string, i: number) => (
                <View key={i} style={styles.recipeStep}>
                  <View style={styles.stepNumCircle}>
                    <Text style={styles.stepNum}>{i + 1}</Text>
                  </View>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 110 }} />
      </ScrollView>

      {/* ── Bottom Nav ───────────────────────────────────────────────────── */}
      <View style={styles.navbar}>
        {[
          { icon: 'grid-outline',         screen: 'ChefHome'          },
          { icon: 'list-outline',          screen: 'ChefOrders'        },
          { icon: 'fast-food-outline',     screen: 'ChefFoodList', active: true },
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
  safe:  { flex: 1, backgroundColor: WHITE },
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: WHITE,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: LIGHT_BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: NAVY },

  // Hero
  heroWrap: {
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: 'hidden',
    height: HERO_H,
    marginBottom: 20,
  },
  heroImage: { width: '100%', height: '100%' },
  heroBadgeRow: {
    position: 'absolute',
    bottom: 14,
    left: 14,
    right: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  heroBadgeText: { fontSize: 12, fontWeight: '700', color: NAVY },
  heroDots: { alignItems: 'center' },

  // Title / meta
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
  foodName:  { fontSize: 18, fontWeight: '800', color: NAVY, flex: 1 },
  foodPrice: { fontSize: 20, fontWeight: '900', color: NAVY },

  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 18,
  },
  metaLeft:      { flexDirection: 'row', alignItems: 'center', gap: 3 },
  metaLocation:  { fontSize: 12, color: GREY },
  metaRight:     { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText:    { fontSize: 13, fontWeight: '700', color: NAVY },
  reviewText:    { fontSize: 12, color: GREY },

  divider: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginHorizontal: 20,
    marginBottom: 18,
  },

  // Section titles
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: 0.6,
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Ingredients
  ingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    gap: 4,
    marginBottom: 20,
  },
  ingChipWrap: {
    width: (W - 40) / 5,
    alignItems: 'center',
    marginBottom: 14,
  },
  ingCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: ORANGE + '18',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  ingEmoji: { fontSize: 22 },
  ingLabel: {
    fontSize: 10,
    color: NAVY,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 14,
  },

  // Description
  description: {
    fontSize: 13,
    color: GREY,
    lineHeight: 21,
    paddingHorizontal: 20,
  },

  // Recipe
  recipeList: {
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  recipeStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    padding: 14,
  },
  stepNumCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNum: { fontSize: 13, fontWeight: '800', color: WHITE },
  stepText: { fontSize: 13, color: NAVY, lineHeight: 20, flex: 1 },

  // Bottom nav
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
