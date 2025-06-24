import React, { useState } from 'react';
import { Menu, Search, Bot, Bell, Sun, Moon, User, ChevronDown, LogOut, Settings } from 'lucide-react';

function Header({ isSidebarCollapsed, setIsSidebarCollapsed, isDarkMode, setIsDarkMode, userName, userAvatar }) {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

  // Toggle sidebar
  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  // Toggle notifications dropdown
  const handleNotificationsToggle = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    setIsProfileDropdownOpen(false); // Close other dropdowns
  };

  // Toggle profile dropdown
  const handleProfileToggle = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    setIsNotificationsOpen(false); // Close other dropdowns
  };

  // Toggle dark/light mode
  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
  };

  // Placeholder functions for profile dropdown actions
  const handleProfileClick = () => {
    console.log('Profile clicked');
    setIsProfileDropdownOpen(false);
    // In a real app, you'd navigate to a profile page or open a modal
  };

  const handleSettingsClick = () => {
    console.log('Settings clicked');
    setIsProfileDropdownOpen(false);
    // In a real app, you'd navigate to a settings page or open a modal
  };

  const handleLogoutClick = () => {
    console.log('Logout clicked');
    setIsProfileDropdownOpen(false);
    // In a real app, you'd handle authentication logout
  };

  return (
    <header className="dashboard-header-custom"> {/* Using custom header class */}
      {/* Left section: Menu Icon and Page Title */}
      <div className="flex items-center space-x-4">
        <button
          onClick={handleSidebarToggle}
          // Using custom menu icon style
          className="menu-icon-custom"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-6 h-6" />
        </button>
        {/* Removed the dashboard title */}
      </div>

      {/* Middle section: Search Bar */}
      <div className="searchbar-custom"> {/* Using custom searchbar style */}
        <input
          type="text"
          placeholder="Search anything..."
          // Tailwind's focus styles are good, no need for custom here unless overridden
        />
        <Search className="search-icon" /> {/* Search icon in custom searchbar */}
      </div>

      {/* Right section: Action Icons and User Profile */}
      <div className="flex items-center space-x-4">
        {/* AI Assistant */}
        <button
          // Using custom action icon style
          className="header-action-icon-custom"
          aria-label="AI Assistant"
          onClick={() => console.log('AI Assistant clicked')} // Placeholder for AI Assistant Modal
        >
          <Bot className="w-6 h-6" />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={handleThemeToggle}
          // Using custom action icon style
          className="header-action-icon-custom"
          aria-label="Toggle dark/light mode"
        >
          {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={handleNotificationsToggle}
            // Using custom action icon style
            className="header-action-icon-custom"
            aria-label="Notifications"
          >
            <Bell className="w-6 h-6" />
            <span className="notification-badge-custom">3</span> {/* Using custom badge style */}
          </button>
          {isNotificationsOpen && (
            <div className="notification-dropdown-custom active"> {/* Using custom dropdown style */}
              <h4>Recent Notifications</h4>
              <ul className="custom-scrollbar"> {/* Applying custom scrollbar to dropdown content */}
                <li>
                    <span className="material-symbols-outlined text-warning mr-2">warning</span> Market volatility expected today.
                </li>
                <li>
                    <span className="material-symbols-outlined text-accent mr-2">check_circle</span> Your withdrawal is complete.
                </li>
                <li>
                    <span className="material-symbols-outlined text-danger mr-2">error</span> Account login attempt from new device.
                </li>
              </ul>
              <button className="view-all-notifications-custom">View All</button> {/* Using custom button style */}
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={handleProfileToggle}
            className="flex items-center space-x-2 p-1 rounded-full hover:bg-bg-base transition-colors duration-300"
            aria-label="User profile menu"
          >
            <img src="/assets/John.jpg" alt="User Avatar" className="user-avatar-custom" /> {/* Using custom avatar style */}
            <span className="text-secondary font-medium hidden md:block">{userName}</span>
            <ChevronDown className="w-4 h-4 text-text-light" />
          </button>
          {isProfileDropdownOpen && (
            <div className="notification-dropdown-custom active w-48"> {/* Reusing custom dropdown style, adjusting width */}
              <div className="px-4 py-2 text-sm text-secondary border-b border-border-base">
                Logged in as <span className="font-semibold text-text-base">{userName}</span>
              </div>
              <button
                onClick={handleProfileClick}
                className="flex items-center w-full px-4 py-2 text-sm text-text-base hover:bg-bg-base text-left"
              >
                <User className="w-4 h-4 mr-2" /> Profile
              </button>
              <button
                onClick={handleSettingsClick}
                className="flex items-center w-full px-4 py-2 text-sm text-text-base hover:bg-bg-base text-left"
              >
                <Settings className="w-4 h-4 mr-2" /> Settings
              </button>
              <button
                onClick={handleLogoutClick}
                className="flex items-center w-full px-4 py-2 text-sm text-danger hover:bg-bg-base border-t border-border-base text-left"
              >
                <LogOut className="w-4 h-4 mr-2" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
