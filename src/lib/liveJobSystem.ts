// Live Job Coordination System - Real-time marketplace
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

export interface LiveJob {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  businessId: string
  businessName: string
  businessAddress: string
  businessCoordinates: { lat: number; lng: number }
  parkingPreference: 'just_in_lot' | 'best_available' | 'at_the_front'
  preferenceLabel: string
  customerPrice: number
  parkerPay: number
  tip: number
  totalCustomerPrice: number
  status: 'pending' | 'accepted' | 'en_route' | 'searching' | 'secured' | 'completed' | 'cancelled'
  createdAt: string
  acceptedAt?: string
  completedAt?: string
  parkerId?: string
  parkerName?: string
  parkerPhone?: string
  estimatedArrival?: string
  spotDetails?: string
  notes?: string
  lastUpdate: string
}

export interface LiveParker {
  id: string
  name: string
  phone: string
  email: string
  isOnline: boolean
  currentLocation?: { lat: number; lng: number }
  vehicleInfo: {
    make: string
    model: string
    color: string
    licensePlate: string
  }
  rating: number
  totalJobs: number
  currentJobId?: string
  lastSeen: string
}

class LiveJobSystem {
  private jobListeners: Map<string, Array<(jobs: LiveJob[]) => void>> = new Map()
  private parkerListeners: Map<string, Array<(jobs: LiveJob[]) => void>> = new Map()
  private customerListeners: Map<string, Array<(job: LiveJob | null) => void>> = new Map()
  
  private storageKey = 'parkr_live_jobs'
  private parkersKey = 'parkr_live_parkers'
  
  constructor() {
    // Listen for storage changes across tabs/windows
    window.addEventListener('storage', this.handleStorageChange.bind(this))
    
    // Cleanup old jobs periodically
    setInterval(() => this.cleanupOldJobs(), 30000) // Every 30 seconds
  }

  private handleStorageChange(event: StorageEvent) {
    if (event.key === this.storageKey) {
      // Notify all listeners about job updates
      const jobs = this.getAllJobs()
      this.notifyAllListeners(jobs)
    }
  }

  private notifyAllListeners(jobs: LiveJob[]) {
    // Notify job board listeners
    this.jobListeners.forEach(listeners => {
      listeners.forEach(callback => callback(jobs))
    })

    // Notify parker listeners
    this.parkerListeners.forEach((listeners, parkerId) => {
      const parkerJobs = jobs.filter(job => 
        job.parkerId === parkerId || 
        (job.status === 'pending' && !job.parkerId)
      )
      listeners.forEach(callback => callback(parkerJobs))
    })

    // Notify customer listeners
    this.customerListeners.forEach((listeners, customerId) => {
      const customerJob = jobs.find(job => job.customerId === customerId && job.status !== 'completed')
      listeners.forEach(callback => callback(customerJob || null))
    })
  }

  // Create a new live job
  createJob(jobData: {
    customerId: string
    customerName: string
    customerPhone: string
    businessId: string
    businessName: string
    businessAddress: string
    businessCoordinates: { lat: number; lng: number }
    parkingPreference: 'just_in_lot' | 'best_available' | 'at_the_front'
    preferenceLabel: string
    customerPrice: number
    parkerPay: number
    tip: number
  }): string {
    const job: LiveJob = {
      id: uuidv4(),
      ...jobData,
      totalCustomerPrice: jobData.customerPrice + jobData.tip,
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    }

    const jobs = this.getAllJobs()
    jobs.push(job)
    this.saveJobs(jobs)

    // Broadcast to all online parkers
    this.broadcastNewJob(job)
    
    toast.success('Job created! Finding Parkers in your area...')
    return job.id
  }

  // Parker accepts a job
  acceptJob(jobId: string, parkerId: string, parkerName: string, parkerPhone: string): boolean {
    const jobs = this.getAllJobs()
    const jobIndex = jobs.findIndex(j => j.id === jobId)
    
    if (jobIndex === -1 || jobs[jobIndex].status !== 'pending') {
      toast.error('Job no longer available')
      return false
    }

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      status: 'accepted',
      parkerId,
      parkerName,
      parkerPhone,
      acceptedAt: new Date().toISOString(),
      lastUpdate: new Date().toISOString(),
      estimatedArrival: this.calculateETA()
    }

