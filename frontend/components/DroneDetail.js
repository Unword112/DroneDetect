import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

const DroneDetail = ({ drone }) => {
  if (!drone) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Select a drone to view details</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DetailRow label="DISTANCE" value={`${drone.distance} m`} />
      <DetailRow
        label="Location"
        value={`${drone.lat?.toFixed(6)}, ${drone.lon?.toFixed(6)}`}
      />
      <DetailRow label="Speed" value={`${drone.speed || "-"} m/s`} />
      <DetailRow label="POI" value={`${drone.POI || "-"} m`} />
      <DetailRow label="Altitude" value={`${drone.Altitude || "-"} m`} />
      <DetailRow label="Heading" value={`${drone.Heading || "-"}°`} />
      <DetailRow label="Reach in" value={`${drone.ReachIn || "-"} sec`} />
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { paddingVertical: 10 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { color: "#999", textAlign: "center" },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: { fontSize: 16, color: "#333" },
  detailValue: { fontSize: 16, fontWeight: "600", color: "black" },
});

export default DroneDetail;
