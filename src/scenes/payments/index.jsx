// scenes/payments/index.jsx
import React, { useState } from 'react';
import { Upload, CreditCard, X, Download, RefreshCw, CheckCircle, SlidersHorizontal } from 'lucide-react';

/**
 * Payments component manages payment methods, allows QR upload, and displays payment history.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of payment record data.
 */
function Payments({ data = [] }) {
  const [isFormOpen, setIsFormOpen] = useState(false); // eslint-disable-line no-unused-vars
  const [formErrors, setFormErrors] = useState({});

  // Form state for adding new payment method/QR
  const [upiId, setUpiId] = useState('');
  const [qrFile, setQrFile] = useState(null);
  const [paymentMethodTags, setPaymentMethodTags] = useState(''); // Comma-separated tags

  // Dummy filter/sort state for table
  const [filterText, setFilterText] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [visibleColumns, setVisibleColumns] = useState({
    id: true,
    upiUsed: true,
    user: true,
    amount: true,
    date: true,
    status: true,
    actions: true,
  });
  const [isColumnToggleOpen, setIsColumnToggleOpen] = useState(false);

  const handleOpenForm = () => { // eslint-disable-line no-unused-vars
    setIsFormOpen(true);
    setFormErrors({});
    setUpiId('');
    setQrFile(null);
    setPaymentMethodTags('');
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormErrors({});
  };

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
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const newPaymentMethod = {
      upiId,
      qrImageUrl: qrFile ? URL.createObjectURL(qrFile) : null, // Placeholder for QR image URL
      tags: paymentMethodTags.split(',').map(tag => tag.trim()).filter(tag => tag),
      isActive: true, // Assuming new methods are active
      addedDate: new Date().toISOString().split('T')[0],
    };
    console.log('Adding New Payment Method:', newPaymentMethod);
    // In a real app, send to API, handle QR image upload
    handleCloseForm();
  };

  const handleRefund = (paymentId) => {
    console.log('Initiating refund for:', paymentId);
    // Call API to process refund
  };

  const handleAcknowledge = (paymentId) => {
    console.log('Acknowledging payment:', paymentId);
    // Call API to acknowledge payment
  };

  const sortData = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedAndFilteredData = [...data]
    .filter(payment =>
      Object.values(payment).some(val =>
        String(val).toLowerCase().includes(filterText.toLowerCase())
      )
    )
    .sort((a, b) => {
      if (sortConfig.key) {
        const valA = String(a[sortConfig.key]).toLowerCase();
        const valB = String(b[sortConfig.key]).toLowerCase();

        if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
      }
      return 0;
    });

    const handleColumnToggle = (column) => {
        setVisibleColumns(prev => ({
          ...prev,
          [column]: !prev[column],
        }));
      };

    const handleExport = (format) => {
        console.log(`Exporting payments to ${format}...`);
    };

    const getSortIcon = (key) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? '▲' : '▼';
    };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <CreditCard className="w-8 h-8 text-primary" /> Payments Management
      </h2>

      {/* QR Upload & Active UPI IDs */}
      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-4">Payment Methods</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border-base rounded-lg p-4 bg-bg-base flex flex-col items-center justify-center text-center">
            <h4 className="font-semibold text-secondary mb-2">Upload New QR Code</h4>
            <div className="w-32 h-32 border-2 border-dashed border-border-base rounded-lg flex items-center justify-center mb-3">
                {qrFile ? (
                    <img src={URL.createObjectURL(qrFile)} alt="QR Preview" className="max-w-full max-h-full object-contain" />
                ) : (
                    <Upload className="w-10 h-10 text-text-light" />
                )}
            </div>
            <input
              type="file"
              accept=".png, .jpg, .jpeg"
              onChange={(e) => setQrFile(e.target.files[0])}
              className="w-full text-text-base file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer mb-2"
            />
            {formErrors.qrFile && <p className="text-danger text-sm mt-1">{formErrors.qrFile}</p>}
            <input
              type="text"
              placeholder="UPI ID (e.g., yourname@upi)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full p-2 border border-border-base rounded-md bg-bg-card text-text-base focus:ring-primary focus:border-primary outline-none mb-2"
            />
            {formErrors.upiId && <p className="text-danger text-sm mt-1">{formErrors.upiId}</p>}
            <input
              type="text"
              placeholder="Tags (e.g., GPay, Paytm, comma-separated)"
              value={paymentMethodTags}
              onChange={(e) => setPaymentMethodTags(e.target.value)}
              className="w-full p-2 border border-border-base rounded-md bg-bg-card text-text-base focus:ring-primary focus:border-primary outline-none mb-3"
            />
            <button onClick={handleFormSubmit} className="action-button-custom w-full">Add Payment Method</button>
          </div>

          <div className="border border-border-base rounded-lg p-4 bg-bg-base">
            <h4 className="font-semibold text-secondary mb-2">Active UPI IDs / Payment Methods</h4>
            <ul className="space-y-2 text-text-base">
              <li><span className="font-medium">you@bhimupi</span> (BHIM)</li>
              <li><span className="font-medium">tradingdash@paytm</span> (Paytm, GPay)</li>
              {/* Dummy active UPIs */}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment History Table */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        Payment History
      </h3>
      <div className="kpi-card-custom overflow-x-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 p-2 gap-4">
          <input
            type="text"
            placeholder="Filter payment history..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="p-2 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none flex-grow"
          />
          <div className="flex space-x-2 relative">
            <button
              onClick={() => setIsColumnToggleOpen(!isColumnToggleOpen)}
              className="action-button-custom py-2 px-4 bg-accent flex items-center gap-2"
            >
              <SlidersHorizontal className="w-5 h-5" /> Columns
            </button>
            {isColumnToggleOpen && (
              <div className="absolute top-full right-0 mt-2 bg-bg-card border border-border-base rounded-lg shadow-strong z-10 p-4">
                {Object.keys(visibleColumns).map(colKey => (
                  <label key={colKey} className="flex items-center space-x-2 text-text-base py-1">
                    <input
                      type="checkbox"
                      checked={visibleColumns[colKey]}
                      onChange={() => handleColumnToggle(colKey)}
                      className="form-checkbox text-primary rounded"
                    />
                    <span>{colKey.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
                  </label>
                ))}
              </div>
            )}
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
            {sortedAndFilteredData.map((payment, index) => (
              <tr key={payment.id || index}>
                {visibleColumns.id && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.id}</td>}
                {visibleColumns.upiUsed && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.upiUsed}</td>}
                {visibleColumns.user && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.user}</td>}
                {visibleColumns.amount && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.amount}</td>}
                {visibleColumns.date && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{payment.date}</td>}
                {visibleColumns.status && <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    payment.status === 'Completed' ? 'bg-accent-light text-accent' : (payment.status === 'Pending' ? 'bg-warning-light text-warning' : 'bg-danger-light text-danger')
                  }`}>
                    {payment.status}
                  </span>
                </td>}
                {visibleColumns.actions && (
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleAcknowledge(payment.id)}
                      className="text-primary hover:text-primary-dark mr-3 transition-colors"
                      aria-label={`Acknowledge ${payment.id}`}
                    >
                      <CheckCircle className="w-5 h-5 inline" />
                    </button>
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
