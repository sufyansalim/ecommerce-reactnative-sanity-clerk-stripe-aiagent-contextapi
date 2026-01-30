import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

// Map old AntDesign names to Ionicons names
const iconMap: Record<string, string> = {
  'home': 'home-outline',
  'tags': 'pricetags-outline',
  'staro': 'star-outline',
  'star': 'star-outline',
  'appstore1': 'grid-outline',
  'appstore-o': 'grid-outline',
  'shoppingcart': 'cart-outline',
  'shopping-cart': 'cart-outline',
};

interface TabBarIconProps {
  name: string;
  focused: boolean;
}

const TabBarIcon: React.FC<TabBarIconProps> = ({ name, focused }) => {
  const iconName = iconMap[name] || name;
  return (
    <Ionicons
      name={iconName as any}
      size={26}
      style={{ marginBottom: -3 }}
      color={focused ? Colors.tabIconSelected : Colors.tabIconDefault}
    />
  );
};

export default TabBarIcon;
