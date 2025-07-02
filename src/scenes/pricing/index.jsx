import React, { useState } from 'react';
import { DollarSign, Edit, X, PlusCircle } from 'lucide-react';

/**
 * PricingPlans component displays pricing plans and allows admin to edit them.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of pricing plan data.
 */
function PricingPlans({ data = [] }) {
  // State to manage the visibility of the add/edit plan form modal.
  const [isFormOpen, setIsFormOpen] = useState(false);
  // State to hold the pricing plan object being edited. Null if adding a new plan.
  const [editPlan, setEditPlan] = useState(null);
  // State to store validation errors for the form.
  const [formErrors, setFormErrors] = useState({});
  // State to manage the list of plans, allowing for client-side updates.
  const [pricingPlansData, setPricingPlansData] = useState(data);

  // State for the purchase confirmation modal
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPlanForPurchase, setSelectedPlanForPurchase] = useState(null);


  // Form state for inputs
  const [planName, setPlanName] = useState('');
  const [price, setPrice] = useState('');
  const [features, setFeatures] = useState(''); // CORRECTED: Initialized with useState
  const [buttonText, setButtonText] = useState('');

  /**
   * Opens the pricing plan form modal.
   * If a plan object is passed, it pre-fills the form for editing.
   * Otherwise, it prepares the form for adding a new plan.
   * @param {object|null} plan - The plan object to edit, or null to add new.
   */
  const handleOpenForm = (plan = null) => {
    setIsFormOpen(true);
    setEditPlan(plan);
    setFormErrors({}); // Clear any previous form errors.

    if (plan) {
      setPlanName(plan.name);
      setPrice(plan.price);
      setFeatures(plan.features.join('\n')); // Convert features array to newline-separated string
      setButtonText(plan.buttonText);
    } else {
      // Reset form fields for a new plan.
      setPlanName('');
      setPrice('');
      setFeatures('');
      setButtonText('');
    }
  };

  /**
   * Closes the pricing plan form modal and resets related states.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditPlan(null);
    setFormErrors({}); // Clear errors when closing.
  };

  /**
   * Validates the Plan Name field in real-time.
   * Updates the formErrors state for 'planName'.
   * @param {string} name - The current value of the plan name input.
   */
  const validatePlanName = (name) => {
    setFormErrors(prevErrors => ({ ...prevErrors, planName: name.trim() ? '' : 'Plan Name is required.' }));
  };

  /**
   * Validates the Price field in real-time.
   * Updates the formErrors state for 'price'.
   * @param {string} priceValue - The current value of the price input.
   */
  const validatePrice = (priceValue) => {
    let error = '';
    const numPrice = parseFloat(priceValue);
    if (!priceValue.trim()) {
      error = 'Price is required.';
    } else if (isNaN(numPrice) || numPrice <= 0) {
      error = 'Price must be a positive number.';
    }
    setFormErrors(prevErrors => ({ ...prevErrors, price: error }));
  };

  /**
   * Validates the Features field in real-time.
   * Updates the formErrors state for 'features'.
   * @param {string} featuresText - The current value of the features textarea.
   */
  const validateFeatures = (featuresText) => {
    setFormErrors(prevErrors => ({ ...prevErrors, features: featuresText.trim() ? '' : 'Features are required (one per line).' }));
  };


  /**
   * Performs comprehensive validation for form submission.
   * This is a comprehensive check for the submit button.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateFormOnSubmit = () => {
    const errors = {};
    // Re-run all individual validations to ensure all errors are caught
    // and collected in the `errors` object before setting `formErrors`.
    if (!planName.trim()) {
      errors.planName = 'Plan Name is required.';
    }
    const numPrice = parseFloat(price);
    if (!price || isNaN(numPrice) || numPrice <= 0) {
      errors.price = 'Price must be a positive number.';
    }
    if (!features.trim()) {
      errors.features = 'Features are required (one per line).';
    }
    setFormErrors(errors); // Update the formErrors state with all found errors
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  /**
   * Handles the form submission for adding or updating a pricing plan.
   * Performs validation and logs the new/updated plan data.
   * In a real application, this would send data to an API.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault(); // Prevent default form submission behavior.
    if (!validateFormOnSubmit()) { // Use the comprehensive validation for submission
      console.log('Form validation failed. Please check the errors.');
      return; // Stop if validation fails.
    }

    // Construct the plan object based on form data.
    const newPlan = {
      id: editPlan ? editPlan.id : `PLAN${Date.now()}`, // Use existing ID or generate new.
      name: planName,
      price: parseFloat(price),
      features: features.split('\n').map(f => f.trim()).filter(f => f), // Convert string back to array, filter empty lines
      buttonText: buttonText,
    };

    // Update the pricingPlansData state
    if (editPlan) {
      setPricingPlansData(pricingPlansData.map(p => p.id === newPlan.id ? newPlan : p));
      console.log('Pricing Plan Updated:', newPlan);
    } else {
      setPricingPlansData([...pricingPlansData, newPlan]);
      console.log('New Pricing Plan Added:', newPlan);
    }

    handleCloseForm(); // Close the form after submission.
  };

  /**
   * Handles the click of a "Buy/Upgrade" button.
   * Sets the selected plan and opens the purchase confirmation modal.
   * @param {object} plan - The plan object that was clicked.
   */
  const handlePurchaseClick = (plan) => {
    setSelectedPlanForPurchase(plan);
    setShowPurchaseModal(true);
  };

  /**
   * Closes the purchase confirmation modal.
   */
  const handleClosePurchaseModal = () => {
    setShowPurchaseModal(false);
    setSelectedPlanForPurchase(null);
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
          <DollarSign className="w-8 h-8 text-primary" /> Pricing Plans
        </h2>
        {/* Button to add a new pricing plan */}
        <button
          onClick={() => handleOpenForm()}
          className="action-button-custom"
        >
          <PlusCircle className="w-5 h-5 mr-2" /> Add New Plan
        </button>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {pricingPlansData.map((plan) => (
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
                {/* This button now triggers the purchase confirmation modal */}
                <button
                  onClick={() => handlePurchaseClick(plan)}
                  className="action-button-custom flex-1"
                >
                  {plan.buttonText}
                </button>
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
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-lg w-full relative">
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
                  Plan Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  id="planName"
                  value={planName}
                  onChange={(e) => {
                    setPlanName(e.target.value);
                    validatePlanName(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.planName ? 'border-danger' : 'border-border-base'}`}
                  required
                />
                {formErrors.planName && <p className="text-danger text-xs mt-1">{formErrors.planName}</p>}
              </div>
              <div>
                <label htmlFor="price" className="block text-sm font-medium text-text-base mb-1">
                  Price (INR) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  id="price"
                  value={price}
                  onChange={(e) => {
                    setPrice(e.target.value);
                    validatePrice(e.target.value); // Real-time validation
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.price ? 'border-danger' : 'border-border-base'}`}
                  step="0.01"
                  required
                />
                {formErrors.price && <p className="text-danger text-xs mt-1">{formErrors.price}</p>}
              </div>
              <div>
                <label htmlFor="features" className="block text-sm font-medium text-text-base mb-1">
                  Features (One per line) <span className="text-danger">*</span>
                </label>
                <textarea
                  id="features"
                  value={features}
                  onChange={(e) => {
                    setFeatures(e.target.value);
                    validateFeatures(e.target.value); // Real-time validation
                  }}
                  rows="5"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.features ? 'border-danger' : 'border-border-base'}`}
                  required
                ></textarea>
                {formErrors.features && <p className="text-danger text-xs mt-1">{formErrors.features}</p>}
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
                <button type="submit" className="action-button-custom">
                  {editPlan ? 'Update Plan' : 'Add Plan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Purchase Confirmation Modal */}
      {showPurchaseModal && selectedPlanForPurchase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-sm w-full relative text-center">
            <button
              onClick={handleClosePurchaseModal}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Purchase</h3>
            <p className="text-text-base mb-6">
              You are about to purchase the <span className="font-semibold text-primary">{selectedPlanForPurchase.name}</span> plan for <span className="font-bold text-secondary">₹{selectedPlanForPurchase.price}</span>.
            </p>
            <button
              onClick={handleClosePurchaseModal} // In a real app, this would trigger the actual purchase flow
              className="action-button-custom"
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default PricingPlans;
