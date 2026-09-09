import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useStore } from '@/store/useStore';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';
const LIGHT_BG = '#F2F3F7';
const BORDER = '#E8E8E8';

const BASIC_INGREDIENTS = [
  { label: 'Salt',    emoji: '🧂', selected: false },
  { label: 'Chicken',emoji: '🍗', selected: false },
  { label: 'Onion',  emoji: '🧅', selected: false },
  { label: 'Garlic', emoji: '🧄', selected: false },
  { label: 'Pappers',emoji: '🌶️', selected: false },
  { label: 'Ginger', emoji: '🫚', selected: false },
  { label: 'Egg',    emoji: '🥚', selected: false },
  { label: 'Butter', emoji: '🧈', selected: false },
  { label: 'Cheese', emoji: '🧀', selected: false },
  { label: 'Bread',  emoji: '🍞', selected: false },
];

const FRUIT_INGREDIENTS = [
  { label: 'Avocado',  emoji: '🥑', selected: false },
  { label: 'Apple',    emoji: '🍎', selected: false },
  { label: 'Blueberry',emoji: '🫐', selected: false },
  { label: 'Broccoli', emoji: '🥦', selected: false },
  { label: 'Orange',   emoji: '🍊', selected: false },
  { label: 'Walnut',   emoji: '🥜', selected: false },
  { label: 'Banana',   emoji: '🍌', selected: false },
  { label: 'Grapes',   emoji: '🍇', selected: false },
  { label: 'Lemon',    emoji: '🍋', selected: false },
  { label: 'Watermelon',emoji: '🍉', selected: false },
];

const CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Desserts'];
const CHEFS = ['Chef Mario'];

interface IngRow { label: string; emoji: string; selected: boolean }

const SectionLabel = ({ text }: { text: string }) => (
  <Text style={styles.sectionLabel}>{text}</Text>
);

const FormField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <View style={styles.formField}>
    <SectionLabel text={label} />
    {children}
  </View>
);

