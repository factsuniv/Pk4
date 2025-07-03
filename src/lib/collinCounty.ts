// Collin County boundary coordinates (simplified polygon)
const COLLIN_COUNTY_BOUNDARY = [
  { lat: 33.372, lng: -96.402 }, // NE corner
  { lat: 33.372, lng: -96.935 }, // NW corner  
  { lat: 32.945, lng: -96.935 }, // SW corner
  { lat: 32.945, lng: -96.402 }, // SE corner
  { lat: 33.372, lng: -96.402 }  // Close polygon
]

// Major Collin County cities and areas
export const COLLIN_COUNTY_CITIES = [
  'Plano', 'Frisco', 'McKinney', 'Allen', 'The Colony', 'Celina', 'Prosper',
  'Murphy', 'Wylie', 'Richardson', 'Garland', 'Addison', 'Carrollton',
  'Lewisville', 'Little Elm', 'Princeton', 'Anna', 'Melissa', 'Lucas',
  'Parker', 'Fairview', 'Lowry Crossing', 'Westminster', 'Lavon'
]

// Popular destinations in Collin County
export const POPULAR_DESTINATIONS = [
  {
    name: "Legacy West",
    address: "7250 Bishop Rd, Plano, TX 75024",
    category: "Shopping & Dining",
    lat: 33.0751,
    lng: -96.8236
  },
  {
    name: "The Star in Frisco",
    address: "1 Cowboys Way, Frisco, TX 75034", 
    category: "Sports & Entertainment",
    lat: 33.0878,
    lng: -96.8364
  },
  {
    name: "Stonebriar Centre",
    address: "2601 Preston Rd, Frisco, TX 75034",
    category: "Shopping Mall",
    lat: 33.0932,
    lng: -96.8108
  },
  {
    name: "TopGolf - The Colony",
    address: "5151 TX-121, The Colony, TX 75056",
    category: "Entertainment",
    lat: 33.0884,
    lng: -96.8969
  },
  {
    name: "Grandscape",
    address: "5752 Grandscape Blvd, The Colony, TX 75056",
    category: "Shopping & Entertainment",
    lat: 33.0892,
    lng: -96.8964
  },
  {
    name: "Craig Ranch",
    address: "8910 State Hwy 121, McKinney, TX 75070",
    category: "Business District",
    lat: 33.1067,
    lng: -96.8142
  }
]

// Check if a coordinate is within Collin County
export function isInCollinCounty(lat: number, lng: number): boolean {
  // Simple bounding box check first (performance optimization)
  if (lat < 32.945 || lat > 33.372 || lng < -96.935 || lng > -96.402) {
    return false
  }
  
  // More precise polygon check
  return pointInPolygon({ lat, lng }, COLLIN_COUNTY_BOUNDARY)
}

// Point in polygon algorithm
function pointInPolygon(point: { lat: number; lng: number }, polygon: { lat: number; lng: number }[]): boolean {
  const x = point.lng
  const y = point.lat
  let inside = false

  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng
    const yi = polygon[i].lat
    const xj = polygon[j].lng
    const yj = polygon[j].lat

    if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
      inside = !inside
    }
  }

  return inside
}

// Check if a place is within our service area
export function checkServiceArea(place: google.maps.places.PlaceResult): { 
  inServiceArea: boolean; 
  message?: string 
} {
  if (!place.geometry?.location) {
    return { 
      inServiceArea: false, 
      message: "Unable to determine location" 
    }
  }

  const lat = place.geometry.location.lat()
  const lng = place.geometry.location.lng()

  if (isInCollinCounty(lat, lng)) {
    return { inServiceArea: true }
  } else {
    return { 
      inServiceArea: false, 
      message: "We don't service that area yet - Currently available in Collin County only" 
    }
  }
}

// Get distance between two points (in miles)
export function getDistance(
  lat1: number, lng1: number, 
  lat2: number, lng2: number
): number {
  const R = 3959 // Earth's radius in miles
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Find nearest popular destination
export function findNearestDestination(lat: number, lng: number) {
  let nearest = POPULAR_DESTINATIONS[0]
  let minDistance = getDistance(lat, lng, nearest.lat, nearest.lng)

  for (const destination of POPULAR_DESTINATIONS) {
    const distance = getDistance(lat, lng, destination.lat, destination.lng)
    if (distance < minDistance) {
      minDistance = distance
      nearest = destination
    }
  }

  return { destination: nearest, distance: minDistance }
}
