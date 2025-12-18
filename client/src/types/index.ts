export interface User {
  id: number;
  username: string;
  role: 'customer' | 'admin' | 'driver';
}

export interface Category {
  id: number;
  name: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  CategoryId: number;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  MenuItem?: MenuItem;
}

export interface Order {
  id: number;
  status: 'pending' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled';
  totalAmount: number;
  deliveryAddress: string;
  paymentMethod: string;
  createdAt: string;
  OrderItems?: OrderItem[];
}

export interface AuthResponse {
  token: string;
  user?: User;
}
