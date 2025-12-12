import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const MenuPopover = ({ isVisible, onClose, onNavigate }) => {
    const menuItems = [
        { name: 'Alert', label: 'Alert' },
        { name: 'Report', label: 'Report' },
        { name: 'Option', label: 'Option' },
        { name: 'Account', label: 'Account' },
        { name: 'EditZone', label: 'Edit Zone' },
    ];

    const handlePress = (screenName) => {
        onClose();
        onNavigate(screenName);
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.name}
                            style={styles.menuItem}
                            onPress={() => handlePress(item.name)}
                        >
                            <Text style={styles.menuText}>{item.label}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </TouchableOpacity>
        </Modal>
    );
};

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        alignItems: 'flex-end',
        paddingTop: 45,
        paddingRight: 10,
    },
    menuContainer: {
        width: 150,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    menuItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    menuText: {
        fontSize: 16,
    },
});

export default MenuPopover;