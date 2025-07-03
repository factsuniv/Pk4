import { useState, useEffect } from 'react'
import { MapPin, Navigation, Zap, Star, Clock } from 'lucide-react'
import { Business } from '../lib/businessSearch'

interface CollinCountyMapProps {
  selectedBusiness?: Business | null
  onBusinessClick?: (business: Business) => void
  businesses?: Business[]
  className?: string
}

const CollinCountyMap = ({ 
  selectedBusiness, 
  onBusinessClick, 
  businesses = [],
  className = "" 
}: CollinCountyMapProps) => {
  const [hoveredBusiness, setHoveredBusiness] = useState<string | null>(null)

  // Major Collin County areas and their positions on the map
  const mapAreas = [
    // Cities and regions
    { name: "Plano", x: "45%", y: "60%", type: "city" },
    { name: "Frisco", x: "35%", y: "35%", type: "city" },
    { name: "Allen", x: "65%", y: "45%", type: "city" },
    { name: "McKinney", x: "55%", y: "25%", type: "city" },
    { name: "The Colony", x: "25%", y: "50%", type: "city" },
    { name: "Richardson", x: "45%", y: "80%", type: "city" },
    
    // Major roads and highways
    { name: "US-75", x: "40%", y: "0%", x2: "50%", y2: "100%", type: "highway" },
    { name: "Dallas North Tollway", x: "30%", y: "0%", x2: "40%", y2: "100%", type: "highway" },
    { name: "SH-121", x: "0%", y: "55%", x2: "100%", y2: "45%", type: "highway" },
    { name: "Preston Road", x: "35%", y: "0%", x2: "45%", y2: "100%", type: "road" },
  ]

  // Position businesses on the map based on their coordinates
  const getBusinessPosition = (business: Business) => {
    // Convert lat/lng to percentage positions on our map
    // Collin County bounds: roughly 33.0-33.3 lat, -96.9 to -96.4 lng
    const latRange = [33.0, 33.3]
    const lngRange = [-96.9, -96.4]
    
    const x = ((business.coordinates.lng - lngRange[0]) / (lngRange[1] - lngRange[0])) * 100
    const y = 100 - ((business.coordinates.lat - latRange[0]) / (latRange[1] - latRange[0])) * 100
    
    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y))
    }
  }

  const getBusinessIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'shopping': return '🛍️'
      case 'entertainment': return '🎭'
      case 'restaurant': return '🍽️'
      case 'sports': return '⚽'
      case 'business': return '🏢'
      case 'recreation': return '🏌️'
      default: return '📍'
    }
  }

  const getDemandColor = (demand: string) => {
    switch (demand) {
      case 'extreme': return 'bg-red-500'
      case 'very high': return 'bg-orange-500'
      case 'high': return 'bg-yellow-500'
      case 'medium': return 'bg-blue-500'
      default: return 'bg-green-500'
    }
  }

  return (
    <div className={`relative w-full h-full bg-gradient-to-br from-green-50 via-blue-50 to-green-100 rounded-2xl overflow-hidden border-2 border-white/30 shadow-lg ${className}`}>
      {/* Map Background with Grid */}
      <div className="absolute inset-0">
        {/* Grid pattern to simulate map lines */}
        <div 
          className="w-full h-full opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, #10b981 1px, transparent 1px),
              linear-gradient(to bottom, #10b981 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Highways and Major Roads */}
      {mapAreas.filter(area => area.type === 'highway' || area.type === 'road').map((road, index) => (
        <div
          key={`road-${index}`}
          className={`absolute ${road.type === 'highway' ? 'bg-gray-400' : 'bg-gray-300'} opacity-60`}
          style={{
            left: road.x,
            top: road.y,
            width: road.x2 ? `${Math.abs(parseFloat(road.x2) - parseFloat(road.x))}%` : '3px',
            height: road.y2 ? `${Math.abs(parseFloat(road.y2) - parseFloat(road.y))}%` : '3px',
            transform: road.x2 && road.y2 ? 'rotate(-10deg)' : 'none',
            transformOrigin: 'top left'
          }}
        />
      ))}

      {/* City Labels */}
      {mapAreas.filter(area => area.type === 'city').map((city, index) => (
        <div
          key={`city-${index}`}
          className="absolute transform -translate-x-1/2 -translate-y-1/2"
          style={{ left: city.x, top: city.y }}
        >
          <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-1 shadow-md border border-white/30">
            <span className="text-sm font-semibold text-gray-700">{city.name}</span>
          </div>
        </div>
      ))}

      {/* Compass */}
      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
        <Navigation className="w-6 h-6 text-blue-600" />
        <div className="text-xs font-semibold text-gray-600 mt-1">N</div>
      </div>

      {/* Scale */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
        <div className="flex items-center space-x-2">
          <div className="h-1 bg-gray-600" style={{ width: '40px' }}></div>
          <span className="text-xs font-semibold text-gray-600">5 mi</span>
        </div>
      </div>

      {/* Business Markers */}
      {businesses.map((business) => {
        const position = getBusinessPosition(business)
        const isSelected = selectedBusiness?.id === business.id
        const isHovered = hoveredBusiness === business.id
        
        return (
          <div
            key={business.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 z-10"
            style={{ 
              left: `${position.x}%`, 
              top: `${position.y}%`,
              transform: `translate(-50%, -50%) ${isSelected || isHovered ? 'scale(1.2)' : 'scale(1)'}`
            }}
            onClick={() => onBusinessClick?.(business)}
            onMouseEnter={() => setHoveredBusiness(business.id)}
            onMouseLeave={() => setHoveredBusiness(null)}
          >
            {/* Business Marker */}
            <div className={`
              relative w-10 h-10 rounded-full border-3 shadow-lg flex items-center justify-center text-lg
              ${isSelected ? 'border-blue-600 bg-blue-100 ring-4 ring-blue-200' : 'border-white bg-white/90'}
              ${getDemandColor(business.averageParkingDemand)} backdrop-blur-sm
              hover:shadow-xl transition-all duration-200
            `}>
              <span className="text-sm">{getBusinessIcon(business.category)}</span>
              
              {/* Pulse effect for high demand */}
              {(business.averageParkingDemand === 'extreme' || business.averageParkingDemand === 'very high') && (
                <div className="absolute inset-0 rounded-full bg-red-400 animate-ping opacity-30"></div>
              )}
            </div>

            {/* Business Info Card (on hover or select) */}
            {(isHovered || isSelected) && (
              <div className="absolute top-12 left-1/2 transform -translate-x-1/2 z-20">
                <div className="bg-white/95 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-white/30 min-w-[250px]">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-800 text-sm">{business.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium text-white ${getDemandColor(business.averageParkingDemand)}`}>
                      {business.averageParkingDemand.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{business.address}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-blue-500" />
                      <span className="text-gray-600">{business.category}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-orange-500" />
                      <span className="text-gray-600">{business.parkingSpots.length} spots</span>
                    </span>
                  </div>
                  {business.peakHours.length > 0 && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Clock className="w-3 h-3 text-green-500" />
                      <span className="text-xs text-gray-600">Peak: {business.peakHours[0]}</span>
                    </div>
                  )}
                  
                  {onBusinessClick && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onBusinessClick(business)
                      }}
                      className="w-full mt-3 bg-blue-600 text-white text-xs font-medium py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Book Parking Here
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Map Title */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
        <h2 className="font-bold text-gray-800 text-lg">Collin County</h2>
        <p className="text-xs text-gray-600">Live Parking Availability</p>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/30">
        <h3 className="font-semibold text-gray-800 text-sm mb-2">Demand Level</h3>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">High</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">Extreme</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollinCountyMap
