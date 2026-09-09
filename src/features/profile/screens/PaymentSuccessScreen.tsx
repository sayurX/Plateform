import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';

export default function PaymentSuccessScreen({ navigation, route }: any) {
  const { orderId } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Placeholder for the success graphic */}
        <View style={styles.graphicContainer}>
           <Ionicons name="wallet" size={100} color={Colors.primary} />
           <Ionicons name="star" size={24} color="#FFB01D" style={{position:'absolute', top:0, left:20}} />
           <Ionicons name="star" size={16} color="#FFB01D" style={{position:'absolute', bottom:20, right:-10}} />
           <Ionicons name="sparkles" size={32} color="#23C4D7" style={{position:'absolute', top:20, right:20}} />
           <Ionicons name="checkmark-circle" size={40} color="#00E58F" style={{position:'absolute', bottom:10, right:30, zIndex: 10}} />
        </View>

        <Text style={styles.title}>Congratulations!</Text>
        <Text style={styles.subtext}>You successfully maked a payment,{'\n'}enjoy our service!</Text>
      </View>

      <View style={styles.footer}>
        <AppButton 
          title="TRACK ORDER" 
          onPress={() => navigation.navigate('OrderTracker', { orderId })} 
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 },
  graphicContainer: { width: 160, height: 160, justifyContent: 'center', alignItems: 'center', marginBottom: 32, position: 'relative' },
  title: { fontSize: 24, fontWeight: 'bold', color: Colors.text, marginBottom: 12 },
  subtext: { fontSize: 16, color: Colors.textSecondary, textAlign: 'center', lineHeight: 26 },
  footer: { paddingHorizontal: 24, paddingBottom: 24, paddingTop: 16 },
});
