import React, { useState, useEffect } from 'react';
import {
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  View,
  Text,
  ActivityIndicator,
} from 'react-native';

import { Col, Grid } from 'react-native-easy-grid';
import Slides from '../components/sliders/Slides';
import CustomHeader from '../components/header/CustomHeader.js';
import TwoColProducts from '../components/sliders/TwoColSlide';
import EmptyListView from '../components/EmptyListView';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import { getHomepageData } from '../constants/SanityClient';

const HomeScreen = (props) => {
  const navigation = useNavigation();
  const { navigate } = navigation;
  
  const [loading, setLoading] = useState(true);
  const [celebrities, setCelebrities] = useState([]);
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data, error } = await getHomepageData();
      
      if (error) throw new Error(error);
      
      console.log('Homepage data from Sanity:', data);
      setCelebrities(data?.celebrities || []);
      setProducts(data?.featuredProducts || []);
      setBrands(data?.brands || []);
    } catch (error) {
      console.error('Error loading homepage data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Transform brands for slider
  const slideData = brands.slice(0, 6).map((brand) => ({
    uri: brand.image,
    text: brand.name,
  }));

  // Transform products for grid display
  const productData = products.slice(0, 4).map((product) => ({
    ...product,
    id: product._id,
    uri: product.image,
    name: product.title,
    productImage: product.image,
    images: product.images || [product.image],
  }));

  // Get first 6 celebrities
  const homeCelebrities = celebrities.slice(0, 6);

  if (loading) {
    return (
      <CustomHeader navigation={navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </CustomHeader>
    );
  }

  return (
    <CustomHeader navigation={navigation}>
      <ScrollView
        showsVerticalScrollIndicator
        contentContainerStyle={{
          flexGrow: 1,
        }}>
        {/* Banner */}
        <View style={{ flex: 0.3, alignItems: 'center', justifyContent: 'center' }}>
          <Image
            resizeMode="cover"
            style={{ width: '100%', height: 200 }}
            source={require('../assets/images/home/bannerm.png')}
          />
        </View>

        {/* Celebrities Header */}
        <View style={{ flex: 0.05, alignItems: 'center', justifyContent: 'center', marginBottom: 5, marginTop: 5 }}>
          <Grid>
            <Col style={[styles.genderTabs, { alignItems: 'flex-start', paddingLeft: 10, marginLeft: 10 }]}>
              <Text style={[styles.textStyle, { fontSize: 20 }]}>Celebrities</Text>
            </Col>
            <Col style={[styles.genderTabs, { alignItems: 'flex-end', paddingTop: 5, paddingRight: 10, marginRight: 10 }]}>
              <TouchableOpacity onPress={() => navigate('CelebritiesStack')}>
                <Text style={[styles.textStyle, { fontSize: 15 }]}>View all</Text>
              </TouchableOpacity>
            </Col>
          </Grid>
        </View>

        {/* Celebrities Grid - Row 1 */}
        {homeCelebrities.length > 0 ? (
        <View style={{ flex: 0.35, alignItems: 'center', justifyContent: 'center', marginLeft: '4.5%', marginRight: '4.5%' }}>
          <Grid style={styles.celebGrid}>
            {homeCelebrities.slice(0, 3).map((celeb) => (
              <Col key={celeb._id} style={styles.celebImageCol}>
                <TouchableOpacity
                  onPress={() =>
                    navigate('CelebrityProduct', {
                      celebrity: celeb,
                      banner: celeb.banner,
                      products: celeb.products,
                    })
                  }>
                  <Image resizeMode="cover" style={styles.celebImage} source={{ uri: celeb.image }} />
                  <Text style={styles.celebName}>{celeb.name?.toUpperCase()}</Text>
                </TouchableOpacity>
              </Col>
            ))}
          </Grid>

          {/* Celebrities Grid - Row 2 */}
          <Grid style={styles.celebGrid}>
            {homeCelebrities.slice(3, 6).map((celeb) => (
              <Col key={celeb._id} style={styles.celebImageCol}>
                <TouchableOpacity
                  onPress={() =>
                    navigate('CelebrityProduct', {
                      celebrity: celeb,
                      banner: celeb.banner,
                      products: celeb.products,
                    })
                  }>
                  <Image resizeMode="cover" style={styles.celebImage} source={{ uri: celeb.image }} />
                  <Text style={styles.celebName}>{celeb.name?.toUpperCase()}</Text>
                </TouchableOpacity>
              </Col>
            ))}
          </Grid>
        </View>
        ) : (
          <View style={{ paddingVertical: 20, alignItems: 'center' }}>
            <Text style={styles.emptyText}>No celebrities available</Text>
          </View>
        )}

        {/* Products Header */}
        <View style={{ flex: 0.05, alignItems: 'flex-start', justifyContent: 'center' }}>
          <Text style={[styles.textStyle, { fontSize: 20, paddingLeft: 10, marginLeft: 10 }]}>Products</Text>
        </View>

        {/* Products Grid */}
        <View style={{ flex: 0.3, paddingTop: 5, marginTop: 5 }}>
          {productData.length > 0 ? (
            <TwoColProducts navigation={navigation} data={productData} home={'home'} />
          ) : (
            <View style={{ paddingVertical: 20, alignItems: 'center' }}>
              <Text style={styles.emptyText}>No products available</Text>
            </View>
          )}
        </View>

        {/* Brands Slider */}
        {slideData.length > 0 && (
        <View
          style={{
            flex: 0.2,
            alignItems: 'flex-start',
            paddingLeft: 10,
            marginLeft: 10,
            justifyContent: 'center',
            paddingTop: 5,
            marginTop: 5,
          }}>
          <Slides data={slideData} />
        </View>
        )}
      </ScrollView>
    </CustomHeader>
  );
};

HomeScreen.navigationOptions = {
  header: null,
};

export default HomeScreen;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: Colors.primary,
    fontSize: 16,
  },
  textStyle: {
    color: Colors.primary,
    fontWeight: 'bold',
    fontSize: 20,
  },
  genderTabs: {
    height: 25,
    alignItems: 'center',
  },
  celebImageCol: {
    alignItems: 'center',
    paddingLeft: 5,
    marginLeft: 5,
    paddingRight: 5,
    marginRight: 5,
  },
  celebImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  celebName: {
    fontSize: 10,
    paddingTop: 5,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  celebGrid: {
    marginBottom: 10,
  },
  brandsImage: {
    padding: 5,
    margin: 5,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
