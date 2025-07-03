// Configuration and API key management

export const get_api_key = async (type: string): Promise<string | null> => {
  // For demo purposes, return a placeholder key
  // In production, this would fetch from secure environment variables
  
  if (type === 'google_map') {
    // Return the demo Google Maps API key
    return 'AIzaSyCO0kKndUNlmQi3B5mxy4dblg_8WYcuKuk'
  }
  
  return null
}

// App configuration
export const APP_CONFIG = {
  name: 'Parkr',
  version: '2.0.0',
  environment: 'development',
  features: {
    authentication: true,
    realTimeJobs: true,
    collinCountyOnly: true,
    parkerPlatform: true
  },
  pricing: {
    justInLot: { customer: 12, parker: 7 },
    bestAvailable: { customer: 18, parker: 8 },
    atTheFront: { customer: 25, parker: 8.5 }
  },
  collinCounty: {
    center: { lat: 33.1581, lng: -96.6678 },
    bounds: {
      north: 33.372,
      south: 32.945,
      east: -96.402,
      west: -96.935
    }
  }
}
