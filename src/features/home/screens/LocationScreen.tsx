import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/theme/colors';

import * as Location from 'expo-location';
import { useStore } from '@/store/useStore';

export default function LocationScreen({ navigation }: any) {
  const [isLoading, setIsLoading] = React.useState(false);
  const setCurrentAddress = useStore((state) => state.setCurrentAddress);
  const setJustLoggedIn = useStore((state) => state.setJustLoggedIn);

  React.useEffect(() => {
    // Reset the flag so auto-login doesn't trigger this again
    setJustLoggedIn(false);
  }, []);


  const handleAccessLocation = async () => {
    setIsLoading(true);
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Allow location access to find restaurants near you');
        setIsLoading(false);
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let reverseResult = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseResult.length > 0) {
        const addr = reverseResult[0];
        // Use a more concise format to avoid overflowing header
        const shortAddress = addr.street || addr.name || addr.city || 'Current Location';
        setCurrentAddress(shortAddress);
      }

      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'Could not get your location');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <Image 
          source={require('@/assets/images/map_location.png')} 
          style={styles.mapImage} 
          resizeMode="contain" 
        />
      </View>

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && { opacity: 0.7 }]} 
          onPress={handleAccessLocation}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>{isLoading ? 'SEARCHING...' : 'ACCESS LOCATION'}</Text>
          <View style={styles.iconCircle}>
            <Ionicons name="location-outline" size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          DFOOD WILL ACCESS YOUR LOCATION{'\n'}ONLY WHILE USING THE APP
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
  },
  mapContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapImage: {
    width: '100%',
    height: 300,
  },
  footer: {
    paddingBottom: 40,
  },
  button: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
  },
  buttonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconCircle: {
    position: 'absolute',
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  disclaimer: {
    textAlign: 'center',
    color: '#8A8A9D',
    fontSize: 12,
    marginTop: 20,
    lineHeight: 18,
    textTransform: 'uppercase',
  },
});
