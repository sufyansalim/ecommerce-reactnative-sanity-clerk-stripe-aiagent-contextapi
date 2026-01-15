import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Image,
  Text,
  TouchableOpacity
} from "react-native";
import { Ionicons } from '@expo/vector-icons';

import ImageSwiper from "./../components/sliders/ImageSwiper";
import TwoColProducts from "../components/sliders/TwoColSlide";
import { AirbnbRating } from "react-native-ratings";

import CustomHeader from "../components/header/CustomHeader.js";
import EmptyListView from "../components/EmptyListView";
import { Col, Grid } from "react-native-easy-grid";
import Colors from "../constants/Colors";

import { 
  useAppState, 
  useAppDispatch, 
  fetchSimilarProducts,
  useCartDispatch, 
  addToCart,
  useWishlistState,
  useWishlistDispatch,
  addToWishlist 
} from "../context";

const ProductDetail = ({
  navigation,
  route,
}) => {
  const { similarProducts: twoTvProducts } = useAppState();
  const appDispatch = useAppDispatch();
  const cartDispatch = useCartDispatch();
  const { wishlist: wishlistItems } = useWishlistState();
  const wishlistDispatch = useWishlistDispatch();

  const product = route.params?.product || {};
  const productId = product?._id || product?.id;
  const categoryName = product?.category?.name || product?.categories?.[0] || '';

  useEffect(() => {
    if (categoryName || productId) {
      fetchSimilarProducts(appDispatch, categoryName, productId);
    }
  }, [categoryName, productId, appDispatch]);

  // Guard against missing product data
  if (!product || !productId) {
    return (
      <CustomHeader navigation={navigation}>
        <EmptyListView 
          icon="search-outline" 
          title="Product not found" 
          message="The product you're looking for doesn't exist or has been removed"
          primaryButtonText="Browse Products"
          primaryButtonRoute="HomeStack"
          secondaryButtonText="Go Back"
        />
      </CustomHeader>
    );
  }

  return (
    <CustomHeader navigation={navigation}>
      <ScrollView
        showsVerticalScrollIndicator
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <View
          style={{
            flex: 0.3,
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <ImageSwiper images={product.images || []} />
        </View>
        <View
          style={{
            flex: 0.2,
            alignItems: "center",
            justifyContent: "center",
            borderTopColor: Colors.borderDark,
            borderTopWidth: 0.5
          }}
        >
            <Grid style={{ paddingTop: 5, marginTop: 5 }}>
              <Col
                style={{
                  alignItems: "flex-start",
                  paddingLeft: 5,
                  marginLeft: 5
                }}
              >
                <AirbnbRating
                  showRating={false}
                  count={5}
                  defaultRating={2}
                  size={24}
                />
              </Col>
              <Col
                style={{
                  alignItems: "flex-end",
                  paddingRight: 10,
                  marginRight: 10
                }}
              >
                <TouchableOpacity 
                  style={styles.wishlistButton}
                  onPress={() => addToWishlist(wishlistDispatch, product)}
                >
                  <Ionicons 
                    name={wishlistItems?.some(item => item.id === product.id) ? "heart" : "heart-outline"}
                    size={26} 
                    color={wishlistItems?.some(item => item.id === product.id) ? Colors.error : Colors.iconDefault}
                  />
                </TouchableOpacity>
              </Col>
            </Grid>
            <Grid style={{ paddingTop: 0, marginTop: 0 }}>
              <Col
                style={{
                  alignItems: "flex-start",
                  paddingLeft: 10,
                  marginLeft: 10
                }}
              >
                <Text style={styles.cardText}>
                  {product.title}
                </Text>
                <Text style={{ fontSize: 12 }}>
                  {product.category?.name || product.categories?.[0] || ''}
                </Text>
                <Text style={styles.cardText}>
                  {" "}
                  &#x631;&#x642; {product.price}
                </Text>
              </Col>
              <Col
                style={{
                  alignItems: "flex-end",
                  justifyContent: "center",
                  paddingRight: 10,
                  marginRight: 10
                }}
              >
                <TouchableOpacity
                  style={StyleSheet.flatten(styles.button)}
                  onPress={() => {
                    addToCart(cartDispatch, product);
                    navigation.navigate("Main", { screen: "CartStack", params: { screen: "Cart" } });
                  }}
                >
                  <Text style={{ fontSize: 10, color: Colors.textWhite }}>Add to Cart</Text>
                </TouchableOpacity>
              </Col>
            </Grid>
          </View>
          <View
            style={{
              flex: 0.1,
              alignItems: "flex-start",
              paddingLeft: 10,
              marginLeft: 10
            }}
          >
            <Text style={styles.textStyle}>Size</Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}
            >
              <View style={styles.sizeCol}>
                <Text style={styles.sizeText}>52M</Text>
              </View>
              <View style={[styles.sizeCol, { marginLeft: 5 }]}>
                <Text style={styles.sizeText}>54M</Text>
              </View>
              <View style={[styles.sizeCol, { marginLeft: 5 }]}>
                <Text style={styles.sizeText}>55M</Text>
              </View>
            </View>
          </View>
          <View
            style={{
              flex: 0.2,
              alignItems: "flex-start",
              paddingLeft: 10,
              marginLeft: 10
            }}
          >
            <Text style={styles.textStyle}>Specification</Text>
            <Text style={{ fontSize: 12, paddingTop: 5 }}>
              CR39 Warm green lenses with blue anti-effective coating on the
              inside. 100% UVA/UVB protective lenses.
            </Text>
            <Text style={{ fontSize: 12 }}>
              Packaging: Packaged in a collapsible natural cork box with red
              cleaning cloth.
            </Text>
          </View>
          <View
            style={{
              flex: 0.1,
              alignItems: "flex-start",
              borderTopColor: Colors.borderDark,
              borderTopWidth: 0.5,
              paddingTop: 10,
              marginTop: 10,
              paddingLeft: 10,
              marginLeft: 10
            }}
          >
            <Text style={styles.cardText}>You may also like</Text>
          </View>
          <View style={{ flex: 0.3 }}>
            <TwoColProducts data={twoTvProducts} />
          </View>
        </ScrollView>
    </CustomHeader>
  );
};

ProductDetail.navigationOptions = {
  header: null
};

export default ProductDetail;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
  cardText: {
    fontSize: 17,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
  button: {
    width: 120,
    borderRadius: 5,
    alignSelf: "flex-end",
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  sizeText: {
    fontSize: 10,
    textAlign: "center"
  },
  sizeCol: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 5,
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    borderColor: Colors.borderDark,
    borderWidth: 0.5
  },
  wishlistButton: {
    padding: 8,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 20,
  }
});
