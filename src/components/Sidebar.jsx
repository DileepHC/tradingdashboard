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
  LogOut,
  Shield,
  ChevronRight,
  ChevronDown,
  // Removed 'User' as it is not used in this component, addressing ESLint warning.
} from 'lucide-react';

/**
 * Sidebar component for the trading dashboard application.
 * Manages navigation, including a collapsible state and a sub-menu for 'Users'.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isCollapsed - Determines if the sidebar is collapsed or expanded.
 * @param {function} props.setActiveModule - Function to set the active module in the main application.
 * @param {string} props.activeModule - The currently active module, used for highlighting menu items.
 */
function Sidebar({ isCollapsed, setActiveModule, activeModule }) {
  // State to control the visibility of the 'Users' sub-menu
  const [isUsersSubMenuOpen, setIsUsersSubMenuOpen] = React.useState(false);

  /**
   * Handles clicks on sidebar menu items.
   * Sets the active module in the main application.
   * Closes the 'Users' sub-menu if a non-user related module is clicked,
   * ensuring that sub-menus don't remain open unnecessarily.
   *
   * @param {string} moduleName - The identifier of the module being clicked.
   */
  const handleModuleClick = (moduleName) => {
    setActiveModule(moduleName);
    // If the clicked module is not 'users' itself AND is not a sub-item of 'users',
    // then close the 'Users' sub-menu to keep the UI clean.
    // The `String(activeModule).startsWith('users-')` check ensures that if we're already
    // in a sub-user module and click another non-user module, the sub-menu closes.
    if (moduleName !== 'users' && !(activeModule && String(activeModule).startsWith('users-'))) {
      setIsUsersSubMenuOpen(false);
    }
  };

  /**
   * Toggles the visibility of the 'Users' sub-menu.
   * This function is called when the 'Users' main menu item is clicked.
   */
  const handleUsersSubMenuToggle = () => {
    setIsUsersSubMenuOpen(!isUsersSubMenuOpen);
  };

  // Define the main menu items for the sidebar.
  // Each item has a name, an icon, and a module identifier that corresponds
  // to the 'activeModule' state in App.js.
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
        { name: 'Main Users', module: 'users-main' }, // Changed from 'All Users' to 'Main Users'
        { name: 'Paid Subscribers', module: 'users-paid' },
        { name: 'Demo Subscribers', module: 'users-demo' },
        { name: 'Daily Paid/Demo', module: 'users-daily' },
      ]
    },
    { name: 'Referral List', icon: ClipboardList, module: 'referrals' },
    { name: 'Messages', icon: Mail, module: 'messages' },
    { name: 'Payments', icon: CreditCard, module: 'payments' },
    // Profile is intentionally NOT here, as it's exclusively in the Header dropdown
  ];

  // Define menu items that appear at the bottom of the sidebar (e.g., settings, logout).
  // These are typically separated for clearer UI organization.
  const bottomMenuItems = [
    { name: 'Settings', icon: Settings, module: 'settings' },
    { name: 'Auth Control', icon: Shield, module: 'auth-control', adminOnly: true }, // 'adminOnly' is a descriptive prop, not functional here
    { name: 'Logout', icon: LogOut, module: 'logout' },
  ];

  return (
    // The 'sidebar-custom' class defines the base styles for the sidebar.
    // The 'sidebar-collapsed' class is conditionally applied to handle the collapsed state,
    // which is styled in index.css to hide text and adjust layout.
    <aside className={`sidebar-custom ${isCollapsed ? 'sidebar-collapsed' : ''}`}>
      {/* Company Logo section. The 'sidebar-header-top' class ensures consistent height
          and vertical alignment with the main header. */}
      <div className="sidebar-header-top">
        <img
          src="/assets/Company logo.jpg" // Path to your company logo as per project structure
          alt="Company Logo"
          className="max-h-full w-auto object-contain" // Ensures the image scales within its container
          // Fallback if the image fails to load, displaying a placeholder
          onError={(e) => { e.target.onerror = null; e.target.src="https://placehold.co/150x70/gray/white?text=Logo"; }}
        />
      </div>

      {/* Main Navigation Menu section.
          'flex-1' allows it to take available vertical space.
          'overflow-y-auto' enables vertical scrolling if content exceeds height.
          'custom-scrollbar' and 'sidebar-menu-custom' apply custom scrollbar and menu item styles. */}
      <nav className="flex-1 overflow-y-auto custom-scrollbar sidebar-menu-custom">
        <ul>
          {menuItems.map((item) => (
            // Using React.Fragment to group list item and its sub-menu without adding extra DOM nodes
            <React.Fragment key={item.module}>
              <li>
                <button
                  // On click, either toggle the sub-menu (for 'Users') or set the active module
                  onClick={() => item.module === 'users' ? handleUsersSubMenuToggle() : handleModuleClick(item.module)}
                  // Dynamically apply 'active' class for styling.
                  // An item is 'active' if its module matches 'activeModule', OR
                  // if it's a parent with a sub-menu ('Users') AND any of its sub-modules are active.
                  className={`sidebar-menu-item-custom ${activeModule === item.module || (item.hasSubMenu && activeModule && String(activeModule).startsWith('users-')) ? 'active' : ''}`}
                >
                  {/* Render the icon for the menu item. 'w-5 h-5' sets a consistent size. */}
                  <item.icon className={`w-5 h-5`} />
                  {/* Render the menu item text only if the sidebar is not collapsed. */}
                  {!isCollapsed && <span className="flex-1 menu-text-custom">{item.name}</span>}
                  {/* Render sub-menu toggle icon (ChevronDown/ChevronRight) if it has a sub-menu
                      and the sidebar is not collapsed. 'ml-auto' pushes it to the right. */}
                  {item.hasSubMenu && !isCollapsed && (
                    isUsersSubMenuOpen ? (
                      <ChevronDown className="w-4 h-4 ml-auto" /> // Down arrow if sub-menu is open
                    ) : (
                      <ChevronRight className="w-4 h-4 ml-auto" /> // Right arrow if sub-menu is closed
                    )
                  )}
                </button>
              </li>
              {/* Conditionally render the sub-menu if it exists, is open, and sidebar is not collapsed */}
              {item.hasSubMenu && isUsersSubMenuOpen && !isCollapsed && (
                <ul className="ml-8 mt-1 space-y-1 border-l border-border-base"> {/* Indented sub-menu with left border */}
                  {item.subMenu.map((subItem) => (
                    <li key={subItem.module}>
                      <button
                        onClick={() => handleModuleClick(subItem.module)}
                        // Apply active state for the individual sub-menu item.
                        className={`flex items-center w-full py-2 px-4 rounded-lg text-left text-sm
                          hover:bg-bg-base transition-colors duration-200
                          ${activeModule === subItem.module ? 'bg-primary text-white' : 'text-text-base'}`}
                      >
                        {/* Material Symbols icon for sub-items. 'text-xs mr-3' for small size and spacing. */}
                        <span className="material-symbols-outlined text-xs mr-3">arrow_right</span>
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

      {/* Bottom Navigation Menu (Settings, Logout) section.
          'mt-auto' pushes it to the bottom, 'pt-4 border-t' adds a separator. */}
      <nav className="mt-auto pt-4 border-t border-border-base">
        <ul>
          {bottomMenuItems.map((item) => (
            <li key={item.module}>
              <button
                onClick={() => handleModuleClick(item.module)}
                className={`sidebar-menu-item-custom ${activeModule === item.module ? 'active' : ''}`}
              >
                {/* Icon for bottom menu items. */}
                <item.icon className={`w-5 h-5`} />
                {/* Text for bottom menu items, hidden if collapsed. */}
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
