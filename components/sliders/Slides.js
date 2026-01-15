import React from 'react';
import { ScrollView, StyleSheet, View, Image, Text } from 'react-native';
import Colors from '../../constants/Colors';

const Slides = ({ data }) => {
  const renderSlides = (data) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }
    return data.map((slide, index) => {
      return (
        <View key={`${slide.text}-${index}`} style={styles.slideStyle}>
          <Image
            source={typeof slide.uri === 'string' ? { uri: slide.uri } : slide.uri}
            resizeMode='stretch'
            style={{ height: 100, width: 200 }}
          />
          <Text style={{ fontSize: 12, fontWeight: 'bold', textAlign: 'center' }}>{slide.text}</Text>
        </View>
      );
    });
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator>
      {renderSlides(data)}
    </ScrollView>
  );
};

export default Slides;

const styles = StyleSheet.create({
  slideStyle: {
    flex: 1,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    backgroundColor: Colors.background,
    borderRadius: 4,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
    padding: 10,
  },
});