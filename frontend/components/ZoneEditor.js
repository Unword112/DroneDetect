import React from "react";
import { View, StyleSheet } from "react-native";
import { Polygon, Marker } from "react-native-maps";

import { MAP_COLORS } from "../pages/configscreen/MapColor";

const ZoneEditor = ({ defenseCoords, alertCoords, onMarkerDragEnd }) => {
  return (
    <>
      <Polygon
        coordinates={alertCoords}
        strokeColor={MAP_COLORS.alert.stroke}
        fillColor={MAP_COLORS.alert.fill}
        strokeWidth={2}
      />
      {alertCoords.map((coord, index) => (
        <Marker
          key={`alert-${index}`}
          coordinate={coord}
          draggable
          anchor={{ x: 0.25, y: 0.25 }}
          onDragEnd={(e) =>
            onMarkerDragEnd(index, e.nativeEvent.coordinate, "alert")
          }
        >
          <View
            style={[styles.editDot, { backgroundColor: MAP_COLORS.alert.dot }]}
          />
        </Marker>
      ))}

      <Polygon
        coordinates={defenseCoords}
        strokeColor={MAP_COLORS.defense.stroke}
        fillColor={MAP_COLORS.defense.fill}
        strokeWidth={2}
      />
      {defenseCoords.map((coord, index) => (
        <Marker
          key={`defense-${index}`}
          coordinate={coord}
          draggable
          anchor={{ x: 0.25, y: 0.25 }}
          onDragEnd={(e) =>
            onMarkerDragEnd(index, e.nativeEvent.coordinate, "defense")
          }
        >
          <View
            style={[
              styles.editDot,
              { backgroundColor: MAP_COLORS.defense.dot },
            ]}
          />
        </Marker>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  editDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 3.5,
    borderColor: "white",
    elevation: 5,
  },
});

export default ZoneEditor;
