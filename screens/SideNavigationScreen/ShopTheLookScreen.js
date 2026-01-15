import React, { useEffect, useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    Text,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import CustomHeader from '../../components/header/CustomHeader.js'
import TwoColProducts from '../../components/sliders/TwoColSlide';
import Colors from '../../constants/Colors';
import { getProducts } from '../../constants/SanityClient';

const ShopTheLookScreen = ({ navigation, route }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const { data, error } = await getProducts();
            if (error) throw new Error(error);
            
            // Filter for specific categories and transform
            const filteredProducts = data
                .filter(p => ['Perfumes', 'Watches', 'Interior Decor'].includes(p.category?.name))
                .slice(0, 6)
                .map(product => ({
                    _id: product._id,
                    id: product._id,
                    title: product.title,
                    price: `${product.price} QAR`,
                    numericPrice: product.price,
                    uri: product.image,
                    image: product.image,
                    images: product.images || [],
                    productImage: product.image,
                    category: product.category,
                    description: product.description,
                    inStock: product.inStock,
                }));
            
            setProducts(filteredProducts);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

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

    const style = {
        thumbnailStyle: {
            height: '100%',
            width: '100%'
        },
        buttonStyle:{
            width: 140,
            paddingLeft: 8,
            marginLeft: 10,
            borderRadius: 5
        },
        containerStyle:{
            height: 120,
            width: 140,
        }
    };

    if (loading) {
        return (
            <CustomHeader navigation={navigation}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading...</Text>
                </View>
            </CustomHeader>
        );
    }

    return (
        <CustomHeader navigation={navigation}>
            <View style={{flex:1}}>
                <View style={styles.paymentText}>
                    <Text
                    style={{justifyContent: 'flex-start',
                     fontWeight: "bold",
                     fontSize:20,
                     paddingLeft: 10,
                     marginLeft: 10,}}>
                        Shop the look
                    </Text>
                </View>
                <View style={{flex:0.8 }}>
                    <TwoColProducts navigation={navigation} data={products} home={'shop'} />
                </View>
            </View>
        </CustomHeader>

    );
};
export default ShopTheLookScreen;

ShopTheLookScreen.navigationOptions = {
    header: null,
};



const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        color: Colors.primary,
        fontSize: 16,
    },
    textStyle: {
        color: Colors.primary,
        fontWeight:'bold',
        fontSize:20
    },
    paymentText:{
        flex: 0.06,
        marginTop: '2%',
        marginLeft: '2%',
    },
});

