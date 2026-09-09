import React, { useState } from 'react';
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

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const WHITE = '#FFFFFF';
const GREY = '#9E9E9E';
const LIGHT_BG = '#F2F3F7';
const BORDER = '#E8E8E8';

// ── Ingredient categories ────────────────────────────────────────────────────
const BASIC_INGREDIENTS = [
  { label: 'Salt',    emoji: '🧂', selected: true  },
  { label: 'Chicken',emoji: '🍗', selected: false },
  { label: 'Onion',  emoji: '🧅', selected: true  },
  { label: 'Garlic', emoji: '🧄', selected: false },
  { label: 'Pappers',emoji: '🌶️', selected: true  },
  { label: 'Ginger', emoji: '🫚', selected: false },
  { label: 'Egg',    emoji: '🥚', selected: false },
  { label: 'Butter', emoji: '🧈', selected: false },
  { label: 'Cheese', emoji: '🧀', selected: false },
  { label: 'Bread',  emoji: '🍞', selected: false },
];

const FRUIT_INGREDIENTS = [
  { label: 'Avocado', emoji: '🥑', selected: false },
  { label: 'Apple',   emoji: '🍎', selected: false },
  { label: 'Blueberry',emoji: '🫐', selected: false },
  { label: 'Broccoli',emoji: '🥦', selected: false },
  { label: 'Orange',  emoji: '🍊', selected: false },
  { label: 'Walnut',  emoji: '🥜', selected: false },
  { label: 'Banana',   emoji: '🍌', selected: false },
  { label: 'Grapes',   emoji: '🍇', selected: false },
  { label: 'Lemon',    emoji: '🍋', selected: false },
  { label: 'Watermelon',emoji: '🍉', selected: false },
];

interface IngRow { label: string; emoji: string; selected: boolean }

// ── Sub-components ───────────────────────────────────────────────────────────
const SectionLabel = ({ text }: { text: string }) => (
  <Text style={styles.sectionLabel}>{text}</Text>
);

const FormField = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <View style={styles.formField}>
    <SectionLabel text={label} />
    {children}
  </View>
);

