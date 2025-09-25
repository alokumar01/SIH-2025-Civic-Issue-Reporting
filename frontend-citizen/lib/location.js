export const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by your browser'));
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                resolve({
                    longitude: position.coords.longitude,
                    latitude: position.coords.latitude
                });
            },
            (error) => {
                reject(error);
            }
        );
    });
};

export const reverseGeocode = async (longitude, latitude) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lon=${longitude}&lat=${latitude}&zoom=18&addressdetails=1`
        );
        const data = await response.json();
        
        return {
            address: data.display_name,
            state: data.address.state,
            district: data.address.county || data.address.city_district,
            locality: data.address.suburb || data.address.neighbourhood || data.address.residential,
            pinCode: data.address.postcode,
            // Note: landmark needs to be filled by user as it's not typically available in geocoding data
            landmark: ""
        };
    } catch (error) {
        console.error('Error in reverse geocoding:', error);
        throw error;
    }
};