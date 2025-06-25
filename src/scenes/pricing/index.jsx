// scenes/pricing/index.jsx
import React, { useState } from 'react';
import { DollarSign, Edit, X } from 'lucide-react';

/**
 * PricingPlans component displays pricing plans and allows admin to edit them.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of pricing plan data.
 */
function PricingPlans({ data = [] }) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editPlan, setEditPlan] = useState(null);
  const [formErrors, setFormErrors] = useState({});

  // Form state
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState('');
  const [buttonText, setButtonText] = useState('');

  const handleOpenForm = (plan = null) => {
    setIsFormOpen(true);
    setEditPlan(plan);
    setFormErrors({});
    if (plan) {
      setPlanName(plan.name);
      setPrice(plan.price);
      setFeatures(plan.features.join('\n')); // Features are array, convert to string
      setButtonText(plan.buttonText);
    } else {
      setPlanName('');
      setPrice('');
      setFeatures('');
      setButtonText('');
    }
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditPlan(null);
    setFormErrors({});
  };

  const validateForm = () => {
    const errors = {};
    if (!planName.trim()) {
      errors.planName = 'Plan Name is required.';
    }
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      errors.price = 'Price must be a positive number.';
    }
    if (!features.trim()) {
      errors.features = 'Features are required.';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    const updatedPlan = {
      id: editPlan ? editPlan.id : `PLAN${Date.now()}`,
      name: planName,
      price: parseFloat(price),
      features: features.split('\n').map(f => f.trim()).filter(f => f), // Convert string back to array
      buttonText: buttonText,
    };
    console.log('Saving/Updating Plan:', updatedPlan);
    // In a real app, you'd send this data to an API
    handleCloseForm();
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <DollarSign className="w-8 h-8 text-primary" /> Pricing Plans
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {data.map((plan) => (
          <div key={plan.id} className="kpi-card-custom p-6 flex flex-col items-start">
            <h3 className="text-2xl font-bold text-primary mb-3">{plan.name}</h3>
            <p className="text-4xl font-extrabold text-secondary mb-4">₹{plan.price}</p>
            <ul className="list-disc list-inside text-text-base space-y-2 mb-6">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="material-symbols-outlined text-accent text-lg mr-2">check_circle</span> {feature}
                </li>
              ))}
            </ul>
            <div className="flex gap-4 mt-auto w-full">
                <button className="action-button-custom flex-1">{plan.buttonText}</button>
                <button
                    onClick={() => handleOpenForm(plan)}
                    className="action-button-custom bg-secondary hover:bg-secondary-dark flex-shrink-0"
                >
                    <Edit className="w-5 h-5" />
                </button>
            </div>
          </div>
        ))}
      </div>

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
            <h3 className="dashboard-widget-title mb-6">
              {editPlan ? 'Edit Pricing Plan' : 'Add New Pricing Plan'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="planName" className="block text-sm font-medium text-text-base mb-1">
                  Plan Name (Required)
                </label>
                <input
                  type="text"
                  id="planName"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  required
                />
                {formErrors.planName && <p className="text-danger text-sm mt-1">{formErrors.planName}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-text-base mb-1">
                  Price (INR, Required)
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  step="0.01"
                  required
                />
                {formErrors.price && <p className="text-danger text-sm mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="features" className="block text-sm font-medium text-text-base mb-1">
                  Features (One per line, Required)
                </label>
                <textarea
                  id="features"
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  rows="5"
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y"
                  required
                ></textarea>
                {formErrors.features && <p className="text-danger text-sm mt-1">{formErrors.features}</p>}
              </div>
              <div>
                <label htmlFor="buttonText" className="block text-sm font-medium text-text-base mb-1">
                  Button Text
                </label>
                <input
                  type="text"
                  id="buttonText"
                  value={buttonText}
                  onChange={(e) => setButtonText(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                />
              </div>
              <div className="form-actions-custom">
                <button type="button" onClick={handleCloseForm} className="action-button-custom cancel-button-custom">
                  Cancel
                </button>
                <button type="submit" className="action-button-custom">
                  {editPlan ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default PricingPlans;
