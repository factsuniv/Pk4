import { useState, useEffect } from 'react'
import { ArrowLeft, MapPin, Star, Clock, Zap, CreditCard, CheckCircle, Users, Car } from 'lucide-react'
import { Business, businessSearchService } from '../lib/businessSearch'
import { liveJobSystem, PARKING_PREFERENCES } from '../lib/liveJobSystem'
import { useAuth } from '../contexts/MockAuthContext'
import { toast } from 'react-hot-toast'

interface LiveBookingFlowProps {
  onClose: () => void
  preselectedBusiness?: Business | null
}

const LiveBookingFlow = ({ onClose, preselectedBusiness }: LiveBookingFlowProps) => {
  const { userProfile: user } = useAuth()
  const [currentStep, setCurrentStep] = useState(preselectedBusiness ? 2 : 1)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(preselectedBusiness || null)
  const [selectedPreference, setSelectedPreference] = useState<typeof PARKING_PREFERENCES[number] | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<Business[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [tip, setTip] = useState(0)
  const [jobId, setJobId] = useState<string | null>(null)

  // Popular businesses for quick selection
  const [popularBusinesses, setPopularBusinesses] = useState<Business[]>([])

  useEffect(() => {
    // Load popular businesses on mount
    const loadPopularBusinesses = async () => {
      const popular = await businessSearchService.getPopularBusinesses()
      setPopularBusinesses(popular.slice(0, 6))
    }
    loadPopularBusinesses()
  }, [])

  // Handle business search
  useEffect(() => {
    const searchBusinesses = async () => {
      if (searchQuery.length > 2) {
        const results = await businessSearchService.searchBusinesses(searchQuery, { limit: 5 })
        setSearchResults(results)
        setShowSearchResults(true)
      } else {
        setSearchResults([])
        setShowSearchResults(false)
      }
    }
    searchBusinesses()
  }, [searchQuery])

  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business)
    setSearchQuery('')
    setShowSearchResults(false)
    setCurrentStep(2)
    toast.success(`Selected ${business.name}`)
  }

  const handlePreferenceSelect = (preference: typeof PARKING_PREFERENCES[number]) => {
    setSelectedPreference(preference)
    setCurrentStep(3)
    toast.success(`Selected ${preference.label}`)
  }

  const handleBookingConfirm = async () => {
    if (!selectedBusiness || !selectedPreference || !user) {
      toast.error('Please complete all steps')
      return
    }

    setIsLoading(true)

    try {
      const newJobId = liveJobSystem.createJob({
        customerId: user.uid,
        customerName: user.displayName || 'Customer',
        customerPhone: user.phone || '+1 (555) 123-4567',
        businessId: selectedBusiness.id,
        businessName: selectedBusiness.name,
        businessAddress: selectedBusiness.address,
        businessCoordinates: selectedBusiness.coordinates,
        parkingPreference: selectedPreference.id,
        preferenceLabel: selectedPreference.label,
        customerPrice: selectedPreference.customerPrice,
        parkerPay: selectedPreference.parkerPay,
        tip: tip
      })

      setJobId(newJobId)
      setCurrentStep(4)
      toast.success('Booking confirmed! Finding Parkers...')
    } catch (error) {
      toast.error('Failed to create booking. Please try again.')
      console.error('Booking error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20">
        {/* Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-200/30 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {currentStep > 1 && (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Book Parking</h2>
                <p className="text-sm text-gray-600">Step {currentStep} of 4</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-6">
          {/* Step 1: Business Selection */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Where do you need parking?</h3>
                <p className="text-gray-600">Search for any business in Collin County</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search TopGolf, Legacy West, restaurants..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/80 backdrop-blur-sm"
                  />
                </div>

                {/* Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-xl mt-2 max-h-96 overflow-y-auto z-10">
                    {searchResults.map((business) => (
                      <button
                        key={business.id}
                        onClick={() => handleBusinessSelect(business)}
                        className="w-full text-left p-4 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition-colors group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-800 group-hover:text-blue-700">{business.name}</h4>
                            <p className="text-sm text-gray-600">{business.address}</p>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {business.category}
                              </span>
                              <span className="text-xs text-gray-500">
                                {business.parkingSpots.length} spots available
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`w-3 h-3 rounded-full ${
                              business.averageParkingDemand === 'extreme' ? 'bg-red-500' :
                              business.averageParkingDemand === 'very high' ? 'bg-orange-500' :
                              business.averageParkingDemand === 'high' ? 'bg-yellow-500' :
                              'bg-green-500'
                            }`} />
                            <span className="text-xs text-gray-500 mt-1 block">
                              {business.averageParkingDemand.replace('_', ' ')}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Popular Businesses */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Popular Destinations</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {popularBusinesses.map((business) => (
                    <button
                      key={business.id}
                      onClick={() => handleBusinessSelect(business)}
                      className="text-left p-4 bg-gray-50 hover:bg-blue-50 border border-gray-200 rounded-xl transition-colors group"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h5 className="font-medium text-gray-800 group-hover:text-blue-700">{business.name}</h5>
                          <p className="text-xs text-gray-600">{business.category}</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          business.averageParkingDemand === 'extreme' ? 'bg-red-500' :
                          business.averageParkingDemand === 'very high' ? 'bg-orange-500' :
                          business.averageParkingDemand === 'high' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`} />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Parking Preference Selection */}
          {currentStep === 2 && selectedBusiness && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose your parking preference</h3>
                <p className="text-gray-600">Parking at <span className="font-medium">{selectedBusiness.name}</span></p>
              </div>

              <div className="space-y-4">
                {PARKING_PREFERENCES.map((preference) => (
                  <button
                    key={preference.id}
                    onClick={() => handlePreferenceSelect(preference)}
                    className={`w-full text-left p-6 border-2 rounded-2xl transition-all ${
                      selectedPreference?.id === preference.id
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-semibold text-gray-800 text-lg">{preference.label}</h4>
                          <span className="text-2xl font-bold text-blue-600">
                            {formatPrice(preference.customerPrice)}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{preference.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{preference.estimatedTime}</span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <Users className="w-4 h-4" />
                            <span>Parker earns {formatPrice(preference.parkerPay)}</span>
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-3">
                          {preference.features.map((feature, index) => (
                            <span key={index} className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="ml-4">
                        {selectedPreference?.id === preference.id && (
                          <CheckCircle className="w-6 h-6 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Confirmation & Payment */}
          {currentStep === 3 && selectedBusiness && selectedPreference && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Confirm your booking</h3>
                <p className="text-gray-600">Review details and add optional tip</p>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-2xl p-6 space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedBusiness.name}</h4>
                    <p className="text-gray-600">{selectedBusiness.address}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Car className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedPreference.label}</h4>
                    <p className="text-gray-600">{selectedPreference.description}</p>
                  </div>
                </div>
              </div>

              {/* Tip Selection */}
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Add tip for your Parker (optional)</h4>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  {[0, 2, 5, 10].map((tipAmount) => (
                    <button
                      key={tipAmount}
                      onClick={() => setTip(tipAmount)}
                      className={`p-3 rounded-xl text-center font-medium transition-colors ${
                        tip === tipAmount
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-blue-100'
                      }`}
                    >
                      {tipAmount === 0 ? 'No tip' : `$${tipAmount}`}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  placeholder="Custom tip amount"
                  value={tip || ''}
                  onChange={(e) => setTip(Number(e.target.value) || 0)}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Price Breakdown */}
              <div className="bg-blue-50 rounded-2xl p-6">
                <h4 className="font-semibold text-gray-800 mb-4">Price Breakdown</h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Parking service</span>
                    <span className="font-medium">{formatPrice(selectedPreference.customerPrice)}</span>
                  </div>
                  {tip > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tip for Parker</span>
                      <span className="font-medium">{formatPrice(tip)}</span>
                    </div>
                  )}
                  <div className="border-t border-blue-200 pt-2 flex justify-between">
                    <span className="font-semibold text-gray-800">Total</span>
                    <span className="font-bold text-xl text-blue-600">
                      {formatPrice(selectedPreference.customerPrice + tip)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBookingConfirm}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-semibold text-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Creating job...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Confirm & Pay {formatPrice(selectedPreference.customerPrice + tip)}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Step 4: Booking Confirmed */}
          {currentStep === 4 && jobId && (
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">Booking Confirmed!</h3>
                <p className="text-gray-600">Your job has been created and sent to nearby Parkers</p>
              </div>
              
              <div className="bg-blue-50 rounded-2xl p-6 text-left">
                <h4 className="font-semibold text-gray-800 mb-3">Job Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job ID</span>
                    <span className="font-mono text-gray-800">{jobId.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location</span>
                    <span className="text-gray-800">{selectedBusiness?.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service</span>
                    <span className="text-gray-800">{selectedPreference?.label}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Paid</span>
                    <span className="font-semibold text-gray-800">
                      {formatPrice((selectedPreference?.customerPrice || 0) + tip)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    onClose()
                    // Navigate to job tracking would happen here
                    window.location.href = '/app/tracking'
                  }}
                  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  Track Your Job
                </button>
                <button
                  onClick={onClose}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
                >
                  Back to Map
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LiveBookingFlow