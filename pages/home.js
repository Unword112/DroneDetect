import React, { useState, useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator, Modal, ScrollView } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useHeaderHeight } from '@react-navigation/elements';

import { setMapRegion } from './configscreen/locationStore';
import { addAlert } from './configscreen/alertStore';

import { IP_HOST } from '@env';

const  API_URL = `http://${IP_HOST}:3000/api/home-data`;

const isPointInPolygon = (point, polygon) => {
    const x = point.lat;
    const y = point.lon;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude, yi = polygon[i].longitude;
        const xj = polygon[j].latitude, yj = polygon[j].longitude;

        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

const HomeScreen = ({ navigation }) => {
    const headerHeight = useHeaderHeight();

    const [drones, setDrones] = useState([]);
    const [defenseZone, setDefenseZone] = useState([]);
    const [alertZone, setAlertZone] = useState([]);
    const [loading, setLoading] = useState(true);
    const [initialRegion, setinitialRegion] = useState(null);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDrone, setSelectedDrone] = useState(null);
    const [allDroneDetails, setAllDroneDetails] = useState([]);
    const alertedDrones = useRef(new Set());
    
    const handleDronePress = (basicDroneData) => {
        const detailData = allDroneDetails.find(d => d.id === basicDroneData.id);

        if (detailData) {
            setSelectedDrone({
                ...detailData,
                lat: basicDroneData.lat,
                lon: basicDroneData.lon 
            });
        } else {
            setSelectedDrone(basicDroneData);
        }
        
        setModalVisible(true);
    };

    useFocusEffect(
        useCallback(() => {
            const fetchHomeData = async () => {
                try {
                    const response = await fetch(API_URL); 
                    const data = await response.json();

                    const fetchedAlertZone = data.alertZone;
                    const fetchedDefenseZone = data.defenseZone;

                    const visibleDrones = data.drones.filter(drone => {
                        return isPointInPolygon(drone, fetchedAlertZone);
                    });

                    visibleDrones.forEach(drone => {
                        const isInRedZone = isPointInPolygon(drone, fetchedDefenseZone);
                        
                        if (isInRedZone) {
                            if (!alertedDrones.current.has(drone.id)) {
                                console.log(`Alert! Drone ${drone.name} entered red zone`);
                                addAlert(drone.name);
                                alertedDrones.current.add(drone.id);
                            }
                        } else {
                            if (alertedDrones.current.has(drone.id)) {
                                alertedDrones.current.delete(drone.id);
                            }
                        }
                    });

                    setDrones(visibleDrones);
                    setDefenseZone(data.defenseZone);
                    setAlertZone(fetchedAlertZone);
                    setLoading(false);
                    setinitialRegion(data.initialRegion);

                    if (data.detail) {
                        setAllDroneDetails(data.detail);
                    }

                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                }
            };

            const interval = setInterval(fetchHomeData, 2000);
            
            fetchHomeData();
            return () => clearInterval(interval);
        }, [])
    );

    const onRegionChangeComplete = (region) => {
        setMapRegion(region);
    };

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#007AFF" />
                <Text>กำลังโหลดข้อมูล...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={[styles.map, { paddingTop: headerHeight }]}
                onRegionChangeComplete={onRegionChangeComplete}
                initialRegion={initialRegion}
            >
                {alertZone.length > 0 && (
                    <Polygon 
                        coordinates={alertZone}
                        strokeColor="rgba(0, 0, 0, 0.5)"
                        strokeWidth={1}
                        fillColor="rgba(0, 180, 255, 0.3)" 
                    />
                )}

                {defenseZone.length > 0 && (
                    <Polygon 
                        coordinates={defenseZone}
                        strokeColor="rgba(0, 0, 0, 0.5)"
                        strokeWidth={1}
                        fillColor="rgba(255, 69, 0, 0.4)" 
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

            <View style={styles.infoContainer}>
                <View style={styles.listContainer}>
                    <Text style={styles.headerText}>DRONE DETECTED</Text>
                    
                    {/* 6. วนลูปแสดงข้อมูลโดรนจาก State */}
                    {drones.map((drone) => (
                        <TouchableOpacity
                            key={drone.id}
                            onPress={() => handleDronePress(drone)}
                        >
                        <View key={drone.id} style={styles.listItem}>
                            <Text style={styles.targetText}>{drone.name}</Text>
                            <Text style={styles.distanceText}>{drone.distance} m</Text>
                            <View style={styles.indicator} />
                        </View>
                        </TouchableOpacity>
                    ))}
                </View>
                <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.cameraButtonText}>Camera</Text>
                </TouchableOpacity>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalIndicator} />

                        {selectedDrone && (
                            <>
                                <Text style={styles.modalHeader}>DRONE DETECTED</Text>
                                <Text style={styles.modalTitle}>{selectedDrone.name}</Text>

                                <View style={styles.divider} />

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>DISTANCE</Text>
                                    <Text style={styles.detailValue}>{selectedDrone.distance} m</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Location</Text>
                                    <Text style={styles.detailValue}>
                                        {selectedDrone.lat ? selectedDrone.lat.toFixed(6) : '-'}, {selectedDrone.lon ? selectedDrone.lon.toFixed(6) : '-'}
                                    </Text>
                                </View>
                                
                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Speed</Text>
                                    <Text style={styles.detailValue}>{selectedDrone.speed} m/s</Text> 
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>POI</Text>
                                    <Text style={styles.detailValue}>{selectedDrone.POI} m</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Altitude</Text>
                                    <Text style={styles.detailValue}>{selectedDrone.Altitude} m</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Heading</Text>
                                    <Text style={styles.detailValue}>{selectedDrone.Heading}°</Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <Text style={styles.detailLabel}>Reach in</Text>
                                    <Text style={styles.detailValue}>{selectedDrone.ReachIn} sec</Text>
                                </View>
                                
                                <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                                    <Text style={{color: '#666'}}>Close</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: Dimensions.get('window').width, height: '70%' },
    infoContainer: { height: '30%', padding: 15, backgroundColor: '#fff' },
    listContainer: { flex: 1 },
    listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
    targetText: { fontSize: 16, fontWeight: '600', flex: 1 },
    distanceText: { fontSize: 16, fontWeight: '600', marginRight: 10 },
    indicator: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#4AC2F9' },
    cameraButton: { backgroundColor: '#007AFF', padding: 15, borderRadius: 8, alignItems: 'center', marginBottom: 10 },
    cameraButtonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
    droneMarker: { 
        width: 10, 
        height: 10, 
        borderRadius: 5, 
        backgroundColor: 'yellow', 
        borderWidth: 1, 
        borderColor: '#000' 
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 20,
        minHeight: 400,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalIndicator: {
        width: 40,
        height: 5,
        backgroundColor: '#ccc',
        borderRadius: 3,
        alignSelf: 'center',
        marginBottom: 15,
    },
    modalHeader: {
        fontSize: 12,
        color: '#868686',
        fontWeight: '500',
        textTransform: 'uppercase',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: 'black',
        marginVertical: 5,
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    detailLabel: {
        fontSize: 16,
        color: '#333',
    },
    detailValue: {
        fontSize: 16,
        fontWeight: '600',
        color: 'black',
    },
    modalButton: {
        backgroundColor: '#007AFF',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 20,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    closeButton: {
        alignItems: 'center',
        padding: 15,
    }
});

export default HomeScreen;