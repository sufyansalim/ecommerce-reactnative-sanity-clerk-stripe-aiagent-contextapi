import React, { useEffect, useCallback, useState } from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    Text,
    ActivityIndicator,
} from 'react-native';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';

import CustomHeader from '../../components/header/CustomHeader';
import TwoColProducts from '../../components/sliders/TwoColSlide';
import Colors from '../../constants/Colors';
import { getProducts } from '../../constants/SanityClient';
import { Product } from '../../types';
import { HomeStackParamList } from '../../types/navigation';

interface TransformedProduct extends Product {
  id: string;
  numericPrice: number;
  uri: string;
  productImage: string;
}

interface ShopTheLookScreenProps {
  navigation: NavigationProp<any>;
}

const ShopTheLookScreen: React.FC<ShopTheLookScreenProps> = ({ navigation }) => {
    const [products, setProducts] = useState<TransformedProduct[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async (): Promise<void> => {
        try {
            const { data, error } = await getProducts();
            if (error) throw new Error(error);
            
            // Filter for specific categories and transform
            const filteredProducts: TransformedProduct[] = data
                .filter((p: any) => ['Perfumes', 'Watches', 'Interior Decor'].includes(p.category?.name))
                .slice(0, 6)
                .map((product: any) => ({
                    _id: product._id,
                    id: product._id,
                    title: product.title,
                    price: product.price,
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
            const onBackPress = (): boolean => {
                navigation.goBack();
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [navigation])
    );

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
            <View style={{flex: 1}}>
                <View style={styles.paymentText}>
                    <Text
                    style={{justifyContent: 'flex-start',
                     fontWeight: "bold",
                     fontSize: 20,
                     paddingLeft: 10,
                     marginLeft: 10}}>
                        Shop the look
                    </Text>
                </View>
                <View style={{flex: 0.8}}>
                    <TwoColProducts navigation={navigation} data={products} home={true} />
                </View>
            </View>
        </CustomHeader>
    );
};

export default ShopTheLookScreen;

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
        fontWeight: 'bold',
        fontSize: 20
    },
    paymentText: {
        flex: 0.06,
        marginTop: '2%',
        marginLeft: '2%',
    },
});
