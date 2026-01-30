import React from 'react';
import { Text, TextProps, StyleSheet } from 'react-native';

interface MonoTextProps extends TextProps {
  children?: React.ReactNode;
}

export const MonoText: React.FC<MonoTextProps> = (props) => {
  return (
    <Text {...props} style={[props.style, styles.monoText]} />
  );
};

const styles = StyleSheet.create({
  monoText: {
    fontFamily: 'space-mono',
  },
});

export default MonoText;
