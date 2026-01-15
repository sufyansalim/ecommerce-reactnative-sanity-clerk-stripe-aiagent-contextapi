import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, Image, TouchableOpacity, Text } from "react-native";
import { Col, Grid } from "react-native-easy-grid";

const Slides = ({ data, route, navigation, products, brandProducts }) => {
  // const renderSlides = (data) =>
  // data.length &&
  // new Array(Math.ceil(data.length / 3)).fill(0).map((val, idx) => (
  //   <Grid key={idx} style={styles.slideGrid} >
  //   {data.slice(idx * 3, (idx + 1) * 3).map((slide, index) => (
  //       <Col key={`main-${idx}-${index}`} style={styles.slideImageCol} >
  //           <TouchableOpacity >
  //               <Image
  //               resizeMode="cover"
  //               style={styles.slideImage}
  //               source={{uri: slide.uri}}
  //               />
  //               <Text style={styles.slideName}>{slide.name}</Text>
  //           </TouchableOpacity>
  //       </Col>
  //   ))}
  //   </Grid>
  // ));
  return (
    <ScrollView
      showsVerticalScrollIndicator
      contentContainerStyle={{
        flex: 1,
        justifyContent: "center"
      }}
    >
      {data && data.length > 0 &&
        new Array(Math.ceil(data.length / 3)).fill(0).map((val, idx) => {
          const rowItems = data.slice(idx * 3, (idx + 1) * 3);
          const phantomCount = rowItems.length < 3 ? 3 - rowItems.length : 0;
          
          return (
            <Grid key={idx} style={styles.slideGrid}>
              {rowItems.map((slide, index) => (
                <Col key={`main-${idx}-${index}`} style={styles.slideImageCol}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(route, {
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
              {/* Phantom items to maintain grid alignment */}
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

export default Slides;

const styles = StyleSheet.create({
  slideImageCol: {
    flex: 0.5,
    height: "auto",
    alignItems: "flex-start"
    // paddingLeft: 5,
    // marginLeft: 5,
    // paddingRight: 5,
    // marginRight: 5
  },
  slideImage: {
    flex: 1,
    height: 100,
    width: 100
  },
  slideName: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "Roboto",
    textAlign: "center",
    paddingBottom: 5,
    marginBottom: 5,
    paddingTop: 5
  },
  slideGrid: {
    flex: 0.5,
    paddingHorizontal: 8,
    marginHorizontal: 8
  }
});