export default function ChefAddItemScreen({ navigation }: any) {
  // Form state
  const [itemName, setItemName] = useState('Mazalichiken Halim');
  const [price, setPrice] = useState('50');
  const [isPickup, setIsPickup] = useState(true);
  const [isDelivery, setIsDelivery] = useState(false);
  const [details, setDetails] = useState(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Bibendum in vel, mattis et amet dui mauris turpis.'
  );
  const [recipe, setRecipe] = useState('');
  const [images, setImages] = useState<(string | null)[]>([
    'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&q=80',
    null,
    null,
  ]);
  const [basicIngs, setBasicIngs] = useState<IngRow[]>(BASIC_INGREDIENTS);
  const [fruitIngs, setFruitIngs] = useState<IngRow[]>(FRUIT_INGREDIENTS);

  const [showAllBasic, setShowAllBasic] = useState(false);
  const [showAllFruit, setShowAllFruit] = useState(false);

  // ── Image picker ────────────────────────────────────────────────────────────
  const pickImage = async (index: number) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled && result.assets.length > 0) {
      setImages((prev) => {
        const next = [...prev];
        next[index] = result.assets[0].uri;
        return next;
      });
    }
  };

  // ── Toggle ingredient ────────────────────────────────────────────────────────
  const toggleBasic = (i: number) => {
    setBasicIngs((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], selected: !next[i].selected };
      return next;
    });
  };

  const toggleFruit = (i: number) => {
    setFruitIngs((prev) => {
      const next = [...prev];
      next[i] = { ...next[i], selected: !next[i].selected };
      return next;
    });
  };

  // ── Reset ────────────────────────────────────────────────────────────────────
  const handleReset = () => {
    setItemName('');
    setPrice('');
    setIsPickup(false);
    setIsDelivery(false);
    setDetails('');
    setRecipe('');
    setImages([null, null, null]);
    setBasicIngs(BASIC_INGREDIENTS.map((i) => ({ ...i, selected: false })));
    setFruitIngs(FRUIT_INGREDIENTS.map((i) => ({ ...i, selected: false })));
    setShowAllBasic(false);
    setShowAllFruit(false);
  };

  // ── Save ─────────────────────────────────────────────────────────────────────
  const handleSave = () => {
    if (!itemName.trim()) {
      Alert.alert('Validation', 'Please enter an item name.');
      return;
    }
    if (!price.trim()) {
      Alert.alert('Validation', 'Please enter a price.');
      return;
    }
    Alert.alert('Success', 'Menu item saved!', [
      { text: 'OK', onPress: () => navigation?.goBack?.() },
    ]);
  };

  // ── Ingredient chip ──────────────────────────────────────────────────────────
  const IngChip = ({
    item,
    onPress,
  }: {
    item: IngRow;
    onPress: () => void;
  }) => (
    <TouchableOpacity style={styles.ingChipWrap} onPress={onPress}>
      <View
        style={[
          styles.ingCircle,
          item.selected && styles.ingCircleSelected,
        ]}
      >
        <Text style={styles.ingEmoji}>{item.emoji}</Text>
      </View>
      <Text style={styles.ingLabel}>{item.label}</Text>
    </TouchableOpacity>
  );

  // ── Checkbox ─────────────────────────────────────────────────────────────────
  const Checkbox = ({
    checked,
    label,
    onPress,
  }: {
    checked: boolean;
    label: string;
    onPress: () => void;
  }) => (
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

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack?.()}
        >
          <Ionicons name="chevron-back" size={22} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add New Items</Text>
        <TouchableOpacity onPress={handleReset}>
          <Text style={styles.resetText}>RESET</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Item Name ─────────────────────────────────────────────────── */}
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

          {/* ── Upload Photo/Video ────────────────────────────────────────── */}
          <FormField label="UPLOAD PHOTO/VIDEO">
            <View style={styles.photoRow}>
              {images.map((uri, index) =>
                uri ? (
                  /* Filled slot */
                  <TouchableOpacity
                    key={index}
                    style={styles.photoSlotFilled}
                    onPress={() => pickImage(index)}
                  >
                    <Image
                      source={{ uri }}
                      style={StyleSheet.absoluteFill}
                      resizeMode="cover"
                    />
                    <View style={styles.photoEditBadge}>
                      <Ionicons name="pencil" size={10} color={WHITE} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  /* Empty slot */
                  <TouchableOpacity
                    key={index}
                    style={styles.photoSlotEmpty}
                    onPress={() => pickImage(index)}
                  >
                    <Ionicons name="cloud-upload-outline" size={24} color={ORANGE} />
                    <Text style={styles.photoAddLabel}>Add</Text>
                  </TouchableOpacity>
                )
              )}
            </View>
          </FormField>

          {/* ── Price + Delivery Type ─────────────────────────────────────── */}
          <FormField label="PRICE">
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
                <Checkbox
                  checked={isPickup}
                  label="Pick up"
                  onPress={() => setIsPickup((v) => !v)}
                />
                <Checkbox
                  checked={isDelivery}
                  label="Delivery"
                  onPress={() => setIsDelivery((v) => !v)}
                />
              </View>
            </View>
          </FormField>

          {/* ── Ingredients ───────────────────────────────────────────────── */}
          <SectionLabel text="INGREDIENTS" />

          {/* Basic row */}
          <View style={styles.ingHeader}>
            <Text style={styles.ingCategory}>Basic</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => setShowAllBasic(!showAllBasic)}>
              <Text style={styles.seeAllText}>{showAllBasic ? 'Show Less' : 'See All'}</Text>
              <Ionicons name={showAllBasic ? "chevron-up" : "chevron-down"} size={12} color={GREY} />
            </TouchableOpacity>
          </View>
          {showAllBasic ? (
            <View style={styles.ingGrid}>
              {basicIngs.map((ing, i) => (
                <IngChip key={i} item={ing} onPress={() => toggleBasic(i)} />
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ingScroll}
            >
              {basicIngs.map((ing, i) => (
                <IngChip key={i} item={ing} onPress={() => toggleBasic(i)} />
              ))}
            </ScrollView>
          )}

          {/* Fruit row */}
          <View style={[styles.ingHeader, { marginTop: 12 }]}>
            <Text style={styles.ingCategory}>Fruit</Text>
            <TouchableOpacity style={styles.seeAllBtn} onPress={() => setShowAllFruit(!showAllFruit)}>
              <Text style={styles.seeAllText}>{showAllFruit ? 'Show Less' : 'See All'}</Text>
              <Ionicons name={showAllFruit ? "chevron-up" : "chevron-down"} size={12} color={GREY} />
            </TouchableOpacity>
          </View>
          {showAllFruit ? (
            <View style={styles.ingGrid}>
              {fruitIngs.map((ing, i) => (
                <IngChip key={i} item={ing} onPress={() => toggleFruit(i)} />
              ))}
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.ingScroll}
            >
              {fruitIngs.map((ing, i) => (
                <IngChip key={i} item={ing} onPress={() => toggleFruit(i)} />
              ))}
            </ScrollView>
          )}

          {/* ── Details ───────────────────────────────────────────────────── */}
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

          {/* ── Recipe ────────────────────────────────────────────────────── */}
          <FormField label="RECIPE STEPS">
            <View style={[styles.inputBox, styles.textAreaBox, { height: 150 }]}>
              <TextInput
                style={[styles.input, styles.textArea, { height: 126 }]}
                value={recipe}
                onChangeText={setRecipe}
                placeholder="Enter recipe steps (one step per line)..."
                placeholderTextColor={GREY}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
            </View>
          </FormField>

          {/* ── Save Button ───────────────────────────────────────────────── */}
          <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
            <Text style={styles.saveBtnText}>SAVE CHANGES</Text>
          </TouchableOpacity>

          <View style={{ height: 32 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:  { flex: 1, backgroundColor: LIGHT_BG },

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
  resetText:   { fontSize: 13, fontWeight: '700', color: ORANGE, letterSpacing: 0.5 },

  // Scroll
  scroll: { padding: 20, paddingTop: 16 },

  // Form fields
  formField:    { marginBottom: 20 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: NAVY,
    letterSpacing: 1.2,
    marginBottom: 10,
  },

  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    paddingHorizontal: 14,
    height: 48,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: NAVY,
  },
  currencySymbol: { fontSize: 15, color: NAVY, fontWeight: '600' },

  textAreaBox: {
    height: 110,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  textArea: { height: 86 },

  // Photo upload
  photoRow: { flexDirection: 'row', gap: 10 },
  photoSlotFilled: {
    width: 90,
    height: 90,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: LIGHT_BG,
  },
  photoSlotEmpty: {
    width: 90,
    height: 90,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderStyle: 'dashed',
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  photoAddLabel: { fontSize: 11, color: GREY, fontWeight: '600' },
  photoEditBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Price row
  priceRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  deliveryOpts: { flexDirection: 'row', gap: 16, alignItems: 'center' },
  checkRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: BORDER,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkBoxChecked: { backgroundColor: ORANGE, borderColor: ORANGE },
  checkLabel: { fontSize: 13, color: NAVY, fontWeight: '500' },

  // Ingredients
  ingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  ingCategory: { fontSize: 14, fontWeight: '700', color: NAVY },
  seeAllBtn:   { flexDirection: 'row', alignItems: 'center', gap: 3 },
  seeAllText:  { fontSize: 12, color: GREY },

  ingScroll:   { paddingBottom: 8, gap: 6 },
  ingGrid:     { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingBottom: 8 },
  ingChipWrap: { alignItems: 'center', marginRight: 4 },
  ingCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: WHITE,
    borderWidth: 1.5,
    borderColor: BORDER,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  ingCircleSelected: {
    backgroundColor: ORANGE + '20',
    borderColor: ORANGE,
  },
  ingEmoji: { fontSize: 22 },
  ingLabel: { fontSize: 10, color: NAVY, textAlign: 'center', fontWeight: '500' },

  // Save button
  saveBtn: {
    backgroundColor: ORANGE,
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: ORANGE,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  saveBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
