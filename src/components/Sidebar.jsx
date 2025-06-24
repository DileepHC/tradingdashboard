import React from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  DollarSign,
  Users,
  ClipboardList,
  Mail,
  CreditCard,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

function Sidebar({ isCollapsed, setActiveModule, activeModule }) {
  // State to control the visibility of the 'Users' sub-menu
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = React.useState(false);

  /**
   * Handles clicks on sidebar menu items.
   * Sets the active module in the main application.
   * Closes the 'Users' sub-menu if a non-user related module is clicked.
   * @param {string} moduleName - The identifier of the module being clicked.
   */
  const handleModuleClick = (moduleName) => {
    setActiveModule(moduleName);
    // If the clicked module is not 'users' or a sub-item of 'users', close the sub-menu.
    // Ensure activeModule is a string before calling startsWith
    if (moduleName !== 'users' && !(activeModule && String(activeModule).startsWith('users-'))) {
      setIsUsersSubMenuOpen(false);
    }
  };

  /**
   * Toggles the visibility of the 'Users' sub-menu.
   */
  const handleUsersSubMenuToggle = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  // Define the main menu items for the sidebar
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, module: 'dashboard' },
    { name: 'Indicators', icon: TrendingUp, module: 'indicators' },
    { name: 'Pricing Plans', icon: DollarSign, module: 'pricing-plans' },
    {
      name: 'Users',
      icon: Users,
      module: 'users',
      hasSubMenu: true, // Indicates this item has a sub-menu
      subMenu: [ // Sub-menu items for 'Users'
        { name: 'Main Users', module: 'users-main' },
        { name: 'Paid Subscribers', module: 'users-paid' },
        { name: 'Demo Subscribers', module: 'users-demo' },
        { name: 'Daily Paid / Daily Demo', module: 'users-daily' },
      ]
    },
    { name: 'Referral List', icon: ClipboardList, module: 'referral-list' },
    { name: 'Messages', icon: Mail, module: 'messages' },
    { name: 'Payments', icon: CreditCard, module: 'payments' },
  ];

  // Define menu items that appear at the bottom of the sidebar (e.g., settings, logout)
  const bottomMenuItems = [
    { name: 'Settings', icon: Settings, module: 'settings' },
    { name: 'Auth Control', icon: Shield, module: 'auth-control', adminOnly: true }, // Example for admin-only module
    { name: 'Logout', icon: LogOut, module: 'logout' },
  ];

  return (
    // Use 'sidebar-collapsed' class directly as per CSS definition
    <aside className={`sidebar-custom ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Company Logo section - now uses an image and aligns with the header height */}
      <div className="sidebar-header-top"> {/* 'sidebar-header-top' class handles height and alignment */}
        <img
          src="/assets/Company logo.jpg" // Placeholder for your Company Logo
          alt="Company Logo"
          className="max-h-full w-auto object-contain" // Ensures image scales within the div without overflow, maintaining aspect ratio
          // Fallback if image fails to load
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x70/gray/white?text=Logo"; }}
        />
      </div>

      {/* Main Navigation Menu section */}
      {/* Apply custom scrollbar and mobile responsive menu styles */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar sidebar-menu-custom">
        <ul>
          {menuItems.map((item) => (
            <React.Fragment key={item.module}>
              <li>
                <button
                  onClick={() => item.module === 'users' ? handleUsersSubMenuToggle() : handleModuleClick(item.module)}
                  // Dynamically apply 'active' class if the current module is active, or if it's the 'Users' parent
                  // and any 'users-' sub-module is currently active.
                  // Added checks for activeModule to prevent 'startsWith' on undefined.
                  className={`sidebar-menu-item-custom ${activeModule === item.module || (item.hasSubMenu && activeModule && String(activeModule).startsWith('users-')) ? 'active' : ''}`}
                >
                  {/* Render the icon for the menu item */}
                  {/* 'gap' property in CSS now controls spacing, so 'mr-3' is correctly removed */}
                  <item.icon className={`w-5 h-5`} />
                  {/* Render the menu item text only if the sidebar is not collapsed */}
                  {!isCollapsed && <span className="flex-1 menu-text-custom">{item.name}</span>}
                  {/* Render sub-menu toggle icon if it has a sub-menu and is not collapsed */}
                  {item.hasSubMenu && !isCollapsed && (
                    isUsersSubMenuOpen ? (
                      <ChevronDown className="w-4 h-4 ml-auto" /> // Down arrow if sub-menu is open
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" /> // Right arrow if sub-menu is closed
                    )
                  )}
                </button>
              </li>
              {/* Render sub-menu items if it has a sub-menu, is open, and sidebar is not collapsed */}
              {item.hasSubMenu && isUsersSubMenuOpen && !isCollapsed && (
                <ul className="ml-8 mt-1 space-y-1 border-l border-border-base"> {/* Indented sub-menu with left border */}
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.module}>
                      <button
                        onClick={() => handleModuleClick(subItem.module)}
                        // Apply active state for the individual sub-menu item
                        className={`flex items-center w-full py-2 px-4 rounded-lg text-left text-sm
                          hover:bg-bg-base transition-colors duration-200
                          ${activeModule === subItem.module ? 'bg-primary text-white' : 'text-text-base'}`}
                      >
                        {/* Ensure Material Symbols font is loaded in index.html for this icon */}
                        <span className="material-symbols-outlined text-xs mr-3">arrow_right</span> {/* Small arrow icon for sub-items */}
                        {subItem.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </React.Fragment>
          ))}
        </ul>
      </nav>

      {/* Bottom Navigation Menu (Settings, Logout) section */}
      <nav className="mt-auto pt-4 border-t border-border-base"> {/* Separator line and top margin */}
        <ul>
          {bottomMenuItems.map((item) => (
            <li key={item.module}>
              <button
                onClick={() => handleModuleClick(item.module)}
                className={`sidebar-menu-item-custom ${activeModule === item.module ? 'active' : ''}`}
              >
                {/* 'gap' property in CSS now controls spacing, so 'mr-3' is correctly removed */}
                <item.icon className={`w-5 h-5`} />
                {!isCollapsed && <span className="flex-1 menu-text-custom">{item.name}</span>}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;