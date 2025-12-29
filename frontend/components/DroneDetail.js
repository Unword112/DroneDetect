import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useTheme } from "../context/ThemeContext";

const DroneDetail = ({ drone }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  if (!drone) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.subText }]}>
          Select a drone to view details
        </Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DetailRow label="DISTANCE" value={`${drone.distance} m`} colors={colors} />
      <DetailRow
        label="Location"
        value={`${drone.lat?.toFixed(6)}, ${drone.lon?.toFixed(6)}`}
        colors={colors}
      />
      <DetailRow label="Speed" value={`${drone.speed || "-"} m/s`} colors={colors} />
      <DetailRow label="POI" value={`${drone.POI || "-"} m`} colors={colors} />
      <DetailRow label="Altitude" value={`${drone.Altitude || "-"} m`} colors={colors} />
      <DetailRow label="Heading" value={`${drone.Heading || "-"}°`} colors={colors} />
      <DetailRow label="Reach in" value={`${drone.ReachIn || "-"} sec`} colors={colors} />
    </ScrollView>
  );
};

const DetailRow = ({ label, value, colors }) => (
  <View style={[styles.detailRow, { borderBottomColor: colors.border }]}> 
    <Text style={[styles.detailLabel, { color: colors.subText }]}>{label}</Text>
    <Text style={[styles.detailValue, { color: colors.text }]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { textAlign: "center" }, 
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  detailLabel: { fontSize: 16 },
  detailValue: { fontSize: 16, fontWeight: "600" },
});

export default DroneDetail;