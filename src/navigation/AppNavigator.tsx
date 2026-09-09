import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from '@/features/onboarding/screens/SplashScreen';
import OnboardingScreen from '@/features/onboarding/screens/OnboardingScreen';
import LoginScreen from '@/features/auth/screens/LoginScreen';
import SignUpScreen from '@/features/auth/screens/SignUpScreen';
import VerificationScreen from '@/features/auth/screens/VerificationScreen';
import ForgotPasswordScreen from '@/features/auth/screens/ForgotPasswordScreen';
import ResetPasswordScreen from '@/features/auth/screens/ResetPasswordScreen';
import LocationScreen from '@/features/home/screens/LocationScreen';
import HomeScreen from '@/features/home/screens/HomeScreen';
import CategoriesScreen from '@/features/home/screens/CategoriesScreen';
import CategoryDetailsScreen from '@/features/home/screens/CategoryDetailsScreen';
import FoodDetailsScreen from '@/features/home/screens/FoodDetailsScreen';
import OrderTrackerScreen from '@/features/orders/screens/OrderTrackerScreen';
import RateFoodScreen from '@/features/orders/screens/RateFoodScreen';
import OrderHistoryScreen from '@/features/orders/screens/OrderHistoryScreen';
import ProfileScreen from '@/features/profile/screens/ProfileScreen';
import AddNewAddressScreen from '@/features/profile/screens/AddNewAddressScreen';
import AddCardScreen from '@/features/profile/screens/AddCardScreen';
import PaymentSuccessScreen from '@/features/profile/screens/PaymentSuccessScreen';
import EditAddressScreen from '@/features/profile/screens/EditAddressScreen';
import PaymentBreakdownScreen from '@/features/cart/screens/PaymentBreakdownScreen';

// Admin screens
import AdminHomeScreen from '@/features/admin/screens/AdminHomeScreen';
import AdminOrdersScreen from '@/features/admin/screens/AdminOrdersScreen';
import AdminUsersScreen from '@/features/admin/screens/AdminUsersScreen';
import AdminNotificationsScreen from '@/features/admin/screens/AdminNotificationsScreen';
import AdminProfileScreen from '@/features/admin/screens/AdminProfileScreen';
import AdminMenuScreen from '@/features/admin/screens/AdminMenuScreen';
import AdminFoodDetailsScreen from '@/features/admin/screens/AdminFoodDetailsScreen';
import AdminReportsScreen from '@/features/admin/screens/AdminReportsScreen';
import AdminAddItemScreen from '@/features/admin/screens/AdminAddItemScreen';
import AdminInventoryScreen from '@/features/admin/screens/AdminInventoryScreen';
import AdminSuppliersScreen from '@/features/admin/screens/AdminSuppliersScreen';
import AdminWasteLogScreen from '@/features/admin/screens/AdminWasteLogScreen';

// Chef screens
import ChefHomeScreen from '@/features/chef/screens/ChefHomeScreen';
import ChefOrdersScreen from '@/features/chef/screens/ChefOrdersScreen';
import ChefNotificationsScreen from '@/features/chef/screens/ChefNotificationsScreen';
import ChefFoodListScreen from '@/features/chef/screens/ChefFoodListScreen';
import ChefFoodDetailsScreen from '@/features/chef/screens/ChefFoodDetailsScreen';
import ChefProfileScreen from '@/features/chef/screens/ChefProfileScreen';

// Driver screens
import DriverHomeScreen from '@/features/driver/screens/DriverHomeScreen';
import DriverOrdersScreen from '@/features/driver/screens/DriverOrdersScreen';
import DriverWalletScreen from '@/features/driver/screens/DriverWalletScreen';
import DriverProfileScreen from '@/features/driver/screens/DriverProfileScreen';
import DriverDeliveryScreen from '@/features/driver/screens/DriverDeliveryScreen';
import DriverPersonalInfoScreen from '@/features/driver/screens/DriverPersonalInfoScreen';
import DriverVehiclesScreen from '@/features/driver/screens/DriverVehiclesScreen';
import DriverSettingsScreen from '@/features/driver/screens/DriverSettingsScreen';
import DriverSupportScreen from '@/features/driver/screens/DriverSupportScreen';

// Sub-screens
import PersonalInfoScreen from '@/features/profile/screens/PersonalInfoScreen';
import AddressesScreen from '@/features/profile/screens/AddressesScreen';
import CartScreen from '@/features/cart/screens/CartScreen';
import FavouriteScreen from '@/features/home/screens/FavouriteScreen';
import NotificationsScreen from '@/features/profile/screens/NotificationsScreen';
import PaymentMethodScreen from '@/features/profile/screens/PaymentMethodScreen';
import FAQsScreen from '@/features/profile/screens/FAQsScreen';
import UserReviewsScreen from '@/features/profile/screens/UserReviewsScreen';
import SettingsScreen from '@/features/profile/screens/SettingsScreen';

import { useStore } from '@/store/useStore';

const Stack = createNativeStackNavigator();

const getInitialRoute = (role?: string, justLoggedIn?: boolean): string => {
  if (role === 'admin')  return 'AdminHome';
  if (role === 'chef')   return 'ChefHome';
  if (role === 'driver') return 'DriverHome';
  return justLoggedIn ? 'Location' : 'Home';
};

