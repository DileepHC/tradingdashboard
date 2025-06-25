// App.js
import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import Sidebar from './components/Sidebar.jsx';
import { dashboardData } from './data/mockData.js'; // Import dashboard data

// Import all scene components based on your file structure
import Dashboard from './scenes/dashboard/index.jsx';
import Indicators from './scenes/indicators/index.jsx';
import PricingPlans from './scenes/pricing/index.jsx';
import UsersMain from './scenes/users/MainUsers.jsx';
import UsersPaid from './scenes/users/PaidSubscribers.jsx';
import UsersDemo from './scenes/users/DemoSubscribers.jsx';
import UsersDaily from './scenes/users/DailyPaidDemo.jsx';
import ReferralList from './scenes/referrals/index.jsx';
import Messages from './scenes/messages/index.jsx';
import Payments from './scenes/payments/index.jsx';
import Settings from './scenes/settings/index.jsx';
import AuthControl from './scenes/auth/AuthControl.jsx';
import Logout from './scenes/logout/index.jsx';


function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard'); // Default to 'dashboard'
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

  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard data={dashboardData} />;
      case 'indicators':
        return <Indicators data={dashboardData.indicators} />;
      case 'pricing-plans':
        return <PricingPlans data={dashboardData.pricingPlans} />;
      case 'users':
      case 'users-main': // Default for Users parent, showing Main Users
        return <UsersMain data={dashboardData.users.mainUsers} />;
      case 'users-paid':
        return <UsersPaid data={dashboardData.users.paidSubscribers} />;
      case 'users-demo':
        return <UsersDemo data={dashboardData.users.demoSubscribers} />;
      case 'users-daily':
        return <UsersDaily data={dashboardData.users.dailyNewSubscribers} />;
      case 'referral-list':
        return <ReferralList data={dashboardData.referrals} />;
      case 'messages':
        return <Messages data={dashboardData.messages} />;
      case 'payments':
        return <Payments data={dashboardData.payments} />;
      case 'settings':
        return <Settings data={dashboardData.settings} />;
      case 'auth-control':
        return <AuthControl data={dashboardData.authControl} />;
      case 'logout':
        return <Logout />;
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
