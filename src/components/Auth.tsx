import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/MockAuthContext'
import { mockAuth } from '../lib/mockAuth'
import { 
  ArrowLeft,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Car,
  Users,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import toast from 'react-hot-toast'

const Auth = () => {
  const navigate = useNavigate()
  const { signup, login } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [userType, setUserType] = useState<'customer' | 'parker'>('customer')
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await login(formData.email, formData.password)
        navigate('/app')
      } else {
        // Validation for signup
        if (formData.password !== formData.confirmPassword) {
          toast.error('Passwords do not match')
          return
        }
        
        if (formData.password.length < 6) {
          toast.error('Password must be at least 6 characters')
          return
        }
        
        if (!formData.name.trim()) {
          toast.error('Please enter your name')
          return
        }

        await signup(formData.email, formData.password, formData.name, userType)
        
        // Redirect based on user type
        if (userType === 'parker') {
          navigate('/app/parker/register')
        } else {
          navigate('/app')
        }
      }
    } catch (error: any) {
      // Error already handled in auth context
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    // Demo login for testing
    setFormData({
      email: 'demo@parkr.com',
      password: 'demo123',
      confirmPassword: '',
      name: ''
    })
    setIsLogin(true)
  }

  return (
    <div className="h-full apple-gradient-mesh">
      <div className="max-w-2xl mx-auto py-8 px-6">
        {/* Header */}
        <div className="flex items-center space-x-6 mb-8">
          <button
            onClick={() => navigate('/')}
            className="p-4 apple-glass rounded-2xl apple-interactive shadow-apple"
          >
            <ArrowLeft className="w-7 h-7 text-apple-text" />
          </button>
          <div>
            <h1 className="text-4xl font-bold text-apple-text">
              {isLogin ? 'Welcome Back' : 'Join Parkr'}
            </h1>
            <p className="text-apple-text-secondary text-xl">
              {isLogin ? 'Sign in to your account' : 'Create your account and start earning'}
            </p>
          </div>
        </div>

        {/* User Type Selection (Signup only) */}
        {!isLogin && (
          <div className="apple-card-strong rounded-3xl p-8 mb-8">
            <h2 className="text-2xl font-bold text-apple-text mb-6 text-center">I want to...</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <button
                onClick={() => setUserType('customer')}
                className={`p-6 rounded-2xl text-left transition-all apple-interactive ${
                  userType === 'customer'
                    ? 'apple-gradient-primary text-white shadow-apple'
                    : 'apple-glass text-apple-text hover:apple-glass-strong'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Users className="w-8 h-8" />
                  <span className="text-2xl font-bold">Find Parking</span>
                </div>
                <p className="text-sm opacity-90">
                  Book parking spots for restaurants, shopping, events, and more
                </p>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Skip the parking search</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Guaranteed spots</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Premium locations</span>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setUserType('parker')}
                className={`p-6 rounded-2xl text-left transition-all apple-interactive ${
                  userType === 'parker'
                    ? 'apple-gradient-primary text-white shadow-apple'
                    : 'apple-glass text-apple-text hover:apple-glass-strong'
                }`}
              >
                <div className="flex items-center space-x-4 mb-4">
                  <Car className="w-8 h-8" />
                  <span className="text-2xl font-bold">Earn Money</span>
                </div>
                <p className="text-sm opacity-90">
                  Find parking spots for customers and earn $7-8.50 per job
                </p>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">$20-35/hour potential</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Flexible schedule</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm">Quick 5-15 min jobs</span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Auth Form */}
        <div className="apple-card-strong rounded-3xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label className="block text-apple-text font-semibold mb-3 text-lg">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 transform -translate-y-1/2 text-apple-text-secondary w-6 h-6" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="apple-input pl-16 text-lg"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-apple-text font-semibold mb-3 text-lg">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 transform -translate-y-1/2 text-apple-text-secondary w-6 h-6" />
                <input
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="apple-input pl-16 text-lg"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-apple-text font-semibold mb-3 text-lg">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-apple-text-secondary w-6 h-6" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="apple-input pl-16 pr-16 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-apple-text-secondary"
                >
                  {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-apple-text font-semibold mb-3 text-lg">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-5 top-1/2 transform -translate-y-1/2 text-apple-text-secondary w-6 h-6" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    className="apple-input pl-16 text-lg"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full apple-button-primary flex items-center justify-center space-x-3 px-8 py-4 text-xl apple-interactive disabled:opacity-50"
            >
              {loading ? (
                <div className="apple-loading" />
              ) : (
                <>
                  <CheckCircle className="w-6 h-6" />
                  <span>{isLogin ? 'Sign In' : 'Create Account'}</span>
                </>
              )}
            </button>
          </form>

          {!isLogin && (
            <div className="mt-6 p-4 apple-glass-subtle rounded-2xl">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-apple-accent mt-0.5" />
                <div className="text-sm text-apple-text-secondary">
                  <p className="mb-2">
                    By creating an account, you agree to our Terms of Service and Privacy Policy.
                  </p>
                  {userType === 'customer' && (
                    <p>You'll receive email verification and booking confirmations.</p>
                  )}
                  {userType === 'parker' && (
                    <p>You'll be redirected to complete your Parker profile after signup.</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Toggle Auth Mode */}
          <div className="mt-8 text-center">
            <p className="text-apple-text-secondary mb-4">
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({ email: '', password: '', confirmPassword: '', name: '' })
              }}
              className="apple-button-secondary px-6 py-3 apple-interactive"
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>

          {/* Demo Access */}
          <div className="mt-6 pt-6 border-t border-white/20">
            <div className="text-center">
              <p className="text-apple-text-secondary mb-4 text-sm font-semibold">
                Demo Accounts - Click to Try:
              </p>
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="apple-glass-subtle rounded-xl p-3">
                    <h4 className="font-semibold text-apple-text text-sm mb-2">Customer Demo</h4>
                    <button
                      onClick={() => {
                        setFormData({
                          email: 'demo@parkr.com',
                          password: 'demo123',
                          confirmPassword: '',
                          name: ''
                        })
                        setIsLogin(true)
                      }}
                      className="apple-button-secondary px-3 py-2 text-xs apple-interactive w-full"
                    >
                      demo@parkr.com
                    </button>
                  </div>
                  
                  <div className="apple-glass-subtle rounded-xl p-3">
                    <h4 className="font-semibold text-apple-text text-sm mb-2">Parker Demo</h4>
                    <button
                      onClick={() => {
                        setFormData({
                          email: 'parker@parkr.com',
                          password: 'parker123',
                          confirmPassword: '',
                          name: ''
                        })
                        setIsLogin(true)
                      }}
                      className="apple-button-secondary px-3 py-2 text-xs apple-interactive w-full"
                    >
                      parker@parkr.com
                    </button>
                  </div>
                </div>
                
                <p className="text-apple-text-tertiary text-xs">
                  Demo accounts have pre-filled profiles and mock job data for immediate testing
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth