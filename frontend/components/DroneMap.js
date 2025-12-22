import React, { useMemo } from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import MapView, { Polygon, Marker, Polyline } from "react-native-maps";

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
  const defenseCenter = useMemo(() => {
    if (!defenseZone || defenseZone.length === 0) return null;

    let minLat = defenseZone[0].latitude;
    let maxLat = defenseZone[0].latitude;
    let minLon = defenseZone[0].longitude;
    let maxLon = defenseZone[0].longitude;

    defenseZone.forEach((point) => {
      if (point.latitude < minLat) minLat = point.latitude;
      if (point.latitude > maxLat) maxLat = point.latitude;
      if (point.longitude < minLon) minLon = point.longitude;
      if (point.longitude > maxLon) maxLon = point.longitude;
    });

    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLon + maxLon) / 2,
    };
  }, [defenseZone]);

  return (
    <View style={[styles.container, style]}>
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
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "yellow",
    borderWidth: 1,
    borderColor: "#000",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    elevation: 5,
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
