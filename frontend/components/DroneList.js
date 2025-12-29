import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTheme } from "../context/ThemeContext"; 

const DroneList = ({ drones, selectedDrone, onSelect }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

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
                style={[
                  styles.listItem, 
                  isSelected && styles.selectedItem
                ]}
              >
                <Text 
                  style={[
                    styles.targetText, 
                    { color: isSelected ? '#007AFF' : colors.text }
                  ]} 
                  numberOfLines={1}
                >
                  {drone.name}
                </Text>
                
                <View
                  style={[
                    styles.indicator,
                    { backgroundColor: isSelected ? "#007AFF" : "#4AC2F9" },
                  ]}
                />
              </View>
              <Text style={[styles.subText, { color: colors.subText }]}>{drone.distance} m</Text>
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
  selectedItem: { backgroundColor: "rgba(0, 122, 255, 0.1)" },
  targetText: { fontSize: 16, fontWeight: "600", flex: 1 },
  indicator: { width: 12, height: 12, borderRadius: 6 },
  subText: { fontSize: 12, marginTop: 2, paddingLeft: 12 },
});

export default DroneList;