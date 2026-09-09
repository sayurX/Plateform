import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { fetchAddressesApi } from '@/api/addressApi';
import { fetchPaymentMethodsApi } from '@/api/paymentApi';
import { fetchFoodsApi, addFoodApi, updateFoodApi, deleteFoodApi, fetchCategoriesApi } from '@/api/foodApi';
import { 
  fetchAllOrdersApi, 
  fetchMyOrdersApi, 
  updateOrderStatusApi, 
  placeOrderApi,
  fetchOrderByIdApi,
  fetchChefStatsApi
} from '@/api/orderApi';
import { fetchMyNotificationsApi } from '@/api/notificationApi';
import { fetchUsersApi } from '@/api/userApi';
import { fetchTrueDeliveryDistance } from '@/utils/distanceApi';

export type OrderStatus = 'pending' | 'accepted' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';

export interface Order {
  _id: string;
  user: any;
  items: Array<{
    food: any;
    quantity: number;
    size: string;
    price: number;
  }>;
  totalAmount: number;
  status: OrderStatus;
  deliveryAddress: string;
  deliveryDistance?: number;
  deliveryTime?: number;
  deliveryFee?: number;
  pickupLocation?: string;
  dropoffLocation?: string;
  createdAt: string;
  // UI helper fields
  distance?: string;
  time?: string;
}

export interface Food {
  _id: string;
  name: string;
  description: string;
  price: number;
  sizePrices?: { [key: string]: number };
  category: any;
  imageUrl: string;
  isAvailable: boolean;
  rating?: number;
  recipe?: string[];
  ingredients?: Array<{ label: string; emoji: string }>;
}

export interface Category {
  _id: string;
  name: string;
  imageUrl?: string;
}

// Removing INITIAL_ORDERS

interface AppState {
  user: any | null;
  token: string | null;
  addresses: any[];
  paymentMethods: any[];
  currentAddress: string;
  setUser: (user: any) => void;
  setToken: (token: string | null) => void;
  setAddresses: (addresses: any[]) => void;
  setPaymentMethods: (methods: any[]) => void;
  setCurrentAddress: (address: string) => void;
  logout: () => void;
  loadAddresses: () => Promise<void>;
  loadPaymentMethods: () => Promise<void>;
  justLoggedIn: boolean;
  trackingOrder: Order | null;
  notifications: any[];
  setJustLoggedIn: (val: boolean) => void;
  orders: Order[];
  foods: Food[];
  categories: Category[];
  users: any[];
  loadOrders: (status?: string) => Promise<void>;
  updateOrderStatusRemote: (id: string, status: OrderStatus, locData?: any) => Promise<void>;
  loadOrderDetails: (id: string) => Promise<void>;
  loadNotifications: () => Promise<void>;
  loadFoods: () => Promise<void>;
  loadCategories: () => Promise<void>;
  loadUsers: () => Promise<void>;
  addProduct: (data: any) => Promise<void>;
  updateProduct: (id: string, data: any) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  placeNewOrder: () => Promise<Order | null>;
  cart: any[];
  addToCart: (food: Food, size: string, qty: number) => void;
  updateCartQty: (foodId: string, size: string, delta: number) => void;
  removeFromCart: (foodId: string, size: string) => void;
  clearCart: () => void;
  chefStats: any | null;
  loadChefStats: () => Promise<void>;
  
