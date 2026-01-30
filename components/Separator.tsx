import React from 'react';
import { View, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

interface SeparatorProps {
  style?: ViewStyle;
}

const Separator: React.FC<SeparatorProps> = ({ style }) => {
  return (
    <View
      style={[
        {
          borderBottomColor: Colors.border,
          borderBottomWidth: 1,
        },
        style,
      ]}
    />
  );
};

export default Separator;
