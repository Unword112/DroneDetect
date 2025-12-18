import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { IP_HOST } from "@env"; // เรียกใช้ IP จาก .env

// URL ของ API
const API_URL = `http://${IP_HOST}:3000/api/home-data`;

const CameraScreen = ({ navigation }) => {
  const headerHeight = useHeaderHeight();

  // State สำหรับเก็บข้อมูลต่างๆ
  const [drones, setDrones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDrone, setSelectedDrone] = useState(null);
  const [allDroneDetails, setAllDroneDetails] = useState([]);

  // ดึงข้อมูลเมื่อหน้านี้ถูกเปิด (เหมือนหน้า Home)
  useFocusEffect(
    useCallback(() => {
      const fetchHomeData = async () => {
        try {
          const response = await fetch(API_URL);
          const data = await response.json();

          // ในหน้ากล้อง เราอาจจะแสดงโดรนทั้งหมดที่ server ส่งมา
          // โดยไม่ต้องกรอง zone ก็ได้ หรือจะกรองก็ได้แล้วแต่ logic ที่ต้องการ
          setDrones(data.drones);

          if (data.detail) {
            setAllDroneDetails(data.detail);
          }
          setLoading(false);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };

      fetchHomeData();
      return () => {};
    }, []),
  );

  // ฟังก์ชันเมื่อกดเลือกโดรน (เหมือนหน้า Home)
  const handleDronePress = (basicDroneData) => {
    const detailData = allDroneDetails.find((d) => d.id === basicDroneData.id);
    if (detailData) {
      setSelectedDrone({
        ...detailData,
        lat: basicDroneData.lat,
        lon: basicDroneData.lon,
      });
    } else {
      setSelectedDrone(basicDroneData);
    }
    setModalVisible(true);
  };

  // แสดง Loading ระหว่างรอข้อมูล
  if (loading) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: "center", alignItems: "center" },
        ]}
      >
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>กำลังโหลดข้อมูล...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- ส่วนบน: Placeholder สำหรับกล้อง --- */}
      <View style={[styles.cameraPlaceholder, { marginTop: headerHeight }]}>
        <Text style={styles.cameraText}>wait camera</Text>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.listContainer}>
          <Text style={styles.headerText}>DRONE DETECTED</Text>
          {drones.map((drone) => (
            <TouchableOpacity
              key={drone.id}
              onPress={() => handleDronePress(drone)}
            >
              <View style={styles.listItem}>
                <Text style={styles.targetText}>{drone.name}</Text>
                <Text style={styles.distanceText}>{drone.distance} m</Text>
                <View style={styles.indicator} />
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={styles.cameraButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cameraButtonText}>Back</Text>
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
            {selectedDrone && (
              <>
                <Text style={styles.modalHeader}>DRONE DETECTED</Text>
                <Text style={styles.modalTitle}>{selectedDrone.name}</Text>
                <View style={styles.divider} />
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>DISTANCE</Text>
                  <Text style={styles.detailValue}>
                    {selectedDrone.distance} m
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Location</Text>
                  <Text style={styles.detailValue}>
                    {selectedDrone.lat ? selectedDrone.lat.toFixed(6) : "-"},{" "}
                    {selectedDrone.lon ? selectedDrone.lon.toFixed(6) : "-"}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Speed</Text>
                  <Text style={styles.detailValue}>
                    {selectedDrone.speed} m/s
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>POI</Text>
                  <Text style={styles.detailValue}>{selectedDrone.POI} m</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Altitude</Text>
                  <Text style={styles.detailValue}>
                    {selectedDrone.Altitude} m
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Heading</Text>
                  <Text style={styles.detailValue}>
                    {selectedDrone.Heading}°
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Reach in</Text>
                  <Text style={styles.detailValue}>
                    {selectedDrone.ReachIn} sec
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ color: "#666" }}>Close</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  cameraPlaceholder: {
    width: Dimensions.get("window").width,
    height: "70%",
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  infoContainer: { height: "30%", padding: 15, backgroundColor: "#fff" },
  listContainer: { flex: 1 },
  headerText: {
    fontSize: 12,
    color: "#868686",
    fontWeight: "500",
    marginBottom: 10,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  targetText: { fontSize: 16, fontWeight: "600", flex: 1 },
  distanceText: { fontSize: 16, fontWeight: "600", marginRight: 10 },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#4AC2F9",
  },
  cameraButton: {
    backgroundColor: "#007AFF",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  cameraButtonText: { color: "white", fontSize: 18, fontWeight: "bold" },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
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
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 15 },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: { fontSize: 16, color: "#333" },
  detailValue: { fontSize: 16, fontWeight: "600", color: "black" },
  closeButton: { alignItems: "center", padding: 15, marginTop: 10 },
});

export default CameraScreen;
