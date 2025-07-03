// Business Search Service for Collin County
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

export interface BusinessSearchResult {
  businesses: Business[]
  categories: string[]
  searchTags: string[]
}

class BusinessSearchService {
  private businesses: Business[] = []
  private categories: string[] = []
  private searchTags: string[] = []
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      const response = await fetch('/data/collin-county-businesses.json')
      const data: BusinessSearchResult = await response.json()
      this.businesses = data.businesses
      this.categories = data.categories
      this.searchTags = data.searchTags
      this.initialized = true
    } catch (error) {
      console.error('Failed to load business data:', error)
      throw new Error('Failed to load business search data')
    }
  }

  // Search businesses with multiple criteria
  async searchBusinesses(query: string, options: {
    category?: string
    limit?: number
    sortBy?: 'relevance' | 'distance' | 'name'
    userLocation?: { lat: number; lng: number }
  } = {}): Promise<Business[]> {
    await this.initialize()

    if (!query.trim() && !options.category) {
      return this.businesses.slice(0, options.limit || 10)
    }

    const queryLower = query.toLowerCase().trim()
    let results = this.businesses.filter(business => {
      // Text search
      const matchesText = !queryLower || 
        business.name.toLowerCase().includes(queryLower) ||
        business.address.toLowerCase().includes(queryLower) ||
        business.description.toLowerCase().includes(queryLower) ||
        business.category.toLowerCase().includes(queryLower) ||
        business.tags.some(tag => tag.toLowerCase().includes(queryLower))

      // Category filter
      const matchesCategory = !options.category || 
        business.category.toLowerCase() === options.category.toLowerCase()

      return matchesText && matchesCategory
    })

    // Sort results
    if (options.sortBy === 'name') {
      results.sort((a, b) => a.name.localeCompare(b.name))
    } else if (options.sortBy === 'distance' && options.userLocation) {
      results.sort((a, b) => {
        const distA = this.calculateDistance(options.userLocation!, a.coordinates)
        const distB = this.calculateDistance(options.userLocation!, b.coordinates)
        return distA - distB
      })
    } else {
      // Sort by relevance (exact name matches first, then partial matches)
      results.sort((a, b) => {
        const aExactName = a.name.toLowerCase() === queryLower ? 1 : 0
        const bExactName = b.name.toLowerCase() === queryLower ? 1 : 0
        if (aExactName !== bExactName) return bExactName - aExactName

        const aStartsWithName = a.name.toLowerCase().startsWith(queryLower) ? 1 : 0
        const bStartsWithName = b.name.toLowerCase().startsWith(queryLower) ? 1 : 0
        if (aStartsWithName !== bStartsWithName) return bStartsWithName - aStartsWithName

        return a.name.localeCompare(b.name)
      })
    }

    return results.slice(0, options.limit || 10)
  }

  // Get autocomplete suggestions
  async getAutocompleteSuggestions(query: string, limit: number = 8): Promise<string[]> {
    await this.initialize()

    if (!query.trim()) return []

    const queryLower = query.toLowerCase().trim()
    const suggestions = new Set<string>()

    // Add business names that match
    this.businesses.forEach(business => {
      if (business.name.toLowerCase().includes(queryLower)) {
        suggestions.add(business.name)
      }
    })

    // Add categories that match
    this.categories.forEach(category => {
      if (category.toLowerCase().includes(queryLower)) {
        suggestions.add(category)
      }
    })

    // Add relevant tags
    this.searchTags.forEach(tag => {
      if (tag.toLowerCase().includes(queryLower)) {
        suggestions.add(tag.charAt(0).toUpperCase() + tag.slice(1))
      }
    })

    return Array.from(suggestions).slice(0, limit)
  }

  // Get business by ID
  async getBusinessById(id: string): Promise<Business | null> {
    await this.initialize()
    return this.businesses.find(business => business.id === id) || null
  }

  // Get businesses by category
  async getBusinessesByCategory(category: string): Promise<Business[]> {
    await this.initialize()
    return this.businesses.filter(business => 
      business.category.toLowerCase() === category.toLowerCase()
    )
  }

  // Get popular businesses (high parking demand)
  async getPopularBusinesses(limit: number = 6): Promise<Business[]> {
    await this.initialize()
    return this.businesses
      .filter(business => ['high', 'very high', 'extreme'].includes(business.averageParkingDemand))
      .sort((a, b) => {
        const demandOrder = { 'extreme': 4, 'very high': 3, 'high': 2, 'medium': 1, 'low': 0 }
        return demandOrder[b.averageParkingDemand] - demandOrder[a.averageParkingDemand]
      })
      .slice(0, limit)
  }

  // Get businesses near location
  async getBusinessesNearLocation(
    location: { lat: number; lng: number }, 
    radiusKm: number = 10,
    limit: number = 10
  ): Promise<Business[]> {
    await this.initialize()
    
    return this.businesses
      .filter(business => {
        const distance = this.calculateDistance(location, business.coordinates)
        return distance <= radiusKm
      })
      .sort((a, b) => {
        const distA = this.calculateDistance(location, a.coordinates)
        const distB = this.calculateDistance(location, b.coordinates)
        return distA - distB
      })
      .slice(0, limit)
  }

  // Get all categories
  getCategories(): string[] {
    return this.categories
  }

  // Calculate distance between two coordinates (Haversine formula)
  private calculateDistance(
    pos1: { lat: number; lng: number }, 
    pos2: { lat: number; lng: number }
  ): number {
    const R = 6371 // Earth's radius in kilometers
    const dLat = this.toRadians(pos2.lat - pos1.lat)
    const dLng = this.toRadians(pos2.lng - pos1.lng)
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(pos1.lat)) * Math.cos(this.toRadians(pos2.lat)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  // Get business with parking availability estimation
  async getBusinessWithParkingInfo(businessId: string): Promise<Business & { 
    estimatedParkingAvailability: number
    estimatedWaitTime: string
    recommendedArrivalTime: string
  } | null> {
    const business = await this.getBusinessById(businessId)
    if (!business) return null

    // Mock parking availability based on demand and current time
    const now = new Date()
    const currentHour = now.getHours()
    const isPeakTime = business.peakHours.some(range => {
      const [start, end] = range.split('-').map(time => parseInt(time.split(':')[0]))
      return currentHour >= start && currentHour <= end
    })

    let availability = 0.8 // Default 80% availability
    let waitTime = '0-2 min'
    let recommendedTime = 'Now'

    if (isPeakTime) {
      switch (business.averageParkingDemand) {
        case 'extreme':
          availability = 0.2
          waitTime = '15-25 min'
          recommendedTime = 'Book 30 min in advance'
          break
        case 'very high':
          availability = 0.4
          waitTime = '8-15 min'
          recommendedTime = 'Book 15 min in advance'
          break
        case 'high':
          availability = 0.6
          waitTime = '3-8 min'
          recommendedTime = 'Book 10 min in advance'
          break
        default:
          availability = 0.7
          waitTime = '2-5 min'
      }
    }

    return {
      ...business,
      estimatedParkingAvailability: availability,
      estimatedWaitTime: waitTime,
      recommendedArrivalTime: recommendedTime
    }
  }
}

export const businessSearchService = new BusinessSearchService()
