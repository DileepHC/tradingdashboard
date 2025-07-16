import React, { useState } from 'react';
import { Edit, Trash2, SlidersHorizontal, Download, Users, PlusCircle, X } from 'lucide-react';
import { dummyNames } from '../../data/mockData'; // Import dummyNames

/**
 * DemoSubscribers component displays a table of only demo users.
 * Features advanced table functionalities like filtering, sorting, column toggling, and export.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of demo subscriber data (from mockData.js).
 */
function DemoSubscribers({ data = [] }) {
  // State to manage the actual list of demo subscribers, initialized from props.data
  const [demoSubscribersData, setDemoSubscribersData] = useState(data);

  // State for filtering text input.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage visibility of individual table columns.
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    name: true,
    phoneEmail: true,
    referralId: false, // Hidden by default as requested
    plan: true,
    expiryDate: true, // Now relevant for demo users
    remainingDays: true, // Now relevant for demo users
    status: true,
    actions: true, // Always show actions column by default
  });
  // State to control the visibility of the column toggle dropdown.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  // States for the Add/Edit Subscriber Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editSubscriber, setEditSubscriber] = useState(null); // Stores the subscriber object being edited
  const [formErrors, setFormErrors] = useState({});

  // Form input states
  const [tradingViewId, setTradingViewId] = useState('');
  const [name, setName] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [referralId, setReferralId] = useState('');
  const [expiryDate, setExpiryDate] = useState(''); // Expiry date for demo plans


  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null); // Stores the ID of the subscriber to delete


  /**
   * Toggles the sorting direction for a given column key.
   * If the same column is clicked consecutively, it alternates between ascending and descending.
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
   */
  const sortedAndFilteredData = [...demoSubscribersData] // Use demoSubscribersData state
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

        // Special handling for expiryDate to sort as dates
        if (sortConfig.key === 'expiryDate') {
          const dateA = new Date(a.expiryDate);
          const dateB = new Date(b.expiryDate);
          if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        // Special handling for remainingDays to sort as numbers
        else if (sortConfig.key === 'remainingDays') {
          const numA = parseInt(a.remainingDays, 10);
          const numB = parseInt(b.remainingDays, 10);
          if (numA < numB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (numA > numB) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        // General string comparison for other keys
        else {
          if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
        }
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
        .map(key => {
          let value = row[key];
          if (key === 'expiryDate') {
            value = formatDate(value); // Format date for export
          }
          return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes
        })
        .join(',')
    ).join('\n');

    if (format === 'xls') {
      fileContent = `${headers}\n${rows}`;
      fileName = 'demo_subscribers_data.csv';
      mimeType = 'text/csv';
      console.log('Exporting demo subscribers data to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Demo Subscribers Report\n\n';
      sortedAndFilteredData.forEach(user => {
        fileContent += `User ID: ${user.userId}\n`;
        fileContent += `Name: ${user.name}\n`;
        fileContent += `Plan: ${user.plan}\n`;
        fileContent += `Expiry Date: ${formatDate(user.expiryDate)}\n`;
        fileContent += `Remaining Days: ${calculateRemainingDays(user.expiryDate)}\n`;
        fileContent += `Status: ${getStatus(calculateRemainingDays(user.expiryDate))}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'demo_subscribers_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting demo subscribers data to PDF (text format).');
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
      setExpiryDate(subscriber.expiryDate || ''); // Set expiry date if available
    } else {
      // Reset form fields for a new subscriber.
      setTradingViewId('');
      setName('');
      setPhoneEmail('');
      setReferralId('');
      setExpiryDate(''); // Reset expiry date
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
    let error = '';
    if (!id.trim()) {
      error = 'TradingView ID is required.';
    } else if (!/^[a-zA-Z0-9]{6}$/.test(id)) { // Must be exactly 6 alphanumeric characters
      error = 'TradingView ID must be 6 alphanumeric characters.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, tradingViewId: error }));
  };

  /**
   * Validates the Name field in real-time.
   * @param {string} nameValue - The current value of the name input.
   */
  const validateName = (nameValue) => {
    let error = '';
    if (!nameValue.trim()) {
      error = 'Name is required.';
    } else if (nameValue.length > 20) { // Max 20 characters
      error = 'Name cannot exceed 20 characters.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, name: error }));
  };

  /**
   * Validates the Phone/Email field in real-time.
   * @param {string} contact - The current value of the phone/email input.
   */
  const validatePhoneEmail = (contact) => {
    let error = '';
    if (!contact.trim()) {
      error = 'Phone/Email is required.';
    } else if (!/^\d{10}$/.test(contact) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact)) {
      error = 'Must be a valid 10-digit phone number or a valid email address.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, phoneEmail: error }));
  };

  /**
   * Validates the Referral ID field in real-time.
   * @param {string} id - The current value of the Referral ID input.
   */
  const validateReferralId = (id) => {
    let error = '';
    if (id.trim() && !/^[a-zA-Z0-9]{6}$/.test(id)) { // If provided, must be exactly 6 alphanumeric characters
      error = 'Referral ID must be 6 alphanumeric characters.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, referralId: error }));
  };

  /**
   * Validates the Expiry Date field in real-time.
   * @param {string} date - The current value of the expiry date input (YYYY-MM-DD format).
   */
  const validateExpiryDate = (date) => {
    let error = '';
    if (!date) {
      error = 'Expiry Date is required.';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate comparison
      if (selectedDate < today) {
        error = 'Expiry Date cannot be in the past.';
      }
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
    } else if (!/^[a-zA-Z0-9]{6}$/.test(tradingViewId)) {
      errors.tradingViewId = 'TradingView ID must be 6 alphanumeric characters.';
    }
    if (!name.trim()) {
      errors.name = 'Name is required.';
    } else if (name.length > 20) {
      errors.name = 'Name cannot exceed 20 characters.';
    }
    if (!phoneEmail.trim()) {
      errors.phoneEmail = 'Phone/Email is required.';
    } else if (!/^\d{10}$/.test(phoneEmail) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneEmail)) {
      errors.phoneEmail = 'Must be a valid 10-digit phone number or a valid email address.';
    }
    if (referralId.trim() && !/^[a-zA-Z0-9]{6}$/.test(referralId)) {
      errors.referralId = 'Referral ID must be 6 alphanumeric characters.';
    }
    if (!expiryDate) {
      errors.expiryDate = 'Expiry Date is required.';
    } else {
      const selectedDate = new Date(expiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) {
        errors.expiryDate = 'Expiry Date cannot be in the past.';
      }
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Helper function to generate a random alphanumeric ID of a given length.
   * @param {number} length - The desired length of the ID.
   * @returns {string} A random alphanumeric string.
   */
  const generateAlphanumericId = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  /**
   * Calculates the remaining days until an expiry date.
   * @param {string} expiryDateString - The expiry date in 'YYYY-MM-DD' format.
   * @returns {number|string} The number of remaining days, or 'N/A' if invalid.
   */
  const calculateRemainingDays = (expiryDateString) => {
    if (!expiryDateString) return 'N/A';
    const expiry = new Date(expiryDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays : 0; // Return 0 if date is in the past
  };

  /**
   * Determines the status based on remaining days.
   * @param {number|string} remainingDays - The number of remaining days.
   * @returns {string} The status ('Active' or 'Inactive').
   */
  const getStatus = (remainingDays) => {
    if (remainingDays === 'N/A' || remainingDays <= 0) {
      return 'Inactive';
    }
    return 'Active';
  };

  /**
   * Handles the form submission to add or update a demo subscriber.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateFormOnSubmit()) {
      console.log('Form validation failed. Please correct the errors.');
      return;
    }

    const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];
    const calculatedRemainingDays = calculateRemainingDays(expiryDate);
    const calculatedStatus = getStatus(calculatedRemainingDays);

    const newSubscriber = {
      userId: editSubscriber ? editSubscriber.userId : generateAlphanumericId(6),
      tradingViewId,
      name: randomName, // Assign a random dummy name
      phoneEmail,
      referralId: referralId || '-',
      plan: 'Demo', // Always 'Demo' for this component
      expiryDate, // Now applicable for demo users
      remainingDays: calculatedRemainingDays, // Now applicable for demo users
      status: calculatedStatus, // Dynamic status based on expiry date
    };

    if (editSubscriber) {
      setDemoSubscribersData(demoSubscribersData.map(s => s.userId === newSubscriber.userId ? newSubscriber : s));
      console.log('Demo Subscriber Updated:', newSubscriber);
    } else {
      setDemoSubscribersData([...demoSubscribersData, newSubscriber]);
      console.log('New Demo Subscriber Added:', newSubscriber);
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
    setDemoSubscribersData(demoSubscribersData.filter(s => s.userId !== subscriberToDelete));
    console.log('Deleting demo subscriber with ID:', subscriberToDelete);
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
   * Returns the sort icon (▲ for ascending, ▼ for descending) for a given column key.
   * @param {string} key - The column key.
   * @returns {string|null} The sort icon character or null if not sorted by this key.
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null; // No icon if not sorting by this column.
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'; // Add a space for better readability.
  };

  // Helper function to format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date strings
    return date.toLocaleDateString('en-GB'); // Formats to DD/MM/YYYY
  };

  // Get today's date in YYYY-MM-DD format for min attribute of date input
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
          <Users className="w-8 h-8 text-warning" /> Demo Subscribers
        </h2>
        {/* Button to add a new demo subscriber */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Demo Subscriber
        </button>
      </div>

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
            aria-label="Filter demo subscribers"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button and Dropdown */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen} // Added for accessibility
              aria-controls="demo-subscribers-column-toggle-dropdown" // Added for accessibility
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {/* Column Toggle Dropdown */}
            {isColumnToggleOpen && (
              <div
                id="demo-subscribers-column-toggle-dropdown" // Added for accessibility
                className="column-toggle-dropdown-custom" // Using custom class from index.css
              >
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
        <table className="table-custom divide-y divide-border-base"> {/* Apply table-custom class for styling */}
          <thead className="bg-bg-base">
            <tr>
              {visibleColumns.userId && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer table-sticky-col" onClick={() => sortData('userId')}>User ID {getSortIcon('userId')}</th>}
              {visibleColumns.tradingViewId && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('tradingViewId')}>TradingView ID {getSortIcon('tradingViewId')}</th>}
              {visibleColumns.name && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('name')}>Name {getSortIcon('name')}</th>}
              {visibleColumns.phoneEmail && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('phoneEmail')}>Phone / Email {getSortIcon('phoneEmail')}</th>}
              {visibleColumns.referralId && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralId')}>Referral ID {getSortIcon('referralId')}</th>}
              {visibleColumns.plan && <th style={{ width: '80px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('plan')}>Plan {getSortIcon('plan')}</th>}
              {visibleColumns.expiryDate && <th style={{ width: '120px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('expiryDate')}>Expiry Date {getSortIcon('expiryDate')}</th>}
              {visibleColumns.remainingDays && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('remainingDays')}>Remaining Days {getSortIcon('remainingDays')}</th>}
              {visibleColumns.status && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>} {/* Changed text-right to text-left */}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each user row */}
            {sortedAndFilteredData.map((user, index) => (
              <tr key={user.userId || index}>
                {visibleColumns.userId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base table-sticky-col">{user.userId}</td>} {/* Added table-sticky-col */}
                {visibleColumns.tradingViewId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.tradingViewId}</td>}
                {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.name}</td>}
                {visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.phoneEmail}</td>}
                {visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.referralId || '-'}</td>}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.plan}</td>}
                {visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{formatDate(user.expiryDate)}</td>}
                {visibleColumns.remainingDays && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{calculateRemainingDays(user.expiryDate)}</td>}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    getStatus(calculateRemainingDays(user.expiryDate)) === 'Active' ? 'bg-accent-light text-accent' : 'bg-danger-light text-danger'
                  }`}>
                    {getStatus(calculateRemainingDays(user.expiryDate))}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left"> {/* Changed text-right to text-left */}
                    <button
                      onClick={() => handleOpenForm(user)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${user.userId}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
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
        <div className="modal"> {/* Changed className to "modal" */}
          <div className="modal-content"> {/* Changed className to "modal-content" */}
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-6">
              {editSubscriber ? 'Edit Demo Subscriber Details' : 'Add New Demo Subscriber'}
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
                  maxLength="6" // Added maxLength
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
                  maxLength="20" // Updated maxLength to 20
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
                  onChange={(e) => {
                    setReferralId(e.target.value);
                    validateReferralId(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.referralId ? 'border-danger' : 'border-border-base'}`}
                  maxLength="6" // Added maxLength
                />
                {formErrors.referralId && <p className="text-danger text-xs mt-1">{formErrors.referralId}</p>}
              </div>
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
                  min={getMinDate()} // Set min date to today
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
        <div className="modal"> {/* Changed className to "modal" */}
          <div className="modal-content"> {/* Changed className to "modal-content" */}
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

export default DemoSubscribers;
