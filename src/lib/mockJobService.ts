// Mock Job Service - No Firebase required
import { JobRequest, Parker, Notification } from '../types'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'

class MockJobService {
  private listeners: { [key: string]: Array<(data: any) => void> } = {}
  private jobUpdateInterval: NodeJS.Timeout | null = null

  constructor() {
    this.initializeDemoData()
    this.startJobSimulation()
  }

  private initializeDemoData() {
    // Initialize demo Parkers if they don't exist
    const parkers = this.getStoredParkers()
    if (Object.keys(parkers).length === 0) {
      const demoParkers = [
        {
          id: 'parker1',
          name: 'Mike Parker',
          email: 'parker@parkr.com',
          phone: '(972) 555-0101',
          isOnline: true,
          currentLocation: { lat: 33.0751, lng: -96.8236 },
          serviceAreas: ['Plano', 'Frisco'],
          vehicleInfo: {
            make: 'Toyota',
            model: 'Camry',
            color: 'Silver',
            licensePlate: 'ABC123'
          },
          rating: 4.9,
          totalJobs: 89,
          successRate: 98,
          averageTime: 12,
          totalEarnings: 642.50,
          availabilityStatus: 'available' as const,
          lastSeen: new Date().toISOString()
        },
        {
          id: 'parker2',
          name: 'Alex Driver',
          email: 'driver@test.com',
          phone: '(469) 555-0202',
          isOnline: true,
          currentLocation: { lat: 33.0878, lng: -96.8364 },
          serviceAreas: ['Frisco', 'The Colony'],
          vehicleInfo: {
            make: 'Honda',
            model: 'Civic',
            color: 'Black',
            licensePlate: 'XYZ789'
          },
          rating: 4.8,
          totalJobs: 67,
          successRate: 97,
          averageTime: 15,
          totalEarnings: 423.75,
          availabilityStatus: 'available' as const,
          lastSeen: new Date().toISOString()
        }
      ]
      
      const parkersMap: { [key: string]: Parker } = {}
      demoParkers.forEach(parker => {
        parkersMap[parker.id] = parker
      })
      localStorage.setItem('parkr_parkers', JSON.stringify(parkersMap))
    }
  }

  private startJobSimulation() {
    // Simulate real-time updates
    this.jobUpdateInterval = setInterval(() => {
      this.notifyJobListeners()
    }, 2000)
  }

  private getStoredJobs(): { [key: string]: JobRequest } {
    try {
      return JSON.parse(localStorage.getItem('parkr_jobs') || '{}')
    } catch {
      return {}
    }
  }

  private saveJobs(jobs: { [key: string]: JobRequest }) {
    localStorage.setItem('parkr_jobs', JSON.stringify(jobs))
  }

  private getStoredParkers(): { [key: string]: Parker } {
    try {
      return JSON.parse(localStorage.getItem('parkr_parkers') || '{}')
    } catch {
      return {}
    }
  }

  private saveParkers(parkers: { [key: string]: Parker }) {
    localStorage.setItem('parkr_parkers', JSON.stringify(parkers))
  }

  private notifyListeners(key: string, data: any) {
    if (this.listeners[key]) {
      this.listeners[key].forEach(callback => callback(data))
    }
  }

  private notifyJobListeners() {
    // Notify all job listeners
    Object.keys(this.listeners).forEach(key => {
      if (key.startsWith('job_')) {
        const jobId = key.replace('job_', '')
        const job = this.getJob(jobId)
        this.notifyListeners(key, job)
      }
      if (key.startsWith('parker_jobs_')) {
        const parkerId = key.replace('parker_jobs_', '')
        const jobs = this.getParkerJobs(parkerId)
        this.notifyListeners(key, jobs)
      }
    })
  }

  // Create a new job request
  async createJobRequest(jobData: Omit<JobRequest, 'id' | 'status' | 'requestTime' | 'lastUpdate'>): Promise<string> {
    const jobId = uuidv4()
    const jobRequest: JobRequest = {
      ...jobData,
      id: jobId,
      status: 'pending',
      requestTime: new Date().toISOString(),
      lastUpdate: new Date().toISOString()
    }

    const jobs = this.getStoredJobs()
    jobs[jobId] = jobRequest
    this.saveJobs(jobs)
    
    // Simulate automatic Parker assignment after 3-8 seconds
    setTimeout(() => {
      this.autoAssignParker(jobId)
    }, Math.random() * 5000 + 3000)
    
    toast.success('Job request created! Finding a Parker for you...')
    return jobId
  }

  private async autoAssignParker(jobId: string) {
    const job = this.getJob(jobId)
    if (!job || job.status !== 'pending') return

    const availableParkers = await this.getAvailableParkers(
      job.businessLocation.lat,
      job.businessLocation.lng
    )

    if (availableParkers.length > 0) {
      const selectedParker = availableParkers[0]
      await this.assignParker(jobId, selectedParker.id)
    }
  }

  // Update job status
  async updateJobStatus(
    jobId: string, 
    status: JobRequest['status'], 
    updates: Partial<JobRequest> = {}
  ): Promise<void> {
    const jobs = this.getStoredJobs()
    const job = jobs[jobId]
    
    if (!job) throw new Error('Job not found')

    const updateData = {
      ...updates,
      status,
      lastUpdate: new Date().toISOString(),
      ...(status === 'completed' && { completedTime: new Date().toISOString() })
    }

    jobs[jobId] = { ...job, ...updateData }
    this.saveJobs(jobs)
    
    // Send notification
    await this.sendNotification(job.customerId, {
      type: 'job_update',
      title: this.getStatusTitle(status),
      message: this.getStatusMessage(status, { ...job, ...updateData }),
      jobId
    })
  }

  // Assign parker to job
  async assignParker(jobId: string, parkerId: string): Promise<void> {
    const jobs = this.getStoredJobs()
    const parkers = this.getStoredParkers()
    const job = jobs[jobId]
    const parker = parkers[parkerId]

    if (!job || !parker) throw new Error('Job or Parker not found')

    const updatedJob = {
      ...job,
      status: 'parker_assigned' as const,
      parkerId: parker.id,
      parkerName: parker.name,
      parkerPhone: parker.phone,
      parkerLocation: parker.currentLocation,
      estimatedArrival: this.calculateEstimatedArrival(),
      lastUpdate: new Date().toISOString()
    }

    jobs[jobId] = updatedJob
    this.saveJobs(jobs)

    // Update parker status
    parkers[parkerId] = {
      ...parker,
      currentJobId: jobId,
      availabilityStatus: 'busy'
    }
    this.saveParkers(parkers)

    // Simulate Parker progress
    this.simulateParkerProgress(jobId)
  }

  private simulateParkerProgress(jobId: string) {
    // Simulate Parker going en route after 30-60 seconds
    setTimeout(() => {
      this.updateJobStatus(jobId, 'parker_en_route')
    }, Math.random() * 30000 + 30000)

    // Simulate spot secured after 2-4 minutes total
    setTimeout(() => {
      this.updateJobStatus(jobId, 'spot_secured')
    }, Math.random() * 120000 + 120000)
  }

  // Get available parkers in area
  async getAvailableParkers(lat: number, lng: number, radiusMiles: number = 10): Promise<Parker[]> {
    const parkers = this.getStoredParkers()
    
    return Object.values(parkers).filter(parker => {
      if (!parker.isOnline || parker.availabilityStatus !== 'available') return false
      if (!parker.currentLocation) return false
      
      const distance = this.getDistance(
        lat, lng,
        parker.currentLocation.lat, parker.currentLocation.lng
      )
      return distance <= radiusMiles
    })
  }

