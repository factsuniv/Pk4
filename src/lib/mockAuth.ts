// Mock Authentication System - No Firebase required
import toast from 'react-hot-toast'
import { v4 as uuidv4 } from 'uuid'

export interface MockUser {
  uid: string
  email: string
  displayName: string
  emailVerified: boolean
}

export interface MockUserProfile {
  uid: string
  email: string
  displayName: string
  name?: string
  phone?: string
  role?: 'customer' | 'parker'
  userType: 'customer' | 'parker'
  isEmailVerified: boolean
  createdAt: string
  serviceArea?: string[]
  membershipTier?: string
  totalTrips?: number
  rating?: number
  totalSavings?: number
  totalEarnings?: number
  isOnline?: boolean
  availabilityStatus?: 'available' | 'busy' | 'offline' | 'break'
  vehicleInfo?: {
    make: string
    model: string
    color: string
    licensePlate: string
  }
}

// Demo accounts for immediate testing
const DEMO_ACCOUNTS = {
  customers: [
    { 
      email: 'demo@parkr.com', 
      password: 'demo123', 
      name: 'Alex Johnson', 
      userType: 'customer' as const,
      phone: '(469) 555-0123',
      totalTrips: 47,
      rating: 4.8,
      membershipTier: 'Premium'
    },
    { 
      email: 'customer@test.com', 
      password: 'test123', 
      name: 'Jane Customer', 
      userType: 'customer' as const,
      phone: '(214) 555-0156',
      totalTrips: 12,
      rating: 4.5,
      membershipTier: 'Basic'
    }
  ],
  parkers: [
    { 
      email: 'parker@parkr.com', 
      password: 'parker123', 
      name: 'Sarah Parker', 
      userType: 'parker' as const,
      phone: '(214) 555-0198',
      totalTrips: 156,
      rating: 4.9,
      membershipTier: 'Basic',
      vehicleInfo: {
        make: 'Honda',
        model: 'Civic',
        color: 'Silver',
        licensePlate: 'ABC-1234'
      },
      serviceArea: ['Legacy', 'Frisco', 'Plano', 'The Colony'],
      totalEarnings: 2847.60,
      isOnline: false,
      availabilityStatus: 'offline'
    },
    { 
      email: 'driver@test.com', 
      password: 'test123', 
      name: 'Mike Rodriguez', 
      userType: 'parker' as const,
      phone: '(972) 555-0187',
      totalTrips: 89,
      rating: 4.7,
      membershipTier: 'Basic',
      vehicleInfo: {
        make: 'Toyota',
        model: 'Camry',
        color: 'Blue',
        licensePlate: 'XYZ-5678'
      },
      serviceArea: ['Downtown Dallas', 'Deep Ellum', 'Uptown'],
      totalEarnings: 1654.30,
      isOnline: false,
      availabilityStatus: 'offline'
    }
  ]
}

class MockAuthService {
  private currentUser: MockUser | null = null
  private listeners: Array<(user: MockUser | null) => void> = []

  constructor() {
    // Check for persisted session
    const savedSession = localStorage.getItem('parkr_session')
    if (savedSession) {
      try {
        this.currentUser = JSON.parse(savedSession)
      } catch (error) {
        localStorage.removeItem('parkr_session')
      }
    }
    
    // Initialize demo profiles if they don't exist
    this.initializeDemoProfiles()
  }

  private initializeDemoProfiles() {
    const profiles = this.getStoredProfiles()
    
    // Create demo customer profiles
    DEMO_ACCOUNTS.customers.forEach(account => {
      if (!profiles[account.email]) {
        const profile: MockUserProfile = {
          uid: uuidv4(),
          email: account.email,
          displayName: account.name,
          userType: account.userType,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          phone: this.generateDemoPhone()
        }
        profiles[account.email] = profile
      }
    })

    // Create demo parker profiles
    DEMO_ACCOUNTS.parkers.forEach(account => {
      if (!profiles[account.email]) {
        const profile: MockUserProfile = {
          uid: uuidv4(),
          email: account.email,
          displayName: account.name,
          userType: account.userType,
          isEmailVerified: true,
          createdAt: new Date().toISOString(),
          phone: this.generateDemoPhone(),
          serviceArea: ['Plano', 'Frisco', 'McKinney'],
          vehicleInfo: this.generateDemoVehicle()
        }
        profiles[account.email] = profile
      }
    })

    localStorage.setItem('parkr_profiles', JSON.stringify(profiles))
  }

  private generateDemoPhone(): string {
    return `(${Math.floor(Math.random() * 900) + 100}) ${Math.floor(Math.random() * 900) + 100}-${Math.floor(Math.random() * 9000) + 1000}`
  }

