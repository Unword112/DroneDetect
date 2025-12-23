import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DroneList from "../DroneList";
import DroneDetail from "../DroneDetail";
import DroneMap from "../DroneMap";
import ToggleCameraMap from "../ToggleCameraMap";
import TopNavBar from "./TopNavBar";
import { IP_HOST } from "@env";

const SIDE_CAMERA_URL = `http://${IP_HOST}:3000/api/side-camera`;
const CAMERA_FEED_URL = `http://${IP_HOST}:3000/api/camera-live`;

const DesktopHome = ({
  drones,
  selectedDrone,
  handleDroneSelect,
  getImageUrl,
  viewMode,
  setViewMode,
  alertZone,
  defenseZone,
  initialRegion,
  handleRegionChange,
}) => {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <TopNavBar />

      <View style={{ flex: 1, flexDirection: "row" }}>
        <View style={styles.colList}>
          <View style={styles.columnHeader}>
            <Text style={styles.headerText}>Drone Detected</Text>
          </View>
          <View style={{ flex: 1 }}>
            <DroneList
              drones={drones}
              selectedDrone={selectedDrone}
              onSelect={handleDroneSelect}
            />
          </View>
          <View style={styles.liveCameraBox}>
            <View style={styles.liveHeader}>
              <View style={styles.redDot} />
              <Text style={styles.liveText}>
                {selectedDrone ? "TRACKING" : "AUTO TRACKING"}
              </Text>
            </View>
            <Image
              source={{
                uri: selectedDrone
                  ? getImageUrl(selectedDrone.imageUrl)
                  : SIDE_CAMERA_URL,
              }}
              style={styles.liveImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.colDetail}>
          <View style={styles.columnHeader}>
            <Text style={styles.headerText}>Detail</Text>
          </View>
          <DroneDetail drone={selectedDrone} />
        </View>

        <View style={{ flex: 5, position: "relative" }}>
          <View style={styles.toggleWrapper}>
            <ToggleCameraMap activeMode={viewMode} onToggle={setViewMode} />
          </View>

          {viewMode === "camera" ? (
            <View style={{ flex: 1, backgroundColor: "black" }}>
              <Image
                source={{ uri: CAMERA_FEED_URL }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          ) : (
            <DroneMap
              style={{ width: "100%", height: "100%" }}
              drones={drones}
              alertZone={alertZone}
              defenseZone={defenseZone}
              initialRegion={initialRegion}
              onRegionChange={handleRegionChange}
              isTablet={true}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colList: { flex: 2, padding: 20, borderRightWidth: 1, borderColor: "#eee" },
  colDetail: { flex: 3, padding: 20, borderRightWidth: 1, borderColor: "#eee" },
  columnHeader: { marginBottom: 15 },
  headerText: { fontSize: 16, fontWeight: "bold" },
  liveCameraBox: {
    height: 180,
    width: "100%",
    backgroundColor: "#000",
    borderRadius: 12,
    marginTop: 15,
    overflow: "hidden",
    position: "relative",
  },
  liveImage: { width: "100%", height: "100%" },
  toggleWrapper: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    zIndex: 50,
  },
  liveHeader: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  redDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "red",
    marginRight: 6,
  },
  liveText: { color: "white", fontSize: 10, fontWeight: "bold" },
});

export default DesktopHome;
