import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useCart } from '../context/CartContext';
import { orderService } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const CheckoutScreen = () => {
  const navigation = useNavigation<any>();
  const { items, cartTotal, clearCart } = useCart();
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card'); // 'card' | 'cash'

  const handlePlaceOrder = async () => {
    if (!address || !city || !zip) {
      Alert.alert('Error', 'Please fill in all delivery details');
      return;
    }

    try {
      const orderData = {
        items: items.map(item => ({
          menuItemId: item.id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: cartTotal,
        deliveryAddress: `${address}, ${city} ${zip}`,
        paymentMethod
      };

      const response = await orderService.createOrder(orderData);
      clearCart();
      navigation.replace('OrderConfirmation', { orderId: response.data.id });
    } catch (error) {
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Delivery Address</Text>
        <TextInput
          style={styles.input}
          placeholder="Street Address"
          value={address}
          onChangeText={setAddress}
        />
        <View style={styles.row}>
          <TextInput
            style={[styles.input, { flex: 1, marginRight: 10 }]}
            placeholder="City"
            value={city}
            onChangeText={setCity}
          />
          <TextInput
            style={[styles.input, { width: 100 }]}
            placeholder="ZIP Code"
            value={zip}
            onChangeText={setZip}
            keyboardType="numeric"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'card' && styles.activePayment]}
          onPress={() => setPaymentMethod('card')}
        >
          <Ionicons name="card-outline" size={24} color={paymentMethod === 'card' ? '#D32F2F' : '#666'} />
          <Text style={[styles.paymentText, paymentMethod === 'card' && styles.activePaymentText]}>Credit/Debit Card</Text>
          {paymentMethod === 'card' && <Ionicons name="checkmark-circle" size={24} color="#D32F2F" />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.paymentOption, paymentMethod === 'cash' && styles.activePayment]}
          onPress={() => setPaymentMethod('cash')}
        >
          <Ionicons name="cash-outline" size={24} color={paymentMethod === 'cash' ? '#D32F2F' : '#666'} />
          <Text style={[styles.paymentText, paymentMethod === 'cash' && styles.activePaymentText]}>Cash on Delivery</Text>
          {paymentMethod === 'cash' && <Ionicons name="checkmark-circle" size={24} color="#D32F2F" />}
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>${cartTotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Delivery Fee</Text>
          <Text style={styles.summaryValue}>$5.00</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>${(cartTotal + 5).toFixed(2)}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
    marginTop: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  row: {
    flexDirection: 'row',
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  activePayment: {
    borderColor: '#D32F2F',
    backgroundColor: '#FFEBEE',
  },
  paymentText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#666',
  },
  activePaymentText: {
    color: '#D32F2F',
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#666',
    fontSize: 16,
  },
  summaryValue: {
    color: '#333',
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  totalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  placeOrderButton: {
    backgroundColor: '#D32F2F',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  placeOrderText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CheckoutScreen;