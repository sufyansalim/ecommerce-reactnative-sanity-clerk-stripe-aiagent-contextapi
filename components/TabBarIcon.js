import React from 'react';
import { Ionicons } from '@expo/vector-icons';

import Colors from '../constants/Colors';

// Map old AntDesign names to Ionicons names
const iconMap = {
  'home': 'home-outline',
  'tags': 'pricetags-outline',
  'staro': 'star-outline',
  'star': 'star-outline',
  'appstore1': 'grid-outline',
  'appstore-o': 'grid-outline',
  'shoppingcart': 'cart-outline',
  'shopping-cart': 'cart-outline',
};

export default function TabBarIcon(props) {
  const iconName = iconMap[props.name] || props.name;
  return (
    <Ionicons
      name={iconName}
      size={26}
      style={{ marginBottom: -3 }}
      color={props.focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
}
