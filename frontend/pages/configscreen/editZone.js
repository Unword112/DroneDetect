import React, { useEffect } from "react";
import { View, StyleSheet, Alert, TouchableOpacity, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import DroneMap from "../../components/DroneMap";
import ZoneEditor from "../../components/ZoneEditor";
import { useZoneSystem } from "../../hook/useZoneSystem";
import { currentMapRegion } from "./locationStore";

const EditZoneScreen = ({ navigation, route }) => {
  const { defenseZone, alertZone } = route.params || {};

  const {
    editDefenseCoords,
    editAlertCoords,
    startEditing,
    onMarkerDragEnd,
    handleSave,
  } = useZoneSystem(currentMapRegion, defenseZone, alertZone);

  useEffect(() => {
    startEditing();
  }, []);

  const onSaveSuccess = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <DroneMap
        style={styles.map}
        initialRegion={currentMapRegion}
      >
        <ZoneEditor
          defenseCoords={editDefenseCoords}
          alertCoords={editAlertCoords}
          onMarkerDragEnd={onMarkerDragEnd}
        />
      </DroneMap>

      <View style={styles.bottomContainer}>
        <Text style={styles.text}>ลากจุดเพื่อปรับพื้นที่</Text>
        <View style={{ flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity 
                style={[styles.btn, { backgroundColor: "#FF3B30" }]} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.btnText}>Cancel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
                style={[styles.btn, { backgroundColor: "#007AFF" }]} 
                onPress={() => handleSave(onSaveSuccess)}
            >
                <Text style={styles.btnText}>Save Zones</Text>
            </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { width: "100%", height: "100%" },
  bottomContainer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
    backgroundColor: "rgba(255,255,255,0.7)",
    padding: 5,
    borderRadius: 5
  },
  btn: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    elevation: 5,
  },
  btnText: { color: "white", fontWeight: "bold", fontSize: 16 },
});

export default EditZoneScreen;