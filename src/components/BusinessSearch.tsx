import { useState, useEffect, useRef } from 'react'
import { Search, MapPin, Clock, Star, Zap, Filter, X } from 'lucide-react'
import { businessSearchService, Business } from '../lib/businessSearch'
import { useApp } from '../contexts/AppContext'

interface BusinessSearchProps {
  onBusinessSelect: (business: Business) => void
  placeholder?: string
  showPopular?: boolean
  className?: string
  value?: string
  onChange?: (value: string) => void
}

const BusinessSearch = ({ 
  onBusinessSelect, 
  placeholder = "Search businesses, restaurants, shopping...",
  showPopular = true,
  className = "",
  value,
  onChange
}: BusinessSearchProps) => {
  const { dispatch } = useApp()
  const [query, setQuery] = useState(value || '')
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchResults, setSearchResults] = useState<Business[]>([])
  const [popularBusinesses, setPopularBusinesses] = useState<Business[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [showResults, setShowResults] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: '', label: 'All Categories', icon: '🏢' },
    { id: 'Shopping', label: 'Shopping', icon: '🛍️' },
    { id: 'Entertainment', label: 'Entertainment', icon: '🎭' },
    { id: 'Restaurant', label: 'Restaurants', icon: '🍽️' },
    { id: 'Sports', label: 'Sports', icon: '⚽' },
    { id: 'Business', label: 'Business', icon: '🏢' },
    { id: 'Recreation', label: 'Recreation', icon: '🏌️' }
  ]

  // Sync with controlled value prop
  useEffect(() => {
    if (value !== undefined) {
      setQuery(value)
    }
  }, [value])

  // Load popular businesses on component mount
  useEffect(() => {
    const loadPopularBusinesses = async () => {
      try {
        const popular = await businessSearchService.getPopularBusinesses(6)
        setPopularBusinesses(popular)
      } catch (error) {
        console.error('Failed to load popular businesses:', error)
      }
    }
    loadPopularBusinesses()
  }, [])

  // Handle search input changes
  useEffect(() => {
    const searchBusinesses = async () => {
      if (query.trim().length === 0 && !selectedCategory) {
        setSuggestions([])
        setSearchResults([])
        setShowResults(false)
        return
      }

      setIsLoading(true)
      try {
        // Get autocomplete suggestions for short queries
        if (query.trim().length > 0 && query.trim().length < 3) {
          const autocompleteSuggestions = await businessSearchService.getAutocompleteSuggestions(query)
          setSuggestions(autocompleteSuggestions)
          setShowResults(true)
        } else {
          // Get full search results for longer queries or category selection
          const results = await businessSearchService.searchBusinesses(query, {
            category: selectedCategory || undefined,
            limit: 8,
            sortBy: 'relevance'
          })
          setSearchResults(results)
          setSuggestions([])
          setShowResults(true)
        }
      } catch (error) {
        console.error('Search failed:', error)
      }
      setIsLoading(false)
    }

    const debounceTimer = setTimeout(searchBusinesses, 300)
    return () => clearTimeout(debounceTimer)
  }, [query, selectedCategory])

  // Handle clicking outside to close results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    inputRef.current?.focus()
  }

  const handleBusinessSelect = (business: Business) => {
    setQuery(business.name)
    setShowResults(false)
    onBusinessSelect(business)
    
    // Call parent callback with onChange if provided
    if (onChange) {
      onChange(business.name)
    }
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId)
    if (categoryId) {
      setQuery('')
    }
  }

  const clearSearch = () => {
    setQuery('')
    setSelectedCategory('')
    setShowResults(false)
    setSuggestions([])
    setSearchResults([])
  }

  const getParkingDemandColor = (demand: string) => {
    switch (demand) {
      case 'extreme': return 'text-red-500'
      case 'very high': return 'text-orange-500'
      case 'high': return 'text-yellow-500'
      case 'medium': return 'text-blue-500'
      default: return 'text-green-500'
    }
  }

  const getParkingDemandLabel = (demand: string) => {
    switch (demand) {
      case 'extreme': return 'Very Busy'
      case 'very high': return 'Busy'
      case 'high': return 'Moderate'
      case 'medium': return 'Light'
      default: return 'Available'
    }
  }

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Search Input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-apple-text-secondary" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={value !== undefined ? value : query}
          onChange={(e) => {
            const newValue = e.target.value
            setQuery(newValue)
            onChange?.(newValue)
          }}
          onFocus={() => setShowResults(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 apple-glass-strong rounded-2xl text-apple-text text-lg placeholder-apple-text-secondary focus:outline-none focus:ring-2 focus:ring-apple-accent/50 transition-all duration-200"
        />
        {(query || selectedCategory) && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-4 flex items-center text-apple-text-secondary hover:text-apple-text transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="flex space-x-2 mt-3 overflow-x-auto pb-2">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all duration-200 ${
              selectedCategory === category.id
                ? 'apple-gradient-primary text-white shadow-apple'
                : 'apple-glass-subtle text-apple-text hover:apple-glass-strong'
            }`}
          >
            <span className="text-sm">{category.icon}</span>
            <span className="text-sm font-medium">{category.label}</span>
          </button>
        ))}
      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50">
          <div className="apple-glass-strong rounded-2xl shadow-apple border border-white/20 max-h-96 overflow-y-auto">
            {isLoading && (
              <div className="p-4 text-center text-apple-text-secondary">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-apple-accent"></div>
                <div className="mt-2">Searching...</div>
              </div>
            )}

            {/* Autocomplete Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-semibold text-apple-text-secondary px-3 py-2">SUGGESTIONS</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-3 py-2 text-apple-text hover:apple-glass-subtle rounded-xl transition-all duration-200 flex items-center space-x-3"
                  >
                    <Search className="h-4 w-4 text-apple-text-secondary" />
                    <span>{suggestion}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="p-2">
                <div className="text-xs font-semibold text-apple-text-secondary px-3 py-2">
                  SEARCH RESULTS ({searchResults.length})
                </div>
                {searchResults.map((business) => (
                  <button
                    key={business.id}
                    onClick={() => handleBusinessSelect(business)}
                    className="w-full text-left p-3 hover:apple-glass-subtle rounded-xl transition-all duration-200 border-b border-white/10 last:border-b-0"
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 w-10 h-10 apple-glass-subtle rounded-xl flex items-center justify-center">
                        <MapPin className="h-5 w-5 text-apple-accent" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-apple-text truncate">{business.name}</h3>
                          <span className={`text-xs font-medium ${getParkingDemandColor(business.averageParkingDemand)}`}>
                            {getParkingDemandLabel(business.averageParkingDemand)}
                          </span>
                        </div>
                        <p className="text-sm text-apple-text-secondary truncate">{business.address}</p>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium apple-glass-subtle text-apple-text">
                            {business.category}
                          </span>
                          {business.peakHours.length > 0 && (
                            <span className="flex items-center text-xs text-apple-text-secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Peak: {business.peakHours[0]}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {!isLoading && suggestions.length === 0 && searchResults.length === 0 && (query.length >= 3 || selectedCategory) && (
              <div className="p-6 text-center text-apple-text-secondary">
                <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No businesses found</p>
                <p className="text-sm">Try a different search term or category</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Popular Businesses (when no search active) */}
      {showPopular && !showResults && !query && !selectedCategory && popularBusinesses.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-bold text-apple-text mb-4 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-apple-accent" />
            Popular Destinations
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {popularBusinesses.map((business) => (
              <button
                key={business.id}
                onClick={() => handleBusinessSelect(business)}
                className="apple-glass-strong rounded-xl p-4 text-left hover:apple-glass-subtle transition-all duration-200 shadow-apple group"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-apple-text group-hover:text-apple-accent transition-colors">
                    {business.name}
                  </h4>
                  <span className={`text-xs font-medium ${getParkingDemandColor(business.averageParkingDemand)}`}>
                    {getParkingDemandLabel(business.averageParkingDemand)}
                  </span>
                </div>
                <p className="text-sm text-apple-text-secondary mb-2">{business.address}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium apple-glass-subtle text-apple-text">
                    {business.category}
                  </span>
                  <span className="flex items-center text-xs text-apple-text-secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {business.parkingSpots.length} spots
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessSearch
