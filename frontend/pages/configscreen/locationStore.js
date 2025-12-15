export let currentMapRegion = {
    latitude: 13.7563,
    longitude: 100.5018,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
};

export const setMapRegion = (region) => {
    currentMapRegion = region;
};