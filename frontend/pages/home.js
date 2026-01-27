import React, { useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import {
  View,
  ActivityIndicator,
  Text,
  useWindowDimensions,
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";

import DesktopHome from "../components/desktop/DesktopHome";
import TabletHome from "../components/tablet/TabletHome";
import MobileHome from "../components/mobile/MobileHome";

import { setMapRegion, currentMapRegion } from "./configscreen/locationStore";
import { addAlert } from "./configscreen/alertStore";
import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/home-data`;

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const isDesktop = width >= 1280;
  const isTablet = width >= 768 && width < 1280;

  const mapRef = useRef(null);

  //console.log(width);

  const [drones, setDrones] = useState([]);
  const [defenseZone, setDefenseZone] = useState([]);
  const [alertZone, setAlertZone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialRegion, setinitialRegion] = useState(currentMapRegion);
  const mapInitialized = useRef(false);

  const [selectedDrone, setSelectedDrone] = useState(null);
  const [allDroneDetails, setAllDroneDetails] = useState([]);

  const [sidebarLevel, setSidebarLevel] = useState(0);
  const [viewMode, setViewMode] = useState("map");
  const [modalVisible, setModalVisible] = useState(false);

  const alertedDrones = useRef(new Set());

  //ใช้สำหรับเรียก image ไว้เพื่อ Demo App
  const getImageUrl = (imageName) => {
    if (!imageName) return null;
    return `http://${IP_HOST}:3000/api/get-image/${imageName}`;
  };

  const handleRegionChange = (region) => {
    setinitialRegion(region);
    setMapRegion(region);
  };

  useFocusEffect(
    useCallback(() => {
      
      if (mapRef.current && currentMapRegion) {
          mapRef.current.animateToRegion(currentMapRegion, 1000);
      }
        
      const fetchHomeData = async () => {

        try {
          const response = await fetch(API_URL);
          const data = await response.json();

          const visibleDrones = data.drones;

          visibleDrones.forEach((drone) => {
            if (drone.inDefenseZone) {
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

          if (!mapInitialized.current && data.initialRegion) {
            setinitialRegion(data.initialRegion);
            setMapRegion(data.initialRegion);
            mapInitialized.current = true;
          }
          //console.log(initialRegion);

          if (data.detail) setAllDroneDetails(data.detail);
        } catch (error) {
          console.error("Error fetching data:", error);
          setLoading(false);
        }
      };
      const interval = setInterval(fetchHomeData, 2000);
      fetchHomeData();
      return () => clearInterval(interval);
    }, []),
  );

  //log check zone output every 1 second
  const timestamp = useRef(0);
  const DELAY_MS = 5000;
  const now = Date.now();

  if (now - timestamp.current > DELAY_MS) {
    console.log("defense Zone:", defenseZone);
    console.log("alert Zone:", alertZone);

    timestamp.current = now; 
  }

  const handleDroneSelect = (basicDroneData) => {
    const detailData = allDroneDetails.find((d) => d.id === basicDroneData.id);
    const mergedData = detailData
      ? { ...detailData, ...basicDroneData }
      : basicDroneData;
    setSelectedDrone(mergedData);

    if (!isDesktop && !isTablet) setModalVisible(true);
    if ((isTablet || isDesktop) && sidebarLevel < 2) setSidebarLevel(2);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text>Loading...</Text>
      </View>
    );
  }

  const commonProps = {
    navigation,
    drones,
    defenseZone,
    alertZone,
    initialRegion,
    selectedDrone,
    getImageUrl,
    handleDroneSelect,
    handleRegionChange,
    viewMode,
    setViewMode,
    mapRef
  };

  if (isDesktop) {
    return (
      <DesktopHome 
        {...commonProps} 
        sidebarLevel={sidebarLevel}
        setSidebarLevel={setSidebarLevel}
      />
    );
  }

  if (isTablet) {
    return (
      <TabletHome
        {...commonProps}
        sidebarLevel={sidebarLevel}
        setSidebarLevel={setSidebarLevel}
      />
    );
  }

  return (
    <MobileHome
      {...commonProps}
      headerHeight={headerHeight}
      modalVisible={modalVisible}
      setModalVisible={setModalVisible}
    />
  );
};

export default HomeScreen;
