import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '../contexts/MockAuthContext'
import { 
  ArrowLeft,
  MapPin,
  Search,
  Star,
  Clock,
  DollarSign,
  CheckCircle,
  Car,
  Shield,
  Navigation2,
  Plus,
  Minus
} from 'lucide-react'
import { SPOT_PREFERENCES, SpotPreference, Business } from '../types'
import BusinessSearch from './BusinessSearch'
import { businessSearchService } from '../lib/businessSearch'
import { mockJobService } from '../lib/mockJobService'
import toast from 'react-hot-toast'

const NewBookingFlow = () => {
  const navigate = useNavigate()
  const { spotId } = useParams()
  const { userProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null)
  const [selectedPreference, setSelectedPreference] = useState<SpotPreference | null>(null)
  const [tip, setTip] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (showLocationSearch && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showLocationSearch])





  const handleBusinessSelect = (business: Business) => {
    setSelectedBusiness(business)
    setCurrentStep(2)
    toast.success(`Selected ${business.name}`)
  }

  const handlePreferenceSelect = (preference: SpotPreference) => {
    setSelectedPreference(preference)
    setCurrentStep(3)
  }

  const calculateTotal = () => {
    if (!selectedPreference) return 0
    return selectedPreference.price + tip
  }

  const handleConfirmBooking = async () => {
    if (!userProfile || !selectedBusiness || !selectedPreference) {
      toast.error('Missing required information')
      return
    }

    try {
      const jobData = {
        customerId: userProfile.uid,
        customerName: userProfile.displayName || userProfile.email,
        customerPhone: userProfile.phone || '',
        businessId: selectedBusiness.id,
        businessName: selectedBusiness.name,
        businessAddress: selectedBusiness.address,
        businessLocation: {
          lat: selectedBusiness.coordinates.lat,
          lng: selectedBusiness.coordinates.lng
        },
        spotPreference: selectedPreference.id,
        spotPreferenceLabel: selectedPreference.label,
        basePrice: selectedPreference.price,
        parkerPay: selectedPreference.parkerPay,
        tip: tip,
        totalPrice: calculateTotal()
      }

      const jobId = await mockJobService.createJobRequest(jobData)
      
      toast.success('Booking confirmed! Finding a Parker for you...')
      navigate(`/app/job-tracking/${jobId}`)
      
    } catch (error) {
      console.error('Booking error:', error)
      toast.error('Failed to create booking')
    }
  }

  return (
    <div className="h-full apple-gradient-mesh">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-8">
          <button
            onClick={() => currentStep > 1 ? setCurrentStep(currentStep - 1) : navigate('/app')}
            className="p-4 apple-glass rounded-2xl apple-interactive shadow-apple"
          >
            <ArrowLeft className="w-7 h-7 text-apple-text" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-apple-text">Book Parking</h1>
            <p className="text-apple-text-secondary text-xl">
              Step {currentStep} of 3: {
                currentStep === 1 ? 'Choose Location' :
                currentStep === 2 ? 'Select Preference' : 'Confirm & Pay'
              }
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-apple transition-all duration-300 ${
                currentStep >= step ? 'apple-gradient-primary text-white' : 'apple-glass text-apple-text-secondary'
              }`}>
                {step}
              </div>
              {step < 3 && (
                <div className={`w-20 h-2 mx-4 rounded-full transition-all duration-300 ${
                  currentStep > step ? 'apple-gradient-primary' : 'apple-glass'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Location Selection */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Where do you need parking?</h2>
              <p className="text-apple-text-secondary text-lg">Choose a popular destination or search for a specific business</p>
            </div>

            {/* Business Search */}
            <div className="apple-card-strong rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-apple-text mb-6">Find Your Destination</h3>
              <BusinessSearch
                onBusinessSelect={handleBusinessSelect}
                placeholder="Search businesses, restaurants, shopping in Collin County..."
                showPopular={true}
                className="w-full"
              />
            </div>


          </div>
        )}

        {/* Step 2: Spot Preference */}
        {currentStep === 2 && selectedBusiness && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Choose Your Parking Preference</h2>
              <p className="text-apple-text-secondary text-lg">
                Parking for <span className="font-semibold">{selectedBusiness.name}</span>
              </p>
            </div>

            <div className="space-y-6">
              {SPOT_PREFERENCES.map((preference) => (
                <button
                  key={preference.id}
                  onClick={() => handlePreferenceSelect(preference)}
                  className="w-full apple-card apple-floating p-8 text-left apple-interactive"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-apple-text">{preference.label}</h3>
                      <p className="text-apple-text-secondary text-lg">{preference.description}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-apple-text">${preference.price}</div>
                      <div className="text-apple-text-secondary">Parker gets ${preference.parkerPay}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-5 h-5 text-apple-accent" />
                      <span className="text-apple-text">{preference.estimatedTime}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {preference.features.map((feature) => (
                      <span
                        key={feature}
                        className="apple-badge apple-glass-subtle text-apple-text"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </button>
              ))}
            </div>

            <div className="apple-card rounded-3xl p-6">
              <div className="flex items-center space-x-3 text-apple-accent">
                <DollarSign className="w-6 h-6" />
                <span className="font-semibold text-lg">Competitive Parker Pay</span>
              </div>
              <p className="text-apple-text-secondary mt-2">
                Our Parkers earn $7-8.50 per job (vs. $8-12/hour on DoorDash). 
                Help drivers make better money with shorter, higher-paying gigs!
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Confirmation & Tip */}
        {currentStep === 3 && selectedBusiness && selectedPreference && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Confirm Your Booking</h2>
              <p className="text-apple-text-secondary text-lg">Review your order and add an optional tip</p>
            </div>

            {/* Order Summary */}
            <div className="apple-card-strong rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-apple-text mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-apple-accent mt-1" />
                  <div>
                    <h4 className="font-semibold text-apple-text">{selectedBusiness.name}</h4>
                    <p className="text-apple-text-secondary">{selectedBusiness.address}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Car className="w-6 h-6 text-apple-accent mt-1" />
                  <div>
                    <h4 className="font-semibold text-apple-text">{selectedPreference.label}</h4>
                    <p className="text-apple-text-secondary">{selectedPreference.description}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-text">Parking service</span>
                  <span className="text-apple-text font-semibold">${selectedPreference.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-apple-text">Tip</span>
                  <span className="text-apple-text font-semibold">${tip}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-white/20">
                  <span className="text-apple-text font-bold text-xl">Total</span>
                  <span className="text-apple-text font-bold text-xl">${calculateTotal()}</span>
                </div>
              </div>
            </div>

            {/* Tip Selection */}
            <div className="apple-card rounded-3xl p-6">
              <h3 className="text-xl font-bold text-apple-text mb-4">Add Tip (Optional)</h3>
              <p className="text-apple-text-secondary mb-4">
                Show appreciation for great service
              </p>
              
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setTip(Math.max(0, tip - 1))}
                  className="w-12 h-12 apple-glass rounded-full flex items-center justify-center apple-interactive"
                >
                  <Minus className="w-5 h-5 text-apple-text" />
                </button>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-apple-text">${tip}</div>
                  <div className="text-apple-text-secondary">tip</div>
                </div>
                
                <button
                  onClick={() => setTip(Math.min(10, tip + 1))}
                  className="w-12 h-12 apple-glass rounded-full flex items-center justify-center apple-interactive"
                >
                  <Plus className="w-5 h-5 text-apple-text" />
                </button>
              </div>

              <div className="flex space-x-3 mt-4 justify-center">
                {[0, 2, 3, 5].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => setTip(amount)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      tip === amount 
                        ? 'apple-gradient-primary text-white' 
                        : 'apple-glass text-apple-text'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleConfirmBooking}
              className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-6 text-2xl apple-interactive"
            >
              <CheckCircle className="w-8 h-8" />
              <span>Confirm Booking - ${calculateTotal()}</span>
            </button>

            <div className="text-center text-apple-text-tertiary">
              <p>No payment required now. You'll pay your Parker directly upon completion.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default NewBookingFlow
