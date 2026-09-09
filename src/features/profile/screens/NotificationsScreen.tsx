import React, { useEffect } from 'react';
import { View, StyleSheet, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';
import { useStore } from '@/store/useStore';

export default function NotificationsScreen({ navigation }: any) {
  const { notifications, loadNotifications } = useStore();
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    loadNotifications().finally(() => setLoading(false));
    
    // Polling for new notifications
    const interval = setInterval(() => {
      loadNotifications();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const getIcon = (type: string, title: string) => {
    if (title.toLowerCase().includes('payment')) return { name: 'card', color: '#FF7A28' };
    if (title.toLowerCase().includes('confirmed') || title.toLowerCase().includes('delivered')) return { name: 'checkmark-circle', color: '#23C4D7' };
    if (title.toLowerCase().includes('cooking')) return { name: 'restaurant', color: '#FF7A28' };
    return { name: 'notifications', color: Colors.primary };
  };

  const getTimeLabel = (date: Date) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const day = 24 * 60 * 60 * 1000;

    if (diff < day) {
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diff < 2 * day) {
      return 'Yesterday';
    } else {
      return d.toLocaleDateString([], { day: '2-digit', month: 'short' });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notifications</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {loading ? (
             <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 50 }} />
        ) : notifications.length === 0 ? (
          <View style={styles.emptyContainer}>
             <Ionicons name="notifications-off-outline" size={80} color="#F0F5FA" />
             <Text style={styles.emptyText}>No notifications yet</Text>
          </View>
        ) : (
          notifications.map((item: any) => {
            const icon = getIcon(item.type, item.title);
            return (
              <View key={item._id} style={styles.card}>
                <View style={styles.iconContainer}>
                  <Ionicons name={icon.name as any} size={28} color={icon.color} />
                </View>
                <View style={styles.cardInfo}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardText}>{item.message}</Text>
                  <Text style={styles.timeText}>{getTimeLabel(item.createdAt)}</Text>
                </View>
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  scrollContent: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 40 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, marginVertical: 10 },
  iconButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F0F5FA', justifyContent: 'center', alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: Colors.text },
  card: { flexDirection: 'row', backgroundColor: '#F6F8FA', borderRadius: 24, padding: 20, marginBottom: 16 },
  iconContainer: { marginRight: 16, marginTop: 2 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: Colors.text, marginBottom: 8 },
  cardText: { fontSize: 14, color: Colors.textSecondary, lineHeight: 22, marginBottom: 10 },
  timeText: { fontSize: 12, color: '#A0A5BA', fontWeight: '500' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#A0A5BA', marginTop: 16, fontSize: 16 },
});
