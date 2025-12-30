import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DroneList from "../DroneList";
import DroneDetail from "../DroneDetail";
import DroneMap from "../DroneMap";
import ToggleCameraMap from "../ToggleCameraMap";
import { IP_HOST } from "@env";

import { useTheme } from "../../context/ThemeContext";

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
  sidebarLevel,
  setSidebarLevel,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {sidebarLevel >= 1 && (
          <View style={[styles.colList, { borderColor: colors.border }]}>
            <View style={styles.columnHeader}>
              <Text style={[styles.headerText, { color: colors.text }]}>Drone Detected</Text>
              
              <TouchableOpacity onPress={() => setSidebarLevel(0)}>
                <Ionicons name="chevron-back-circle" size={24} color={colors.subText} />
              </TouchableOpacity>
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
        )}

        {sidebarLevel >= 2 && (
          <View style={[styles.colDetail, { borderColor: colors.border }]}>
            <View style={styles.columnHeader}>
              <Text style={[styles.headerText, { color: colors.text }]}>Detail</Text>
              
              <TouchableOpacity onPress={() => setSidebarLevel(1)}>
                <Ionicons name="chevron-back-circle" size={24} color={colors.subText} />
              </TouchableOpacity>
            </View>
            <DroneDetail drone={selectedDrone} />
          </View>
        )}

        {/* ✅ ปรับปรุงส่วนแสดงผลแผนที่/กล้อง (ใช้ซ้อน Layer) */}
        <View style={{ flex: 5, position: "relative" }}>
          
          {/* 1. Map: อยู่ชั้นล่างสุด แสดงผลตลอดเวลา (ห้ามลบ) */}
          <View style={StyleSheet.absoluteFill}>
            <DroneMap
              style={{ width: "100%", height: "100%" }}
              drones={drones}
              alertZone={alertZone}
              defenseZone={defenseZone}
              initialRegion={initialRegion}
              onRegionChange={handleRegionChange}
              isTablet={true}
            />
          </View>

          {/* 2. Camera: วางทับเมื่อเลือกโหมด camera */}
          {viewMode === "camera" && (
            <View style={[StyleSheet.absoluteFill, { backgroundColor: "black", zIndex: 10 }]}>
              <Image
                source={{ uri: CAMERA_FEED_URL }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          )}

          {/* ปุ่มเปิด Sidebar */}
          {sidebarLevel === 0 && (
            <TouchableOpacity
              style={[styles.sidebarToggleBtn, { backgroundColor: colors.surface }]}
              onPress={() => setSidebarLevel(2)}
            >
              <Ionicons name="list" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}

          {/* ปุ่มสลับโหมด Map/Camera (วางบนสุด) */}
          <View style={styles.toggleWrapper}>
            <ToggleCameraMap activeMode={viewMode} onToggle={setViewMode} />
          </View>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  colList: { flex: 2, padding: 20, borderRightWidth: 1 },
  colDetail: { flex: 3, padding: 20, borderRightWidth: 1 },
  columnHeader: { 
    marginBottom: 15, 
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center' 
  },
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
  sidebarToggleBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 20,
    padding: 10,
    borderRadius: 8,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
});

export default DesktopHome;