export const AppNavigator = () => {
  const { token, user, justLoggedIn } = useStore();

  if (!token) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Splash">
        <Stack.Screen name="Splash"         component={SplashScreen} />
        <Stack.Screen name="Onboarding"     component={OnboardingScreen} />
        <Stack.Screen name="Login"          component={LoginScreen} />
        <Stack.Screen name="SignUp"         component={SignUpScreen} />
        <Stack.Screen name="Verification"   component={VerificationScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="ResetPassword"  component={ResetPasswordScreen} />
      </Stack.Navigator>
    );
  }

  return (
    <Stack.Navigator
      key={user?.role ?? 'guest'}
      screenOptions={{ headerShown: false }}
      initialRouteName={getInitialRoute(user?.role, justLoggedIn)}
    >
      {/* ── Admin ── */}
      <Stack.Screen name="AdminHome"          component={AdminHomeScreen} />
      <Stack.Screen name="AdminOrders"        component={AdminOrdersScreen} />
      <Stack.Screen name="AdminUsers"         component={AdminUsersScreen} />
      <Stack.Screen name="AdminNotifications" component={AdminNotificationsScreen} />
      <Stack.Screen name="AdminProfile"       component={AdminProfileScreen} />
      <Stack.Screen name="AdminMenu"          component={AdminMenuScreen} />
      <Stack.Screen name="AdminFoodDetails"   component={AdminFoodDetailsScreen} />
      <Stack.Screen name="AdminReports"       component={AdminReportsScreen} />
      <Stack.Screen name="AdminAddItem"       component={AdminAddItemScreen} />
      <Stack.Screen name="AdminInventory"     component={AdminInventoryScreen} />
      <Stack.Screen name="AdminSuppliers"     component={AdminSuppliersScreen} />
      <Stack.Screen name="AdminWasteLog"      component={AdminWasteLogScreen} />

      {/* ── Chef ── */}
      <Stack.Screen name="ChefHome"          component={ChefHomeScreen} />
      <Stack.Screen name="ChefOrders"        component={ChefOrdersScreen} />
      <Stack.Screen name="ChefNotifications" component={ChefNotificationsScreen} />
      <Stack.Screen name="ChefFoodList"      component={ChefFoodListScreen} />
      <Stack.Screen name="ChefFoodDetails"   component={ChefFoodDetailsScreen} />
      <Stack.Screen name="ChefProfile"       component={ChefProfileScreen} />

      {/* ── Driver ── */}
      <Stack.Screen name="DriverHome"        component={DriverHomeScreen} />
      <Stack.Screen name="DriverOrders"      component={DriverOrdersScreen} />
      <Stack.Screen name="DriverWallet"      component={DriverWalletScreen} />
      <Stack.Screen name="DriverProfile"     component={DriverProfileScreen} />
      <Stack.Screen name="DriverDelivery"    component={DriverDeliveryScreen} />
      <Stack.Screen name="DriverPersonalInfo" component={DriverPersonalInfoScreen} />
      <Stack.Screen name="DriverVehicles"    component={DriverVehiclesScreen} />
      <Stack.Screen name="DriverSettings"    component={DriverSettingsScreen} />
      <Stack.Screen name="DriverSupport"     component={DriverSupportScreen} />

      {/* ── Customer / shared ── */}
      <Stack.Screen name="Home"             component={HomeScreen} />
      <Stack.Screen name="Location"         component={LocationScreen} />
      <Stack.Screen name="Categories"       component={CategoriesScreen} />
      <Stack.Screen name="CategoryDetails"  component={CategoryDetailsScreen} />
      <Stack.Screen name="FoodDetails"      component={FoodDetailsScreen} />
      <Stack.Screen name="OrderTracker"     component={OrderTrackerScreen} />
      <Stack.Screen name="RateFood"         component={RateFoodScreen} />
      <Stack.Screen name="OrderHistory"     component={OrderHistoryScreen} />
      <Stack.Screen name="Profile"          component={ProfileScreen} />
      <Stack.Screen name="AddNewAddress"    component={AddNewAddressScreen} />
      <Stack.Screen name="EditAddress"      component={EditAddressScreen} />
      <Stack.Screen name="AddCard"          component={AddCardScreen} />
      <Stack.Screen name="PaymentSuccess"   component={PaymentSuccessScreen} />
      <Stack.Screen name="PaymentBreakdown" component={PaymentBreakdownScreen} />

      {/* ── Profile sub-screens ── */}
      <Stack.Screen name="PersonalInfo"  component={PersonalInfoScreen} />
      <Stack.Screen name="Addresses"     component={AddressesScreen} />
      <Stack.Screen name="Cart"          component={CartScreen} />
      <Stack.Screen name="Favourite"     component={FavouriteScreen} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} />
      <Stack.Screen name="FAQs"          component={FAQsScreen} />
      <Stack.Screen name="UserReviews"   component={UserReviewsScreen} />
      <Stack.Screen name="Settings"      component={SettingsScreen} />
    </Stack.Navigator>
  );
};
