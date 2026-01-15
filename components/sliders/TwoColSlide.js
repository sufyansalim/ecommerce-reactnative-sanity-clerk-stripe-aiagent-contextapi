import React, { useState } from "react";
import { StyleSheet, View, ScrollView, Image, TouchableOpacity, Text } from "react-native";
import { Col, Grid } from "react-native-easy-grid";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import { useWishlistState, useWishlistDispatch, addToWishlist } from "../../context";
import Colors from "../../constants/Colors";
import InfoModal from "../InfoModal";
import Surface from "../Surface";


const TwoColSlide = ({ data, buttonText, style, navigation: navProp, home }) => {
  const navHook = useNavigation();
  const navigation = navProp || navHook;
  
  const { wishlist: wishlistItems } = useWishlistState();
  const wishlistDispatch = useWishlistDispatch();
  
  const [modalVisible, setModalVisible] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  
  const handleAddToWishlist = (product) => {
    addToWishlist(wishlistDispatch, product);
    setAddedProduct(product);
    setModalVisible(true);
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    setAddedProduct(null);
  };

  const render = (data, buttonText, style) => {
    if (!data || !Array.isArray(data) || data.length === 0) {
      return null;
    }
    return new Array(Math.ceil(data.length / 2)).fill(0).map((val, idx) => {
      const rowItems = data.slice(idx * 2, (idx + 1) * 2);
      const isLastRowOdd = rowItems.length === 1;
      
      return (
        <View
          key={idx}
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            paddingTop: 5,
            marginTop: 5
          }}
        >
          {rowItems.map((product, index) => (

            <Surface
              key={`main-${idx}-${index}`}
              elevation={1}
              padding={10}
              margin={5}
              marginTop={5}
              borderRadius={10}
              style={{
                width: 160,
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <View
                style={style ? style.containerStyle : {
                  backgroundColor: Colors.backgroundGray,
                  height: 150,
                  width: 150,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                {!!home ? (
                  <Image
                    resizeMode="contain"
                    style={style ? style.thumbnailStyle : { height: 100, width: 100 }}
                    source={typeof product.uri === 'string' ? { uri: product.uri } : product.uri}
                  />
                ) : (
                  <Image
                    resizeMode="contain"
                    style={style ? style.thumbnailStyle : { height: 100, width: 100 }}
                    source={{ uri: product.productImage }}
                  />
                )}
              </View>
              <View style={{ alignSelf: "flex-start", paddingLeft: 5, marginLeft: 5 }}>
                <Text
                  style={{ fontSize: 15, fontWeight: "bold", alignSelf: "flex-start" }}
                >
                  {product.title ? product.title.substring(0, 17) : ''}
                </Text>
                {!!!buttonText && (
                  <Text style={{ fontSize: 10, alignSelf: "flex-start" }}>{!!home ? (product.name || '') : (product.categories || '')}</Text>
                )}
                {!!!buttonText && (
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: "bold",
                      alignSelf: "flex-start"
                    }}>
                    &#x631;&#x642; {product.price || ''}
                  </Text>
                )}
              </View>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  paddingTop: 5,
                  marginTop: 5,
                  paddingBottom: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetail', { product: product })}
                  style={style ? style.buttonStyle : { flex: 1, marginRight: 8, borderRadius: 5, backgroundColor: Colors.primary, paddingVertical: 10, alignItems: 'center' }}
                >
                  <Text style={{ fontSize: 12, color: Colors.textWhite }}>View</Text>
                </TouchableOpacity>

                {!!!buttonText && (
                  <TouchableOpacity 
                    onPress={() => handleAddToWishlist(product)}
                    style={styles.wishlistButton}
                  >
                    <Ionicons 
                      name={wishlistItems?.some(item => (item.id === product.id) || (item._id === product._id)) ? "heart" : "heart-outline"}
                      size={22} 
                      color={wishlistItems?.some(item => (item.id === product.id) || (item._id === product._id)) ? Colors.error : Colors.iconDefault}
                    />
                  </TouchableOpacity>
                )}
              </View>
            </Surface>
          ))}
          
          {/* Phantom item to maintain grid alignment when odd number of items */}
          {isLastRowOdd && (
            <View
              style={{
                width: 160,
                margin: 5,
                marginTop: 5,
                padding: 10,
              }}
            />
          )}
        </View>
      );
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView showsVerticalScrollIndicator>
        {render(data, buttonText, style)}
      </ScrollView>
      
      <InfoModal
        visible={modalVisible}
        title="Added to Wishlist"
        message={`${addedProduct?.title || 'Item'} has been added to your wishlist!`}
        onClose={handleCloseModal}
        type="success"
      />
    </View>
  );
};

export default TwoColSlide;

const styles = StyleSheet.create({
  wishlistButton: {
    backgroundColor: Colors.backgroundGray,
    width: 35,
    height: 35,
    marginRight: 5,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
