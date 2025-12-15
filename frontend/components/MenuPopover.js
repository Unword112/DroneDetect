import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';

const MenuPopover = ({ isVisible, onClose, onNavigate, alertCount }) => {
    const menuItems = [
        { name: 'EditZone', label: 'Edit Zone' },
        { name: 'Alert', label: 'Alert' },
        { name: 'Report', label: 'Report' },
        { name: 'Option', label: 'Option' },
        { name: 'Account', label: 'Account' },
    ];

    const handlePress = (screenName) => {
        onClose();
        onNavigate(screenName);
    };

    return (
        <Modal
            transparent={true}
            visible={isVisible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.overlay}>
                    <View style={styles.popoverContainer}>
                        
                        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('EditZone')}>
                            <Text style={styles.menuText}>Edit Zone</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Alert')}>
                            <View style={styles.rowBetween}>
                                <Text style={styles.menuText}>Alert</Text>
                                
                                {alertCount > 0 && (
                                    <View style={styles.alertBadge}>
                                        <Text style={styles.alertBadgeText}>{alertCount}</Text>
                                    </View>
                                )}
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Report')}>
                            <Text style={styles.menuText}>Report</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.menuItem} onPress={() => onNavigate('Option')}>
                            <Text style={styles.menuText}>Option</Text>
                        </TouchableOpacity>

                         <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={() => onNavigate('Account')}>
                            <Text style={styles.menuText}>Account</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.1)', 
    },
    popoverContainer: {
        position: 'absolute',
        top: 50,
        right: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        width: 150,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingVertical: 5
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    menuText: {
        fontSize: 16,
        color: '#333',
    },
    rowBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    alertBadge: {
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6,
        paddingVertical: 2,
        minWidth: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    alertBadgeText: {
        color: 'white',
        fontSize: 12,
        fontWeight: 'bold',
    }
});

export default MenuPopover;