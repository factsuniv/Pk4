import { useState, useEffect } from 'react'
import { Search, MapPin, Navigation, Star, DollarSign, Users, Clock, Plus } from 'lucide-react'
import { Business, businessSearchService } from '../lib/businessSearch'
import BusinessSearch from './BusinessSearch'
import CollinCountyMap from './CollinCountyMap'
import LiveBookingFlow from './LiveBookingFlow'

interface MapViewProps {
  selectedSpot?: any
  onSpotSelect?: (spot: any) => void
}

const MapView = ({ selectedSpot, onSpotSelect }: MapViewProps) => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [mapCenter, setMapCenter] = useState({ lat: 33.1507, lng: -96.6906 }) // Collin County center
  const [businesses, setBusinesses] = useState<Business[]>([])
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    // Load popular businesses for map display
    const loadBusinesses = async () => {
      const popularBusinesses = await businessSearchService.getPopularBusinesses()
      setBusinesses(popularBusinesses.slice(0, 10))
    }
    loadBusinesses()
  }, [])

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business)
    setMapCenter(business.coordinates)
    setSearchQuery(business.name)
  }

  const handleBusinessMapClick = (business: Business) => {
    setSelectedBusiness(business)
    setShowBookingFlow(true)
  }

  const handleNewBooking = () => {
    setSelectedBusiness(null)
    setShowBookingFlow(true)
  }

  // Mock parking spots data with better visual representation
  const mockSpots = [
    { 
      id: 1, 
      lat: 33.1507, 
      lng: -96.6906, 
      price: 15, 
      distance: '0.1 mi',
      rating: 4.8,
      business: 'Legacy West',
      address: '7250 Bishop Rd, Plano, TX',
      available: true,
      parkerName: 'Mike',
      estimatedTime: '8 min'
    },
    { 
      id: 2, 
      lat: 33.1577, 
      lng: -96.7406, 
      price: 12, 
      distance: '0.3 mi',
      rating: 4.6,
      business: 'Stonebriar Centre',
      address: '2601 Preston Rd, Frisco, TX',
      available: true,
      parkerName: 'Sarah',
      estimatedTime: '12 min'
    },
    { 
      id: 3, 
      lat: 33.2197, 
      lng: -96.6297, 
      price: 22, 
      distance: '0.2 mi',
      rating: 4.9,
      business: 'TopGolf - The Colony',
      address: '5651 State Highway 121, The Colony, TX',
      available: true,
      parkerName: 'Alex',
      estimatedTime: '6 min'
    },
    { 
      id: 4, 
      lat: 33.1298, 
      lng: -96.6701, 
      price: 18, 
      distance: '0.4 mi',
      rating: 4.7,
      business: 'The Star - Frisco',
      address: '1 Cowboys Way, Frisco, TX',
      available: false,
      parkerName: 'Jordan',
      estimatedTime: '15 min'
    },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 bg-white shadow-sm">
        <div className="flex space-x-3">
          <div className="flex-1">
            <BusinessSearch 
              onBusinessSelect={handleBusinessSelect}
              placeholder="Search for TopGolf, Legacy West, restaurants..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>
          <button
            onClick={handleNewBooking}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus className="w-5 h-5" />
            <span>Book Parking</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <CollinCountyMap
          selectedBusiness={selectedBusiness}
          onBusinessClick={handleBusinessMapClick}
          businesses={businesses}
          className="w-full h-full"
        />

        {/* Legacy Spot Markers (for compatibility) */}
        <div className="absolute inset-0 pointer-events-none">
          {mockSpots.map((spot) => (
            <div
              key={spot.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 pointer-events-auto ${
                selectedSpot?.id === spot.id ? 'z-30' : 'z-20'
              }`}
              style={{
                left: `${30 + (spot.id * 15)}%`,
                top: `${40 + (spot.id * 8)}%`,
              }}
              onClick={() => onSpotSelect?.(spot)}
            >
              {/* Marker */}
              <div className={`
                relative w-10 h-10 rounded-full border-3 shadow-lg flex items-center justify-center
                ${spot.available 
                  ? (selectedSpot?.id === spot.id ? 'border-blue-600 bg-blue-100 ring-4 ring-blue-200' : 'border-white bg-blue-600') 
                  : 'border-white bg-gray-400'
                }
                hover:scale-110 transition-transform
              `}>
                <span className="text-white font-bold text-xs">P</span>
                
                {/* Price tag */}
                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-lg">
                  ${spot.price}
                </div>
                
                {/* Pulse effect for available spots */}
                {spot.available && (
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-30"></div>
                )}
              </div>

              {/* Info Card (on hover or selection) */}
              {selectedSpot?.id === spot.id && (
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-40">
                  <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/30 min-w-[280px]">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-bold text-gray-800">{spot.business}</h3>
                        <p className="text-sm text-gray-600">{spot.address}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        spot.available ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                        {spot.available ? 'Available' : 'Taken'}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-green-500" />
                          <span className="font-semibold text-gray-800">${spot.price}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4 text-blue-500" />
                          <span className="text-sm text-gray-600">{spot.distance}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-500" />
                          <span className="text-sm text-gray-600">{spot.rating}</span>
                        </span>
                      </div>
                    </div>

                    {spot.available && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4 text-purple-500" />
                            <span className="text-gray-600">Parker: {spot.parkerName}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4 text-orange-500" />
                            <span className="text-gray-600">ETA: {spot.estimatedTime}</span>
                          </span>
                        </div>
                        
                        <button 
                          onClick={() => setShowBookingFlow(true)}
                          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                          Reserve This Spot
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Action Button */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={handleNewBooking}
            className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors hover:scale-105"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Live Booking Flow Modal */}
      {showBookingFlow && (
        <LiveBookingFlow
          onClose={() => setShowBookingFlow(false)}
          preselectedBusiness={selectedBusiness}
        />
      )}
    </div>
  )
}

export default MapView
