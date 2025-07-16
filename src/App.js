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

// NEW: Import SignIn and SignUp components
import SignIn from './scenes/auth/SignIn.jsx';
import SignUp from './scenes/auth/SignUp.jsx';


function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  // Set initial activeModule to 'signin'
  const [activeModule, setActiveModule] = useState('signin');
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
    // NEW: Handle signin and signup modules
    if (activeModule === 'signin') {
      return <SignIn setActiveModule={setActiveModule} />;
    }
    if (activeModule === 'signup') {
      return <SignUp setActiveModule={setActiveModule} />;
    }

    // If not signin/signup, render the main dashboard content
    return (
      <>
        {(() => {
          switch (activeModule) {
            case 'dashboard':
              return <Dashboard data={dashboardData} />;
            case 'indicators':
              return <Indicators data={dashboardData.indicators} />;
            case 'pricing-plans':
              return <PricingPlans data={dashboardData.pricingPlans} />;
            case 'users':
            case 'users-main':
              return <UsersMain data={dashboardData.users.mainUsers} />;
            case 'users-paid':
              return <UsersPaid data={dashboardData.users.paidSubscribers} />;
            case 'users-demo':
              return <UsersDemo data={dashboardData.users.demoSubscribers} />;
            case 'users-daily':
              return <UsersDaily data={dashboardData.users.dailyNewSubscribers} />;
            case 'referrals':
              return <ReferralList data={dashboardData.referrals} />;
            case 'messages':
              return <Messages data={dashboardData.messages} />;
            case 'payments':
              return <Payments data={dashboardData.payments} />;
            case 'settings':
              return <Settings data={dashboardData.settings} />;
            case 'auth-control':
              return <AuthControl data={dashboardData.authControl} />;
            case 'profile':
              return <Profile data={dashboardData.userProfile || {}} />;
            case 'logout':
              // The Logout component will handle the redirection to 'signin' internally
              return <Logout setActiveModule={setActiveModule} />;
            default:
              return (
                <div className="p-8">
                  <h2 className="text-3xl font-bold text-secondary">Welcome</h2>
                  <p className="text-text-base mt-4">Select a module from the sidebar.</p>
                </div>
              );
          }
        })()}
      </>
    );
  };

  // Conditionally render the main app structure or just the auth pages
  const renderAppStructure = () => {
    if (activeModule === 'signin' || activeModule === 'signup') {
      return renderContent(); // Only render auth content, no sidebar/header
    } else {
      return (
        <div className="flex h-screen overflow-hidden bg-bg-base transition-colors duration-300">
          <Sidebar isCollapsed={isSidebarCollapsed} setActiveModule={setActiveModule} activeModule={activeModule} />
          <div className="flex flex-col flex-1 overflow-y-auto">
            <Header
              isSidebarCollapsed={isSidebarCollapsed}
              setIsSidebarCollapsed={setIsSidebarCollapsed}
              isDarkMode={mode === 'dark'}
              setIsDarkMode={setIsDarkMode}
              userName="John Doe"
              userAvatar="https://placehold.co/40x40/random/white?text=JD"
              setActiveModule={setActiveModule}
              setIsAiAssistantOpen={setIsAiAssistantOpen}
            />
            <main className="flex-1">
              {renderContent()}
            </main>
          </div>
          {/* Render the AiAssistant modal conditionally */}
          <AiAssistant isOpen={isAiAssistantOpen} onClose={() => setIsAiAssistantOpen(false)} />
        </div>
      );
    }
  };

  return (
    // Wrap the entire application with ThemeProvider and CssBaseline
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Applies baseline CSS and theme-based styling */}
      {renderAppStructure()}
    </ThemeProvider>
  );
}

export default App;
