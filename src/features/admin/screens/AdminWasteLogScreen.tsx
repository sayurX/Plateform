import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { fetchWasteLogsApi, logWasteApi, updateWasteLogApi, deleteWasteLogApi } from '@/api/wasteApi';
import { fetchIngredientsApi } from '@/api/inventoryApi';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY_TEXT = '#9E9E9E';

export default function AdminWasteLogScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { token, user } = useStore();
  const [logs, setLogs] = useState<any[]>([]);
  const [ingredients, setIngredients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingLog, setEditingLog] = useState<any>(null);

  // Form
  const [selectedIngredient, setSelectedIngredient] = useState<any>(null);
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [logData, ingData] = await Promise.all([
        fetchWasteLogsApi(token!),
        fetchIngredientsApi(token!)
      ]);
      setLogs(logData);
      setIngredients(ingData);
    } catch (err) {
      Alert.alert('Error', 'Failed to load waste logs');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const handleSubmit = async () => {
    if (!selectedIngredient || !quantity || !reason) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    try {
      if (editingLog) {
        await updateWasteLogApi(token!, editingLog._id, {
          quantity: Number(quantity),
          reason
        });
      } else {
        await logWasteApi(token!, {
          ingredient: selectedIngredient._id,
          quantity: Number(quantity),
          reason,
          loggedBy: user?.id
        });
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      Alert.alert('Error', editingLog ? 'Failed to update log' : 'Failed to log waste');
    }
  };

  const handleDeleteLog = async (id: string) => {
    Alert.alert('Delete Log', 'This will restore the wasted quantity back to stock. Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await deleteWasteLogApi(token!, id);
          loadData();
        } catch (err) {
          Alert.alert('Error', 'Failed to delete log');
        }
      }}
    ]);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingLog(null);
    setSelectedIngredient(null);
    setQuantity('');
    setReason('');
  };

  const renderLog = ({ item }: { item: any }) => (
    <View style={styles.logCard}>
      <View style={styles.logHeader}>
        <Text style={styles.logIngredient}>{item.ingredient?.name || 'Deleted'}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Text style={styles.logQty}>-{item.quantity} {item.ingredient?.unit}</Text>
          <TouchableOpacity onPress={() => {
              setEditingLog(item);
              setSelectedIngredient(item.ingredient);
              setQuantity(item.quantity.toString());
              setReason(item.reason);
              setModalVisible(true);
          }}>
              <Ionicons name="create-outline" size={16} color="#4C8EFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleDeleteLog(item._id)}>
              <Ionicons name="trash-outline" size={16} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.logReason}>{item.reason}</Text>
      <View style={styles.logMeta}>
         <Ionicons name="time-outline" size={12} color={GREY_TEXT} />
         <Text style={styles.logTime}>{new Date(item.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</Text>
         <Text style={styles.logUser}> • By {item.loggedBy?.name}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Waste/Spoilage Log</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="add-circle" size={28} color="#FF4B4B" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={logs}
          renderItem={renderLog}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No logs recorded</Text>}
        />
      )}

      {/* Log Waste Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: WHITE }}>
          <View style={[styles.modalHeader, { paddingTop: insets.top || 20 }]}>
            <TouchableOpacity onPress={handleCloseModal}>
              <Ionicons name="close" size={28} color={NAVY} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{editingLog ? 'Edit Waste Log' : 'Log Waste'}</Text>
            <TouchableOpacity onPress={handleSubmit}>
              <Text style={{ color: ORANGE, fontWeight: '700' }}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.form}>
            <Text style={styles.label}>Select Ingredient</Text>
            <View style={styles.ingGrid}>
              {ingredients.map(ing => (
                <TouchableOpacity 
                  key={ing._id}
                  style={[
                    styles.ingChip, 
                    selectedIngredient?._id === ing._id && styles.ingChipSelected
                  ]}
                  onPress={() => setSelectedIngredient(ing)}
                >
                  <Text style={[
                     styles.ingChipText,
                     selectedIngredient?._id === ing._id && { color: WHITE }
                  ]}>{ing.name}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Quantity ({selectedIngredient?.unit || 'units'})</Text>
            <TextInput 
               style={styles.input} 
               placeholder="How much was wasted?"
               keyboardType="numeric"
               value={quantity}
               onChangeText={setQuantity}
            />

            <Text style={styles.label}>Reason</Text>
            <TextInput 
               style={[styles.input, { height: 100, textAlignVertical: 'top', paddingTop: 12 }]} 
               placeholder="e.g. Spilled, Expired, Rotten"
               multiline
               value={reason}
               onChangeText={setReason}
            />
          </ScrollView>
        </SafeAreaView>
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
  list: { padding: 20 },
  logCard: {
    backgroundColor: WHITE,
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  logIngredient: { fontSize: 16, fontWeight: '700', color: NAVY },
  logQty: { fontSize: 16, fontWeight: '800', color: '#FF4B4B' },
  logReason: { fontSize: 14, color: NAVY, marginBottom: 8 },
  logMeta: { flexDirection: 'row', alignItems: 'center' },
  logTime: { fontSize: 11, color: GREY_TEXT, marginLeft: 4 },
  logUser: { fontSize: 11, color: GREY_TEXT },
  empty: { textAlign: 'center', marginTop: 40, color: GREY_TEXT },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: WHITE,
  },
  form: { padding: 20 },
  label: { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 8, marginTop: 16 },
  ingGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  ingChip: { 
    paddingHorizontal: 16, 
    paddingVertical: 8, 
    borderRadius: 20, 
    backgroundColor: LIGHT_BG,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  ingChipSelected: { backgroundColor: NAVY, borderColor: NAVY },
  ingChipText: { fontSize: 13, color: NAVY },
  input: {
    backgroundColor: LIGHT_BG,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    fontSize: 15,
    color: NAVY,
  },
});
