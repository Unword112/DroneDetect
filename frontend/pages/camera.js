import React, { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { 
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, 
    useWindowDimensions, Platform, Image
} from "react-native";
import { useHeaderHeight } from "@react-navigation/elements";
import { Ionicons } from '@expo/vector-icons';

import DroneList from "../components/DroneList";
import DroneDetail from "../components/DroneDetail";
import BottomTab from "../components/BottomTab";

import { IP_HOST } from "@env";

const API_URL = `http://${IP_HOST}:3000/api/home-data`;
const CAMERA_FEED_URL = `http://${IP_HOST}:3000/api/camera-live?t=${new Date().getTime()}`;

const CameraScreen = ({ navigation }) => {
    const headerHeight = useHeaderHeight();
    const { width } = useWindowDimensions();
    const isTablet = width >= 768;

    const [drones, setDrones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [allDroneDetails, setAllDroneDetails] = useState([]);
    
    const [sidebarLevel, setSidebarLevel] = useState(2);

    useFocusEffect(
        useCallback(() => {
            const fetchCameraData = async () => {
                try {
                    const response = await fetch(API_URL);
                    const data = await response.json();
                    
                    setDrones(data.drones); 
                    setAllDroneDetails(data.detail);
                    setLoading(false);

                } catch (error) {
                    console.error("Error fetching camera data:", error);
                    setLoading(false);
                }
            };
            
            const interval = setInterval(fetchCameraData, 2000);
            fetchCameraData();
            return () => clearInterval(interval);
        }, [])
    );

    const handleDroneSelect = (basicDroneData) => {
        const detailData = allDroneDetails.find((d) => d.id === basicDroneData.id);
        const mergedData = detailData ? { ...detailData, ...basicDroneData } : basicDroneData;
        setSelectedDrone(mergedData);
        
        if (isTablet && sidebarLevel < 2) setSidebarLevel(2);
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>Connecting to Camera Feed...</Text>
            </View>
        );
    }

    const renderCameraView = () => (
        <View style={styles.cameraContainer}>
            <Image
                source={{ uri: CAMERA_FEED_URL }}
                style={styles.cameraImage}
                resizeMode="cover"
            />
            
            <View style={styles.statusOverlay}>
                <View style={styles.redDot} />
                <Text style={styles.statusText}>LIVE</Text>
            </View>
        </View>
    );

    // --- Layout for Tablet ---
    if (isTablet) {
        return (
            <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: Platform.OS === 'android' ? 30 : 0 }}>
                <View style={{ flex: 1, flexDirection: "row" }}>
                    
                    {sidebarLevel >= 1 && (
                        <View style={styles.tabletColList}>
                            <View style={styles.columnHeader}>
                                <Text style={styles.headerText}>Drone Detected</Text>
                                <TouchableOpacity onPress={() => setSidebarLevel(0)}>
                                    <Ionicons name="chevron-back-circle" size={24} color="#999" />
                                </TouchableOpacity>
                            </View>
                            <DroneList 
                                drones={drones} 
                                selectedDrone={selectedDrone} 
                                onSelect={handleDroneSelect} 
                            />
                        </View>
                    )}

                    {sidebarLevel >= 2 && (
                        <View style={styles.tabletColDetail}>
                            <View style={styles.columnHeader}>
                                <Text style={styles.headerText}>Detail</Text>
                                <TouchableOpacity onPress={() => setSidebarLevel(1)}>
                                    <Ionicons name="chevron-back-circle" size={24} color="#999" />
                                </TouchableOpacity>
                            </View>
                            <DroneDetail drone={selectedDrone} />
                        </View>
                    )}

                    <View style={{ flex: 5, position: 'relative', backgroundColor: 'black' }}>
                        {sidebarLevel === 0 && (
                            <TouchableOpacity style={styles.sidebarToggleBtn} onPress={() => setSidebarLevel(2)}>
                                <Ionicons name="list" size={24} color="#007AFF" />
                            </TouchableOpacity>
                        )}
                        
                        {renderCameraView()}
                    </View>
                </View>

                <BottomTab navigation={navigation} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={{ flex: 1 }}>
                {renderCameraView()}
                 <TouchableOpacity style={styles.backButtonMobile} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#000" },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    
    tabletColList: { flex: 2, padding: 20, borderRightWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
    tabletColDetail: { flex: 3, padding: 20, borderRightWidth: 1, borderColor: "#eee", backgroundColor: "#fff" },
    
    columnHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    headerText: { fontSize: 16, fontWeight: "bold", color: "black" },
    
    sidebarToggleBtn: {
        position: 'absolute', top: 20, left: 20, zIndex: 20,
        backgroundColor: 'white', padding: 10, borderRadius: 8,
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, elevation: 4,
    },

    cameraContainer: { 
        width: '100%', 
        height: '100%', 
        backgroundColor: 'black',
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    waitText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'lowercase'
    },

    backButtonMobile: {
        position: 'absolute', top: 40, left: 20,
        backgroundColor: 'rgba(0,0,0,0.5)', padding: 10, borderRadius: 20
    }
});

export default CameraScreen;