  // Real Async Distance variables
  deliveryMeta: { distNum: number, time: number | string, dist: string, fee: number };
  isCalculatingDelivery: boolean;
  calculateDeliveryMetaAsync: (address: string) => Promise<void>;
}
export const getDeliveryMeta = (address: string) => {
  const safeAddress = address || 'Default String For Hash';
  
  // Specific override for demo addresses mapped physically in the UI
  if (safeAddress.toLowerCase().includes('wimalawansa') || safeAddress.toLowerCase().includes('dean')) {
    const distNum = 1.2;
    const time = 3;
    const fee = Math.floor(distNum * 50); // Rs 60
    return {
      distNum,
      dist: `1.2 km`,
      time: `~3 min`,
      fee
    };
  }

  const hash = safeAddress.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const distNum = (2.5 + (hash % 60) / 10);
  const time = Math.floor(8 + (hash % 30));
  const fee = Math.floor(distNum * 50); // Rs 50 per km
  return {
    distNum,
    dist: `${distNum.toFixed(1)} km`,
    time: `~${time} min`,
    fee
  };
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      addresses: [],
      paymentMethods: [],
      currentAddress: 'Halal Lab office',
      deliveryMeta: getDeliveryMeta('Halal Lab office'),
      isCalculatingDelivery: false,
      justLoggedIn: false,
      trackingOrder: null,
      notifications: [],
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      setAddresses: (addresses) => set({ addresses }),
      setPaymentMethods: (methods) => set({ paymentMethods: methods }),
      setCurrentAddress: (address) => {
        set({ currentAddress: address });
        get().calculateDeliveryMetaAsync(address);
      },
      calculateDeliveryMetaAsync: async (address: string) => {
        set({ isCalculatingDelivery: true, deliveryMeta: { distNum: 0, time: 0, dist: 'Calculating...', fee: 0 } });
        try {
           const trueMeta = await fetchTrueDeliveryDistance(address);
           if (trueMeta) {
              const fee = Math.floor(trueMeta.distanceKm * 50);
              set({ 
                 deliveryMeta: {
                    distNum: trueMeta.distanceKm,
                    time: trueMeta.timeMins,
                    dist: `${trueMeta.distanceKm.toFixed(1)} km`,
                    fee
                 },
                 isCalculatingDelivery: false
              });
           } else {
              // Fallback to offline algorithm
              const fallback = getDeliveryMeta(address);
              set({ deliveryMeta: fallback, isCalculatingDelivery: false });
           }
        } catch (e) {
           const fallback = getDeliveryMeta(address);
           set({ deliveryMeta: fallback, isCalculatingDelivery: false });
        }
      },
      setJustLoggedIn: (val) => set({ justLoggedIn: val }),
      orders: [],
      foods: [],
      categories: [],
      users: [],
      loadOrders: async (status) => {
        const token = get().token;
        if (!token) return;
        try {
          // If Admin/Chef, fetch all. If customer, fetch my. 
          // For simplicity in this demo, Admin/Chef screens call this with status
          const role = get().user?.role?.toLowerCase();
          const data = (role === 'admin' || role === 'chef' || role === 'driver') 
            ? await fetchAllOrdersApi(token, status)
            : await fetchMyOrdersApi(token);
          set({ orders: data });
        } catch (error) {
          console.error('Error loading orders:', error);
        }
      },
      updateOrderStatusRemote: async (id: string, status: OrderStatus, locData?: any) => {
        const token = get().token;
        if (!token) return;
        try {
          await updateOrderStatusApi(token, id, { status, ...locData });
          // Refresh orders after update
          const role = get().user?.role?.toLowerCase();
          const data = (role === 'admin' || role === 'chef' || role === 'driver') 
            ? await fetchAllOrdersApi(token)
            : await fetchMyOrdersApi(token);
          set({ orders: data });
        } catch (error) {
          console.error('Error updating order status:', error);
        }
      },
      loadOrderDetails: async (id: string) => {
        const token = get().token;
        if (!token) return;
        try {
          const data = await fetchOrderByIdApi(token, id);
          set({ trackingOrder: data });
        } catch (error) {
          console.error('Error loading order details:', error);
        }
      },
      loadNotifications: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const data = await fetchMyNotificationsApi(token);
          set({ notifications: data });
        } catch (error) {
          console.error('Error loading notifications:', error);
        }
      },
      loadFoods: async () => {
        try {
          const data = await fetchFoodsApi();
          set({ foods: data });
        } catch (error) {
          console.error('Error loading foods:', error);
        }
      },
      loadCategories: async () => {
        try {
          const data = await fetchCategoriesApi();
          set({ categories: data });
        } catch (error) {
          console.error('Error loading categories:', error);
        }
      },
      loadUsers: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const data = await fetchUsersApi(token);
          set({ users: data });
        } catch (error) {
          console.error('Error loading users:', error);
        }
      },
      addProduct: async (data) => {
        const token = get().token;
        if (!token) return;
        await addFoodApi(token, data);
        await get().loadFoods();
      },
      updateProduct: async (id, data) => {
        const token = get().token;
        if (!token) return;
        await updateFoodApi(token, id, data);
        await get().loadFoods();
      },
      deleteProduct: async (id) => {
        const token = get().token;
        if (!token) return;
        await deleteFoodApi(token, id);
        await get().loadFoods();
      },
      placeNewOrder: async () => {
        const { token, cart, currentAddress } = get();
        if (!token || cart.length === 0) return null;

        const subtotal = cart.reduce((sum, item) => sum + (item.food.price * item.qty), 0);
        const deliveryMeta = get().deliveryMeta || getDeliveryMeta(currentAddress);
        const deliveryFee = cart.length > 0 ? deliveryMeta.fee : 0;
        const totalAmount = subtotal + deliveryFee;

        const orderData = {
          totalAmount,
          deliveryAddress: currentAddress,
          deliveryDistance: deliveryMeta.distNum,
          deliveryTime: typeof deliveryMeta.time === 'number' ? deliveryMeta.time : parseInt(String(deliveryMeta.time)) || 0,
          deliveryFee,
          items: cart.map(item => ({
            food: item.food._id,
            quantity: item.qty,
            size: item.size,
            price: item.food.price
          }))
        };

        try {
          const newOrder = await placeOrderApi(token, orderData);
          set({ cart: [] }); 
          await get().loadOrders();
          return newOrder;
        } catch (error) {
          console.error('Error in placeNewOrder store action:', error);
          throw error;
        }
      },
      logout: () => set({ user: null, token: null, addresses: [], paymentMethods: [], orders: [], foods: [] }),
      loadAddresses: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const addresses = await fetchAddressesApi(token);
          set({ addresses });
        } catch (error) {
          console.error('Error loading addresses:', error);
        }
      },
      loadPaymentMethods: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const methods = await fetchPaymentMethodsApi(token);
          set({ paymentMethods: methods });
        } catch (error) {
          console.error('Error loading payments:', error);
        }
      },
      cart: [],
      addToCart: (food, size, qty) => {
        const currentCart = get().cart;
        const existingIndex = currentCart.findIndex(item => item.food._id === food._id && item.size === size);
        
        if (existingIndex > -1) {
          const updatedCart = [...currentCart];
          updatedCart[existingIndex].qty += qty;
          set({ cart: updatedCart });
        } else {
          set({ cart: [...currentCart, { id: Math.random().toString(), food, size, qty }] });
        }
      },
      updateCartQty: (foodId, size, delta) => {
        const updatedCart = get().cart.map(item => {
          if (item.food._id === foodId && item.size === size) {
            return { ...item, qty: Math.max(1, item.qty + delta) };
          }
          return item;
        });
        set({ cart: updatedCart });
      },
      removeFromCart: (foodId: string, size: string) => {
        set({ cart: get().cart.filter(item => !(item.food._id === foodId && item.size === size)) });
      },
      clearCart: () => set({ cart: [] }),
      chefStats: null,
      loadChefStats: async () => {
        const token = get().token;
        if (!token) return;
        try {
          const data = await fetchChefStatsApi(token);
          set({ chefStats: data });
        } catch (error) {
          console.error('Error loading chef stats:', error);
        }
      },
    }),
    {
      name: 'plateform-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
