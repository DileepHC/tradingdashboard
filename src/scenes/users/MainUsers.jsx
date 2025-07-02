import React, { useState } from 'react';
import { Edit, Trash2, SlidersHorizontal, Download, Users, PlusCircle, X } from 'lucide-react'; // Added PlusCircle and X

/**
 * MainUsers component displays a table of all users (paid/demo).
 * Features advanced table functionalities like filter, sort, column toggle, and export.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of user data.
 */
function MainUsers({ data = [] }) {
  // State to manage the actual list of users, initialized from props.data
  const [usersData, setUsersData] = useState(data);

  // State for the text entered in the filter input.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to control which columns are currently visible in the table.
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    name: true, // Added name column for consistency with DailyPaidDemo
    phoneEmail: true,
    referralId: true,
    plan: true,
    expiryDate: true,
    remainingDays: true,
    status: true,
    actions: true, // Actions column is typically always visible by default.
  });
  // State to control the visibility of the column toggle dropdown.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  // States for the Add/Edit User Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editUser, setEditUser] = useState(null); // Stores the user object being edited
  const [formErrors, setFormErrors] = useState({}); // Corrected: Initialized with useState

  // Form input states
  const [tradingViewId, setTradingViewId] = useState('');
  const [name, setName] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [referralId, setReferralId] = useState('');
  const [planType, setPlanType] = useState('Demo'); // Default new user to 'Demo' plan
  const [expiryDate, setExpiryDate] = useState(''); // Expiry date for paid plans

  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null); // Stores the ID of the user to delete


  /**
   * Toggles the sorting direction for a given column key.
   * If the same key is clicked consecutively, it alternates between ascending and descending.
   * @param {string} key - The column key to sort the data by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the provided data based on the current filter text and sort configuration.
   * Creates a new array to avoid direct mutation of the original data prop.
   */
  const sortedAndFilteredData = [...usersData] // Use usersData state
    .filter(user =>
      // Check if any value in the user object (converted to string and lowercase)
      // includes the filterText (case-insensitive).
      Object.values(user).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      // Apply sorting logic only if a sort key is set.
      if (sortConfig.key) {
        // Convert values to lowercase strings for case-insensitive comparison.
        // Provide a default empty string for potential null/undefined values to prevent errors.
        const valA = String(a[sortConfig.key] || '').toLowerCase();
        const valB = String(b[sortConfig.key] || '').toLowerCase();

        // Compare values and return -1, 0, or 1 based on sort direction.
        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0; // Return 0 if no sorting is applied or values are equal.
    });

  /**
   * Toggles the visibility of a specific table column.
   * @param {string} column - The key of the column to toggle (e.g., 'userId', 'phoneEmail').
   */
  const handleColumnToggle = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column], // Flip the boolean value for the given column key.
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
      fileName = 'main_users_data.csv';
      mimeType = 'text/csv';
      console.log('Exporting data to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Main Users Report\n\n';
      sortedAndFilteredData.forEach(user => {
        fileContent += `User ID: ${user.userId}\n`;
        fileContent += `Name: ${user.name}\n`;
        fileContent += `Plan: ${user.plan}\n`;
        fileContent += `Status: ${user.status}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'main_users_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting data to PDF (text format).');
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
   * Opens the add/edit user form modal.
   * If a user object is passed, it pre-fills the form for editing.
   * Otherwise, it prepares the form for adding a new user.
   * @param {object|null} user - The user object to edit, or null to add new.
   */
  const handleOpenForm = (user = null) => {
    setIsFormOpen(true);
    setEditUser(user);
    setFormErrors({}); // Clear any previous form errors.

    if (user) {
      setTradingViewId(user.tradingViewId);
      setName(user.name);
      setPhoneEmail(user.phoneEmail);
      setReferralId(user.referralId === '-' ? '' : user.referralId);
      setPlanType(user.plan);
      setExpiryDate(user.expiryDate === 'N/A' ? '' : user.expiryDate);
    } else {
      // Reset form fields for a new user.
      setTradingViewId('');
      setName('');
      setPhoneEmail('');
      setReferralId('');
      setPlanType('Demo');
      setExpiryDate('');
    }
  };

  /**
   * Closes the add/edit user form modal and resets related states.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditUser(null);
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
   * Validates the Expiry Date field in real-time for Paid plans.
   * @param {string} date - The current value of the expiry date input.
   * @param {string} currentPlanType - The currently selected plan type.
   */
  const validateExpiryDate = (date, currentPlanType) => {
    let error = '';
    if (currentPlanType === 'Paid') {
      if (!date) {
        error = 'Expiry Date is required for Paid Plan.';
      } else if (new Date(date) < new Date()) {
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
    }
    if (!name.trim()) {
      errors.name = 'Name is required.';
    }
    if (!phoneEmail.trim()) {
      errors.phoneEmail = 'Phone/Email is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(phoneEmail) && !/^\d{10}$/.test(phoneEmail)) {
      errors.phoneEmail = 'Must be a valid email or 10-digit phone number.';
    }
    if (planType === 'Paid' && !expiryDate) {
      errors.expiryDate = 'Expiry Date is required for Paid Plan.';
    } else if (planType === 'Paid' && expiryDate && new Date(expiryDate) < new Date()) {
      errors.expiryDate = 'Expiry Date cannot be in the past.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles the form submission to add or update a user.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateFormOnSubmit()) {
      console.log('Form validation failed. Please correct the errors.');
      return;
    }

    const newUser = {
      userId: editUser ? editUser.userId : `USER${Date.now()}`,
      tradingViewId,
      name,
      phoneEmail,
      referralId: referralId || '-',
      plan: planType,
      expiryDate: planType === 'Paid' ? expiryDate : 'N/A',
      remainingDays: planType === 'Paid' ? Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 'N/A',
      status: 'Active', // Assuming new or updated users are active
    };

    if (editUser) {
      setUsersData(usersData.map(u => u.userId === newUser.userId ? newUser : u));
      console.log('User Updated:', newUser);
    } else {
      setUsersData([...usersData, newUser]);
      console.log('New User Added:', newUser);
    }

    handleCloseForm();
  };

  /**
   * Opens the delete confirmation modal.
   * @param {string} userId - The unique ID of the user to delete.
   */
  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of a user.
   */
  const confirmDelete = () => {
    setUsersData(usersData.filter(u => u.userId !== userToDelete));
    console.log('Deleting user with ID:', userToDelete);
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  /**
   * Cancels the deletion process.
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  /**
   * Returns a sort icon (▲ for ascending, ▼ for descending) next to the column header
   * if the table is currently sorted by that column.
   * @param {string} key - The column key for which to get the sort icon.
   * @returns {string|null} '▲' for ascending, '▼' for descending, or null if not sorted by this key.
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null; // No icon if this column is not actively sorted.
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼'; // Add a space for visual separation.
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" /> Main Users
        </h2>
        {/* Button to add a new user */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New User
        </button>
      </div>


      {/* Table Controls Section (Filter Input, Column Toggle, Export Buttons) */}
      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Filter Input */}
          <input
            type="text"
            placeholder="Filter all columns..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
            aria-label="Filter users"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {/* Column Toggle Dropdown */}
            {isColumnToggleOpen && (
              <div
                id="column-toggle-dropdown"
                className="absolute top-full right-0 mt-2 bg-card-bg border border-border-base rounded-lg shadow-strong z-10 p-4 min-w-[180px]"
              >
                {/* Map over the keys of visibleColumns state to create checkboxes */}
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

        {/* Main Users Table */}
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {/* Table Headers: Conditionally rendered based on visibleColumns state */}
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
                {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.name}</td>}
                {visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.phoneEmail}</td>}
                {visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.referralId || '-'}</td>}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.plan}</td>}
                {visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.expiryDate}</td>}
                {visibleColumns.remainingDays && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{user.remainingDays}</td>}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  {/* Dynamic styling for status based on its value */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.status === 'Active' ? 'bg-accent-light text-accent' : 'bg-danger-light text-danger'
                  }`}>
                    {user.status}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* Edit button with Lucide icon */}
                    <button
                      onClick={() => handleOpenForm(user)} // Calls handleOpenForm to open modal
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${user.userId}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    {/* Delete button with Lucide icon */}
                    <button
                      onClick={() => handleDeleteClick(user.userId)} // Calls handleDeleteClick to open confirmation modal
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

      {/* Add/Edit User Form Modal */}
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
              {editUser ? 'Edit User Details' : 'Add New User'}
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
              <div>
                <label htmlFor="planType" className="block text-sm font-medium text-text-base mb-1">
                  Plan Type
                </label>
                <select
                  id="planType"
                  value={planType}
                  onChange={(e) => {
                    setPlanType(e.target.value);
                    if (e.target.value === 'Demo') {
                      setExpiryDate(''); // Clear expiry date if switching to Demo
                      validateExpiryDate('', 'Demo'); // Clear validation error for expiryDate
                    } else {
                      validateExpiryDate(expiryDate, e.target.value); // Re-validate if switching to Paid
                    }
                  }}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="Demo">Demo</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
              {/* Conditionally render Expiry Date field for Paid plans */}
              {planType === 'Paid' && (
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
                      validateExpiryDate(e.target.value, planType); // Real-time validation
                    }}
                    className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.expiryDate ? 'border-danger' : 'border-border-base'}`}
                    required={planType === 'Paid'} // Make required only if plan is Paid
                  />
                  {formErrors.expiryDate && <p className="text-danger text-xs mt-1">{formErrors.expiryDate}</p>}
                </div>
              )}
              <div className="form-actions-custom flex justify-end">
                <button type="submit" className="action-button-custom">
                  {editUser ? 'Update User' : 'Add User'}
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
              Are you sure you want to delete user ID: <span className="font-semibold text-danger">{userToDelete}</span>? This action cannot be undone.
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

export default MainUsers;
