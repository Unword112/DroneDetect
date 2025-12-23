import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";

const DroneList = ({ drones, selectedDrone, onSelect }) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        {drones.map((drone) => {
          const isSelected = selectedDrone?.id === drone.id;
          return (
            <TouchableOpacity
              key={drone.id}
              onPress={() => onSelect(drone)}
              style={styles.itemWrapper}
              activeOpacity={0.7}
            >
              <View
                style={[styles.listItem, isSelected && styles.selectedItem]}
              >
                <Text style={styles.targetText} numberOfLines={1}>
                  {drone.name}
                </Text>
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: isSelected ? "#007AFF" : "#4AC2F9" },
                  ]}
                />
              </View>
              <Text style={styles.subText}>{drone.distance} m</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "black",
    marginBottom: 15,
  },
  itemWrapper: { marginBottom: 10 },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: "hidden",
  },
  selectedItem: { backgroundColor: "#F0F8FF" },
  targetText: { fontSize: 16, fontWeight: "600", flex: 1, color: "#333" },
  indicator: { width: 12, height: 12, borderRadius: 6 },
  subText: { fontSize: 12, color: "#868686", marginTop: 2, paddingLeft: 12 },
});

export default DroneList;
