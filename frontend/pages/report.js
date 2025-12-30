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

import { useTheme } from "../context/ThemeContext";

const API_URL = `http://${IP_HOST}:3000/api/report-data`;

const ReportScreen = () => {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 1024;

  const { theme } = useTheme();
  const colors = theme.colors;

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
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const SummaryCard = ({ title, value, icon, color }) => (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <View style={styles.cardHeader}>
        <View style={[styles.iconCircle, { backgroundColor: theme.isDarkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.6)" }]}>
           <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={[styles.cardValue, { color: color }]}>{value}</Text>
      </View>
      <Text style={[styles.cardLabel, { color: colors.subText }]}>{title}</Text>
    </View>
  );

  const TopOffendersList = () => (
    <View style={[styles.listContainer, { backgroundColor: colors.surface }]}>
      <Text style={[styles.sectionHeaderList, { color: colors.text }]}>Top Offenders</Text>
      <View style={[styles.listHeader, { borderBottomColor: colors.border }]}>
        <Text style={[styles.listHeaderText, { flex: 2, color: colors.subText }]}>Drone</Text>
        <Text style={[styles.listHeaderText, { flex: 1, textAlign: "center", color: colors.subText }]}>Count</Text>
        <Text style={[styles.listHeaderText, { flex: 1, textAlign: "right", color: colors.subText }]}>Time</Text>
      </View>
      {reportData?.topOffenders.map((item, index) => (
        <View key={index} style={[styles.listItem, { borderBottomColor: colors.border }]}>
          <Text style={[styles.listText, { flex: 2, fontWeight: "bold", color: colors.text }]}>{item.name}</Text>
          <View style={styles.countBadgeContainer}>
             <View style={[styles.countBadge, { backgroundColor: theme.isDarkMode ? '#3f0f0f' : '#FFEBEE' }]}>
                <Text style={styles.countText}>{item.count}</Text>
             </View>
          </View>
          <Text style={[styles.listText, { flex: 1, textAlign: "right", color: colors.subText }]}>
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
        style={[styles.chartContainer, { backgroundColor: colors.surface }]}
        onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setChartParentWidth(width - 40); 
        }}
      >
        <View style={styles.chartHeader}>
           <Text style={[styles.sectionTitle, { color: colors.text }]}>Weekly Intrusions</Text>
           <View style={[styles.filterBadge, { backgroundColor: theme.isDarkMode ? '#333' : '#F0F0F0' }]}>
             <Text style={[styles.filterText, { color: colors.subText }]}>This Week</Text>
           </View>
        </View>
        
        {reportData && chartParentWidth > 0 && (
          <BarChart
            data={reportData.weeklyStats}
            width={chartParentWidth}
            height={320}
            yAxisLabel=""
            chartConfig={{
              backgroundColor: colors.surface,
              backgroundGradientFrom: colors.surface,
              backgroundGradientTo: colors.surface,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 69, 0, ${opacity})`,
              labelColor: (opacity = 1) => colors.subText,
              style: { borderRadius: 16 },
              barPercentage: 0.6,
              propsForBackgroundLines: {
                  strokeDasharray: "",
                  stroke: theme.isDarkMode ? "#333" : "#f0f0f0"
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {isDesktop}

      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
      >
        <View style={[styles.contentContainer, isDesktop && styles.contentContainerDesktop]}>
          <Text style={[styles.mainHeader, { color: colors.text }]}>Analytics Dashboard</Text>

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
                    />
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <SummaryCard 
                        title="Intrusions" 
                        value={reportData?.summary.redZoneDetected} 
                        icon="warning" 
                        color="#FF3B30" 
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
                    />
                  <View style={{height: 15}} />
                  <SummaryCard 
                        title="Intrusions" 
                        value={reportData?.summary.redZoneDetected} 
                        icon="warning" 
                        color="#FF3B30" 
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
  
  mainHeader: { fontSize: 28, fontWeight: "bold", marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: "bold" },
  sectionHeaderList: { fontSize: 18, fontWeight: "bold", marginBottom: 15, paddingHorizontal: 15, paddingTop: 15 },

  cardsRow: { flexDirection: "row" },
  cardContainerMobile: { marginBottom: 20 },
  card: {
    padding: 20,
    borderRadius: 16,
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
  cardLabel: { fontSize: 14, fontWeight: "500", textTransform: 'uppercase', letterSpacing: 0.5 },

  chartContainer: {
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
  filterBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  filterText: { fontSize: 12, fontWeight: '600' },
  chart: { borderRadius: 16, paddingRight: 0 },

  listContainer: {
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
    paddingBottom: 10,
    marginHorizontal: 15,
    marginBottom: 5,
  },
  listHeaderText: { fontWeight: "600", fontSize: 12, textTransform: 'uppercase' },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
  },
  listText: { fontSize: 14 },
  countBadgeContainer: { flex: 1, alignItems: 'center' },
  countBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  countText: { color: "#D32F2F", fontSize: 12, fontWeight: "bold" },
});

export default ReportScreen;