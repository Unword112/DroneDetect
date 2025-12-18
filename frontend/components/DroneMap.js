import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Polygon, Marker } from "react-native-maps";

const DroneMap = ({
  drones,
  alertZone,
  defenseZone,
  initialRegion,
  onRegionChange,
  isTablet,
  onCameraPress,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      {isTablet && (
        <TouchableOpacity
          style={styles.floatingCameraBtn}
          onPress={onCameraPress}
        >
          <Text style={styles.cameraButtonText}>Camera</Text>
        </TouchableOpacity>
      )}

      <MapView
        style={styles.mapFill}
        onRegionChangeComplete={onRegionChange}
        initialRegion={initialRegion}
      >
        {alertZone.length > 0 && (
          <Polygon
            coordinates={alertZone}
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={1}
            fillColor="rgba(0,180,255,0.3)"
          />
        )}
        {defenseZone.length > 0 && (
          <Polygon
            coordinates={defenseZone}
            strokeColor="rgba(0,0,0,0.5)"
            strokeWidth={1}
            fillColor="rgba(255,69,0,0.4)"
          />
        )}
        {drones.map((drone) => (
          <Marker
            key={drone.id}
            coordinate={{ latitude: drone.lat, longitude: drone.lon }}
            title={drone.name}
          >
            <View style={styles.droneMarker} />
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { position: "relative", overflow: "hidden", borderRadius: 0 }, // container ของ map
  mapFill: { width: "100%", height: "100%" },
  droneMarker: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "yellow",
    borderWidth: 1,
    borderColor: "#000",
  },
  floatingCameraBtn: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "#007AFF",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    zIndex: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cameraButtonText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default DroneMap;