    this.saveJobs(jobs)
    
    // Notify customer
    toast.success(`${parkerName} accepted your job!`)
    
    return true
  }

  // Update job status
  updateJobStatus(
    jobId: string, 
    status: LiveJob['status'], 
    additionalData?: Partial<LiveJob>
  ): boolean {
    const jobs = this.getAllJobs()
    const jobIndex = jobs.findIndex(j => j.id === jobId)
    
    if (jobIndex === -1) return false

    jobs[jobIndex] = {
      ...jobs[jobIndex],
      status,
      lastUpdate: new Date().toISOString(),
      ...additionalData
    }

    if (status === 'completed') {
      jobs[jobIndex].completedAt = new Date().toISOString()
    }

    this.saveJobs(jobs)
    
    // Send status update notification
    this.notifyStatusUpdate(jobs[jobIndex])
    
    return true
  }

  // Get all jobs
  getAllJobs(): LiveJob[] {
    try {
      const stored = localStorage.getItem(this.storageKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Get jobs for a specific parker
  getParkerJobs(parkerId: string): LiveJob[] {
    const jobs = this.getAllJobs()
    return jobs.filter(job => 
      job.parkerId === parkerId || 
      (job.status === 'pending' && !job.parkerId)
    )
  }

  // Get job for a specific customer
  getCustomerJob(customerId: string): LiveJob | null {
    const jobs = this.getAllJobs()
    return jobs.find(job => 
      job.customerId === customerId && 
      job.status !== 'completed'
    ) || null
  }

  // Get available jobs for parkers
  getAvailableJobs(): LiveJob[] {
    const jobs = this.getAllJobs()
    return jobs.filter(job => job.status === 'pending')
  }

  // Subscribe to job updates for job board
  subscribeToJobs(callback: (jobs: LiveJob[]) => void): () => void {
    const listenerId = uuidv4()
    
    if (!this.jobListeners.has('global')) {
      this.jobListeners.set('global', [])
    }
    this.jobListeners.get('global')!.push(callback)

    // Immediately call with current data
    callback(this.getAllJobs())

    return () => {
      const listeners = this.jobListeners.get('global')
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  // Subscribe to parker-specific jobs
  subscribeToParkerJobs(parkerId: string, callback: (jobs: LiveJob[]) => void): () => void {
    if (!this.parkerListeners.has(parkerId)) {
      this.parkerListeners.set(parkerId, [])
    }
    this.parkerListeners.get(parkerId)!.push(callback)

    // Immediately call with current data
    callback(this.getParkerJobs(parkerId))

    return () => {
      const listeners = this.parkerListeners.get(parkerId)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  // Subscribe to customer job updates
  subscribeToCustomerJob(customerId: string, callback: (job: LiveJob | null) => void): () => void {
    if (!this.customerListeners.has(customerId)) {
      this.customerListeners.set(customerId, [])
    }
    this.customerListeners.get(customerId)!.push(callback)

    // Immediately call with current data
    callback(this.getCustomerJob(customerId))

    return () => {
      const listeners = this.customerListeners.get(customerId)
      if (listeners) {
        const index = listeners.indexOf(callback)
        if (index > -1) {
          listeners.splice(index, 1)
        }
      }
    }
  }

  // Cancel a job
  cancelJob(jobId: string, reason: string = 'Cancelled by customer'): boolean {
    return this.updateJobStatus(jobId, 'cancelled', { notes: reason })
  }

  // Private helper methods
  private saveJobs(jobs: LiveJob[]) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(jobs))
      // Trigger storage event manually for same-tab updates
      window.dispatchEvent(new StorageEvent('storage', {
        key: this.storageKey,
        newValue: JSON.stringify(jobs)
      }))
    } catch (error) {
      console.error('Failed to save jobs:', error)
    }
  }

  private broadcastNewJob(job: LiveJob) {
    // In a real app, this would be a push notification
    console.log('New job broadcast:', job.businessName)
  }

  private notifyStatusUpdate(job: LiveJob) {
    const statusMessages = {
      'accepted': `${job.parkerName} is heading to ${job.businessName}`,
      'en_route': `${job.parkerName} is on the way (ETA: ${job.estimatedArrival || '10 min'})`,
      'searching': `${job.parkerName} is searching for your parking spot`,
      'secured': `Parking spot secured at ${job.businessName}! ${job.spotDetails || 'Check instructions'}`,
      'completed': `Parking job completed. Thank you for using Parkr!`
    }

    const message = statusMessages[job.status as keyof typeof statusMessages]
    if (message) {
      toast.success(message)
    }
  }

  private calculateETA(): string {
    // Simple ETA calculation - in real app would use actual location data
    const minutes = Math.floor(Math.random() * 15) + 5 // 5-20 minutes
    return `${minutes} min`
  }

  private cleanupOldJobs() {
    const jobs = this.getAllJobs()
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000) // 24 hours ago
    
    const activeJobs = jobs.filter(job => {
      const createdAt = new Date(job.createdAt)
      return createdAt > cutoff || job.status !== 'completed'
    })
    
    if (activeJobs.length !== jobs.length) {
      this.saveJobs(activeJobs)
    }
  }

  // Parker management
  registerParker(parker: Omit<LiveParker, 'lastSeen'>): void {
    const parkers = this.getParkers()
    const existingIndex = parkers.findIndex(p => p.id === parker.id)
    
    const updatedParker: LiveParker = {
      ...parker,
      lastSeen: new Date().toISOString()
    }

    if (existingIndex >= 0) {
      parkers[existingIndex] = updatedParker
    } else {
      parkers.push(updatedParker)
    }

    this.saveParkers(parkers)
  }

  updateParkerStatus(parkerId: string, isOnline: boolean, location?: { lat: number; lng: number }): void {
    const parkers = this.getParkers()
    const parkerIndex = parkers.findIndex(p => p.id === parkerId)
    
    if (parkerIndex >= 0) {
      parkers[parkerIndex] = {
        ...parkers[parkerIndex],
        isOnline,
        currentLocation: location || parkers[parkerIndex].currentLocation,
        lastSeen: new Date().toISOString()
      }
      this.saveParkers(parkers)
    }
  }

  getParkers(): LiveParker[] {
    try {
      const stored = localStorage.getItem(this.parkersKey)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  getOnlineParkers(): LiveParker[] {
    return this.getParkers().filter(p => p.isOnline)
  }

  private saveParkers(parkers: LiveParker[]) {
    try {
      localStorage.setItem(this.parkersKey, JSON.stringify(parkers))
    } catch (error) {
      console.error('Failed to save parkers:', error)
    }
  }
}

// Singleton instance
export const liveJobSystem = new LiveJobSystem()

// Export specific pricing for the 3-step booking process
export const PARKING_PREFERENCES = [
  {
    id: 'just_in_lot',
    label: 'Just in the lot',
    description: 'Basic parking anywhere in the lot',
    customerPrice: 12,
    parkerPay: 7,
    estimatedTime: '5-10 min',
    features: ['Cheapest option', 'Quick service', 'Any available spot']
  },
  {
    id: 'best_available',
    label: 'Best spot available',
    description: 'Quality spot with good access and reasonable walk',
    customerPrice: 18,
    parkerPay: 8,
    estimatedTime: '8-15 min',
    features: ['Better location', 'Shorter walk', 'Good value']
  },
  {
    id: 'at_the_front',
    label: 'At the front',
    description: 'Premium front entrance parking, minimal walking',
    customerPrice: 25,
    parkerPay: 8.5,
    estimatedTime: '10-20 min',
    features: ['Premium location', 'Minimal walk', 'Best experience']
  }
] as const
