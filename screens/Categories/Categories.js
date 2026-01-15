import React, { useState, useEffect } from 'react';
import {
  Image,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';

import CustomHeader from '../../components/header/CustomHeader.js'
import { getCategories } from '../../constants/SanityClient';
import Colors from '../../constants/Colors';

const Categories = (props) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const { data, error } = await getCategories();
      if (error) throw new Error(error);
      
      // Transform Sanity data to match expected format
      const formattedCategories = data.map(cat => ({
        id: cat._id,
        name: cat.name,
        uri: cat.image,
        slug: cat.slug?.current,
      }));
      
      setCategories(formattedCategories);
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageClick = (categoryName) => {
    props.navigation.navigate('CategoryProducts', { category: categoryName });
  };

  const renderImages = (data) => {
    return data.map((image, index) => {
      return (
        <TouchableOpacity key={`category-${index}`} onPress={() => handleImageClick(image.name)}>
          <View style={styles.imageContainer}>
            <Image resizeMode='stretch' style={styles.ImageSize}
              source={{ uri: image.uri }} />
            <View style={styles.overlay}>
              <Text style={styles.text}>{image.name}</Text>
            </View>
          </View>
        </TouchableOpacity>
      );
    });
  };

  if (loading) {
    return (
      <CustomHeader navigation={props.navigation}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading categories...</Text>
        </View>
      </CustomHeader>
    );
  }

  return (
    <CustomHeader navigation={props.navigation}>
      <ScrollView
      style={{ flexGrow: 1, }}
        centerContent
        showsVerticalScrollIndicator>
        {renderImages(categories)}
      </ScrollView>
    </CustomHeader>
  );
}

export default Categories;

Categories.navigationOptions = {
  header: null,
};



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
  imageContainer: {
    alignItems: 'center',
    justifyContent:'center',
  },
  ImageSize: {
    width: 400,
    height:150
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
