import React, { useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    Image,
    BackHandler,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import CustomHeader from "../../components/header/CustomHeader";
import ConfirmModal from "../../components/ConfirmModal";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useWishlistState, useWishlistDispatch, removeFromWishlist } from '../../context';
import Colors from '../../constants/Colors';

const WishlistScreen = ({ navigation: propsNavigation }) => {
    const navigation = useNavigation();
    const { wishlist } = useWishlistState();
    const dispatch = useWishlistDispatch();
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                navigation.goBack();
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [navigation])
    );

    const handleRemove = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const confirmRemove = () => {
        if (selectedItem) {
            removeFromWishlist(dispatch, selectedItem.id);
        }
        setModalVisible(false);
        setSelectedItem(null);
    };

    const cancelRemove = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };

    // Empty wishlist view
    if (!wishlist || wishlist.length === 0) {
        return (
            <CustomHeader navigation={propsNavigation}>
                <View style={styles.checkoutText}>
                    <Text style={{justifyContent: 'flex-start', fontWeight: "bold"}}>
                        WISHLIST
                    </Text>
                </View>
                <View style={styles.detailsContainer}>
                    <Image style={styles.imageContainer} source={require('../../assets/images/wishlist.png')}/>
                </View>
                <View>
                    <Text style={{alignSelf:'center',fontWeight: "bold", marginTop: '4%' }} >
                        Your Wish list is empty!
                    </Text>
                </View>
                <View style={{flex:0.15,justifyContent:'center', alignItems: 'center', marginTop: '6%' }}>
                    <TouchableOpacity 
                        style={StyleSheet.flatten(styles.WishList)}
                        onPress={() => navigation.goBack()}
                    >
                        <Text style={{color: Colors.textWhite, textAlign: 'center', paddingVertical: 10}}>Explore and Add</Text>
                    </TouchableOpacity>
                </View>
            </CustomHeader>
        );
    }

    // Wishlist with items
    return (
        <CustomHeader navigation={propsNavigation}>
            <View style={styles.checkoutText}>
                <Text style={{justifyContent: 'flex-start', fontWeight: "bold"}}>
                    WISHLIST ({wishlist.length} items)
                </Text>
            </View>
            <ScrollView style={{ flex: 1 }}>
                {wishlist.map((item, index) => (
                    <View key={item.id || index} style={styles.itemCard}>
                        <View style={styles.itemRow}>
                            <Image 
                                style={styles.itemImage} 
                                source={{ uri: item.productImage }} 
                                resizeMode="contain"
                            />
                            <View style={styles.itemDetails}>
                                <Text style={styles.itemTitle} numberOfLines={2}>
                                    {item.title}
                                </Text>
                                <Text style={styles.itemCategory}>
                                    {item.categories?.[0] || 'Product'}
                                </Text>
                                <Text style={styles.itemPrice}>
                                    {item.price}
                                </Text>
                            </View>
                            <TouchableOpacity 
                                style={styles.removeButton}
                                onPress={() => handleRemove(item)}
                            >
                                <Ionicons name="trash-outline" size={22} color={Colors.error} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity 
                            style={styles.viewButton}
                            onPress={() => navigation.navigate('ProductDetail', { product: item })}
                        >
                            <Text style={{ color: Colors.textWhite, fontSize: 12 }}>View Product</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>
            <ConfirmModal
                visible={modalVisible}
                title="Remove from Wishlist"
                message={`Remove ${selectedItem?.title || 'this item'} from your wishlist?`}
                onCancel={cancelRemove}
                onConfirm={confirmRemove}
                cancelText="CANCEL"
                confirmText="REMOVE"
                confirmDestructive={true}
            />
        </CustomHeader>
    );
};

export default WishlistScreen;

WishlistScreen.navigationOptions = {
    header: null,
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop:10,
        paddingTop:10
    },
    header:{
        backgroundColor: Colors.primary,
    },
    fontStyle: {
        fontSize: 26,
        color: Colors.textWhite
    },
    checkoutText:{
        flex: 0.08,
        marginTop: 7,
        marginLeft: 9,
        marginRight: 9
    },
    WishList: {
        width: '70%',
        alignSelf: 'center',
        borderRadius:5,
        backgroundColor: Colors.primary
    },
    detailsContainer:{
        flex: 0.4,
        justifyContent:'flex-start',
    },
    imageContainer:{
        flex: 0.9,
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
        alignSelf:'center',
    },
    itemCard: {
        backgroundColor: Colors.background,
        marginHorizontal: 10,
        marginVertical: 5,
        padding: 10,
        borderRadius: 8,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    itemImage: {
        width: 80,
        height: 80,
        backgroundColor: Colors.backgroundLight,
        borderRadius: 5,
    },
    itemDetails: {
        flex: 1,
        marginLeft: 10,
    },
    itemTitle: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    itemCategory: {
        fontSize: 11,
        color: Colors.textMuted,
        marginTop: 2,
    },
    itemPrice: {
        fontSize: 14,
        fontWeight: 'bold',
        marginTop: 4,
    },
    removeButton: {
        padding: 10,
    },
    viewButton: {
        backgroundColor: Colors.primary,
        paddingVertical: 8,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
});

