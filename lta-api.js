const axios = require('axios');
const config = require('./config');

const baseUrl = 'http://datamall2.mytransport.sg/ltaodataservice';

const apiClient = axios.create({
    baseURL: baseUrl,
    headers: {
        AccountKey: config.ltaApiKey,
        accept: 'application/json',
    },
});
/**
 * Get the list of bus routes
 * @async
 * @function
 * @returns {Promise<Array>} A Promise that resolves to an array of bus routes
 * @throws {Error} If an error occurs while fetching the bus routes
 */
const getBusRoutes = async () => {
    try {
        const response = await apiClient.get('/BusRoutes');
        return response.data.value;
    } catch (error) {
        console.error('Error fetching bus routes:', error);
        throw error;
    }
};
/**
 * Calculate the distance (in kilometers) between two sets of latitude and longitude coordinates using the Haversine formula
 * @function
 * @param {number} lat1 - The latitude of the first location
 * @param {number} lon1 - The longitude of the first location
 * @param {number} lat2 - The latitude of the second location
 * @param {number} lon2 - The longitude of the second location
 * @returns {number} The distance (in kilometers) between the two locations
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};
/**
 * Get the list of bus stops
 * @async
 * @function
 * @returns {Promise<Array>} A Promise that resolves to an array of bus stops
 * @throws {Error} If an error occurs while fetching the bus stops
 */
const getBusStops = async () => {
    try {
        const response = await apiClient.get('/BusStops');
        return response.data.value;
    } catch (error) {
        console.error('Error fetching bus stops:', error);
        throw error;
    }
};
/**
 * Get the nearest bus stops to a given latitude and longitude
 * @async
 * @function
 * @param {number} latitude - The latitude of the location
 * @param {number} longitude - The longitude of the location
 * @param {number} [limit=5] - The maximum number of bus stops to return (default: 5)
 * @returns {Promise<Array>} A Promise that resolves to an array of bus stops, sorted by distance from the given location
 * @throws {Error} If an error occurs while fetching the bus stops
 */
const getNearestBusStops = async (latitude, longitude, limit = 5) => {
    const busStops = await getBusStops();
    const busStopsWithDistance = busStops.map((stop) => ({
        ...stop,
        distance: haversineDistance(latitude, longitude, stop.Latitude, stop.Longitude),
    }));
    const sortedBusStops = busStopsWithDistance.sort((a, b) => a.distance - b.distance);
    return sortedBusStops.slice(0, limit);
};

module.exports = {
    getBusArrival: async (busStopCode, serviceNo) => {
        try {
            const response = await apiClient.get(`/BusArrivalv2?BusStopCode=${busStopCode}&ServiceNo=${serviceNo}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching bus arrival:', error);
            throw error;
        }
    },
    getParkingAvailability: async () => {
        try {
            const response = await apiClient.get('/CarParkAvailabilityv2');
            return response.data;
        } catch (error) {
            console.error('Error fetching parking availability:', error);
            throw error;
        }
    },
    getNearestBusStops,
    getBusRoutes
};
