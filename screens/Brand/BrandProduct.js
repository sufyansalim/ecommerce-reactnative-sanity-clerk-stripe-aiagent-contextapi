import React, { useState, useEffect, useMemo } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import LoadingScreen from "../../components/LoadingScreen";
import EmptyListView from "../../components/EmptyListView";
import TwoColProducts from "../../components/sliders/TwoColSlide";
import CustomHeader from "../../components/header/CustomHeader.js";
import Surface from "../../components/Surface";
import { Col, Grid, Row } from "react-native-easy-grid";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useAppState, useAppDispatch, setBrandProducts } from '../../context';
import Colors from '../../constants/Colors';

const SORT_OPTIONS = [
  { id: 'default', label: 'Default' },
  { id: 'price-low', label: 'Price: Low to High' },
  { id: 'price-high', label: 'Price: High to Low' },
  { id: 'name-asc', label: 'Name: A to Z' },
  { id: 'name-desc', label: 'Name: Z to A' },
];

const FILTER_CATEGORIES = [
  { id: 'all', label: 'All Categories' },
  { id: 'Cufflinks', label: 'Cufflinks' },
  { id: 'Phone Cases', label: 'Phone Cases' },
  { id: 'Watch Winders', label: 'Watch Winders' },
  { id: 'Perfumes', label: 'Perfumes' },
  { id: 'Watches', label: 'Watches' },
  { id: 'Interior Decor', label: 'Interior Decor' },
  { id: 'Bags', label: 'Bags' },
  { id: 'Electronics', label: 'Electronics' },
  { id: 'Accessories', label: 'Accessories' },
  { id: 'Eyewear', label: 'Eyewear' },
  { id: 'Jewelry', label: 'Jewelry' },
  { id: 'Footwear', label: 'Footwear' },
];

const BrandProduct = ({ navigation, route }) => {
  const banner = route.params?.banner || "NO-Banner";
  const products = route.params?.products || [];
  
  const { brandProducts, productsLoading: loading } = useAppState();
  const dispatch = useAppDispatch();
  
  const [sortModalVisible, setSortModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    console.log("Brand products from params:", products);
    // Pass the products array directly (already fetched with brand data)
    setBrandProducts(dispatch, products);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Apply sorting and filtering
  const filteredAndSortedProducts = useMemo(() => {
    if (!brandProducts || !Array.isArray(brandProducts)) return [];
    
    let result = [...brandProducts];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(product => {
        const categories = product.categories || [];
        return categories.some(cat => 
          cat.toLowerCase().includes(selectedCategory.toLowerCase())
        );
      });
    }
    
    // Apply sorting
    switch (selectedSort) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'price-high':
        result.sort((a, b) => {
          const priceA = parseFloat((a.price || '0').replace(/[^0-9.]/g, ''));
          const priceB = parseFloat((b.price || '0').replace(/[^0-9.]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'name-asc':
        result.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        break;
      case 'name-desc':
        result.sort((a, b) => (b.title || '').localeCompare(a.title || ''));
        break;
      default:
        break;
    }
    
    return result;
  }, [brandProducts, selectedSort, selectedCategory]);

  const handleSortSelect = (sortId) => {
    setSelectedSort(sortId);
    setSortModalVisible(false);
  };

  const handleFilterSelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setSelectedSort('default');
    setSelectedCategory('all');
  };


  // setTimeout(
  //   function() {
  //     setLoading(false);
  //   }.bind(this),
  //   3000
  // );

  return (
    <CustomHeader navigation={navigation}>
      {loading ? (
        <LoadingScreen message="Loading brand products..." />
      ) : (
        <ScrollView
          showsVerticalScrollIndicator
          contentContainerStyle={{ flexBasis:'auto' }}
        >
          <View
            style={{
              flex: 0.2,
              alignItems: "center",
              justifyContent: "flex-start"
            }}
          >
            <Image
              resizeMode="cover"
              style={{ width: "100%", height: 200 }}
              source={{ uri: banner }}
            />
          </View>

          <View
            style={{
              flex: 0.1,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: Colors.surface,
              paddingVertical: 10,
            }}
          >
            <View style={styles.sortFilterRow}>
              <TouchableOpacity 
                style={styles.sortFilterButton}
                onPress={() => setSortModalVisible(true)}
              >
                <Ionicons name="swap-vertical" size={18} color={Colors.textPrimary} />
                <Text style={styles.textStyle}>Sort</Text>
                {selectedSort !== 'default' && (
                  <View style={styles.activeDot} />
                )}
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.sortFilterButton}
                onPress={() => setFilterModalVisible(true)}
              >
                     <Ionicons name="filter" size={18} color={Colors.textPrimary} />
                <Text style={styles.textStyle}>Filter</Text>
                {selectedCategory !== 'all' && (
                  <View style={styles.activeDot} />
                )}
              </TouchableOpacity>
            </View>
            
            {(selectedSort !== 'default' || selectedCategory !== 'all') && (
              <TouchableOpacity onPress={clearFilters} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={{ flex: 0.3, }}>
            {filteredAndSortedProducts && filteredAndSortedProducts.length > 0 ? (
              <TwoColProducts navigation={navigation} data={filteredAndSortedProducts} />
            ) : (
              <EmptyListView 
                icon="bag-outline" 
                title="No products available" 
                message="This brand has no products yet"
                showActions={false}
              />
            )}
          </View>
        </ScrollView>
      )}

      {/* Sort Modal */}
      <Modal
        visible={sortModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSortModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setSortModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>
            {SORT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[
                  styles.modalOption,
                  selectedSort === option.id && styles.modalOptionSelected
                ]}
                onPress={() => handleSortSelect(option.id)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedSort === option.id && styles.modalOptionTextSelected
                ]}>
                  {option.label}
                </Text>
                {selectedSort === option.id && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={filterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Category</Text>
              <TouchableOpacity onPress={() => setFilterModalVisible(false)}>
                <Ionicons name="close" size={24} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>
            {FILTER_CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.modalOption,
                  selectedCategory === category.id && styles.modalOptionSelected
                ]}
                onPress={() => handleFilterSelect(category.id)}
              >
                <Text style={[
                  styles.modalOptionText,
                  selectedCategory === category.id && styles.modalOptionTextSelected
                ]}>
                  {category.label}
                </Text>
                {selectedCategory === category.id && (
                  <Ionicons name="checkmark" size={20} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>
    </CustomHeader>
  );
};

BrandProduct.navigationOptions = {
  header: null
};

export default BrandProduct;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.onSurface,
  },
  icon: {
    fontSize: 20,
    color: Colors.onSurface,
    marginRight: 6,
  },
  sortFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    paddingHorizontal: 20,
  },
  sortFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  activeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginLeft: 6,
  },
  clearButton: {
    marginTop: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: Colors.error,
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalOptionSelected: {
    backgroundColor: Colors.primaryLight || '#e3f2fd',
  },
  modalOptionText: {
    fontSize: 16,
    color: Colors.onSurface,
  },
  modalOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
});
