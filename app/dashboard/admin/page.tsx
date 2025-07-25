"use client";
import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Calendar, 
  Megaphone, 
  FileText, 
  MapPin, 
  DollarSign, 
  Settings, 
  Users, 
  UserPlus, 
  Bell,
  User,
  ChevronDown,
  Search,
  CreditCard,
  ToggleLeft
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from 'recharts';

// Types
interface ChartDataPoint {
  name: string;
  value: number;
}

interface BookingData {
  id: string;
  startTime: string;
  screens: string;
  impression: string;
  view: string;
  interval: string;
  cost: string;
  status: 'Active' | 'Inactive' | 'Pending';
}

type TabType = 'activity' | 'campaign' | 'bookings';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('campaign');
  
  // Chart data for the line graph
  const chartData: ChartDataPoint[] = [
    { name: '3am', value: 35 },
    { name: '5am', value: 28 },
    { name: '6am', value: 15 },
    { name: '7am', value: 12 },
    { name: '8am', value: 8 },
    { name: '9am', value: 18 },
    { name: '10am', value: 25 },
    { name: '11am', value: 35 },
    { name: '3pm', value: 42 },
    { name: '1pm', value: 38 },
    { name: '2pm', value: 45 },
    { name: '3pm', value: 52 }
  ];

  const bookingsData: BookingData[] = [
    { id: '#155055', startTime: '20 Jan 12:30pm', screens: '02', impression: '03', view: '120', interval: '05', cost: '₹2000/Sec', status: 'Active' },
    { id: '#155055', startTime: '20 Jan 12:30pm', screens: '02', impression: '03', view: '120', interval: '05', cost: '₹2000/Sec', status: 'Active' },
    { id: '#155055', startTime: '20 Jan 12:30pm', screens: '02', impression: '03', view: '120', interval: '05', cost: '₹2000/Sec', status: 'Active' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm border-r border-gray-200">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
              <span className="text-white text-sm font-bold">S</span>
            </div>
            <span className="text-xl font-semibold">SignGaze</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          <div className="px-4 space-y-1">
            <div className="flex items-center space-x-3 px-3 py-2 text-blue-600 bg-blue-50 rounded-lg">
              <LayoutDashboard size={20} />
              <span className="font-medium">Dashboard</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Calendar size={20} />
              <span>My Booking</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <Megaphone size={20} />
              <span>My Campaign</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <FileText size={20} />
              <span>My Ads</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <MapPin size={20} />
              <span>My Listings</span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
              <DollarSign size={20} />
              <span>Finances</span>
            </div>
          </div>

          <div className="mt-8 px-4">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Help</h3>
            <div className="space-y-1">
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Settings size={20} />
                <span>Setting</span>
              </div>
              <div className="flex items-center space-x-3 px-3 py-2 text-gray-600 hover:bg-gray-50 rounded-lg cursor-pointer">
                <Users size={20} />
                <span>Support</span>
              </div>
            </div>
          </div>

          {/* Refer a Friend */}
          <div className="mt-8 mx-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <UserPlus size={20} className="text-gray-600 mt-1" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Refer a friend!</h4>
                <p className="text-xs text-gray-500 mt-1">And get awesome rewards</p>
              </div>
            </div>
            <div className="mt-3">
              <svg width="60" height="40" viewBox="0 0 60 40" className="text-gray-400">
                <path d="M10 30 Q15 25 20 30 T30 30 T40 30 T50 30" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="15" cy="15" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
                <circle cx="35" cy="15" r="8" stroke="currentColor" strokeWidth="2" fill="none"/>
              </svg>
            </div>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-gray-500">Advertiser</span>
              <span className="text-gray-500">Screen Owner</span>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                
                <span className="text-sm">EN</span>
                <ChevronDown size={16} />
              </div>
              <Bell size={20} className="text-gray-600" />
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <User size={16} className="text-blue-600" />
                </div>
                <span className="text-sm font-medium">Sanket</span>
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Stats and Chart */}
            <div className="lg:col-span-2 space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">₹1000.0</p>
                      <p className="text-sm text-gray-500">Total Revenue</p>
                    </div>
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">365</p>
                      <p className="text-sm text-gray-500">Active Campaign</p>
                    </div>
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Megaphone className="text-blue-600" size={20} />
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-bold">48</p>
                      <p className="text-sm text-gray-500">Active Screens</p>
                    </div>
                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                      <FileText className="text-red-600" size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold">Analytics</h3>
                  <div className="bg-black text-white px-3 py-1 rounded text-sm">
                    Friday 68°F
                  </div>
                </div>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis 
                        dataKey="name" 
                        axisLine={false}
                        tickLine={false}
                        tick={{ fontSize: 12, fill: '#6B7280' }}
                      />
                      <YAxis hide />
                      <Line 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#000000" 
                        strokeWidth={2}
                        dot={{ fill: '#000000', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#000000' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Right Column - Credit Card */}
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-semibold mb-4">Available Credit</h3>
                <div className="bg-gradient-to-r from-green-400 to-blue-500 p-6 rounded-lg text-white relative overflow-hidden">
                  <div className="relative z-10">
                    <p className="text-3xl font-bold">₹2,350</p>
                    <p className="text-sm opacity-90 mt-1">Your current balance</p>
                  </div>
                  {/* Credit card illustration */}
                  <div className="absolute top-4 right-4 opacity-20">
                    <CreditCard size={60} />
                  </div>
                  <div className="absolute -bottom-4 -right-4 opacity-10">
                    <div className="w-20 h-20 bg-white rounded-full"></div>
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sales: 50%</span>
                    <span className="text-gray-500">Referrals: 28%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                  </div>
                  <button className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    Add Credit →
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity Table */}
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex space-x-8">
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setActiveTab('activity')}
                  >
                    Recent Activity
                  </button>
                  <button 
                    className={`${activeTab === 'campaign' ? 'text-black border-b-2 border-black' : 'text-gray-500 hover:text-gray-700'} pb-2`}
                    onClick={() => setActiveTab('campaign')}
                  >
                    Campaign
                  </button>
                  <button 
                    className="text-gray-500 hover:text-gray-700"
                    onClick={() => setActiveTab('bookings')}
                  >
                    My Bookings
                  </button>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input 
                      type="text" 
                      placeholder="Search" 
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Last week</span>
                    <ToggleLeft size={20} className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr className="text-left">
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Booking #</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Screens</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Impression</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">View</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Interval</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Cost</th>
                    <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {bookingsData.map((booking: BookingData, index: number) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.startTime}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.screens}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.impression}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.view}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.interval}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{booking.cost}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <div className="w-2 h-2 bg-green-400 rounded-full mr-1"></div>
                          {booking.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;