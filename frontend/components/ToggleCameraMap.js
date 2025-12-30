import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const ToggleCameraMap = ({ activeMode, onToggle }) => {
  const lastPressTime = useRef(0);
  const DELAY_MS = 700;

  const handlePress = (mode) => {
    const now = Date.now();

    if (now - lastPressTime.current < DELAY_MS) {
      return;
    }

    lastPressTime.current = now;
    onToggle(mode);
  };

  return (
    <View style={styles.toggleContainer}>
      <TouchableOpacity
        style={[
          styles.toggleBtn,
          activeMode === "map" && styles.toggleBtnActive,
        ]}
        onPress={() => handlePress("map")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.toggleText,
            activeMode === "map" && styles.toggleTextActive,
          ]}
        >
          Map View
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.toggleBtn,
          activeMode === "camera" && styles.toggleBtnActive,
        ]}
        onPress={() => handlePress("camera")}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.toggleText,
            activeMode === "camera" && styles.toggleTextActive,
          ]}
        >
          Camera
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#2C3E50",
    borderRadius: 20,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    elevation: 5,
  },
  toggleBtn: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 18,
  },
  toggleBtnActive: {
    backgroundColor: "#00ADEF",
  },
  toggleText: {
    color: "#ccc",
    fontWeight: "600",
    fontSize: 14,
  },
  toggleTextActive: {
    color: "white",
  },
});

export default ToggleCameraMap;
