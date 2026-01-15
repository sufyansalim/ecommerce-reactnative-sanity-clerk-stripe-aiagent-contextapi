import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";

import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import LoadingScreen from "../../components/LoadingScreen";
import EmptyListView from "../../components/EmptyListView";
import CustomHeader from "../../components/header/CustomHeader.js";
import ThreecolSlide from '../../components/sliders/ThreecolSlide';
import { useAppState, useAppDispatch, fetchBrands } from '../../context';


const Brands = ({ navigation }) => {
  const { brands, brandsLoading: loading } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Render!");
    fetchBrands(dispatch);
    return () => {
      console.log("Cleanup!");
    };
  }, [dispatch]);

  return (
    <CustomHeader navigation={navigation}>
          <View
            style={{
              flex: 0.1,
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: 15,
              marginLeft: 15,
              
            }}
          >
                <Text style={styles.textStyle}>All Brands</Text>
          </View>
          {loading ? (
          <LoadingScreen message="Loading brands..." />
        ) : brands && brands.length > 0 ? (
          <ThreecolSlide navigation={navigation} route={"BrandProduct"} data={brands} />
        ) : (
          <EmptyListView 
            icon="pricetag-outline" 
            title="No brands available" 
            message="Check back later for new brands"
            showActions={false}
          />
        )}
    </CustomHeader>
  );
};

export default Brands;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
 
});
