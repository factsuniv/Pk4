import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/MockAuthContext'
import { 
  MapPin,
  Clock,
  DollarSign,
  Navigation2,
  CheckCircle,
  Phone,
  MessageCircle,
  TrendingUp,
  Star,
  Power,
  Settings,
  Target,
  Timer
} from 'lucide-react'
import { mockJobService } from '../lib/mockJobService'
import { JobRequest } from '../types'
import toast from 'react-hot-toast'

const LiveParkerDashboard = () => {
  const navigate = useNavigate()
  const { userProfile } = useAuth()
  const [availableJobs, setAvailableJobs] = useState<JobRequest[]>([])
  const [currentJob, setCurrentJob] = useState<JobRequest | null>(null)
  const [isOnline, setIsOnline] = useState(true)
  const [acceptingJob, setAcceptingJob] = useState<string | null>(null)
  const [jobTimers, setJobTimers] = useState<{ [key: string]: number }>({})
  
  // Demo stats
  const [stats] = useState({
    todayEarnings: 42.50,
    totalJobs: 8,
    rating: 4.9,
    successRate: 98
  })

  useEffect(() => {
    if (!userProfile || userProfile.userType !== 'parker') {
      navigate('/app/parker/register')
      return
    }

    // Subscribe to available jobs
    const unsubscribe = mockJobService.subscribeToParkerJobs(userProfile.uid, (jobs) => {
      const availableJobsList = jobs.filter(job => job.status === 'pending')
      const currentJobData = jobs.find(job => job.parkerId === userProfile.uid && job.status !== 'completed')
      
      setAvailableJobs(availableJobsList)
      setCurrentJob(currentJobData || null)
    })

    return unsubscribe
  }, [userProfile, navigate])

  // Job timer countdown
  useEffect(() => {
    const interval = setInterval(() => {
      setJobTimers(prev => {
        const updated = { ...prev }
        availableJobs.forEach(job => {
          if (!updated[job.id]) {
            updated[job.id] = 60 // 60 seconds to accept
          } else if (updated[job.id] > 0) {
            updated[job.id]--
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [availableJobs])

  const handleAcceptJob = async (jobId: string) => {
    if (!userProfile) return
    
    setAcceptingJob(jobId)
    try {
      await mockJobService.assignParker(jobId, userProfile.uid)
      toast.success('Job accepted! Head to the location.')
    } catch (error) {
      console.error('Error accepting job:', error)
      toast.error('Failed to accept job')
    } finally {
      setAcceptingJob(null)
    }
  }

  const handleUpdateJobStatus = async (status: JobRequest['status']) => {
    if (!currentJob) return
    
    try {
      await mockJobService.updateJobStatus(currentJob.id, status)
      
      const messages = {
        parker_en_route: 'Updated: En route to location',
        spot_secured: 'Great! Spot secured successfully',
        completed: 'Job completed! Payment received.'
      }
      
      toast.success(messages[status] || 'Status updated')
    } catch (error) {
      console.error('Error updating status:', error)
      toast.error('Failed to update status')
    }
  }

  const handleNavigateToJob = () => {
    if (currentJob?.businessLocation) {
      const url = `https://www.google.com/maps/dir/?api=1&destination=${currentJob.businessLocation.lat},${currentJob.businessLocation.lng}`
      window.open(url, '_blank')
    }
  }

  const handleContactCustomer = () => {
    if (currentJob?.customerPhone) {
      window.open(`tel:${currentJob.customerPhone}`)
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="h-full apple-gradient-mesh">
      <div className="max-w-6xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-apple-text">Parker Dashboard</h1>
            <p className="text-apple-text-secondary text-xl">
              Welcome back, {userProfile?.displayName}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                isOnline 
                  ? 'bg-green-500 text-white shadow-apple' 
                  : 'apple-glass text-apple-text'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>{isOnline ? 'Online' : 'Offline'}</span>
            </button>
            
            <button 
              onClick={() => navigate('/app/parker/settings')}
              className="p-3 apple-glass rounded-2xl apple-interactive"
            >
              <Settings className="w-6 h-6 text-apple-text" />
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="apple-card apple-floating text-center">
            <DollarSign className="w-8 h-8 text-apple-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-apple-text">${stats.todayEarnings}</div>
            <div className="text-apple-text-secondary">Today's Earnings</div>
          </div>
          
          <div className="apple-card apple-floating text-center">
            <Target className="w-8 h-8 text-apple-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-apple-text">{stats.totalJobs}</div>
            <div className="text-apple-text-secondary">Jobs Completed</div>
          </div>
          
          <div className="apple-card apple-floating text-center">
            <Star className="w-8 h-8 text-apple-warning mx-auto mb-2" />
            <div className="text-2xl font-bold text-apple-text">{stats.rating}</div>
            <div className="text-apple-text-secondary">Rating</div>
          </div>
          
          <div className="apple-card apple-floating text-center">
            <TrendingUp className="w-8 h-8 text-apple-success mx-auto mb-2" />
            <div className="text-2xl font-bold text-apple-text">{stats.successRate}%</div>
            <div className="text-apple-text-secondary">Success Rate</div>
          </div>
        </div>

        {/* Current Job */}
        {currentJob && (
          <div className="apple-card-strong rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-apple-text mb-6">Current Job</h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <MapPin className="w-6 h-6 text-apple-accent mt-1" />
                  <div>
                    <h3 className="font-bold text-apple-text">{currentJob.businessName}</h3>
                    <p className="text-apple-text-secondary">{currentJob.businessAddress}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <DollarSign className="w-6 h-6 text-apple-success" />
                  <div>
                    <span className="font-bold text-apple-text text-xl">${currentJob.parkerPay}</span>
                    <span className="text-apple-text-secondary ml-2">
                      {currentJob.tip > 0 && `+ $${currentJob.tip} tip`}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <Target className="w-6 h-6 text-apple-accent" />
                  <span className="text-apple-text">{currentJob.spotPreferenceLabel}</span>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 apple-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold">
                    {currentJob.customerName?.split(' ').map(n => n[0]).join('') || 'C'}
                  </div>
                  <div>
                    <p className="font-bold text-apple-text">{currentJob.customerName}</p>
                    <p className="text-apple-text-secondary">Customer</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleContactCustomer}
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
            </div>

            {/* Job Status Actions */}
            <div className="mt-8 space-y-4">
              {currentJob.status === 'parker_assigned' && (
                <div className="space-y-3">
                  <button
                    onClick={handleNavigateToJob}
                    className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-4 text-lg apple-interactive"
                  >
                    <Navigation2 className="w-6 h-6" />
                    <span>Navigate to Location</span>
                  </button>
                  <button
                    onClick={() => handleUpdateJobStatus('parker_en_route')}
                    className="w-full apple-button-secondary flex items-center justify-center space-x-3 px-8 py-4 text-lg apple-interactive"
                  >
                    <Clock className="w-6 h-6" />
                    <span>Mark as En Route</span>
                  </button>
                </div>
              )}
              
              {currentJob.status === 'parker_en_route' && (
                <button
                  onClick={() => handleUpdateJobStatus('spot_secured')}
                  className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-4 text-lg apple-interactive"
                >
                  <CheckCircle className="w-6 h-6" />
                  <span>Spot Secured!</span>
                </button>
              )}
              
              {currentJob.status === 'spot_secured' && (
                <div className="text-center space-y-4">
                  <div className="apple-card p-6">
                    <CheckCircle className="w-12 h-12 text-apple-success mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-apple-text mb-2">Waiting for Customer</h3>
                    <p className="text-apple-text-secondary">
                      Customer is on their way. Once they arrive and pay, mark the job as complete.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => handleUpdateJobStatus('completed')}
                    className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-4 text-lg apple-interactive"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Complete Job & Collect Payment</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Available Jobs */}
        {isOnline && !currentJob && (
          <div className="apple-card-strong rounded-3xl p-8">
            <h2 className="text-2xl font-bold text-apple-text mb-6">Available Jobs</h2>
            
            {availableJobs.length === 0 ? (
              <div className="text-center py-12">
                <Target className="w-16 h-16 text-apple-text-secondary mx-auto mb-4" />
                <h3 className="text-xl font-bold text-apple-text mb-2">No Jobs Available</h3>
                <p className="text-apple-text-secondary">
                  New parking requests will appear here. Stay online to receive notifications!
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {availableJobs.map((job) => (
                  <div key={job.id} className="apple-card apple-floating p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-apple-text text-lg">{job.businessName}</h3>
                        <p className="text-apple-text-secondary mb-2">{job.businessAddress}</p>
                        <div className="flex items-center space-x-4 text-sm">
                          <span className="apple-badge apple-glass-subtle">{job.spotPreferenceLabel}</span>
                          <span className="text-apple-text-secondary">
                            {job.estimatedWaitTime || 5}-{(job.estimatedWaitTime || 5) + 10} min
                          </span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-2xl font-bold text-apple-success">${job.parkerPay}</div>
                        {job.tip > 0 && (
                          <div className="text-apple-text-secondary">+ ${job.tip} tip</div>
                        )}
                        <div className="text-apple-text-secondary text-sm">
                          Total: ${job.totalPrice}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Timer className="w-4 h-4 text-apple-warning" />
                          <span className="text-apple-warning font-bold">
                            {formatTimer(jobTimers[job.id] || 60)}
                          </span>
                        </div>
                        <span className="text-apple-text-secondary text-sm">
                          Requested {new Date(job.requestTime).toLocaleTimeString()}
                        </span>
                      </div>
                      
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        disabled={acceptingJob === job.id || (jobTimers[job.id] || 60) <= 0}
                        className="apple-button-primary px-6 py-3 apple-interactive disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {acceptingJob === job.id ? 'Accepting...' : 
                         (jobTimers[job.id] || 60) <= 0 ? 'Expired' : 'Accept Job'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Offline Message */}
        {!isOnline && (
          <div className="apple-card rounded-3xl p-8 text-center">
            <Power className="w-16 h-16 text-apple-text-secondary mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-apple-text mb-2">You're Offline</h3>
            <p className="text-apple-text-secondary mb-6">
              Turn on availability to start receiving job notifications and earning money.
            </p>
            <button
              onClick={() => setIsOnline(true)}
              className="apple-button-primary px-8 py-4 apple-interactive"
            >
              Go Online
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default LiveParkerDashboard