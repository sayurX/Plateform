import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { fetchIngredientsApi, addIngredientApi, updateStockApi, deleteIngredientApi, updateIngredientApi } from '@/api/inventoryApi';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY_TEXT = '#9E9E9E';
const RED = '#FF4B4B';
const GREEN = '#2DB87E';

export default function AdminInventoryScreen({ navigation }: any) {
  const { token } = useStore();
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Modals
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [stockModalVisible, setStockModalVisible] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  
  // Form State
  const [newName, setNewName] = useState('');
  const [newUnit, setNewUnit] = useState('kg');
  const [newMin, setNewMin] = useState('10');
  const [stockDelta, setStockDelta] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchIngredientsApi(token!);
      setIngredients(data);
    } catch (err) {
      console.error(err);
      Alert.alert('Error', 'Failed to load inventory');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleAddIngredient = async () => {
    if (!newName || !newUnit) return;
    try {
      await addIngredientApi(token!, {
        name: newName,
        unit: newUnit,
        minThreshold: Number(newMin),
      });
      setAddModalVisible(false);
      setNewName('');
      loadData();
    } catch (err) {
      Alert.alert('Error', 'Failed to add ingredient');
    }
  };

  const handleEditIngredient = async () => {
    if (!selectedIngredient || !newName || !newUnit) return;
    try {
      await updateIngredientApi(token!, selectedIngredient._id, {
        name: newName,
        unit: newUnit,
        minThreshold: Number(newMin),
      });
      setEditModalVisible(false);
      setSelectedIngredient(null);
      loadData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update ingredient');
    }
  };

  const handleDeleteIngredient = async (id: string) => {
    Alert.alert('Delete Ingredient', 'Are you sure you want to remove this item?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteIngredientApi(token!, id);
          loadData();
        } catch (err) {
          Alert.alert('Error', 'Failed to delete');
        }
      }}
    ]);
  };

  const handleUpdateStock = async () => {
    if (!selectedIngredient || !stockDelta) return;
    try {
      await updateStockApi(token!, selectedIngredient._id, Number(stockDelta));
      setStockModalVisible(false);
      setStockDelta('');
      loadData();
    } catch (err) {
      Alert.alert('Error', 'Failed to update stock');
    }
  };

  const filteredIngredients = ingredients.filter(i => 
    i.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderIngredient = ({ item }: { item: any }) => {
    const isLow = item.currentStock <= item.minThreshold;
    return (
      <View style={styles.itemCard}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDetails}>{item.unit} • Threshold: {item.minThreshold}</Text>
        </View>
        <View style={styles.stockInfo}>
          <Text style={[styles.stockValue, isLow && { color: RED }]}>
            {item.currentStock}
          </Text>
          {isLow && (
            <View style={styles.lowBadge}>
              <Text style={styles.lowText}>LOW</Text>
            </View>
          )}
        </View>
        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => {
            setSelectedIngredient(item);
            setStockModalVisible(true);
          }}
        >
          <Ionicons name="add-circle-outline" size={24} color={ORANGE} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => {
            setSelectedIngredient(item);
            setNewName(item.name);
            setNewUnit(item.unit);
            setNewMin(item.minThreshold.toString());
            setEditModalVisible(true);
          }}
        >
          <Ionicons name="create-outline" size={22} color="#4C8EFF" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionBtn}
          onPress={() => handleDeleteIngredient(item._id)}
        >
          <Ionicons name="trash-outline" size={22} color={RED} />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Stock Inventory</Text>
        <TouchableOpacity onPress={() => setAddModalVisible(true)}>
          <Ionicons name="add" size={28} color={ORANGE} />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color={GREY_TEXT} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ingredients..."
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={filteredIngredients}
          renderItem={renderIngredient}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No ingredients found</Text>
          }
        />
      )}

      {/* Add Ingredient Modal */}
      <Modal visible={addModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add New Ingredient</Text>
            <TextInput
              style={styles.input}
              placeholder="Name (e.g. Flour)"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit (e.g. kg, liters)"
              value={newUnit}
              onChangeText={setNewUnit}
            />
            <TextInput
              style={styles.input}
              placeholder="Min Threshold"
              keyboardType="numeric"
              value={newMin}
              onChangeText={setNewMin}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#EEE' }]} onPress={() => setAddModalVisible(false)}>
                <Text style={{ color: NAVY }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: ORANGE }]} onPress={handleAddIngredient}>
                <Text style={{ color: WHITE, fontWeight: '700' }}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Ingredient Modal */}
      <Modal visible={editModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Edit Ingredient</Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={newName}
              onChangeText={setNewName}
            />
            <TextInput
              style={styles.input}
              placeholder="Unit"
              value={newUnit}
              onChangeText={setNewUnit}
            />
            <TextInput
              style={styles.input}
              placeholder="Min Threshold"
              keyboardType="numeric"
              value={newMin}
              onChangeText={setNewMin}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#EEE' }]} onPress={() => setEditModalVisible(false)}>
                <Text style={{ color: NAVY }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: ORANGE }]} onPress={handleEditIngredient}>
                <Text style={{ color: WHITE, fontWeight: '700' }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Update Stock Modal */}
      <Modal visible={stockModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { width: '80%' }]}>
            <Text style={styles.modalTitle}>Update Stock: {selectedIngredient?.name}</Text>
            <Text style={styles.modalSubtitle}>Enter quantity to add (e.g. 10 or -5)</Text>
            <TextInput
              style={styles.input}
              placeholder="Quantity"
              keyboardType="numeric"
              value={stockDelta}
              onChangeText={setStockDelta}
              autoFocus
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: '#EEE' }]} onPress={() => setStockModalVisible(false)}>
                <Text style={{ color: NAVY }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.modalBtn, { backgroundColor: GREEN }]} onPress={handleUpdateStock}>
                <Text style={{ color: WHITE, fontWeight: '700' }}>Update</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: LIGHT_BG },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: WHITE,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: NAVY },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: WHITE,
    marginHorizontal: 20,
    marginVertical: 12,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 15 },
  listContent: { padding: 20, paddingBottom: 40 },
  itemCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 16, fontWeight: '700', color: NAVY },
  itemDetails: { fontSize: 13, color: GREY_TEXT, marginTop: 2 },
  stockInfo: { alignItems: 'center', marginRight: 15 },
  stockValue: { fontSize: 18, fontWeight: '800', color: NAVY },
  lowBadge: { backgroundColor: RED + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginTop: 2 },
  lowText: { color: RED, fontSize: 9, fontWeight: '800' },
  actionBtn: { padding: 4 },
  emptyText: { textAlign: 'center', marginTop: 40, color: GREY_TEXT, fontSize: 15 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalCard: { backgroundColor: WHITE, width: '90%', borderRadius: 24, padding: 24 },
  modalTitle: { fontSize: 20, fontWeight: '800', color: NAVY, marginBottom: 16 },
  modalSubtitle: { fontSize: 14, color: GREY_TEXT, marginBottom: 16 },
  input: {
    backgroundColor: LIGHT_BG,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 50,
    marginBottom: 12,
    fontSize: 16,
  },
  modalButtons: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalBtn: { flex: 1, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
});
