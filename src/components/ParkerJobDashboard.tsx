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
  Phone
} from 'lucide-react'
import { 
  AvailableJob, 
  EarningsStats, 
  PerformanceMetrics, 
  ParkerStatus,
  PARKER_STATUSES 
} from '../types'
import { mockJobService } from '../lib/mockJobService'
import toast from 'react-hot-toast'

const ParkerJobDashboard = () => {
  const { userProfile, updateProfile } = useAuth()
  const [availableJobs, setAvailableJobs] = useState<AvailableJob[]>([])
  const [currentJob, setCurrentJob] = useState<any>(null)
  const [parkerStatus, setParkerStatus] = useState<ParkerStatus>('offline')
  const [earnings, setEarnings] = useState<EarningsStats>({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    totalLifetime: 0,
    averagePerJob: 0,
    topEarningDay: 0,
    totalJobs: 0,
    hoursWorked: 0
  })
  const [performance, setPerformance] = useState<PerformanceMetrics>({
    rating: 0,
    completedJobs: 0,
    successRate: 0,
    averageResponseTime: '0 min',
    customerSatisfaction: 0,
    onTimePercentage: 0,
    totalEarnings: 0
  })
  const [jobAcceptanceTimer, setJobAcceptanceTimer] = useState<{ [key: string]: number }>({})

  useEffect(() => {
    if (userProfile?.userType === 'parker') {
      setParkerStatus(userProfile.availabilityStatus || 'offline')
      loadEarningsData()
      loadPerformanceData()
      
      if (userProfile.availabilityStatus === 'available') {
        loadAvailableJobs()
      }
    }
  }, [userProfile])

  useEffect(() => {
    // Setup real-time job updates
    let unsubscribe: (() => void) | undefined

    if (parkerStatus === 'available' && userProfile) {
      unsubscribe = mockJobService.subscribeToParkerJobs(userProfile.uid, (jobs) => {
        setAvailableJobs(jobs.filter(job => job.status === 'pending'))
        setCurrentJob(jobs.find(job => job.status !== 'pending' && job.status !== 'completed'))
      })
    }

    return () => {
      if (unsubscribe) unsubscribe()
    }
  }, [parkerStatus, userProfile])

  // Job acceptance countdown timers
  useEffect(() => {
    const timers: { [key: string]: NodeJS.Timeout } = {}
    
    availableJobs.forEach(job => {
      if (job.acceptanceDeadline) {
        const deadline = new Date(job.acceptanceDeadline).getTime()
        const now = Date.now()
        const remaining = Math.max(0, Math.floor((deadline - now) / 1000))
        
        if (remaining > 0) {
          setJobAcceptanceTimer(prev => ({ ...prev, [job.id]: remaining }))
          
          timers[job.id] = setInterval(() => {
            const newRemaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000))
            setJobAcceptanceTimer(prev => ({ ...prev, [job.id]: newRemaining }))
            
            if (newRemaining === 0) {
              clearInterval(timers[job.id])
              // Remove expired job
              setAvailableJobs(prev => prev.filter(j => j.id !== job.id))
            }
          }, 1000)
        }
      }
    })

    return () => {
      Object.values(timers).forEach(timer => clearInterval(timer))
    }
  }, [availableJobs])

  const loadEarningsData = async () => {
    // Mock earnings data - in real app, fetch from API
    const mockEarnings: EarningsStats = {
      today: 156.50,
      thisWeek: 842.25,
      thisMonth: 3247.80,
      totalLifetime: 15420.60,
      averagePerJob: 24.75,
      topEarningDay: 287.40,
      totalJobs: 623,
      hoursWorked: 1247
    }
    setEarnings(mockEarnings)
  }

  const loadPerformanceData = async () => {
    // Mock performance data
    const mockPerformance: PerformanceMetrics = {
      rating: 4.8,
      completedJobs: 623,
      successRate: 94.2,
      averageResponseTime: '2.3 min',
      customerSatisfaction: 96.1,
      onTimePercentage: 91.7,
      totalEarnings: 15420.60
    }
    setPerformance(mockPerformance)
  }

  const loadAvailableJobs = async () => {
    // Mock available jobs - in real app, fetch from API
    const now = new Date()
    const mockJobs: AvailableJob[] = [
      {
        id: 'job_001',
        businessName: 'Legacy West Shopping',
        address: '7250 Bishop Rd, Plano, TX 75024',
        coordinates: { lat: 33.0765, lng: -96.8228 },
        serviceType: 'Best spot available',
        basePrice: 18,
        tip: 5,
        totalPay: 8.5,
        estimatedDuration: '12-18 min',
        distance: '2.3 mi',
        priority: 'high',
        createdAt: new Date(now.getTime() - 180000), // 3 minutes ago
        acceptanceDeadline: new Date(now.getTime() + 420000), // 7 minutes from now
        specialInstructions: 'Customer prefers covered parking if available',
        customerId: 'cust_001',
        customerName: 'Alex Johnson',
        customerPhone: '(469) 555-0123'
      },
      {
        id: 'job_002',
        businessName: 'TopGolf - The Colony',
        address: '5651 State Highway 121, The Colony, TX 75056',
        coordinates: { lat: 33.0807, lng: -96.8769 },
        serviceType: 'Premium close spot',
        basePrice: 25,
        tip: 8,
        totalPay: 10.5,
        estimatedDuration: '15-25 min',
        distance: '4.1 mi',
        priority: 'urgent',
        createdAt: new Date(now.getTime() - 60000), // 1 minute ago
        acceptanceDeadline: new Date(now.getTime() + 540000), // 9 minutes from now
        specialInstructions: 'Large group - customer arriving in 25 minutes',
        customerId: 'cust_002',
        customerName: 'Sarah Martinez',
        customerPhone: '(214) 555-0189'
      },
      {
        id: 'job_003',
        businessName: 'Stonebriar Centre',
        address: '2601 Preston Rd, Frisco, TX 75034',
        coordinates: { lat: 33.1507, lng: -96.8031 },
        serviceType: 'Just in the lot',
        basePrice: 12,
        tip: 2,
        totalPay: 7.0,
        estimatedDuration: '8-12 min',
        distance: '6.7 mi',
        priority: 'normal',
        createdAt: new Date(now.getTime() - 300000), // 5 minutes ago
        acceptanceDeadline: new Date(now.getTime() + 300000), // 5 minutes from now
        customerId: 'cust_003',
        customerName: 'Mike Chen',
        customerPhone: '(972) 555-0167'
      }
    ]
    setAvailableJobs(mockJobs)
  }

  const toggleParkerStatus = async (newStatus: ParkerStatus) => {
    try {
      setParkerStatus(newStatus)
      
      if (userProfile) {
        await updateProfile({
          ...userProfile,
          availabilityStatus: newStatus,
          isOnline: newStatus === 'available'
        })
      }

      if (newStatus === 'available') {
        loadAvailableJobs()
        toast.success('You\'re now online and available for jobs!')
      } else {
        setAvailableJobs([])
        toast.success(`Status updated to ${newStatus}`)
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      toast.error('Failed to update status')
    }
  }

  const acceptJob = async (job: AvailableJob) => {
    try {
      await mockJobService.assignParker(job.id, userProfile!.uid)
      
      // Remove from available jobs and set as current
      setAvailableJobs(prev => prev.filter(j => j.id !== job.id))
      setCurrentJob(job)
      setParkerStatus('busy')
      
      toast.success(`Job accepted! Navigate to ${job.businessName}`)
    } catch (error) {
      console.error('Failed to accept job:', error)
      toast.error('Failed to accept job')
    }
  }

  const declineJob = (jobId: string) => {
    setAvailableJobs(prev => prev.filter(j => j.id !== jobId))
    toast.success('Job declined')
  }

  const updateJobStatus = async (jobId: string, status: 'completed' | 'parker_assigned' | 'parker_en_route' | 'spot_secured') => {
    try {
      await mockJobService.updateJobStatus(jobId, status)
      
      if (status === 'completed') {
        setCurrentJob(null)
        setParkerStatus('available')
        toast.success('Job completed! Payment processed.')
        loadEarningsData() // Refresh earnings
      }
    } catch (error) {
      console.error('Failed to update job status:', error)
      toast.error('Failed to update job status')
    }
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const getStatusColor = (status: ParkerStatus) => {
    const statusConfig = PARKER_STATUSES.find(s => s.id === status)
    return statusConfig?.color || 'gray'
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-500 bg-red-50'
      case 'high': return 'text-orange-500 bg-orange-50'
      default: return 'text-blue-500 bg-blue-50'
    }
  }

  if (userProfile?.userType !== 'parker') {
    return (
      <div className="min-h-screen apple-gradient-mesh flex items-center justify-center">
        <div className="text-center apple-glass-strong rounded-3xl p-8 shadow-apple max-w-md">
          <AlertCircle className="h-16 w-16 text-apple-warning mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-apple-text mb-2">Parker Access Required</h2>
          <p className="text-apple-text-secondary">
            This dashboard is only available for registered Parkers.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen apple-gradient-mesh">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-apple-text mb-2">
              Parker Dashboard
            </h1>
            <p className="text-apple-text-secondary">
              Welcome back, {userProfile?.displayName || 'Parker'}
            </p>
          </div>
          
          {/* Status Toggle */}
          <div className="mt-4 lg:mt-0">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-apple-text">Status:</span>
              <div className="flex space-x-2">
                {PARKER_STATUSES.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => toggleParkerStatus(status.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                      parkerStatus === status.id
                        ? `bg-${status.color}-500 text-white shadow-lg`
                        : 'apple-glass-subtle text-apple-text hover:apple-glass-strong'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full bg-${status.color}-400`} />
                      <span>{status.label}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Jobs */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Job */}
            {currentJob && (
              <div className="apple-glass-strong rounded-3xl p-6 shadow-apple">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-apple-text flex items-center">
                    <Car className="h-6 w-6 mr-2 text-apple-accent" />
                    Current Job
                  </h2>
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
                    {currentJob.status || 'In Progress'}
                  </span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-apple-text">{currentJob.businessName}</h3>
                    <p className="text-apple-text-secondary">{currentJob.address}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="apple-glass-subtle rounded-xl p-3">
                      <div className="text-sm text-apple-text-secondary">Customer</div>
                      <div className="font-medium text-apple-text">{currentJob.customerName}</div>
                    </div>
                    <div className="apple-glass-subtle rounded-xl p-3">
                      <div className="text-sm text-apple-text-secondary">Payment</div>
                      <div className="font-bold text-apple-text">${currentJob.totalPay}</div>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={() => window.open(`tel:${currentJob.customerPhone}`, '_self')}
                      className="flex items-center space-x-2 px-4 py-2 apple-glass-subtle rounded-xl text-apple-text hover:apple-glass-strong transition-all"
                    >
                      <Phone className="h-4 w-4" />
                      <span>Call Customer</span>
                    </button>
                    <button
                      onClick={() => window.open(`https://maps.google.com/?q=${currentJob.coordinates.lat},${currentJob.coordinates.lng}`, '_blank')}
                      className="flex items-center space-x-2 px-4 py-2 apple-button-primary text-white rounded-xl apple-interactive"
                    >
                      <Navigation className="h-4 w-4" />
                      <span>Navigate</span>
                    </button>
                    <button
                      onClick={() => updateJobStatus(currentJob.id, 'completed')}
                      className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all"
                    >
                      <Check className="h-4 w-4" />
                      <span>Complete</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Available Jobs */}
            <div className="apple-glass-strong rounded-3xl p-6 shadow-apple">
              <h2 className="text-xl font-bold text-apple-text mb-4 flex items-center">
                <MapPin className="h-6 w-6 mr-2 text-apple-accent" />
                Available Jobs ({availableJobs.length})
              </h2>
              
              {parkerStatus !== 'available' ? (
                <div className="text-center py-8">
                  <Power className="h-12 w-12 text-apple-text-secondary mx-auto mb-4" />
                  <p className="text-apple-text-secondary">
                    Set your status to "Available" to see job requests
                  </p>
                </div>
              ) : availableJobs.length === 0 ? (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-apple-text-secondary mx-auto mb-4" />
                  <p className="text-apple-text-secondary">
                    No jobs available right now. More will appear soon!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableJobs.map((job) => (
                    <div key={job.id} className="apple-glass-subtle rounded-2xl p-4 border border-white/20">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-apple-text">{job.businessName}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(job.priority)}`}>
                              {job.priority.toUpperCase()}
                            </span>
                          </div>
                          <p className="text-sm text-apple-text-secondary">{job.address}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg text-apple-text">${job.totalPay}</div>
                          <div className="text-sm text-apple-text-secondary">{job.distance}</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="text-center">
                          <div className="text-xs text-apple-text-secondary">Service</div>
                          <div className="text-sm font-medium text-apple-text">{job.serviceType}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-apple-text-secondary">Duration</div>
                          <div className="text-sm font-medium text-apple-text">{job.estimatedDuration}</div>
                        </div>
                        <div className="text-center">
                          <div className="text-xs text-apple-text-secondary">Timer</div>
                          <div className="text-sm font-bold text-red-500">
                            {jobAcceptanceTimer[job.id] ? formatTimer(jobAcceptanceTimer[job.id]) : '--:--'}
                          </div>
                        </div>
                      </div>
                      
                      {job.specialInstructions && (
                        <div className="mb-4 p-3 apple-glass-subtle rounded-xl">
                          <div className="text-xs text-apple-text-secondary mb-1">Special Instructions:</div>
                          <div className="text-sm text-apple-text">{job.specialInstructions}</div>
                        </div>
                      )}
                      
                      <div className="flex space-x-3">
                        <button
                          onClick={() => declineJob(job.id)}
                          className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 border border-gray-300 rounded-xl text-apple-text hover:apple-glass-strong transition-all"
                        >
                          <X className="h-4 w-4" />
                          <span>Decline</span>
                        </button>
                        <button
                          onClick={() => acceptJob(job)}
                          className="flex-1 flex items-center justify-center space-x-2 py-2 px-4 apple-button-primary text-white rounded-xl apple-interactive"
                        >
                          <Check className="h-4 w-4" />
                          <span>Accept Job</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Stats */}
          <div className="space-y-6">
            {/* Earnings */}
            <div className="apple-glass-strong rounded-3xl p-6 shadow-apple">
              <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center">
                <DollarSign className="h-5 w-5 mr-2 text-apple-accent" />
                Earnings
              </h3>
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-apple-text">${earnings.today.toFixed(2)}</div>
                  <div className="text-sm text-apple-text-secondary">Today</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center apple-glass-subtle rounded-xl p-3">
                    <div className="font-semibold text-apple-text">${earnings.thisWeek.toFixed(2)}</div>
                    <div className="text-xs text-apple-text-secondary">This Week</div>
                  </div>
                  <div className="text-center apple-glass-subtle rounded-xl p-3">
                    <div className="font-semibold text-apple-text">${earnings.thisMonth.toFixed(2)}</div>
                    <div className="text-xs text-apple-text-secondary">This Month</div>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-apple-text-secondary">Average per job</div>
                  <div className="font-semibold text-apple-text">${earnings.averagePerJob.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Performance */}
            <div className="apple-glass-strong rounded-3xl p-6 shadow-apple">
              <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center">
                <Star className="h-5 w-5 mr-2 text-apple-accent" />
                Performance
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-apple-text-secondary">Rating</span>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-400 mr-1" />
                    <span className="font-semibold text-apple-text">{performance.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-apple-text-secondary">Success Rate</span>
                  <span className="font-semibold text-apple-text">{performance.successRate}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-apple-text-secondary">Completed Jobs</span>
                  <span className="font-semibold text-apple-text">{performance.completedJobs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-apple-text-secondary">Response Time</span>
                  <span className="font-semibold text-apple-text">{performance.averageResponseTime}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="apple-glass-strong rounded-3xl p-6 shadow-apple">
              <h3 className="text-lg font-bold text-apple-text mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full apple-glass-subtle rounded-xl p-3 text-left hover:apple-glass-strong transition-all">
                  <div className="flex items-center space-x-3">
                    <TrendingUp className="h-5 w-5 text-apple-accent" />
                    <span className="text-apple-text">View Earnings Report</span>
                  </div>
                </button>
                <button className="w-full apple-glass-subtle rounded-xl p-3 text-left hover:apple-glass-strong transition-all">
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-apple-accent" />
                    <span className="text-apple-text">Update Service Area</span>
                  </div>
                </button>
                <button className="w-full apple-glass-subtle rounded-xl p-3 text-left hover:apple-glass-strong transition-all">
                  <div className="flex items-center space-x-3">
                    <Car className="h-5 w-5 text-apple-accent" />
                    <span className="text-apple-text">Update Vehicle Info</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParkerJobDashboard
