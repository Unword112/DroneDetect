import React, { useRef } from "react";
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

import DroneList from "../DroneList";
import DroneDetail from "../DroneDetail";
import DroneMap from "../DroneMap";
import ToggleCameraMap from "../ToggleCameraMap";
import { IP_HOST } from "@env";

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
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  React.useEffect(() => {
    if (modalVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
          easing: Easing.out(Easing.poly(4)),
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: SCREEN_HEIGHT,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [modalVisible]);

  return (
    <View style={styles.container}>
      <View style={[styles.mapMobile, { paddingTop: 0 }]}>
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
            isTablet={false}
          />
        )}

        <View
          style={{
            position: "absolute",
            top: headerHeight + 10,
            alignSelf: "center",
            zIndex: 50,
          }}
        >
          <ToggleCameraMap activeMode={viewMode} onToggle={setViewMode} />
        </View>
      </View>

      <View style={styles.infoContainerMobile}>
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
              { transform: [{ translateY: slideAnim }] },
            ]}
          >
            <View style={styles.modalIndicator} />
            <Text style={styles.modalHeader}>DRONE DETECTED</Text>
            <Text style={styles.modalTitle}>{selectedDrone?.name}</Text>
            <View style={styles.divider} />
            <DroneDetail drone={selectedDrone} />
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={{ color: "#666" }}>Close</Text>
            </TouchableOpacity>
          </Animated.View>
        </Animated.View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  mapMobile: { width: "100%", height: "70%" },
  infoContainerMobile: { height: "30%", padding: 15, backgroundColor: "#fff" },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
    elevation: 5,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    backgroundColor: "#ccc",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalHeader: {
    fontSize: 12,
    color: "#868686",
    fontWeight: "500",
    textTransform: "uppercase",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    marginVertical: 5,
  },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 10 },
  closeButton: { alignItems: "center", padding: 15, marginTop: 10 },
});

export default MobileHome;
