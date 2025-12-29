import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
  useWindowDimensions,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { BarChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";
import { IP_HOST } from "@env";

import TopNavBar from "../components/desktop/TopNavBar"; 

const API_URL = `http://${IP_HOST}:3000/api/report-data`;

const ReportScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

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
    }, []),
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

  const SummaryCard = ({ title, value, icon, color, bgColor }) => (
    <View style={[styles.card, { backgroundColor: bgColor }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: "rgba(255,255,255,0.6)" }]}>
           <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.cardValue, { color: color }]}>{value}</Text>
      </View>
      <Text style={styles.cardLabel}>{title}</Text>
    </View>
  );

  const TopOffendersList = () => (
    <View style={styles.listContainer}>
      <Text style={styles.sectionHeaderList}>Top Offenders</Text>
      <View style={styles.listHeader}>
        <Text style={[styles.listHeaderText, { flex: 2 }]}>Drone</Text>
        <Text style={[styles.listHeaderText, { flex: 1, textAlign: "center" }]}>Count</Text>
        <Text style={[styles.listHeaderText, { flex: 1, textAlign: "right" }]}>Time</Text>
      </View>
      {reportData?.topOffenders.map((item, index) => (
        <View key={index} style={styles.listItem}>
          <Text style={[styles.listText, { flex: 2, fontWeight: "bold" }]}>{item.name}</Text>
          <View style={styles.countBadgeContainer}>
             <View style={styles.countBadge}>
                <Text style={styles.countText}>{item.count}</Text>
             </View>
          </View>
          <Text style={[styles.listText, { flex: 1, textAlign: "right", color: "#888" }]}>
            {item.lastSeen}
          </Text>
        </View>
      ))}
    </View>
  );

  const WeeklyChart = () => {
    const [chartParentWidth, setChartParentWidth] = useState(0);

    return (
      <View 
        style={styles.chartContainer}
        onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setChartParentWidth(width - 40); 
        }}
      >
        <View style={styles.chartHeader}>
           <Text style={styles.sectionTitle}>Weekly Intrusions</Text>
           <View style={styles.filterBadge}><Text style={styles.filterText}>This Week</Text></View>
        </View>
        
        {reportData && chartParentWidth > 0 && (
          <BarChart
            data={reportData.weeklyStats}
            width={chartParentWidth}
            height={320}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(100, 100, 100, ${opacity})`,
              style: { borderRadius: 16 },
              barPercentage: 0.6,
              propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: "#f0f0f0"
              }
            }}
            style={styles.chart}
            showValuesOnTopOfBars={true}
            fromZero={true}
          />
        )}
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#F5F7FA" }}>
      {isDesktop && <TopNavBar />}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>
          <Text style={styles.mainHeader}>Analytics Dashboard</Text>

          {isDesktop ? (
            <View style={styles.desktopRow}>
              <View style={{ flex: 0.65, marginRight: 20 }}>
                <WeeklyChart />
              </View>

              <View style={{ flex: 0.35 }}>
                <View style={styles.cardsRow}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <SummaryCard 
                        title="Total Detected" 
                        value={reportData?.summary.totalDetected} 
                        icon="scan-outline" 
                        color="#007AFF" 
                        bgColor="#fff"
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <SummaryCard 
                        title="Intrusions" 
                        value={reportData?.summary.redZoneDetected} 
                        icon="warning" 
                        color="#FF3B30" 
                        bgColor="#fff"
                    />
                  </View>
                </View>

                <View style={{ marginTop: 20 }}>

                    <TopOffendersList />

                </View>
              </View>
            </View>
          ) : (
            <View>
               <View style={styles.cardContainerMobile}>
                  <SummaryCard 
                        title="Total Detected" 
                        value={reportData?.summary.totalDetected} 
                        icon="scan-outline" 
                        color="#007AFF" 
                        bgColor="#fff"
                    />
                  <View style={{height: 15}} />
                  <SummaryCard 
                        title="Intrusions" 
                        value={reportData?.summary.redZoneDetected} 
                        icon="warning" 
                        color="#FF3B30" 
                        bgColor="#fff"
                    />
               </View>

               <WeeklyChart /> 
               <TopOffendersList />

            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  
  contentContainer: { padding: 20, paddingTop: 20 },
  contentContainerDesktop: { paddingHorizontal: 40, paddingTop: 30, maxWidth: 1600, alignSelf: 'center', width: '100%' },
  desktopRow: { flexDirection: "row", alignItems: "flex-start" },
  
  mainHeader: { fontSize: 28, fontWeight: "bold", color: "#1A1A1A", marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  sectionHeaderList: { fontSize: 18, fontWeight: "bold", color: "#333", marginBottom: 15, paddingHorizontal: 15, paddingTop: 15 },

  cardsRow: { flexDirection: "row" },
  cardContainerMobile: { marginBottom: 20 },
  card: {
    padding: 20,
    borderRadius: 16,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 0,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  cardValue: { fontSize: 36, fontWeight: "bold" },
  cardLabel: { fontSize: 14, color: "#666", fontWeight: "500", textTransform: 'uppercase', letterSpacing: 0.5 },

  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  filterBadge: { backgroundColor: '#F0F0F0', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 12, color: '#666', fontWeight: '600' },
  chart: { borderRadius: 16, paddingRight: 0 },

  listContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20
  },
  listHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 10,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  listHeaderText: { fontWeight: "600", color: "#999", fontSize: 12, textTransform: 'uppercase' },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#f9f9f9",
  },
  listText: { fontSize: 14, color: "#333" },
  countBadgeContainer: { flex: 1, alignItems: 'center' },
  countBadge: {
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: { color: "#D32F2F", fontSize: 12, fontWeight: "bold" },
});

export default ReportScreen;