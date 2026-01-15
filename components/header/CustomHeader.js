import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useWishlistState } from '../../context';
import Colors from '../../constants/Colors';

export default function CustomHeader({ navigation: navProp, children }) {
  const navHook = useNavigation();
  const navigation = navProp || navHook;
  const { navigate, goBack } = navigation;
  const route = useRoute();
  const isSideNavigation = route?.name === 'SideNavigation';
  const { wishlist } = useWishlistState();
  const hasWishlistItems = wishlist.length > 0;
  
  const handleMenuPress = () => {
    if (isSideNavigation) {
      goBack();
    } else {
      navigate('SideNavigation');
    }
  };
  
  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <View style={styles.left}>
          <TouchableOpacity onPress={handleMenuPress}>
            <Ionicons name={isSideNavigation ? 'close' : 'menu'} size={26} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>
        <View style={styles.body}>
          <Text style={styles.title}>Dokkani.co</Text>
        </View>
        <View style={styles.right}>
          <TouchableOpacity onPress={() => navigate('WishlistScreen')} style={styles.iconButton}>
            <Ionicons 
              name={hasWishlistItems ? 'heart' : 'heart-outline'} 
              size={26} 
              color={hasWishlistItems ? Colors.wishlistActive : Colors.textWhite} 
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Search')} style={styles.iconButton}>
            <Ionicons name='search' size={26} color={Colors.textWhite} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 10,
  },
  left: {
    flex: 1,
  },
  body: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  right: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    color: Colors.textWhite,
    fontWeight: 'bold',
    fontSize: 24,
  },
  iconButton: {
    paddingHorizontal: 8,
  },
  content: {
    flex: 1,
    
  },
  contentContainer: {
    flexGrow: 1,
    height: '100%',
  
    
  },
});

