import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DroneList from "../DroneList";
import DroneDetail from "../DroneDetail";
import DroneMap from "../DroneMap";
import ToggleCameraMap from "../../pages/configscreen/ToggleCameraMap";
import ZoneEditor from "../ZoneEditor";
import { useZoneSystem } from "../../hook/useZoneSystem";

import { IP_HOST } from "@env";
import { useTheme } from "../../context/ThemeContext";

const SIDE_CAMERA_URL = `http://${IP_HOST}:3000/api/side-camera`;
const CAMERA_FEED_URL = `http://${IP_HOST}:3000/api/camera-live`;
//const API_UPDATE_ZONE = `http://${IP_HOST}:3000/api/update-zones`;

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
  mapRef,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const {
    isEditing,
    editDefenseCoords,
    editAlertCoords,
    startEditing,
    onMarkerDragEnd,
    handleSave,
    handleCancel,
  } = useZoneSystem(initialRegion, defenseZone, alertZone);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: "row" }}>
        {sidebarLevel >= 1 && (
          <View style={[styles.colList, { borderColor: colors.border }]}>
            <View style={styles.columnHeader}>
              <Text style={[styles.headerText, { color: colors.text }]}>
                Drone Detected
              </Text>
              <TouchableOpacity onPress={() => setSidebarLevel(0)}>
                <Ionicons
                  name="chevron-back-circle"
                  size={24}
                  color={colors.subText}
                />
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
              <Text style={[styles.headerText, { color: colors.text }]}>
                Detail
              </Text>
              <TouchableOpacity onPress={() => setSidebarLevel(1)}>
                <Ionicons
                  name="chevron-back-circle"
                  size={24}
                  color={colors.subText}
                />
              </TouchableOpacity>
            </View>
            <DroneDetail drone={selectedDrone} />
          </View>
        )}

        <View style={{ flex: 5, position: "relative" }}>
          <View style={StyleSheet.absoluteFill}>
            <DroneMap
              ref={mapRef}
              
              style={{ width: "100%", height: "100%" }}
              drones={isEditing ? [] : drones}
              alertZone={isEditing ? [] : alertZone}
              defenseZone={isEditing ? [] : defenseZone}
              initialRegion={initialRegion}
              onRegionChange={handleRegionChange}
            >
              {isEditing && (
                <ZoneEditor
                  defenseCoords={editDefenseCoords}
                  alertCoords={editAlertCoords}
                  onMarkerDragEnd={onMarkerDragEnd}
                />
              )}
            </DroneMap>
          </View>

          {viewMode === "camera" && !isEditing && (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "black", zIndex: 10 },
              ]}
            >
              <Image
                source={{ uri: CAMERA_FEED_URL }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>
          )}

          {sidebarLevel === 0 && !isEditing && (
            <TouchableOpacity
              style={[
                styles.sidebarToggleBtn,
                { backgroundColor: colors.surface },
              ]}
              onPress={() => setSidebarLevel(2)}
            >
              <Ionicons name="list" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}

          {!isEditing && (
            <View style={styles.toggleWrapper}>
              <ToggleCameraMap activeMode={viewMode} onToggle={setViewMode} />
            </View>
          )}

          <View style={styles.editControls}>
            {!isEditing ? (
              <TouchableOpacity
                style={[styles.btn, { backgroundColor: colors.surface }]}
                onPress={startEditing}
              >
                <Ionicons name="create-outline" size={24} color={colors.text} />
                <Text
                  style={{
                    color: colors.text,
                    fontWeight: "bold",
                    marginLeft: 8,
                  }}
                >
                  Edit Zones
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[
                    styles.btn,
                    { backgroundColor: "#FF3B30", marginRight: 10 },
                  ]}
                  onPress={handleCancel}
                >
                  <Ionicons name="close" size={24} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 5,
                    }}
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btn, { backgroundColor: "#34C759" }]}
                  onPress={() => handleSave()}
                >
                  <Ionicons name="save" size={24} color="white" />
                  <Text
                    style={{
                      color: "white",
                      fontWeight: "bold",
                      marginLeft: 5,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              </View>
            )}
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  toggleWrapper: {
    position: "absolute",
    top: 20,
    alignSelf: "center",
    zIndex: 50,
  },
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
  },

  // Style ใหม่สำหรับปุ่ม Edit
  editControls: { position: "absolute", top: 20, right: 20, zIndex: 100 },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    elevation: 5,
  },
});

export default DesktopHome;
