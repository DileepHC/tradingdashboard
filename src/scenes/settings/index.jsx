import React, { useState } from 'react';
import { Settings as SettingsIcon, Save, X } from 'lucide-react';

/**
 * Settings component allows admin to control various application settings.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Settings data.
 */
function Settings({ data = {} }) {
  // Use local state for form fields, initialized from props.data
  const [demoModeVisible, setDemoModeVisible] = useState(data.demoModeVisible || false);
  const [authPageVisible, setAuthPageVisible] = useState(data.authPageVisible || false);
  const [heroBannerText, setHeroBannerText] = useState(data.heroBannerText || '');
  const [footerDisclaimer, setFooterDisclaimer] = useState(data.footerDisclaimer || '');
  const [basicPlanDesc, setBasicPlanDesc] = useState(data.planDescriptions?.basic || '');
  const [premiumPlanDesc, setPremiumPlanDesc] = useState(data.planDescriptions?.premium || '');
  const [commissionPercentage, setCommissionPercentage] = useState(data.commissionPercentage || 0);
  const [languageDefaults, setLanguageDefaults] = useState(data.languageDefaults || 'English');

  // State for form validation errors
  const [formErrors, setFormErrors] = useState({});
  // State to control the visibility of the save success message
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  /**
   * Validates the form fields before saving.
   * Currently, validates only the commission percentage.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};
    if (commissionPercentage < 0 || commissionPercentage > 100) {
      errors.commissionPercentage = 'Commission percentage must be between 0 and 100.';
    }
    // Add other validations as needed for other fields
    setFormErrors(errors); // Update the formErrors state
    return Object.keys(errors).length === 0; // Return true if there are no errors
  };

  /**
   * Handles saving the changes made in the settings form.
   * Prevents default form submission, validates the form, and if valid,
   * logs the updated settings and shows a success message.
   * In a real application, this would send data to an API.
   * @param {Event} e - The form submission event.
   */
  const handleSaveChanges = (e) => {
    e.preventDefault(); // Prevent default browser form submission
    if (!validateForm()) {
      return; // Stop if validation fails
    }
    // Construct the object with updated settings
    const updatedSettings = {
      demoModeVisible,
      authPageVisible,
      heroBannerText,
      footerDisclaimer,
      planDescriptions: {
        basic: basicPlanDesc,
        premium: premiumPlanDesc,
      },
      commissionPercentage,
      languageDefaults,
    };
    console.log('Saving Settings:', updatedSettings); // Log the updated settings
    // In a real application, you would send 'updatedSettings' to your backend API
    // (e.g., using fetch or axios) to persist the changes.

    setShowSaveSuccess(true); // Show the success message
    // Hide the success message after 3 seconds
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-primary" /> Application Settings {/* Settings icon */}
      </h2>

      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6">General Settings</h3>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Toggle Visibility Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Demo Mode Visibility Toggle */}
            <div>
              <label htmlFor="demoModeToggle" className="block text-sm font-medium text-text-base mb-2">
                Demo Mode Visibility
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  {/* Hidden checkbox for accessibility and controlled styling */}
                  <input
                    type="checkbox"
                    id="demoModeToggle"
                    className="sr-only peer" // Added 'peer' class for Tailwind JIT (Just-In-Time) mode
                    checked={demoModeVisible}
                    onChange={(e) => setDemoModeVisible(e.target.checked)}
                  />
                  {/* The visible track of the toggle switch */}
                  <div className="block bg-border-base w-14 h-8 rounded-full transition-colors peer-checked:bg-primary"></div> {/* Added peer-checked:bg-primary */}
                  {/* The movable dot of the toggle switch */}
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[120%]" style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}></div> {/* Added peer-checked:translate-x-[120%] and inline style */}
                </div>
                <div className="ml-3 text-text-base font-medium">{demoModeVisible ? 'Visible' : 'Hidden'}</div>
              </label>
            </div>
            {/* Auth Page Visibility Toggle */}
            <div>
              <label htmlFor="authPageToggle" className="block text-sm font-medium text-text-base mb-2">
                Auth Page Visibility
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="authPageToggle"
                    className="sr-only peer" // Added 'peer' class
                    checked={authPageVisible}
                    onChange={(e) => setAuthPageVisible(e.target.checked)}
                  />
                  <div className="block bg-border-base w-14 h-8 rounded-full transition-colors peer-checked:bg-primary"></div> {/* Added peer-checked:bg-primary */}
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[120%]" style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}></div> {/* Added peer-checked:translate-x-[120%] and inline style */}
                </div>
                <div className="ml-3 text-text-base font-medium">{authPageVisible ? 'Visible' : 'Hidden'}</div>
              </label>
            </div>
          </div>

          {/* Site Texts Section */}
          <div>
            <label htmlFor="heroBannerText" className="block text-sm font-medium text-text-base mb-1">
              Hero Banner Text
            </label>
            <input
              type="text"
              id="heroBannerText"
              value={heroBannerText}
              onChange={(e) => setHeroBannerText(e.target.value)}
              className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
              maxLength="100" // Max length for the input
            />
            <p className="text-xs text-text-light mt-1">Max 100 characters.</p>
          </div>
          <div>
            <label htmlFor="footerDisclaimer" className="block text-sm font-medium text-text-base mb-1">
              Footer Disclaimer
            </label>
            <textarea
              id="footerDisclaimer"
              value={footerDisclaimer}
              onChange={(e) => setFooterDisclaimer(e.target.value)}
              rows="3" // Number of visible rows
              className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y" // Allow vertical resizing
              maxLength="200" // Max length for the textarea
            ></textarea>
            <p className="text-xs text-text-light mt-1">Max 200 characters.</p>
          </div>

          {/* Plan Descriptions Section */}
          <h4 className="text-xl font-semibold text-secondary pt-4 border-t border-border-base">Plan Descriptions</h4>
          <div>
            <label htmlFor="basicPlanDesc" className="block text-sm font-medium text-text-base mb-1">
              Basic Plan Description
            </label>
            <textarea
              id="basicPlanDesc"
              value={basicPlanDesc}
              onChange={(e) => setBasicPlanDesc(e.target.value)}
              rows="2"
              className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y"
              maxLength="150"
            ></textarea>
          </div>
          <div>
            <label htmlFor="premiumPlanDesc" className="block text-sm font-medium text-text-base mb-1">
              Premium Plan Description
            </label>
            <textarea
              id="premiumPlanDesc"
              value={premiumPlanDesc}
              onChange={(e) => setPremiumPlanDesc(e.target.value)}
              rows="2"
              className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y"
              maxLength="150"
            ></textarea>
          </div>

          {/* Commission Percentage and Language Defaults Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Commission Percentage Input */}
            <div>
              <label htmlFor="commissionPercentage" className="block text-sm font-medium text-text-base mb-1">
                Commission % (0-100)
              </label>
              <input
                type="number"
                id="commissionPercentage"
                value={commissionPercentage}
                onChange={(e) => setCommissionPercentage(parseFloat(e.target.value))}
                className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                min="0" // Minimum value
                max="100" // Maximum value
                step="0.1" // Allows decimal values
              />
              {formErrors.commissionPercentage && <p className="text-danger text-sm mt-1">{formErrors.commissionPercentage}</p>}
            </div>
            {/* Default Language Select */}
            <div>
              <label htmlFor="languageDefaults" className="block text-sm font-medium text-text-base mb-1">
                Default Language
              </label>
              <select
                id="languageDefaults"
                value={languageDefaults}
                onChange={(e) => setLanguageDefaults(e.target.value)}
                className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
              >
                <option value="English">English</option>
                <option value="Hindi">Hindi</option>
                {/* Add more languages as needed */}
              </select>
            </div>
          </div>

          {/* Form Action Buttons */}
          <div className="form-actions-custom">
            {showSaveSuccess && (
              <span className="text-accent text-sm mr-4 flex items-center gap-1">
                <Save className="w-4 h-4" /> Settings saved successfully!
              </span>
            )}
            <button type="submit" className="action-button-custom">
              <Save className="w-5 h-5 mr-2" /> Save Changes
            </button>
            <button type="button" className="action-button-custom cancel-button-custom">
              <X className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
