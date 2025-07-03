import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/MockAuthContext'
import { 
  ArrowLeft,
  Car,
  MapPin,
  Phone,
  User,
  CheckCircle,
  DollarSign
} from 'lucide-react'
import { COLLIN_COUNTY_CITIES } from '../lib/collinCounty'
import toast from 'react-hot-toast'

const ParkerRegistration = () => {
  const navigate = useNavigate()
  const { userProfile, updateUserProfile } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    phone: '',
    serviceAreas: [] as string[],
    vehicleInfo: {
      make: '',
      model: '',
      color: '',
      licensePlate: ''
    }
  })

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('vehicleInfo.')) {
      const vehicleField = field.split('.')[1]
      setFormData(prev => ({
        ...prev,
        vehicleInfo: {
          ...prev.vehicleInfo,
          [vehicleField]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const handleServiceAreaToggle = (city: string) => {
    setFormData(prev => ({
      ...prev,
      serviceAreas: prev.serviceAreas.includes(city)
        ? prev.serviceAreas.filter(area => area !== city)
        : [...prev.serviceAreas, city]
    }))
  }

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.phone) {
        toast.error('Please enter your phone number')
        return
      }
      setCurrentStep(2)
    } else if (currentStep === 2) {
      if (formData.serviceAreas.length === 0) {
        toast.error('Please select at least one service area')
        return
      }
      setCurrentStep(3)
    } else if (currentStep === 3) {
      const { make, model, color, licensePlate } = formData.vehicleInfo
      if (!make || !model || !color || !licensePlate) {
        toast.error('Please fill in all vehicle information')
        return
      }
      setCurrentStep(4)
    }
  }

  const handleComplete = async () => {
    setLoading(true)
    try {
      await updateUserProfile({
        phone: formData.phone,
        serviceArea: formData.serviceAreas,
        vehicleInfo: formData.vehicleInfo
      })
      
      toast.success('Parker profile completed! You can now start accepting jobs.')
      navigate('/app/parker/dashboard')
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('Failed to complete registration')
    } finally {
      setLoading(false)
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
            <h1 className="text-4xl font-bold text-apple-text">Become a Parker</h1>
            <p className="text-apple-text-secondary text-xl">
              Step {currentStep} of 4: Complete your profile
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((step) => (
            <div key={step} className="flex items-center">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shadow-apple transition-all duration-300 ${
                currentStep >= step ? 'apple-gradient-primary text-white' : 'apple-glass text-apple-text-secondary'
              }`}>
                {step}
              </div>
              {step < 4 && (
                <div className={`w-20 h-2 mx-4 rounded-full transition-all duration-300 ${
                  currentStep > step ? 'apple-gradient-primary' : 'apple-glass'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Contact Information</h2>
              <p className="text-apple-text-secondary text-lg">
                We need your phone number to connect you with customers
              </p>
            </div>

            <div className="apple-card-strong rounded-3xl p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div>
                  <label className="block text-apple-text font-semibold mb-3 text-lg">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-5 top-1/2 transform -translate-y-1/2 text-apple-text-secondary w-6 h-6" />
                    <input
                      type="tel"
                      placeholder="(555) 123-4567"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="apple-input pl-16 text-lg"
                    />
                  </div>
                  <p className="text-apple-text-secondary text-sm mt-2">
                    This will be used for customer communication and job notifications
                  </p>
                </div>

                <div className="apple-card p-6">
                  <div className="flex items-center space-x-3 text-apple-accent mb-4">
                    <DollarSign className="w-6 h-6" />
                    <span className="font-semibold text-lg">Earning Potential</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-apple-text">Quick jobs (5-15 min)</span>
                      <span className="font-bold text-apple-text">$7 - $8.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-apple-text">Potential hourly rate</span>
                      <span className="font-bold text-apple-text">$20 - $35/hour</span>
                    </div>
                    <div className="text-apple-text-secondary text-sm mt-3">
                      Much better than DoorDash's $8-12/hour + you control your schedule!
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="apple-button-primary px-12 py-4 text-xl apple-interactive"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Service Areas */}
        {currentStep === 2 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Service Areas</h2>
              <p className="text-apple-text-secondary text-lg">
                Select the Collin County areas where you'd like to work
              </p>
            </div>

            <div className="apple-card-strong rounded-3xl p-8">
              <div className="grid md:grid-cols-3 gap-4">
                {COLLIN_COUNTY_CITIES.map((city) => (
                  <button
                    key={city}
                    onClick={() => handleServiceAreaToggle(city)}
                    className={`p-4 rounded-2xl text-left transition-all apple-interactive ${
                      formData.serviceAreas.includes(city)
                        ? 'apple-gradient-primary text-white shadow-apple'
                        : 'apple-glass text-apple-text hover:apple-glass-strong'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">{city}</span>
                      {formData.serviceAreas.includes(city) && (
                        <CheckCircle className="w-5 h-5" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-6 p-4 apple-glass-subtle rounded-2xl">
                <p className="text-apple-text-secondary text-center">
                  Selected {formData.serviceAreas.length} areas. 
                  You can change these anytime in your profile.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                disabled={formData.serviceAreas.length === 0}
                className="apple-button-primary px-12 py-4 text-xl apple-interactive disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Vehicle Information */}
        {currentStep === 3 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Vehicle Information</h2>
              <p className="text-apple-text-secondary text-lg">
                Help customers identify you when you arrive
              </p>
            </div>

            <div className="apple-card-strong rounded-3xl p-8 max-w-2xl mx-auto">
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-apple-text font-semibold mb-3">Make</label>
                    <input
                      type="text"
                      placeholder="Toyota"
                      value={formData.vehicleInfo.make}
                      onChange={(e) => handleInputChange('vehicleInfo.make', e.target.value)}
                      className="apple-input"
                    />
                  </div>
                  <div>
                    <label className="block text-apple-text font-semibold mb-3">Model</label>
                    <input
                      type="text"
                      placeholder="Camry"
                      value={formData.vehicleInfo.model}
                      onChange={(e) => handleInputChange('vehicleInfo.model', e.target.value)}
                      className="apple-input"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-apple-text font-semibold mb-3">Color</label>
                    <input
                      type="text"
                      placeholder="Silver"
                      value={formData.vehicleInfo.color}
                      onChange={(e) => handleInputChange('vehicleInfo.color', e.target.value)}
                      className="apple-input"
                    />
                  </div>
                  <div>
                    <label className="block text-apple-text font-semibold mb-3">License Plate</label>
                    <input
                      type="text"
                      placeholder="ABC1234"
                      value={formData.vehicleInfo.licensePlate}
                      onChange={(e) => handleInputChange('vehicleInfo.licensePlate', e.target.value.toUpperCase())}
                      className="apple-input"
                    />
                  </div>
                </div>

                <div className="apple-card p-4">
                  <div className="flex items-center space-x-3 text-apple-accent mb-2">
                    <Car className="w-5 h-5" />
                    <span className="font-semibold">Vehicle Preview</span>
                  </div>
                  <p className="text-apple-text">
                    {formData.vehicleInfo.color || 'Color'} {formData.vehicleInfo.make || 'Make'} {formData.vehicleInfo.model || 'Model'}
                    {formData.vehicleInfo.licensePlate && ` - ${formData.vehicleInfo.licensePlate}`}
                  </p>
                </div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleNext}
                className="apple-button-primary px-12 py-4 text-xl apple-interactive"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <div className="space-y-8">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-apple-text mb-4">Ready to Start!</h2>
              <p className="text-apple-text-secondary text-lg">
                Review your information and complete your Parker profile
              </p>
            </div>

            <div className="apple-card-strong rounded-3xl p-8 max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-apple-text mb-6">Profile Summary</h3>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Phone className="w-6 h-6 text-apple-accent" />
                  <div>
                    <p className="font-semibold text-apple-text">Phone</p>
                    <p className="text-apple-text-secondary">{formData.phone}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-apple-accent mt-1" />
                  <div>
                    <p className="font-semibold text-apple-text">Service Areas</p>
                    <p className="text-apple-text-secondary">
                      {formData.serviceAreas.join(', ')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Car className="w-6 h-6 text-apple-accent mt-1" />
                  <div>
                    <p className="font-semibold text-apple-text">Vehicle</p>
                    <p className="text-apple-text-secondary">
                      {formData.vehicleInfo.color} {formData.vehicleInfo.make} {formData.vehicleInfo.model}
                    </p>
                    <p className="text-apple-text-secondary">
                      License: {formData.vehicleInfo.licensePlate}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="apple-card rounded-3xl p-6 max-w-2xl mx-auto">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 text-apple-success mx-auto mb-4" />
                <h3 className="text-xl font-bold text-apple-text mb-2">You're All Set!</h3>
                <p className="text-apple-text-secondary">
                  Once you complete registration, you'll be able to see available jobs 
                  and start earning money immediately.
                </p>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleComplete}
                disabled={loading}
                className="apple-button-primary px-12 py-4 text-xl apple-interactive disabled:opacity-50"
              >
                {loading ? 'Setting up your profile...' : 'Complete Registration'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ParkerRegistration