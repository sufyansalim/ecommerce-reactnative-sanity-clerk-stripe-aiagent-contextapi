import React from 'react';
import { ScrollView, StyleSheet, Image, TouchableOpacity, Text, ImageSourcePropType } from 'react-native';
import { Col, Grid } from 'react-native-easy-grid';
import { NavigationProp } from '@react-navigation/native';
import { Product } from '../../types';

interface SlideItem {
  _id?: string;
  uri?: string | ImageSourcePropType;
  image?: string;
  name: string;
  banner?: string;
  products?: Product[];
  ids?: string[];
}

interface ThreeColSlideProps {
  data: SlideItem[];
  route: string;
  navigation: NavigationProp<any>;
  products?: Product[];
  brandProducts?: Product[];
}

const ThreeColSlide: React.FC<ThreeColSlideProps> = ({ data, route, navigation, products, brandProducts }) => {
  return (
    <ScrollView
      showsVerticalScrollIndicator
      contentContainerStyle={{
        flexGrow: 1,
        paddingVertical: 10
      }}
    >
      {data && data.length > 0 &&
        new Array(Math.ceil(data.length / 3)).fill(0).map((_, idx) => {
          const rowItems = data.slice(idx * 3, (idx + 1) * 3);
          const phantomCount = rowItems.length < 3 ? 3 - rowItems.length : 0;
          
          return (
            <Grid key={idx} style={styles.slideGrid}>
              {rowItems.map((slide, index) => (
                <Col key={`main-${idx}-${index}`} style={styles.slideImageCol}>
                  <TouchableOpacity
                    onPress={() =>
                      (navigation as any).navigate(route, {
                        banner: slide.banner,
                        products: slide.products,
                        ids: slide.ids,
                        brandProducts
                      })
                    }
                  >
                    <Image
                      resizeMode="cover"
                      style={styles.slideImage}
                      source={typeof slide.uri === 'string' ? { uri: slide.uri } : slide.uri}
                    />
                    <Text style={styles.slideName}>{slide.name}</Text>
                  </TouchableOpacity>
                </Col>
              ))}
              {Array.from({ length: phantomCount }).map((_, i) => (
                <Col key={`phantom-${idx}-${i}`} style={styles.slideImageCol}>
                  {/* Empty placeholder */}
                </Col>
              ))}
            </Grid>
          );
        })}
    </ScrollView>
  );
};

export default ThreeColSlide;

const styles = StyleSheet.create({
  slideImageCol: {
    flexGrow: 1,
    alignItems: 'center',
    paddingLeft: 5,
    marginLeft: 5,
    paddingRight: 5,
    marginRight: 5,
    marginBottom: 10
  },
  slideImage: {
    width: 100,
    height: 100,
    marginBottom: 5
  },
  slideName: {
    fontSize: 10,
    paddingTop: 5,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  slideGrid: {
    marginBottom: 10
  }
});
