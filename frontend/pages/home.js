import React, { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
  Dimensions,
  Platform,
  Image,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from "@expo/vector-icons";

import DroneList from "../components/DroneList";
import DroneDetail from "../components/DroneDetail";
import DroneMap from "../components/DroneMap";
import BottomTab from "../components/BottomTab";

import { setMapRegion } from "./configscreen/locationStore";
import { addAlert } from "./configscreen/alertStore";
import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/home-data`;

const isPointInPolygon = (point, polygon) => {
  const x = point.lat;
  const y = point.lon;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    const xj = polygon[j].latitude,
      yj = polygon[j].longitude;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

const HomeScreen = ({ navigation }) => {
  const headerHeight = useHeaderHeight();
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;

  const [drones, setDrones] = useState([]);
  const [defenseZone, setDefenseZone] = useState([]);
  const [alertZone, setAlertZone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialRegion, setinitialRegion] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [allDroneDetails, setAllDroneDetails] = useState([]);
  const alertedDrones = useRef(new Set());
  const [sidebarLevel, setSidebarLevel] = useState(2);

  useFocusEffect(
    useCallback(() => {
      const fetchHomeData = async () => {
        try {
          const response = await fetch(API_URL);
          const data = await response.json();

          const visibleDrones = data.drones.filter((drone) =>
            isPointInPolygon(drone, data.alertZone),
          );

          visibleDrones.forEach((drone) => {
            if (isPointInPolygon(drone, data.defenseZone)) {
              if (!alertedDrones.current.has(drone.id)) {
                addAlert(drone.name);
                alertedDrones.current.add(drone.id);
              }
            } else {
              if (alertedDrones.current.has(drone.id))
                alertedDrones.current.delete(drone.id);
            }
          });

          setDrones(visibleDrones);
          setDefenseZone(data.defenseZone);
          setAlertZone(data.alertZone);
          setLoading(false);
          if (!initialRegion && data.initialRegion)
            setinitialRegion(data.initialRegion);
          if (data.detail) setAllDroneDetails(data.detail);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
      const interval = setInterval(fetchHomeData, 2000);
      fetchHomeData();
      return () => clearInterval(interval);
    }, [initialRegion]),
  );

  const handleDroneSelect = (basicDroneData) => {
    const detailData = allDroneDetails.find((d) => d.id === basicDroneData.id);
    const mergedData = detailData
      ? { ...detailData, ...basicDroneData }
      : basicDroneData;
    setSelectedDrone(mergedData);
    if (!isTablet) setModalVisible(true);
    if (isTablet && sidebarLevel < 2) setSidebarLevel(2);
  };

  const getActiveCameraDrone = () => {
    if (selectedDrone) return selectedDrone;

    if (drones.length > 0) {
      return drones.reduce((prev, curr) =>
        prev.distance < curr.distance ? prev : curr,
      );
    }

    return null;
  };

  const activeCameraDrone = getActiveCameraDrone();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  // Teblet
  if (isTablet) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: Platform.OS === "android" ? 30 : 0,
        }}
      >
        <View style={{ flex: 1, flexDirection: "row" }}>
          {sidebarLevel >= 1 && (
            <View style={styles.tabletColList}>
              {/* ส่วน Header */}
              <View style={styles.columnHeader}>
                <Text style={styles.headerText}>Drone Detected</Text>
                <TouchableOpacity onPress={() => setSidebarLevel(0)}>
                  <Ionicons name="chevron-back-circle" size={24} color="#999" />
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
                    {selectedDrone ? "LIVE FEED" : "AUTO TRACKING"}
                  </Text>
                </View>

                {activeCameraDrone && activeCameraDrone.imageUrl ? (
                  <>
                    <Image
                      source={{ uri: activeCameraDrone.imageUrl }}
                      style={styles.liveImage}
                      resizeMode="cover"
                    />
                    <View style={styles.cameraLabelOverlay}>
                      <Text style={styles.cameraLabelText}>
                        {activeCameraDrone.name} ({activeCameraDrone.distance}m)
                      </Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.noSignalBox}>
                    <Ionicons name="videocam-off" size={30} color="#ccc" />
                    <Text style={{ color: "#999", marginTop: 5, fontSize: 10 }}>
                      NO SIGNAL
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {sidebarLevel >= 2 && (
            <View style={styles.tabletColDetail}>
              <View style={styles.columnHeader}>
                <Text style={styles.headerText}>Detail</Text>
                <TouchableOpacity onPress={() => setSidebarLevel(1)}>
                  <Ionicons name="chevron-back-circle" size={24} color="#999" />
                </TouchableOpacity>
              </View>
              <DroneDetail drone={selectedDrone} />
            </View>
          )}

          <View style={{ flex: 5, position: "relative" }}>
            {sidebarLevel === 0 && (
              <TouchableOpacity
                style={styles.sidebarToggleBtn}
                onPress={() => setSidebarLevel(2)}
              >
                <Ionicons name="list" size={24} color="#007AFF" />
              </TouchableOpacity>
            )}
            <DroneMap
              style={{ width: "100%", height: "100%" }}
              drones={drones}
              alertZone={alertZone}
              defenseZone={defenseZone}
              initialRegion={initialRegion}
              onRegionChange={setMapRegion}
              isTablet={true}
              onCameraPress={() => navigation.navigate("Camera")}
            />
          </View>
        </View>

        <BottomTab navigation={navigation} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <DroneMap
        style={[styles.mapMobile, { paddingTop: headerHeight }]}
        drones={drones}
        alertZone={alertZone}
        defenseZone={defenseZone}
        initialRegion={initialRegion}
        onRegionChange={setMapRegion}
        isTablet={false}
      />

      <View style={styles.infoContainerMobile}>
        <DroneList
          drones={drones}
          selectedDrone={selectedDrone}
          onSelect={handleDroneSelect}
        />

        <TouchableOpacity
          style={styles.cameraButtonMobile}
          onPress={() => navigation.navigate("Camera")}
        >
          <Text style={styles.cameraButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
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
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  columnHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: { fontSize: 16, fontWeight: "bold", color: "black" }, // เอา marginBottom ออก เพราะจัดการใน columnHeader แล้ว

  // Tablet
  tabletColList: {
    flex: 2,
    padding: 20,
    borderRightWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  tabletColDetail: {
    flex: 3,
    padding: 20,
    borderRightWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#fff",
  },
  liveCameraBox: {
    height: 180,
    backgroundColor: "#000",
    borderRadius: 12,
    marginTop: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ddd",
    position: "relative",
  },
  liveImage: {
    width: "100%",
    height: "100%",
  },
  noSignalBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  cameraLabelOverlay: {
    position: "absolute",
    bottom: 5,
    left: 5,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cameraLabelText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },

  sidebarToggleBtn: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 20,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },

  // Mobile
  mapMobile: { 
    width: Dimensions.get("window").width, 
    height: "70%" 
  },
  infoContainerMobile: { 
    height: "30%", 
    padding: 15, 
    backgroundColor: "#fff" 
  },
  cameraButtonMobile: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  cameraButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },

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

export default HomeScreen;
