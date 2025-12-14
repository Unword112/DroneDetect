const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

//รอ database ตัวนี้ตัวแปรชั่วคราว
let initialMapRegion = {
    latitude: 13.7850,
    longitude: 100.5500,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

//รอ database ตัวนี้ตัวแปรชั่วคราว
let mockDroneDetail = [
    { id: 14, name: 'TARGET 14', distance: 170.49, speed: 14, POI: 20, Altitude: 70, Heading: 85, ReachIn: 3 },
    { id: 15, name: 'TARGET 15', distance: 210.74, speed: 14, POI: 20, Altitude: 250, Heading: 111, ReachIn: 15 }
]

//รอ database ตัวนี้ตัวแปรชั่วคราว
let mockDroneData = [
    { id: 14, name: 'TARGET 14', distance: 170.49, lat: 13.7845, lon: 100.5510 }, 
    { id: 15, name: 'TARGET 15', distance: 210.74, lat: 13.7880, lon: 100.5480 }, 
];

//รอ database ตัวนี้ตัวแปรชั่วคราว
let defenseBoundaryCoords = [
    { latitude: 13.7850, longitude: 100.5480 },
    { latitude: 13.7870, longitude: 100.5510 },
    { latitude: 13.7840, longitude: 100.5530 },
    { latitude: 13.7820, longitude: 100.5495 },
    { latitude: 13.7850, longitude: 100.5480 },
];

//รอ database ตัวนี้ตัวแปรชั่วคราว
let alertZoneCoords = [
    { latitude: 13.7900, longitude: 100.5560 },
    { latitude: 13.7920, longitude: 100.5450 },
    { latitude: 13.7800, longitude: 100.5400 },
    { latitude: 13.7750, longitude: 100.5550 },
    { latitude: 13.7900, longitude: 100.5560 },
];

app.get('/api/home-data', (req, res) => {
    res.json({
        drones: mockDroneData,
        defenseZone: defenseBoundaryCoords,
        alertZone: alertZoneCoords,
        initialRegion: initialMapRegion,
        detail: mockDroneDetail

    });
});

app.post('/api/update-zones', (req, res) => {
    const { defenseZone, alertZone } = req.body;

    if (defenseZone) defenseBoundaryCoords = defenseZone;
    if (alertZone) alertZoneCoords = alertZone;

    console.log("Zones Updated!");
    res.json({ success: true, message: "Zones updated successfully" });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});