// scenes/settings/index.jsx
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

  const [formErrors, setFormErrors] = useState({});
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const validateForm = () => {
    const errors = {};
    if (commissionPercentage < 0 || commissionPercentage > 100) {
      errors.commissionPercentage = 'Commission percentage must be between 0 and 100.';
    }
    // Add other validations as needed
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
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
    console.log('Saving Settings:', updatedSettings);
    // In a real app, send this data to an API
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000); // Hide success message after 3 seconds
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-primary" /> Application Settings
      </h2>

      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6">General Settings</h3>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Toggle Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="demoModeToggle" className="block text-sm font-medium text-text-base mb-2">
                Demo Mode Visibility
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="demoModeToggle"
                    className="sr-only"
                    checked={demoModeVisible}
                    onChange={(e) => setDemoModeVisible(e.target.checked)}
                  />
                  <div className="block bg-border-base w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition dot-shadow"></div>
                </div>
                <div className="ml-3 text-text-base font-medium">{demoModeVisible ? 'Visible' : 'Hidden'}</div>
              </label>
            </div>
            <div>
              <label htmlFor="authPageToggle" className="block text-sm font-medium text-text-base mb-2">
                Auth Page Visibility
              </label>
              <label className="flex items-center cursor-pointer">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="authPageToggle"
                    className="sr-only"
                    checked={authPageVisible}
                    onChange={(e) => setAuthPageVisible(e.target.checked)}
                  />
                  <div className="block bg-border-base w-14 h-8 rounded-full"></div>
                  <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition dot-shadow"></div>
                </div>
                <div className="ml-3 text-text-base font-medium">{authPageVisible ? 'Visible' : 'Hidden'}</div>
              </label>
            </div>
          </div>

          <style jsx>{`
            .dot {
              box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
            }
            input:checked + .block {
              background-color: var(--primary-color);
            }
            input:checked + .block + .dot {
              transform: translateX(120%); /* Adjusted for w-14, h-8, w-6, h-6 */
            }
          `}</style>

          {/* Site Texts */}
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
              maxLength="100"
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
              rows="3"
              className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y"
              maxLength="200"
            ></textarea>
            <p className="text-xs text-text-light mt-1">Max 200 characters.</p>
          </div>

          {/* Plan Descriptions */}
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

          {/* Commission % and Language */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                min="0"
                max="100"
                step="0.1"
              />
              {formErrors.commissionPercentage && <p className="text-danger text-sm mt-1">{formErrors.commissionPercentage}</p>}
            </div>
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
