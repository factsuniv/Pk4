import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/MockAuthContext'
import { 
  ArrowLeft,
  MapPin,
  Clock,
  Phone,
  Navigation2,
  CheckCircle,
  Car,
  Star,
  MessageCircle
} from 'lucide-react'
import { mockJobService } from '../lib/mockJobService'
import { JobRequest } from '../types'
import toast from 'react-hot-toast'

const JobTracking = () => {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [job, setJob] = useState<JobRequest | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!jobId) {
      navigate('/app')
      return
    }

    // Subscribe to job updates
    const unsubscribe = mockJobService.subscribeToJob(jobId, (updatedJob) => {
      setJob(updatedJob)
      setLoading(false)
      
      if (updatedJob) {
        // Show status update notifications
        showStatusNotification(updatedJob.status)
      }
    })

    return unsubscribe
  }, [jobId, navigate])

  const showStatusNotification = (status: JobRequest['status']) => {
    const messages = {
      pending: 'Looking for an available Parker...',
      parker_assigned: 'Parker assigned! They\'re on their way.',
      parker_en_route: 'Parker is heading to find your spot.',
      spot_secured: 'Great news! Your spot is ready!',
      completed: 'Job completed. Thank you for using Parkr!',
      cancelled: 'Job was cancelled.'
    }
    
    if (status === 'spot_secured' || status === 'completed') {
      toast.success(messages[status])
    } else {
      toast(messages[status], { icon: '📍' })
    }
  }

  const handleContactParker = () => {
    if (job?.parkerPhone) {
      window.open(`tel:${job.parkerPhone}`)
    }
  }

  const handleNavigateToLocation = () => {
    if (job?.businessLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${job.businessLocation.lat},${job.businessLocation.lng}`
      window.open(url, '_blank')
    }
  }

  const getStatusColor = (status: JobRequest['status']) => {
    const colors = {
      pending: 'text-apple-warning',
      parker_assigned: 'text-apple-accent',
      parker_en_route: 'text-apple-accent',
      spot_secured: 'text-apple-success',
      completed: 'text-apple-success',
      cancelled: 'text-red-600'
    }
    return colors[status] || 'text-apple-text-secondary'
  }

  const getStatusIcon = (status: JobRequest['status']) => {
    const icons = {
      pending: <Clock className="w-6 h-6" />,
      parker_assigned: <Car className="w-6 h-6" />,
      parker_en_route: <Navigation2 className="w-6 h-6" />,
      spot_secured: <CheckCircle className="w-6 h-6" />,
      completed: <CheckCircle className="w-6 h-6" />,
      cancelled: <Car className="w-6 h-6" />
    }
    return icons[status] || <Clock className="w-6 h-6" />
  }

  const getStatusMessage = (status: JobRequest['status']) => {
    const messages = {
      pending: 'Finding the perfect Parker for your location...',
      parker_assigned: 'Your Parker has been assigned and is preparing to head to your location.',
      parker_en_route: 'Your Parker is on their way to secure your parking spot.',
      spot_secured: 'Perfect! Your parking spot has been secured and is ready for you.',
      completed: 'Job completed successfully. Thank you for choosing Parkr!',
      cancelled: 'This job has been cancelled.'
    }
    return messages[status] || 'Status update...'
  }

  if (loading) {
    return (
      <div className="h-full apple-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="apple-loading mx-auto mb-4" />
          <p className="text-apple-text-secondary text-lg">Loading job details...</p>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="h-full apple-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-apple-text mb-4">Job Not Found</h2>
          <p className="text-apple-text-secondary mb-6">The job you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/app')}
            className="apple-button-primary px-6 py-3 apple-interactive"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full apple-gradient-mesh">
      <div className="max-w-4xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-8">
          <button
            onClick={() => navigate('/app')}
            className="p-4 apple-glass rounded-2xl apple-interactive shadow-apple"
          >
            <ArrowLeft className="w-7 h-7 text-apple-text" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-apple-text">Job Tracking</h1>
            <p className="text-apple-text-secondary text-xl">
              Parking at {job.businessName}
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="apple-card-strong rounded-3xl p-8 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className={`p-4 apple-glass-subtle rounded-2xl ${getStatusColor(job.status)}`}>
              {getStatusIcon(job.status)}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-apple-text capitalize">
                {job.status.replace('_', ' ')}
              </h2>
              <p className="text-apple-text-secondary text-lg">
                {getStatusMessage(job.status)}
              </p>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="space-y-4">
            {[
              { key: 'pending', label: 'Job Created', completed: true },
              { 
                key: 'parker_assigned', 
                label: 'Parker Assigned', 
                completed: ['parker_assigned', 'parker_en_route', 'spot_secured', 'completed'].includes(job.status)
              },
              { 
                key: 'parker_en_route', 
                label: 'Parker En Route', 
                completed: ['parker_en_route', 'spot_secured', 'completed'].includes(job.status)
              },
              { 
                key: 'spot_secured', 
                label: 'Spot Secured', 
                completed: ['spot_secured', 'completed'].includes(job.status)
              },
              { 
                key: 'completed', 
                label: 'Completed', 
                completed: job.status === 'completed'
              }
            ].map((step, index) => (
              <div key={step.key} className="flex items-center space-x-4">
                <div className={`w-4 h-4 rounded-full ${
                  step.completed ? 'bg-apple-success' : 'bg-gray-300'
                }`} />
                <span className={`font-medium ${
                  step.completed ? 'text-apple-text' : 'text-apple-text-secondary'
                }`}>
                  {step.label}
                </span>
                {step.completed && step.key === job.status && (
                  <span className="apple-badge apple-badge-success">Current</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Job Details */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Location Info */}
          <div className="apple-card apple-floating">
            <h3 className="text-xl font-bold text-apple-text mb-4">Location Details</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-apple-accent mt-1" />
                <div>
                  <p className="font-semibold text-apple-text">{job.businessName}</p>
                  <p className="text-apple-text-secondary">{job.businessAddress}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Car className="w-5 h-5 text-apple-accent" />
                <div>
                  <p className="font-semibold text-apple-text">{job.spotPreferenceLabel}</p>
                  <p className="text-apple-text-secondary">Parker gets ${job.parkerPay}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleNavigateToLocation}
              className="w-full mt-4 apple-button-secondary flex items-center justify-center space-x-2 apple-interactive"
            >
              <Navigation2 className="w-5 h-5" />
              <span>Get Directions</span>
            </button>
          </div>

          {/* Parker Info */}
          {job.parkerId && (
            <div className="apple-card apple-floating">
              <h3 className="text-xl font-bold text-apple-text mb-4">Your Parker</h3>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 apple-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-apple">
                  {job.parkerName?.split(' ').map(n => n[0]).join('') || 'P'}
                </div>
                <div>
                  <p className="font-bold text-apple-text text-lg">{job.parkerName}</p>
                  <div className="flex items-center space-x-2">
                    <Star className="w-4 h-4 text-apple-warning" />
                    <span className="text-apple-text-secondary">4.9 rating</span>
                  </div>
                  {job.estimatedArrival && (
                    <p className="text-apple-text-secondary">ETA: {job.estimatedArrival}</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleContactParker}
                  className="apple-button-secondary flex items-center justify-center space-x-2 apple-interactive"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button className="apple-button-secondary flex items-center justify-center space-x-2 apple-interactive">
                  <MessageCircle className="w-4 h-4" />
                  <span>Message</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Pricing Summary */}
        <div className="apple-card rounded-3xl p-6">
          <h3 className="text-xl font-bold text-apple-text mb-4">Pricing Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-apple-text">Parking service</span>
              <span className="font-semibold text-apple-text">${job.basePrice}</span>
            </div>
            {job.tip > 0 && (
              <div className="flex justify-between">
                <span className="text-apple-text">Tip</span>
                <span className="font-semibold text-apple-text">${job.tip}</span>
              </div>
            )}
            <div className="border-t border-white/20 pt-2 flex justify-between">
              <span className="font-bold text-apple-text text-lg">Total</span>
              <span className="font-bold text-apple-text text-lg">${job.totalPrice}</span>
            </div>
          </div>
          
          {job.status === 'completed' && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-apple-text-secondary text-center">
                Payment will be collected upon arrival. Have ${job.totalPrice} ready for your Parker.
              </p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {job.status === 'spot_secured' && (
          <div className="mt-8 space-y-4">
            <div className="apple-card rounded-3xl p-6 text-center">
              <CheckCircle className="w-16 h-16 text-apple-success mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-apple-text mb-2">Your Spot is Ready!</h3>
              <p className="text-apple-text-secondary">
                {job.parkerName} has secured your parking spot. Head to the location and look for them.
              </p>
            </div>
            
            <button
              onClick={handleNavigateToLocation}
              className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-6 text-xl apple-interactive"
            >
              <Navigation2 className="w-6 h-6" />
              <span>Navigate to Your Spot</span>
            </button>
          </div>
        )}

        {job.status === 'completed' && (
          <div className="mt-8">
            <div className="apple-card rounded-3xl p-8 text-center">
              <CheckCircle className="w-20 h-20 text-apple-success mx-auto mb-6" />
              <h3 className="text-3xl font-bold text-apple-text mb-4">Job Completed!</h3>
              <p className="text-apple-text-secondary text-lg mb-6">
                Thank you for using Parkr. We hope you had a great experience!
              </p>
              
              <div className="flex space-x-4 justify-center">
                <button className="apple-button-primary px-6 py-3 apple-interactive">
                  Rate Your Parker
                </button>
                <button 
                  onClick={() => navigate('/app')}
                  className="apple-button-secondary px-6 py-3 apple-interactive"
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobTracking
