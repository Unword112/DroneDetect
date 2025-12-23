import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
} from "react-native"; 
import MapView, { Polygon, Marker } from "react-native-maps";
import { currentMapRegion } from "./locationStore";

import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/update-zones`;

const createSquare = (centerLat, centerLon, size) => {
  return [
    { latitude: centerLat + size, longitude: centerLon - size },
    { latitude: centerLat + size, longitude: centerLon + size },
    { latitude: centerLat - size, longitude: centerLon + size },
    { latitude: centerLat - size, longitude: centerLon - size },
  ];
};

const EditZoneScreen = ({ navigation }) => {
  const startLat = currentMapRegion?.latitude || 13.785;
  const startLon = currentMapRegion?.longitude || 100.55;

  const [defenseCoords, setDefenseCoords] = useState(
    createSquare(startLat, startLon, 0.001),
  );
  const [alertCoords, setAlertCoords] = useState(
    createSquare(startLat, startLon, 0.002),
  );

  const onMarkerDragEnd = (index, newCoordinate, type) => {
    if (type === "defense") {
      const newCoords = [...defenseCoords];
      newCoords[index] = newCoordinate;
      setDefenseCoords(newCoords);
    } else {
      const newCoords = [...alertCoords];
      newCoords[index] = newCoordinate;
      setAlertCoords(newCoords);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          defenseZone: defenseCoords,
          alertZone: alertCoords,
        }),
      });

      const result = await response.json();

      if (result.success) {
        Alert.alert("สำเร็จ", "บันทึกโซนเรียบร้อยแล้ว", [
          { text: "OK", onPress: () => navigation.goBack() }, // บันทึกเสร็จให้กลับไปหน้าเดิม
        ]);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "ไม่สามารถเชื่อมต่อ Server ได้");
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: startLat,
          longitude: startLon,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
      >
        <Polygon
          coordinates={alertCoords}
          strokeColor="#4AC2F9"
          fillColor="rgba(74, 194, 249, 0.2)"
          strokeWidth={2}
        />
        {alertCoords.map((coord, index) => (
          <Marker
            key={`alert-${index}`}
            coordinate={coord}
            draggable
            anchor={{ x: 0.5, y: 0.5 }}
            onDragEnd={(e) =>
              onMarkerDragEnd(index, e.nativeEvent.coordinate, "alert")
            }
          >
            <View style={[styles.editDot, { backgroundColor: "#4AC2F9" }]} />
          </Marker>
        ))}

        <Polygon
          coordinates={defenseCoords}
          strokeColor="#FF4500"
          fillColor="rgba(255, 69, 0, 0.3)"
          strokeWidth={2}
        />
        {defenseCoords.map((coord, index) => (
          <Marker
            key={`defense-${index}`}
            coordinate={coord}
            draggable
            anchor={{ x: 0.5, y: 0.5 }}
            onDragEnd={(e) =>
              onMarkerDragEnd(index, e.nativeEvent.coordinate, "defense")
            }
          >
            <View style={[styles.editDot, { backgroundColor: "#FF4500" }]} />
          </Marker>
        ))}
      </MapView>

      <View style={styles.bottomContainer}>
        <Text style={styles.text}>ลากจุดเพื่อปรับแต่งพื้นที่</Text>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>บันทึกโซน (Save)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: Dimensions.get("window").width, height: "100%" },
  editDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    elevation: 5,
  },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    marginBottom: 10,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  saveButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
  },
  saveButtonText: { color: "white", fontWeight: "bold", fontSize: 18 },
});

export default EditZoneScreen;
