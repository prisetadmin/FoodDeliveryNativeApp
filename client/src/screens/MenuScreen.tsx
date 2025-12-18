import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { menuService } from '../services/api';
import { MenuItem, Category } from '../types';
import { useCart } from '../context/CartContext';
import { useRoute, useNavigation } from '@react-navigation/native';

const MenuScreen = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  const { addToCart } = useCart();
  const route = useRoute<any>();
  const navigation = useNavigation<any>();

  useEffect(() => {
    if (route.params?.categoryId) {
      setSelectedCategory(route.params.categoryId);
    }
    loadData();
  }, [route.params]);

  useEffect(() => {
    filterItems();
  }, [items, selectedCategory, searchQuery]);

  const loadData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        menuService.getCategories(),
        menuService.getMenuItems()
      ]);
      setCategories(categoriesRes.data);
      setItems(itemsRes.data);
    } catch (error) {
      console.error('Error loading menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let result = items;
    if (selectedCategory) {
      result = result.filter(item => item.CategoryId === selectedCategory);
    }
    if (searchQuery) {
      result = result.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredItems(result);
  };

  const renderItem = ({ item }: { item: MenuItem }) => (
    <TouchableOpacity 
      style={styles.itemCard}
      onPress={() => navigation.navigate('ItemDetails', { item })}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.itemImage} />
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDesc} numberOfLines={2}>{item.description}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D32F2F" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={[{ id: 0, name: 'All' } as Category, ...categories]}
          keyExtractor={item => item.id.toString()}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.categoryChip,
                (selectedCategory === item.id || (item.id === 0 && selectedCategory === null)) && styles.selectedCategory
              ]}
              onPress={() => setSelectedCategory(item.id === 0 ? null : item.id)}
            >
              <Text style={[
                styles.categoryText,
                (selectedCategory === item.id || (item.id === 0 && selectedCategory === null)) && styles.selectedCategoryText
              ]}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />
    </View>
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
  searchContainer: {
    padding: 15,
    backgroundColor: 'white',
  },
  searchInput: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 10,
    fontSize: 16,
  },
  categoriesContainer: {
    paddingVertical: 10,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  categoryChip: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  selectedCategory: {
    backgroundColor: '#D32F2F',
    borderColor: '#D32F2F',
  },
  categoryText: {
    color: '#333',
    fontWeight: '600',
  },
  selectedCategoryText: {
    color: 'white',
  },
  listContainer: {
    padding: 15,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 100,
    height: 100,
  },
  itemInfo: {
    flex: 1,
    padding: 10,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  itemDesc: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#D32F2F',
  },
  addButton: {
    backgroundColor: '#FFC107',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addButtonText: {
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default MenuScreen;
