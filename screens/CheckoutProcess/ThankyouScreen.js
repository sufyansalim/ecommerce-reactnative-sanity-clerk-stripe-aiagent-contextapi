import React, { useCallback } from 'react';
import {
    StyleSheet,
    View,
    BackHandler,
    Text,
    TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import CustomHeader from "../../components/header/CustomHeader";
import Surface from "../../components/Surface";
import Colors from '../../constants/Colors';

const ThankyouScreen = ({ navigation, route }) => {
    const { orderNumber, sessionId } = route.params || {};

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                // Go to home instead of back to checkout
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'Main' }],
                });
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [navigation])
    );

    const goToHome = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
    };

    const goToOrders = () => {
        navigation.reset({
            index: 0,
            routes: [
                { name: 'Main' },
                { name: 'MyOrderScreen' }
            ],
        });
    };

    return (
        <CustomHeader navigation={navigation}>
            <View style={styles.container}>
                <Surface elevation={3} margin={20} padding={30}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="checkmark" size={50} color={Colors.surface} />
                        </View>
                    </View>

                    {/* Thank You Message */}
                    <Text style={styles.thankYouText}>Thank You!</Text>
                    <Text style={styles.subtitleText}>Your order has been placed</Text>

                    {/* Order Details */}
                    {orderNumber && (
                        <View style={styles.orderInfo}>
                            <Text style={styles.orderLabel}>Order Number</Text>
                            <Text style={styles.orderNumber}>{orderNumber}</Text>
                        </View>
                    )}

                    {/* Confirmation Note */}
                    <View style={styles.noteContainer}>
                        <Ionicons name="mail-outline" size={20} color={Colors.textSecondary} />
                        <Text style={styles.noteText}>
                            You will receive a confirmation email with your order details shortly.
                        </Text>
                    </View>

                    {/* Action Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.primaryButton} onPress={goToOrders}>
                            <Ionicons name="receipt-outline" size={18} color={Colors.textWhite} />
                            <Text style={styles.primaryButtonText}>View My Orders</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.secondaryButton} onPress={goToHome}>
                            <Text style={styles.secondaryButtonText}>Continue Shopping</Text>
                        </TouchableOpacity>
                    </View>
                </Surface>
            </View>
        </CustomHeader>
    );
};

export default ThankyouScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundGray,
        justifyContent: 'center',
    },
    iconContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: Colors.success,
        justifyContent: 'center',
        alignItems: 'center',
    },
    thankYouText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.success,
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitleText: {
        fontSize: 16,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 24,
    },
    orderInfo: {
        backgroundColor: Colors.backgroundGray,
        padding: 16,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    orderLabel: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    orderNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.onSurface,
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: Colors.backgroundGray,
        padding: 12,
        borderRadius: 8,
        marginBottom: 24,
        gap: 10,
    },
    noteText: {
        flex: 1,
        fontSize: 13,
        color: Colors.textSecondary,
        lineHeight: 18,
    },
    buttonContainer: {
        gap: 12,
    },
    primaryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 14,
        borderRadius: 8,
        gap: 8,
    },
    primaryButtonText: {
        color: Colors.textWhite,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
    },
    secondaryButtonText: {
        color: Colors.textSecondary,
        fontSize: 14,
    },
});
