import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '../../constants/Colors';

const { width, height } = Dimensions.get('window');


const SLIDE_DATA = [
    {
        uri: require('../../assets/images/productdetail/1.jpg'),
        id: 'Product1'
    },
    {
      uri: require('../../assets/images/productdetail/2.jpg'),
      id: 'Product2'
  },
  {
    uri: require('../../assets/images/productdetail/3.jpg'),
    id: 'Product3'
  },  
  ];

const ImageSwiper = (props) => {
  const images = (props.images && props.images.length > 0) ? props.images : SLIDE_DATA;
  
  // Simple image display without external swiper dependency
  const [currentIndex, setCurrentIndex] = React.useState(0);
  
  React.useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    
    return () => clearInterval(interval);
  }, [images.length]);
  
  const currentImage = images[currentIndex];
  
  // Handle different image formats: string URL, {uri: string}, {src: string}, or require()
  let imageSource;
  if (typeof currentImage === 'string') {
    imageSource = { uri: currentImage };
  } else if (currentImage?.src) {
    imageSource = { uri: currentImage.src };
  } else if (currentImage?.uri && typeof currentImage.uri === 'string') {
    imageSource = { uri: currentImage.uri };
  } else {
    imageSource = currentImage?.uri || currentImage;
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
