import React, { useEffect, useState } from 'react';
import { View, Image, StyleSheet, Dimensions, Animated } from 'react-native';
import { Colors } from '@/theme/colors';
import { Sunburst } from '@/components/Sunburst';

const { width } = Dimensions.get('window');
const TOP_LEFT_SIZE = width * 0.55;
const BOTTOM_RIGHT_SIZE = width * 0.75;

export default function SplashScreen({ navigation }: any) {
  const [showSunburst, setShowSunburst] = useState(false);

  useEffect(() => {
    // Show sunbursts after 1.5 seconds
    const timer1 = setTimeout(() => {
      setShowSunburst(true);
    }, 1500);

    // Navigate to Onboarding after 3 seconds total
    const timer2 = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 3000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  return (
    <View style={styles.container}>
      {showSunburst && (
        <View style={StyleSheet.absoluteFill}>
          {/* Top Left Decoration */}
          <View style={styles.topLeft}>
            <Sunburst 
              color="#F2F2F2" 
              radius={TOP_LEFT_SIZE} 
              rayCount={12} 
            />
          </View>
          {/* Bottom Right Decoration */}
          <View style={styles.bottomRight}>
            <Sunburst 
              color={Colors.primary} 
              radius={BOTTOM_RIGHT_SIZE} 
              rayCount={14} 
              style={{ transform: [{ rotate: '180deg' }] }}
            />
          </View>
        </View>
      )}

      <Image 
        source={require('@/assets/images/logo.png')} 
        style={styles.logo} 
        resizeMode="contain" 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: width * 0.6,
    height: width * 0.6,
    zIndex: 10,
  },
  topLeft: {
    position: 'absolute',
    top: -TOP_LEFT_SIZE * 0.15,
    left: -TOP_LEFT_SIZE * 0.15,
    width: TOP_LEFT_SIZE,
    height: TOP_LEFT_SIZE,
  },
  bottomRight: {
    position: 'absolute',
    bottom: -BOTTOM_RIGHT_SIZE * 0.15,
    right: -BOTTOM_RIGHT_SIZE * 0.15,
    width: BOTTOM_RIGHT_SIZE,
    height: BOTTOM_RIGHT_SIZE,
  },
});