export default function AdminAddItemScreen({ route, navigation }: any) {
  const itemToEdit = route?.params?.item;
  const isEditing = !!itemToEdit;

  const { categories, loadCategories, addProduct, updateProduct } = useStore();

  useEffect(() => {
    loadCategories();
  }, []);

  const [itemName, setItemName]       = useState(itemToEdit?.name || '');
  const [price, setPrice]             = useState(itemToEdit ? String(itemToEdit.price) : '');
  const [price10, setPrice10]         = useState(itemToEdit?.sizePrices?.["10"] ? String(itemToEdit.sizePrices["10"]) : '');
  const [price14, setPrice14]         = useState(itemToEdit?.sizePrices?.["14"] ? String(itemToEdit.sizePrices["14"]) : '');
  const [price16, setPrice16]         = useState(itemToEdit?.sizePrices?.["16"] ? String(itemToEdit.sizePrices["16"]) : '');
  const [isPickup, setIsPickup]       = useState(true);
  const [isDelivery, setIsDelivery]   = useState(false);
  const [details, setDetails]         = useState(itemToEdit?.description || '');
  const [recipeSteps, setRecipeSteps] = useState<string[]>(itemToEdit?.recipe || ['']);
  const [selectedCategory, setSelectedCategory] = useState(
    itemToEdit?.category?._id || itemToEdit?.category || ''
  );
  const [selectedChef, setSelectedChef]         = useState('Chef Mario');
  const [imageUrl, setImageUrl]       = useState<string | null>(itemToEdit?.imageUrl || null);
  const [basicIngs, setBasicIngs]     = useState<IngRow[]>(
    BASIC_INGREDIENTS.map(i => ({
      ...i,
      selected: itemToEdit?.ingredients?.some((ing: any) => ing.label === i.label) || false
    }))
  );
  const [fruitIngs, setFruitIngs]     = useState<IngRow[]>(
    FRUIT_INGREDIENTS.map(i => ({
      ...i,
      selected: itemToEdit?.ingredients?.some((ing: any) => ing.label === i.label) || false
    }))
  );

  const [showAllBasic, setShowAllBasic] = useState(false);
  const [showAllFruit, setShowAllFruit] = useState(false);

  // ── Image picker ─────────────────────────────────────────────────────────────
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImageUrl(result.assets[0].uri);
    }
  };

  const toggleBasic = (i: number) =>
    setBasicIngs((prev) => { const n = [...prev]; n[i] = { ...n[i], selected: !n[i].selected }; return n; });

  const toggleFruit = (i: number) =>
    setFruitIngs((prev) => { const n = [...prev]; n[i] = { ...n[i], selected: !n[i].selected }; return n; });

  const addRecipeStep = () => setRecipeSteps([...recipeSteps, '']);
  const removeRecipeStep = (index: number) => {
    if (recipeSteps.length > 1) {
      setRecipeSteps(recipeSteps.filter((_, i) => i !== index));
    } else {
      setRecipeSteps(['']);
    }
  };
  const updateRecipeStep = (text: string, index: number) => {
    const next = [...recipeSteps];
    next[index] = text;
    setRecipeSteps(next);
  };

  const handleReset = () => {
    setItemName(''); setPrice(''); setPrice10(''); setPrice14(''); setPrice16('');
    setIsPickup(false);
    setIsDelivery(false); setDetails(''); setRecipeSteps(['']);
    setImageUrl(null);
    setBasicIngs(BASIC_INGREDIENTS.map((i) => ({ ...i, selected: false })));
    setFruitIngs(FRUIT_INGREDIENTS.map((i) => ({ ...i, selected: false })));
    setShowAllBasic(false);
    setShowAllFruit(false);
  };

  const selectedCatObj = categories.find(c => c._id === selectedCategory);
  const isPizza = selectedCatObj?.name?.toLowerCase() === 'pizza';

  const handleSave = async () => {
    if (!itemName.trim()) { Alert.alert('Validation', 'Please enter an item name.'); return; }
    if (!selectedCategory) { Alert.alert('Validation', 'Please select a category.'); return; }

    let finalPrice = Number(price);
    let sizePricesObj;

    if (isPizza) {
      if (!price10.trim() || !price14.trim() || !price16.trim()) {
        Alert.alert('Validation', 'Please enter all three pizza size prices.'); return;
      }
      finalPrice = Number(price10); // Use 10" as base price
      sizePricesObj = { "10": Number(price10), "14": Number(price14), "16": Number(price16) };
    } else {
      if (!price.trim()) { Alert.alert('Validation', 'Please enter a price.'); return; }
    }

    const foodData = {
      name: itemName,
      price: finalPrice,
      sizePrices: sizePricesObj,
      description: details,
      category: selectedCategory,
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=200&q=80',
      isAvailable: true,
      recipe: recipeSteps.filter(s => s.trim() !== ''),
      ingredients: [
        ...basicIngs.filter(i => i.selected).map(i => ({ label: i.label, emoji: i.emoji })),
        ...fruitIngs.filter(i => i.selected).map(i => ({ label: i.label, emoji: i.emoji }))
      ],
    };

    try {
      if (isEditing) {
        await updateProduct(itemToEdit._id, foodData);
      } else {
        await addProduct(foodData);
      }
      Alert.alert('Success', `"${itemName}" ${isEditing ? 'updated' : 'added'} successfully!`, [
        { text: 'OK', onPress: () => navigation?.goBack?.() },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save food item.');
    }
  };

  // ── Sub-components ────────────────────────────────────────────────────────────
  const IngChip = ({ item, onPress }: { item: IngRow; onPress: () => void }) => (
    <TouchableOpacity style={styles.ingChipWrap} onPress={onPress}>
      <View style={[styles.ingCircle, item.selected && styles.ingCircleSelected]}>
        <Text style={styles.ingEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.ingLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  const Checkbox = ({ checked, label, onPress }: { checked: boolean; label: string; onPress: () => void }) => (
    <TouchableOpacity style={styles.checkRow} onPress={onPress}>
      <View style={[styles.checkBox, checked && styles.checkBoxChecked]}>
        {checked && <Ionicons name="checkmark" size={12} color={WHITE} />}
      </View>
      <Text style={styles.checkLabel}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation?.goBack?.()}>
          <Ionicons name="chevron-back" size={22} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Item' : 'Add New Item'}</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

          {/* Item Name */}
          <FormField label="ITEM NAME">
            <View style={styles.inputBox}>
              <TextInput
                style={styles.input}
                value={itemName}
                onChangeText={setItemName}
                placeholder="Enter item name"
                placeholderTextColor={GREY}
              />
            </View>
          </FormField>

          {/* Category */}
          <FormField label="CATEGORY">
            <View style={styles.catGrid}>
              {categories.map((cat) => {
                const active = selectedCategory === cat._id;
                return (
                  <TouchableOpacity
                    key={cat._id}
                    style={[styles.catChip, active && styles.catChipActive, { width: '48%' }]}
                    onPress={() => setSelectedCategory(cat._id)}
                  >
                    <Text 
                      style={[styles.catChipText, active && styles.catChipTextActive]}
                      numberOfLines={1}
                    >
                      {cat.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </FormField>

          {/* Assign Chef */}
          <FormField label="ASSIGN CHEF">
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {CHEFS.map((chef) => (
                <TouchableOpacity
                  key={chef}
                  style={[styles.chefChip, selectedChef === chef && styles.chefChipActive]}
                  onPress={() => setSelectedChef(chef)}
                >
                  <Ionicons
                    name="restaurant-outline"
                    size={13}
                    color={selectedChef === chef ? WHITE : GREY}
                  />
                  <Text style={[styles.chefChipText, selectedChef === chef && styles.chefChipTextActive]}>
                    {chef}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </FormField>

          {/* Upload Photo */}
          <FormField label="UPLOAD PHOTO/VIDEO">
            <View style={styles.photoRow}>
              {imageUrl ? (
                <TouchableOpacity style={styles.photoSlotFilled} onPress={pickImage}>
                  <Image source={{ uri: imageUrl }} style={StyleSheet.absoluteFill} resizeMode="cover" />
                  <View style={styles.photoEditBadge}>
                    <Ionicons name="pencil" size={10} color={WHITE} />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.photoSlotEmpty} onPress={pickImage}>
                  <Ionicons name="cloud-upload-outline" size={24} color={ORANGE} />
                  <Text style={styles.photoAddLabel}>Add</Text>
                </TouchableOpacity>
              )}
            </View>
          </FormField>

          {/* Price + Delivery Type */}
          <FormField label="PRICE">
            {isPizza ? (
              <View style={{ flexDirection: 'column', gap: 12 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {['10', '14', '16'].map((sz) => (
                    <View key={sz} style={[styles.inputBox, { flex: 1, flexDirection: 'column', height: 56, alignItems: 'flex-start', justifyContent: 'center', paddingVertical: 4 }]}>
                      <Text style={{ fontSize: 10, color: GREY, marginBottom: 2 }}>{sz}" Price</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={styles.currencySymbol}>Rs.</Text>
                        <TextInput
                          style={[styles.input, { marginLeft: 2, height: 20 }]}
                          value={sz === '10' ? price10 : sz === '14' ? price14 : price16}
                          onChangeText={sz === '10' ? setPrice10 : sz === '14' ? setPrice14 : setPrice16}
                          keyboardType="numeric"
                          placeholder="0"
                          placeholderTextColor={GREY}
                        />
                      </View>
                    </View>
                  ))}
                </View>
                <View style={styles.deliveryOpts}>
                  <Checkbox checked={isPickup}   label="Pick up"  onPress={() => setIsPickup((v) => !v)} />
                  <Checkbox checked={isDelivery} label="Delivery" onPress={() => setIsDelivery((v) => !v)} />
                </View>
              </View>
            ) : (
              <View style={styles.priceRow}>
                <View style={[styles.inputBox, { flex: 1 }]}>
                  <Text style={styles.currencySymbol}>Rs.</Text>
                  <TextInput
                    style={[styles.input, { marginLeft: 4 }]}
                    value={price}
                    onChangeText={setPrice}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={GREY}
                  />
                </View>
                <View style={styles.deliveryOpts}>
                  <Checkbox checked={isPickup}   label="Pick up"  onPress={() => setIsPickup((v) => !v)} />
                  <Checkbox checked={isDelivery} label="Delivery" onPress={() => setIsDelivery((v) => !v)} />
                </View>
              </View>
            )}
          </FormField>

          {/* Ingredients */}
          <SectionLabel text="INGREDIENTS" />

          {/* Basic */}
          <View style={styles.ingHeader}>
            <Text style={styles.ingCategory}>Basic</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => setShowAllBasic(!showAllBasic)}>
              <Text style={styles.seeAllText}>{showAllBasic ? 'Show Less' : 'See All'}</Text>
              <Ionicons name={showAllBasic ? "chevron-up" : "chevron-down"} size={12} color={GREY} />
            </TouchableOpacity>
          </View>
          {showAllBasic ? (
            <View style={styles.ingGrid}>
              {basicIngs.map((ing, i) => <IngChip key={i} item={ing} onPress={() => toggleBasic(i)} />)}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ingScroll}>
              {basicIngs.map((ing, i) => <IngChip key={i} item={ing} onPress={() => toggleBasic(i)} />)}
            </ScrollView>
          )}

          {/* Fruit */}
          <View style={[styles.ingHeader, { marginTop: 12 }]}>
            <Text style={styles.ingCategory}>Fruit</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => setShowAllFruit(!showAllFruit)}>
              <Text style={styles.seeAllText}>{showAllFruit ? 'Show Less' : 'See All'}</Text>
              <Ionicons name={showAllFruit ? "chevron-up" : "chevron-down"} size={12} color={GREY} />
            </TouchableOpacity>
          </View>
          {showAllFruit ? (
            <View style={styles.ingGrid}>
              {fruitIngs.map((ing, i) => <IngChip key={i} item={ing} onPress={() => toggleFruit(i)} />)}
            </View>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.ingScroll}>
              {fruitIngs.map((ing, i) => <IngChip key={i} item={ing} onPress={() => toggleFruit(i)} />)}
            </ScrollView>
          )}

          {/* Details */}
          <FormField label="DETAILS">
            <View style={[styles.inputBox, styles.textAreaBox]}>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={details}
                onChangeText={setDetails}
                placeholder="Describe this item..."
                placeholderTextColor={GREY}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </FormField>

          {/* Recipe */}
          <FormField label="RECIPE STEPS">
            <View style={{ gap: 10 }}>
              {recipeSteps.map((step, index) => (
                <View key={index} style={styles.recipeStepBox}>
                  <View style={styles.stepNumCircleSmall}>
                    <Text style={styles.stepNumText}>{index + 1}</Text>
                  </View>
                  <TextInput
                    style={styles.recipeInput}
                    value={step}
                    onChangeText={(text) => updateRecipeStep(text, index)}
                    placeholder={`Step ${index + 1}...`}
                    placeholderTextColor={GREY}
                    multiline
                  />
                  <TouchableOpacity onPress={() => removeRecipeStep(index)} style={styles.removeStepBtn}>
                    <Ionicons name="close-circle" size={20} color={GREY} />
                  </TouchableOpacity>
                </View>
              ))}
              <TouchableOpacity style={styles.addStepBtn} onPress={addRecipeStep}>
                <Ionicons name="add-circle-outline" size={18} color={ORANGE} />
                <Text style={styles.addStepBtnText}>ADD STEP</Text>
              </TouchableOpacity>
            </View>
          </FormField>

          {/* Save */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Ionicons name="checkmark-circle-outline" size={20} color={WHITE} />
            <Text style={styles.saveBtnText}>ADD TO MENU</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT_BG },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: WHITE,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: LIGHT_BG,
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 17, fontWeight: '700', color: NAVY },
  resetText:   { fontSize: 13, fontWeight: '700', color: ORANGE, letterSpacing: 0.5 },

  scroll: { padding: 20, paddingTop: 16 },

  formField:    { marginBottom: 20 },
  sectionLabel: { fontSize: 11, fontWeight: '800', color: NAVY, letterSpacing: 1.2, marginBottom: 10 },

  inputBox: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: WHITE, borderRadius: 12,
    borderWidth: 1, borderColor: BORDER,
    paddingHorizontal: 14, height: 48,
  },
  input:          { flex: 1, fontSize: 14, color: NAVY },
  currencySymbol: { fontSize: 15, color: NAVY, fontWeight: '600' },
  textAreaBox:    { height: 110, alignItems: 'flex-start', paddingVertical: 12 },
  textArea:       { height: 86 },

  // Category chips
  catChip: {
    paddingHorizontal: 16, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: BORDER,
    backgroundColor: WHITE,
  },
  catChipActive: { backgroundColor: ORANGE, borderColor: ORANGE },
  catChipText:   { fontSize: 12, fontWeight: '600', color: GREY, textAlign: 'center' },
  catChipTextActive: { color: WHITE },

  catGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between'
  },

  // Chef chips
  chefChip: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: BORDER,
    backgroundColor: WHITE,
  },
  chefChipActive: { backgroundColor: NAVY, borderColor: NAVY },
  chefChipText:   { fontSize: 12, fontWeight: '600', color: GREY },
  chefChipTextActive: { color: WHITE },

  // Photo upload
  photoRow: { flexDirection: 'row', gap: 10 },
  photoSlotFilled: { width: 90, height: 90, borderRadius: 12, overflow: 'hidden', backgroundColor: LIGHT_BG },
  photoSlotEmpty: {
    width: 90, height: 90, borderRadius: 12,
    borderWidth: 1.5, borderColor: BORDER, borderStyle: 'dashed',
    backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center', gap: 4,
  },
  photoAddLabel: { fontSize: 11, color: GREY, fontWeight: '600' },
  photoEditBadge: {
    position: 'absolute', bottom: 5, right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20, height: 20, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },

  // Price / delivery
  priceRow:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deliveryOpts: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  checkRow:     { flexDirection: 'row', alignItems: 'center', gap: 7 },
  checkBox: {
    width: 20, height: 20, borderRadius: 5,
    borderWidth: 1.5, borderColor: BORDER,
    backgroundColor: WHITE, justifyContent: 'center', alignItems: 'center',
  },
  checkBoxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkLabel: { fontSize: 13, color: NAVY, fontWeight: '500' },

  // Ingredients
  ingHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  ingCategory:  { fontSize: 14, fontWeight: '700', color: NAVY },
  seeAllBtn:    { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText:   { fontSize: 12, color: GREY },
  ingScroll:    { paddingBottom: 8, gap: 6 },
  ingGrid:      { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 8 },
  ingChipWrap:  { alignItems: 'center', marginRight: 4 },
  ingCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: WHITE, borderWidth: 1.5, borderColor: BORDER,
    justifyContent: 'center', alignItems: 'center', marginBottom: 5,
  },
  ingCircleSelected: { backgroundColor: ORANGE + '20', borderColor: ORANGE },
  ingEmoji: { fontSize: 22 },
  ingLabel: { fontSize: 10, color: NAVY, textAlign: 'center', fontWeight: '500' },

  // Save button
  saveBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: ORANGE, borderRadius: 14, paddingVertical: 18,
    marginTop: 8,
    shadowColor: ORANGE, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  saveBtnText: { color: WHITE, fontSize: 15, fontWeight: '800', letterSpacing: 1.2 },

  recipeStepBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
  },
  stepNumCircleSmall: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: ORANGE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepNumText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  recipeInput: {
    flex: 1,
    fontSize: 14,
    color: NAVY,
    minHeight: 40,
  },
  removeStepBtn: {
    padding: 4,
  },
  addStepBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderWidth: 1.5,
    borderColor: ORANGE,
    borderStyle: 'dashed',
    borderRadius: 12,
    marginTop: 4,
  },
  addStepBtnText: {
    color: ORANGE,
    fontSize: 13,
    fontWeight: '700',
  },
});
