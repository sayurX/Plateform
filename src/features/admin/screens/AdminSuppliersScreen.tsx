import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
  Linking,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '@/store/useStore';
import { fetchSuppliersApi, addSupplierApi, deleteSupplierApi, updateSupplierApi } from '@/api/supplierApi';

const ORANGE = '#FF7A28';
const NAVY = '#1C1C2E';
const LIGHT_BG = '#F2F3F7';
const WHITE = '#FFFFFF';
const GREY_TEXT = '#9E9E9E';

export default function AdminSuppliersScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const { token } = useStore();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<any>(null);

  // Form State
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const data = await fetchSuppliersApi(token!);
      setSuppliers(data);
    } catch (err) {
      Alert.alert('Error', 'Failed to load suppliers');
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
    if (!name || !email || !phone) {
        Alert.alert('Missing Info', 'Please fill name, email and phone');
        return;
    }
    try {
      if (editingSupplier) {
        await updateSupplierApi(token!, editingSupplier._id, { name, contactPerson: contact, email, phone });
      } else {
        await addSupplierApi(token!, { name, contactPerson: contact, email, phone });
      }
      handleCloseModal();
      loadData();
    } catch (err) {
      Alert.alert('Error', editingSupplier ? 'Failed to update supplier' : 'Failed to add supplier');
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditingSupplier(null);
    setName(''); setContact(''); setEmail(''); setPhone('');
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  const handleEmail = (address: string) => {
    Linking.openURL(`mailto:${address}`);
  };

  const renderSupplier = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity onPress={() => {
              setEditingSupplier(item);
              setName(item.name);
              setContact(item.contactPerson);
              setEmail(item.email);
              setPhone(item.phone);
              setModalVisible(true);
          }}>
              <Ionicons name="create-outline" size={18} color="#4C8EFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {
              Alert.alert('Delete', 'Are you sure?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Delete', style: 'destructive', onPress: async () => {
                      await deleteSupplierApi(token!, item._id);
                      loadData();
                  }}
              ]);
          }}>
              <Ionicons name="trash-outline" size={18} color="#FF4B4B" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.contact}>Contact: {item.contactPerson || 'N/A'}</Text>
      
      <View style={styles.divider} />
      
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleCall(item.phone)}>
          <Ionicons name="call" size={18} color={ORANGE} />
          <Text style={styles.actionText}>{item.phone}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionBtn} onPress={() => handleEmail(item.email)}>
          <Ionicons name="mail" size={18} color="#4C8EFF" />
          <Text style={styles.actionText}>{item.email}</Text>
        </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Supplier Portal</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <Ionicons name="person-add" size={24} color={ORANGE} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={ORANGE} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={suppliers}
          renderItem={renderSupplier}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.empty}>No suppliers found</Text>}
        />
      )}

      {/* Add Modal */}
      <Modal visible={modalVisible} animationType="slide">
        <SafeAreaView style={{ flex: 1 }}>
          <View style={[styles.modalHeader, { paddingTop: insets.top || 20 }]}>
            <TouchableOpacity onPress={handleCloseModal}>
              <Ionicons name="close" size={28} color={NAVY} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{editingSupplier ? 'Edit Vendor' : 'New Vendor'}</Text>
            <TouchableOpacity onPress={handleSubmit}>
               <Text style={{ color: ORANGE, fontWeight: '700', fontSize: 16 }}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.form}>
            <TextInput style={styles.input} placeholder="Vendor Name" value={name} onChangeText={setName} />
            <TextInput style={styles.input} placeholder="Contact Person" value={contact} onChangeText={setContact} />
            <TextInput style={styles.input} placeholder="Email" keyboardType="email-address" value={email} onChangeText={setEmail} />
            <TextInput style={styles.input} placeholder="Phone Number" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
          </View>
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
  card: {
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  name: { fontSize: 17, fontWeight: '700', color: NAVY },
  contact: { fontSize: 13, color: GREY_TEXT, marginBottom: 12 },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 12 },
  actions: { flexDirection: 'row', gap: 16 },
  actionBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  actionText: { fontSize: 13, color: NAVY, fontWeight: '500' },
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
  input: {
    backgroundColor: LIGHT_BG,
    height: 54,
    borderRadius: 14,
    paddingHorizontal: 16,
    fontSize: 15,
    marginBottom: 16,
    color: NAVY,
  },
});
