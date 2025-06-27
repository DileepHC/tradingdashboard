import React, { useState } from 'react';
import { Edit, Trash2, SlidersHorizontal, Download, DollarSign } from 'lucide-react';

/**
 * PaidSubscribers component displays a table of only paid users.
 * Shares similar advanced table functionalities with MainUsers.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of paid subscriber data (from mockData.js).
 */
function PaidSubscribers({ data = [] }) {
  // State for the text input used to filter table data.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage the visibility of each table column.
  // By default, all columns are true (visible).
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    phoneEmail: true,
    referralId: true,
    plan: true,
    expiryDate: true,
    remainingDays: true,
    status: true,
    actions: true, // Actions column is typically always visible for admin interfaces
  });
  // State to control the open/close state of the column toggle dropdown.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  /**
   * Toggles the sorting direction for a given column key.
   * If the same column is clicked consecutively, it alternates between ascending and descending.
   * @param {string} key - The data key of the column to sort by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    // If currently sorting by the same key and in ascending order, switch to descending.
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    // Update the sort configuration state.
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the provided 'data' array based on the current 'filterText'
   * and 'sortConfig' states.
   * @returns {Array<object>} The filtered and sorted array of user objects.
   */
  const sortedAndFilteredData = [...data] // Create a shallow copy to prevent direct mutation of props.data
    .filter(user =>
      // Check if any of the user's property values (converted to string)
      // includes the filterText (case-insensitive search).
      Object.values(user).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      // Apply sorting logic only if a 'sortConfig.key' is set.
      if (sortConfig.key) {
        // Get the values for comparison, ensuring they are strings and handling potential null/undefined.
        const valA = String(a[sortConfig.key] || '').toLowerCase();
        const valB = String(b[sortConfig.key] || '').toLowerCase();

        // Perform comparison based on the sorting direction.
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0; // If values are equal or no sorting is applied, maintain original relative order.
    });

  /**
   * Toggles the visibility of a specific column in the table.
   * @param {string} column - The key of the column whose visibility is to be toggled.
   */
  const handleColumnToggle = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column], // Flip the boolean value for the specified column.
    }));
  };

  /**
   * Placeholder function for exporting table data.
   * In a real application, this would involve converting the 'sortedAndFilteredData'
   * to the specified format (e.g., CSV, XLSX, PDF) and triggering a file download.
   * @param {string} format - The desired export format (e.g., 'xls', 'pdf').
   */
  const handleExport = (format) => {
    console.log(`Exporting paid subscribers to ${format}...`);
    // Example: Use a library like 'sheetjs' for Excel or 'jspdf' for PDF generation here.
  };

  /**
   * Placeholder function for editing a user record.
   * In a real application, this would typically open a modal form pre-filled with the user's data
   * or navigate to a dedicated user edit page.
   * @param {object} user - The user object to be edited.
   */
  const handleEdit = (user) => {
    console.log('Edit paid user:', user);
    // You might pass 'user' data to an edit modal component.
  };

  /**
   * Placeholder function for deleting a user record.
   * In a real application, this would send a DELETE request to your backend API
   * and then update the local state to remove the deleted user.
   * A confirmation dialog is usually recommended before actual deletion.
   * @param {string} userId - The unique ID of the user to be deleted.
   */
  const handleDelete = (userId) => {
    console.log('Delete paid user with ID:', userId);
    // Implement API call for deletion here.
  };

  /**
   * Returns a sort icon (▲ for ascending, ▼ for descending) next to the column header
   * if the table is currently sorted by that column.
   * @param {string} key - The data key of the column.
   * @returns {string|null} The sort icon string or null.
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null; // If not sorting by this key, return null.
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'; // Return appropriate icon with a leading space.
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-accent" /> Paid Subscribers
      </h2>

      {/* Table Controls Section: Filter Input, Column Toggle, Export Buttons */}
      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Filter Input */}
          <input
            type="text"
            placeholder="Filter paid subscribers..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
            aria-label="Filter paid subscribers"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="paid-subscribers-column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {/* Column Toggle Dropdown */}
            {isColumnToggleOpen && (
              <div
                id="paid-subscribers-column-toggle-dropdown"
                className="absolute top-full right-0 mt-2 bg-card-bg border border-border-base rounded-lg shadow-strong z-10 p-4 min-w-[150px]"
              >
                {/* Dynamically render checkboxes for each column visibility */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggle(colKey)}
                      className="form-checkbox text-primary rounded"
                    />
                    {/* Convert camelCase key to a more readable Title Case for display */}
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

        {/* Paid Subscribers Table */}
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {/* Conditionally render table headers based on column visibility */}
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
              <tr key={user.userId || index}>{/* Use userId as key for better performance, fallback to index */}
                {visibleColumns.userId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.userId}</td>}
                {visibleColumns.tradingViewId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.tradingViewId}</td>}
                {visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.phoneEmail}</td>}
                {visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.referralId || '-'}</td>}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.plan}</td>}
                {visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.expiryDate}</td>}
                {visibleColumns.remainingDays && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.remainingDays}</td>}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  {/* Apply dynamic styling based on user status (Active/Inactive) */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-danger-light text-danger'
                  }`}>
                    {user.status}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Edit button for user row */}
                    <button
                      onClick={() => handleEdit(user)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${user.userId}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    {/* Delete button for user row */}
                    <button
                      onClick={() => handleDelete(user.userId)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${user.userId}`}
                    >
                      <Trash2 className="w-5 h-5 inline" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PaidSubscribers;
