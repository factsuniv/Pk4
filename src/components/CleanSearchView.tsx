import React, { useState, useEffect } from 'react'
import { Search, MapPin, Star, Clock, DollarSign, ArrowRight } from 'lucide-react'
import BusinessSearch from './BusinessSearch'
import LiveBookingFlow from './LiveBookingFlow'
import { Business } from '../types'
import { businessSearchService } from '../lib/businessSearch'

export const CleanSearchView: React.FC = () => {
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [showBookingFlow, setShowBookingFlow] = useState(false)
  const [popularBusinesses, setPopularBusinesses] = useState<Business[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadPopularBusinesses = async () => {
      try {
        // Get popular businesses from different categories
        const popularQueries = [
          'restaurant',
          'shopping',
          'entertainment',
          'fitness',
          'medical'
        ]
        
        const allBusinesses = []
        for (const query of popularQueries) {
          const results = await businessSearchService.searchBusinesses(query, { limit: 3 })
          allBusinesses.push(...results.slice(0, 2)) // Take top 2 from each category
        }
        
        setPopularBusinesses(allBusinesses.slice(0, 8)) // Show top 8 overall
      } catch (error) {
        console.error('Error loading popular businesses:', error)
      } finally {
        setLoading(false)
      }
    }

    loadPopularBusinesses()
  }, [])

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business)
    setShowBookingFlow(true)
  }

  const handleCloseBooking = () => {
    setShowBookingFlow(false)
    setSelectedBusiness(null)
  }

  if (showBookingFlow && selectedBusiness) {
    return (
      <LiveBookingFlow
        preselectedBusiness={selectedBusiness}
        onClose={handleCloseBooking}
      />
    )
  }

  return (
    <div className="min-h-screen apple-gradient-mesh">
      {/* Hero Search Section */}
      <div className="pt-16 pb-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Hero Title */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-apple-text mb-4 tracking-tight">
              Find Your
              <span className="block text-transparent bg-clip-text apple-gradient-primary">
                Perfect Spot
              </span>
            </h1>
            <p className="text-xl text-apple-text-secondary max-w-lg mx-auto leading-relaxed">
              Reserve premium parking at your destination before you arrive
            </p>
          </div>

          {/* Main Search */}
          <div className="apple-card mb-8 p-8">
            <div className="flex items-center mb-6">
              <MapPin className="text-apple-accent mr-3" size={24} />
              <h2 className="text-2xl font-semibold text-apple-text">
                Where would you like to park?
              </h2>
            </div>
            
            <BusinessSearch
              onBusinessSelect={handleBusinessSelect}
              placeholder="Search businesses in Collin County..."
              className="text-lg"
            />
            
            <div className="flex items-center justify-center mt-6 text-apple-text-secondary text-sm">
              <Clock className="mr-2" size={16} />
              <span>Available 24/7 • Premium locations • Instant booking</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
            <div className="apple-card-strong text-center p-6">
              <div className="text-3xl font-bold text-apple-accent mb-2">500+</div>
              <div className="text-apple-text-secondary">Premium Spots</div>
            </div>
            <div className="apple-card-strong text-center p-6">
              <div className="text-3xl font-bold text-apple-success mb-2">24/7</div>
              <div className="text-apple-text-secondary">Availability</div>
            </div>
            <div className="apple-card-strong text-center p-6">
              <div className="text-3xl font-bold text-apple-accent mb-2">$7+</div>
              <div className="text-apple-text-secondary">Starting Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Popular Destinations */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            Popular Destinations
          </h2>
          <p className="text-apple-text-secondary text-lg">
            Quick access to frequently visited locations
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="apple-card p-6 animate-pulse">
                <div className="h-4 apple-glass rounded mb-3"></div>
                <div className="h-3 apple-glass rounded w-3/4 mb-2"></div>
                <div className="h-3 apple-glass rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularBusinesses.map((business) => (
              <button
                key={business.id}
                onClick={() => handleBusinessSelect(business)}
                className="apple-card text-left p-6 transition-all duration-300 hover:scale-105 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-apple-text text-lg mb-1 group-hover:text-apple-accent transition-colors">
                      {business.name}
                    </h3>
                    <p className="text-apple-text-secondary text-sm mb-2">
                      {business.category}
                    </p>
                  </div>
                  <ArrowRight 
                    className="text-apple-accent opacity-0 group-hover:opacity-100 transition-opacity ml-2" 
                    size={20} 
                  />
                </div>
                
                <div className="flex items-center mb-2">
                  <MapPin className="text-apple-text-secondary mr-1" size={14} />
                  <span className="text-apple-text-secondary text-sm truncate">
                    {business.address}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock className="text-apple-text-secondary mr-1" size={14} />
                    <span className="text-apple-text-secondary text-sm">
                      {business.averageParkingDemand} demand
                    </span>
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="text-apple-success mr-1" size={14} />
                    <span className="text-apple-success text-sm font-semibold">
                      ${Math.floor(Math.random() * 15) + 12}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* How it Works */}
      <div className="max-w-4xl mx-auto px-4 pb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-apple-text mb-3">
            How Parkr Works
          </h2>
          <p className="text-apple-text-secondary text-lg">
            Premium parking made simple
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="apple-card-strong w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Search className="text-apple-accent" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-apple-text mb-2">
              Search
            </h3>
            <p className="text-apple-text-secondary">
              Find your destination and see available parking spots with real-time pricing
            </p>
          </div>

          <div className="text-center">
            <div className="apple-card-strong w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <DollarSign className="text-apple-success" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-apple-text mb-2">
              Book
            </h3>
            <p className="text-apple-text-secondary">
              Reserve your spot instantly with secure payment and get directions to your parker
            </p>
          </div>

          <div className="text-center">
            <div className="apple-card-strong w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <MapPin className="text-apple-accent" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-apple-text mb-2">
              Arrive
            </h3>
            <p className="text-apple-text-secondary">
              Meet your parker, hand over your keys, and enjoy your destination worry-free
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CleanSearchView
