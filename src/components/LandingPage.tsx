import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/MockAuthContext'
import { 
  MapPin, 
  Clock, 
  Shield, 
  Smartphone, 
  Star, 
  ArrowRight,
  DollarSign,
  Car,
  Users,
  CheckCircle,
  LogIn,
  UserPlus
} from 'lucide-react'

const LandingPage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/app')
    } else {
      navigate('/auth')
    }
  }

  const handleSignIn = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen apple-gradient-mesh text-apple-text">
      {/* Header */}
      <header className="relative z-50 w-full">
        <div className="w-full px-4 sm:px-6 py-4 sm:py-6">
          <div className="apple-glass-strong rounded-2xl sm:rounded-3xl">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 sm:py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <div className="w-10 h-10 sm:w-14 sm:h-14 apple-glass rounded-xl sm:rounded-2xl flex items-center justify-center shadow-apple animate-apple-float">
                    <div className="text-lg sm:text-2xl font-bold text-apple-accent">P</div>
                  </div>
                  <div className="text-xl sm:text-2xl font-bold text-apple-text">Parkr</div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-4">
                  {currentUser ? (
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <span className="hidden sm:block text-apple-text-secondary">
                        Welcome, {userProfile?.displayName || 'User'}
                      </span>
                      <button 
                        onClick={() => navigate('/app')}
                        className="apple-button-primary apple-interactive text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3"
                      >
                        Go to App
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <button 
                        onClick={handleSignIn}
                        className="apple-button-secondary apple-interactive flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
                      >
                        <LogIn className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Sign In</span>
                        <span className="sm:hidden">In</span>
                      </button>
                      <button 
                        onClick={handleGetStarted}
                        className="apple-button-primary apple-interactive flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-3"
                      >
                        <UserPlus className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span className="hidden sm:inline">Get Started</span>
                        <span className="sm:hidden">Start</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`w-full px-4 sm:px-6 py-8 sm:py-16 lg:py-24 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-5xl lg:text-7xl font-bold mb-4 sm:mb-8 leading-tight text-apple-text">
              Premium Valet Parking
              <span className="block bg-gradient-to-r from-apple-accent to-apple-accent-light bg-clip-text text-transparent">
                On-Demand
              </span>
            </h1>
            <p className="text-base sm:text-xl lg:text-2xl text-apple-text-secondary mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed font-light px-4">
              Skip the parking hassle. Our verified Parkers hold premium spots in their cars, 
              delivering luxury valet service at the touch of a button.
            </p>
            
            {/* Collin County Launch Notice */}
            <div className="apple-card-strong rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto mb-8 sm:mb-12 lg:mb-16">
              <div className="flex items-center justify-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-apple-accent font-semibold text-sm sm:text-lg">NOW LIVE</span>
              </div>
              <h3 className="text-lg sm:text-2xl font-bold text-apple-text mb-2 sm:mb-3">Collin County Pilot Launch</h3>
              <p className="text-sm sm:text-base text-apple-text-secondary">
                Experience the future of parking in Plano, Frisco, McKinney, Allen, and surrounding areas. 
                Real Parkers, real jobs, competitive pay.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 lg:gap-8 justify-center items-center mb-12 sm:mb-16 lg:mb-20 px-4">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto apple-button-primary apple-interactive flex items-center justify-center space-x-2 sm:space-x-3 text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6"
            >
              <span>Experience Parkr</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
            <button 
              onClick={() => navigate('/auth')}
              className="w-full sm:w-auto apple-button-secondary apple-interactive text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-6 flex items-center justify-center space-x-2 sm:space-x-3"
            >
              <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />
              <span>Earn $20-35/Hour</span>
            </button>
          </div>
          
          {/* Floating Hero Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-5xl mx-auto px-4">
            {[
              { icon: <Car className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Instant Valet", desc: "Premium parking delivered to you" },
              { icon: <Shield className="w-6 h-6 sm:w-8 sm:h-8" />, title: "Verified Parkers", desc: "Background-checked professionals" },
              { icon: <Star className="w-6 h-6 sm:w-8 sm:h-8" />, title: "5-Star Service", desc: "Consistently rated excellence" }
            ].map((item, index) => (
              <div 
                key={index}
                className="apple-card apple-floating animate-apple-float p-4 sm:p-6"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-apple-accent mb-3 sm:mb-4 flex justify-center">{item.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold text-apple-text mb-1 sm:mb-2">{item.title}</h3>
                <p className="text-sm sm:text-base text-apple-text-secondary">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-apple-text">Why Choose Parkr?</h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-apple-text-secondary font-light px-4">Premium parking experience, powered by real people</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 px-4">
            {[
              {
                icon: <MapPin className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: "Prime Locations",
                description: "Downtown Dallas, Legacy Plano, and premium districts across DFW"
              },
              {
                icon: <Clock className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: "Instant Booking",
                description: "Reserve your spot in seconds, with real-time availability"
              },
              {
                icon: <Shield className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: "Verified Parkers",
                description: "All Parkers are vetted with 4.5+ star ratings and insurance coverage"
              },
              {
                icon: <Smartphone className="w-8 h-8 sm:w-10 sm:h-10" />,
                title: "Seamless Experience",
                description: "Turn-by-turn navigation and contactless handoff via our app"
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`apple-card apple-floating transition-all duration-700 p-4 sm:p-6 lg:p-8 text-center space-y-4 sm:space-y-6 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                <div className="text-apple-accent mb-4 sm:mb-6 p-3 sm:p-4 apple-glass-subtle rounded-xl sm:rounded-2xl w-fit mx-auto">
                  {feature.icon}
                </div>
                <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold mb-2 sm:mb-4 text-apple-text">{feature.title}</h3>
                <p className="text-sm sm:text-base lg:text-lg text-apple-text-secondary leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="apple-card-strong rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-12 lg:p-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 text-center">
              {[
                { number: "500+", label: "Verified Parkers", icon: <Users className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" /> },
                { number: "$18", label: "Average Savings", icon: <DollarSign className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" /> },
                { number: "4.9★", label: "User Rating", icon: <Star className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" /> }
              ].map((stat, index) => (
                <div key={index} className="space-y-4 sm:space-y-6 apple-floating">
                  <div className="text-apple-accent flex justify-center p-4 sm:p-5 lg:p-6 apple-glass-subtle rounded-2xl sm:rounded-3xl w-fit mx-auto">
                    {stat.icon}
                  </div>
                  <div className="text-3xl sm:text-4xl lg:text-6xl font-bold text-apple-text">{stat.number}</div>
                  <div className="text-lg sm:text-xl lg:text-2xl text-apple-text-secondary font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16 lg:mb-20">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 text-apple-text">How Parkr Works</h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-apple-text-secondary font-light px-4">Three simple steps to premium parking</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-12 lg:gap-16 px-4">
            {[
              {
                step: "1",
                title: "Find & Reserve",
                description: "Browse real-time availability on the map. Select your ideal spot and duration.",
                icon: <MapPin className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
              },
              {
                step: "2",
                title: "Navigate & Meet",
                description: "Follow GPS directions to your Parker. They'll be waiting in their car at your reserved spot.",
                icon: <Car className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
              },
              {
                step: "3",
                title: "Park & Go",
                description: "Quick contactless handoff. Your Parker drives away, you're perfectly parked.",
                icon: <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14" />
              }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4 sm:space-y-6 lg:space-y-8 apple-floating lg:col-span-1">
                <div className="relative">
                  <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 apple-glass-strong rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 shadow-apple">
                    <div className="text-apple-accent">{step.icon}</div>
                  </div>
                  <div className="absolute -top-2 -right-4 sm:-top-3 sm:-right-6 lg:-right-8 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 apple-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-lg lg:text-xl shadow-apple">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-apple-text">{step.title}</h3>
                <p className="text-sm sm:text-lg lg:text-xl text-apple-text-secondary leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-4 sm:px-6 py-12 sm:py-20 lg:py-32">
        <div className="max-w-5xl mx-auto">
          <div className="apple-card-strong rounded-2xl sm:rounded-3xl lg:rounded-4xl p-6 sm:p-12 lg:p-16 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-4 sm:mb-6 lg:mb-8 text-apple-text">Ready to Skip the Parking Stress?</h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-apple-text-secondary mb-8 sm:mb-12 lg:mb-16 font-light max-w-3xl mx-auto px-4">
              Join thousands of satisfied customers who've discovered the future of urban parking
            </p>
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto apple-button-primary apple-interactive text-lg sm:text-xl lg:text-2xl px-8 sm:px-12 lg:px-16 py-4 sm:py-6 lg:py-8 flex items-center justify-center space-x-2 sm:space-x-3 lg:space-x-4 mx-auto mb-4 sm:mb-6 lg:mb-8"
            >
              <span>Start Your Parkr Experience</span>
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
            </button>
            <p className="text-sm sm:text-base lg:text-lg text-apple-text-tertiary">No credit card required • Instant access to demo</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full px-4 sm:px-6 py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="apple-glass-subtle rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 text-center">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6 lg:mb-8">
              <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 apple-glass rounded-xl sm:rounded-2xl flex items-center justify-center shadow-apple">
                <div className="text-lg sm:text-xl lg:text-2xl font-bold text-apple-accent">P</div>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold text-apple-text">Parkr</div>
            </div>
            <p className="text-sm sm:text-base lg:text-lg text-apple-text-secondary">© 2024 Parkr. Premium valet parking on-demand.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
