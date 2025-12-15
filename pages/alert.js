import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native'; // 1. เพิ่ม useFocusEffect

import { getAlerts, clearUnread } from './configscreen/alertStore';

const AlertScreen = () => {
    const [alertList, setAlertList] = useState([]);

    useFocusEffect(
        useCallback(() => {
            setAlertList(getAlerts());
            clearUnread(); 
            
            return () => {};
        }, [])
    );

    const renderItem = ({ item }) => (
        <View style={styles.alertItem}>
            <View style={styles.iconContainer}>
                <Ionicons name="warning" size={24} color="#FF4500" />
            </View>
            <View style={styles.textContainer}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.message}>{item.message}</Text>
                <Text style={styles.time}>{item.date} - {item.time}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {alertList.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No notifications</Text>
                </View>
            ) : (
                <FlatList
                    data={alertList}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f5f5f5', paddingTop: 100 }, // paddingTop เผื่อ Header
    listContent: { paddingHorizontal: 20 },
    alertItem: {
        flexDirection: 'row',
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 12,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    iconContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
        backgroundColor: '#FFE5E5',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    textContainer: { flex: 1 },
    title: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    message: { fontSize: 14, color: '#666', marginTop: 2 },
    time: { fontSize: 12, color: '#999', marginTop: 5 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { color: '#888', fontSize: 16 }
});

export default AlertScreen;