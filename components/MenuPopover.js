import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';

const MenuPopover = ({ isVisible, onClose, onNavigate }) => {
    // รายการเมนูที่คุณต้องการ
    const menuItems = [
        { name: 'Alert', label: 'Alert' },
        { name: 'Report', label: 'Report' },
        { name: 'Option', label: 'Option' },
        { name: 'Account', label: 'Account' },
    ];

    const handlePress = (screenName) => {
        onClose(); // ปิดเมนูเมื่อเลือก
        onNavigate(screenName); // นำทางไปยังหน้าจอที่เลือก
    };

    return (
        <Modal
            animationType="fade" // ให้ดูนุ่มนวล
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >
            {/* พื้นหลังโปร่งใสที่คลิกแล้วปิดเมนู */}
            <TouchableOpacity 
                style={styles.backdrop} 
                activeOpacity={1}
                onPress={onClose}
            >
                {/* กล่องเมนูจริง */}
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
        // ทำให้เมนู Popover ปรากฏที่มุมขวาบน (ปรับค่าตามตำแหน่งปุ่มเมนูจริง)
        alignItems: 'flex-end',
        paddingTop: 45, // เว้นจากขอบบนเพื่ออยู่ใต้แถบสถานะ/Header
        paddingRight: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.2)', // พื้นหลังทึบเล็กน้อย
    },
    menuContainer: {
        width: 150,
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5, // เงาสำหรับ Android
        shadowColor: '#000', // เงาสำหรับ iOS
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