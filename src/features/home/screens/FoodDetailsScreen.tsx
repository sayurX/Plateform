import React, { useState, useRef } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, Image, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';
import { useStore } from '@/store/useStore';

export default function FoodDetailsScreen({ route, navigation }: any) {
  const { foodId } = route.params;
  const { foods, addToCart, user, categories } = useStore();
  
  const food = foods.find(f => f._id === foodId);
  
  const [size, setSize] = useState('14"');
  const [qty, setQty] = useState(1);
  
  const isChef = user?.role?.toLowerCase() === 'chef';
  const isDriver = user?.role?.toLowerCase() === 'driver';
  const isAdmin = user?.role?.toLowerCase() === 'admin';

  if (!food) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 100 }}>Food not found</Text>
        <AppButton title="Go Back" onPress={() => navigation.goBack()} />
      </SafeAreaView>
    );
  }

  const isPizza = categories.find((c: any) => c._id === food.category || c._id === food.category?._id)?.name?.toLowerCase() === 'pizza';
  
  const cleanSize = size.replace('"', '');
  const sizePrices = food.sizePrices || {};
  const currentPrice = isPizza && sizePrices[cleanSize] ? Number(sizePrices[cleanSize]) : food.price;

  console.log('Food details:', { isPizza, size, cleanSize, sizePrices, currentPrice, foodPrice: food.price });

  const handleAddToCart = () => {
    addToCart({ ...food, price: currentPrice }, isPizza ? size : '', qty);
    navigation.navigate('Cart');
  };

  // Animation for "Drag to view full picture"
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (e, gestureState) => {
        if (gestureState.dy > 0) {
          pan.setValue({ x: 0, y: gestureState.dy });
        }
      },
      onPanResponderRelease: () => {
        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
          friction: 5,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <SafeAreaView edges={['top']} style={styles.topArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={24} color={Colors.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <View style={{ width: 44 }} />
        </View>
      </SafeAreaView>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollArea}>
        
        {/* Hero Image Container */}
        <View style={styles.heroContainer}>
          <View style={styles.heroBackground} />
          <Animated.Image 
            source={{ uri: food.imageUrl }} 
            style={[
              styles.heroImage, 
              { transform: pan.getTranslateTransform() }
            ]} 
            resizeMode="cover" 
            {...panResponder.panHandlers}
          />
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.contentPadding}>
          {/* Details */}
          <Text style={styles.foodTitle}>{food.name}</Text>
          <Text style={styles.foodDesc}>{food.description || 'No description available for this item.'}</Text>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Ionicons name="star-outline" size={20} color="#FFB01D" />
              <Text style={styles.statText}>4.7</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="bicycle-outline" size={20} color="#FF7A28" />
              <Text style={styles.statText}>Free</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="time-outline" size={20} color="#FF7A28" />
              <Text style={styles.statText}>20 min</Text>
            </View>
          </View>

          {/* Size Selector */}
          {isPizza && (
            <View style={styles.sectionRow}>
              <Text style={styles.sectionLabel}>SIZE:</Text>
              <View style={styles.sizeOptions}>
                {['10"', '14"', '16"'].map(s => (
                  <TouchableOpacity 
                    key={s} 
                    style={[styles.sizeBtn, size === s && styles.sizeBtnActive]}
                    onPress={() => setSize(s)}
                  >
                    <Text style={[styles.sizeBtnText, size === s && styles.sizeBtnTextActive]}>{s}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Ingredients */}
          {food.ingredients && food.ingredients.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 32, marginBottom: 16 }]}>INGREDIENTS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.ingredientsScroll}>
                {food.ingredients.map((ing: any, i: number) => (
                  <View key={i} style={styles.ingredientContainer}>
                    <View style={styles.ingredientCircle}>
                      <Text style={{ fontSize: 24 }}>{ing.emoji}</Text>
                    </View>
                    <Text style={{ fontSize: 10, color: '#A0A5BA', textAlign: 'center', marginTop: 4 }}>{ing.label}</Text>
                  </View>
                ))}
              </ScrollView>
            </>
          )}

          {/* Recipe (Chef Only) */}
          {(isChef || isAdmin) && food.recipe && food.recipe.length > 0 && (
            <>
              <Text style={[styles.sectionLabel, { marginTop: 32, marginBottom: 16 }]}>RECIPE STEPS (CHEF ONLY)</Text>
              <View style={{ gap: 12 }}>
                {food.recipe.map((step: string, i: number) => (
                  <View key={i} style={styles.recipeStepBox}>
                    <View style={styles.stepNumCircle}>
                      <Text style={styles.stepNumText}>{i + 1}</Text>
                    </View>
                    <Text style={styles.stepText}>{step}</Text>
                  </View>
                ))}
              </View>
            </>
          )}
        </View>

      </ScrollView>

      {/* Footer / Bottom Sheet */}
      <View style={styles.footerContainer}>
        <View style={styles.footerTopRow}>
          <Text style={styles.priceText}>Rs.{currentPrice * qty}</Text>
          <View style={styles.qtyBox}>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(Math.max(1, qty-1))}><Ionicons name="remove" size={16} color={Colors.white}/></TouchableOpacity>
            <Text style={styles.qtyValue}>{qty}</Text>
            <TouchableOpacity style={styles.qtyBtn} onPress={() => setQty(qty+1)}><Ionicons name="add" size={16} color={Colors.white}/></TouchableOpacity>
          </View>
        </View>
        <AppButton title="ADD TO CART" onPress={handleAddToCart} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  topArea: { backgroundColor: Colors.white, zIndex: 10 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  
  scrollArea: { flex: 1 },
  heroContainer: { 
    marginHorizontal: 24, 
    marginTop: 40, 
    position: 'relative', 
    height: 260, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  heroBackground: { 
    position: 'absolute',
    width: '100%',
    height: 160,
    backgroundColor: '#FFD29F', 
    borderRadius: 30, 
    bottom: 0,
  },
  heroImage: { 
    width: '100%', 
    height: 240, 
    position: 'absolute', 
    top: 0, // Show full image
    zIndex: 5,
    borderRadius: 40, 
    borderWidth: 5,
    borderColor: Colors.white,
    backgroundColor: '#FFFFFF',
    // Realistic shadow for the sticker card
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 8,
  },
  favoriteButton: { 
    position: 'absolute', 
    bottom: 10, 
    right: 40, 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    backgroundColor: 'rgba(255,255,255,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center',
    zIndex: 10,
  },
  
  contentPadding: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 40 },
  
  foodTitle: { fontSize: 26, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  foodDesc: { fontSize: 15, color: '#A0A5BA', lineHeight: 24, marginBottom: 24 },
  
  statsRow: { flexDirection: 'row', alignItems: 'center', gap: 24, marginBottom: 32 },
  statItem: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statText: { fontSize: 15, fontWeight: '600', color: Colors.text },
  
  sectionRow: { flexDirection: 'row', alignItems: 'center' },
  sectionLabel: { fontSize: 13, fontWeight: 'bold', color: '#A0A5BA', letterSpacing: 0.5, marginRight: 10 },
  sizeOptions: { flexDirection: 'row', gap: 12 },
  sizeBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#F6F8FA', justifyContent: 'center', alignItems: 'center' },
  sizeBtnActive: { backgroundColor: Colors.primary },
  sizeBtnText: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  sizeBtnTextActive: { color: Colors.white },
  
  ingredientsScroll: { overflow: 'visible', marginHorizontal: -24, paddingHorizontal: 24 },
  ingredientContainer: { position: 'relative', marginRight: 16 },
  ingredientCircle: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#FFF0E6', justifyContent: 'center', alignItems: 'center' },
  ingredientBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.primary, width: 22, height: 22, borderRadius: 11, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: Colors.white },
  ingredientBadgeText: { color: Colors.white, fontSize: 10, fontWeight: 'bold' },
  
  footerContainer: { backgroundColor: '#F6F8FA', borderTopLeftRadius: 36, borderTopRightRadius: 36, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 34 },
  footerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  priceText: { fontSize: 28, fontWeight: 'bold', color: Colors.text },
  qtyBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#161924', borderRadius: 30, paddingHorizontal: 6, paddingVertical: 6, gap: 16 },
  qtyBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center' },
  qtyValue: { fontSize: 16, fontWeight: '600', color: Colors.white },

  recipeStepBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F6F8FA',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  stepNumCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FF7A28',
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  stepNumText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepText: {
    fontSize: 14,
    color: '#1C1C2E',
    flex: 1,
    lineHeight: 20,
  },
});
