import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';
import { useHeaderHeight } from '@react-navigation/elements';
import { setMapRegion } from './configscreen/locationStore';

// ลบหลังจากได้ backend แล้ว
const mockDroneData = [
    { id: 14, name: 'TARGET 14', distance: 170.49, lat: 13.7845, lon: 100.5510 }, 
    { id: 15, name: 'TARGET 15', distance: 210.74, lat: 13.7880, lon: 100.5480 }, 
];

// ลบหลังจากได้ backend แล้ว
const defenseBoundaryCoords = [
    { latitude: 13.7850, longitude: 100.5480 },
    { latitude: 13.7870, longitude: 100.5510 },
    { latitude: 13.7840, longitude: 100.5530 },
    { latitude: 13.7820, longitude: 100.5495 },
    { latitude: 13.7850, longitude: 100.5480 },
];

// ลบหลังจากได้ backend แล้ว
const alertZoneCoords = [
    { latitude: 13.7900, longitude: 100.5560 },
    { latitude: 13.7920, longitude: 100.5450 },
    { latitude: 13.7800, longitude: 100.5400 },
    { latitude: 13.7750, longitude: 100.5550 },
    { latitude: 13.7900, longitude: 100.5560 },
];

// ลบหลังจากได้ backend แล้ว
const initialRegion = {
    latitude: 13.7563,  
    longitude: 100.5018,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
};

const HomeScreen = ({ navigation }) => {
    
    const headerHeight = useHeaderHeight();
    const onRegionChangeComplete = (region) => {
        setMapRegion(region);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={[styles.map, { paddingTop: headerHeight }]}

                // ลบหลังจากได้ backend แล้ว
                initialRegion={{
                    latitude: 13.7850,
                    longitude: 100.5500,
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                }}
                
                onRegionChangeComplete={onRegionChangeComplete}
            >
                <Polygon 
                    coordinates={alertZoneCoords}
                    strokeColor="rgba(0, 0, 0, 0.5)"
                    strokeWidth={1}
                    fillColor="rgba(0, 180, 255, 0.3)" 
                />

                <Polygon 
                    coordinates={defenseBoundaryCoords}
                    strokeColor="rgba(0, 0, 0, 0.5)"
                    strokeWidth={1}
                    fillColor="rgba(255, 69, 0, 0.4)" 
                />
            </MapView>

            <View style={styles.infoContainer}>
                <View style={styles.listContainer}>
                    <Text style={styles.headerText}>DRONE DETECTED</Text>
                    
                    {mockDroneData.map((drone) => (
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
    container: {
        flex: 1,
    },
    map: {
        width: Dimensions.get('window').width,
        height: '70%', 
    },
    infoContainer: { 
        height: '30%',
        padding: 15,
        backgroundColor: '#fff', 
    },
    listContainer: { flex: 1, },
    listItem: { flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee', 
    },
    targetText: {
        fontSize: 16,
        fontWeight: '600',
        flex: 1, 
    },
    distanceText: { 
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    indicator: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4AC2F9',
    },
    cameraButton: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 10,
    },
    cameraButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold', 
    },
});

export default HomeScreen;