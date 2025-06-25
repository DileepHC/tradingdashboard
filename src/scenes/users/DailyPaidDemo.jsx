// scenes/users/DailyPaidDemo.jsx
import React, { useState } from 'react';
import { PlusCircle, X, Users } from 'lucide-react';

/**
 * DailyPaidDemo component displays daily new subscribers and an admin form to add new ones.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of daily new subscriber data.
 */
function DailyPaidDemo({ data = [] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [tradingViewId, setTradingViewId] = useState('');
  const [name, setName] = useState('');
  const [phoneEmail, setPhoneEmail] = useState('');
  const [referralId, setReferralId] = useState('');
  const [planType, setPlanType] = useState('Demo');
  const [expiryDate, setExpiryDate] = useState('');

  const handleOpenForm = () => {
    setIsFormOpen(true);
    setFormErrors({});
    // Reset form fields for new entry
    setTradingViewId('');
    setName('');
    setPhoneEmail('');
    setReferralId('');
    setPlanType('Demo');
    setExpiryDate('');
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormErrors({});
  };

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
        errors.phoneEmail = 'Must be a valid email or 10-digit phone number.';
    }
    if (planType === 'Paid' && !expiryDate) {
      errors.expiryDate = 'Expiry Date is required for Paid Plan.';
    } else if (expiryDate && new Date(expiryDate) < new Date()) {
      errors.expiryDate = 'Expiry Date cannot be in the past.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const newSubscriber = {
      id: `SUB${Date.now()}`,
      tradingViewId,
      name,
      phoneEmail,
      referralId: referralId || '-',
      plan: planType,
      expiryDate: planType === 'Paid' ? expiryDate : 'N/A',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    console.log('Adding New Subscriber:', newSubscriber);
    // In a real app, you'd send this data to an API
    handleCloseForm();
  };

  // Dummy analytics count
  const dailyPaidCount = data.filter(s => s.plan === 'Paid').length;
  const dailyDemoCount = data.filter(s => s.plan === 'Demo').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Users className="w-8 h-8 text-primary" /> Daily New Subscribers
      </h2>

      {/* Quick Analytics Count */}
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

      {/* Admin Input: Add New Subscriber Form */}
      <h3 className="text-2xl font-bold text-secondary flex items-center gap-2 mt-8">
        <PlusCircle className="w-7 h-7 text-accent" /> Add New Subscriber
      </h3>
      <div className="kpi-card-custom p-6">
        <button
          onClick={handleOpenForm}
          className="action-button-custom mb-4"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add Subscriber
        </button>

        {isFormOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-bg-card rounded-lg p-8 shadow-strong max-w-lg w-full relative">
              <button
                onClick={handleCloseForm}
                className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
                aria-label="Close form"
              >
                <X className="w-6 h-6" />
              </button>
              <h3 className="dashboard-widget-title mb-6">New Subscriber Details</h3>
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
                    onChange={(e) => setPlanType(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="Demo">Demo</option>
                    <option value="Paid">Paid</option>
                  </select>
                </div>
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
                      required={planType === 'Paid'}
                    />
                    {formErrors.expiryDate && <p className="text-danger text-sm mt-1">{formErrors.expiryDate}</p>}
                  </div>
                )}
                <div className="form-actions-custom">
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

      {/* Daily New Subscribers Table */}
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
            {data.map((sub, index) => (
              <tr key={sub.userId || index}>
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
