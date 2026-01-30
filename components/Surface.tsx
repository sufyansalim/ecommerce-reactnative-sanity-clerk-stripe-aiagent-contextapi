import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import Colors from '../constants/Colors';

interface SurfaceProps {
  children: React.ReactNode;
  style?: ViewStyle;
  elevation?: 0 | 1 | 2 | 3;
  padding?: number;
  margin?: number;
  marginTop?: number;
  borderRadius?: number;
}

const elevationStyles: Record<number, ViewStyle> = {
  0: {},
  1: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 1,
  },
  2: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  3: {
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
};

const Surface: React.FC<SurfaceProps> = ({ 
  children, 
  style, 
  elevation = 1,
  padding = 20,
  margin = 16,
  marginTop = 16,
  borderRadius = 12,
}) => {
  return (
    <View 
      style={[
        styles.surface,
        elevationStyles[elevation] || elevationStyles[1],
        { 
          padding, 
          marginHorizontal: margin, 
          marginTop,
          borderRadius,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  surface: {
    backgroundColor: Colors.surface,
  },
});

export default Surface;
