import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { 
  ArrowLeft,
  Clock,
  MapPin,
  Star,
  DollarSign,
  Shield,
  Car,
  Phone,
  Navigation2,
  CheckCircle,
  CreditCard,
  Calendar
} from 'lucide-react'
import type { ParkingSpot, Booking } from '../contexts/AppContext'

const BookingFlow = () => {
  const { spotId } = useParams()
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedDuration, setSelectedDuration] = useState(2) // hours
  const [isLoading, setIsLoading] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [confirmationCode, setConfirmationCode] = useState('')

  // Find the selected spot
  const spot = [...state.parkingSpots.downtown_dallas, ...state.parkingSpots.legacy_plano]
    .find(s => s.id === spotId)

  useEffect(() => {
    if (!spot) {
      navigate('/app')
      return
    }
    dispatch({ type: 'SELECT_SPOT', payload: spot })
  }, [spot, navigate, dispatch])

  const calculateTotal = () => {
    if (!spot) return 0
    const basePrice = spot.price * selectedDuration
    const serviceFee = Math.round(basePrice * 0.08 * 100) / 100
    return basePrice + serviceFee + 2.99 // base fee
  }

  const handleBooking = async () => {
    if (!spot) return
    
    setIsLoading(true)
    
    // Simulate booking process
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const booking: Booking = {
      id: `BK${Date.now()}`,
      spot_id: spot.id,
      user_id: 'demo_user',
      parker_name: spot.parker_name,
      location: spot.location.name,
      start_time: new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      end_time: new Date(Date.now() + selectedDuration * 60 * 60 * 1000).toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
      }),
      total_price: calculateTotal(),
      status: 'upcoming',
      confirmation_code: `PKR${Math.random().toString(36).substr(2, 6).toUpperCase()}`
    }

    setConfirmationCode(booking.confirmation_code)
    dispatch({ type: 'ADD_BOOKING', payload: booking })
    dispatch({ type: 'SET_CURRENT_BOOKING', payload: booking })
    dispatch({ type: 'UPDATE_SPOT_STATUS', payload: { spotId: spot.id, status: 'reserved' } })
    
    setIsLoading(false)
    setBookingConfirmed(true)
    setCurrentStep(4)
  }

  const handleContactParker = () => {
    // Simulate opening phone app
    alert(`Calling ${spot?.parker_name} at +1 (214) 555-${Math.floor(1000 + Math.random() * 9000)}`)
  }

  const handleNavigation = () => {
    if (!spot) return
    // Simulate opening maps app
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${spot.location.lat},${spot.location.lng}`
    window.open(mapsUrl, '_blank')
  }

  if (!spot) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="text-lg font-medium text-gray-900">Spot not found</div>
          <button 
            onClick={() => navigate('/app')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Map
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full apple-gradient-mesh">
      <div className="max-w-5xl mx-auto py-12 px-6">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-12">
          <button
            onClick={() => navigate('/app')}
            className="p-4 apple-glass rounded-2xl apple-interactive shadow-apple"
          >
            <ArrowLeft className="w-7 h-7 text-apple-text" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-apple-text">
              {bookingConfirmed ? 'Booking Confirmed!' : 'Reserve Parking Spot'}
            </h1>
            <p className="text-apple-text-secondary text-xl">{spot.location.name}</p>
          </div>
        </div>

        {/* Progress Steps */}
        {!bookingConfirmed && (
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
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Spot Details */}
          <div className="apple-card-strong apple-floating">
            <h2 className="text-2xl font-bold text-apple-text mb-6">Parking Details</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-5">
                <div className="w-16 h-16 apple-gradient-primary rounded-2xl flex items-center justify-center shadow-apple">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-apple-text text-xl">{spot.location.name}</h3>
                  <p className="text-apple-text-secondary text-lg">{spot.location.address}</p>
                  <p className="text-apple-text-tertiary mt-2">{spot.distance_walk}</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-gradient-to-br from-apple-success to-green-400 rounded-2xl flex items-center justify-center shadow-apple">
                  <Clock className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-apple-text text-xl">Available Hours</h3>
                  <p className="text-apple-text-secondary text-lg">{spot.availability.start} - {spot.availability.end}</p>
                </div>
              </div>

              <div className="flex items-center space-x-5">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-apple text-xl">
                  {spot.parker_name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-apple-text text-xl">{spot.parker_name}</h3>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Star className="w-5 h-5 text-apple-warning" />
                      <span className="text-apple-text font-medium">{spot.parker_rating}</span>
                    </div>
                    <span className="text-apple-text-tertiary">•</span>
                    <span className="text-apple-text">${spot.earnings} earned</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="mt-8">
              <h3 className="font-bold text-apple-text mb-4 text-xl">Amenities</h3>
              <div className="flex flex-wrap gap-3">
                {spot.amenities.map((amenity) => (
                  <span
                    key={amenity}
                    className="apple-badge apple-glass-subtle text-apple-text font-semibold"
                  >
                    {amenity.replace('_', ' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Booking Form / Confirmation */}
          <div className="apple-card-strong apple-floating">
            {bookingConfirmed ? (
              <div className="text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-apple-success to-green-400 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-apple animate-apple-bounce">
                  <CheckCircle className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-apple-text mb-4">Booking Confirmed!</h2>
                <p className="text-apple-text-secondary mb-8 text-xl">Your parking spot is reserved</p>
                
                <div className="apple-card rounded-3xl p-6 mb-8">
                  <div className="text-apple-text-secondary mb-2">Confirmation Code</div>
                  <div className="text-3xl font-bold text-apple-text">{confirmationCode}</div>
                </div>

                <div className="space-y-6">
                  <button
                    onClick={handleNavigation}
                    className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-6 text-xl apple-interactive"
                  >
                    <Navigation2 className="w-6 h-6" />
                    <span>Navigate to Spot</span>
                  </button>
                  
                  <button
                    onClick={handleContactParker}
                    className="w-full apple-button-secondary flex items-center justify-center space-x-3 px-8 py-6 text-xl apple-interactive"
                  >
                    <Phone className="w-6 h-6" />
                    <span>Contact Parker</span>
                  </button>
                </div>

                <div className="mt-10 text-left space-y-4">
                  <div className="flex items-center space-x-4">
                    <Car className="w-6 h-6 text-apple-accent" />
                    <span className="text-apple-text text-lg">Your parker will be waiting in their car</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Shield className="w-6 h-6 text-apple-accent" />
                    <span className="text-apple-text text-lg">Show confirmation code for quick handoff</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Clock className="w-6 h-6 text-apple-accent" />
                    <span className="text-apple-text text-lg">Please arrive within 10 minutes</span>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-apple-text mb-8">Booking Summary</h2>
                
                {/* Duration Selection */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-apple-text mb-4">
                    Select Duration
                  </label>
                  <div className="grid grid-cols-3 gap-4">
                    {[1, 2, 3, 4, 6, 8].map((hours) => (
                      <button
                        key={hours}
                        onClick={() => setSelectedDuration(hours)}
                        className={`p-4 rounded-2xl text-center transition-all duration-300 apple-interactive ${
                          selectedDuration === hours
                            ? 'apple-gradient-primary text-white shadow-apple'
                            : 'apple-glass text-apple-text'
                        }`}
                      >
                        <div className="font-bold text-lg">{hours}h</div>
                        <div className="text-sm opacity-80">${spot.price * hours}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="apple-card rounded-3xl p-6 mb-8">
                  <h3 className="font-bold text-apple-text mb-4 text-xl">Price Breakdown</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span className="text-apple-text">Parking ({selectedDuration}h @ ${spot.price}/h)</span>
                      <span className="text-apple-text font-semibold">${spot.price * selectedDuration}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-apple-text">Service Fee (8%)</span>
                      <span className="text-apple-text font-semibold">${Math.round(spot.price * selectedDuration * 0.08 * 100) / 100}</span>
                    </div>
                    <div className="flex justify-between text-lg">
                      <span className="text-apple-text">Booking Fee</span>
                      <span className="text-apple-text font-semibold">$2.99</span>
                    </div>
                    <div className="border-t border-white/20 pt-3 flex justify-between">
                      <span className="text-apple-text font-bold text-xl">Total</span>
                      <span className="text-apple-text font-bold text-xl">${calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="mb-8">
                  <label className="block text-lg font-semibold text-apple-text mb-4">
                    Payment Method
                  </label>
                  <div className="apple-glass rounded-2xl p-6 flex items-center space-x-4 shadow-apple">
                    <CreditCard className="w-8 h-8 text-apple-accent" />
                    <div>
                      <div className="font-semibold text-apple-text text-lg">•••• •••• •••• 4242</div>
                      <div className="text-apple-text-secondary">Expires 12/25</div>
                    </div>
                  </div>
                </div>

                {/* Confirm Booking Button */}
                <button
                  onClick={handleBooking}
                  disabled={isLoading}
                  className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-6 text-xl apple-interactive disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <div className="apple-loading" />
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Confirm Booking - ${calculateTotal()}</span>
                    </>
                  )}
                </button>

                <p className="text-apple-text-tertiary mt-4 text-center">
                  By booking, you agree to our Terms of Service and Privacy Policy
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingFlow
