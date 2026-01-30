/**
 * Layout Constants - TypeScript Version
 * 
 * Device dimensions and layout helpers
 */

import { Dimensions } from 'react-native';

// Get window dimensions
const { width, height } = Dimensions.get('window');

/**
 * Layout interface
 */
export interface LayoutType {
  window: {
    width: number;
    height: number;
  };
  isSmallDevice: boolean;
}

const Layout: LayoutType = {
  window: {
    width,
    height,
  },
  isSmallDevice: width < 375,
};

export default Layout;

// Also export individual values for convenience
export const windowWidth = width;
export const windowHeight = height;
export const isSmallDevice = width < 375;
