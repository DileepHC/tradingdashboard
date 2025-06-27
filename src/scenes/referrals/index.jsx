import React, { useState } from 'react';
import { Filter, SlidersHorizontal, Download, Trash2, Link } from 'lucide-react';

/**
 * ReferralList component displays a table of all referral IDs and associated data.
 * Features advanced table functionalities like filter, sort, column toggle, and export.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of referral data (from mockData.js).
 */
function ReferralList({ data = [] }) {
  // State for the text input used to filter table data.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage the visibility of each table column.
  // By default, all columns are true (visible).
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    referrer: true,
    countOfReferrals: true,
    commissionEarned: true,
    referralStatus: true,
    actions: true, // Actions column is typically always visible
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
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the provided 'data' array based on the current 'filterText'
   * and 'sortConfig' states.
   * @returns {Array<object>} The filtered and sorted array of referral objects.
   */
  const sortedAndFilteredData = [...data] // Create a shallow copy to prevent direct mutation of props.data
    .filter(referral =>
      // Check if any of the referral's property values (converted to string)
      // includes the filterText (case-insensitive search).
      Object.values(referral).some(val =>
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
    console.log(`Exporting referrals to ${format}...`);
    // Example: Use a library like 'sheetjs' for Excel or 'jspdf' for PDF generation here.
  };

  /**
   * Placeholder function for deleting a referral record.
   * In a real application, this would send a DELETE request to your backend API
   * and then update the local state to remove the deleted referral.
   * A confirmation dialog is usually recommended before actual deletion.
   * @param {string} referralId - The unique ID of the referral to be deleted.
   */
  const handleDelete = (referralId) => {
    console.log('Delete referral with ID:', referralId);
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
        <Link className="w-8 h-8 text-primary" /> Referral List
      </h2>

      {/* Table Controls Section: Filter Input, Column Toggle, Export Buttons */}
      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Filter Input */}
          <input
            type="text"
            placeholder="Filter referrals..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
            aria-label="Filter referrals"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="referral-list-column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {/* Column Toggle Dropdown */}
            {isColumnToggleOpen && (
              <div
                id="referral-list-column-toggle-dropdown"
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

        {/* Referral List Table */}
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {/* Conditionally render table headers based on column visibility */}
              {visibleColumns.id && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('id')}>Referral ID {getSortIcon('id')}</th>}
              {visibleColumns.referrer && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referrer')}>Referrer Name {getSortIcon('referrer')}</th>}
              {visibleColumns.countOfReferrals && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('countOfReferrals')}>Count of Referrals {getSortIcon('countOfReferrals')}</th>}
              {visibleColumns.commissionEarned && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('commissionEarned')}>Commission Earned {getSortIcon('commissionEarned')}</th>}
              {visibleColumns.referralStatus && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralStatus')}>Status {getSortIcon('referralStatus')}</th>}
              {visibleColumns.actions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each referral row */}
            {sortedAndFilteredData.map((referral, index) => (
              <tr key={referral.id || index}>{/* Use id as key for better performance, fallback to index */}
                {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.id}</td>}
                {visibleColumns.referrer && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.referrer}</td>}
                {visibleColumns.countOfReferrals && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.countOfReferrals}</td>}
                {visibleColumns.commissionEarned && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{referral.commissionEarned}</td>}
                {visibleColumns.referralStatus && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  {/* Apply dynamic styling based on referral status */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    referral.referralStatus === 'Active' ? 'bg-accent-light text-accent' : (referral.referralStatus === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger')
                  }`}>
                    {referral.referralStatus}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Delete button for referral row */}
                    <button
                      onClick={() => handleDelete(referral.id)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${referral.id}`}
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

export default ReferralList;
