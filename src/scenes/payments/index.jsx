import React, { useState } from 'react';
import { Upload, CreditCard, X, Download, RefreshCw, CheckCircle, SlidersHorizontal } from 'lucide-react';

/**
 * Payments component manages payment methods, allows QR upload, and displays payment history.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of payment record data.
 */
function Payments({ data = [] }) {
  // State to control the visibility of the add new payment method form modal.
  // eslint-disable-next-line no-unused-vars
  const [isFormOpen, setIsFormOpen] = useState(false); 
  // State to store validation errors for the payment method form.
  const [formErrors, setFormErrors] = useState({});

  // States for the form inputs for adding new payment methods.
  const [upiId, setUpiId] = useState('');
  const [qrFile, setQrFile] = useState(null); // Stores the selected QR image file object
  const [paymentMethodTags, setPaymentMethodTags] = useState(''); // Comma-separated tags for the payment method

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

  /**
   * Opens the add new payment method form modal.
   * Resets all form fields and clears previous validation errors.
   */
  // eslint-disable-next-line no-unused-vars
  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormErrors({});
    // Reset form fields
    setUpiId('');
    setQrFile(null);
    setPaymentMethodTags('');
  };

  /**
   * Closes the add new payment method form modal and clears errors.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormErrors({});
  };

  /**
   * Validates the form fields for adding a new payment method.
   * Checks for required UPI ID and valid image type for QR file.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};
    if (!upiId.trim()) {
      errors.upiId = 'UPI ID is required.';
    }
    if (qrFile) {
        const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        if (!allowedTypes.includes(qrFile.type)) {
            errors.qrFile = 'Only PNG/JPG images are allowed for QR.';
        }
    }
    setFormErrors(errors); // Update form errors state
    return Object.keys(errors).length === 0; // Return true if no errors
  };

  /**
   * Handles the submission of the new payment method form.
   * Performs validation and logs the new payment method data.
   * In a real application, this would send data (including QR image) to an API.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    const newPaymentMethod = {
      upiId,
      // Create a temporary URL for QR image preview. In a real app, upload to storage and get permanent URL.
      qrImageUrl: qrFile ? URL.createObjectURL(qrFile) : null,
      tags: paymentMethodTags.split(',').map(tag => tag.trim()).filter(tag => tag), // Split tags by comma and trim whitespace
      isActive: true, // Assuming newly added methods are active
      addedDate: new Date().toISOString().split('T')[0], // Current date for added date
    };
    console.log('Adding New Payment Method:', newPaymentMethod);
    // In a real application, you would send this 'newPaymentMethod' object to your backend API.
    // If QR file is present, you would also handle its upload (e.g., to Firebase Storage, S3).

    handleCloseForm(); // Close the form after successful submission
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
  const sortedAndFilteredData = [...data] // Create a shallow copy to avoid mutating original data
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
    const handleColumnToggle = (column) => {
        setVisibleColumns(prev => ({
            ...prev,
            [column]: !prev[column], // Toggle the boolean value for the specified column.
        }));
    };

    /**
     * Placeholder function for exporting payment history data.
     * @param {string} format - The desired export format (e.g., 'xls', 'pdf').
     */
    const handleExport = (format) => {
        console.log(`Exporting payments to ${format}...`);
        // You'd use a library like 'sheetjs' for Excel or 'jspdf' for PDF here.
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
        <h3 className="dashboard-widget-title mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Section for Uploading New QR Code */}
          <div className="border border-border-base rounded-lg p-4 bg-bg-base flex flex-col items-center justify-center text-center">
            <h4 className="font-semibold text-secondary mb-2">Upload New QR Code</h4>
            {/* QR Code preview area */}
            <div className="w-32 h-32 border-2 border-dashed border-border-base rounded-lg flex items-center justify-center mb-3">
                {/* Conditionally display QR image preview or upload icon */}
                {qrFile ? (
                    <img src={URL.createObjectURL(qrFile)} alt="QR Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                    <Upload className="w-10 h-10 text-text-light" />
                )}
            </div>
            {/* Input for QR file upload */}
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setQrFile(e.target.files[0])}
              className="w-full text-text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer mb-2"
              aria-label="Upload QR code image"
            />
            {formErrors.qrFile && <p className="text-danger text-sm mt-1">{formErrors.qrFile}</p>} {/* QR file error message */}
            {/* Input for UPI ID */}
            <input
              type="text"
              placeholder="UPI ID (e.g., yourname@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-2 border border-border-base rounded-md bg-bg-card text-text-base focus:ring-primary focus:border-primary outline-none mb-2"
              aria-label="UPI ID"
            />
            {formErrors.upiId && <p className="text-danger text-sm mt-1">{formErrors.upiId}</p>} {/* UPI ID error message */}
            {/* Input for Payment Method Tags */}
            <input
              type="text"
              placeholder="Tags (e.g., GPay, Paytm, comma-separated)"
              value={paymentMethodTags}
              onChange={(e) => setPaymentMethodTags(e.target.value)}
              className="w-full p-2 border border-border-base rounded-md bg-bg-card text-text-base focus:ring-primary focus:border-primary outline-none mb-3"
              aria-label="Payment method tags"
            />
            {/* Button to add the new payment method */}
            <button onClick={handleFormSubmit} className="action-button-custom w-full">Add Payment Method</button>
          </div>

          {/* Section for Displaying Active UPI IDs / Payment Methods */}
          <div className="border border-border-base rounded-lg p-4 bg-bg-base">
            <h4 className="font-semibold text-secondary mb-2">Active UPI IDs / Payment Methods</h4>
            <ul className="space-y-2 text-text-base">
              <li><span className="font-medium">you@bhimupi</span> (BHIM)</li>
              <li><span className="font-medium">tradingdash@paytm</span> (Paytm, GPay)</li>
              {/* Dummy active UPIs - In a real app, this list would be dynamically populated */}
            </ul>
          </div>
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
                className="absolute top-full right-0 mt-2 bg-card-bg border border-border-base rounded-lg shadow-strong z-10 p-4 min-w-[150px]"
              >
                {/* Map over visibleColumns keys to render checkboxes */}
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1 cursor-pointer hover:text-primary">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggle(colKey)}
                      className="form-checkbox text-primary rounded"
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
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              {/* Table Headers: Conditionally rendered based on visibleColumns */}
              {visibleColumns.id && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('id')}>Payment ID {getSortIcon('id')}</th>}
              {visibleColumns.upiUsed && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('upiUsed')}>UPI Used {getSortIcon('upiUsed')}</th>}
              {visibleColumns.user && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('user')}>User {getSortIcon('user')}</th>}
              {visibleColumns.amount && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('amount')}>Amount {getSortIcon('amount')}</th>}
              {visibleColumns.date && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('date')}>Date {getSortIcon('date')}</th>}
              {visibleColumns.status && <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider cursor-pointer" onClick={() => sortData('status')}>Status {getSortIcon('status')}</th>}
              {visibleColumns.actions && <th className="px-6 py-3 text-right text-xs font-medium text-text-light uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the sorted and filtered data to render each payment row */}
            {sortedAndFilteredData.map((payment, index) => (
              <tr key={payment.id || index}>
                {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.id}</td>}
                {visibleColumns.upiUsed && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.upiUsed}</td>}
                {visibleColumns.user && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.user}</td>}
                {visibleColumns.amount && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.amount}</td>}
                {visibleColumns.date && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.date}</td>}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  {/* Dynamic styling for payment status */}
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Completed' ? 'bg-accent-light text-accent' : (payment.status === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger')
                  }`}>
                    {payment.status}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
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

export default Payments;
