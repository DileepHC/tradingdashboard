import React, { useState } from 'react';
import { Edit, Trash2, SlidersHorizontal, Download, Users } from 'lucide-react';

/**
 * DemoSubscribers component displays a table of only demo users.
 * Shares similar advanced table functionalities with MainUsers (filtering, sorting, column toggling).
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of demo subscriber data (from mockData.js).
 */
function DemoSubscribers({ data = [] }) {
  // State for filtering text input.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage visibility of individual table columns.
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    phoneEmail: true,
    referralId: true,
    plan: true,
    expiryDate: true,
    remainingDays: true,
    status: true,
    actions: true, // Always show actions column by default
  });
  // State to control the visibility of the column toggle dropdown.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  /**
   * Toggles the sorting direction for a given column key.
   * @param {string} key - The column key to sort by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    // If the same key is clicked again, reverse the direction.
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the data based on current filterText and sortConfig.
   * This is a memoized computation (though not explicitly using useMemo here,
   * it's good practice for performance with large datasets).
   */
  const sortedAndFilteredData = [...data] // Create a shallow copy to avoid mutating original data
    .filter(user =>
      // Check if any string value in the user object includes the filterText (case-insensitive).
      Object.values(user).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      // Apply sorting if a sort key is set.
      if (sortConfig.key) {
        const valA = String(a[sortConfig.key] || '').toLowerCase(); // Handle potential null/undefined values
        const valB = String(b[sortConfig.key] || '').toLowerCase();

        // Compare values based on the sorting direction.
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0; // No change in order if keys are equal or no sort key is set.
    });

  /**
   * Toggles the visibility of a specific table column.
   * @param {string} column - The key of the column to toggle.
   */
  const handleColumnToggle = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column], // Toggle the boolean value for the specified column.
    }));
  };

  /**
   * Placeholder function for exporting data.
   * In a real app, this would trigger client-side data conversion (e.g., to CSV or PDF)
   * and initiate a download.
   * @param {string} format - The desired export format (e.g., 'xls', 'pdf').
   */
  const handleExport = (format) => {
    console.log(`Exporting demo subscribers to ${format}...`);
    // Example: You'd use a library like 'sheetjs' for Excel or 'jspdf' for PDF here.
  };

  /**
   * Placeholder function for editing a demo user.
   * In a real app, this would typically open a modal with user data for editing
   * or navigate to a user details page.
   * @param {object} user - The user object to be edited.
   */
  const handleEdit = (user) => {
    console.log('Edit demo user:', user);
  };

  /**
   * Placeholder function for deleting a demo user.
   * In a real app, this would trigger an API call to delete the user from the backend.
   * @param {string} userId - The ID of the user to be deleted.
   */
  const handleDelete = (userId) => {
    console.log('Delete demo user with ID:', userId);
    // You would likely have a confirmation modal before actual deletion.
  };

  /**
   * Returns the sort icon (▲ for ascending, ▼ for descending) for a given column key.
   * @param {string} key - The column key.
   * @returns {string|null} The sort icon character or null if not sorted by this key.
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null; // No icon if not sorting by this column.
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'; // Add a space for better readability.
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Users className="w-8 h-8 text-warning" /> Demo Subscribers
      </h2>

      {/* Table Controls Section (Filter, Column Toggle, Export) */}
      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Search/Filter Input */}
          <input
            type="text"
            placeholder="Filter demo subscribers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button and Dropdown */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {isColumnToggleOpen && (
              <div className="absolute top-full right-0 mt-2 bg-card-bg border border-border-base rounded-lg shadow-strong z-10 p-4 min-w-[150px]">
                {/* Map over visibleColumns keys to render checkboxes for each column */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggle(colKey)}
                      className="form-checkbox text-primary rounded"
                    />
                    {/* Format column key from camelCase to Title Case (e.g., 'userId' -> 'User Id') */}
                    <span>{colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            )}
            {/* Export Buttons */}
            <button
              onClick={() => handleExport('xls')}
              className="action-button-custom py-2 px-4 bg-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export XLS
            </button>
            <button
              onClick={() => handleExport('pdf')}
              className="action-button-custom py-2 px-4 bg-secondary flex items-center gap-2"
            >
              <Download className="w-5 h-5" /> Export PDF
            </button>
          </div>
        </div>

        {/* Demo Subscribers Table */}
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {visibleColumns.userId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('userId')}>User ID {getSortIcon('userId')}</th>}
              {visibleColumns.tradingViewId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('tradingViewId')}>TradingView ID {getSortIcon('tradingViewId')}</th>}
              {visibleColumns.phoneEmail && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('phoneEmail')}>Phone / Email {getSortIcon('phoneEmail')}</th>}
              {visibleColumns.referralId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralId')}>Referral ID {getSortIcon('referralId')}</th>}
              {visibleColumns.plan && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('plan')}>Plan {getSortIcon('plan')}</th>}
              {visibleColumns.expiryDate && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('expiryDate')}>Expiry Date {getSortIcon('expiryDate')}</th>}
              {visibleColumns.remainingDays && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('remainingDays')}>Remaining Days {getSortIcon('remainingDays')}</th>}
              {visibleColumns.status && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each user row */}
            {sortedAndFilteredData.map((user, index) => (
              <tr key={user.userId || index}>{visibleColumns.userId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.userId}</td>}{visibleColumns.tradingViewId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.tradingViewId}</td>}{visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.phoneEmail}</td>}{visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.referralId || '-'}</td>}{visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.plan}</td>}{visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.expiryDate}</td>}{visibleColumns.remainingDays && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.remainingDays}</td>}{visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-danger-light text-danger'
                  }`}>
                    {user.status}
                  </span>
                </td>}{visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${user.userId}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${user.userId}`}
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                )}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DemoSubscribers;
