import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, X, Users, SlidersHorizontal, Download } from 'lucide-react';

/**
 * DailyPaidDemo component displays daily new subscribers and an admin form to add new ones.
 * Features advanced table functionalities like filter, sort, column toggle, and export.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of daily new subscriber data (from mockData.js).
 */
function DailyPaidDemo({ data = [] }) {
  // State to manage the actual list of subscribers, initialized from props.data
  const [subscribersData, setSubscribersData] = useState(data);

  // State to control the visibility of the add new subscriber form modal.
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State to hold the subscriber object being edited. Null if adding a new subscriber.
  const [editSubscriber, setEditSubscriber] = useState(null);
  // State to store validation errors for the form.
  const [formErrors, setFormErrors] = useState({});

  // States for the form inputs.
  const [tradingViewId, setTradingViewId] = useState('');
  const [name, setName] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [referralId, setReferralId] = useState('');
  const [planType, setPlanType] = useState('Demo'); // Default new subscriber to 'Demo' plan.
  const [expiryDate, setExpiryDate] = useState(''); // Expiry date for paid plans.

  // State for table filtering and sorting
  const [filterText, setFilterText] = useState(''); // Text input for filtering
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Sorting configuration
  // State to manage the visibility of each table column. All true by default.
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    name: true,
    phoneEmail: true,
    referralId: true,
    plan: true,
    expiryDate: true,
    joinedDate: true,
    status: true,
    actions: true, // Actions column is typically always visible
  });
  // State to control the open/close state of the column toggle dropdown.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState(null); // Stores the ID of the subscriber to delete


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
      setPlanType(subscriber.plan);
      setExpiryDate(subscriber.plan === 'Paid' && subscriber.expiryDate !== 'N/A' ? subscriber.expiryDate : '');
    } else {
      setTradingViewId('');
      setName('');
      setPhoneEmail('');
      setReferralId('');
      setPlanType('Demo');
      setExpiryDate('');
    }
  };

  /**
   * Closes the add new subscriber form modal and clears errors.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditSubscriber(null);
    setFormErrors({});
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
   * Handles the form submission to add or update a subscriber.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateFormOnSubmit()) {
      console.log('Form validation failed. Please correct the errors.');
      return;
    }

    const newSubscriber = {
      userId: editSubscriber ? editSubscriber.userId : `SUB${Date.now()}`,
      tradingViewId,
      name,
      phoneEmail,
      referralId: referralId || '-',
      plan: planType,
      expiryDate: planType === 'Paid' ? expiryDate : 'N/A',
      joinedDate: editSubscriber ? editSubscriber.joinedDate : new Date().toISOString().split('T')[0],
      status: 'Active', // Assuming new or updated subscribers are active
      remainingDays: planType === 'Paid' ? Math.ceil((new Date(expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : 'N/A',
    };

    if (editSubscriber) {
      setSubscribersData(subscribersData.map(sub => sub.userId === newSubscriber.userId ? newSubscriber : sub));
      console.log('Subscriber Updated:', newSubscriber);
    } else {
      setSubscribersData([...subscribersData, newSubscriber]);
      console.log('New Subscriber Added:', newSubscriber);
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
    setSubscribersData(subscribersData.filter(sub => sub.userId !== subscriberToDelete));
    console.log('Deleting Subscriber with ID:', subscriberToDelete);
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
   * Toggles the sorting direction for a given column key.
   * @param {string} key - The data key of the column to sort by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the subscribersData array.
   * @returns {Array<object>} The filtered and sorted array of subscriber objects.
   */
  const sortedAndFilteredData = [...subscribersData]
    .filter(subscriber =>
      Object.values(subscriber).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        const valA = String(a[sortConfig.key] || '').toLowerCase();
        const valB = String(b[sortConfig.key] || '').toLowerCase();

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

  /**
   * Toggles the visibility of a specific column in the table.
   * @param {string} column - The key of the column whose visibility is to be toggled.
   */
  const handleColumnToggleVisibility = (column) => {
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  /**
   * Handles exporting table data to XLS (CSV) or PDF (text file).
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
      joinedDate: 'Joined Date',
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
        .map(key => `"${String(row[key]).replace(/"/g, '""')}"`)
        .join(',')
    ).join('\n');


    if (format === 'xls') {
      fileContent = `${headers}\n${rows}`;
      fileName = 'subscribers_data.csv';
      mimeType = 'text/csv';
      console.log('Exporting data to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Subscriber Report\n\n';
      sortedAndFilteredData.forEach(sub => {
        fileContent += `User ID: ${sub.userId}\n`;
        fileContent += `Name: ${sub.name}\n`;
        fileContent += `Plan: ${sub.plan}\n`;
        fileContent += `Joined Date: ${sub.joinedDate}\n`;
        if (sub.plan === 'Paid') {
          fileContent += `Expiry Date: ${sub.expiryDate}\n`;
        }
        fileContent += `Status: ${sub.status}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'subscribers_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting data to PDF (text format).');
      console.warn('Note: For full PDF generation with rich formatting, a dedicated client-side PDF library (e.g., jspdf, html22pdf) would be required.');
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
   * Returns a sort icon (▲ for ascending, ▼ for descending) next to the column header
   * if the table is currently sorted by that column.
   * @param {string} key - The data key of the column.
   * @returns {string|null} The sort icon string or null.
   */
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? ' ▲' : ' ▼';
  };

  // Calculate total paid and demo subscriber counts from all data in subscribersData.
  const totalPaidCount = subscribersData.filter(s => s.plan === 'Paid').length;
  const totalDemoCount = subscribersData.filter(s => s.plan === 'Demo').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      {/* Header Section with Subscribers Management heading */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
          <Users className="w-8 h-8 text-primary" /> Subscribers Management
        </h2>
      </div>

      {/* Quick Analytics Count Section */}
      <div className="kpi-cards-custom">
        <div className="kpi-card-custom text-center">
          <h3>Total Paid</h3>
          <p className="kpi-value-custom">{totalPaidCount}</p>
        </div>
        <div className="kpi-card-custom text-center">
          <h3>Total Demo</h3>
          <p className="kpi-value-custom">{totalDemoCount}</p>
        </div>
      </div>

      {/* All Subscribers Table Section */}
      <div className="flex justify-between items-center mt-8">
        <h3 className="text-2xl font-bold text-secondary flex items-center gap-2">
          All Subscribers
        </h3>
        {/* This is the Add New Subscriber button that remains, aligned right */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Subscriber
        </button>
      </div>
      <div className="kpi-card-custom overflow-x-auto">
        {/* Table Controls: Filter, Column Toggle, Export */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Filter Input */}
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Filter subscribers..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="p-2 pl-4 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none w-full"
              aria-label="Filter subscribers"
            />
          </div>

          <div className="flex space-x-2 relative">
            {/* Column Toggle Button */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="subscriber-list-column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {/* Column Toggle Dropdown */}
            {isColumnToggleOpen && (
              <div
                id="subscriber-list-column-toggle-dropdown"
                className="absolute top-full right-0 mt-2 bg-card-bg border border-border-base rounded-lg shadow-strong z-10 p-4 min-w-[150px]"
              >
                {/* Dynamically render checkboxes for each column visibility */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggleVisibility(colKey)}
                      className="form-checkbox text-primary rounded"
                      // Disable toggle for 'actions' column if it should always be visible
                      disabled={colKey === 'actions'}
                    />
                    {/* Convert camelCase key to a more readable Title Case for display */}
                    <span>{colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.charAt(0).toUpperCase() + str.slice(1))}</span>
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

        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {visibleColumns.userId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('userId')}>User ID {getSortIcon('userId')}</th>}
              {visibleColumns.tradingViewId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('tradingViewId')}>TradingView ID {getSortIcon('tradingViewId')}</th>}
              {visibleColumns.name && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('name')}>Name {getSortIcon('name')}</th>}
              {visibleColumns.phoneEmail && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('phoneEmail')}>Phone/Email {getSortIcon('phoneEmail')}</th>}
              {visibleColumns.referralId && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralId')}>Referral ID {getSortIcon('referralId')}</th>}
              {visibleColumns.plan && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('plan')}>Plan {getSortIcon('plan')}</th>}
              {visibleColumns.expiryDate && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('expiryDate')}>Expiry Date {getSortIcon('expiryDate')}</th>}
              {visibleColumns.joinedDate && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('joinedDate')}>Joined Date {getSortIcon('joinedDate')}</th>}
              {visibleColumns.status && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {sortedAndFilteredData.map((sub, index) => (
              <tr key={sub.userId || index}>
                {visibleColumns.userId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.userId}</td>}
                {visibleColumns.tradingViewId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.tradingViewId}</td>}
                {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.name}</td>}
                {visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.phoneEmail}</td>}
                {visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.referralId}</td>}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.plan}</td>}
                {visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.expiryDate}</td>}
                {visibleColumns.joinedDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.joinedDate}</td>}
                {visibleColumns.status && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      sub.status === 'Active' ? 'bg-accent-light text-accent' : (sub.status === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger')
                    }`}>
                      {sub.status}
                    </span>
                  </td>
                )}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenForm(sub)} // Pass the subscriber object to pre-fill form for editing
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Edit ${sub.name}`}
                    >
                      <Edit className="w-5 h-5 inline" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(sub.userId)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Delete ${sub.name}`}
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

      {/* Modal/Overlay for the Add/Edit Subscriber Form */}
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
              {editSubscriber ? 'Edit Subscriber Details' : 'Add New Subscriber'}
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

export default DailyPaidDemo;
