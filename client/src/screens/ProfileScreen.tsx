import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { Order } from '../types';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error loading orders', error);
    } finally {
      setLoading(false);
    }
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={[styles.status, { color: getStatusColor(item.status) }]}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text style={styles.orderDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
      <Text style={styles.orderTotal}>Total: ${item.totalAmount}</Text>
    </View>
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return '#4CAF50';
      case 'preparing': return '#FF9800';
      case 'cancelled': return '#F44336';
      default: return '#2196F3';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.username?.charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.username}>{user?.username}</Text>
        <Text style={styles.role}>{user?.role}</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Order History</Text>
        {loading ? (
          <ActivityIndicator color="#D32F2F" />
        ) : (
          <FlatList
            data={orders}
            renderItem={renderOrder}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.list}
            ListEmptyComponent={<Text style={styles.emptyText}>No orders yet</Text>}
          />
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  header: {
    backgroundColor: '#D32F2F',
    padding: 30,
    paddingTop: 60,
    alignItems: 'center',
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatarText: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  username: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  role: {
    fontSize: 16,
    color: '#FFCDD2',
    marginTop: 5,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  list: {
    paddingBottom: 80,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  status: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  orderDate: {
    color: '#666',
    marginBottom: 5,
  },
  orderTotal: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },
  logoutButton: {
    flexDirection: 'row',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default ProfileScreen;
