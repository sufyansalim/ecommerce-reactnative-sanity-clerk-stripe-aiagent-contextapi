import React from 'react';
import { ScrollView, StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../../constants/Colors';

const CartCard = (props) => {
  const { data, navigation, status } = props;
  
  if (!data || data.length === 0) {
    return null;
  }
  
  return (
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
              <Text style={styles.cardText}>&#x631;&#x642; {slide.price}</Text>
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
              <TouchableOpacity style={styles.wishlistButton}>
                <Ionicons name='heart-outline' size={18} style={{ marginLeft: 5, paddingLeft: 5, marginRight: 0, paddingRight: 0, color: Colors.textWhite }} />
                <Text style={{ color: Colors.textWhite, fontSize: 12, marginRight: 5, paddingRight: 5 }}>Add to WishList</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
      <View style={styles.totalCard}>
        <Text style={{ fontSize: 10, paddingRight: 5, marginRight: 5, }}>Items({data.length})</Text>
        <Text style={{ fontSize: 10, paddingRight: 5, marginRight: 5, }}>Free Shipping</Text>
        <Text style={[styles.cardText, { paddingRight: 5, marginRight: 5, }]}>Total: {data.map(item => parseFloat(item.price || 0)).reduce((a, b) => a + b, 0)} QAR</Text>
      </View>
    </ScrollView>
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
});