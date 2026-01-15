import React from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Colors from '../constants/Colors';
import CustomHeader from '../components/header/CustomHeader';
import EmptyListView from '../components/EmptyListView';
import TwoColProducts from '../components/sliders/TwoColSlide';
import { useWishlistState } from '../context';

const WishList = (props) => {
    const navigation = useNavigation();
    const { wishlist } = useWishlistState();
    
    // Transform wishlist items for display
    const wishlistData = (wishlist || []).map(item => ({
        ...item,
        id: item.id || item._id,
        uri: item.uri || item.productImage || item.image,
        productImage: item.productImage || item.image || item.uri,
    }));
    
    return (
        <CustomHeader navigation={navigation}>
            <ScrollView>
                <View style={styles.headerSection}>
                    <Text style={styles.headerText}>My Wishlist</Text>
                    {wishlistData.length > 0 && (
                        <Text style={styles.countText}>{wishlistData.length} items</Text>
                    )}
                </View>
                
                {wishlistData.length > 0 ? (
                    <View style={styles.productsContainer}>
                        <TwoColProducts navigation={navigation} data={wishlistData} />
                    </View>
                ) : (
                    <EmptyListView 
                        icon="heart-outline" 
                        title="Your wishlist is empty" 
                        message="Save your favorite items to find them easily later"
                        showActions={true}
                        primaryButtonText="Start Shopping"
                        primaryButtonRoute="HomeStack"
                    />
                )}
            </ScrollView>
        </CustomHeader>
    );
};

WishList.navigationOptions = {
    header: null,
};

export default WishList;

const styles = StyleSheet.create({
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.textPrimary,
    },
    countText: {
        fontSize: 14,
        color: Colors.textMuted,
    },
    productsContainer: {
        flex: 1,
        paddingBottom: 20,
    },
});
