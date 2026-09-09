// Utility to calculate real-world driving distance using completely free open-source APIs
// Uses Nominatim (OSM) for geocoding and OSRM for routing.

// Plateform Original Headquarters (Sulthan Palace)
const ORIGIN_LAT = 6.914604;
const ORIGIN_LON = 79.8650047;

export async function fetchTrueDeliveryDistance(address: string): Promise<{ distanceKm: number, timeMins: number } | null> {
  try {
    if (!address) return null;
    
    // 1. Geocode the address using Nominatim (restrict to Sri Lanka for better accuracy)
    const geocodeUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&countrycodes=LK&format=json&limit=1`;
    
    const geoResponse = await fetch(geocodeUrl, {
      headers: {
        'User-Agent': 'PlateformApp/1.0' // Nominatim requires a User-Agent
      }
    });

    if (!geoResponse.ok) return null;
    const geoData = await geoResponse.json();

    if (!geoData || geoData.length === 0) {
      console.log('Nominatim failed to find address:', address);
      return null;
    }

    const destLat = parseFloat(geoData[0].lat);
    const destLon = parseFloat(geoData[0].lon);

    // 2. Fetch driving route using OSRM
    const osrmUrl = `https://router.project-osrm.org/route/v1/driving/${ORIGIN_LON},${ORIGIN_LAT};${destLon},${destLat}?overview=false`;
    
    const routeResponse = await fetch(osrmUrl);
    if (!routeResponse.ok) return null;

    const routeData = await routeResponse.json();
    if (!routeData.routes || routeData.routes.length === 0) {
      console.log('OSRM failed to route');
      return null;
    }

    const distanceMeters = routeData.routes[0].distance;
    const durationSeconds = routeData.routes[0].duration;

    return {
      distanceKm: distanceMeters / 1000,
      timeMins: Math.ceil(durationSeconds / 60)
    };

  } catch (err) {
    console.error('Error fetching true delivery distance:', err);
    return null; // Fallback will be used manually in useStore
  }
}
