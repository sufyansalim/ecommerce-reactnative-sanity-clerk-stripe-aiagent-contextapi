import React, { useState, useEffect } from 'react';
import { Dimensions, Image, StyleSheet, View, ImageSourcePropType } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');

interface ImageItem {
  uri?: string | ImageSourcePropType;
  src?: string;
}

interface Product {
  images?: (string | ImageItem)[];
  image?: string;
  productImage?: string;
}

interface ImageSwiperProps {
  images?: (string | ImageItem)[];
  product?: Product;
}

const SLIDE_DATA = [
  { uri: require('../../assets/images/productdetail/1.jpg'), id: 'Product1' },
  { uri: require('../../assets/images/productdetail/2.jpg'), id: 'Product2' },
  { uri: require('../../assets/images/productdetail/3.jpg'), id: 'Product3' },
];

const ImageSwiper: React.FC<ImageSwiperProps> = (props) => {
  let images: (string | ImageItem | ImageSourcePropType)[] = [];
  
  if (props.images && props.images.length > 0) {
    images = props.images;
  } else if (props.product?.images && props.product.images.length > 0) {
    images = props.product.images;
  } else if (props.product?.image) {
    images = [props.product.image];
  } else if (props.product?.productImage) {
    images = [props.product.productImage];
  } else {
    images = SLIDE_DATA;
  }
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  const currentImage = images[currentIndex];
  
  let imageSource: ImageSourcePropType;
  if (typeof currentImage === 'string') {
    imageSource = { uri: currentImage };
  } else if ((currentImage as ImageItem)?.src) {
    imageSource = { uri: (currentImage as ImageItem).src };
  } else if ((currentImage as ImageItem)?.uri && typeof (currentImage as ImageItem).uri === 'string') {
    imageSource = { uri: (currentImage as ImageItem).uri as string };
  } else {
    imageSource = ((currentImage as ImageItem)?.uri || currentImage) as ImageSourcePropType;
  }
  
  return (
    <SafeAreaView>
      <View style={styles.container}>
        <Image 
          resizeMode='contain' 
          style={styles.image} 
          source={imageSource}
        />
        {images.length > 1 && (
          <View style={styles.pagination}>
            {images.map((_, index) => (
              <View 
                key={index} 
                style={[
                  styles.dot, 
                  index === currentIndex && styles.activeDot
                ]} 
              />
            ))}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default ImageSwiper;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    height: height * 0.35,
    width,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.backgroundGray,
  },
});
