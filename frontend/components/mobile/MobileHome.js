import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Image,
  Dimensions,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DroneList from "../DroneList";
import DroneDetail from "../DroneDetail";
import DroneMap from "../DroneMap";
import ZoneEditor from '../ZoneEditor';
import MenuPopover from "./MenuPopover"; 

import ToggleCameraMap from "../../pages/configscreen/ToggleCameraMap";
import { useTheme } from "../../context/ThemeContext";
import { IP_HOST } from "@env";
import { useZoneSystem } from "../../hook/useZoneSystem";

import { subscribe, getUnreadCount } from "../../pages/configscreen/alertStore";

const CAMERA_FEED_URL = `http://${IP_HOST}:3000/api/camera-live`;
const SCREEN_HEIGHT = Dimensions.get("window").height;

const MobileHome = ({
  navigation,
  drones,
  selectedDrone,
  handleDroneSelect,
  viewMode,
  setViewMode,
  alertZone,
  defenseZone,
  initialRegion,
  handleRegionChange,
  headerHeight,
  modalVisible,
  setModalVisible,
  mapRef,
}) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [menuVisible, setMenuVisible] = useState(false);
  const [unreadCount, setUnreadCount] = useState(getUnreadCount());

  useEffect(() => {
    const unsubscribe = subscribe(() => setUnreadCount(getUnreadCount()));
    return unsubscribe;
  }, []);

  const {
      isEditing,
      editDefenseCoords,
      editAlertCoords,
      startEditing,
      onMarkerDragEnd,
      handleSave,
      handleCancel,
    } = useZoneSystem(initialRegion, defenseZone, alertZone);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 300, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.poly(4)) }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: SCREEN_HEIGHT, duration: 250, useNativeDriver: true }),
      ]).start();
    }
  }, [modalVisible]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      
      <View style={[styles.mapMobile, { paddingTop: 0 }]}>
        
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
          <View style={[StyleSheet.absoluteFill, { backgroundColor: "black", zIndex: 10 }]}>
            <WebView
              source={{ uri: CAMERA_FEED_URL }}
              style={{ width: "100%", height: "100%" }}
              resizeMode="cover"
            />
          </View>
        )}

        {!isEditing && (
          <View style={{ position: "absolute", top: headerHeight + 10, alignSelf: "center", zIndex: 50 }}>
            <ToggleCameraMap activeMode={viewMode} onToggle={setViewMode} />
          </View>
        )}

        <View style={[styles.topRightControls,]}>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => setMenuVisible(true)}
              >
                <Ionicons name="ellipsis-vertical" size={24} color="black" />
                {unreadCount > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>!</Text>
                  </View>
                )}
              </TouchableOpacity>
            ) : (
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity
                  style={[styles.btnAction, { backgroundColor: "#FF3B30", marginRight: 10 }]}
                  onPress={handleCancel}
                >
                  <Ionicons name="close" size={20} color="white" />
                  <Text style={styles.btnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.btnAction, { backgroundColor: "#34C759" }]}
                  onPress={() => handleSave()}
                >
                  <Ionicons name="save" size={20} color="white" />
                  <Text style={styles.btnText}>Save</Text>
                </TouchableOpacity>
              </View>
            )}
        </View>

      </View>

      <View style={[styles.infoContainerMobile, { backgroundColor: colors.surface }]}>
        <DroneList
          drones={drones}
          selectedDrone={selectedDrone}
          onSelect={handleDroneSelect}
        />
      </View>

      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Animated.View style={[styles.modalOverlay, { opacity: fadeAnim }]}>
            <TouchableOpacity
                style={StyleSheet.absoluteFill}
                onPress={() => setModalVisible(false)}
                activeOpacity={1}
            />
            <Animated.View
                style={[
                styles.modalContent,
                {
                    transform: [{ translateY: slideAnim }],
                    backgroundColor: colors.surface,
                },
                ]}
            >
               <View style={[styles.modalIndicator, { backgroundColor: colors.border }]} />
               <Text style={[styles.modalTitle, { color: colors.text }]}>{selectedDrone?.name}</Text>
               <View style={[styles.divider, { backgroundColor: colors.border }]} />
               <DroneDetail drone={selectedDrone} />
               <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: colors.subText }}>Close</Text>
                </TouchableOpacity>
            </Animated.View>
        </Animated.View>
      </Modal>

      <MenuPopover
        isVisible={menuVisible}
        onClose={() => setMenuVisible(false)}
        navigation={navigation}
        onStartEdit={startEditing}
        alertCount={unreadCount}
      />

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  mapMobile: { width: "100%", height: "70%" },
  infoContainerMobile: { height: "30%", padding: 15 },
  modalOverlay: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, minHeight: 400, elevation: 5 },
  modalIndicator: { width: 40, height: 5, borderRadius: 3, alignSelf: "center", marginBottom: 15 },
  modalTitle: { fontSize: 22, fontWeight: "bold", marginVertical: 5 },
  divider: { height: 1, marginVertical: 10 },
  closeButton: { alignItems: "center", padding: 15, marginTop: 10 },
  
  topRightControls: {
    top: 50,
    position: "absolute",
    right: 20,
    zIndex: 100,
  },
  menuButton: {
    backgroundColor: "white",
    width: 44, 
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "white",
  },
  badgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  btnAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    elevation: 5,
  },
  btnText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 4,
    fontSize: 14,
  },
});

export default MobileHome;