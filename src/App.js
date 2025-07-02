// src/App.js
import React, { useState, useEffect, useMemo } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material'; // Import Material-UI ThemeProvider and CssBaseline
import { createTheme } from '@mui/material/styles'; // Import createTheme for themeMemo
import { themeSettings } from './theme'; // Corrected: Import your custom theme settings function
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
import Profile from './scenes/profile/index.jsx'; // Corrected import path for Profile component
import AiAssistant from './components/AIAssistant.jsx'; // Corrected import path for AiAssistant component


function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard'); // Default to 'dashboard'
  const [isAiAssistantOpen, setIsAiAssistantOpen] = useState(false); // New state for AI Assistant modal

  // State for Material-UI theme mode: 'light' or 'dark'
  const [mode, setMode] = useState(() => {
    // Initialize mode from localStorage or default to 'dark'
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' ? 'dark' : 'light'; // Ensure it's 'dark' or 'light'
  });

  // Memoize the theme object to prevent unnecessary re-creations
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]); // Use createTheme here

  // Function to set dark/light mode directly, to be passed as setIsDarkMode
  const setIsDarkMode = (isDark) => {
    setMode(isDark ? 'dark' : 'light');
  };

  // Effect to update localStorage AND toggle 'dark' class on html element
  useEffect(() => {
    localStorage.setItem('theme', mode);

    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);


  const renderContent = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard data={dashboardData} />;
      case 'indicators':
        return <Indicators data={dashboardData.indicatorsList} />; // Corrected data prop name
      case 'pricing-plans':
        return <PricingPlans data={dashboardData.pricingPlans} />;
      case 'users':
      case 'users-main': // Default for Users parent, showing Main Users
        return <UsersMain data={dashboardData.users.allUsers} />; // Corrected data prop name
      case 'users-paid':
        return <UsersPaid data={dashboardData.users.paidSubscribers} />;
      case 'users-demo':
        return <UsersDemo data={dashboardData.users.demoSubscribers} />;
      case 'users-daily':
        return <UsersDaily data={dashboardData.users.dailyNewSubscribers} />;
      case 'referrals': // Corrected module name for consistency with Sidebar
        return <ReferralList data={dashboardData.referralList} />; // Corrected data prop name
      case 'messages':
        return <Messages data={dashboardData.messageHistory} />; // Corrected data prop name
      case 'payments':
        return <Payments data={dashboardData.paymentHistory} />; // Corrected data prop name
      case 'settings':
        return <Settings data={dashboardData.appSettings} />; // Corrected data prop name
      case 'auth-control':
        return <AuthControl data={dashboardData.authSettings} />; // Corrected data prop name
      case 'profile': // Added case for Profile
        return <Profile data={dashboardData.userProfile} />; // Pass user profile data
      case 'logout':
        return <Logout />;
      // Removed 'ai-assistant' from switch as it will be a modal
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
    // Wrap the entire application with ThemeProvider and CssBaseline
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies baseline CSS and theme-based styling */}
      {/* The `dark` class on the html element (managed by useEffect)
          will control styles from index.css.
          The CSS variables on the body (managed by CssBaseline)
          will control Material-UI and Nivo styles. */}
      <div className="flex h-screen overflow-hidden bg-bg-base transition-colors duration-300">
        <Sidebar isCollapsed={isSidebarCollapsed} setActiveModule={setActiveModule} activeModule={activeModule} />
        <div className="flex flex-col flex-1 overflow-y-auto">
          <Header
            isSidebarCollapsed={isSidebarCollapsed}
            setIsSidebarCollapsed={setIsSidebarCollapsed}
            isDarkMode={mode === 'dark'} // Pass boolean derived from mode
            setIsDarkMode={setIsDarkMode} // Pass the setIsDarkMode function
            userName="John Doe"
            userAvatar="https://placehold.co/40x40/random/white?text=JD"
            setActiveModule={setActiveModule} // Pass setActiveModule to Header
            setIsAiAssistantOpen={setIsAiAssistantOpen} // Pass the setter for AI Assistant modal
          />
          <main className="flex-1">
            {renderContent()}
          </main>
        </div>
      </div>
      {/* Render the AiAssistant modal conditionally */}
      <AiAssistant isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} />
    </ThemeProvider>
  );
}

export default App;
