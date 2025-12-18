import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import { orderService } from '../services/api';
import { Order } from '../types';

const OrderTrackingScreen = () => {
  const route = useRoute<any>();
  const { orderId } = route.params || {};
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrder();
      const interval = setInterval(fetchOrder, 10000); // Poll every 10 seconds
      return () => clearInterval(interval);
    }
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const response = await orderService.getOrder(orderId);
      setOrder(response.data);
    } catch (error) {
      console.error('Error fetching order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'pending': return 0;
      case 'preparing': return 1;
      case 'ready_for_pickup': return 2;
      case 'out_for_delivery': return 3;
      case 'delivered': return 4;
      default: return 0;
    }
  };

  const currentStep = order ? getStepIndex(order.status) : 0;

  const steps = [
    { title: 'Order Placed', icon: 'receipt-outline', time: order ? new Date(order.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : '' },
    { title: 'Preparing', icon: 'restaurant-outline', time: '' },
    { title: 'Ready for Pickup', icon: 'cube-outline', time: '' },
    { title: 'Out for Delivery', icon: 'bicycle-outline', time: '' },
    { title: 'Delivered', icon: 'home-outline', time: '' },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  if (!order) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Order not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: 'https://images.pexels.com/photos/2559941/pexels-photo-2559941.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' }} 
          style={styles.mapImage} 
        />
        <View style={styles.mapOverlay}>
          <Text style={styles.mapText}>Tracking Order #{order.id}</Text>
        </View>
      </View>

      <View style={styles.statusContainer}>
        <Text style={styles.estimatedTitle}>Status</Text>
        <Text style={styles.estimatedTime}>{order.status.replace(/_/g, ' ').toUpperCase()}</Text>
        
        <View style={styles.stepsContainer}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.timelineContainer}>
                <View style={[
                  styles.dot, 
                  index <= currentStep ? styles.activeDot : styles.inactiveDot
                ]}>
                  {index <= currentStep && <Ionicons name="checkmark" size={12} color="white" />}
                </View>
                {index < steps.length - 1 && (
                  <View style={[
                    styles.line, 
                    index < currentStep ? styles.activeLine : styles.inactiveLine
                  ]} />
                )}
              </View>
              
              <View style={styles.stepContent}>
                <Text style={[
                  styles.stepTitle,
                  index <= currentStep ? styles.activeText : styles.inactiveText
                ]}>{step.title}</Text>
                {step.time ? <Text style={styles.stepTime}>{step.time}</Text> : null}
              </View>
              
              <Ionicons 
                name={step.icon as any} 
                size={24} 
                color={index <= currentStep ? '#D32F2F' : '#ccc'} 
              />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mapOverlay: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  mapText: {
    color: '#333',
    fontWeight: 'bold',
  },
  statusContainer: {
    flex: 1,
    backgroundColor: 'white',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  estimatedTitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  estimatedTime: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 30,
  },
  stepsContainer: {
    marginTop: 10,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 60,
  },
  timelineContainer: {
    alignItems: 'center',
    marginRight: 15,
    width: 30,
  },
  dot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  activeDot: {
    backgroundColor: '#D32F2F',
  },
  inactiveDot: {
    backgroundColor: '#E0E0E0',
  },
  line: {
    width: 2,
    flex: 1,
    marginTop: -5,
    marginBottom: -5,
  },
  activeLine: {
    backgroundColor: '#D32F2F',
  },
  inactiveLine: {
    backgroundColor: '#E0E0E0',
  },
  stepContent: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  activeText: {
    color: '#333',
  },
  inactiveText: {
    color: '#ccc',
  },
  stepTime: {
    fontSize: 14,
    color: '#999',
  },
});

export default OrderTrackingScreen;