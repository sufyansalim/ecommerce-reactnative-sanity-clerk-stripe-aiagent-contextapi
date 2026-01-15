import React from 'react';
import {
    Modal,
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import Colors from '../constants/Colors';

const ConfirmModal = ({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    cancelText = 'CANCEL',
    confirmText = 'CONFIRM',
    confirmDestructive = false,
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>
                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={onCancel}
                        >
                            <Text style={[styles.buttonText, styles.cancelText]}>
                                {cancelText}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.button} 
                            onPress={onConfirm}
                        >
                            <Text style={[
                                styles.buttonText, 
                                confirmDestructive ? styles.destructiveText : styles.confirmText
                            ]}>
                                {confirmText}
                            </Text>
                        </TouchableOpacity>
                    </View>
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
        borderRadius: 12,
        padding: 24,
        marginHorizontal: 40,
        minWidth: 280,
        shadowColor: Colors.shadow,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.onSurface,
        marginBottom: 12,
    },
    message: {
        fontSize: 16,
        color: Colors.onSurfaceVariant,
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 16,
    },
    button: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    buttonText: {
        fontSize: 14,
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    cancelText: {
        color: Colors.success,
    },
    confirmText: {
        color: Colors.primary,
    },
    destructiveText: {
        color: Colors.error,
    },
});

export default ConfirmModal;
