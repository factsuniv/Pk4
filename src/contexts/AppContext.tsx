import React, { createContext, useContext, useReducer, useEffect } from 'react'

// Types
export interface ParkingSpot {
  id: string
  parker_name: string
  parker_rating: number
  location: {
    name: string
    address: string
    lat: number
    lng: number
  }
  price: number
  availability: {
    start: string
    end: string
    status: 'available' | 'reserved' | 'occupied'
  }
  spot_type: 'economy' | 'standard' | 'premium' | 'covered'
  distance_walk: string
  amenities: string[]
  parker_photo: string
  spot_photos: string[]
  earnings: number
}

export interface AppConfig {
  app: {
    name: string
    tagline: string
    version: string
    brand_color: string
    secondary_color: string
  }
  demo_user: {
    name: string
    email: string
    phone: string
    rating: number
    total_bookings: number
    member_since: string
  }
  pricing: {
    base_fee: number
    service_fee_percentage: number
    parker_minimum_payout: number
    currency: string
  }
  locations: {
    [key: string]: {
      name: string
      center: { lat: number; lng: number }
      zoom: number
      peak_hours: string[]
      average_price: number
    }
  }
}

export interface Booking {
  id: string
  spot_id: string
  user_id: string
  parker_name: string
  location: string
  start_time: string
  end_time: string
  total_price: number
  status: 'active' | 'completed' | 'cancelled' | 'upcoming'
  confirmation_code: string
}

interface AppState {
  parkingSpots: {
    downtown_dallas: ParkingSpot[]
    legacy_plano: ParkingSpot[]
  }
  config: AppConfig | null
  currentLocation: string
  selectedSpot: ParkingSpot | null
  user: any
  isAuthenticated: boolean
  currentBooking: Booking | null
  bookings: Booking[]
  mapCenter: { lat: number; lng: number }
  isLoading: boolean
}

type AppAction = 
  | { type: 'SET_PARKING_SPOTS'; payload: { downtown_dallas: ParkingSpot[]; legacy_plano: ParkingSpot[] } }
  | { type: 'SET_CONFIG'; payload: AppConfig }
  | { type: 'SET_LOCATION'; payload: string }
  | { type: 'SELECT_SPOT'; payload: ParkingSpot | null }
  | { type: 'SET_USER'; payload: any }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'SET_CURRENT_BOOKING'; payload: Booking | null }
  | { type: 'ADD_BOOKING'; payload: Booking }
  | { type: 'SET_MAP_CENTER'; payload: { lat: number; lng: number } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'UPDATE_SPOT_STATUS'; payload: { spotId: string; status: 'available' | 'reserved' | 'occupied' } }

const initialState: AppState = {
  parkingSpots: {
    downtown_dallas: [],
    legacy_plano: []
  },
  config: null,
  currentLocation: 'downtown_dallas',
  selectedSpot: null,
  user: null,
  isAuthenticated: false,
  currentBooking: null,
  bookings: [],
  mapCenter: { lat: 32.7831, lng: -96.8009 }, // Downtown Dallas default
  isLoading: false
}

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PARKING_SPOTS':
      return { ...state, parkingSpots: action.payload }
    case 'SET_CONFIG':
      return { ...state, config: action.payload }
    case 'SET_LOCATION':
      return { ...state, currentLocation: action.payload }
    case 'SELECT_SPOT':
      return { ...state, selectedSpot: action.payload }
    case 'SET_USER':
      return { ...state, user: action.payload }
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload }
    case 'SET_CURRENT_BOOKING':
      return { ...state, currentBooking: action.payload }
    case 'ADD_BOOKING':
      return { ...state, bookings: [...state.bookings, action.payload] }
    case 'SET_MAP_CENTER':
      return { ...state, mapCenter: action.payload }
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'UPDATE_SPOT_STATUS':
      const updatedSpots = { ...state.parkingSpots }
      Object.keys(updatedSpots).forEach(location => {
        updatedSpots[location as keyof typeof updatedSpots] = updatedSpots[location as keyof typeof updatedSpots].map(spot =>
          spot.id === action.payload.spotId 
            ? { ...spot, availability: { ...spot.availability, status: action.payload.status } }
            : spot
        )
      })
      return { ...state, parkingSpots: updatedSpots }
    default:
      return state
  }
}

const AppContext = createContext<{
  state: AppState
  dispatch: React.Dispatch<AppAction>
} | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  useEffect(() => {
    // Load initial data
    Promise.all([
      fetch('/data/parking-spots.json').then(res => res.json()),
      fetch('/data/app-config.json').then(res => res.json())
    ]).then(([spotsData, configData]) => {
      dispatch({ type: 'SET_PARKING_SPOTS', payload: spotsData })
      dispatch({ type: 'SET_CONFIG', payload: configData })
      
      // Set initial map center based on current location
      if (configData.locations[state.currentLocation]) {
        dispatch({ 
          type: 'SET_MAP_CENTER', 
          payload: configData.locations[state.currentLocation].center 
        })
      }
    }).catch(console.error)

    // Auto-authenticate demo user
    dispatch({ type: 'SET_AUTHENTICATED', payload: true })
    dispatch({ type: 'SET_USER', payload: { name: 'Alex Johnson', email: 'alex@demo.com' } })
  }, [])

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
