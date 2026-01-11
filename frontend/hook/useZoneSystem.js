// hooks/useZoneSystem.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { IP_HOST } from "@env";

const API_UPDATE_ZONE = `http://${IP_HOST}:3000/api/update-zones`;

const createSquare = (centerLat, centerLon, size) => {
  if (!centerLat || !centerLon) return [];
  return [
    { latitude: centerLat + size, longitude: centerLon - size },
    { latitude: centerLat + size, longitude: centerLon + size },
    { latitude: centerLat - size, longitude: centerLon + size },
    { latitude: centerLat - size, longitude: centerLon - size },
  ];
};

export const useZoneSystem = (initialRegion, savedDefenseZone, savedAlertZone) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDefenseCoords, setEditDefenseCoords] = useState([]);
  const [editAlertCoords, setEditAlertCoords] = useState([]);

  const startEditing = () => {
    const startLat = initialRegion?.latitude || 13.785;
    const startLon = initialRegion?.longitude || 100.55;

    setEditDefenseCoords(
      savedDefenseZone && savedDefenseZone.length > 0
        ? savedDefenseZone
        : createSquare(startLat, startLon, 0.001)
    );
    setEditAlertCoords(
      savedAlertZone && savedAlertZone.length > 0
        ? savedAlertZone
        : createSquare(startLat, startLon, 0.002)
    );
    setIsEditing(true);
  };

  const onMarkerDragEnd = (index, newCoordinate, type) => {
    if (type === "defense") {
      const newCoords = [...editDefenseCoords];
      newCoords[index] = newCoordinate;
      setEditDefenseCoords(newCoords);
    } else {
      const newCoords = [...editAlertCoords];
      newCoords[index] = newCoordinate;
      setEditAlertCoords(newCoords);
    }
  };

  const handleSave = async (onSuccess) => {
    try {
      const response = await fetch(API_UPDATE_ZONE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          defenseZone: editDefenseCoords,
          alertZone: editAlertCoords,
        }),
      });
      const result = await response.json();
      if (result.success) {
        Alert.alert("Success", "Zones updated successfully!");
        setIsEditing(false);
        if (onSuccess) onSuccess();
      } else {
        Alert.alert("Error", "Failed to update zones");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Connection failed");
    }
  };

  const handleCancel = () => {
      setIsEditing(false);
  }

  return {
    isEditing,
    editDefenseCoords,
    editAlertCoords,
    startEditing,
    onMarkerDragEnd,
    handleSave,
    handleCancel
  };
};