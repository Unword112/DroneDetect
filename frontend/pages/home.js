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

import { setMapRegion } from "./configscreen/locationStore";
import { addAlert } from "./configscreen/alertStore";
import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/home-data`;

const HomeScreen = ({ navigation }) => {
  const { width } = useWindowDimensions();
  const headerHeight = useHeaderHeight();

  const isDesktop = width >= 1024;
  const isTablet = width >= 768 && width < 1024;

  console.log(width);

  const [drones, setDrones] = useState([]);
  const [defenseZone, setDefenseZone] = useState([]);
  const [alertZone, setAlertZone] = useState([]);
  const [loading, setLoading] = useState(true);
  const [initialRegion, setinitialRegion] = useState(null);
  const mapInitialized = useRef(false);

  const [selectedDrone, setSelectedDrone] = useState(null);
  const [allDroneDetails, setAllDroneDetails] = useState([]);

  const [sidebarLevel, setSidebarLevel] = useState(2);
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
            mapInitialized.current = true;
          }

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

  const handleDroneSelect = (basicDroneData) => {
    const detailData = allDroneDetails.find((d) => d.id === basicDroneData.id);
    const mergedData = detailData
      ? { ...detailData, ...basicDroneData }
      : basicDroneData;
    setSelectedDrone(mergedData);

    if (!isDesktop && !isTablet) setModalVisible(true);
    if (isTablet && sidebarLevel < 2) setSidebarLevel(2);
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
  };

  if (isDesktop) {
    return <DesktopHome {...commonProps} />;
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
