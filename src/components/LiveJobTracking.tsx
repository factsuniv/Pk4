import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/MockAuthContext'
import { liveJobSystem, LiveJob } from '../lib/liveJobSystem'
import { 
  MapPin, 
  Clock, 
  Phone, 
  MessageCircle, 
  Navigation, 
  CheckCircle,
  Car,
  User,
  Star,
  AlertCircle
} from 'lucide-react'

const LiveJobTracking = () => {
  const { userProfile: user } = useAuth()
  const [currentJob, setCurrentJob] = useState<LiveJob | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const unsubscribe = liveJobSystem.subscribeToCustomerJob(user.uid, (job) => {
      setCurrentJob(job)
      setIsLoading(false)
    })

    return unsubscribe
  }, [user?.uid])

  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`

  const getStatusInfo = (status: LiveJob['status']) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Finding Parker',
          description: 'We\'re finding the best Parker for your job',
          color: 'text-orange-600',
          bgColor: 'bg-orange-100',
          icon: <Clock className="w-5 h-5" />
        }
      case 'accepted':
        return {
          label: 'Parker Assigned',
          description: 'A Parker has accepted your job and will head to the location',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <User className="w-5 h-5" />
        }
      case 'en_route':
        return {
          label: 'Parker En Route',
          description: 'Your Parker is driving to the parking location',
          color: 'text-blue-600',
          bgColor: 'bg-blue-100',
          icon: <Car className="w-5 h-5" />
        }
      case 'searching':
        return {
          label: 'Searching for Spot',
          description: 'Your Parker is looking for the perfect parking spot',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: <Navigation className="w-5 h-5" />
        }
      case 'secured':
        return {
          label: 'Spot Secured!',
          description: 'Perfect! Your parking spot is ready and secured',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-5 h-5" />
        }
      case 'completed':
        return {
          label: 'Job Complete',
          description: 'Thank you for using Parkr! Please rate your experience',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: <CheckCircle className="w-5 h-5" />
        }
      case 'cancelled':
        return {
          label: 'Job Cancelled',
          description: 'This job has been cancelled',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: <AlertCircle className="w-5 h-5" />
        }
      default:
        return {
          label: 'Unknown Status',
          description: 'Job status unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: <Clock className="w-5 h-5" />
        }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your job...</p>
        </div>
      </div>
    )
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Active Jobs</h2>
          <p className="text-gray-600 mb-6">You don't have any active parking jobs right now.</p>
          <button
            onClick={() => window.location.href = '/app/map'}
            className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Book Parking
          </button>
        </div>
      </div>
    )
  }

  const statusInfo = getStatusInfo(currentJob.status)

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Job Tracking</h1>
            <span className="text-sm text-gray-500">
              Job ID: {currentJob.id.slice(0, 8)}
            </span>
          </div>

          {/* Status */}
          <div className={`${statusInfo.bgColor} rounded-xl p-4 mb-4`}>
            <div className="flex items-center space-x-3">
              <div className={statusInfo.color}>
                {statusInfo.icon}
              </div>
              <div>
                <h2 className={`font-semibold ${statusInfo.color}`}>
                  {statusInfo.label}
                </h2>
                <p className="text-sm text-gray-600">
                  {statusInfo.description}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Requested</span>
              <span>Parker Assigned</span>
              <span>En Route</span>
              <span>Spot Secured</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-500 ease-out rounded-full"
                style={{ 
                  width: currentJob.status === 'pending' ? '25%' :
                         currentJob.status === 'accepted' ? '50%' :
                         currentJob.status === 'en_route' ? '75%' :
                         currentJob.status === 'searching' ? '90%' :
                         currentJob.status === 'secured' || currentJob.status === 'completed' ? '100%' :
                         '25%'
                }}
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-start space-x-3 mb-3">
              <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-gray-800">{currentJob.businessName}</h3>
                <p className="text-gray-600">{currentJob.businessAddress}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 mb-3">
              <Car className="w-5 h-5 text-blue-600" />
              <div>
                <span className="font-medium text-gray-800">{currentJob.preferenceLabel}</span>
                <p className="text-sm text-gray-600">Parking preference</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <span className="font-medium text-gray-800">
                    Requested at {formatTime(currentJob.createdAt)}
                  </span>
                  <p className="text-sm text-gray-600">
                    {currentJob.acceptedAt && `Accepted at ${formatTime(currentJob.acceptedAt)}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-600">
                  {formatPrice(currentJob.totalCustomerPrice)}
                </div>
                <div className="text-sm text-gray-500">Total paid</div>
              </div>
            </div>
          </div>
        </div>

        {/* Parker Details */}
        {currentJob.parkerId && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Your Parker</h2>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {currentJob.parkerName}
                </h3>
                <div className="flex items-center space-x-2">
                  <Star className="w-4 h-4 text-yellow-500 fill-current" />
                  <span className="text-sm text-gray-600">4.8 rating • 150+ jobs</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors">
                <Phone className="w-4 h-4" />
                <span>Call Parker</span>
              </button>
              <button className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span>Message</span>
              </button>
            </div>

            {currentJob.estimatedArrival && (
              <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                <div className="flex items-center space-x-2 text-blue-700">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    ETA: {currentJob.estimatedArrival}
                  </span>
                </div>
              </div>
            )}

            {currentJob.spotDetails && (
              <div className="mt-4 p-3 bg-green-50 rounded-xl">
                <div className="flex items-center space-x-2 text-green-700">
                  <CheckCircle className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    {currentJob.spotDetails}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
          
          <div className="space-y-3">
            {currentJob.status === 'secured' && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                <h3 className="font-semibold text-green-800 mb-2">Parking Spot Ready!</h3>
                <p className="text-sm text-green-700 mb-3">
                  Your parking spot is secured and ready. Head to the location now.
                </p>
                <button className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors">
                  Get Directions
                </button>
              </div>
            )}

            {currentJob.status === 'completed' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <h3 className="font-semibold text-blue-800 mb-2">How was your experience?</h3>
                <p className="text-sm text-blue-700 mb-3">
                  Please rate your Parker to help improve our service.
                </p>
                <div className="flex space-x-2 mb-3">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button key={star} className="text-2xl text-yellow-400 hover:text-yellow-500">
                      ★
                    </button>
                  ))}
                </div>
                <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
                  Submit Rating
                </button>
              </div>
            )}

            <button
              onClick={() => window.location.href = '/app/map'}
              className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
            >
              Book Another Spot
            </button>

            {(currentJob.status === 'pending' || currentJob.status === 'accepted') && (
              <button
                onClick={() => liveJobSystem.cancelJob(currentJob.id, 'Cancelled by customer')}
                className="w-full bg-red-100 text-red-700 py-3 rounded-xl font-semibold hover:bg-red-200 transition-colors"
              >
                Cancel Job
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveJobTracking
