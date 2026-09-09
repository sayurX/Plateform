import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { useStore } from '@/store/useStore';
import { fetchReviewsApi, createReviewApi, deleteReviewApi } from '@/api/reviewApi';

const ORANGE = '#FF7A28';

export default function UserReviewsScreen({ navigation }: any) {
  const { token, user } = useStore();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Write review modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = useCallback(async () => {
    if (!token) return;
    try {
      setLoading(true);
      const data = await fetchReviewsApi(token);
      setReviews(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const handleSubmit = async () => {
    if (!comment.trim()) {
      Alert.alert('Validation', 'Please write a comment before submitting.');
      return;
    }
    if (!token) return;
    try {
      setSubmitting(true);
      await createReviewApi(token, { rating, comment });
      setComment('');
      setRating(5);
      setModalVisible(false);
      await loadReviews();
    } catch (e) {
      Alert.alert('Error', 'Failed to submit review.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Review', 'Are you sure you want to delete this review?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          if (!token) return;
          await deleteReviewApi(token, id);
          await loadReviews();
        },
      },
    ]);
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User Reviews</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setModalVisible(true)}>
          <Ionicons name="add" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      {/* Review List */}
      {loading ? (
        <ActivityIndicator color={ORANGE} style={{ marginTop: 60 }} />
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {reviews.length === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="chatbubble-outline" size={52} color="#E0E0E0" />
              <Text style={styles.emptyText}>No reviews yet. Be the first!</Text>
            </View>
          )}
          {reviews.map((rev) => (
            <View key={rev._id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View>
                  <Text style={styles.cardTitle}>{rev.user?.fullName || 'Anonymous'}</Text>
                  <Text style={styles.cardDate}>{formatDate(rev.createdAt)}</Text>
                  {rev.food && (
                    <Text style={styles.cardFood}>🍽️ {rev.food?.name}</Text>
                  )}
                </View>
                <View style={styles.cardRight}>
                  <View style={styles.ratingBox}>
                    <Ionicons name="star" color="#FFB01D" size={14} />
                    <Text style={styles.ratingText}>{rev.rating.toFixed(1)}</Text>
                  </View>
                  {/* Allow owner or admin to delete */}
                  {(rev.user?._id === user?._id || user?.role === 'admin') && (
                    <TouchableOpacity onPress={() => handleDelete(rev._id)} style={{ marginTop: 6 }}>
                      <Ionicons name="trash-outline" size={16} color="#FF4B4B" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Text style={styles.cardText}>"{rev.comment}"</Text>
            </View>
          ))}
        </ScrollView>
      )}

      {/* Write Review Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Write a Review</Text>

            {/* Star Rating */}
            <Text style={styles.modalLabel}>Rating</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Ionicons
                    name={s <= rating ? 'star' : 'star-outline'}
                    size={32}
                    color="#FFB01D"
                    style={{ marginHorizontal: 4 }}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Comment */}
            <Text style={styles.modalLabel}>Comment</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Share your experience..."
              placeholderTextColor="#A0A5BA"
              multiline
              numberOfLines={4}
              value={comment}
              onChangeText={setComment}
            />

            <View style={styles.modalBtns}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={submitting}>
                {submitting ? (
                  <ActivityIndicator color="#FFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginVertical: 10,
  },
  iconButton: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: '#F0F5FA',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  addBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: ORANGE,
    justifyContent: 'center', alignItems: 'center',
  },

  emptyBox: { alignItems: 'center', marginTop: 80, gap: 12 },
  emptyText: { color: '#A0A5BA', fontSize: 15 },

  card: {
    backgroundColor: '#F6F8FA',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardRight: { alignItems: 'flex-end' },
  cardTitle: { fontSize: 15, fontWeight: 'bold', color: Colors.text },
  cardDate: { fontSize: 11, color: '#A0A5BA', marginTop: 2 },
  cardFood: { fontSize: 12, color: ORANGE, marginTop: 4, fontWeight: '600' },
  ratingBox: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  ratingText: { fontSize: 14, fontWeight: '600', color: Colors.text },
  cardText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, fontStyle: 'italic' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalBox: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    paddingBottom: 40,
  },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1C1C2E', marginBottom: 20, textAlign: 'center' },
  modalLabel: { fontSize: 13, fontWeight: '600', color: '#A0A5BA', marginBottom: 8, marginTop: 12 },
  starsRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 8 },
  textArea: {
    backgroundColor: '#F6F8FA',
    borderRadius: 14,
    padding: 14,
    fontSize: 14,
    color: '#1C1C2E',
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 20 },
  cancelBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 14,
    backgroundColor: '#F6F8FA', alignItems: 'center',
  },
  cancelBtnText: { fontWeight: '600', color: '#1C1C2E', fontSize: 15 },
  submitBtn: {
    flex: 2, paddingVertical: 14, borderRadius: 14,
    backgroundColor: ORANGE, alignItems: 'center',
  },
  submitBtnText: { fontWeight: '700', color: '#FFF', fontSize: 15 },
});
