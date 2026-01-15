import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from 'expo-linking';
import SideNavigationScreen from "../screens/SideNavigationScreen/SideNavigationScreen";
import Login from "../screens/AuthScreens/Login";
import Register from "../screens/AuthScreens/Register";
import Wishlist from "../screens/SideNavigationScreen/WishlistScreen";
import MyOrder from "../screens/SideNavigationScreen/MyOrderScreen";
import AboutUs from "../screens/SideNavigationScreen/AboutUsScreen";
import ShopTheLook from "../screens/SideNavigationScreen/ShopTheLookScreen";
import TVScreen from "../screens/SideNavigationScreen/TV/TVScreen";
import TVProducts from "../screens/SideNavigationScreen/TV/TVProducts";
import ChatScreen from "../screens/SideNavigationScreen/ChatScreen";
import CheckoutScreen from "../screens/CheckoutProcess/CheckoutScreen";
import ThankyouScreen from "../screens/CheckoutProcess/ThankyouScreen";
import SearchScreen from "../screens/SearchScreen";
import ProductDetail from "../screens/ProductDetail";
import CategoryProducts from "../screens/Categories/CategoryProducts";

import MainTabNavigator from "./MainTabNavigator";

const Stack = createNativeStackNavigator();

// Deep linking configuration
const linking = {
  prefixes: [Linking.createURL('/'), 'dokkani://'],
  config: {
    screens: {
      Checkout: 'checkout',
      Thankyou: 'checkout/success',
      Main: {
        screens: {
          CartStack: 'checkout/cancel',
        },
      },
    },
  },
};

export default function AppNavigator() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator initialRouteName="Main" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main" component={MainTabNavigator} />
        <Stack.Screen name="SideNavigation" component={SideNavigationScreen} />
        <Stack.Screen name="WishlistScreen" component={Wishlist} />
        <Stack.Screen name="MyOrderScreen" component={MyOrder} />
        <Stack.Screen name="ShopTheLookScreen" component={ShopTheLook} />
        <Stack.Screen name="TV" component={TVScreen} />
        <Stack.Screen name="Products" component={TVProducts} />
        <Stack.Screen name="AboutUsScreen" component={AboutUs} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="AuthSignup" component={Register} />
        <Stack.Screen name="AuthSignin" component={Login} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} />
        <Stack.Screen name="Thankyou" component={ThankyouScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetail} />
        <Stack.Screen name="CategoryProducts" component={CategoryProducts} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
