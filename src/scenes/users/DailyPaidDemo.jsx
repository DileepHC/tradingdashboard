import React, { useState } from 'react';
import { PlusCircle, X, Users } from 'lucide-react';

/**
 * DailyPaidDemo component displays daily new subscribers and an admin form to add new ones.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of daily new subscriber data (from mockData.js).
 */
function DailyPaidDemo({ data = [] }) {
  // State to control the visibility of the add new subscriber form modal.
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State to store validation errors for the form.
  const [formErrors, setFormErrors] = useState({});

  // States for the form inputs.
  const [tradingViewId, setTradingViewId] = useState('');
  const [name, setName] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [referralId, setReferralId] = useState('');
  const [planType, setPlanType] = useState('Demo'); // Default new subscriber to 'Demo' plan.
  const [expiryDate, setExpiryDate] = useState(''); // Expiry date for paid plans.

  /**
   * Opens the add new subscriber form modal.
   * Resets all form fields and clears previous errors.
   */
  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormErrors({});
    // Reset form fields for a clean new entry form.
    setTradingViewId('');
    setName('');
    setPhoneEmail('');
    setReferralId('');
    setPlanType('Demo');
    setExpiryDate('');
  };

  /**
   * Closes the add new subscriber form modal and clears errors.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormErrors({});
  };

  /**
   * Validates the form fields before submission.
   * Checks for required fields, valid email/phone format, and future expiry date for paid plans.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
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
        // Basic validation for email (contains @ and .) or 10-digit number.
        errors.phoneEmail = 'Must be a valid email or 10-digit phone number.';
    }
    // If plan type is 'Paid', expiry date is required and must be in the future.
    if (planType === 'Paid' && !expiryDate) {
      errors.expiryDate = 'Expiry Date is required for Paid Plan.';
    } else if (expiryDate && new Date(expiryDate) < new Date()) {
      errors.expiryDate = 'Expiry Date cannot be in the past.';
    }
    setFormErrors(errors); // Update form errors state.
    return Object.keys(errors).length === 0; // Return true if no errors.
  };

  /**
   * Handles the form submission to add a new subscriber.
   * Performs validation and logs the new subscriber data.
   * In a real application, this would send data to an API.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission.
    if (!validateForm()) {
      return; // Stop if validation fails.
    }
    // Construct the new subscriber object.
    const newSubscriber = {
      // Generate a unique ID (in a real app, this would come from the backend).
      userId: `SUB${Date.now()}`,
      tradingViewId,
      name,
      phoneEmail,
      referralId: referralId || '-', // Use '-' if referralId is empty.
      plan: planType,
      // Set expiry date only for Paid plans, otherwise 'N/A'.
      expiryDate: planType === 'Paid' ? expiryDate : 'N/A',
      joinedDate: new Date().toISOString().split('T')[0], // Current date for joined date.
      status: 'Active', // Default status for new subscribers.
    };
    console.log('Adding New Subscriber:', newSubscriber);
    // In a real app, you'd send this data to an API (e.g., via fetch or axios).
    // After successful API call, you would likely update the parent component's state or refetch data.

    handleCloseForm(); // Close the form after submission.
  };

  // Calculate daily paid and demo subscriber counts from the provided data.
  const dailyPaidCount = data.filter(s => s.plan === 'Paid').length;
  const dailyDemoCount = data.filter(s => s.plan === 'Demo').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" /> Daily New Subscribers
      </h2>

      {/* Quick Analytics Count Section */}
      <div className="kpi-cards-custom">
        <div className="kpi-card-custom text-center">
          <h3>Daily New Paid</h3>
          <p className="kpi-value-custom">{dailyPaidCount}</p>
        </div>
        <div className="kpi-card-custom text-center">
          <h3>Daily New Demo</h3>
          <p className="kpi-value-custom">{dailyDemoCount}</p>
        </div>
      </div>

      {/* Admin Input: Add New Subscriber Form Section */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        <PlusCircle className="w-7 h-7 text-accent" /> Add New Subscriber
      </h3>
      <div className="kpi-card-custom p-6">
        {/* Button to open the add subscriber form */}
        <button
          onClick={handleOpenForm}
          className="action-button-custom mb-4"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Subscriber
        </button>

        {/* Modal/Overlay for the Add New Subscriber Form */}
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
              <h3 className="dashboard-widget-title mb-6">New Subscriber Details</h3>
              {/* Add New Subscriber Form */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="tradingViewId" className="block text-sm font-medium text-text-base mb-1">
                    TradingView ID (Required)
                  </label>
                  <input
                    type="text"
                    id="tradingViewId"
                    value={tradingViewId}
                    onChange={(e) => setTradingViewId(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                  {/* Display error message if validation fails */}
                  {formErrors.tradingViewId && <p className="text-danger text-sm mt-1">{formErrors.tradingViewId}</p>}
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-text-base mb-1">
                    Name (Required)
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                  {formErrors.name && <p className="text-danger text-sm mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label htmlFor="phoneEmail" className="block text-sm font-medium text-text-base mb-1">
                    Phone / Email (Required)
                  </label>
                  <input
                    type="text"
                    id="phoneEmail"
                    value={phoneEmail}
                    onChange={(e) => setPhoneEmail(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                    required
                  />
                  {formErrors.phoneEmail && <p className="text-danger text-sm mt-1">{formErrors.phoneEmail}</p>}
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
                      Expiry Date (Required for Paid)
                    </label>
                    <input
                      type="date"
                      id="expiryDate"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                      required={planType === 'Paid'} // Make required only if plan is Paid
                    />
                    {formErrors.expiryDate && <p className="text-danger text-sm mt-1">{formErrors.expiryDate}</p>}
                  </div>
                )}
                <div className="form-actions-custom"> {/* Custom styling for form action buttons */}
                  <button type="button" onClick={handleCloseForm} className="action-button-custom cancel-button-custom">
                    Cancel
                  </button>
                  <button type="submit" className="action-button-custom">
                    Add Subscriber
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Daily New Subscribers Table Section */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        Today's New Subscribers
      </h3>
      <div className="kpi-card-custom overflow-x-auto">
        <table className="min-w-full divide-y divide-border-base">
          <thead className="bg-bg-base">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">User ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Plan</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-text-light uppercase tracking-wider">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-base">
            {/* Map through the 'data' prop to render each daily new subscriber row */}
            {data.map((sub, index) => (
              <tr key={sub.userId || index}>{/* Use userId as key, fallback to index */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.userId}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.plan}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-text-base">{sub.joinedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DailyPaidDemo;
