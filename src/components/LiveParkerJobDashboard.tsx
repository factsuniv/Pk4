import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/MockAuthContext'
import { 
  Power, 
  MapPin, 
  Clock, 
  DollarSign, 
  Star,
  Navigation,
  Check,
  X,
  AlertCircle,
  TrendingUp,
  Award,
  Timer,
  Car,
  Phone,
  MessageCircle,
  Route,
  CheckCircle,
  Users
} from 'lucide-react'
import { liveJobSystem, LiveJob } from '../lib/liveJobSystem'
import { toast } from 'react-hot-toast'

type ParkerStatus = 'offline' | 'available' | 'busy' | 'on_break'

const LiveParkerJobDashboard = () => {
  const { userProfile: user, updateProfile } = useAuth()
  const [availableJobs, setAvailableJobs] = useState<LiveJob[]>([])
  const [currentJob, setCurrentJob] = useState<LiveJob | null>(null)
  const [parkerStatus, setParkerStatus] = useState<ParkerStatus>('offline')
  const [earnings, setEarnings] = useState({
    today: 156.50,
    thisWeek: 842.25,
    thisMonth: 3247.80,
    totalLifetime: 12856.40,
    averagePerJob: 18.75,
    topEarningDay: 298.50,
    totalJobs: 623,
    hoursWorked: 1247
  })
  const [performance, setPerformance] = useState({
    rating: 4.8,
    completedJobs: 623,
    successRate: 94.2,
    averageResponseTime: '2.3 min',
    customerSatisfaction: 96.1,
    onTimePercentage: 97.5,
    repeatCustomers: 68.3
  })

  // Subscribe to live jobs when status changes
  useEffect(() => {
    if (!user || parkerStatus === 'offline') {
      setAvailableJobs([])
      return
    }

    const unsubscribe = liveJobSystem.subscribeToParkerJobs(user.uid, (jobs) => {
      const available = jobs.filter(job => job.status === 'pending')
      const current = jobs.find(job => job.parkerId === user.uid && job.status !== 'completed' && job.status !== 'cancelled')
      
      setAvailableJobs(available)
      setCurrentJob(current || null)
    })

    return unsubscribe
  }, [user?.uid, parkerStatus])

  // Register parker when going online
  useEffect(() => {
    if (user && parkerStatus === 'available') {
      liveJobSystem.registerParker({
        id: user.uid,
        name: user.displayName || 'Parker',
        phone: user.phone || '+1 (555) 123-4567',
        email: user.email || '',
        isOnline: true,
        vehicleInfo: {
          make: 'Toyota',
          model: 'Camry',
          color: 'Silver',
          licensePlate: 'ABC-1234'
        },
        rating: performance.rating,
        totalJobs: performance.completedJobs
      })
    }

    liveJobSystem.updateParkerStatus(user?.uid || '', parkerStatus === 'available')
  }, [user, parkerStatus])

  const handleStatusChange = (newStatus: ParkerStatus) => {
    setParkerStatus(newStatus)
    
    const statusMessages = {
      'offline': 'You are now offline and will not receive job requests',
      'available': 'You are now available for jobs!',
      'busy': 'Status set to busy - pausing new jobs',
      'on_break': 'On break - you will not receive new jobs'
    }
    
    toast.success(statusMessages[newStatus])
  }

  const handleAcceptJob = async (job: LiveJob) => {
    if (!user) return

    const success = liveJobSystem.acceptJob(
      job.id,
      user.uid,
      user.displayName || 'Parker',
      user.phone || '+1 (555) 123-4567'
    )

    if (success) {
      setParkerStatus('busy')
      toast.success(`Job accepted! Heading to ${job.businessName}`)
    }
  }

  const handleUpdateJobStatus = (jobId: string, status: LiveJob['status'], details?: string) => {
    liveJobSystem.updateJobStatus(jobId, status, details ? { spotDetails: details } : undefined)
    
    if (status === 'completed') {
      setParkerStatus('available')
      // Update earnings (in real app would come from backend)
      setEarnings(prev => ({
        ...prev,
        today: prev.today + (currentJob?.parkerPay || 0) + (currentJob?.tip || 0),
        totalJobs: prev.totalJobs + 1
      }))
    }
  }

  const formatPrice = (price: number) => `$${price.toFixed(2)}`
  const formatTime = (isoString: string) => {
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome back, {user?.displayName || 'Parker'}!
              </h1>
              <p className="text-gray-600">Ready to earn money today?</p>
            </div>
            
            {/* Status Toggle */}
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-2xl p-1">
                {(['offline', 'available', 'busy', 'on_break'] as ParkerStatus[]).map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all ${
                      parkerStatus === status
                        ? status === 'available' ? 'bg-green-500 text-white'
                        : status === 'busy' ? 'bg-blue-500 text-white'
                        : status === 'on_break' ? 'bg-orange-500 text-white'
                        : 'bg-gray-500 text-white'
                        : 'text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'offline' ? 'Offline' :
                     status === 'available' ? 'Available' :
                     status === 'busy' ? 'Busy' : 'On Break'}
                  </button>
                ))}
              </div>
              <div className={`w-4 h-4 rounded-full ${
                parkerStatus === 'available' ? 'bg-green-500 animate-pulse' :
                parkerStatus === 'busy' ? 'bg-blue-500' :
                parkerStatus === 'on_break' ? 'bg-orange-500' :
                'bg-gray-400'
              }`} />
            </div>
          </div>
        </div>

        {/* Current Job */}
        {currentJob && (
          <div className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-blue-800 mb-2">Current Job</h2>
                <div className="flex items-center space-x-4 text-sm text-blue-700">
                  <span className="bg-blue-100 px-3 py-1 rounded-full font-medium">
                    {currentJob.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span>Job ID: {currentJob.id.slice(0, 8)}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-800">
                  {formatPrice(currentJob.parkerPay + currentJob.tip)}
                </div>
                <div className="text-sm text-blue-600">Total pay</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-800">{currentJob.businessName}</h3>
                    <p className="text-gray-600">{currentJob.businessAddress}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Car className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-800">{currentJob.preferenceLabel}</span>
                    <p className="text-sm text-gray-600">Service type requested</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Users className="w-5 h-5 text-blue-600" />
                  <div>
                    <span className="font-medium text-gray-800">{currentJob.customerName}</span>
                    <p className="text-sm text-gray-600">{currentJob.customerPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                {currentJob.status === 'accepted' && (
                  <button
                    onClick={() => handleUpdateJobStatus(currentJob.id, 'en_route')}
                    className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Route className="w-5 h-5" />
                    <span>Mark as En Route</span>
                  </button>
                )}
                
                {currentJob.status === 'en_route' && (
                  <button
                    onClick={() => handleUpdateJobStatus(currentJob.id, 'searching')}
                    className="w-full bg-orange-600 text-white py-3 rounded-xl font-semibold hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Timer className="w-5 h-5" />
                    <span>Searching for Spot</span>
                  </button>
                )}
                
                {currentJob.status === 'searching' && (
                  <button
                    onClick={() => handleUpdateJobStatus(currentJob.id, 'secured', 'Front entrance spot secured')}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Check className="w-5 h-5" />
                    <span>Mark Spot Secured</span>
                  </button>
                )}
                
                {currentJob.status === 'secured' && (
                  <button
                    onClick={() => handleUpdateJobStatus(currentJob.id, 'completed')}
                    className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    <span>Complete Job</span>
                  </button>
                )}

                <div className="flex space-x-2">
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                  <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Available Jobs */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Available Jobs</h2>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {availableJobs.length} jobs nearby
                </span>
              </div>

              {parkerStatus === 'offline' ? (
                <div className="text-center py-12">
                  <Power className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">You're offline</h3>
                  <p className="text-gray-500 mb-6">Go online to start receiving job requests</p>
                  <button
                    onClick={() => handleStatusChange('available')}
                    className="bg-green-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-600 transition-colors"
                  >
                    Go Online
                  </button>
                </div>
              ) : availableJobs.length === 0 ? (
                <div className="text-center py-12">
                  <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No jobs available</h3>
                  <p className="text-gray-500">New jobs will appear here when customers request parking</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableJobs.map((job) => (
                    <div key={job.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-800">{job.businessName}</h3>
                            <span className="text-sm bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                              NEW
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{job.businessAddress}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center space-x-1">
                              <Car className="w-4 h-4" />
                              <span>{job.preferenceLabel}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{formatTime(job.createdAt)}</span>
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold text-green-600">
                            {formatPrice(job.parkerPay + job.tip)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {job.tip > 0 ? `+$${job.tip} tip` : 'No tip'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>{job.customerName}</span>
                          <span>•</span>
                          <span>Expires in 8 min</span>
                        </div>
                        <button
                          onClick={() => handleAcceptJob(job)}
                          disabled={currentJob !== null}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Accept Job
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Earnings & Performance */}
          <div className="space-y-6">
            {/* Earnings */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Earnings</h2>
              <div className="space-y-4">
                <div>
                  <div className="text-3xl font-bold text-green-600">
                    {formatPrice(earnings.today)}
                  </div>
                  <div className="text-sm text-gray-600">Today</div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="font-semibold text-gray-800">
                      {formatPrice(earnings.thisWeek)}
                    </div>
                    <div className="text-gray-600">This Week</div>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">
                      {formatPrice(earnings.thisMonth)}
                    </div>
                    <div className="text-gray-600">This Month</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <div className="text-lg font-semibold text-gray-800">
                    {formatPrice(earnings.totalLifetime)}
                  </div>
                  <div className="text-sm text-gray-600">Total Lifetime</div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Performance</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-current" />
                    <span className="font-semibold">{performance.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Success Rate</span>
                  <span className="font-semibold text-green-600">{performance.successRate}%</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Jobs Completed</span>
                  <span className="font-semibold">{performance.completedJobs}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Response Time</span>
                  <span className="font-semibold">{performance.averageResponseTime}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LiveParkerJobDashboard