  private generateDemoVehicle() {
    const makes = ['Toyota', 'Honda', 'Ford', 'Chevrolet', 'Nissan']
    const models = ['Camry', 'Civic', 'Focus', 'Cruze', 'Altima']
    const colors = ['Silver', 'Black', 'White', 'Blue', 'Red']
    
    return {
      make: makes[Math.floor(Math.random() * makes.length)],
      model: models[Math.floor(Math.random() * models.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
      licensePlate: `ABC${Math.floor(Math.random() * 900) + 100}`
    }
  }

  private getStoredProfiles(): { [email: string]: MockUserProfile } {
    try {
      return JSON.parse(localStorage.getItem('parkr_profiles') || '{}')
    } catch {
      return {}
    }
  }

  private notifyListeners() {
    this.listeners.forEach(listener => listener(this.currentUser))
  }

  onAuthStateChanged(callback: (user: MockUser | null) => void): () => void {
    this.listeners.push(callback)
    // Immediately call with current state
    callback(this.currentUser)
    
    return () => {
      this.listeners = this.listeners.filter(l => l !== callback)
    }
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Check demo accounts first
    const allDemoAccounts = [...DEMO_ACCOUNTS.customers, ...DEMO_ACCOUNTS.parkers]
    const demoAccount = allDemoAccounts.find(acc => acc.email === email && acc.password === password)
    
    if (demoAccount) {
      const profile = this.getStoredProfiles()[email]
      if (profile) {
        this.currentUser = {
          uid: profile.uid,
          email: profile.email,
          displayName: profile.displayName,
          emailVerified: true
        }
        localStorage.setItem('parkr_session', JSON.stringify(this.currentUser))
        this.notifyListeners()
        return { user: this.currentUser }
      }
    }

    // Check stored accounts
    const storedAccounts = JSON.parse(localStorage.getItem('parkr_accounts') || '{}')
    if (storedAccounts[email] && storedAccounts[email].password === password) {
      const profile = this.getStoredProfiles()[email]
      if (profile) {
        this.currentUser = {
          uid: profile.uid,
          email: profile.email,
          displayName: profile.displayName,
          emailVerified: true
        }
        localStorage.setItem('parkr_session', JSON.stringify(this.currentUser))
        this.notifyListeners()
        return { user: this.currentUser }
      }
    }

    throw new Error('Invalid email or password')
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<{ user: MockUser }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800))

    const storedAccounts = JSON.parse(localStorage.getItem('parkr_accounts') || '{}')
    
    if (storedAccounts[email]) {
      throw new Error('Email already in use')
    }

    const uid = uuidv4()
    this.currentUser = {
      uid,
      email,
      displayName: email.split('@')[0], // Temporary display name
      emailVerified: true // Auto-verify for demo
    }

    // Store account
    storedAccounts[email] = { password, uid }
    localStorage.setItem('parkr_accounts', JSON.stringify(storedAccounts))
    localStorage.setItem('parkr_session', JSON.stringify(this.currentUser))
    
    this.notifyListeners()
    return { user: this.currentUser }
  }

  async updateProfile(updates: { displayName?: string }): Promise<void> {
    if (!this.currentUser) throw new Error('No user signed in')
    
    if (updates.displayName) {
      this.currentUser.displayName = updates.displayName
      localStorage.setItem('parkr_session', JSON.stringify(this.currentUser))
      this.notifyListeners()
    }
  }

  async sendEmailVerification(): Promise<void> {
    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 300))
    // Auto-verify for demo
    if (this.currentUser) {
      this.currentUser.emailVerified = true
      localStorage.setItem('parkr_session', JSON.stringify(this.currentUser))
      this.notifyListeners()
    }
  }

  async signOut(): Promise<void> {
    this.currentUser = null
    localStorage.removeItem('parkr_session')
    this.notifyListeners()
  }

  getCurrentUser(): MockUser | null {
    return this.currentUser
  }

  // Profile management
  async getUserProfile(uid: string): Promise<MockUserProfile | null> {
    const profiles = this.getStoredProfiles()
    return Object.values(profiles).find(profile => profile.uid === uid) || null
  }

  async updateUserProfile(uid: string, updates: Partial<MockUserProfile>): Promise<void> {
    const profiles = this.getStoredProfiles()
    const userProfile = Object.values(profiles).find(profile => profile.uid === uid)
    
    if (userProfile) {
      const updatedProfile = { ...userProfile, ...updates }
      profiles[userProfile.email] = updatedProfile
      localStorage.setItem('parkr_profiles', JSON.stringify(profiles))
    }
  }

  async createUserProfile(profileData: Omit<MockUserProfile, 'uid' | 'createdAt'>): Promise<void> {
    const profiles = this.getStoredProfiles()
    const profile: MockUserProfile = {
      ...profileData,
      uid: uuidv4(),
      createdAt: new Date().toISOString()
    }
    profiles[profile.email] = profile
    localStorage.setItem('parkr_profiles', JSON.stringify(profiles))
  }

  // Get demo accounts for testing reference
  getDemoAccounts() {
    return DEMO_ACCOUNTS
  }
}

export const mockAuth = new MockAuthService()
