import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Colors from '../constants/Colors';

const InfoModal = ({
    visible,
    title,
    message,
    onClose,
    buttonText = 'OK',
    type = 'success', // 'success', 'error', 'warning', 'info'
}) => {
    const getIconConfig = () => {
        switch (type) {
            case 'success':
                return { name: 'checkmark-circle', color: Colors.success };
            case 'error':
                return { name: 'close-circle', color: Colors.error };
            case 'warning':
                return { name: 'warning', color: Colors.warning };
            case 'info':
            default:
                return { name: 'information-circle', color: Colors.info };
        }
    };

    const iconConfig = getIconConfig();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Ionicons 
                        name={iconConfig.name} 
                        size={48} 
                        color={iconConfig.color} 
                        style={styles.icon}
                    />
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity 
                        style={styles.button} 
                        onPress={onClose}
                    >
                        <Text style={[styles.buttonText, { color: iconConfig.color }]}>
                            {buttonText}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: Colors.backdrop,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 24,
        marginHorizontal: 40,
        minWidth: 280,
        alignItems: 'center',
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    icon: {
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.onSurface,
        marginBottom: 8,
        textAlign: 'center',
    },
    message: {
        fontSize: 16,
        color: Colors.onSurfaceVariant,
        marginBottom: 24,
        lineHeight: 22,
        textAlign: 'center',
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        alignSelf: 'center',
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
});

export default InfoModal;
