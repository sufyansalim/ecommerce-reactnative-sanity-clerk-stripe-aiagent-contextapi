import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import Colors from '../constants/Colors';

interface EmptyListViewProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title?: string;
  message?: string;
  showActions?: boolean;
  primaryButtonText?: string;
  primaryButtonRoute?: string;
  secondaryButtonText?: string;
  onSecondaryPress?: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

const EmptyListView: React.FC<EmptyListViewProps> = ({ 
  icon = 'bag-outline', 
  title = 'Nothing here yet', 
  message = 'Start exploring to add items!',
  showActions = true,
  primaryButtonText,
  primaryButtonRoute = 'HomeStack',
  secondaryButtonText = 'Go Back',
  onSecondaryPress,
  actionLabel,
  onAction,
}) => {
  const navigation = useNavigation<NavigationProp<any>>();
  
  const buttonText = actionLabel || primaryButtonText || 'Explore';
  
  const handlePrimaryPress = () => {
    if (onAction) {
      onAction();
    } else {
      const tabScreens = ['HomeStack', 'BrandsStack', 'CelebritiesStack', 'CategoriesStack', 'CartStack'];
      if (tabScreens.includes(primaryButtonRoute)) {
        navigation.navigate('Main', { screen: primaryButtonRoute });
      } else {
        navigation.navigate(primaryButtonRoute as never);
      }
    }
  };
  
  const handleSecondaryPress = () => {
    if (onSecondaryPress) {
      onSecondaryPress();
    } else if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Ionicons name={icon} size={80} color={Colors.iconMuted} />
      <Text style={styles.title}>{title}</Text>
      {message && <Text style={styles.message}>{message}</Text>}
      
      {showActions && (
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={handlePrimaryPress}
          >
            <Text style={styles.primaryButtonText}>{buttonText}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={handleSecondaryPress}
          >
            <Text style={styles.secondaryButtonText}>{secondaryButtonText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingVertical: 60,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.textSecondary,
    marginTop: 20,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    color: Colors.textMuted,
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
    minWidth: 180,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  secondaryButtonText: {
    color: Colors.success,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EmptyListView;
