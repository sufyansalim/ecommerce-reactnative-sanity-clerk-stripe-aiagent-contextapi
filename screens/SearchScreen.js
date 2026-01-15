import React, { useState, useCallback } from "react";
import {
  StyleSheet,
  View,
  BackHandler,
  TouchableOpacity,
  Platform,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Keyboard,
  ScrollView,
} from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';

import { Entypo, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Colors from "../constants/Colors";
import { aiSearch, exampleQueries } from "../services/searchService";
import { useAuth } from "@clerk/clerk-expo";

const SearchScreen = props => {
  const navigation = useNavigation();
  const { userId } = useAuth();
  
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      if (Platform.OS !== "android") return;
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [navigation])
  );

  const handleSearch = async () => {
    if (!query.trim()) return;
    
    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await aiSearch(query, userId);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleQuery = (exampleQuery) => {
    setQuery(exampleQuery);
    // Auto-search after setting query
    setTimeout(() => {
      handleSearchWithQuery(exampleQuery);
    }, 100);
  };

  const handleSearchWithQuery = async (searchQuery) => {
    if (!searchQuery.trim()) return;
    
    Keyboard.dismiss();
    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const data = await aiSearch(searchQuery, userId);
      setResults(data);
    } catch (err) {
      setError(err.message || 'Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProductPress = (product) => {
    navigation.navigate('ProductDetail', { product });
  };

  const clearSearch = () => {
    setQuery('');
    setResults(null);
    setError(null);
  };

  const renderProductItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image || item.images?.[0] }} 
        style={styles.productImage}
        resizeMode="cover"
      />
      <View style={styles.productInfo}>
        <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.productCategory}>
          {item.category?.name} {item.brand?.name ? `• ${item.brand.name}` : ''}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productPrice}>{item.price} QAR</Text>
          {item.inStock ? (
            <View style={styles.stockBadge}>
              <Text style={styles.stockText}>In Stock</Text>
            </View>
          ) : (
            <View style={[styles.stockBadge, styles.outOfStock]}>
              <Text style={styles.stockTextOut}>Out of Stock</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderExampleQueries = () => (
    <View style={styles.examplesContainer}>
      <Text style={styles.examplesTitle}>Try asking:</Text>
      {exampleQueries.map((example, index) => (
        <TouchableOpacity 
          key={index}
          style={styles.exampleChip}
          onPress={() => handleExampleQuery(example)}
        >
          <Ionicons name="sparkles" size={16} color={Colors.tintColor} />
          <Text style={styles.exampleText}>{example}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={{ flex: 1, backgroundColor: Colors.backgroundDark }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Entypo name="cross" style={styles.closeIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>AI Search</Text>
          <View style={{ width: 30 }} />
        </View>

        {/* Search Input */}
        <View style={styles.searchWrapper}>
          <View style={styles.searchContainer}>
            <Ionicons name="sparkles" size={20} color="#666666" />
            <TextInput
              placeholder="Ask me anything about products..."
              placeholderTextColor="#999999"
              style={styles.searchInput}
              value={query}
              onChangeText={setQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color="#666666" />
              </TouchableOpacity>
            )}
            <TouchableOpacity 
              onPress={handleSearch}
              style={styles.searchButton}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.backgroundDark} />
              ) : (
                <Ionicons name="arrow-forward" size={20} color={Colors.backgroundDark} />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Content Area */}
        <View style={styles.content}>
          {/* Loading State */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.tintColor} />
              <Text style={styles.loadingText}>Searching with AI...</Text>
            </View>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={48} color={Colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleSearch}>
                <Text style={styles.retryText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results */}
          {results && !isLoading && (
            <ScrollView 
              style={styles.resultsContainer}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsContentContainer}
            >
              {/* AI Message */}
              {results.message && (
                <View style={styles.aiMessageContainer}>
                  <View style={styles.aiAvatar}>
                    <Ionicons name="sparkles" size={16} color="#333333" />
                  </View>
                  <Text style={styles.aiMessage}>{results.message}</Text>
                </View>
              )}

              {/* Products Count */}
              <View style={styles.resultsHeader}>
                <Text style={styles.resultsCount}>
                  {results.productCount} product{results.productCount !== 1 ? 's' : ''} found
                </Text>
              </View>

              {/* Products List */}
              {results.products?.length > 0 ? (
                results.products.map((item) => (
                  <TouchableOpacity 
                    key={item._id}
                    style={styles.productCard}
                    onPress={() => handleProductPress(item)}
                    activeOpacity={0.7}
                  >
                    <Image 
                      source={{ uri: item.image || item.images?.[0] }} 
                      style={styles.productImage}
                      resizeMode="cover"
                    />
                    <View style={styles.productInfo}>
                      <Text style={styles.productTitle} numberOfLines={2}>{item.title}</Text>
                      <Text style={styles.productCategory}>
                        {item.category?.name} {item.brand?.name ? `• ${item.brand.name}` : ''}
                      </Text>
                      <View style={styles.productFooter}>
                        <Text style={styles.productPrice}>{item.price} QAR</Text>
                        {item.inStock ? (
                          <View style={styles.stockBadge}>
                            <Text style={styles.stockText}>In Stock</Text>
                          </View>
                        ) : (
                          <View style={[styles.stockBadge, styles.outOfStock]}>
                            <Text style={styles.stockTextOut}>Out of Stock</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))
              ) : (
                <View style={styles.noResultsContainer}>
                  <MaterialIcons name="search-off" size={48} color={Colors.textGray} />
                  <Text style={styles.noResultsText}>No products found</Text>
                  <Text style={styles.noResultsSubtext}>Try a different search</Text>
                </View>
              )}
            </ScrollView>
          )}

          {/* Initial State - Show Examples */}
          {!results && !isLoading && !error && renderExampleQueries()}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SearchScreen;

SearchScreen.navigationOptions = {
  header: null
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundDark,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  closeIcon: {
    color: Colors.textWhite,
    fontSize: 28,
  },
  headerTitle: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: '600',
  },
  searchWrapper: {
    paddingHorizontal: 15,
    paddingBottom: 15,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    color: '#222222',
    fontSize: 16,
  },
  searchButton: {
    backgroundColor: Colors.tintColor,
    borderRadius: 8,
    padding: 8,
    marginLeft: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 15,
  },
  // Examples
  examplesContainer: {
    paddingTop: 20,
  },
  examplesTitle: {
    color: Colors.textGray,
    fontSize: 14,
    marginBottom: 15,
  },
  exampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 10,
    gap: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  exampleText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
  },
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  loadingText: {
    color: Colors.textGray,
    fontSize: 16,
  },
  // Error
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15,
  },
  errorText: {
    color: Colors.textGray,
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: Colors.tintColor,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.backgroundDark,
    fontWeight: '600',
  },
  // Results
  resultsContainer: {
    flex: 1,
  },
  resultsContentContainer: {
    paddingBottom: 30,
  },
  aiMessageContainer: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    gap: 12,
  },
  aiAvatar: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiMessage: {
    flex: 1,
    color: '#333333',
    fontSize: 14,
    lineHeight: 20,
  },
  resultsHeader: {
    marginBottom: 10,
  },
  resultsCount: {
    color: Colors.textGray,
    fontSize: 14,
  },
  productsList: {
    paddingBottom: 20,
  },
  // Product Card
  productCard: {
    flexDirection: 'row',
    backgroundColor: Colors.backgroundLight || '#2a2a2a',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  productImage: {
    width: 100,
    height: 100,
  },
  productInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  productTitle: {
    color: '#222222',
    fontSize: 15,
    fontWeight: '500',
  },
  productCategory: {
    color: '#666666',
    fontSize: 12,
    marginTop: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  productPrice: {
    color: '#1a8c4a',
    fontSize: 16,
    fontWeight: '700',
  },
  stockBadge: {
    backgroundColor: '#2ecc71',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  outOfStock: {
    backgroundColor: '#e74c3c',
  },
  stockText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  stockTextOut: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  // No Results
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  noResultsText: {
    color: Colors.textWhite,
    fontSize: 18,
    fontWeight: '500',
  },
  noResultsSubtext: {
    color: Colors.textGray,
    fontSize: 14,
  },
});

