import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Use 10.0.2.2 for Android Emulator, localhost for iOS Simulator
const BASE_URL = Platform.OS === 'android' ? 'http://10.0.2.2:5000/api' : 'http://localhost:5000/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Mock Data for UI development/fallback
const MOCK_CATEGORIES = [
  { id: 1, name: 'Fried Chicken' },
  { id: 2, name: 'Sides' },
  { id: 3, name: 'Seafood' },
  { id: 4, name: 'Drinks' },
  { id: 5, name: 'Desserts' }
];

const MOCK_MENU_ITEMS = [
  {
    id: 1,
    name: 'Classic Fried Chicken',
    description: 'Golden, crispy, and juicy fried chicken seasoned to perfection.',
    price: 12.99,
    imageUrl: 'https://images.pexels.com/photos/60616/fried-chicken-chicken-fried-crunchy-60616.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    CategoryId: 1
  },
  {
    id: 2,
    name: 'Spicy Fried Chicken',
    description: 'Our classic fried chicken with a spicy kick of cayenne and paprika.',
    price: 13.99,
    imageUrl: 'https://images.pexels.com/photos/1352270/pexels-photo-1352270.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    CategoryId: 1
  },
  {
    id: 3,
    name: 'Southern Mac & Cheese',
    description: 'Creamy, baked macaroni and cheese with a three-cheese blend.',
    price: 5.99,
    imageUrl: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    CategoryId: 2
  },
  {
    id: 4,
    name: 'Shrimp & Grits',
    description: 'Sautéed shrimp served over creamy cheese grits with bacon.',
    price: 16.99,
    imageUrl: 'https://images.pexels.com/photos/566566/pexels-photo-566566.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    CategoryId: 3
  },
  {
    id: 5,
    name: 'Sweet Tea',
    description: 'Classic Southern sweet iced tea.',
    price: 2.99,
    imageUrl: 'https://images.pexels.com/photos/5946633/pexels-photo-5946633.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    CategoryId: 4
  },
  {
    id: 6,
    name: 'Peach Cobbler',
    description: 'Warm peach cobbler with a flaky crust, served with vanilla ice cream.',
    price: 6.99,
    imageUrl: 'https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    CategoryId: 5
  }
];

const MOCK_ORDERS = [
  { id: 101, status: 'pending', totalAmount: 45.50, createdAt: new Date().toISOString(), items: [] },
  { id: 102, status: 'preparing', totalAmount: 22.00, createdAt: new Date().toISOString(), items: [] },
  { id: 103, status: 'out_for_delivery', totalAmount: 18.99, createdAt: new Date().toISOString(), items: [] },
  { id: 104, status: 'delivered', totalAmount: 34.50, createdAt: new Date(Date.now() - 86400000).toISOString(), items: [] },
];

export const authService = {
  login: async (credentials: any) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      console.log('Auth API failed, using mock fallback');
      // Fallback for demo purposes if backend isn't running
      if (credentials.username && credentials.password) {
        return { 
          token: 'mock-jwt-token-demo',
          user: { id: 1, username: credentials.username, role: 'customer' }
        };
      }
      throw error;
    }
  },
  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      console.log('Auth API failed, using mock fallback');
      return { message: 'User created successfully (Mock)' };
    }
  },
};

export const menuService = {
  getCategories: async () => {
    try {
      const response = await api.get('/categories');
      return response;
    } catch (error) {
      console.log('Menu API failed, using mock data');
      return { data: MOCK_CATEGORIES };
    }
  },
  getMenuItems: async () => {
    try {
      const response = await api.get('/menu');
      return response;
    } catch (error) {
      console.log('Menu API failed, using mock data');
      return { data: MOCK_MENU_ITEMS };
    }
  },
  getMenuItemsByCategory: async (categoryId: number) => {
    try {
      const response = await api.get(`/menu?categoryId=${categoryId}`);
      return response;
    } catch (error) {
      console.log('Menu API failed, using mock data');
      return { data: MOCK_MENU_ITEMS.filter(item => item.CategoryId === categoryId) };
    }
  }
};

export const orderService = {
  createOrder: async (orderData: any) => {
    try {
      return await api.post('/orders', orderData);
    } catch (error) {
      console.log('Order API failed, using mock fallback');
      return { data: { id: Math.floor(Math.random() * 1000), status: 'pending', ...orderData } };
    }
  },
  getMyOrders: async () => {
    try {
      return await api.get('/orders/my-orders');
    } catch (error) {
      console.log('Order API failed, using mock fallback');
      return { data: MOCK_ORDERS };
    }
  },
  getOrder: async (id: number) => {
    try {
      return await api.get(`/orders/${id}`);
    } catch (error) {
      console.log('Order API failed, using mock fallback');
      const mockOrder = MOCK_ORDERS.find(o => o.id === id) || MOCK_ORDERS[0];
      return { data: mockOrder };
    }
  },
  getAllOrders: async () => { // For Admin
     try {
      return await api.get('/orders');
    } catch (error) {
      console.log('Order API failed, using mock fallback');
      return { data: MOCK_ORDERS };
    }
  },
  getDriverOrders: async () => { // For Driver
     try {
      return await api.get('/orders/driver');
    } catch (error) {
      console.log('Order API failed, using mock fallback');
      return { data: MOCK_ORDERS.filter(o => o.status === 'out_for_delivery' || o.status === 'ready_for_pickup') };
    }
  },
  updateOrderStatus: async (orderId: number, status: string) => {
    try {
      return await api.put(`/orders/${orderId}`, { status });
    } catch (error) {
       console.log('Order API failed, using mock fallback');
       return { data: { success: true } };
    }
  }
};

export default api;
