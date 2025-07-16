import React, { useState } from 'react';
import { Upload, CreditCard, X, Download, RefreshCw, CheckCircle, SlidersHorizontal, Edit, Trash2, PlusCircle } from 'lucide-react';

/**
 * Payments component manages payment methods, allows QR upload, and displays payment history.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Initial array of payment record data.
 */
function Payments({ data = [] }) {
  // State to manage the actual list of payment history records
  const [paymentHistoryData, setPaymentHistoryData] = useState(data);

  // States for adding/editing payment methods (for the QR upload section)
  // isPaymentMethodFormOpen is no longer needed as the form will be always visible in its own container
  const [editPaymentMethod, setEditPaymentMethod] = useState(null); // Stores the payment method being edited
  const [formUpiId, setFormUpiId] = useState('');
  const [formQrFile, setFormQrFile] = useState(null); // Stores the selected QR image file object for the form
  const [formPaymentMethodTags, setFormPaymentMethodTags] = useState('');
  const [formErrors, setFormErrors] = useState({});

  // State for Delete Confirmation Modal for payment history records
  const [showPaymentHistoryDeleteConfirm, setShowPaymentHistoryDeleteConfirm] = useState(false);
  const [paymentHistoryToDelete, setPaymentHistoryToDelete] = useState(null); // Stores the ID of the payment history record to delete

  // State for Delete Confirmation Modal for active payment methods
  const [showPaymentMethodDeleteConfirm, setShowPaymentMethodDeleteConfirm] = useState(false);
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState(null); // Stores the ID of the payment method to delete

  // State for filtering text input for the payment history table.
  const [filterText, setFilterText] = useState('');
  // State for sorting configuration: { key: 'columnKey', direction: 'ascending' | 'descending' }.
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  // State to manage the visibility of each table column in the payment history.
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    upiUsed: true,
    user: true,
    amount: true,
    date: true,
    status: true,
    actions: true,
  });
  // State to control the open/close state of the column toggle dropdown for payment history.
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  // NEW STATES FOR ADD PAYMENT RECORD MODAL
  const [isAddPaymentRecordFormOpen, setIsAddPaymentRecordFormOpen] = useState(false);
  const [paymentRecordFormUpiId, setPaymentRecordFormUpiId] = useState('');
  const [newPaymentRecordAmount, setNewPaymentRecordAmount] = useState('');
  const [newPaymentRecordUser, setNewPaymentRecordUser] = useState('');
  const [newPaymentRecordDate, setNewPaymentRecordDate] = useState(new Date().toISOString().split('T')[0]); // Default to current date
  const [newPaymentRecordStatus, setNewPaymentRecordStatus] = useState('Completed'); // Default status
  const [newPaymentRecordFormErrors, setNewPaymentRecordFormErrors] = useState({});


  // Dummy state for active UPI IDs / Payment Methods
  // In a real application, this would likely come from a backend API
  const [activeUpiMethods, setActiveUpiMethods] = useState([
    { id: 'upi1', upiId: 'you@bhimupi', tags: ['BHIM'], qrImageUrl: 'https://placehold.co/100x100/random/white?text=BHIM' },
    { id: 'upi2', upiId: 'tradingdash@paytm', tags: ['Paytm', 'GPay'], qrImageUrl: 'https://placehold.co/100x100/random/white?text=Paytm' },
  ]);

  /**
   * Resets the payment method form fields.
   */
  const resetPaymentMethodForm = () => {
    setEditPaymentMethod(null);
    setFormUpiId('');
    setFormQrFile(null);
    setFormPaymentMethodTags('');
    setFormErrors({});
  };

  /**
   * Validates the form fields for adding/editing a payment method.
   * Checks for required UPI ID and valid image type for QR file.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validatePaymentMethodForm = () => {
    const errors = {};
    if (!formUpiId.trim()) {
      errors.upiId = 'UPI ID is required.';
    }
    // Only validate QR file if it's a new file being uploaded or if it's required for edit
    if (formQrFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(formQrFile.type)) {
        errors.qrFile = 'Only PNG/JPG images are allowed for QR.';
      }
    } else if (!editPaymentMethod && !formQrFile) {
        // QR is optional for new methods for now, no error if not provided
    }

    setFormErrors(errors); // Update form errors state
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  /**
   * Handles the submission of the new payment method form.
   * Performs validation and adds/updates the payment method.
   * @param {Event} e - The form submission event.
   */
  const handlePaymentMethodFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!validatePaymentMethodForm()) {
      return; // Stop if validation fails
    }

    const newMethod = {
      id: editPaymentMethod ? editPaymentMethod.id : `upi${Date.now()}`,
      upiId: formUpiId,
      tags: formPaymentMethodTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      qrImageUrl: formQrFile ? URL.createObjectURL(formQrFile) : (editPaymentMethod ? editPaymentMethod.qrImageUrl : null), // Keep old URL if no new file
      isActive: true, // Assuming newly added/edited methods are active
      addedDate: new Date().toISOString().split('T')[0],
    };

    if (editPaymentMethod) {
      setActiveUpiMethods(activeUpiMethods.map(method => method.id === newMethod.id ? newMethod : method));
      console.log('Payment Method Updated:', newMethod);
    } else {
      setActiveUpiMethods(prevMethods => [...prevMethods, newMethod]);
      console.log('New Payment Method Added:', newMethod);
    }

    resetPaymentMethodForm(); // Reset the form after successful submission
  };

  /**
   * Handles editing an existing payment method by populating the form.
   * @param {object} method - The payment method object to edit.
   */
  const handleEditPaymentMethod = (method) => {
    setEditPaymentMethod(method);
    setFormUpiId(method.upiId);
    setFormQrFile(null); // Clear file input, user can re-upload if needed
    setFormPaymentMethodTags(method.tags.join(', '));
    setFormErrors({}); // Clear any previous errors
  };


  /**
   * Opens the delete confirmation modal for an active payment method.
   * @param {string} methodId - The ID of the payment method to delete.
   */
  const handleDeletePaymentMethodClick = (methodId) => {
    setPaymentMethodToDelete(methodId);
    setShowPaymentMethodDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of an active payment method.
   */
  const confirmDeletePaymentMethod = () => {
    setActiveUpiMethods(activeUpiMethods.filter(method => method.id !== paymentMethodToDelete));
    console.log('Deleting payment method with ID:', paymentMethodToDelete);
    setShowPaymentMethodDeleteConfirm(false);
    setPaymentMethodToDelete(null);
  };

  /**
   * Cancels the deletion process for an active payment method.
   */
  const cancelDeletePaymentMethod = () => {
    setShowPaymentMethodDeleteConfirm(false);
    setPaymentMethodToDelete(null);
  };

  /**
   * Opens the add payment record form modal, pre-filling the UPI ID.
   * @param {string} upiId - The UPI ID to pre-fill in the form.
   */
  const handleAddPaymentRecordClick = (upiId) => {
    setIsAddPaymentRecordFormOpen(true);
    setPaymentRecordFormUpiId(upiId);
    setNewPaymentRecordAmount('');
    setNewPaymentRecordUser('');
    setNewPaymentRecordDate(new Date().toISOString().split('T')[0]); // Set current date by default
    setNewPaymentRecordStatus('Completed'); // Default status
    setNewPaymentRecordFormErrors({});
  };

  /**
   * Closes the add payment record form modal.
   */
  const handleCloseAddPaymentRecordForm = () => {
    setIsAddPaymentRecordFormOpen(false);
    setNewPaymentRecordAmount('');
    setNewPaymentRecordUser('');
    setNewPaymentRecordDate(new Date().toISOString().split('T')[0]); // Reset to current date on close
    setNewPaymentRecordStatus('Completed');
    setNewPaymentRecordFormErrors({});
  };

  /**
   * Validates the add payment record form.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateAddPaymentRecordForm = () => {
    const errors = {};
    if (!newPaymentRecordAmount.trim() || isNaN(parseFloat(newPaymentRecordAmount)) || parseFloat(newPaymentRecordAmount) <= 0) {
      errors.amount = 'Valid amount is required.';
    }
    if (!newPaymentRecordUser.trim()) {
      errors.user = 'User name/ID is required.';
    }
    if (!newPaymentRecordDate) {
      errors.date = 'Date is required.';
    } else {
      const selectedDate = new Date(newPaymentRecordDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Normalize today to start of day for accurate comparison
      if (selectedDate > today) { // Check if the selected date is in the future
        errors.date = 'Date cannot be in the future.';
      }
    }
    setNewPaymentRecordFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles the submission of the add payment record form.
   * Adds the new payment record to the payment history data.
   * @param {Event} e - The form submission event.
   */
  const handleAddPaymentRecordSubmit = (e) => {
    e.preventDefault();
    if (!validateAddPaymentRecordForm()) {
      return;
    }

    const newRecord = {
      id: `PAY${Date.now()}`, // Unique ID for payment record, now in capital letters
      upiUsed: paymentRecordFormUpiId,
      user: newPaymentRecordUser,
      amount: parseFloat(newPaymentRecordAmount).toFixed(2),
      date: newPaymentRecordDate,
      status: newPaymentRecordStatus,
    };

    setPaymentHistoryData(prevData => [...prevData, newRecord]);
    console.log('New Payment Record Added:', newRecord);
    handleCloseAddPaymentRecordForm();
  };


  /**
   * Placeholder function to handle refund initiation for a payment.
   * In a real application, this would trigger an API call to process the refund.
   * @param {string} paymentId - The ID of the payment to refund.
   */
  const handleRefund = (paymentId) => {
    console.log('Initiating refund for:', paymentId);
    // Implement API call for refund processing here.
  };

  /**
   * Placeholder function to acknowledge a payment.
   * In a real application, this would trigger an API call to mark the payment as acknowledged/processed.
   * @param {string} paymentId - The ID of the payment to acknowledge.
   */
  const handleAcknowledge = (paymentId) => {
    console.log('Acknowledging payment:', paymentId);
    // Implement API call for payment acknowledgment here.
  };

  /**
   * Opens the delete confirmation modal for a payment history record.
   * @param {string} paymentId - The ID of the payment history record to delete.
   */
  const handleDeletePaymentHistoryClick = (paymentId) => {
    setPaymentHistoryToDelete(paymentId);
    setShowPaymentHistoryDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of a payment history record.
   */
  const confirmDeletePaymentHistory = () => {
    setPaymentHistoryData(paymentHistoryData.filter(payment => payment.id !== paymentHistoryToDelete));
    console.log('Deleting payment history record with ID:', paymentHistoryToDelete);
    setShowPaymentHistoryDeleteConfirm(false);
    setPaymentHistoryToDelete(null);
  };

  /**
   * Cancels the deletion process for a payment history record.
   */
  const cancelDeletePaymentHistory = () => {
    setShowPaymentHistoryDeleteConfirm(false);
    setPaymentHistoryToDelete(null);
  };

  /**
   * Toggles the sorting direction for a given column key in the payment history table.
   * @param {string} key - The column key to sort by.
   */
  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  /**
   * Filters and sorts the payment history data based on current filterText and sortConfig.
   * @returns {Array<object>} The filtered and sorted array of payment records.
   */
  const sortedAndFilteredData = [...paymentHistoryData] // Create a shallow copy to avoid mutating original data
    .filter(payment =>
      // Check if any string value in the payment object includes the filterText (case-insensitive).
      Object.values(payment).some(val =>
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
   * Toggles the visibility of a specific column in the payment history table.
   * @param {string} column - The key of the column to toggle.
   */
  const handleColumnToggleVisibility = (column) => { // Renamed to avoid conflict with local sortData's handleColumnToggle
    setVisibleColumns(prev => ({
      ...prev,
      [column]: !prev[column], // Toggle the boolean value for the specified column.
    }));
  };

  /**
   * Helper function to format date to DD/MM/YYYY.
   * @param {string} dateString - The date string to format (e.g., 'YYYY-MM-DD').
   * @returns {string} Formatted date string (DD/MM/YYYY).
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  /**
   * Placeholder function for exporting payment history data.
   * @param {string} format - The desired export format (e.g., 'xls', 'pdf').
   */
  const handleExport = (format) => {
    let fileContent = '';
    let fileName = '';
    let mimeType = '';

    const displayHeaders = {
      id: 'Payment ID',
      upiUsed: 'UPI Used',
      user: 'User',
      amount: 'Amount',
      date: 'Date',
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
          if (key === 'amount') {
            value = `₹${parseFloat(value).toFixed(2)}`; // Ensure consistent formatting for export
          } else if (key === 'date') {
            value = formatDate(value); // Format date for export
          }
          return `"${String(value).replace(/"/g, '""')}"`; // Escape double quotes
        })
        .join(',')
    ).join('\n');

    if (format === 'xls') {
      fileContent = `${headers}\n${rows}`;
      fileName = 'payment_history.csv';
      mimeType = 'text/csv';
      console.log('Exporting payment history to XLS (CSV format).');
    } else if (format === 'pdf') {
      fileContent = 'Payment History Report\n\n';
      sortedAndFilteredData.forEach(payment => {
        fileContent += `Payment ID: ${payment.id}\n`;
        fileContent += `UPI Used: ${payment.upiUsed}\n`;
        fileContent += `User: ${payment.user}\n`;
        fileContent += `Amount: ₹${payment.amount}\n`; // Ensure Rupees symbol for PDF
        fileContent += `Date: ${formatDate(payment.date)}\n`; // Format date for PDF
        fileContent += `Status: ${payment.status}\n`;
        fileContent += '--------------------\n';
      });
      fileName = 'payment_history_report.txt';
      mimeType = 'text/plain';
      console.log('Exporting payment history to PDF (text format).');
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
        <CreditCard className="w-8 h-8 text-primary" /> Payments Management {/* Icon for payments */}
      </h2>

      {/* QR Upload & Active UPI IDs Section */}
      <div className="kpi-card-custom p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="dashboard-widget-title">Payment Methods</h3>
          {/* Removed "Add New Method" button here as the form will be inline */}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Section for Adding/Editing New QR Code (inline form) */}
          <div className="border border-border-base rounded-lg p-4 bg-bg-base flex flex-col items-center justify-center text-center">
            <h4 className="font-semibold text-secondary mb-2">{editPaymentMethod ? 'Edit Payment Method' : 'Add New Payment Method'}</h4>
            <form onSubmit={handlePaymentMethodFormSubmit} className="space-y-4 w-full"> {/* Added w-full here */}
              {/* QR Code preview area */}
              <div className="w-32 h-32 border-2 border-dashed border-border-base rounded-lg flex items-center justify-center mb-3 mx-auto"> {/* Added mx-auto for centering */}
                {/* Conditionally display QR image preview or upload icon */}
                {formQrFile ? (
                  <img src={URL.createObjectURL(formQrFile)} alt="QR Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                  editPaymentMethod && editPaymentMethod.qrImageUrl ? (
                    <img src={editPaymentMethod.qrImageUrl} alt="Current QR" className="max-w-full max-h-full object-contain" />
                  ) : (
                    <Upload className="w-10 h-10 text-text-light" />
                  )
                )}
              </div>
              {/* Input for QR file upload */}
              <div> {/* Wrapped file input in a div for consistent spacing */}
                <label htmlFor="qrFile" className="block text-sm font-medium text-text-base mb-1">
                  Upload QR Code (PNG/JPG)
                </label>
                <input
                  type="file"
                  id="qrFile"
                  accept=".png, .jpg, .jpeg"
                  onChange={(e) => setFormQrFile(e.target.files[0])}
                  className="w-full text-text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                  aria-label="Upload QR code image"
                />
                {formErrors.qrFile && <p className="text-danger text-xs mt-1">{formErrors.qrFile}</p>} {/* QR file error message */}
              </div>
              {/* Input for UPI ID */}
              <div> {/* Wrapped input in a div for consistent spacing */}
                <label htmlFor="upiId" className="block text-sm font-medium text-text-base mb-1">
                  UPI ID <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="upiId"
                  placeholder="e.g., yourname@upi"
                  value={formUpiId}
                  onChange={(e) => setFormUpiId(e.target.value)}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.upiId ? 'border-danger' : 'border-border-base'}`}
                  aria-label="UPI ID"
                  required
                />
                {formErrors.upiId && <p className="text-danger text-xs mt-1">{formErrors.upiId}</p>} {/* UPI ID error message */}
              </div>
              {/* Input for Payment Method Tags */}
              <div> {/* Wrapped input in a div for consistent spacing */}
                <label htmlFor="paymentMethodTags" className="block text-sm font-medium text-text-base mb-1">
                  Tags (Optional, comma-separated)
                </label>
                <input
                  type="text"
                  id="paymentMethodTags"
                  placeholder="e.g., GPay, Paytm"
                  value={formPaymentMethodTags}
                  onChange={(e) => setFormPaymentMethodTags(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  aria-label="Payment method tags"
                />
              </div>
              {/* Button to add/update the new payment method */}
              <div className="form-actions-custom flex justify-end">
                <button type="submit" className="action-button-custom">
                  {editPaymentMethod ? 'Update Method' : 'Add Payment Method'}
                </button>
                {editPaymentMethod && (
                  <button type="button" onClick={resetPaymentMethodForm} className="action-button-custom cancel-button-custom">
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Section for Displaying Active UPI IDs / Payment Methods */}
          {activeUpiMethods.length > 0 ? (
            activeUpiMethods.map(method => (
              <div key={method.id} className="border border-border-base rounded-lg p-4 bg-bg-base flex flex-col items-center justify-center text-center relative">
                {method.qrImageUrl && (
                  <img src={method.qrImageUrl} alt="QR Code" className="w-24 h-24 object-contain mb-2 rounded-md" />
                )}
                <p className="font-semibold text-secondary mb-1">{method.upiId}</p>
                <p className="text-sm text-text-light">{method.tags.join(', ')}</p>
                <div className="absolute top-2 right-2 flex gap-1">
                  <button
                    onClick={() => handleEditPaymentMethod(method)}
                    className="text-primary hover:text-primary-dark transition-colors p-1 rounded-md"
                    aria-label={`Edit ${method.upiId}`}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeletePaymentMethodClick(method.id)}
                    className="text-danger hover:text-danger-dark transition-colors p-1 rounded-md"
                    aria-label={`Delete ${method.upiId}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                {/* NEW: Add Payment button for this UPI ID */}
                <button
                  onClick={() => handleAddPaymentRecordClick(method.upiId)}
                  className="action-button-custom mt-4 w-full"
                >
                  <PlusCircle className="w-5 h-5 mr-2" /> Add Payment
                </button>
              </div>
            ))
          ) : (
            // This message is now redundant as the form is always visible
            // <p className="text-text-light text-center col-span-full py-4">No active payment methods found. Add one!</p>
            null
          )}
        </div>
      </div>

      {/* Payment History Table Section */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        Payment History
      </h3>
      <div className="kpi-card-custom overflow-x-auto">
        {/* Table Controls (Filter, Column Toggle, Export) */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          {/* Search/Filter Input */}
          <input
            type="text"
            placeholder="Filter payment history..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
            aria-label="Filter payment history"
          />
          <div className="flex space-x-2 relative">
            {/* Column Toggle Button and Dropdown */}
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
              aria-expanded={isColumnToggleOpen}
              aria-controls="payment-history-column-toggle-dropdown"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {isColumnToggleOpen && (
              <div
                id="payment-history-column-toggle-dropdown"
                className="column-toggle-dropdown-custom" // Changed from absolute positioning to custom class
              >
                {/* Map over visibleColumns keys to render checkboxes */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggleVisibility(colKey)}
                      className="form-checkbox text-primary rounded"
                      disabled={colKey === 'actions'} // Actions column cannot be hidden
                    />
                    {/* Format column key from camelCase to Title Case */}
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

        {/* Payment History Table */}
        <table className="table-custom divide-y divide-border-base"> {/* Changed from min-w-full to table-custom */}
          <thead className="bg-bg-base">
            <tr>
              {/* Table Headers: Conditionally rendered based on visibleColumns */}
              {visibleColumns.id && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer table-sticky-col" onClick={() => sortData('id')}>Payment ID {getSortIcon('id')}</th>}
              {visibleColumns.upiUsed && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('upiUsed')}>UPI Used {getSortIcon('upiUsed')}</th>}
              {visibleColumns.user && <th style={{ width: '200px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('user')}>User {getSortIcon('user')}</th>}
              {visibleColumns.amount && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('amount')}>Amount {getSortIcon('amount')}</th>}
              {visibleColumns.date && <th style={{ width: '120px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('date')}>Date {getSortIcon('date')}</th>}
              {visibleColumns.status && <th style={{ width: '100px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th style={{ width: '150px' }} className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>} {/* Changed text-right to text-left */}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each payment row */}
            {sortedAndFilteredData.map((payment, index) => (
              <tr key={payment.id || index}>
                {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base table-sticky-col">{payment.id.toUpperCase()}</td>} {/* Display ID in uppercase */}
                {visibleColumns.upiUsed && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.upiUsed}</td>}
                {visibleColumns.user && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.user}</td>}
                {visibleColumns.amount && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">₹{parseFloat(payment.amount).toFixed(2)}</td>} {/* Ensure single Rupees symbol and 2 decimal places */}
                {visibleColumns.date && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{formatDate(payment.date)}</td>} {/* Format date to DD/MM/YYYY */}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  {/* Dynamic styling for payment status */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Completed' ? 'bg-accent-light text-accent' : (payment.status === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger')
                  }`}>
                    {payment.status}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-left"> {/* Changed text-right to text-left */}
                    {/* Acknowledge button */}
                    <button
                      onClick={() => handleAcknowledge(payment.id)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Acknowledge ${payment.id}`}
                    >
                      <CheckCircle className="w-5 h-5 inline" />
                    </button>
                    {/* Refund button */}
                    <button
                      onClick={() => handleRefund(payment.id)}
                      className="text-danger hover:text-danger-dark transition-colors"
                      aria-label={`Refund ${payment.id}`}
                    >
                      <RefreshCw className="w-5 h-5 inline" />
                    </button>
                    {/* Delete button for payment history record */}
                    <button
                      onClick={() => handleDeletePaymentHistoryClick(payment.id)}
                      className="text-danger hover:text-danger-dark transition-colors ml-3"
                      aria-label={`Delete payment ${payment.id}`}
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

      {/* NEW: Add Payment Record Form Modal */}
      {isAddPaymentRecordFormOpen && (
        <div className="modal"> {/* Changed className to "modal" */}
          <div className="modal-content"> {/* Changed className to "modal-content" */}
            {/* Close button for the form modal */}
            <button
              onClick={handleCloseAddPaymentRecordForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-6">Add New Payment Record</h3>
            <form onSubmit={handleAddPaymentRecordSubmit} className="space-y-4">
              <div>
                <label htmlFor="paymentRecordUpiId" className="block text-sm font-medium text-text-base mb-1">
                  UPI Used
                </label>
                <input
                  type="text"
                  id="paymentRecordUpiId"
                  value={paymentRecordFormUpiId}
                  className="w-full p-3 border rounded-md bg-bg-base text-text-base cursor-not-allowed"
                  readOnly
                />
              </div>
              <div>
                <label htmlFor="newPaymentRecordUser" className="block text-sm font-medium text-text-base mb-1">
                  User <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="newPaymentRecordUser"
                  value={newPaymentRecordUser}
                  onChange={(e) => setNewPaymentRecordUser(e.target.value)}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${newPaymentRecordFormErrors.user ? 'border-danger' : 'border-border-base'}`}
                  maxLength="20" // Added maxLength for User
                  required
                />
                {newPaymentRecordFormErrors.user && <p className="text-danger text-xs mt-1">{newPaymentRecordFormErrors.user}</p>}
              </div>
              <div>
                <label htmlFor="newPaymentRecordAmount" className="block text-sm font-medium text-text-base mb-1">
                  Amount <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="newPaymentRecordAmount"
                  value={newPaymentRecordAmount}
                  onChange={(e) => setNewPaymentRecordAmount(e.target.value)}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${newPaymentRecordFormErrors.amount ? 'border-danger' : 'border-border-base'}`}
                  step="0.01"
                  required
                />
                {newPaymentRecordFormErrors.amount && <p className="text-danger text-xs mt-1">{newPaymentRecordFormErrors.amount}</p>}
              </div>
              <div>
                <label htmlFor="newPaymentRecordDate" className="block text-sm font-medium text-text-base mb-1">
                  Date <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  id="newPaymentRecordDate"
                  value={newPaymentRecordDate}
                  onChange={(e) => setNewPaymentRecordDate(e.target.value)}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${newPaymentRecordFormErrors.date ? 'border-danger' : 'border-border-base'}`}
                  max={new Date().toISOString().split('T')[0]} // Set max date to today
                  required
                />
                {newPaymentRecordFormErrors.date && <p className="text-danger text-xs mt-1">{newPaymentRecordFormErrors.date}</p>}
              </div>
              <div>
                <label htmlFor="newPaymentRecordStatus" className="block text-sm font-medium text-text-base mb-1">
                  Status
                </label>
                <select
                  id="newPaymentRecordStatus"
                  value={newPaymentRecordStatus}
                  onChange={(e) => setNewPaymentRecordStatus(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="Completed">Completed</option>
                  <option value="Pending">Pending</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>
              <div className="form-actions-custom flex justify-end">
                <button type="submit" className="action-button-custom">
                  Add Payment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Payment History Record */}
      {showPaymentHistoryDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={cancelDeletePaymentHistory}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Deletion</h3>
            <p className="text-text-base mb-6">
              Are you sure you want to delete payment record ID: <span className="font-semibold text-danger">{paymentHistoryToDelete}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeletePaymentHistory}
                className="action-button-custom bg-danger hover:bg-danger-dark"
              >
                Delete
              </button>
              <button
                onClick={cancelDeletePaymentHistory}
                className="action-button-custom cancel-button-custom"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal for Active Payment Method */}
      {showPaymentMethodDeleteConfirm && (
        <div className="modal">
          <div className="modal-content">
            <button
              onClick={cancelDeletePaymentMethod}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Method Deletion</h3>
            <p className="text-text-base mb-6">
              Are you sure you want to delete this payment method? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDeletePaymentMethod}
                className="action-button-custom bg-danger hover:bg-danger-dark"
              >
                Delete
              </button>
              <button
                onClick={cancelDeletePaymentMethod}
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

export default Payments;
