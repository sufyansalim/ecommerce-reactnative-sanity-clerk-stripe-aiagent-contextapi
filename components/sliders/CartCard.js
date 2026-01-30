import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';
import { useWishlistState, useWishlistDispatch, useCartDispatch } from '../../context';
import { addToWishlist, removeFromWishlist, updateCartQuantity } from '../../actions';
import InfoModal from '../InfoModal';

const CartCard = (props) => {
  const { data, navigation, status } = props;
  
  // Wishlist functionality
  const { wishlist } = useWishlistState();
  const wishlistDispatch = useWishlistDispatch();
  const cartDispatch = useCartDispatch();
  const [modalVisible, setModalVisible] = useState(false);
  const [addedProduct, setAddedProduct] = useState(null);
  const [modalAction, setModalAction] = useState(''); // 'added' or 'removed'
  
  const isInWishlist = (product) => {
    const productId = product.id || product._id;
    return wishlist?.some(item => {
      const itemId = item.id || item._id;
      return itemId === productId;
    });
  };
  
  const handleToggleWishlist = (product) => {
    if (isInWishlist(product)) {
      // Remove from wishlist
      const productId = product.id || product._id;
      removeFromWishlist(wishlistDispatch, productId);
      setAddedProduct(product);
      setModalAction('removed');
      setModalVisible(true);
    } else {
      // Add to wishlist
      addToWishlist(wishlistDispatch, product);
      setAddedProduct(product);
      setModalAction('added');
      setModalVisible(true);
    }
  };
  
  const handleCloseModal = () => {
    setModalVisible(false);
    setAddedProduct(null);
    setModalAction('');
  };
  
  const handleQuantityIncrease = (index) => {
    const currentQuantity = data[index].quantity || 1;
    updateCartQuantity(cartDispatch, index, currentQuantity + 1);
  };
  
  const handleQuantityDecrease = (index) => {
    const currentQuantity = data[index].quantity || 1;
    if (currentQuantity > 1) {
      updateCartQuantity(cartDispatch, index, currentQuantity - 1);
    }
  };
  
  if (!data || data.length === 0) {
    return null;
  }
  
  return (
    <>
      <ScrollView>
      {data.map((slide, index) => (
        <View key={`${index} * ${Math.random() * 100} -${slide.id}`} style={styles.card}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around', marginTop: 15, paddingTop: 15, }}>
            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center', }}>
              <View style={{ backgroundColor: Colors.background, }}>
                <Image resizeMode='cover' style={{ height: 100, width: 100 }} source={{ uri: slide.productImage }} />
              </View>
            </View>
            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start', }}>
              <Text style={[styles.cardText, { paddingRight: 5, marginRight: 5 }]}>{slide.title}</Text>
              <Text style={{ fontSize: 10, paddingLeft: 15, marginLeft: 15 }}>{(slide.description || '').replace(/(<([^>]+)>)/ig, '')}</Text>
              <Text style={styles.cardText}>{slide.price}</Text>
              
              {/* Quantity Controls */}
              <View style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center', marginTop: 8, paddingLeft: 15 }}>
                <Text style={{ fontSize: 10, marginRight: 8 }}>Quantity:</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityDecrease(index)}
                  disabled={(slide.quantity || 1) <= 1}
                >
                  <Ionicons name="remove" size={16} color={Colors.primary} />
                </TouchableOpacity>
                <Text style={styles.quantityText}>{slide.quantity || 1}</Text>
                <TouchableOpacity 
                  style={styles.quantityButton}
                  onPress={() => handleQuantityIncrease(index)}
                >
                  <Ionicons name="add" size={16} color={Colors.primary} />
                </TouchableOpacity>
              </View>
              
              {status && <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 5, paddingTop: 5, }}>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 10 }}>STATUS:</Text>
                </View>
                <View style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start' }}>
                  <Text style={{ fontSize: 10, color: Colors.success, paddingLeft: 5 }}>PACKED</Text>
                </View>
              </View>}
              {status && <View style={{ justifyContent: 'center', alignItems: 'flex-start' }}>
                <Text style={{ fontSize: 10, }}>Delivery Within 2 Working Days</Text>
              </View>}
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', marginTop: 15, paddingTop: 15, marginBottom: 15, paddingBottom: 15, }}>
            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => { props.delete(index) }}>
                <Ionicons style={{ color: Colors.primary }} name='close' size={18} />
                <Text style={{ color: Colors.primary, fontSize: 12, marginRight: 5 }}>Remove</Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity 
                style={styles.wishlistButton}
                onPress={() => handleToggleWishlist(slide)}
              >
                <Ionicons 
                  name={isInWishlist(slide) ? 'heart' : 'heart-outline'} 
                  size={18} 
                  style={{ 
                    marginLeft: 5, 
                    paddingLeft: 5, 
                    marginRight: 0, 
                    paddingRight: 0, 
                    color: isInWishlist(slide) ? Colors.error : Colors.textWhite 
                  }} 
                />
                <Text style={{ 
                  color: Colors.textWhite, 
                  fontSize: 12, 
                  marginRight: 5, 
                  paddingRight: 5 
                }}>
                  {isInWishlist(slide) ? 'Remove from WishList' : 'Add to WishList'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.totalCard}>
        <Text style={{ fontSize: 10, paddingRight: 5, marginRight: 5, }}>Items({data.reduce((total, item) => total + (item.quantity || 1), 0)})</Text>
        <Text style={{ fontSize: 10, paddingRight: 5, marginRight: 5, }}>Free Shipping</Text>
        <Text style={[styles.cardText, { paddingRight: 5, marginRight: 5, }]}>Total: ${data.map(item => parseFloat(item.numericPrice || item.price || 0) * (item.quantity || 1)).reduce((a, b) => a + b, 0)}</Text>
      </View>
    </ScrollView>
    
    <InfoModal
      visible={modalVisible}
      title={modalAction === 'added' ? "Added to Wishlist" : "Removed from Wishlist"}
      message={modalAction === 'added' 
        ? `${addedProduct?.title || 'Item'} has been added to your wishlist!`
        : `${addedProduct?.title || 'Item'} has been removed from your wishlist!`
      }
      onClose={handleCloseModal}
      type="success"
    />
    </>
  );
};

export default CartCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    marginVertical: 4,
    marginHorizontal: 8,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  totalCard: {
    flex: 0.5,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginTop: 5,
    paddingTop: 5,
    marginBottom: 15,
    paddingBottom: 15,
    backgroundColor: Colors.backgroundGray,
    borderRadius: 4,
    marginHorizontal: 8,
    paddingRight: 10,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  wishlistButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
  },
  removeButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    width: 100,
    paddingVertical: 8,
    borderRadius: 4,
  },
  cardText: {
    fontSize: 12,
    fontWeight: "bold",
    alignItems: "flex-start",
    paddingLeft: 15,
    marginLeft: 15,
  },
  quantityButton: {
    backgroundColor: Colors.background,
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 10,
    minWidth: 25,
    textAlign: 'center',
  },
});