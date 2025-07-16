import React, { useState } from 'react';
import { SlidersHorizontal, Download, Trash2, Link, PlusCircle, Edit, X } from 'lucide-react';

/**
 * ReferralList component displays a table of all referral IDs and associated data.
 * Features advanced table functionalities like filter, sort, column toggle, and export.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of referral data (from mockData.js).
 */
function ReferralList({ data = [] }) {
  // State to manage the actual list of referral data, initialized from props.data
  const [referralsData, setReferralsData] = useState(data);

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

  // States for the Add/Edit Referral Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editReferral, setEditReferral] = useState(null); // Stores the referral object being edited
  const [formErrors, setFormErrors] = useState({});

  // Form input states
  const [referrer, setReferrer] = useState('');
  const [countOfReferrals, setCountOfReferrals] = useState('');
  const [commissionEarned, setCommissionEarned] = useState('');
  const [referralStatus, setReferralStatus] = useState('Active'); // Default to 'Active'

  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [referralToDelete, setReferralToDelete] = useState(null); // Stores the ID of the referral to delete


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
   * Filters and sorts the provided 'referralsData' array based on the current 'filterText'
   * and 'sortConfig' states.
   * @returns {Array<object>} The filtered and sorted array of referral objects.
   */
  const sortedAndFilteredData = [...referralsData] // Create a shallow copy to prevent direct mutation of props.data
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
        // Handle numerical comparison for 'countOfReferrals' and 'commissionEarned'
        if (sortConfig.key === 'countOfReferrals' || sortConfig.key === 'commissionEarned') {
          const valA = parseFloat(String(a[sortConfig.key]).replace(/[^0-9.-]+/g, "") || 0);
          const valB = parseFloat(String(b[sortConfig.key]).replace(/[^0-9.-]+/g, "") || 0);
          if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        } else {
          // General string comparison for other fields
          const valA = String(a[sortConfig.key] || '').toLowerCase();
          const valB = String(b[sortConfig.key] || '').toLowerCase();

          // Perform comparison based on the sorting direction.
          if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
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
   * Handles exporting table data to XLS (CSV) or PDF (plain text).
   * @param {string} format - The desired export format ('xls' for CSV, 'pdf' for text file).
   */
  const handleExport = (format) => {
    let fileContent = '';
    let fileName = '';
    let mimeType = '';

    const displayHeaders = {
      id: 'Referral ID',
      referrer: 'Referrer Name',
      countOfReferrals: 'Count of Referrals',
      commissionEarned: 'Commission Earned',
      referralStatus: 'Status',
    };

    // Filter headers based on visible columns and map to display names
    const headers = Object.keys(visibleColumns)
      .filter(key => visibleColumns[key] && displayHeaders[key])
      .map(key => displayHeaders[key])
      .join(',');

    const rows = sortedAndFilteredData.map(row =>
      Object.keys(visibleColumns)
        .filter(key => visibleColumns[key] && displayHeaders[key])
        .map(key => `"${String(row[key]).replace(/"/g, '""')}"`) // Escape double quotes
        .join(',')
    ).join('\n');

    if (format === 'xls') {
      fileContent = `${headers}\n${rows}`;
      fileName = 'referrals_data.csv';
      mimeType = 'text/csv';
      console.log('Exporting referral data to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Referral Report\n\n';
      sortedAndFilteredData.forEach(referral => {
        fileContent += `Referral ID: ${referral.id}\n`;
        fileContent += `Referrer: ${referral.referrer}\n`;
        fileContent += `Count of Referrals: ${referral.countOfReferrals}\n`;
        fileContent += `Commission Earned: ${referral.commissionEarned}\n`;
        fileContent += `Status: ${referral.referralStatus}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'referrals_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting referral data to PDF (text format).');
      console.warn('Note: For full PDF generation with rich formatting, a dedicated client-side PDF library (e.g., jspdf, html2pdf) would be required.');
    }

    const blob = new Blob([fileContent], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  /**
   * Opens the add/edit referral form modal.
   * If a referral object is passed, it pre-fills the form for editing.
   * Otherwise, it prepares the form for adding a new referral.
   * @param {object|null} referral - The referral object to edit, or null to add new.
   */
  const handleOpenForm = (referral = null) => {
    setIsFormOpen(true);
    setEditReferral(referral);
    setFormErrors({}); // Clear any previous form errors.

    if (referral) {
      setReferrer(referral.referrer);
      setCountOfReferrals(referral.countOfReferrals);
      setCommissionEarned(referral.commissionEarned);
      setReferralStatus(referral.referralStatus);
    } else {
      // Reset form fields for a new referral.
      setReferrer('');
      setCountOfReferrals('');
      setCommissionEarned('');
      setReferralStatus('Active');
    }
  };

  /**
   * Closes the add/edit referral form modal and resets related states.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditReferral(null);
    setFormErrors({}); // Clear errors when closing.
  };

  /**
   * Validates the Referrer Name field in real-time.
   * @param {string} name - The current value of the referrer name input.
   */
  const validateReferrer = (name) => {
    let error = '';
    if (!name.trim()) {
      error = 'Referrer Name is required.';
    } else if (name.length > 20) { // Max 20 characters
      error = 'Referrer Name cannot exceed 20 characters.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, referrer: error }));
  };

  /**
   * Validates the Count of Referrals field in real-time.
   * @param {string} count - The current value of the count of referrals input.
   */
  const validateCountOfReferrals = (count) => {
    let error = '';
    if (!count.trim()) {
      error = 'Count of Referrals is required.';
    } else if (isNaN(count) || parseInt(count) < 0) {
      error = 'Must be a non-negative number.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, countOfReferrals: error }));
  };

  /**
   * Validates the Commission Earned field in real-time.
   * @param {string} commission - The current value of the commission earned input.
   */
  const validateCommissionEarned = (commission) => {
    let error = '';
    if (!commission.trim()) {
      error = 'Commission Earned is required.';
    } else if (isNaN(commission) || parseFloat(commission) < 0) {
      error = 'Must be a non-negative number.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, commissionEarned: error }));
  };

  /**
   * Performs comprehensive validation for form submission.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateFormOnSubmit = () => {
    const errors = {};
    if (!referrer.trim()) {
      errors.referrer = 'Referrer Name is required.';
    } else if (referrer.length > 20) {
      errors.referrer = 'Referrer Name cannot exceed 20 characters.';
    }
    if (!countOfReferrals.trim() || isNaN(countOfReferrals) || parseInt(countOfReferrals) < 0) {
      errors.countOfReferrals = 'Count of Referrals is required and must be a non-negative number.';
    }
    if (!commissionEarned.trim() || isNaN(commissionEarned) || parseFloat(commissionEarned) < 0) {
      errors.commissionEarned = 'Commission Earned is required and must be a non-negative number.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles the form submission to add or update a referral.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateFormOnSubmit()) {
      console.log('Form validation failed. Please correct the errors.');
      return;
    }

    const newReferral = {
      id: editReferral ? editReferral.id : `REF${Date.now()}`,
      referrer,
      countOfReferrals: parseInt(countOfReferrals),
      commissionEarned: `₹ ${parseFloat(commissionEarned).toFixed(2)}`, // Format to 2 decimal places with currency
      referralStatus,
    };

    if (editReferral) {
      setReferralsData(referralsData.map(r => r.id === newReferral.id ? newReferral : r));
      console.log('Referral Updated:', newReferral);
    } else {
      setReferralsData([...referralsData, newReferral]);
      console.log('New Referral Added:', newReferral);
    }

    handleCloseForm();
  };

  /**
   * Opens the delete confirmation modal.
   * @param {string} referralId - The unique ID of the referral to delete.
   */
  const handleDeleteClick = (referralId) => {
    setReferralToDelete(referralId);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of a referral record.
   */
  const confirmDelete = () => {
    setReferralsData(referralsData.filter(r => r.id !== referralToDelete));
    console.log('Deleting referral with ID:', referralToDelete);
    setShowDeleteConfirm(false);
    setReferralToDelete(null);
  };

  /**
   * Cancels the deletion process.
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setReferralToDelete(null);
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
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
          <Link className="w-8 h-8 text-primary" /> Referral List
        </h2>
        {/* Button to add a new referral */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Referral
        </button>
      </div>

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
                className="column-toggle-dropdown-custom" // Using custom class from index.css
              >
                {/* Dynamically render checkboxes for each column visibility */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggle(colKey)}
                      className="form-checkbox text-primary rounded"
                      disabled={colKey === 'actions'} // Actions column cannot be hidden
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
        <table className="table-custom divide-y divide-border-base"> {/* Applied table-custom for styling */}
          <thead className="bg-bg-base">
            <tr>
              {/* Conditionally render table headers based on column visibility and apply fixed widths */}
              {visibleColumns.id && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer table-sticky-col" onClick={() => sortData('id')}>Referral ID {getSortIcon('id')}</th>}
              {visibleColumns.referrer && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referrer')}>Referrer Name {getSortIcon('referrer')}</th>}
              {visibleColumns.countOfReferrals && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('countOfReferrals')}>Count of Referrals {getSortIcon('countOfReferrals')}</th>}
              {visibleColumns.commissionEarned && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('commissionEarned')}>Commission Earned {getSortIcon('commissionEarned')}</th>}
              {visibleColumns.referralStatus && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralStatus')}>Status {getSortIcon('referralStatus')}</th>}
              {visibleColumns.actions && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>} {/* Changed text-right to text-left */}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each referral row */}
            {sortedAndFilteredData.map((referral, index) => (
              <tr key={referral.id || index}>{/* Use id as key for better performance, fallback to index */}
                {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base table-sticky-col">{referral.id}</td>}
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left"> {/* Changed text-right to text-left */}
                    {/* Edit button for referral row */}
                    <button
                      onClick={() => handleOpenForm(referral)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${referral.id}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    {/* Delete button for referral row */}
                    <button
                      onClick={() => handleDeleteClick(referral.id)}
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

      {/* Add/Edit Referral Form Modal */}
      {isFormOpen && (
        <div className="modal">
          <div className="modal-content">
            {/* Close button for the form modal */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            {/* Form title based on whether it's an edit or add operation */}
            <h3 className="dashboard-widget-title mb-6">
              {editReferral ? 'Edit Referral Details' : 'Add New Referral'}
            </h3>
            {/* Referral Add/Edit Form */}
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="referrer" className="block text-sm font-medium text-text-base mb-1">
                  Referrer Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="referrer"
                  value={referrer}
                  onChange={(e) => {
                    setReferrer(e.target.value);
                    validateReferrer(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.referrer ? 'border-danger' : 'border-border-base'}`}
                  maxLength="20" // Added maxLength
                  required
                />
                {formErrors.referrer && <p className="text-danger text-xs mt-1">{formErrors.referrer}</p>}
              </div>
              <div>
                <label htmlFor="countOfReferrals" className="block text-sm font-medium text-text-base mb-1">
                  Count of Referrals <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="countOfReferrals"
                  value={countOfReferrals}
                  onChange={(e) => {
                    setCountOfReferrals(e.target.value);
                    validateCountOfReferrals(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.countOfReferrals ? 'border-danger' : 'border-border-base'}`}
                  required
                  min="0"
                />
                {formErrors.countOfReferrals && <p className="text-danger text-xs mt-1">{formErrors.countOfReferrals}</p>}
              </div>
              <div>
                <label htmlFor="commissionEarned" className="block text-sm font-medium text-text-base mb-1">
                  Commission Earned <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="commissionEarned"
                  value={commissionEarned}
                  onChange={(e) => {
                    setCommissionEarned(e.target.value);
                    validateCommissionEarned(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.commissionEarned ? 'border-danger' : 'border-border-base'}`}
                  required
                  step="0.01"
                  min="0"
                />
                {formErrors.commissionEarned && <p className="text-danger text-xs mt-1">{formErrors.commissionEarned}</p>}
              </div>
              <div>
                <label htmlFor="referralStatus" className="block text-sm font-medium text-text-base mb-1">
                  Referral Status
                </label>
                <select
                  id="referralStatus"
                  value={referralStatus}
                  onChange={(e) => setReferralStatus(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="form-actions-custom flex justify-end"> {/* Custom styling for form action buttons */}
                <button type="submit" className="action-button-custom">
                  {editReferral ? 'Update Referral' : 'Add Referral'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Deletion</h3>
            <p className="text-text-base mb-6">
              Are you sure you want to delete referral ID: <span className="font-semibold text-danger">{referralToDelete}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="action-button-custom bg-danger hover:bg-danger-dark"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="action-button-custom cancel-button-custom"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReferralList;
