import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBarIcon from '../components/TabBarIcon';
import Colors from '../constants/Colors';

import HomeScreen from '../screens/HomeScreen';
import Brands from '../screens/Brand/Brands';
import BrandProduct from '../screens/Brand/BrandProduct';
import Celebrities from '../screens/Celebrity/Celebrities';
import Categories from '../screens/Categories/Categories';
import Cart from '../screens/Cart';
import CelebrityProduct from '../screens/Celebrity/CelebrityProduct';
import ProductDetail from '../screens/ProductDetail';

const Stack = createNativeStackNavigator<any>();
const Tab = createBottomTabNavigator<any>();

// Type assertion to bypass React Navigation v7 id requirement
const StackNavigator = Stack.Navigator as any;
const TabNavigator = Tab.Navigator as any;

const HomeStack: React.FC = () => {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="CelebrityProduct" component={CelebrityProduct} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </StackNavigator>
  );
};

const BrandsStack: React.FC = () => {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Brands" component={Brands} />
      <Stack.Screen name="BrandProduct" component={BrandProduct} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </StackNavigator>
  );
};

const CelebritiesStack: React.FC = () => {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Celebrities" component={Celebrities} />
      <Stack.Screen name="CelebrityProduct" component={CelebrityProduct} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </StackNavigator>
  );
};

const CategoriesStack: React.FC = () => {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </StackNavigator>
  );
};

const CartStack: React.FC = () => {
  return (
    <StackNavigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={Cart} />
      <Stack.Screen name="ProductDetail" component={ProductDetail} />
    </StackNavigator>
  );
};

const MainTabNavigator: React.FC = () => {
  return (
    <TabNavigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.tabIconSelected,
        tabBarInactiveTintColor: Colors.tabIconDefault,
        tabBarStyle: {
          backgroundColor: '#000',
        },
      }}
    >
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="home" />,
        }}
      />
      <Tab.Screen
        name="BrandsStack"
        component={BrandsStack}
        options={{
          tabBarLabel: 'Brands',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="tags" />,
        }}
      />
      <Tab.Screen
        name="CelebritiesStack"
        component={CelebritiesStack}
        options={{
          tabBarLabel: 'Celebrities',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="star" />,
        }}
      />
      <Tab.Screen
        name="CategoriesStack"
        component={CategoriesStack}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="appstore-o" />,
        }}
      />
      <Tab.Screen
        name="CartStack"
        component={CartStack}
        options={{
          tabBarLabel: 'Cart',
          tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="shoppingcart" />,
        }}
      />
    </TabNavigator>
  );
};

export default MainTabNavigator;
