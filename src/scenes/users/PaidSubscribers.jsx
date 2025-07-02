import React, { useState } from 'react';
import { Edit, Trash2, SlidersHorizontal, Download, DollarSign, PlusCircle, X } from 'lucide-react'; // Added PlusCircle and X

/**
 * PaidSubscribers component displays a table of only paid users.
 * Shares similar advanced table functionalities with MainUsers.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of paid subscriber data (from mockData.js).
 */
function PaidSubscribers({ data = [] }) {
  // State to manage the actual list of paid subscribers, initialized from props.data
  const [paidSubscribersData, setPaidSubscribersData] = useState(data);

  // State for the text input used to filter table data.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage the visibility of each table column.
  // By default, all columns are true (visible).
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    name: true, // Added name column for consistency
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

  // States for the Add/Edit Subscriber Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSubscriber, setEditSubscriber] = useState(null); // Stores the subscriber object being edited
  const [formErrors, setFormErrors] = useState({});

  // Form input states (similar to MainUsers for consistency)
  const [tradingViewId, setTradingViewId] = useState('');
  const [name, setName] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [referralId, setReferralId] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // Expiry date for paid plans

  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null); // Stores the ID of the subscriber to delete


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
  const sortedAndFilteredData = [...paidSubscribersData] // Use paidSubscribersData state
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
   * Handles exporting table data to XLS (CSV) or PDF (plain text).
   * @param {string} format - The desired export format ('xls' for CSV, 'pdf' for text file).
   */
  const handleExport = (format) => {
    let fileContent = '';
    let fileName = '';
    let mimeType = '';

    const displayHeaders = {
      userId: 'User ID',
      tradingViewId: 'TradingView ID',
      name: 'Name',
      phoneEmail: 'Phone/Email',
      referralId: 'Referral ID',
      plan: 'Plan',
      expiryDate: 'Expiry Date',
      remainingDays: 'Remaining Days',
      status: 'Status',
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
      fileName = 'paid_subscribers_data.csv';
      mimeType = 'text/csv';
      console.log('Exporting paid subscribers data to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Paid Subscribers Report\n\n';
      sortedAndFilteredData.forEach(user => {
        fileContent += `User ID: ${user.userId}\n`;
        fileContent += `Name: ${user.name}\n`;
        fileContent += `Plan: ${user.plan}\n`;
        fileContent += `Status: ${user.status}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'paid_subscribers_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting paid subscribers data to PDF (text format).');
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
   * Opens the add/edit subscriber form modal.
   * If a subscriber object is passed, it pre-fills the form for editing.
   * Otherwise, it prepares the form for adding a new subscriber.
   * @param {object|null} subscriber - The subscriber object to edit, or null to add new.
   */
  const handleOpenForm = (subscriber = null) => {
    setIsFormOpen(true);
    setEditSubscriber(subscriber);
    setFormErrors({}); // Clear any previous form errors.

    if (subscriber) {
      setTradingViewId(subscriber.tradingViewId);
      setName(subscriber.name);
      setPhoneEmail(subscriber.phoneEmail);
      setReferralId(subscriber.referralId === '-' ? '' : subscriber.referralId);
      setExpiryDate(subscriber.expiryDate === 'N/A' ? '' : subscriber.expiryDate);
    } else {
      // Reset form fields for a new subscriber.
      setTradingViewId('');
      setName('');
      setPhoneEmail('');
      setReferralId('');
      setExpiryDate('');
    }
  };

  /**
   * Closes the add/edit subscriber form modal and resets related states.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditSubscriber(null);
    setFormErrors({}); // Clear errors when closing.
  };

  /**
   * Validates the TradingView ID field in real-time.
   * @param {string} id - The current value of the TradingView ID input.
   */
  const validateTradingViewId = (id) => {
    setFormErrors(prevErrors => ({ ...prevErrors, tradingViewId: id.trim() ? '' : 'TradingView ID is required.' }));
  };

  /**
   * Validates the Name field in real-time.
   * @param {string} nameValue - The current value of the name input.
   */
  const validateName = (nameValue) => {
    setFormErrors(prevErrors => ({ ...prevErrors, name: nameValue.trim() ? '' : 'Name is required.' }));
  };

  /**
   * Validates the Phone/Email field in real-time.
   * @param {string} contact - The current value of the phone/email input.
   */
  const validatePhoneEmail = (contact) => {
    let error = '';
    if (!contact.trim()) {
      error = 'Phone/Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) && !/^\d{10}$/.test(contact)) {
      error = 'Must be a valid email or 10-digit phone number.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, phoneEmail: error }));
  };

  /**
   * Validates the Expiry Date field in real-time.
   * @param {string} date - The current value of the expiry date input.
   */
  const validateExpiryDate = (date) => {
    let error = '';
    if (!date) {
      error = 'Expiry Date is required.';
    } else if (new Date(date) < new Date()) {
      error = 'Expiry Date cannot be in the past.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, expiryDate: error }));
  };

  /**
   * Performs comprehensive validation for form submission.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateFormOnSubmit = () => {
    const errors = {};
    if (!tradingViewId.trim()) {
      errors.tradingViewId = 'TradingView ID is required.';
    }
    if (!name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!phoneEmail.trim()) {
      errors.phoneEmail = 'Phone/Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneEmail) && !/^\d{10}$/.test(phoneEmail)) {
      errors.phoneEmail = 'Must be a valid email or 10-digit phone number.';
    }
    if (!expiryDate) {
      errors.expiryDate = 'Expiry Date is required.';
    } else if (new Date(expiryDate) < new Date()) {
      errors.expiryDate = 'Expiry Date cannot be in the past.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles the form submission to add or update a paid subscriber.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateFormOnSubmit()) {
      console.log('Form validation failed. Please correct the errors.');
      return;
    }

    const newSubscriber = {
      userId: editSubscriber ? editSubscriber.userId : `PAID${Date.now()}`,
      tradingViewId,
      name,
      phoneEmail,
      referralId: referralId || '-',
      plan: 'Paid', // Always 'Paid' for this component
      expiryDate,
      remainingDays: Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
      status: 'Active', // Assuming new or updated paid subscribers are active
    };

    if (editSubscriber) {
      setPaidSubscribersData(paidSubscribersData.map(s => s.userId === newSubscriber.userId ? newSubscriber : s));
      console.log('Paid Subscriber Updated:', newSubscriber);
    } else {
      setPaidSubscribersData([...paidSubscribersData, newSubscriber]);
      console.log('New Paid Subscriber Added:', newSubscriber);
    }

    handleCloseForm();
  };

  /**
   * Opens the delete confirmation modal.
   * @param {string} userId - The unique ID of the subscriber to delete.
   */
  const handleDeleteClick = (userId) => {
    setSubscriberToDelete(userId);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of a subscriber.
   */
  const confirmDelete = () => {
    setPaidSubscribersData(paidSubscribersData.filter(s => s.userId !== subscriberToDelete));
    console.log('Deleting paid subscriber with ID:', subscriberToDelete);
    setShowDeleteConfirm(false);
    setSubscriberToDelete(null);
  };

  /**
   * Cancels the deletion process.
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSubscriberToDelete(null);
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
          <DollarSign className="w-8 h-8 text-accent" /> Paid Subscribers
        </h2>
        {/* Button to add a new paid subscriber */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Paid Subscriber
        </button>
      </div>

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
              {visibleColumns.name && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('name')}>Name {getSortIcon('name')}</th>}
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
                      onClick={() => handleOpenForm(user)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${user.userId}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    {/* Delete button for user row */}
                    <button
                      onClick={() => handleDeleteClick(user.userId)}
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

      {/* Add/Edit Subscriber Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-lg w-full relative">
            {/* Close button for the form modal */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-6">
              {editSubscriber ? 'Edit Paid Subscriber Details' : 'Add New Paid Subscriber'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="tradingViewId" className="block text-sm font-medium text-text-base mb-1">
                  TradingView ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="tradingViewId"
                  value={tradingViewId}
                  onChange={(e) => {
                    setTradingViewId(e.target.value);
                    validateTradingViewId(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.tradingViewId ? 'border-danger' : 'border-border-base'}`}
                  required
                />
                {formErrors.tradingViewId && <p className="text-danger text-xs mt-1">{formErrors.tradingViewId}</p>}
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-text-base mb-1">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    validateName(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.name ? 'border-danger' : 'border-border-base'}`}
                  required
                />
                {formErrors.name && <p className="text-danger text-xs mt-1">{formErrors.name}</p>}
              </div>
              <div>
                <label htmlFor="phoneEmail" className="block text-sm font-medium text-text-base mb-1">
                  Phone / Email <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="phoneEmail"
                  value={phoneEmail}
                  onChange={(e) => {
                    setPhoneEmail(e.target.value);
                    validatePhoneEmail(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.phoneEmail ? 'border-danger' : 'border-border-base'}`}
                  required
                />
                {formErrors.phoneEmail && <p className="text-danger text-xs mt-1">{formErrors.phoneEmail}</p>}
              </div>
              <div>
                <label htmlFor="referralId" className="block text-sm font-medium text-text-base mb-1">
                  Referral ID (Optional)
                </label>
                <input
                  type="text"
                  id="referralId"
                  value={referralId}
                  onChange={(e) => setReferralId(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              {/* Plan type is fixed to 'Paid' for this component */}
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-text-base mb-1">
                  Expiry Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => {
                    setExpiryDate(e.target.value);
                    validateExpiryDate(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.expiryDate ? 'border-danger' : 'border-border-base'}`}
                  required
                />
                {formErrors.expiryDate && <p className="text-danger text-xs mt-1">{formErrors.expiryDate}</p>}
              </div>
              <div className="form-actions-custom flex justify-end">
                <button type="submit" className="action-button-custom">
                  {editSubscriber ? 'Update Subscriber' : 'Add Subscriber'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-sm w-full relative text-center">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Deletion</h3>
            <p className="text-text-base mb-6">
              Are you sure you want to delete subscriber ID: <span className="font-semibold text-danger">{subscriberToDelete}</span>? This action cannot be undone.
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

export default PaidSubscribers;
