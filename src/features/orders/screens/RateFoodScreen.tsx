import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';

export default function RateFoodScreen({ route, navigation }: any) {
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');

  // Default fallback if not passed accurately
  const foodName = route.params?.foodName || "your meal";

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add Rating</Text>
        <View style={{ width: 44 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex:1}}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          <View style={styles.imageBox}>
             <Ionicons name="pizza" size={80} color={Colors.white} />
          </View>

          <Text style={styles.title}>Please rate the food service</Text>
          <Text style={styles.subtitle}>How was {foodName}?</Text>

          <View style={styles.starsRow}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)} style={styles.starWrapper}>
                <Ionicons 
                  name={rating >= star ? "star" : "star-outline"} 
                  size={46} 
                  color={rating >= star ? "#FFB01D" : '#E8EAED'} 
                />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write your feedback..."
              placeholderTextColor={Colors.textSecondary}
              multiline
              textAlignVertical="top"
              value={review}
              onChangeText={setReview}
            />
          </View>

          <View style={styles.buttonWrapper}>
            <AppButton 
               title="SUBMIT RATING" 
               onPress={() => navigation.goBack()} 
            />
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  
  scrollContent: { paddingHorizontal: 24, paddingBottom: 40, alignItems: 'center' },
  
  imageBox: { width: 150, height: 150, borderRadius: 40, backgroundColor: '#FFD29F', justifyContent: 'center', alignItems: 'center', marginTop: 40, marginBottom: 32 },
  
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, textAlign: 'center', marginBottom: 12 },
  subtitle: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', marginBottom: 40, paddingHorizontal: 20 },
  
  starsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 40 },
  starWrapper: { padding: 4 },
  
  inputContainer: { width: '100%', backgroundColor: '#F6F8FA', borderRadius: 24, padding: 20, minHeight: 140, marginBottom: 40 },
  input: { flex: 1, fontSize: 16, color: Colors.text },
  
  buttonWrapper: { width: '100%' }
});
