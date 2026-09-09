import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigator } from './src/navigation/AppNavigator';

// Note: NavigationContainer from @react-navigation/native is needed
import { NavigationContainer as RootNavigationContainer } from '@react-navigation/native';

export default function App() {
  return (
    <SafeAreaProvider style={styles.container}>
      <RootNavigationContainer>
        <AppNavigator />
      </RootNavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
