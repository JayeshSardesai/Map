const wifi = require('node-wifi');
const axios = require('axios');

// Setup Wi-Fi scanner
wifi.init({ iface: null });

async function locate() {
    try {
        const networks = await wifi.scan();

        const wifiAccessPoints = networks.map(net => ({
            macAddress: net.bssid,
            signalStrength: net.signal_level,
            channel: net.channel
        }));
        console.log("Scanned networks:", wifiAccessPoints);


        const apiKey = 'AIzaSyByRWcK5lFM0baYxXDk-NcTs8VB8OCTlEo'; // your key

        const response = await axios.post(
            `https://www.googleapis.com/geolocation/v1/geolocate?key=${apiKey}`,
            {
                considerIp: false,
                wifiAccessPoints
            }
        );

        const { lat, lng } = response.data.location;
        const accuracy = response.data.accuracy;

        console.log(`📍 Lat: ${lat}, Lng: ${lng}`);
        console.log(`🎯 Accuracy: ${accuracy} meters`);
    } catch (error) {
        console.error("❌ Error:", error.response?.data || error.message);
    }
}

locate();
