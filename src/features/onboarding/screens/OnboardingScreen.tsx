import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Dimensions, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/theme/colors';
import { AppButton } from '@/components/AppButton';

const { width, height } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    title: 'All your favorites',
    description: 'Get all your loved foods in one once place,\nyou just place the orer we do the rest',
    image: require('@/assets/images/onboarding1.png'),
    buttonLabel: 'NEXT',
  },
  {
    id: '2',
    title: 'Order from choosen chef',
    description: 'Get all your loved foods in one once place,\nyou just place the orer we do the rest',
    image: require('@/assets/images/onboarding2.png'),
    buttonLabel: 'NEXT',
  },
  {
    id: '3',
    title: 'Fast & safe delivery',
    description: 'Get all your loved foods in one once place,\nyou just place the orer we do the rest',
    image: require('@/assets/images/onboarding3.png'),
    buttonLabel: 'GET STARTED',
  },
];

export default function OnboardingScreen({ navigation }: any) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = () => {
    if (currentIndex < DATA.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.navigate('SignUp');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.slide}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} resizeMode="contain" />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.listContainer}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {DATA.map((_, index) => (
            <View 
              key={index} 
              style={[
                styles.dot, 
                currentIndex === index ? styles.activeDot : styles.inactiveDot
              ]} 
            />
          ))}
        </View>

        <AppButton 
          title={DATA[currentIndex].buttonLabel} 
          onPress={handleNext} 
        />
        
        {currentIndex !== DATA.length - 1 ? (
          <TouchableOpacity onPress={() => navigation.navigate('SignUp')} style={styles.skipButton}>
            <Text style={styles.skip}>Skip</Text>
          </TouchableOpacity>
        ) : (
          <View style={{ height: 40 }} /> // Spacer to maintain consistent layout
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  listContainer: {
    flex: 1,
  },
  slide: {
    width,
    alignItems: 'center',
    paddingTop: height * 0.05,
  },
  imageContainer: {
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.85,
    height: '100%',
  },
  textContainer: {
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#2D2D3A', // Dark navy/slate from the image
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 14,
    color: '#8A8A9D',
    textAlign: 'center',
    lineHeight: 22,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: height * 0.05,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 35,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 6,
  },
  activeDot: {
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    backgroundColor: '#FFE3D3',
  },
  skipButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  skip: {
    color: '#8A8A9D',
    fontSize: 16,
    fontWeight: '500',
  },
});
