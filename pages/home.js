import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useHeaderHeight } from '@react-navigation/elements';
import { setMapRegion } from './configscreen/locationStore';

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

    useFocusEffect(
        useCallback(() => {
            const fetchHomeData = async () => {
                try {
                    const response = await fetch(API_URL); 
                    const data = await response.json();

                    const fetchedAlertZone = data.alertZone;

                    const visibleDrones = data.drones.filter(drone => {
                        return isPointInPolygon(drone, fetchedAlertZone);
                    });

                    setDrones(visibleDrones);
                    setDefenseZone(data.defenseZone);
                    setAlertZone(fetchedAlertZone);
                    setLoading(false);
                    setinitialRegion(data.initialRegion);

                } catch (error) {
                    console.error("Error fetching data:", error);
                    setLoading(false);
                }
            };

            fetchHomeData();
            return () => {};
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
                        <View key={drone.id} style={styles.listItem}>
                            <Text style={styles.targetText}>{drone.name}</Text>
                            <Text style={styles.distanceText}>{drone.distance} m</Text>
                            <View style={styles.indicator} />
                        </View>
                    ))}
                </View>
                <TouchableOpacity 
                    style={styles.cameraButton}
                    onPress={() => navigation.navigate('Camera')}
                >
                    <Text style={styles.cameraButtonText}>Camera</Text>
                </TouchableOpacity>
            </View>
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
    droneMarker: { width: 10, height: 10, borderRadius: 5, backgroundColor: 'yellow', borderWidth: 1, borderColor: '#000' }
});

export default HomeScreen;