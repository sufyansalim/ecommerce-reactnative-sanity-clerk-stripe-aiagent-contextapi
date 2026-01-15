import React, { useCallback, useState, useEffect } from "react";
import {
    StyleSheet,
    Text,
    View,
    BackHandler,
    ScrollView,
    Image,
    ActivityIndicator,
    RefreshControl,
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import CustomHeader from "../../components/header/CustomHeader.js";
import Surface from "../../components/Surface";
import EmptyListView from "../../components/EmptyListView";
import Colors from "../../constants/Colors";
import { useAuth } from "../../context";
import { sanityClient } from "../../constants/SanityClient";
import { GET_ORDERS_BY_USER } from "../../constants/SanityQueries";

const MyOrderScreen = ({ navigation }) => {
    const { user, isSignedIn } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Fetch orders from Sanity
    const fetchOrders = async () => {
        if (!isSignedIn || !user?.id) {
            setOrders([]);
            setLoading(false);
            return;
        }

        try {
            setError(null);
            const result = await sanityClient.fetch(GET_ORDERS_BY_USER, { userId: user.id });
            setOrders(result || []);
        } catch (err) {
            console.error('Error fetching orders:', err);
            setError('Failed to load orders. Please try again.');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Fetch orders on mount and when user changes
    useEffect(() => {
        fetchOrders();
    }, [user?.id, isSignedIn]);

    // Refresh on screen focus
    useFocusEffect(
        useCallback(() => {
            fetchOrders();
            
            const onBackPress = () => {
                navigation.goBack();
                return true;
            };
            const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => subscription.remove();
        }, [navigation, user?.id])
    );

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchOrders();
    }, [user?.id]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return Colors.success;
            case 'shipped':
            case 'processing':
                return Colors.info;
            case 'paid':
                return Colors.primary;
            case 'cancelled':
            case 'refunded':
                return Colors.error;
            default:
                return Colors.textSecondary;
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'delivered':
                return 'checkmark-circle';
            case 'shipped':
                return 'car';
            case 'processing':
            case 'paid':
                return 'time';
            case 'cancelled':
            case 'refunded':
                return 'close-circle';
            default:
                return 'ellipse';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const formatCurrency = (amount, currency = 'usd') => {
        const currencySymbols = {
            usd: '$',
            qar: 'QAR ',
            aed: 'AED ',
        };
        const symbol = currencySymbols[currency?.toLowerCase()] || '$';
        return `${symbol}${(amount || 0).toFixed(2)}`;
    };

    const formatStatus = (status) => {
        if (!status) return 'Unknown';
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    // Show sign in prompt if not authenticated
    if (!isSignedIn) {
        return (
            <CustomHeader navigation={navigation}>
                <EmptyListView
                    icon="log-in-outline"
                    title="Sign In Required"
                    message="Please sign in to view your orders"
                    actionLabel="Sign In"
                    onAction={() => navigation.navigate('AuthSignin')}
                />
            </CustomHeader>
        );
    }

    // Show loading state
    if (loading) {
        return (
            <CustomHeader navigation={navigation}>
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading your orders...</Text>
                </View>
            </CustomHeader>
        );
    }

    // Show error state
    if (error) {
        return (
            <CustomHeader navigation={navigation}>
                <EmptyListView
                    icon="alert-circle-outline"
                    title="Something went wrong"
                    message={error}
                    actionLabel="Try Again"
                    onAction={fetchOrders}
                />
            </CustomHeader>
        );
    }

    // Show empty state
    if (orders.length === 0) {
        return (
            <CustomHeader navigation={navigation}>
                <EmptyListView
                    icon="receipt-outline"
                    title="No orders yet"
                    message="Start shopping to see your orders here"
                    actionLabel="Shop Now"
                    onAction={() => navigation.navigate('Main', { screen: 'HomeStack' })}
                />
            </CustomHeader>
        );
    }

    return (
        <CustomHeader navigation={navigation}>
            <ScrollView 
                style={styles.container} 
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={[Colors.primary]}
                    />
                }
            >
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>My Orders</Text>
                    <Text style={styles.orderCount}>{orders.length} order{orders.length !== 1 ? 's' : ''}</Text>
                </View>

                {orders.map((order) => (
                    <Surface key={order._id} elevation={2} margin={12} marginTop={12} padding={16}>
                        {/* Order Header */}
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={styles.orderId}>{order.orderNumber || order._id}</Text>
                                <Text style={styles.orderDate}>{formatDate(order.createdAt)}</Text>
                            </View>
                            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) }]}>
                                <Ionicons name={getStatusIcon(order.status)} size={14} color={Colors.surface} />
                                <Text style={[styles.statusText, { color: Colors.surface }]}>
                                    {formatStatus(order.status)}
                                </Text>
                            </View>
                        </View>

                        {/* Order Items */}
                        {order.lineItems?.map((item, index) => (
                            <View key={item._key || index} style={styles.itemRow}>
                                <Image 
                                    source={{ uri: item.image }} 
                                    style={styles.itemImage} 
                                    resizeMode="cover"
                                />
                                <View style={styles.itemDetails}>
                                    <Text style={styles.itemTitle} numberOfLines={2}>{item.title}</Text>
                                    <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                                    <Text style={styles.itemPrice}>
                                        {formatCurrency(item.price, order.currency)}
                                    </Text>
                                </View>
                            </View>
                        ))}

                        {/* Order Footer */}
                        <View style={styles.orderFooter}>
                            {order.shippingAddress && (
                                <View style={styles.deliveryInfo}>
                                    <Ionicons name="location-outline" size={14} color={Colors.textSecondary} />
                                    <Text style={styles.deliveryText} numberOfLines={2}>
                                        {[
                                            order.shippingAddress.line1,
                                            order.shippingAddress.city,
                                            order.shippingAddress.country
                                        ].filter(Boolean).join(', ')}
                                    </Text>
                                </View>
                            )}
                            
                            {order.trackingNumber && (
                                <View style={styles.deliveryInfo}>
                                    <Ionicons name="locate-outline" size={14} color={Colors.info} />
                                    <Text style={[styles.deliveryText, { color: Colors.info }]}>
                                        Tracking: {order.trackingNumber}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={styles.totalRow}>
                                <Text style={styles.totalLabel}>Total</Text>
                                <Text style={styles.totalAmount}>
                                    {formatCurrency(order.total, order.currency)}
                                </Text>
                            </View>
                        </View>
                    </Surface>
                ))}

                <View style={{ height: 30 }} />
            </ScrollView>
        </CustomHeader>
    );
};

export default MyOrderScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundGray,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.backgroundGray,
    },
    loadingText: {
        marginTop: 12,
        fontSize: 14,
        color: Colors.textSecondary,
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
        fontWeight: "bold",
        color: Colors.onSurface,
    },
    orderCount: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    orderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    orderId: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.onSurface,
    },
    orderDate: {
        fontSize: 12,
        color: Colors.textSecondary,
        marginTop: 4,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 16,
        gap: 4,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    itemRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    itemImage: {
        width: 70,
        height: 70,
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
        fontWeight: '600',
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
    orderFooter: {
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
    },
    deliveryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
        gap: 6,
    },
    deliveryText: {
        fontSize: 12,
        color: Colors.textSecondary,
        flex: 1,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
    },
    totalLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
    },
    totalAmount: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.onSurface,
    },
});
