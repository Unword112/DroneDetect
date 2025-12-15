import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, ActivityIndicator, RefreshControl } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { IP_HOST } from '@env';

const API_URL = `http://${IP_HOST}:3000/api/report-data`;
const screenWidth = Dimensions.get("window").width;

const ReportScreen = () => {
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchReportData = async () => {
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            setReportData(data);
            setLoading(false);
            setRefreshing(false);
        } catch (error) {
            console.error("Error fetching report:", error);
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchReportData();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchReportData();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <ScrollView 
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.contentContainer}>
                <Text style={styles.headerTitle}>Daily Summary</Text>

                <View style={styles.cardContainer}>
                    <View style={[styles.card, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="scan-outline" size={24} color="#007AFF" />
                        <Text style={styles.cardValue}>{reportData?.summary.totalDetected}</Text>
                        <Text style={styles.cardLabel}>Total Detected</Text>
                    </View>

                    <View style={[styles.card, { backgroundColor: '#FFEBEE' }]}>
                        <Ionicons name="warning-outline" size={24} color="#D32F2F" />
                        <Text style={[styles.cardValue, { color: '#D32F2F' }]}>
                            {reportData?.summary.redZoneDetected}
                        </Text>
                        <Text style={styles.cardLabel}>Intrusions</Text>
                    </View>
                </View>

                <Text style={styles.sectionTitle}>Weekly Intrusions</Text>
                {reportData && (
                    <BarChart
                        data={reportData.weeklyStats}
                        width={screenWidth - 40}
                        height={220}
                        yAxisLabel=""
                        chartConfig={{
                            backgroundColor: "#ffffff",
                            backgroundGradientFrom: "#ffffff",
                            backgroundGradientTo: "#ffffff",
                            decimalPlaces: 0,
                            color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`, // สีส้มแดง
                            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                            style: { borderRadius: 16 },
                            barPercentage: 0.7,
                        }}
                        style={styles.chart}
                        showValuesOnTopOfBars={true}
                    />
                )}

                <Text style={styles.sectionTitle}>Top Offenders</Text>
                <View style={styles.listContainer}>
                    <View style={styles.listHeader}>
                        <Text style={[styles.listHeaderText, { flex: 2 }]}>Drone Name</Text>
                        <Text style={[styles.listHeaderText, { flex: 1, textAlign: 'center' }]}>Count</Text>
                        <Text style={[styles.listHeaderText, { flex: 1, textAlign: 'right' }]}>Last Seen</Text>
                    </View>
                    
                    {reportData?.topOffenders.map((item, index) => (
                        <View key={index} style={styles.listItem}>
                            <Text style={[styles.listText, { flex: 2, fontWeight: 'bold' }]}>{item.name}</Text>
                            <View style={styles.countBadge}>
                                <Text style={styles.countText}>{item.count}</Text>
                            </View>
                            <Text style={[styles.listText, { flex: 1, textAlign: 'right', color: '#666' }]}>
                                {item.lastSeen}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f8f9fa' },
    contentContainer: { padding: 20, paddingTop: 100 },
    loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    headerTitle: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: '#333' },
    sectionTitle: { fontSize: 18, fontWeight: '600', marginTop: 25, marginBottom: 15, color: '#444' },
    cardContainer: { flexDirection: 'row', justifyContent: 'space-between' },
    card: {
        width: '48%',
        padding: 20,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardValue: { fontSize: 32, fontWeight: 'bold', marginVertical: 5, color: '#333' },
    cardLabel: { fontSize: 14, color: '#666' },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
        paddingRight: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    listContainer: { backgroundColor: 'white', borderRadius: 12, padding: 15, elevation: 2 },
    listHeader: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee', paddingBottom: 10, marginBottom: 5 },
    listHeaderText: { fontWeight: '600', color: '#888', fontSize: 12 },
    listItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f5f5f5' },
    listText: { fontSize: 14, color: '#333' },
    countBadge: { 
        flex: 1, 
        alignItems: 'center', 
    },
    countText: {
        backgroundColor: '#FFE5E5', 
        color: 'red', 
        paddingHorizontal: 10, 
        paddingVertical: 2, 
        borderRadius: 10, 
        fontSize: 12, 
        fontWeight: 'bold',
        overflow: 'hidden'
    }
});

export default ReportScreen;