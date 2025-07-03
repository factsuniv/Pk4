import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import { AuthProvider, useAuth } from './contexts/MockAuthContext'
import { ErrorBoundary } from './components/ErrorBoundary'
import LandingPage from './components/LandingPage'
import Navigation from './components/Navigation'
import CleanSearchView from './components/CleanSearchView'
import BookingFlow from './components/BookingFlow'
import NewBookingFlow from './components/NewBookingFlow'
import JobTracking from './components/JobTracking'
import LiveJobTracking from './components/LiveJobTracking'
import UserProfile from './components/UserProfile'
import ParkerDashboard from './components/ParkerDashboard'
import LiveParkerDashboard from './components/LiveParkerDashboard'
import ParkerJobDashboard from './components/ParkerJobDashboard'
import LiveParkerJobDashboard from './components/LiveParkerJobDashboard'
import ParkerRegistration from './components/ParkerRegistration'
import Auth from './components/Auth'
import { Toaster } from 'react-hot-toast'
import './App.css'

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="h-screen apple-gradient-mesh flex items-center justify-center">
        <div className="text-center">
          <div className="apple-loading mx-auto mb-4" />
          <p className="text-apple-text-secondary text-lg">Loading...</p>
        </div>
      </div>
    )
  }

  if (!currentUser) {
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  return <>{children}</>
}

// App Routes Component
const AppRoutes = () => {
  const { userProfile } = useAuth()

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />
      
      {/* Protected Routes - Role-based main page */}
      <Route path="/app" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            {userProfile?.userType === 'parker' ? (
              <LiveParkerJobDashboard />
            ) : (
              <>
                <Navigation />
                <main className="flex-1 overflow-auto">
                  <CleanSearchView />
                </main>
              </>
            )}
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/app/booking" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <NewBookingFlow />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/app/booking/:spotId" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <NewBookingFlow />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/app/job-tracking/:jobId" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <JobTracking />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/app/profile" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <UserProfile />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Customer-only Routes */}
      <Route path="/app/search" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <CleanSearchView />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      {/* Parker-only Routes */}
      <Route path="/app/parker/jobs" element={
        <ProtectedRoute>
          <LiveParkerJobDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/app/parker/register" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <ParkerRegistration />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="/app/parker/dashboard" element={
        <ProtectedRoute>
          <LiveParkerJobDashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/app/parker" element={
        <ProtectedRoute>
          <LiveParkerJobDashboard />
        </ProtectedRoute>
      } />
      
      {/* Live Job Tracking */}
      <Route path="/app/tracking" element={
        <ProtectedRoute>
          <LiveJobTracking />
        </ProtectedRoute>
      } />
      
      {/* Legacy Routes for backward compatibility */}
      <Route path="/app/booking-legacy" element={
        <ProtectedRoute>
          <div className="flex-1 flex flex-col">
            <Navigation />
            <main className="flex-1 overflow-auto">
              <BookingFlow />
            </main>
          </div>
        </ProtectedRoute>
      } />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  
  useEffect(() => {
    // Simulate app loading
    setTimeout(() => setIsLoaded(true), 800)
  }, [])

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen apple-gradient-mesh">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 apple-glass rounded-3xl mb-6 shadow-apple">
            <div className="text-3xl font-bold text-apple-accent">P</div>
          </div>
          <div className="text-apple-text text-xl font-medium">Loading Parkr Live...</div>
          <div className="mt-4">
            <div className="w-48 h-1 apple-glass rounded-full overflow-hidden">
              <div className="h-full apple-gradient-primary rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppProvider>
          <Router>
            <div className="h-screen flex flex-col bg-white">
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(255, 255, 255, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '16px',
                    color: '#1d1d1f',
                    fontSize: '14px',
                    fontWeight: '500',
                    padding: '12px 16px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#007AFF',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#FF3B30',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              
              <AppRoutes />
            </div>
          </Router>
        </AppProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App
