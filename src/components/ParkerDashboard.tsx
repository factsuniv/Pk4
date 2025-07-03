import { useState } from 'react'
import { 
  DollarSign,
  TrendingUp,
  Clock,
  Star,
  Users,
  MapPin,
  Car,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  Plus
} from 'lucide-react'

const ParkerDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [isAvailable, setIsAvailable] = useState(false)

  const parkerStats = {
    totalEarnings: 1247,
    thisMonth: 342,
    totalRides: 89,
    rating: 4.9,
    completionRate: 98
  }

  const recentBookings = [
    {
      id: 'BK001',
      customer: 'Alex J.',
      location: 'Main Street Financial',
      time: '08:30 AM',
      duration: '2h',
      amount: 22,
      status: 'completed',
      rating: 5
    },
    {
      id: 'BK002',
      customer: 'Sarah M.',
      location: 'Legacy West',
      time: '06:45 PM',
      duration: '3h',
      amount: 18,
      status: 'active',
      rating: null
    },
    {
      id: 'BK003',
      customer: 'Mike R.',
      location: 'Commerce Plaza',
      time: '07:15 AM',
      duration: '2.5h',
      amount: 20,
      status: 'upcoming',
      rating: null
    }
  ]

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <TrendingUp className="w-5 h-5" /> },
    { id: 'bookings', label: 'Bookings', icon: <Calendar className="w-5 h-5" /> },
    { id: 'earnings', label: 'Earnings', icon: <DollarSign className="w-5 h-5" /> },
    { id: 'settings', label: 'Settings', icon: <Car className="w-5 h-5" /> },
  ]

  return (
    <div className="h-full bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-24 h-24 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                SP
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Sarah Parker</h1>
                <p className="text-gray-600 text-lg">Premium Parker • Member since 2023</p>
                <div className="flex items-center space-x-6 mt-3">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-yellow-500" />
                    <span className="font-semibold">{parkerStats.rating} Rating</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-blue-500" />
                    <span className="font-semibold">{parkerStats.totalRides} Customers Served</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-semibold">{parkerStats.completionRate}% Completion</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-right space-y-4">
              <div>
                <div className="text-sm text-gray-500">Total Earnings</div>
                <div className="text-3xl font-bold text-green-600">${parkerStats.totalEarnings}</div>
              </div>
              
              <div className="flex items-center space-x-3">
                <span className={`text-sm font-medium ${isAvailable ? 'text-green-600' : 'text-gray-500'}`}>
                  {isAvailable ? 'Available' : 'Offline'}
                </span>
                <button
                  onClick={() => setIsAvailable(!isAvailable)}
                  className={`w-14 h-7 rounded-full p-1 transition-colors ${
                    isAvailable ? 'bg-green-600' : 'bg-gray-300'
                  }`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full transition-transform ${
                    isAvailable ? 'translate-x-7' : 'translate-x-0'
                  }`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">This Month</div>
                <div className="text-2xl font-bold text-gray-900">${parkerStats.thisMonth}</div>
              </div>
            </div>
            <div className="text-sm text-green-600 font-medium">+23% from last month</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Hours This Week</div>
                <div className="text-2xl font-bold text-gray-900">27</div>
              </div>
            </div>
            <div className="text-sm text-blue-600 font-medium">8 active bookings</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Average Rating</div>
                <div className="text-2xl font-bold text-gray-900">{parkerStats.rating}</div>
              </div>
            </div>
            <div className="text-sm text-yellow-600 font-medium">Top 5% of Parkers</div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-sm text-gray-500">Weekly Goal</div>
                <div className="text-2xl font-bold text-gray-900">85%</div>
              </div>
            </div>
            <div className="text-sm text-purple-600 font-medium">$50 bonus pending</div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
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
                {/* Quick Actions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors text-center">
                      <Plus className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="font-medium text-gray-600">Set Available Hours</div>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors text-center">
                      <MapPin className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="font-medium text-gray-600">Update Location</div>
                    </button>
                    <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors text-center">
                      <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      <div className="font-medium text-gray-600">Adjust Pricing</div>
                    </button>
                  </div>
                </div>

                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="space-y-4">
                    {recentBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.customer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{booking.customer}</h4>
                            <p className="text-sm text-gray-600">{booking.location} • {booking.time}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <div className="font-semibold">${booking.amount}</div>
                            <div className="text-sm text-gray-500">{booking.duration}</div>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'completed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'active' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {booking.status.toUpperCase()}
                          </div>
                          {booking.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 text-yellow-500" />
                              <span className="text-sm font-medium">{booking.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Achievement System */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Achievements & Bonuses</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <Award className="w-6 h-6 text-yellow-600" />
                        <span className="font-semibold text-yellow-800">Perfect Rating Streak</span>
                      </div>
                      <p className="text-sm text-yellow-700">15 consecutive 5-star ratings</p>
                      <div className="text-lg font-bold text-yellow-800 mt-2">+$25 Bonus Earned</div>
                    </div>
                    <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-2">
                        <TrendingUp className="w-6 h-6 text-green-600" />
                        <span className="font-semibold text-green-800">Peak Hour Champion</span>
                      </div>
                      <p className="text-sm text-green-700">Available during all peak hours this week</p>
                      <div className="text-lg font-bold text-green-800 mt-2">+$15 Bonus Earned</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">All Bookings</h3>
                  <div className="flex space-x-2">
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Completed</option>
                      <option>Upcoming</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-300 rounded-lg">
                      <option>Last 30 Days</option>
                      <option>Last 7 Days</option>
                      <option>This Month</option>
                    </select>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                            {booking.customer.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{booking.customer}</h4>
                            <p className="text-gray-600">Booking #{booking.id}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-lg">${booking.amount}</div>
                          <div className={`text-sm font-medium ${
                            booking.status === 'completed' ? 'text-green-600' :
                            booking.status === 'active' ? 'text-blue-600' :
                            'text-yellow-600'
                          }`}>
                            {booking.status.toUpperCase()}
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Location:</span>
                          <div className="font-medium">{booking.location}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Time:</span>
                          <div className="font-medium">{booking.time}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <div className="font-medium">{booking.duration}</div>
                        </div>
                      </div>
                      {booking.rating && (
                        <div className="mt-4 flex items-center space-x-2">
                          <span className="text-sm text-gray-500">Customer Rating:</span>
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < booking.rating! ? 'text-yellow-500' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Earnings Tab */}
            {activeTab === 'earnings' && (
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Total Earnings</h3>
                    <div className="text-3xl font-bold text-green-600">${parkerStats.totalEarnings}</div>
                    <div className="text-sm text-green-700 mt-2">All time</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">This Month</h3>
                    <div className="text-3xl font-bold text-blue-600">${parkerStats.thisMonth}</div>
                    <div className="text-sm text-blue-700 mt-2">+23% vs last month</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6">
                    <h3 className="font-semibold text-gray-900 mb-4">Average per Hour</h3>
                    <div className="text-3xl font-bold text-purple-600">$12.80</div>
                    <div className="text-sm text-purple-700 mt-2">Above average</div>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Payout Schedule</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                      <div>
                        <div className="font-medium text-green-800">Next Payout</div>
                        <div className="text-sm text-green-600">Monday, January 29th</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">$127.50</div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p>• Payments are processed weekly on Mondays</p>
                      <p>• Funds typically arrive within 1-2 business days</p>
                      <p>• You can update your payment method in Settings</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Vehicle Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Make & Model</label>
                      <input
                        type="text"
                        value="Tesla Model 3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">License Plate</label>
                      <input
                        type="text"
                        value="PKR-2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                      <input
                        type="text"
                        value="Pearl White"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                      <input
                        type="text"
                        value="2023"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Availability Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Default Hourly Rate</label>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-500">$</span>
                        <input
                          type="number"
                          value="18"
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg"
                        />
                        <span className="text-gray-500">per hour</span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Locations</label>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked className="rounded" />
                          <span>Downtown Dallas</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" checked className="rounded" />
                          <span>Legacy/Plano</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input type="checkbox" className="rounded" />
                          <span>Deep Ellum</span>
                        </label>
                      </div>
                    </div>
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

export default ParkerDashboard
