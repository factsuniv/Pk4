export interface JobRequest {
  id: string
  customerId: string
  customerName: string
  customerPhone: string
  status: 'pending' | 'parker_assigned' | 'parker_en_route' | 'spot_secured' | 'completed' | 'cancelled'
  
  // Location details
  businessName: string
  businessAddress: string
  businessLocation: {
    lat: number
    lng: number
  }
  
  // Parking preferences
  spotPreference: 'just_in_lot' | 'best_available' | 'at_the_front'
  spotPreferenceLabel: string
  basePrice: number
  parkerPay: number
  tip: number
  totalPrice: number
  
  // Timing
  requestTime: string
  estimatedArrival?: string
  actualArrival?: string
  completedTime?: string
  
  // Parker assignment
  parkerId?: string
  parkerName?: string
  parkerPhone?: string
  parkerLocation?: {
    lat: number
    lng: number
  }
  
  // Job details
  distanceFromEntrance?: string
  spotQuality?: number
  weatherProtection?: 'covered' | 'uncovered'
  securityLevel?: 'high' | 'medium' | 'low'
  estimatedWaitTime?: number
  
  // Communication
  lastUpdate: string
  notes?: string
}

export interface Parker {
  id: string
  name: string
  email: string
  phone: string
  isOnline: boolean
  currentLocation?: {
    lat: number
    lng: number
  }
  serviceAreas: string[]
  
  // Vehicle info
  vehicleInfo: {
    make: string
    model: string
    color: string
    licensePlate: string
  }
  
  // Performance metrics
  rating: number
  totalJobs: number
  successRate: number
  averageTime: number
  totalEarnings: number
  
  // Current job
  currentJobId?: string
  
  // Availability
  availabilityStatus: 'available' | 'busy' | 'offline'
  lastSeen: string
}

export interface BusinessSearchResult {
  placeId: string
  name: string
  address: string
  location: {
    lat: number
    lng: number
  }
  rating?: number
  priceLevel?: number
  types: string[]
  photos?: string[]
  inServiceArea: boolean
}

export interface SpotPreference {
  id: 'just_in_lot' | 'best_available' | 'at_the_front'
  label: string
  description: string
  price: number
  parkerPay: number
  estimatedTime: string
  features: string[]
}

export const SPOT_PREFERENCES: SpotPreference[] = [
  {
    id: 'just_in_lot',
    label: 'Just in the lot',
    description: 'Any available spot in the parking area',
    price: 12,
    parkerPay: 7,
    estimatedTime: '5-10 min',
    features: ['Cheapest option', 'Quick service', 'Any spot']
  },
  {
    id: 'best_available',
    label: 'Best spot available',
    description: 'Good spot with reasonable walking distance',
    price: 18,
    parkerPay: 8,
    estimatedTime: '8-15 min',
    features: ['Better location', 'Shorter walk', 'Good value']
  },
  {
    id: 'at_the_front',
    label: 'At the front',
    description: 'Premium spot as close to entrance as possible',
    price: 25,
    parkerPay: 8.5,
    estimatedTime: '10-20 min',
    features: ['Premium location', 'Minimal walk', 'Best experience']
  }
]

export interface Notification {
  id: string
  userId: string
  type: 'job_update' | 'parker_assigned' | 'spot_secured' | 'payment' | 'general' | 'new_job_available' | 'job_cancelled'
  title: string
  message: string
  timestamp: string
  read: boolean
  jobId?: string
}

// User role types
export type UserRole = 'customer' | 'parker'

// Enhanced user profile with role-based fields
export interface UserProfile {
  uid: string
  email: string
  name: string
  phone?: string
  role: UserRole
  membershipTier: 'Basic' | 'Premium' | 'VIP'
  totalTrips: number
  rating: number
  totalSavings: number
  preferredPayment?: string
  emergencyContact?: string
  
  // Parker-specific fields
  isOnline?: boolean
  serviceArea?: {
    center: { lat: number; lng: number }
    radius: number // in km
  }
  totalEarnings?: number
  completedJobs?: number
  successRate?: number
  availabilityStatus?: 'available' | 'busy' | 'offline' | 'break'
}

// Business search types
export interface Business {
  id: string
  name: string
  category: string
  address: string
  coordinates: { lat: number; lng: number }
  phone?: string
  description: string
  tags: string[]
  averageParkingDemand: 'low' | 'medium' | 'high' | 'very high' | 'extreme'
  peakHours: string[]
  parkingSpots: string[]
}

// Available job for Parker dashboard
export interface AvailableJob {
  id: string
  businessName: string
  address: string
  coordinates: { lat: number; lng: number }
  serviceType: string
  basePrice: number
  tip: number
  totalPay: number
  estimatedDuration: string
  distance: string
  priority: 'normal' | 'high' | 'urgent'
  createdAt: Date
  acceptanceDeadline: Date
  specialInstructions?: string
  customerPreferences?: string[]
  customerId: string
  customerName: string
  customerPhone: string
}

// Earnings statistics for Parker dashboard
export interface EarningsStats {
  today: number
  thisWeek: number
  thisMonth: number
  totalLifetime: number
  averagePerJob: number
  topEarningDay: number
  totalJobs: number
  hoursWorked: number
}

// Performance metrics for Parker
export interface PerformanceMetrics {
  rating: number
  completedJobs: number
  successRate: number
  averageResponseTime: string
  customerSatisfaction: number
  onTimePercentage: number
  totalEarnings: number
}

// Parker status options
export const PARKER_STATUSES = [
  { id: 'available', label: 'Available', color: 'green' },
  { id: 'busy', label: 'On Job', color: 'yellow' },
  { id: 'break', label: 'On Break', color: 'orange' },
  { id: 'offline', label: 'Offline', color: 'gray' }
] as const

export type ParkerStatus = typeof PARKER_STATUSES[number]['id']
