import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { 
  Search, 
  User, 
  Car, 
  Menu, 
  X,
  Clock,
  DollarSign,
  Star
} from 'lucide-react'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useApp()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navItems = [
    { path: '/app', icon: <Search className="w-5 h-5" />, label: 'Find Parking' },
    { path: '/app/profile', icon: <User className="w-5 h-5" />, label: 'Profile' },
    { path: '/app/parker', icon: <Car className="w-5 h-5" />, label: 'Become Parker' },
  ]

  const isActive = (path: string) => {
    if (path === '/app') {
      return location.pathname === '/app' || location.pathname === '/app/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <nav className="apple-nav">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex items-center space-x-4 cursor-pointer apple-interactive"
            onClick={() => navigate('/app')}
          >
            <div className="w-12 h-12 apple-glass rounded-2xl flex items-center justify-center shadow-apple">
              <div className="text-xl font-bold text-apple-accent">P</div>
            </div>
            <div className="text-2xl font-bold text-apple-text">Parkr</div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-3 px-6 py-3 rounded-2xl transition-all duration-300 apple-interactive ${
                  isActive(item.path)
                    ? 'text-apple-accent apple-glass-strong'
                    : 'text-apple-text-secondary hover:text-apple-text apple-glass-subtle'
                }`}
              >
                {item.icon}
                <span className="font-semibold text-lg">{item.label}</span>
              </button>
            ))}
          </div>

          {/* User Info & Stats */}
          <div className="hidden md:flex items-center space-x-8">
            {state.isAuthenticated && (
              <>
                <div className="flex items-center space-x-6">
                  <div className="apple-badge-info flex items-center space-x-2">
                    <Star className="w-4 h-4" />
                    <span className="font-semibold">4.8</span>
                  </div>
                  <div className="apple-badge apple-glass-subtle flex items-center space-x-2">
                    <Clock className="w-4 h-4 text-apple-accent" />
                    <span className="font-semibold text-apple-text">47 trips</span>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-lg font-semibold text-apple-text">Alex Johnson</div>
                    <div className="text-sm text-apple-text-secondary">Premium Member</div>
                  </div>
                  <div className="w-12 h-12 apple-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold shadow-apple text-lg">
                    AJ
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-3 apple-glass rounded-2xl text-apple-text apple-interactive"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden apple-glass-strong mx-6 rounded-3xl my-4">
          <div className="px-6 py-8 space-y-6">
            {/* User Info Mobile */}
            {state.isAuthenticated && (
              <div className="flex items-center space-x-4 pb-6 border-b border-white/20">
                <div className="w-16 h-16 apple-gradient-primary rounded-2xl flex items-center justify-center text-white font-bold shadow-apple text-xl">
                  AJ
                </div>
                <div>
                  <div className="font-semibold text-apple-text text-lg">Alex Johnson</div>
                  <div className="text-apple-text-secondary">Premium Member</div>
                  <div className="flex items-center space-x-4 mt-2">
                    <div className="apple-badge-info flex items-center space-x-1">
                      <Star className="w-3 h-3" />
                      <span className="text-sm">4.8</span>
                    </div>
                    <div className="apple-badge apple-glass-subtle flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-apple-accent" />
                      <span className="text-sm text-apple-text">47 trips</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Navigation Items */}
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path)
                  setIsMenuOpen(false)
                }}
                className={`w-full flex items-center space-x-4 px-6 py-4 rounded-2xl transition-all duration-300 apple-interactive ${
                  isActive(item.path)
                    ? 'text-apple-accent apple-glass-strong'
                    : 'text-apple-text apple-glass-subtle'
                }`}
              >
                {item.icon}
                <span className="font-semibold text-lg">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Booking Banner */}
      {state.currentBooking && (
        <div className="apple-gradient-primary">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-apple-pulse"></div>
                <span className="font-semibold text-white text-lg">Active Booking: {state.currentBooking.location}</span>
                <span className="text-white/80">• Ends at {state.currentBooking.end_time}</span>
              </div>
              <button 
                onClick={() => navigate(`/app/booking/${state.currentBooking.spot_id}`)}
                className="text-white/80 hover:text-white font-semibold apple-interactive px-4 py-2 apple-glass-subtle rounded-xl"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navigation
