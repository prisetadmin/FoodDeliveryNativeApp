import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { Order } from '../types';
import { Ionicons } from '@expo/vector-icons';

const DriverDashboardScreen = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getDriverOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load driver orders', error);
    }
  };

  const updateStatus = (orderId: number, newStatus: string) => {
    const actionText = newStatus === 'out_for_delivery' ? 'Start Delivery' : 'Complete Delivery';
    Alert.alert(actionText, `Update order #${orderId} status?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Confirm', 
        onPress: async () => {
          try {
            await orderService.updateOrderStatus(orderId, newStatus);
            if (newStatus === 'delivered') {
              setOrders(current => current.filter(o => o.id !== orderId));
            } else {
              setOrders(current => current.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
            }
            Alert.alert('Success', 'Status updated!');
          } catch (error) {
            Alert.alert('Error', 'Failed to update status');
          }
        }
      }
    ]);
  };

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.iconContainer}>
        <Ionicons name="bicycle" size={32} color="#D32F2F" />
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.statusBadge}>{item.status.replace(/_/g, ' ').toUpperCase()}</Text>
        <Text style={styles.address}>{item.deliveryAddress || 'No address provided'}</Text>
        <Text style={styles.total}>${item.totalAmount.toFixed(2)}</Text>
      </View>
      
      {item.status === 'ready_for_pickup' && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => updateStatus(item.id, 'out_for_delivery')}
        >
          <Ionicons name="play-circle-outline" size={40} color="#FF9800" />
        </TouchableOpacity>
      )}

      {item.status === 'out_for_delivery' && (
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => updateStatus(item.id, 'delivered')}
        >
          <Ionicons name="checkmark-circle-outline" size={40} color="#4CAF50" />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Driver Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.subHeader}>
        <Text style={styles.subHeaderText}>Active Deliveries</Text>
        <TouchableOpacity onPress={loadOrders}>
          <Ionicons name="refresh" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active deliveries</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    backgroundColor: '#D32F2F',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  subHeader: {
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  list: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 2,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFEBEE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
  },
  orderId: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  statusBadge: {
    fontSize: 12,
    color: '#D32F2F',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  address: {
    color: '#666',
    marginVertical: 4,
  },
  total: {
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  actionButton: {
    padding: 5,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
  },
});

export default DriverDashboardScreen;