  // Subscribe to job updates
  subscribeToJob(jobId: string, callback: (job: JobRequest | null) => void): () => void {
    const key = `job_${jobId}`
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    this.listeners[key].push(callback)

    // Immediately call with current data
    const job = this.getJob(jobId)
    callback(job)

    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback)
      if (this.listeners[key].length === 0) {
        delete this.listeners[key]
      }
    }
  }

  // Convert JobRequest to AvailableJob for parker dashboard
  private convertToAvailableJob(job: JobRequest): any {
    return {
      id: job.id,
      businessName: job.businessName,
      address: job.businessAddress,
      coordinates: job.businessLocation,
      serviceType: job.spotPreferenceLabel,
      basePrice: job.basePrice,
      tip: job.tip,
      totalPay: job.parkerPay,
      estimatedDuration: '10-20 min',
      distance: '2.3 mi',
      priority: 'normal' as const,
      createdAt: new Date(job.requestTime),
      acceptanceDeadline: new Date(Date.now() + 600000), // 10 minutes from now
      specialInstructions: job.notes,
      customerId: job.customerId,
      customerName: job.customerName,
      customerPhone: job.customerPhone
    }
  }

  // Subscribe to parker jobs
  subscribeToParkerJobs(parkerId: string, callback: (jobs: any[]) => void): () => void {
    const key = `parker_jobs_${parkerId}`
    if (!this.listeners[key]) {
      this.listeners[key] = []
    }
    this.listeners[key].push(callback)

    // Immediately call with current data
    const jobs = this.getParkerJobs(parkerId).map(job => this.convertToAvailableJob(job))
    callback(jobs)

    return () => {
      this.listeners[key] = this.listeners[key].filter(cb => cb !== callback)
      if (this.listeners[key].length === 0) {
        delete this.listeners[key]
      }
    }
  }

  // Send notification
  async sendNotification(
    userId: string, 
    notificationData: Omit<Notification, 'id' | 'userId' | 'timestamp' | 'read'>
  ): Promise<void> {
    const notifications = JSON.parse(localStorage.getItem('parkr_notifications') || '{}')
    const notification: Notification = {
      ...notificationData,
      id: uuidv4(),
      userId,
      timestamp: new Date().toISOString(),
      read: false
    }

    if (!notifications[userId]) {
      notifications[userId] = []
    }
    notifications[userId].push(notification)
    
    localStorage.setItem('parkr_notifications', JSON.stringify(notifications))
  }

  // Helper methods
  private getJob(jobId: string): JobRequest | null {
    const jobs = this.getStoredJobs()
    return jobs[jobId] || null
  }

  private getParkerJobs(parkerId: string): JobRequest[] {
    const jobs = this.getStoredJobs()
    return Object.values(jobs).filter(job => 
      (job.status === 'pending' && !job.parkerId) || 
      (job.parkerId === parkerId && job.status !== 'completed')
    )
  }

  private calculateEstimatedArrival(): string {
    const baseTime = 5 + Math.random() * 10 // 5-15 minutes
    const arrivalTime = new Date(Date.now() + baseTime * 60000)
    return arrivalTime.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  private getDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 3959 // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLng = (lng2 - lng1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  private getStatusTitle(status: JobRequest['status']): string {
    const titles = {
      pending: 'Job Created',
      parker_assigned: 'Parker Assigned',
      parker_en_route: 'Parker En Route',
      spot_secured: 'Spot Secured!',
      completed: 'Job Completed',
      cancelled: 'Job Cancelled'
    }
    return titles[status] || 'Job Update'
  }

  private getStatusMessage(status: JobRequest['status'], job: JobRequest): string {
    const messages = {
      pending: 'Looking for an available Parker in your area...',
      parker_assigned: `${job.parkerName} is heading to your location`,
      parker_en_route: `${job.parkerName} is on the way to find your spot`,
      spot_secured: `Your spot is ready! ${job.parkerName} has secured your parking.`,
      completed: 'Thank you for using Parkr! Please rate your experience.',
      cancelled: 'Your job has been cancelled.'
    }
    return messages[status] || 'Your job status has been updated'
  }

  // Cleanup
  destroy() {
    if (this.jobUpdateInterval) {
      clearInterval(this.jobUpdateInterval)
    }
    this.listeners = {}
  }
}

export const mockJobService = new MockJobService()
