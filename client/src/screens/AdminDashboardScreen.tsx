import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { orderService } from '../services/api';
import { Order } from '../types';
import { Ionicons } from '@expo/vector-icons';

const AdminDashboardScreen = () => {
  const { logout } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'pending' | 'preparing' | 'ready_for_pickup'>('pending');

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to load orders', error);
    }
  };

  const updateStatus = (orderId: number, newStatus: string) => {
    Alert.alert('Update Status', `Move order #${orderId} to ${newStatus.replace(/_/g, ' ')}?`, [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Confirm', 
        onPress: async () => {
          try {
            await orderService.updateOrderStatus(orderId, newStatus);
            setOrders(current => 
              current.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o)
            );
          } catch (error) {
            Alert.alert('Error', 'Failed to update status');
          }
        }
      }
    ]);
  };

  const filteredOrders = orders.filter(o => o.status === activeTab);

  const renderOrder = ({ item }: { item: Order }) => (
    <View style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item.id}</Text>
        <Text style={styles.orderTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      </View>
      <Text style={styles.orderTotal}>${item.totalAmount.toFixed(2)}</Text>
      
      <View style={styles.actions}>
        {item.status === 'pending' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => updateStatus(item.id, 'preparing')}
          >
            <Text style={styles.actionText}>Start Preparing</Text>
          </TouchableOpacity>
        )}
        {item.status === 'preparing' && (
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => updateStatus(item.id, 'ready_for_pickup')}
          >
            <Text style={styles.actionText}>Ready for Pickup</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kitchen Dashboard</Text>
        <TouchableOpacity onPress={logout}>
          <Ionicons name="log-out-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        {['pending', 'preparing', 'ready_for_pickup'].map((tab) => (
          <TouchableOpacity 
            key={tab} 
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => setActiveTab(tab as any)}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.replace(/_/g, ' ').toUpperCase()}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredOrders}
        renderItem={renderOrder}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No orders in {activeTab.replace(/_/g, ' ')}</Text>
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
    backgroundColor: '#333',
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    justifyContent: 'space-around',
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#D32F2F',
  },
  tabText: {
    color: '#666',
    fontWeight: 'bold',
    fontSize: 12,
  },
  activeTabText: {
    color: 'white',
  },
  list: {
    padding: 15,
  },
  orderCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
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
  orderTime: {
    color: '#666',
  },
  orderTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
    marginBottom: 15,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  actionButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  actionText: {
    color: 'white',
    fontWeight: 'bold',
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

export default AdminDashboardScreen;