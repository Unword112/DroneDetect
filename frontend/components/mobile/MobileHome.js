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
import { useTheme } from "../../context/ThemeContext"; 
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
  const { theme } = useTheme();
  const colors = theme.colors;

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
                backgroundColor: colors.surface 
              },
            ]}
          >
            <View style={[styles.modalIndicator, { backgroundColor: colors.border }]} />
            
            <Text style={[styles.modalHeader, { color: colors.subText }]}>DRONE DETECTED</Text>
    
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
    </View>
  );
};

const styles = StyleSheet.create({
  // ลบ backgroundColor: '#fff' ออกจาก container เพื่อให้ override ได้ง่าย
  container: { flex: 1 }, 
  mapMobile: { width: "100%", height: "70%" },
  // ลบ backgroundColor ออกจาก infoContainerMobile
  infoContainerMobile: { height: "30%", padding: 15 }, 
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    // ลบ backgroundColor ออก
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 400,
    elevation: 5,
  },
  modalIndicator: {
    width: 40,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 15,
  },
  modalHeader: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 5,
  },
  divider: { height: 1, marginVertical: 10 },
  closeButton: { alignItems: "center", padding: 15, marginTop: 10 },
});

export default MobileHome;