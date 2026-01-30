import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  ScrollView,
  View,
  BackHandler,
  TouchableOpacity,
  Alert
} from "react-native";
import { NavigationProp } from '@react-navigation/native';

import LoadingScreen from '../components/LoadingScreen';
import EmptyListView from '../components/EmptyListView';
import CartCard from '../components/sliders/CartCard';
import CustomHeader from "../components/header/CustomHeader";
import Colors from "../constants/Colors";
import { useCart, useAuth } from '../store';
import { CartStackParamList } from '../types/navigation';

interface CartProps {
  navigation: NavigationProp<any>;
}

const Cart: React.FC<CartProps> = ({ navigation }) => {
  const { cart, removeFromCart } = useCart();
  const { isSignedIn } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      return true;
    });

    return () => {
      clearTimeout(timer);
      backHandler.remove();
    };
  }, []);

  const handleCheckout = (): void => {
    if (isSignedIn) {
      // User is signed in, proceed to checkout
      navigation.navigate('Checkout' as never);
    } else {
      // User is not signed in, show alert and redirect to sign in
      Alert.alert(
        'Sign In Required',
        'Please sign in to proceed with checkout',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Sign In',
            onPress: () => navigation.navigate('AuthSignin', { returnToCheckout: true } as any),
          },
        ]
      );
    }
  };

  return (
    <CustomHeader navigation={navigation}>
       {loading ? 
         <LoadingScreen message="Loading your cart..." />   : 
        <ScrollView>
          <View
            style={{
              flex: 0.05,
              flexBasis: "auto",
              alignItems: "flex-start",
              justifyContent: "center",
              paddingLeft: 10,
              marginLeft: 10,
              paddingTop: 5,
              marginTop: 5,
              marginBottom: 5,
              paddingBottom: 5,
            }}>
                <Text style={styles.textStyle}>
                  My Cart
                </Text>
          </View>
          {cart && cart.length > 0 ? (<>
            <View style={{flex: 0.8}}>
                  <CartCard 
                    navigation={navigation} 
                    data={cart} 
                    delete={(productId: string) => {
                      removeFromCart(productId);
                    }}
                  />
              </View>
            <View>
                <TouchableOpacity 
                  style={{
                    width: "95%", 
                    alignSelf: "center", 
                    borderRadius: 5, 
                    backgroundColor: Colors.primary, 
                    paddingVertical: 15, 
                    alignItems: 'center'
                  }} 
                  onPress={handleCheckout}
                >
                    <Text style={{color: Colors.textWhite}}>CHECK OUT</Text>
                </TouchableOpacity>
            </View>
            </>) : (
              <EmptyListView 
                icon="cart-outline" 
                title="Your cart is empty" 
                message="Browse our products and add items to your cart"
              />
            )
            }
        </ScrollView>}
    </CustomHeader>
  );
};

export default Cart;

const styles = StyleSheet.create({
  textStyle: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "Roboto"
  },
  checkoutText: {
    flex: 0.08,
    marginTop: 7,
    marginLeft: 9,
    marginRight: 9
  },
  detailsContainer: {
    flex: 0.4,
    justifyContent: 'flex-start',
  },
  imageContainer: {
    flex: 0.9,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
