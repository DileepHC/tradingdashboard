import React, { useState } from 'react';
import { PlusCircle, Edit, Trash2, X, Users, SlidersHorizontal, Download } from 'lucide-react';
import { dummyNames } from '../../data/mockData'; // Import dummyNames

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
  const [joinedDate, setJoinedDate] = useState(''); // Joined date for all plans.

  // State for table filtering and sorting
  const [filterText, setFilterText] = useState(''); // Text input for filtering
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Sorting configuration
  // State to manage the visibility of each table column. All true by default.
  const [visibleColumns, setVisibleColumns] = useState({
    userId: true,
    tradingViewId: true,
    name: true,
    phoneEmail: true,
    referralId: false, // Hidden by default, consistent with PaidSubscribers.jsx
    plan: true,
    expiryDate: true,
    // remainingDays: true, // Removed remainingDays from visible columns
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
   * Calculates the remaining days until an expiry date.
   * @param {string} expiryDateString - The expiry date in 'YYYY-MM-DD' format.
   * @returns {number|string} The number of remaining days, or 'N/A' if invalid.
   */
  const calculateRemainingDays = (expiryDateString) => {
    if (!expiryDateString || expiryDateString === 'N/A') return 'N/A';
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
      setJoinedDate(subscriber.joinedDate || ''); // Set joined date from existing subscriber
    } else {
      setTradingViewId('');
      setName('');
      setPhoneEmail('');
      setReferralId('');
      setPlanType('Demo');
      setExpiryDate('');
      setJoinedDate(getMinDate()); // Default new subscriber joined date to today
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
   * Validates the Expiry Date field in real-time for Paid plans.
   * @param {string} date - The current value of the expiry date input.
   * @param {string} currentPlanType - The currently selected plan type.
   */
  const validateExpiryDate = (date, currentPlanType) => {
    let error = '';
    if (currentPlanType === 'Paid') {
      if (!date) {
        error = 'Expiry Date is required for Paid Plan.';
      } else {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate comparison
        if (selectedDate < today) {
          error = 'Expiry Date cannot be in the past.';
        }
      }
    }
    setFormErrors(prevErrors => ({ ...prevErrors, expiryDate: error }));
  };

  /**
   * Validates the Joined Date field in real-time.
   * @param {string} date - The current value of the joined date input.
   */
  const validateJoinedDate = (date) => {
    let error = '';
    if (!date) {
      error = 'Joined Date is required.';
    } else {
      const selectedDate = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        error = 'Joined Date cannot be in the future.';
      }
    }
    setFormErrors(prevErrors => ({ ...prevErrors, joinedDate: error }));
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
    } else if (name.length > 20) { // Max 20 characters
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
    if (planType === 'Paid') {
      if (!expiryDate) {
        errors.expiryDate = 'Expiry Date is required for Paid Plan.';
      } else {
        const selectedDate = new Date(expiryDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (selectedDate < today) {
          errors.expiryDate = 'Expiry Date cannot be in the past.';
        }
      }
    }
    if (!joinedDate) {
      errors.joinedDate = 'Joined Date is required.';
    } else {
      const selectedDate = new Date(joinedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate > today) {
        errors.joinedDate = 'Joined Date cannot be in the future.';
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
   * Handles the form submission to add or update a subscriber.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateFormOnSubmit()) {
      console.log('Form validation failed. Please correct the errors.');
      return;
    }

    const randomName = dummyNames[Math.floor(Math.random() * dummyNames.length)];

    const calculatedExpiryDate = planType === 'Paid' ? expiryDate : 'N/A';
    const calculatedRemainingDays = planType === 'Paid' ? calculateRemainingDays(expiryDate) : 'N/A';
    const calculatedStatus = planType === 'Paid' ? getStatus(calculatedRemainingDays) : 'Active'; // Demo users are always active

    const newSubscriber = {
      userId: editSubscriber ? editSubscriber.userId : generateAlphanumericId(6),
      tradingViewId,
      name: randomName, // Assign a random dummy name
      phoneEmail,
      referralId: referralId || '-',
      plan: planType,
      expiryDate: calculatedExpiryDate,
      joinedDate: joinedDate, // Use the state variable for joinedDate
      status: calculatedStatus,
      remainingDays: calculatedRemainingDays,
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
        // Handle sorting for expiryDate, and joinedDate as dates/numbers
        if (sortConfig.key === 'expiryDate' || sortConfig.key === 'joinedDate') {
          const dateA = new Date(a[sortConfig.key]).getTime();
          const dateB = new Date(b[sortConfig.key]).getTime();
          if (dateA < dateB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (dateA > dateB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }
        // Removed remainingDays from sorting logic
        if (sortConfig.key === 'remainingDays') {
          const daysA = typeof a[sortConfig.key] === 'number' ? a[sortConfig.key] : -Infinity;
          const daysB = typeof b[sortConfig.key] === 'number' ? b[sortConfig.key] : -Infinity;
          if (daysA < daysB) return sortConfig.direction === 'ascending' ? -1 : 1;
          if (daysA > daysB) return sortConfig.direction === 'ascending' ? 1 : -1;
          return 0;
        }


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
      // remainingDays: 'Remaining Days', // Removed for export
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
        .map(key => {
          let value = row[key];
          if (key === 'expiryDate' || key === 'joinedDate') {
            value = formatDate(value); // Format date for export
          } else if (key === 'status') {
            value = getStatus(calculateRemainingDays(row.expiryDate)); // Calculate for export
          }
          return `"${String(value).replace(/"/g, '""')}"`;
        })
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
        fileContent += `Joined Date: ${formatDate(sub.joinedDate)}\n`;
        if (sub.plan === 'Paid') {
          fileContent += `Expiry Date: ${formatDate(sub.expiryDate)}\n`;
          // fileContent += `Remaining Days: ${calculateRemainingDays(sub.expiryDate)}\n`; // Removed for PDF export
        }
        fileContent += `Status: ${getStatus(calculateRemainingDays(sub.expiryDate))}\n`; // Updated for PDF export
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

  // Helper function to format date to DD/MM/YYYY
  const formatDate = (dateString) => {
    if (!dateString || dateString === 'N/A') return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Invalid Date'; // Handle invalid date strings
    return date.toLocaleDateString('en-GB'); // Formats to DD/MM/YYYY
  };

  // Get today's date in YYYY-MM-DD format for min/max attribute of date input
  const getMinDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
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
                className="column-toggle-dropdown-custom" // Using custom class from index.css
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

        <table className="table-custom divide-y divide-border-base"> {/* Apply table-custom class for styling */}
          <thead className="bg-bg-base">
            <tr>
              {visibleColumns.userId && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer table-sticky-col" onClick={() => sortData('userId')}>User ID {getSortIcon('userId')}</th>}
              {visibleColumns.tradingViewId && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('tradingViewId')}>TradingView ID {getSortIcon('tradingViewId')}</th>}
              {visibleColumns.name && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('name')}>Name {getSortIcon('name')}</th>}
              {visibleColumns.phoneEmail && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('phoneEmail')}>Phone/Email {getSortIcon('phoneEmail')}</th>}
              {visibleColumns.referralId && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('referralId')}>Referral ID {getSortIcon('referralId')}</th>}
              {visibleColumns.plan && <th style={{ width: '80px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('plan')}>Plan {getSortIcon('plan')}</th>}
              {visibleColumns.expiryDate && <th style={{ width: '120px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('expiryDate')}>Expiry Date {getSortIcon('expiryDate')}</th>}
              {visibleColumns.remainingDays && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('remainingDays')}>Remaining Days {getSortIcon('remainingDays')}</th>}
              {visibleColumns.joinedDate && <th style={{ width: '120px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('joinedDate')}>Joined Date {getSortIcon('joinedDate')}</th>}
              {visibleColumns.status && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th style={{ width: '100px' }} className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {sortedAndFilteredData.map((sub, index) => (
              <tr key={sub.userId || index}>
                {visibleColumns.userId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base table-sticky-col">{sub.userId}</td>}
                {visibleColumns.tradingViewId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.tradingViewId}</td>}
                {visibleColumns.name && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.name}</td>}
                {visibleColumns.phoneEmail && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.phoneEmail}</td>}
                {visibleColumns.referralId && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.referralId || '-'}</td>}
                {visibleColumns.plan && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.plan}</td>}
                {visibleColumns.expiryDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{formatDate(sub.expiryDate)}</td>}
                {visibleColumns.remainingDays && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{calculateRemainingDays(sub.expiryDate)}</td>}
                {visibleColumns.joinedDate && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{formatDate(sub.joinedDate)}</td>}
                {visibleColumns.status && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      getStatus(calculateRemainingDays(sub.expiryDate)) === 'Active' ? 'bg-accent-light text-accent' : (getStatus(calculateRemainingDays(sub.expiryDate)) === 'Inactive' ? 'bg-danger-light text-danger' : 'bg-warning-light text-warning')
                    }`}>
                      {getStatus(calculateRemainingDays(sub.expiryDate))}
                    </span>
                  </td>
                )}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleOpenForm(sub)}
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
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
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
                    validateTradingViewId(e.target.value);
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.tradingViewId ? 'border-danger' : 'border-border-base'}`}
                  maxLength="6"
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
                    validateName(e.target.value);
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.name ? 'border-danger' : 'border-border-base'}`}
                  maxLength="20" // MaxLength updated to 20
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
                    validatePhoneEmail(e.target.value);
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
                    validateReferralId(e.target.value);
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.referralId ? 'border-danger' : 'border-border-base'}`}
                  maxLength="6"
                />
                {formErrors.referralId && <p className="text-danger text-xs mt-1">{formErrors.referralId}</p>}
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
                      setExpiryDate('');
                      validateExpiryDate('', 'Demo');
                    } else {
                      validateExpiryDate(expiryDate, e.target.value);
                    }
                  }}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="Demo">Demo</option>
                  <option value="Paid">Paid</option>
                </select>
              </div>
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
                      validateExpiryDate(e.target.value, planType);
                    }}
                    className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.expiryDate ? 'border-danger' : 'border-border-base'}`}
                    min={getMinDate()} // Set min date to today
                    required={planType === 'Paid'}
                  />
                  {formErrors.expiryDate && <p className="text-danger text-xs mt-1">{formErrors.expiryDate}</p>}
                </div>
              )}
              <div>
                <label htmlFor="joinedDate" className="block text-sm font-medium text-text-base mb-1">
                  Joined Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="joinedDate"
                  value={joinedDate}
                  onChange={(e) => {
                    setJoinedDate(e.target.value);
                    validateJoinedDate(e.target.value);
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.joinedDate ? 'border-danger' : 'border-border-base'}`}
                  max={getMinDate()} // Set max date to today (current date)
                  required
                />
                {formErrors.joinedDate && <p className="text-danger text-xs mt-1">{formErrors.joinedDate}</p>}
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
