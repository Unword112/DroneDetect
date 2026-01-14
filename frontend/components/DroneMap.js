import React, { forwardRef } from "react";
import { View, StyleSheet, Image } from "react-native";
import MapView, { Polygon, Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';

import { grayMapStyle, MAP_COLORS } from "../pages/configscreen/MapColor";

const DroneMap = forwardRef(({
  drones = [],
  dronePaths = [],
  alertZone = [],
  defenseZone = [],
  initialRegion,
  onRegionChange,
  style,
  children,
  ...props
}, ref ) => {

  const mapRef = useRef<MapView | null>(null);

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={ref}

        provider={PROVIDER_GOOGLE}
        customMapStyle={grayMapStyle}
        
        style={styles.mapFill}
        initialRegion={initialRegion}
        onRegionChangeComplete={onRegionChange}
        {...props}
      >
        {alertZone && alertZone.length > 0 && (
          <Polygon
            coordinates={alertZone}
            strokeColor={MAP_COLORS.alert.stroke}
            strokeWidth={1}
            fillColor={MAP_COLORS.alert.fill}
          />
        )}
        {defenseZone && defenseZone.length > 0 && (
          <Polygon
            coordinates={defenseZone}
            strokeColor={MAP_COLORS.defense.stroke}
            strokeWidth={1}
            fillColor={MAP_COLORS.defense.fill}
          />
        )}

        {dronePaths && dronePaths.map((dronePath) => (
            <Polyline
              key={`path-${dronePath.id}`}
              coordinates={dronePath.path.map(p => ({
                  latitude: p.lat,   // แปลง lat ใน mock เป็น latitude
                  longitude: p.lon   // แปลง lon ใน mock เป็น longitude
              }))}
              strokeColor="red"      // สีเส้น (ปรับตามใจชอบ หรือใช้ MAP_COLORS)
              strokeWidth={2}        // ความหนาเส้น
              lineDashPattern={[5, 5]} // (Optional) ทำให้เป็นเส้นประ ถ้าอยากได้
            />
        ))}

        {drones.map((drone) => (
          <Marker
            key={drone.id}
            coordinate={{ latitude: drone.lat, longitude: drone.lon }}
            title={drone.name}
          >
            <View
              style={[
                styles.droneMarker,
                { backgroundColor: MAP_COLORS.drone.bg },
              ]}
            />
          </Marker>
        ))}

        {children}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { position: "relative", overflow: "hidden" },
  mapFill: { width: "100%", height: "100%" },
  droneMarker: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3.5,
    borderColor: "white",
    elevation: 5,
  },
});

export default DroneMap;
