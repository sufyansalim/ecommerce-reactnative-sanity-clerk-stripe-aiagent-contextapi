import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

import CustomHeader from '../../components/header/CustomHeader';
import Surface from '../../components/Surface';
import Colors from '../../constants/Colors';
import { useCartState, useCartDispatch, clearCart, useAuth } from '../../context';
import { createCheckoutSession } from '../../services/checkoutService';

const CheckoutScreen = ({ navigation }) => {
  const { cart } = useCartState();
  const dispatch = useCartDispatch();
  const { user, isSignedIn } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const pendingSessionRef = useRef(null);
  const initialCartLength = useRef(cart?.length || 0);

  // Calculate cart totals
  const subtotal = cart.reduce((sum, item) => {
    // Handle both numeric price and string price (e.g., "950 QAR")
    let price = item.numericPrice || item.price || 0;
    if (typeof price === 'string') {
      price = parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
    }
    const quantity = item.quantity || 1;
    return sum + (price * quantity);
  }, 0);

  const shippingCost = 0; // Free shipping, handled by Stripe
  const total = subtotal + shippingCost;

  // Handle deep link callback from Stripe
  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = event.url;
      if (url.includes('checkout/success') && pendingSessionRef.current) {
        // Payment succeeded - clear cart and navigate to thank you
        clearCart(dispatch);
        navigation.replace('Thankyou', {
          sessionId: pendingSessionRef.current.sessionId,
          orderNumber: pendingSessionRef.current.orderNumber,
        });
        pendingSessionRef.current = null;
      } else if (url.includes('checkout/cancel')) {
        // User cancelled - stay on checkout screen
        pendingSessionRef.current = null;
        setIsProcessing(false);
      }
    };

    const subscription = Linking.addEventListener('url', handleDeepLink);
    return () => subscription.remove();
  }, [dispatch, navigation]);

  // Redirect to login if not signed in
  useEffect(() => {
    if (!isSignedIn) {
      Alert.alert(
        'Sign In Required',
        'Please sign in to proceed with checkout',
        [
          { text: 'Cancel', onPress: () => navigation.goBack() },
          { text: 'Sign In', onPress: () => navigation.navigate('AuthSignin', { returnToCheckout: true }) },
        ]
      );
    }
  }, [isSignedIn]);

  // Only redirect to cart if cart was empty when screen loaded (not after checkout)
  useEffect(() => {
    if (initialCartLength.current === 0 && (!cart || cart.length === 0)) {
      navigation.replace('Main', { screen: 'CartStack' });
    }
  }, []);

  const handleCheckout = async () => {
    if (!user) {
      Alert.alert('Error', 'Please sign in to continue');
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createCheckoutSession({
        userId: user.id,
        userEmail: user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress,
        userName: user.fullName || user.firstName || 'Customer',
        cartItems: cart,
        total,
      });

      if (result.success) {
        // Store pending session info - DON'T navigate yet
        // Navigation will happen when deep link callback is received
        pendingSessionRef.current = {
          sessionId: result.sessionId,
          orderNumber: result.orderNumber,
        };
        
        // If user dismissed the browser (pressed back/cancel), handle it
        if (result.result?.type === 'cancel' || result.result?.type === 'dismiss') {
          pendingSessionRef.current = null;
          setIsProcessing(false);
          // Stay on checkout screen - user can try again
        }
        // If browser was closed after completing payment, 
        // the deep link handler will take care of navigation
      } else {
        Alert.alert(
          'Checkout Failed',
          result.error || 'Unable to process checkout. Please try again.',
          [{ text: 'OK' }]
        );
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      Alert.alert(
        'Error',
        'Something went wrong. Please try again.',
        [{ text: 'OK' }]
      );
      setIsProcessing(false);
    }
  };

  if (!isSignedIn || !cart || cart.length === 0) {
    return (
      <CustomHeader navigation={navigation}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      </CustomHeader>
    );
  }

  return (
    <CustomHeader navigation={navigation}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Order Summary Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Checkout</Text>
          <Text style={styles.itemCount}>{cart.length} item{cart.length !== 1 ? 's' : ''}</Text>
        </View>

        {/* Cart Items */}
        <Surface elevation={2} margin={12} padding={16}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          {cart.map((item, index) => {
            let itemPrice = item.numericPrice || item.price || 0;
            if (typeof itemPrice === 'string') {
              itemPrice = parseFloat(itemPrice.replace(/[^0-9.]/g, '')) || 0;
            }
            const imageUri = item.image || item.productImage || item.uri || item.images?.[0];
            return (
            <View key={item._id || index} style={styles.itemRow}>
              <Image 
                source={{ uri: imageUri }} 
                style={styles.itemImage}
                resizeMode="cover"
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={styles.itemQuantity}>Qty: {item.quantity || 1}</Text>
                <Text style={styles.itemPrice}>${itemPrice.toFixed(2)}</Text>
              </View>
            </View>
            );
          })}
        </Surface>

        {/* Payment Info Notice */}
        <Surface elevation={1} margin={12} padding={16}>
          <View style={styles.infoRow}>
            <Ionicons name="card-outline" size={24} color={Colors.primary} />
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Secure Payment</Text>
              <Text style={styles.infoDescription}>
                You'll be redirected to Stripe's secure checkout to enter your payment and shipping details.
              </Text>
            </View>
          </View>
        </Surface>

        {/* Order Totals */}
        <Surface elevation={2} margin={12} padding={16}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>${subtotal.toFixed(2)}</Text>
          </View>
          
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Shipping</Text>
            <Text style={[styles.totalValue, { color: Colors.success }]}>
              {shippingCost === 0 ? 'Calculated at checkout' : `$${shippingCost.toFixed(2)}`}
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.totalRow}>
            <Text style={styles.grandTotalLabel}>Total</Text>
            <Text style={styles.grandTotalValue}>${total.toFixed(2)}</Text>
          </View>
        </Surface>

        {/* Checkout Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.checkoutButton, isProcessing && styles.checkoutButtonDisabled]}
            onPress={handleCheckout}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator size="small" color={Colors.textWhite} />
            ) : (
              <>
                <Ionicons name="lock-closed" size={18} color={Colors.textWhite} />
                <Text style={styles.checkoutButtonText}>Pay with Stripe</Text>
              </>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
            disabled={isProcessing}
          >
            <Text style={styles.cancelButtonText}>Back to Cart</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </CustomHeader>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundGray,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: Colors.surface,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  itemCount: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 16,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: Colors.backgroundGray,
  },
  itemDetails: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  totalLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 14,
    color: Colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 12,
  },
  grandTotalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.onSurface,
  },
  grandTotalValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primary,
  },
  buttonContainer: {
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 8,
    gap: 8,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutButtonText: {
    color: Colors.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    marginTop: 8,
  },
  cancelButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
});

