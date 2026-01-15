import React from 'react';
import { View, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

/**
 * A reusable card-like surface component with elevation and consistent styling.
 * Based on Material Design surface pattern.
 * 
 * @param {React.ReactNode} children - Content to render inside the surface
 * @param {object} style - Additional styles to apply
 * @param {number} elevation - Shadow elevation level (0-3), default 1
 * @param {number} padding - Padding inside the surface, default 20
 * @param {number} margin - Horizontal margin, default 16
 * @param {number} marginTop - Top margin, default 16
 * @param {number} borderRadius - Border radius, default 12
 */
const Surface = ({ 
    children, 
    style, 
    elevation = 1,
    padding = 20,
    margin = 16,
    marginTop = 16,
    borderRadius = 12,
}) => {
    const elevationStyles = {
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
