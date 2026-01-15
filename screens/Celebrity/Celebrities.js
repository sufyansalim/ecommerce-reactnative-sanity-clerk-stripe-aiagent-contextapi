import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { StyleSheet, Text, View, Image } from "react-native";

import LoadingScreen from "../../components/LoadingScreen";
import EmptyListView from "../../components/EmptyListView";
import CustomHeader from "../../components/header/CustomHeader.js";
import ThreecolSlide from "../../components/sliders/ThreecolSlide";
import { useAppState, useAppDispatch, fetchCelebrities } from '../../context';

const Celebrities = ({ navigation }) => {
  const { celebrities, celebritiesLoading: loading } = useAppState();
  const dispatch = useAppDispatch();

  useEffect(() => {
    console.log("Render!");
    fetchCelebrities(dispatch);
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
        <Text style={styles.textStyle}>Celebrities</Text>
      </View>
      {loading ? (
          <LoadingScreen message="Loading celebrities..." />
        ) : celebrities && celebrities.length > 0 ? (
          <ThreecolSlide route={'CelebrityProduct'} navigation={navigation} data={celebrities} />
        ) : (
          <EmptyListView 
            icon="people-outline" 
            title="No celebrities available" 
            message="Check back later for new celebrities"
            showActions={false}
          />
        )}
    </CustomHeader>
  );
};

export default Celebrities;


const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto"
  }
});
