import React, { useEffect, useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import CustomHeader from '../../components/header/CustomHeader';
import TwoColSlide from '../../components/sliders/TwoColSlide';
import { getProductsByCategory } from '../../constants/SanityClient';
import Colors from '../../constants/Colors';

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'price_low', label: 'Price: Low to High' },
  { id: 'price_high', label: 'Price: High to Low' },
  { id: 'name_asc', label: 'Name: A to Z' },
  { id: 'name_desc', label: 'Name: Z to A' },
];

const PRICE_FILTERS = [
  { id: 'all', label: 'All Prices', min: 0, max: Infinity },
  { id: 'under_200', label: 'Under 200 QAR', min: 0, max: 200 },
  { id: '200_500', label: '200 - 500 QAR', min: 200, max: 500 },
  { id: '500_1000', label: '500 - 1000 QAR', min: 500, max: 1000 },
  { id: 'over_1000', label: 'Over 1000 QAR', min: 1000, max: Infinity },
];

const CategoryProducts = (props) => {
  const [products, setProducts] = useState([]);
  const [sortBy, setSortBy] = useState('default');
  const [priceFilter, setPriceFilter] = useState('all');
  const [showSortModal, setShowSortModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const { category } = props.route.params;

  useEffect(() => {
    loadProducts();
  }, [category]);

  const loadProducts = async () => {
    try {
      // Convert category name to slug format for Sanity query
      const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
      const { data, error } = await getProductsByCategory(categorySlug);
      
      if (error) throw new Error(error);
      
      // Transform Sanity data to match expected format
      const formattedProducts = data.map(product => ({
        id: product._id,
        title: product.title,
        price: `${product.price} QAR`,
        numericPrice: product.price,
        uri: product.image,
        productImage: product.image,
        category: product.category?.name || category,
        description: product.description,
        inStock: product.inStock,
      }));
      
      setProducts(formattedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products];
    
    // Apply price filter
    const filter = PRICE_FILTERS.find(f => f.id === priceFilter);
    if (filter && filter.id !== 'all') {
      result = result.filter(p => {
        const price = p.numericPrice || parseFloat(p.price?.replace(/[^\d.]/g, '')) || 0;
        return price >= filter.min && price < filter.max;
      });
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_low':
        result.sort((a, b) => (a.numericPrice || 0) - (b.numericPrice || 0));
        break;
      case 'price_high':
        result.sort((a, b) => (b.numericPrice || 0) - (a.numericPrice || 0));
        break;
      case 'name_asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'name_desc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default:
        break;
    }
    
    return result;
  }, [products, sortBy, priceFilter]);

  const renderModal = (visible, setVisible, title, options, selectedId, onSelect) => (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={() => setVisible(false)}
    >
      <TouchableOpacity 
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={() => setVisible(false)}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{title}</Text>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Ionicons name="close" size={24} color={Colors.textPrimary} />
            </TouchableOpacity>
          </View>
          {options.map(option => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.modalOption,
                selectedId === option.id && styles.modalOptionSelected
              ]}
              onPress={() => {
                onSelect(option.id);
                setVisible(false);
              }}
            >
              <Text style={[
                styles.modalOptionText,
                selectedId === option.id && styles.modalOptionTextSelected
              ]}>
                {option.label}
              </Text>
              {selectedId === option.id && (
                <Ionicons name="checkmark" size={20} color={Colors.primary} />
              )}
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>
    </Modal>
  );

  return (
    <CustomHeader navigation={props.navigation} title={category}>
      <View style={styles.filterBar}>
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilterModal(true)}
        >
          <Ionicons name="filter" size={18} color={Colors.textPrimary} />
          <Text style={styles.filterButtonText}>Filter</Text>
          {priceFilter !== 'all' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="swap-vertical" size={18} color={Colors.textPrimary} />
          <Text style={styles.filterButtonText}>Sort</Text>
          {sortBy !== 'default' && <View style={styles.activeIndicator} />}
        </TouchableOpacity>
        
        <Text style={styles.productCount}>
          {filteredAndSortedProducts.length} Products
        </Text>
      </View>
      
      <TwoColSlide navigation={props.navigation} data={filteredAndSortedProducts} />
      
      {renderModal(showSortModal, setShowSortModal, 'Sort By', SORT_OPTIONS, sortBy, setSortBy)}
      {renderModal(showFilterModal, setShowFilterModal, 'Filter by Price', PRICE_FILTERS, priceFilter, setPriceFilter)}
    </CustomHeader>
  );
};

export default CategoryProducts;

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: 20,
    marginRight: 10,
  },
  filterButtonText: {
    marginLeft: 5,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  activeIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 5,
  },
  productCount: {
    marginLeft: 'auto',
    fontSize: 14,
    color: Colors.textMuted,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalOptionSelected: {
    backgroundColor: Colors.backgroundLight,
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.textPrimary,
  },
  modalOptionTextSelected: {
    fontWeight: 'bold',
    color: Colors.primary,
  },
});
