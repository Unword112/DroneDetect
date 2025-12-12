import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MapView, { Polygon, Marker } from 'react-native-maps';

import { currentMapRegion } from './locationStore';

// ลบหลังจากได้ backend แล้ว
const createSquare = (centerLat, centerLon, size) => {
    return [
        { latitude: centerLat + size, longitude: centerLon - size },
        { latitude: centerLat + size, longitude: centerLon + size },
        { latitude: centerLat - size, longitude: centerLon + size },
        { latitude: centerLat - size, longitude: centerLon - size },
    ];
};

const EditZoneScreen = () => {
    const startLat = currentMapRegion?.latitude || 13.7850;
    const startLon = currentMapRegion?.longitude || 100.5500;

    const [defenseCoords, setDefenseCoords] = useState(
        createSquare(startLat, startLon, 0.001) // สีแดง
    );
    const [alertCoords, setAlertCoords] = useState(
        createSquare(startLat, startLon, 0.002) // สีฟ้า
    );

    const onMarkerDragEnd = (index, newCoordinate, type) => {
        if (type === 'defense') {
            const newCoords = [...defenseCoords];
            newCoords[index] = newCoordinate;
            setDefenseCoords(newCoords);
        } else {
            const newCoords = [...alertCoords];
            newCoords[index] = newCoordinate;
            setAlertCoords(newCoords);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: startLat,
                    longitude: startLon,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }}
            >
                {/* --- โซนสีฟ้า --- */}
                <Polygon
                    coordinates={alertCoords}
                    strokeColor="#4AC2F9"
                    fillColor="rgba(74, 194, 249, 0.2)"
                    strokeWidth={2}
                />
                {alertCoords.map((coord, index) => (
                    <Marker
                        key={`alert-${index}`}
                        coordinate={coord}
                        draggable
                        anchor={{ x: 0.5, y: 0.5 }}
                        onDragEnd={(e) => onMarkerDragEnd(index, e.nativeEvent.coordinate, 'alert')}
                    >
                        <View style={[styles.editDot, { backgroundColor: '#4AC2F9' }]} />
                    </Marker>
                ))}

                {/* --- โซนสีแดง --- */}
                <Polygon
                    coordinates={defenseCoords}
                    strokeColor="#FF4500"
                    fillColor="rgba(255, 69, 0, 0.3)"
                    strokeWidth={2}
                />
                {defenseCoords.map((coord, index) => (
                    <Marker
                        key={`defense-${index}`}
                        coordinate={coord}
                        draggable
                        anchor={{ x: 0.5, y: 0.5 }}
                        onDragEnd={(e) => onMarkerDragEnd(index, e.nativeEvent.coordinate, 'defense')}
                    >
                        <View style={[styles.editDot, { backgroundColor: '#FF4500' }]} />
                    </Marker>
                ))}
            </MapView>

            <View style={styles.instructions}>
                <Text style={styles.text}>ปรับแต่งพื้นที่โซนของคุณ</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    map: { width: Dimensions.get('window').width, height: '100%' },
    editDot: {
        width: 20, height: 20, borderRadius: 10,
        borderWidth: 2, borderColor: 'white',
        shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, elevation: 5,
    },
    instructions: {
        position: 'absolute', bottom: 40, alignSelf: 'center',
        backgroundColor: 'rgba(0,0,0,0.7)', padding: 10, borderRadius: 20,
    },
    text: { color: 'white', fontWeight: 'bold' }
});

export default EditZoneScreen;