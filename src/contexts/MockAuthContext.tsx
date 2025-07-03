import React, { createContext, useContext, useEffect, useState } from 'react'
import { mockAuth, MockUser, MockUserProfile } from '../lib/mockAuth'
import toast from 'react-hot-toast'

interface AuthContextType {
  currentUser: MockUser | null
  userProfile: MockUserProfile | null
  loading: boolean
  signup: (email: string, password: string, name: string, userType: 'customer' | 'parker') => Promise<void>
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  updateUserProfile: (data: Partial<MockUserProfile>) => Promise<void>
  updateProfile: (data: Partial<MockUserProfile>) => Promise<void>
  resendVerificationEmail: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser | null>(null)
  const [userProfile, setUserProfile] = useState<MockUserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  const signup = async (email: string, password: string, name: string, userType: 'customer' | 'parker') => {
    try {
      // Create user account
      const { user } = await mockAuth.createUserWithEmailAndPassword(email, password)
      
      // Update display name
      await mockAuth.updateProfile({ displayName: name })
      
      // Send "email verification" (auto-verified for demo)
      await mockAuth.sendEmailVerification()
      
      // Create user profile
      const profile: Omit<MockUserProfile, 'uid' | 'createdAt'> = {
        email: user.email,
        displayName: name,
        userType,
        isEmailVerified: true
      }
      
      await mockAuth.createUserProfile(profile)
      
      // Load the profile
      const newProfile = await mockAuth.getUserProfile(user.uid)
      setUserProfile(newProfile)
      
      toast.success('Account created successfully! You can start using the platform immediately.')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      await mockAuth.signInWithEmailAndPassword(email, password)
      toast.success('Welcome back!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    }
  }

  const logout = async () => {
    try {
      await mockAuth.signOut()
      setUserProfile(null)
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error('Failed to sign out')
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<MockUserProfile>) => {
    if (!currentUser || !userProfile) return
    
    try {
      await mockAuth.updateUserProfile(currentUser.uid, data)
      const updatedProfile = await mockAuth.getUserProfile(currentUser.uid)
      setUserProfile(updatedProfile)
      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error('Failed to update profile')
      throw error
    }
  }

  const resendVerificationEmail = async () => {
    if (!currentUser) return
    
    try {
      await mockAuth.sendEmailVerification()
      toast.success('Verification email sent! (Auto-verified for demo)')
    } catch (error: any) {
      toast.error('Failed to send verification email')
      throw error
    }
  }

  useEffect(() => {
    const unsubscribe = mockAuth.onAuthStateChanged(async (user) => {
      setCurrentUser(user)
      
      if (user) {
        // Load user profile
        try {
          const profile = await mockAuth.getUserProfile(user.uid)
          setUserProfile(profile)
        } catch (error) {
          console.error('Error loading user profile:', error)
        }
      } else {
        setUserProfile(null)
      }
      
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userProfile,
    loading,
    signup,
    login,
    logout,
    updateUserProfile,
    updateProfile: updateUserProfile, // Alias for updateUserProfile
    resendVerificationEmail
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
