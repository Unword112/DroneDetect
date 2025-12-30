const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const days = ["Sun", "Mon", "Tue", "Wed", "The", "Fri", "Sat"];
const weeklyCounts = [0, 0, 0, 0, 0, 0, 0];

let userMock = {
  user_id: 1,
  name: "Pol.Sen.Sgt.Maj. Jidee",
  username: "admin",
  password: 1234,
  imageUrl: "http://10.0.2.2:3000/api/get-image/userimage.jpg",
};

let initialMapRegion = {
  latitude: 13.785,
  longitude: 100.55,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
};

let mockDroneDetail = [
  {
    id: 14,
    name: "TARGET 14",
    distance: 40.49,
    speed: 14,
    POI: 20,
    Altitude: 70,
    Heading: 85,
    ReachIn: 3,
  },
  {
    id: 15,
    name: "TARGET 15",
    distance: 210.74,
    speed: 14,
    POI: 20,
    Altitude: 250,
    Heading: 111,
    ReachIn: 15,
  },
];

let mockDroneData = [
  {
    id: mockDroneDetail[0].id,
    name: mockDroneDetail[0].name,
    distance: mockDroneDetail[0].distance,
    lat: 13.7845,
    lon: 100.551,
    imageUrl: "drone_1.jpg",
  },
  {
    id: mockDroneDetail[1].id,
    name: mockDroneDetail[1].name,
    distance: mockDroneDetail[1].distance,
    lat: 13.788,
    lon: 100.548,
    imageUrl: "drone_2.jpg",
  },
];

let defenseBoundaryCoords = [
  { latitude: 13.785, longitude: 100.548 },
  { latitude: 13.787, longitude: 100.551 },
  { latitude: 13.784, longitude: 100.553 },
  { latitude: 13.782, longitude: 100.5495 },
  { latitude: 13.785, longitude: 100.548 },
];

let alertZoneCoords = [
  { latitude: 13.79, longitude: 100.556 },
  { latitude: 13.792, longitude: 100.545 },
  { latitude: 13.78, longitude: 100.54 },
  { latitude: 13.775, longitude: 100.555 },
  { latitude: 13.79, longitude: 100.556 },
];

const isPointInPolygon = (lat, lon, polygon) => {
  const x = lat,
    y = lon;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].latitude,
      yi = polygon[i].longitude;
    const xj = polygon[j].latitude,
      yj = polygon[j].longitude;
    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
};

let droneHistoryLogs = mockDroneData.map((drone) => ({
  ...drone,
  timestamp: new Date(),
}));

//Endpoints
app.get("/api/home-data", (req, res) => {
  const visibleDrones = mockDroneData.filter((drone) =>
    isPointInPolygon(drone.lat, drone.lon, alertZoneCoords)
  );

  const processedDrones = visibleDrones.map((drone) => ({
    ...drone,
    inDefenseZone: isPointInPolygon(drone.lat, drone.lon, defenseBoundaryCoords),
  }));

  res.json({
    drones: processedDrones,
    defenseZone: defenseBoundaryCoords,
    alertZone: alertZoneCoords,
    initialRegion: initialMapRegion,
    detail: mockDroneDetail,
  });
});

app.post("/api/update-zones", (req, res) => {
  const { defenseZone, alertZone } = req.body;

  if (defenseZone) defenseBoundaryCoords = defenseZone;
  if (alertZone) alertZoneCoords = alertZone;

  console.log("Zones Updated!");
  res.json({ success: true, message: "Zones updated successfully" });
});

app.get("/api/report-data", (req, res) => {
  const drones = mockDroneDetail;
  const totalDetected = drones.length;

  const redZoneDetected = droneHistoryLogs.filter((log) =>
    isPointInPolygon(log.lat, log.lon, defenseBoundaryCoords),
  ).length;

  const todayIndex = new Date().getDay();
  console.log(todayIndex);
  weeklyCounts[todayIndex] = totalDetected;

  const topOffenders = droneHistoryLogs.map((log) => ({
    name: log.name,
    count: 1,
    lastSeen: new Date(log.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  }));

  res.json({
    summary: {
      totalDetected: totalDetected,
      redZoneDetected: redZoneDetected,
      activeHours: "Now",
    },
    weeklyStats: {
      labels: days,
      datasets: [{ data: weeklyCounts }],
    },
    topOffenders: topOffenders,
  });
});

app.get("/api/side-camera", (req, res) => {
  const imagePath = path.join(__dirname, "images", "drone_1.jpg");
  res.sendFile(imagePath, (err) => {
    if (err) console.error("Error sending side-camera image:", err);
  });
});

app.get("/api/get-image/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(__dirname, "images", filename);
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error("Image not found:", filename);
      res.status(404).send("Image not found");
    }
  });
});

app.get("/api/camera-live", (req, res) => {
  const imagePath = path.join(__dirname, "images", "camera_1.jpg");
  res.sendFile(imagePath, (err) => {
    if (err) console.error("Error sending camera-live image:", err);
  });
});

app.get("/api/login", (req, res) => {
  res.json({
    userid: userMock.user_id,
    name: userMock.name,
    username: userMock.username,
    password: userMock.password,
    imagePath: userMock.imageUrl,
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
