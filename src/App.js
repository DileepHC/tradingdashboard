import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { LineChart, BarChart, PieChart } from 'lucide-react'; // Example icons for dashboard content

function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Initialize dark mode from localStorage or default to false
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? true : false;
  });

  // Effect to apply/remove dark mode class from html element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Dummy data for charts and tables
  const dashboardData = {
    portfolio: {
      totalValue: '12,345.67',
      cash: '5,678.90',
      equity: '6,666.77',
      performanceChange: '+1.23%',
      performanceTrend: [65, 59, 80, 81, 56, 55, 40, 68, 72, 60, 82, 90], // Dummy data points
      performanceLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    recentActivity: [
      { date: '2024-07-26', action: 'Buy', symbol: 'XYZ', quantity: 10, price: 100.00, value: 1000.00 },
      { date: '2024-07-25', action: 'Sell', symbol: 'ABC', quantity: 5, price: 50.00, value: 250.00 },
      { date: '2024-07-24', action: 'Buy', symbol: 'DEF', quantity: 20, price: 25.00, value: 500.00 },
      { date: '2024-07-23', action: 'Sell', symbol: 'GHI', quantity: 15, price: 75.00, value: 1125.00 },
      { date: '2024-07-22', action: 'Buy', symbol: 'JKL', quantity: 8, price: 125.00, value: 1000.00 },
    ],
    subscribers: {
      total: 1500,
      paid: 800,
      demo: 700,
      dailyPaid: 25,
      dailyDemo: 15,
    },
    referrals: [
      { id: 'REF001', referrer: 'User A', referred: 'User X', status: 'Paid', date: '2024-07-01' },
      { id: 'REF002', referrer: 'User B', referred: 'User Y', status: 'Demo', date: '2024-07-05' },
      { id: 'REF003', referrer: 'User C', referred: 'User Z', status: 'Paid', date: '2024-07-10' },
    ],
    messages: [
      { id: 1, sender: 'System', text: 'Welcome to your trading dashboard!', timestamp: '2024-07-26 10:00 AM' },
      { id: 2, sender: 'Admin', text: 'New feature update released.', timestamp: '2024-07-25 03:00 PM' },
    ],
    payments: [
      { id: 'PAY001', user: 'User X', amount: 99.99, plan: 'Premium', date: '2024-07-20' },
      { id: 'PAY002', user: 'User Y', amount: 49.99, plan: 'Basic', date: '2024-07-15' },
    ]
  };

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return (
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            {/* Portfolio Section */}
            <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
              <LineChart className="w-8 h-8 text-primary" /> Portfolio Overview
            </h2>
            <div className="kpi-cards-custom"> {/* Using custom KPI card grid */}
              <div className="kpi-card-custom"> {/* Using custom KPI card style */}
                <h3>Total Value</h3>
                <div className="kpi-metric-custom">
                  <p className="kpi-value-custom">${dashboardData.portfolio.totalValue}</p>
                  <span className="kpi-trend-custom up">
                    <LineChart className="w-4 h-4 mr-1" /> {dashboardData.portfolio.performanceChange}
                  </span>
                </div>
              </div>
              <div className="kpi-card-custom">
                <h3>Cash</h3>
                <div className="kpi-metric-custom">
                  <p className="kpi-value-custom !text-text-base">${dashboardData.portfolio.cash}</p> {/* Override color for cash */}
                  <span className="kpi-trend-custom down">
                    <LineChart className="w-4 h-4 mr-1 transform rotate-180" /> -0.45%
                  </span>
                </div>
              </div>
              <div className="kpi-card-custom">
                <h3>Equity</h3>
                <div className="kpi-metric-custom">
                  <p className="kpi-value-custom">${dashboardData.portfolio.equity}</p>
                  <span className="kpi-trend-custom up">
                    <LineChart className="w-4 h-4 mr-1" /> +2.34%
                  </span>
                </div>
              </div>
              {/* Additional KPI cards if needed */}
              <div className="kpi-card-custom">
                <h3>Open Positions</h3>
                <div className="kpi-metric-custom">
                  <p className="kpi-value-custom">7</p>
                  <span className="kpi-trend-custom up">
                    <LineChart className="w-4 h-4 mr-1" /> +2
                  </span>
                </div>
              </div>
            </div>

            {/* Performance Chart (Placeholder - would use recharts here) */}
            <div className="kpi-card-custom"> {/* Reusing kpi-card-custom for chart card */}
              <h3 className="dashboard-widget-title">Portfolio Performance</h3> {/* Changed from kpi-card-custom to dashboard-widget-title */}
              <div className="flex justify-center items-center h-64 bg-bg-base rounded-lg text-text-light">
                <BarChart className="w-12 h-12 mr-2" /> (Chart Placeholder - Integrate Recharts for real data)
              </div>
            </div>

            {/* Recent Activity Table */}
            <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
              <BarChart className="w-8 h-8 text-primary" /> Recent Activity
            </h2>
            <div className="kpi-card-custom overflow-x-auto"> {/* Reusing kpi-card-custom for table */}
              <table className="min-w-full divide-y divide-border-base">
                <thead className="bg-bg-base">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Action</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Symbol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {dashboardData.recentActivity.map((activity, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.action}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.symbol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{activity.quantity}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">${activity.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">${activity.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'indicators':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-secondary">Indicators Module</h2>
            <p className="text-text-base mt-4">Content for market indicators and analysis tools.</p>
            {/* Example of using a custom card class for a module specific area */}
            <div className="kpi-card-custom mt-6">
                <h3 className="dashboard-widget-title">Market Trends</h3>
                <p className="text-text-base">Real-time market trend indicators will be displayed here.</p>
                <button className="action-button-custom mt-4">Analyze Trends</button>
            </div>
          </div>
        );
      case 'pricing-plans':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-secondary">Pricing Plans Module</h2>
            <p className="text-text-base mt-4">Manage subscription pricing, features, and tiers.</p>
             <div className="kpi-card-custom mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-border-base rounded-lg p-4 bg-bg-card text-text-base">
                    <h4 className="font-semibold text-primary mb-2">Basic Plan</h4>
                    <p>$9.99/month</p>
                    <button className="action-button-custom mt-4">Edit Basic Plan</button>
                </div>
                <div className="border border-border-base rounded-lg p-4 bg-bg-card text-text-base">
                    <h4 className="font-semibold text-primary mb-2">Premium Plan</h4>
                    <p>$49.99/month</p>
                    <button className="action-button-custom mt-4">Edit Premium Plan</button>
                </div>
            </div>
          </div>
        );
      case 'users':
        return (
          <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
              <PieChart className="w-8 h-8 text-primary" /> User Statistics
            </h2>
            <div className="kpi-cards-custom"> {/* Reusing KPI grid */}
              <div className="kpi-card-custom text-center">
                <h3>Total Subscribers</h3>
                <p className="kpi-value-custom">{dashboardData.subscribers.total}</p>
              </div>
              <div className="kpi-card-custom text-center">
                <h3>Paid Subscribers</h3>
                <p className="kpi-value-custom">{dashboardData.subscribers.paid}</p>
              </div>
              <div className="kpi-card-custom text-center">
                <h3>Demo Subscribers</h3>
                <p className="kpi-value-custom">{dashboardData.subscribers.demo}</p>
              </div>
              <div className="kpi-card-custom text-center">
                <h3>Daily New Paid</h3>
                <p className="kpi-value-custom">{dashboardData.subscribers.dailyPaid}</p>
              </div>
            </div>
            {/* User List Table */}
            <div className="kpi-card-custom overflow-x-auto">
              <h3 className="text-xl font-semibold text-secondary mb-4">All Users</h3>
              <table className="min-w-full divide-y divide-border-base">
                <thead className="bg-bg-base">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">User ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {/* Dummy user data */}
                  {Array(5).fill(null).map((_, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">USR00{100 + i}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">user{i}@example.com</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{i % 2 === 0 ? 'Premium' : 'Basic'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{i % 3 === 0 ? 'Active' : 'Inactive'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">2023-01-{(10 + i).toString().padStart(2, '0')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'referral-list':
        return (
          <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-secondary">Referral List</h2>
            <div className="kpi-card-custom overflow-x-auto"> {/* Reusing kpi-card-custom for table */}
              <table className="min-w-full divide-y divide-border-base">
                <thead className="bg-bg-base">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Referral ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Referrer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Referred User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {dashboardData.referrals.map((referral, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.referrer}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.referred}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.status}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-secondary">Messages</h2>
            <div className="kpi-card-custom h-96 overflow-y-auto"> {/* Reusing kpi-card-custom */}
              {dashboardData.messages.map((msg, index) => (
                <div key={index} className="mb-4 pb-2 border-b border-border-base last:border-b-0">
                  <p className="text-sm font-semibold text-text-base">{msg.sender} <span className="text-xs font-normal text-text-light ml-2">{msg.timestamp}</span></p>
                  <p className="text-text-base mt-1">{msg.text}</p>
                </div>
              ))}
            </div>
            {/* Simple message input */}
            <div className="flex space-x-4">
              <input
                type="text"
                placeholder="Type new message..."
                className="flex-grow p-3 border border-border-base rounded-lg bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="action-button-custom">Send</button>
            </div>
          </div>
        );
      case 'payments':
        return (
          <div className="p-8 space-y-8">
            <h2 className="text-3xl font-bold text-secondary">Payments</h2>
            <div className="kpi-card-custom overflow-x-auto"> {/* Reusing kpi-card-custom for table */}
              <table className="min-w-full divide-y divide-border-base">
                <thead className="bg-bg-base">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Payment ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-base">
                  {dashboardData.payments.map((payment, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.user}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">${payment.amount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.plan}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-secondary">Settings</h2>
            <p className="text-text-base mt-4">Manage application settings.</p>
             <div className="kpi-card-custom mt-6">
                <h3 className="dashboard-widget-title">General Settings</h3>
                <p className="text-text-base">Configure your dashboard preferences.</p>
                <div className="form-actions-custom"> {/* Using custom form actions class */}
                    <button className="action-button-custom">Save Changes</button>
                    <button className="action-button-custom cancel-button-custom">Cancel</button>
                </div>
            </div>
          </div>
        );
      case 'auth-control':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-secondary">Auth Control (Admin Only)</h2>
            <p className="text-text-base mt-4">User authentication and access management.</p>
             <div className="kpi-card-custom mt-6">
                <h3 className="dashboard-widget-title">Access Control List</h3>
                <p className="text-text-base">Manage user roles and permissions.</p>
                <button className="action-button-custom mt-4">Manage Roles</button>
            </div>
          </div>
        );
      case 'logout':
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-secondary">Logging Out...</h2>
            <p className="text-text-base mt-4">You will be redirected shortly.</p>
          </div>
        );
      default:
        return (
          <div className="p-8">
            <h2 className="text-3xl font-bold text-secondary">Welcome</h2>
            <p className="text-text-base mt-4">Select a module from the sidebar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-bg-base transition-colors duration-300">
      <Sidebar isCollapsed={isSidebarCollapsed} setActiveModule={setActiveModule} activeModule={activeModule} />
      <div className="flex flex-col flex-1 overflow-y-auto">
        <Header
          isSidebarCollapsed={isSidebarCollapsed}
          setIsSidebarCollapsed={setIsSidebarCollapsed}
          isDarkMode={isDarkMode}
          setIsDarkMode={setIsDarkMode}
          userName="John Doe"
          userAvatar="https://placehold.co/40x40/random/white?text=JD"
        />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
