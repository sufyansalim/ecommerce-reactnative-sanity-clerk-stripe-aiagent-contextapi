import React, { useCallback, useState } from 'react';
import { 
    StyleSheet, 
    View, 
    ScrollView, 
    BackHandler, 
    Text, 
    TextInput, 
    TouchableOpacity,
    Linking,
} from 'react-native';
import { useFocusEffect, NavigationProp } from '@react-navigation/native';

import CustomHeader from "../../components/header/CustomHeader";
import InfoModal from "../../components/InfoModal";
import Surface from "../../components/Surface";
import Colors from '../../constants/Colors';
import { HomeStackParamList } from '../../types/navigation';

interface AboutUsScreenProps {
    navigation: NavigationProp<any>;
}

const AboutUsScreen: React.FC<AboutUsScreenProps> = ({ navigation }) => {
    const [message, setMessage] = useState<string>('');
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    
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

    const handleEmail = (): void => {
        Linking.openURL('mailto:info@luxebeauty.com');
    };

    const handleWebsite = (): void => {
        Linking.openURL('https://luxebeauty.com');
    };

    const handleSendMessage = (): void => {
        if (message.trim()) {
            // Here you would send the message to your backend
            setMessage('');
            setModalVisible(true);
        }
    };

    return (
        <CustomHeader navigation={navigation}>
            <ScrollView 
                style={styles.container}
                showsVerticalScrollIndicator={false}
            >
                {/* Header Section */}
                <View style={styles.headerSection}>
                    <Text style={styles.brandName}>Luxe</Text>
                    <View style={styles.versionBadge}>
                        <Text style={styles.versionText}>Version 1.0.0</Text>
                    </View>
                </View>

                {/* Contact Info Card */}
                <Surface elevation={2}>
                    <View style={styles.contactRow}>
                        <View style={styles.contactColumn}>
                            <Text style={styles.contactLabel}>Email</Text>
                            <TouchableOpacity onPress={handleEmail}>
                                <Text style={styles.contactLink}>info@luxebeauty.com</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.contactColumnRight}>
                            <Text style={styles.contactLabel}>Homepage</Text>
                            <TouchableOpacity onPress={handleWebsite}>
                                <Text style={styles.contactLink}>luxebeauty.com</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Surface>

                {/* Send Message Card */}
                <Surface elevation={2}>
                    <Text style={styles.cardTitle}>Send us a message</Text>
                    <Text style={styles.cardSubtitle}>
                        Criticism or praise? We welcome feedback, send us a message and we will get back to you.
                    </Text>
                    
                    <TextInput
                        style={styles.messageInput}
                        placeholder="Your feedback..."
                        placeholderTextColor={Colors.textMuted}
                        multiline={true}
                        numberOfLines={4}
                        value={message}
                        onChangeText={setMessage}
                        textAlignVertical="top"
                    />
                    
                    <TouchableOpacity 
                        style={[
                            styles.sendButton,
                            !message.trim() && styles.sendButtonDisabled
                        ]} 
                        onPress={handleSendMessage}
                        disabled={!message.trim()}
                    >
                        <Text style={styles.sendButtonText}>SEND MESSAGE</Text>
                    </TouchableOpacity>
                </Surface>

                {/* About Section */}
                <Surface elevation={2}>
                    <Text style={styles.cardTitle}>About Luxe</Text>
                    <Text style={styles.aboutText}>
                        America's Premier Online Beauty Destination for Cosmetics, Skincare & Perfumes.
                    </Text>
                    <Text style={styles.aboutText}>
                        Luxe is a virtual beauty showroom featuring a hand-curated mix of beauty and
                        fashion products from 700+ International brands, local and exclusive in-house brands,
                        where customers can discover personal recommendations from America's most loved
                        celebrities and shop their selections on-the-go.
                    </Text>
                    <Text style={styles.aboutText}>
                        Founded in 2019, Luxe distinguishes itself from other e-commerce
                        platforms with the incorporation of a social element: it features celebrities and
                        social media influencers who recommend products, allowing consumers to shop directly from
                        these influencers' virtual stores inside Luxe.
                    </Text>
                </Surface>

                {/* Address Section */}
                <Surface elevation={2} style={styles.lastCard}>
                    <Text style={styles.cardTitle}>Visit Us</Text>
                    <Text style={styles.addressText}>350 Fifth Avenue, Suite 4500</Text>
                    <Text style={styles.addressText}>New York, NY 10118</Text>
                    <Text style={styles.addressText}>United States</Text>
                    <Text style={[styles.addressText, styles.phoneText]}>+1 (212) 736-5000</Text>
                </Surface>
            </ScrollView>

            <InfoModal
                visible={modalVisible}
                title="Message Sent"
                message="Thank you for your feedback! We'll get back to you soon."
                onClose={() => setModalVisible(false)}
                type="success"
            />
        </CustomHeader>
    );
};

export default AboutUsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.backgroundGray,
    },
    headerSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        backgroundColor: Colors.surface,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    brandName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: Colors.onSurface,
    },
    versionBadge: {
        backgroundColor: Colors.backgroundGray,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
    },
    versionText: {
        fontSize: 12,
        color: Colors.textSecondary,
    },
    lastCard: {
        marginBottom: 30,
    },
    contactRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    contactColumn: {
        flex: 1,
    },
    contactColumnRight: {
        flex: 1,
        alignItems: 'flex-end',
    },
    contactLabel: {
        fontSize: 14,
        color: Colors.textSecondary,
        marginBottom: 4,
    },
    contactLink: {
        fontSize: 16,
        color: Colors.info,
        fontWeight: '500',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.onSurface,
        marginBottom: 8,
    },
    cardSubtitle: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 16,
    },
    messageInput: {
        backgroundColor: Colors.surface,
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: 8,
        padding: 14,
        fontSize: 16,
        minHeight: 100,
        color: Colors.onSurface,
        marginBottom: 16,
    },
    sendButton: {
        backgroundColor: Colors.success,
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
    },
    sendButtonDisabled: {
        backgroundColor: Colors.iconMuted,
    },
    sendButtonText: {
        color: Colors.textWhite,
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    aboutText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 12,
    },
    addressText: {
        fontSize: 14,
        color: Colors.textSecondary,
        lineHeight: 22,
    },
    phoneText: {
        marginTop: 8,
        color: Colors.info,
        fontWeight: '500',
    },
});
