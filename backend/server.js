const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const days = [ "Sun", "Mon", "Tue", "Wed", "The", "Fri", "Sat"];
const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];

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
    { id: mockDroneDetail[0].id, name: mockDroneDetail[0].name, distance: mockDroneDetail[0].distance, lat: 13.7845, lon: 100.5510 }, 
    { id: mockDroneDetail[1].id, name: mockDroneDetail[1].name, distance: mockDroneDetail[1].distance, lat: 13.7880, lon: 100.5480 }, 
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

const isPointInPolygon = (lat, lon, polygon) => {
    const x = lat, y = lon;
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const xi = polygon[i].latitude, yi = polygon[i].longitude;
        const xj = polygon[j].latitude, yj = polygon[j].longitude;
        const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

let droneHistoryLogs = mockDroneData.map(drone => ({
    ...drone,
    timestamp: new Date()
}));

//Endpoints

//drone data
app.get('/api/home-data', (req, res) => {
    res.json({
        drones: mockDroneData,
        defenseZone: defenseBoundaryCoords,
        alertZone: alertZoneCoords,
        initialRegion: initialMapRegion,
        detail: mockDroneDetail

    });
});

//edit zone screen
app.post('/api/update-zones', (req, res) => {
    const { defenseZone, alertZone } = req.body;

    if (defenseZone) defenseBoundaryCoords = defenseZone;
    if (alertZone) alertZoneCoords = alertZone;

    console.log("Zones Updated!");
    res.json({ success: true, message: "Zones updated successfully" });
});

//report screen
app.get('/api/report-data', (req, res) => {
    const drones = mockDroneDetail;
    const totalDetected = drones.length;

    const redZoneDetected = droneHistoryLogs.filter(log =>
        isPointInPolygon(log.lat, log.lon, defenseBoundaryCoords)
    ).length;

    const todayIndex = new Date().getDate();
    weeklyCounts[todayIndex] = totalDetected;

    const topOffenders = droneHistoryLogs.map(log => ({
        name: log.name,
        count: 1,
        lastSeen: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));

    res.json ({
        summary: {
            totalDetected: totalDetected,
            redZoneDetected: redZoneDetected,
            activeHours: "Now"
        },
        weeklyStats: {
            labels: days,
            datasets: [{ data: weeklyCounts }]
        },
        topOffenders: topOffenders
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});