import { useState } from 'react'
import { useApp } from '../contexts/AppContext'
import { 
  User,
  Star,
  Clock,
  MapPin,
  Calendar,
  CreditCard,
  Settings,
  Bell,
  Shield,
  Award,
  TrendingUp,
  Car
} from 'lucide-react'

const UserProfile = () => {
  const { state } = useApp()
  const [activeTab, setActiveTab] = useState('overview')

  const mockBookingHistory = [
    {
      id: 'BK001',
      location: 'Main Street Financial District',
      date: '2024-01-15',
      time: '08:00 - 10:00',
      price: 18,
      status: 'completed',
      parker: 'Sarah M.',
      rating: 5
    },
    {
      id: 'BK002',
      location: 'Legacy West Main Entrance',
      date: '2024-01-12',
      time: '18:30 - 22:30',
      price: 16,
      status: 'completed',
      parker: 'Michael R.',
      rating: 5
    },
    {
      id: 'BK003',
      location: 'Commerce Street Plaza',
      date: '2024-01-10',
      time: '07:30 - 09:30',
      price: 15,
      status: 'completed',
      parker: 'Jennifer L.',
      rating: 4
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <User className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'payment', label: 'Payment', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className="h-full bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center space-x-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              AJ
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">Alex Johnson</h1>
              <p className="text-gray-600 text-lg">Premium Member since 2024</p>
              <div className="flex items-center space-x-6 mt-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-500" />
                  <span className="font-semibold">4.8 Rating</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                  <span className="font-semibold">47 Bookings</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-purple-500" />
                  <span className="font-semibold">Premium Member</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">Total Savings</div>
              <div className="text-2xl font-bold text-green-600">$847</div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          <div className="p-8">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">This Month</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Bookings</span>
                        <span className="font-semibold">12</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Spent</span>
                        <span className="font-semibold">$216</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Saved</span>
                        <span className="font-semibold text-green-600">$89</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Achievements</h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Star className="w-4 h-4 text-yellow-500" />
                        <span className="text-sm">5-Star Streak</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm">Regular User</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-purple-500" />
                        <span className="text-sm">Verified Profile</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900">Favorites</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>Downtown Dallas</div>
                      <div>Legacy West</div>
                      <div>Deep Ellum</div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-4">
                    {mockBookingHistory.slice(0, 3).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                          <Car className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{booking.location}</h4>
                          <p className="text-sm text-gray-600">{booking.date} • {booking.time}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">${booking.price}</div>
                          <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-500" />
                            <span className="text-sm text-gray-600">{booking.rating}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Booking History</h3>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                    Download Report
                  </button>
                </div>
                <div className="space-y-4">
                  {mockBookingHistory.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-gray-900">{booking.location}</h4>
                          <p className="text-gray-600">Booking #{booking.id}</p>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${booking.price}</div>
                          <div className={`text-sm font-medium ${
                            booking.status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                          }`}>
                            {booking.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Date:</span>
                          <div className="font-medium">{booking.date}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <div className="font-medium">{booking.time}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Parker:</span>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{booking.parker}</span>
                            <div className="flex items-center space-x-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span>{booking.rating}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Payment Tab */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <CreditCard className="w-8 h-8 text-gray-400" />
                        <div>
                          <div className="font-medium">•••• •••• •••• 4242</div>
                          <div className="text-sm text-gray-500">Expires 12/25 • Primary</div>
                        </div>
                      </div>
                      <button className="text-blue-600 hover:text-blue-700 font-medium">
                        Edit
                      </button>
                    </div>
                    <button className="w-full border-2 border-dashed border-gray-300 rounded-lg p-4 text-gray-600 hover:border-gray-400 hover:text-gray-700">
                      + Add Payment Method
                    </button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Billing Summary</h3>
                  <div className="bg-gray-50 rounded-lg p-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <div className="text-sm text-gray-500">Total Spent (All Time)</div>
                        <div className="text-2xl font-bold text-gray-900">$1,847</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Average per Booking</div>
                        <div className="text-2xl font-bold text-gray-900">$18.50</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <div className="font-medium">Email Notifications</div>
                        <div className="text-sm text-gray-500">Receive booking confirmations and updates</div>
                      </div>
                      <button className="w-12 h-6 bg-blue-600 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <div className="font-medium">Push Notifications</div>
                        <div className="text-sm text-gray-500">Get notified about parking availability</div>
                      </div>
                      <button className="w-12 h-6 bg-gray-300 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <div>
                        <div className="font-medium">Location Services</div>
                        <div className="text-sm text-gray-500">Allow location access for better recommendations</div>
                      </div>
                      <button className="w-12 h-6 bg-blue-600 rounded-full p-1">
                        <div className="w-4 h-4 bg-white rounded-full ml-auto"></div>
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Privacy & Security</h3>
                  <div className="space-y-3">
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                      Change Password
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                      Two-Factor Authentication
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg">
                      Privacy Settings
                    </button>
                    <button className="w-full text-left p-3 hover:bg-gray-50 rounded-lg text-red-600">
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserProfile
