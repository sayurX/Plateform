import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, StatusBar, TextInput, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ORANGE = '#FF7A28';
const NAVY   = '#1C1C2E';
const GREY   = '#9E9E9E';
const WHITE  = '#FFFFFF';
const BG     = '#F8F9FA';

const FAQS = [
  { q: 'How do I accept an order?', a: 'Go to the Orders tab and tap "Accept" on any incoming delivery request.' },
  { q: 'How are earnings calculated?', a: 'You earn a base fare + per km rate. Bonuses apply during peak hours.' },
  { q: 'What if I can\'t complete a delivery?', a: 'Contact support immediately and tap "Cannot Deliver" in the order detail.' },
  { q: 'How do I update my vehicle info?', a: 'Go to Profile → My Vehicles to change your delivery vehicle type.' },
];

export default function DriverSupportScreen({ navigation }: any) {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [message,  setMessage]  = useState('');

  const handleSend = () => {
    if (!message.trim()) { Alert.alert('Error', 'Please enter your message'); return; }
    Alert.alert('Sent!', 'Support team will respond within 24 hours.', [
      { text: 'OK', onPress: () => setMessage('') }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={WHITE} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={NAVY} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Quick contact */}
        <View style={styles.contactRow}>
          <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('tel:+94112345678')}>
            <View style={[styles.contactIcon, { backgroundColor: '#E4F9F0' }]}>
              <Ionicons name="call-outline" size={22} color="#2DB87E" />
            </View>
            <Text style={styles.contactLabel}>Call Us</Text>
            <Text style={styles.contactSub}>+94 11 234 5678</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactCard} onPress={() => Linking.openURL('mailto:support@plateform.lk')}>
            <View style={[styles.contactIcon, { backgroundColor: '#EEF2FF' }]}>
              <Ionicons name="mail-outline" size={22} color="#5C61F4" />
            </View>
            <Text style={styles.contactLabel}>Email</Text>
            <Text style={styles.contactSub}>support@plateform.lk</Text>
          </TouchableOpacity>
        </View>

        {/* FAQs */}
        <Text style={styles.sectionLabel}>Frequently Asked Questions</Text>
        <View style={styles.card}>
          {FAQS.map((faq, i) => (
            <React.Fragment key={i}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => setExpanded(expanded === i ? null : i)}
              >
                <Text style={styles.faqQ} numberOfLines={2}>{faq.q}</Text>
                <Ionicons
                  name={expanded === i ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={GREY}
                />
              </TouchableOpacity>
              {expanded === i && (
                <View style={styles.faqBody}>
                  <Text style={styles.faqA}>{faq.a}</Text>
                </View>
              )}
              {i < FAQS.length - 1 && <View style={styles.divider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Message form */}
        <Text style={styles.sectionLabel}>Send a Message</Text>
        <View style={styles.card}>
          <TextInput
            style={styles.messageInput}
            placeholder="Describe your issue..."
            placeholderTextColor={GREY}
            value={message}
            onChangeText={setMessage}
            multiline
            numberOfLines={5}
            textAlignVertical="top"
          />
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Ionicons name="send-outline" size={18} color={WHITE} style={{ marginRight: 8 }} />
          <Text style={styles.sendBtnText}>Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe:          { flex: 1, backgroundColor: WHITE },
  header:        { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 14 },
  headerTitle:   { fontSize: 18, fontWeight: '700', color: NAVY },
  scroll:        { paddingHorizontal: 24, paddingBottom: 60, paddingTop: 10 },

  contactRow:    { flexDirection: 'row', gap: 14, marginBottom: 24 },
  contactCard:   { flex: 1, backgroundColor: BG, borderRadius: 18, padding: 18, alignItems: 'center' },
  contactIcon:   { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  contactLabel:  { fontSize: 14, fontWeight: '700', color: NAVY, marginBottom: 2 },
  contactSub:    { fontSize: 11, color: GREY, textAlign: 'center' },

  sectionLabel:  { fontSize: 12, color: GREY, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 10 },
  card:          { backgroundColor: BG, borderRadius: 20, marginBottom: 20, overflow: 'hidden' },

  faqHeader:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  faqQ:          { flex: 1, fontSize: 14, fontWeight: '600', color: NAVY, marginRight: 10 },
  faqBody:       { paddingHorizontal: 16, paddingBottom: 14 },
  faqA:          { fontSize: 13, color: GREY, lineHeight: 20 },
  divider:       { height: 1, backgroundColor: '#EDEFF2', marginHorizontal: 16 },

  messageInput:  { padding: 16, fontSize: 14, color: NAVY, minHeight: 120 },

  sendBtn:       { backgroundColor: ORANGE, borderRadius: 16, height: 54, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' },
  sendBtnText:   { color: WHITE, fontSize: 16, fontWeight: '700' },
});
