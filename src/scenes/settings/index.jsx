import React, { useState, useEffect } from 'react';
import { Settings as SettingsIcon, Save, X, Users, Database, Zap, HardDrive } from 'lucide-react';

/**
 * Settings component allows admin to control various application settings.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Settings data, typically fetched from a backend.
 */
function Settings({ data = {} }) {
  // --- General Settings States ---
  const [demoModeVisible, setDemoModeVisible] = useState(data.demoModeVisible || false);
  const [authPageVisible, setAuthPageVisible] = useState(data.authPageVisible || false);
  const [heroBannerText, setHeroBannerText] = useState(data.heroBannerText || '');
  const [footerDisclaimer, setFooterDisclaimer] = useState(data.footerDisclaimer || '');
  const [basicPlanDesc, setBasicPlanDesc] = useState(data.planDescriptions?.basic || '');
  const [premiumPlanDesc, setPremiumPlanDesc] = useState(data.planDescriptions?.premium || '');
  const [commissionPercentage, setCommissionPercentage] = useState(data.commissionPercentage || 0);
  const [languageDefaults, setLanguageDefaults] = useState(data.languageDefaults || 'English');

  // --- User Management Settings States ---
  const [enableUserRegistration, setEnableUserRegistration] = useState(data.userManagement?.enableUserRegistration ?? true);
  const [defaultUserRole, setDefaultUserRole] = useState(data.userManagement?.defaultUserRole || 'User');
  const [requireEmailVerification, setRequireEmailVerification] = useState(data.userManagement?.requireEmailVerification ?? false);

  // --- Data & Reporting Settings States ---
  const [dataRetentionDays, setDataRetentionDays] = useState(data.dataReporting?.dataRetentionDays || 365);
  const [enableAutomatedReports, setEnableAutomatedReports] = useState(data.dataReporting?.enableAutomatedReports ?? false);
  const [reportEmailRecipients, setReportEmailRecipients] = useState(data.dataReporting?.reportEmailRecipients || ''); // Comma-separated emails

  // --- Integrations Settings States (Placeholders) ---
  const [paymentGatewayApiKey, setPaymentGatewayApiKey] = useState(data.integrations?.paymentGatewayApiKey || '');
  const [tradingPlatformWebhookUrl, setTradingPlatformWebhookUrl] = useState(data.integrations?.tradingPlatformWebhookUrl || '');

  // --- System Performance Settings States (Placeholders) ---
  const [enableCache, setEnableCache] = useState(data.systemPerformance?.enableCache ?? true);
  const [cacheExpiryMinutes, setCacheExpiryMinutes] = useState(data.systemPerformance?.cacheExpiryMinutes || 60);
  const [maintenanceMode, setMaintenanceMode] = useState(data.systemPerformance?.maintenanceMode ?? false);


  // State for form validation errors, mapping field names to error messages.
  const [formErrors, setFormErrors] = useState({});
  // State to control the visibility of the save success message.
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Effect to re-initialize form states if the `data` prop changes (e.g., on a data refresh).
  // This ensures that the form always reflects the latest external data.
  useEffect(() => {
    // General Settings
    setDemoModeVisible(data.demoModeVisible ?? false);
    setAuthPageVisible(data.authPageVisible ?? false);
    setHeroBannerText(data.heroBannerText || '');
    setFooterDisclaimer(data.footerDisclaimer || '');
    setBasicPlanDesc(data.planDescriptions?.basic || '');
    setPremiumPlanDesc(data.planDescriptions?.premium || '');
    setCommissionPercentage(data.commissionPercentage || 0);
    setLanguageDefaults(data.languageDefaults || 'English');

    // User Management Settings
    setEnableUserRegistration(data.userManagement?.enableUserRegistration ?? true);
    setDefaultUserRole(data.userManagement?.defaultUserRole || 'User');
    setRequireEmailVerification(data.userManagement?.requireEmailVerification ?? false);

    // Data & Reporting Settings
    setDataRetentionDays(data.dataReporting?.dataRetentionDays || 365);
    setEnableAutomatedReports(data.dataReporting?.enableAutomatedReports ?? false);
    setReportEmailRecipients(data.dataReporting?.reportEmailRecipients || '');

    // Integrations Settings
    setPaymentGatewayApiKey(data.integrations?.paymentGatewayApiKey || '');
    setTradingPlatformWebhookUrl(data.integrations?.tradingPlatformWebhookUrl || '');

    // System Performance Settings
    setEnableCache(data.systemPerformance?.enableCache ?? true);
    setCacheExpiryMinutes(data.systemPerformance?.cacheExpiryMinutes || 60);
    setMaintenanceMode(data.systemPerformance?.maintenanceMode ?? false);

    setFormErrors({}); // Clear errors on data change
  }, [data]);

  /**
   * Validates all form fields before saving.
   * Updates the `formErrors` state with any validation messages.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};

    // --- General Settings Validation ---
    if (commissionPercentage < 0 || commissionPercentage > 100) {
      errors.commissionPercentage = 'Commission percentage must be between 0 and 100.';
    }
    if (!heroBannerText.trim()) {
      errors.heroBannerText = 'Hero Banner Text is required.';
    } else if (heroBannerText.length > 100) {
      errors.heroBannerText = 'Hero Banner Text cannot exceed 100 characters.';
    }
    if (!footerDisclaimer.trim()) {
      errors.footerDisclaimer = 'Footer Disclaimer is required.';
    } else if (footerDisclaimer.length > 200) {
      errors.footerDisclaimer = 'Footer Disclaimer cannot exceed 200 characters.';
    }
    if (!basicPlanDesc.trim()) {
      errors.basicPlanDesc = 'Basic Plan Description is required.';
    } else if (basicPlanDesc.length > 150) {
      errors.basicPlanDesc = 'Basic Plan Description cannot exceed 150 characters.';
    }
    if (!premiumPlanDesc.trim()) {
      errors.premiumPlanDesc = 'Premium Plan Description is required.';
    } else if (premiumPlanDesc.length > 150) {
      errors.premiumPlanDesc = 'Premium Plan Description cannot exceed 150 characters.';
    }

    // --- Data & Reporting Validation ---
    if (dataRetentionDays < 0) {
      errors.dataRetentionDays = 'Data retention days cannot be negative.';
    }
    if (enableAutomatedReports && reportEmailRecipients.trim() === '') {
      errors.reportEmailRecipients = 'Email recipients are required if automated reports are enabled.';
    } else if (reportEmailRecipients.trim() !== '') {
      const emails = reportEmailRecipients.split(',').map(email => email.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emails.filter(email => email && !emailRegex.test(email));
      if (invalidEmails.length > 0) {
        errors.reportEmailRecipients = `Invalid email format: ${invalidEmails.join(', ')}`;
      }
    }

    // --- Integrations Validation (Example) ---
    // You might add regex validation for API keys or URL formats here
    // if (paymentGatewayApiKey.trim() && paymentGatewayApiKey.length < 10) {
    //   errors.paymentGatewayApiKey = 'API Key seems too short.';
    // }
    // if (tradingPlatformWebhookUrl.trim() && !/^https?:\/\//.test(tradingPlatformWebhookUrl)) {
    //   errors.tradingPlatformWebhookUrl = 'Invalid Webhook URL format.';
    // }

    // --- System Performance Validation ---
    if (cacheExpiryMinutes < 0) {
      errors.cacheExpiryMinutes = 'Cache expiry minutes cannot be negative.';
    }


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
      // General
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
      // User Management
      userManagement: {
        enableUserRegistration,
        defaultUserRole,
        requireEmailVerification,
      },
      // Data & Reporting
      dataReporting: {
        dataRetentionDays,
        enableAutomatedReports,
        reportEmailRecipients: reportEmailRecipients.split(',').map(email => email.trim()).filter(email => email).join(', '),
      },
      // Integrations
      integrations: {
        paymentGatewayApiKey,
        tradingPlatformWebhookUrl,
      },
      // System Performance
      systemPerformance: {
        enableCache,
        cacheExpiryMinutes,
        maintenanceMode,
      },
    };

    console.log('Saving Settings:', updatedSettings); // Log the updated settings
    // In a real application, you would send 'updatedSettings' to your backend API
    // (e.g., using fetch or axios) to persist the changes.

    setShowSaveSuccess(true); // Show the success message
    // Hide the success message after 3 seconds
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  /**
   * Handles canceling the changes made in the form.
   * Resets all form fields to their initial values from the `data` prop.
   */
  const handleCancelChanges = () => {
    // Re-initialize all states from the original data prop
    // General Settings
    setDemoModeVisible(data.demoModeVisible ?? false);
    setAuthPageVisible(data.authPageVisible ?? false);
    setHeroBannerText(data.heroBannerText || '');
    setFooterDisclaimer(data.footerDisclaimer || '');
    setBasicPlanDesc(data.planDescriptions?.basic || '');
    setPremiumPlanDesc(data.planDescriptions?.premium || '');
    setCommissionPercentage(data.commissionPercentage || 0);
    setLanguageDefaults(data.languageDefaults || 'English');

    // User Management Settings
    setEnableUserRegistration(data.userManagement?.enableUserRegistration ?? true);
    setDefaultUserRole(data.userManagement?.defaultUserRole || 'User');
    setRequireEmailVerification(data.userManagement?.requireEmailVerification ?? false);

    // Data & Reporting Settings
    setDataRetentionDays(data.dataReporting?.dataRetentionDays || 365);
    setEnableAutomatedReports(data.dataReporting?.enableAutomatedReports ?? false);
    setReportEmailRecipients(data.dataReporting?.reportEmailRecipients || '');

    // Integrations Settings
    setPaymentGatewayApiKey(data.integrations?.paymentGatewayApiKey || '');
    setTradingPlatformWebhookUrl(data.integrations?.tradingPlatformWebhookUrl || '');

    // System Performance Settings
    setEnableCache(data.systemPerformance?.enableCache ?? true);
    setCacheExpiryMinutes(data.systemPerformance?.cacheExpiryMinutes || 60);
    setMaintenanceMode(data.systemPerformance?.maintenanceMode ?? false);

    setFormErrors({}); // Clear any validation errors
    setShowSaveSuccess(false); // Hide any success message
    console.log('Changes cancelled. Form reset to original data.');
  };

  // Helper for toggle switches
  const ToggleSwitch = ({ id, label, checked, onChange, helpText, error }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-base mb-2">
        {label}
      </label>
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          <input
            type="checkbox"
            id={id}
            className="sr-only peer"
            checked={checked}
            onChange={onChange}
          />
          <div className="block bg-border-base w-14 h-8 rounded-full transition-colors peer-checked:bg-primary"></div>
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[120%]" style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}></div>
        </div>
        <div className="ml-3 text-text-base font-medium">{checked ? 'Enabled' : 'Disabled'}</div>
      </label>
      {helpText && <p className="text-xs text-text-light mt-1">{helpText}</p>}
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-primary" /> Application Settings
      </h2>

      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6">General Settings</h3>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Toggle Visibility Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              id="demoModeToggle"
              label="Demo Mode Visibility"
              checked={demoModeVisible}
              onChange={(e) => setDemoModeVisible(e.target.checked)}
              helpText="Control if the demo mode features are visible to users."
            />
            <ToggleSwitch
              id="authPageToggle"
              label="Auth Page Visibility"
              checked={authPageVisible}
              onChange={(e) => setAuthPageVisible(e.target.checked)}
              helpText="Control if the authentication (login/signup) page is accessible."
            />
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
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.heroBannerText ? 'border-danger' : 'border-border-base'}`}
              maxLength="100"
            />
            <p className="text-xs text-text-light mt-1">Max 100 characters.</p>
            {formErrors.heroBannerText && <p className="text-danger text-xs mt-1">{formErrors.heroBannerText}</p>}
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
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.footerDisclaimer ? 'border-danger' : 'border-border-base'}`}
              maxLength="200"
            ></textarea>
            <p className="text-xs text-text-light mt-1">Max 200 characters.</p>
            {formErrors.footerDisclaimer && <p className="text-danger text-xs mt-1">{formErrors.footerDisclaimer}</p>}
          </div>

          {/* Plan Descriptions Section */}
          <h4 className="text-xl font-semibold text-secondary pt-4 border-t border-border-base flex items-center gap-2">
            <Zap className="w-5 h-5" /> Plan Descriptions
          </h4>
          <div>
            <label htmlFor="basicPlanDesc" className="block text-sm font-medium text-text-base mb-1">
              Basic Plan Description
            </label>
            <textarea
              id="basicPlanDesc"
              value={basicPlanDesc}
              onChange={(e) => setBasicPlanDesc(e.target.value)}
              rows="2"
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.basicPlanDesc ? 'border-danger' : 'border-border-base'}`}
              maxLength="150"
            ></textarea>
            {formErrors.basicPlanDesc && <p className="text-danger text-xs mt-1">{formErrors.basicPlanDesc}</p>}
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
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.premiumPlanDesc ? 'border-danger' : 'border-border-base'}`}
              maxLength="150"
            ></textarea>
            {formErrors.premiumPlanDesc && <p className="text-danger text-xs mt-1">{formErrors.premiumPlanDesc}</p>}
          </div>

          {/* Commission Percentage and Language Defaults Section */}
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
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.commissionPercentage ? 'border-danger' : 'border-border-base'}`}
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

          {/* --- User Management Settings --- */}
          <h3 className="dashboard-widget-title mt-8 pt-4 border-t border-border-base flex items-center gap-2">
            <Users className="w-5 h-5" /> User Management
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              id="enableUserRegistration"
              label="Enable User Registration"
              checked={enableUserRegistration}
              onChange={(e) => setEnableUserRegistration(e.target.checked)}
              helpText="Allow new users to sign up for accounts."
            />
            <div>
              <label htmlFor="defaultUserRole" className="block text-sm font-medium text-text-base mb-1">
                Default New User Role
              </label>
              <select
                id="defaultUserRole"
                value={defaultUserRole}
                onChange={(e) => setDefaultUserRole(e.target.value)}
                className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
              >
                <option value="User">User</option>
                <option value="Viewer">Viewer</option>
                <option value="Trader">Trader</option>
              </select>
            </div>
            <ToggleSwitch
              id="requireEmailVerification"
              label="Require Email Verification"
              checked={requireEmailVerification}
              onChange={(e) => setRequireEmailVerification(e.target.checked)}
              helpText="New users must verify their email address before logging in."
            />
          </div>

          {/* --- Data & Reporting Settings --- */}
          <h3 className="dashboard-widget-title mt-8 pt-4 border-t border-border-base flex items-center gap-2">
            <Database className="w-5 h-5" /> Data & Reporting
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="dataRetentionDays" className="block text-sm font-medium text-text-base mb-1">
                Data Retention (Days)
              </label>
              <input
                type="number"
                id="dataRetentionDays"
                value={dataRetentionDays}
                onChange={(e) => setDataRetentionDays(parseInt(e.target.value) || 0)}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.dataRetentionDays ? 'border-danger' : 'border-border-base'}`}
                min="0"
              />
              <p className="text-xs text-text-light mt-1">Number of days to retain historical data.</p>
              {formErrors.dataRetentionDays && <p className="text-danger text-xs mt-1">{formErrors.dataRetentionDays}</p>}
            </div>
            <ToggleSwitch
              id="enableAutomatedReports"
              label="Enable Automated Reports"
              checked={enableAutomatedReports}
              onChange={(e) => setEnableAutomatedReports(e.target.checked)}
              helpText="Automatically generate and send performance reports."
            />
            <div>
              <label htmlFor="reportEmailRecipients" className="block text-sm font-medium text-text-base mb-1">
                Report Email Recipients
              </label>
              <textarea
                id="reportEmailRecipients"
                value={reportEmailRecipients}
                onChange={(e) => setReportEmailRecipients(e.target.value)}
                rows="2"
                placeholder="email1@example.com, email2@example.com"
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.reportEmailRecipients ? 'border-danger' : 'border-border-base'}`}
                disabled={!enableAutomatedReports} // Disable if reports are not enabled
              ></textarea>
              <p className="text-xs text-text-light mt-1">Comma-separated email addresses for report delivery.</p>
              {formErrors.reportEmailRecipients && <p className="text-danger text-xs mt-1">{formErrors.reportEmailRecipients}</p>}
            </div>
          </div>

          {/* --- Integrations Settings (Placeholder) --- */}
          <h3 className="dashboard-widget-title mt-8 pt-4 border-t border-border-base flex items-center gap-2">
            <Zap className="w-5 h-5" /> Integrations
          </h3>
          <p className="text-text-light text-sm mb-4">Manage API keys and webhooks for external services.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="paymentGatewayApiKey" className="block text-sm font-medium text-text-base mb-1">
                Payment Gateway API Key
              </label>
              <input
                type="text"
                id="paymentGatewayApiKey"
                value={paymentGatewayApiKey}
                onChange={(e) => setPaymentGatewayApiKey(e.target.value)}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.paymentGatewayApiKey ? 'border-danger' : 'border-border-base'}`}
                placeholder="e.g., sk_live_xxxxxxxxxxxx"
              />
              {formErrors.paymentGatewayApiKey && <p className="text-danger text-xs mt-1">{formErrors.paymentGatewayApiKey}</p>}
            </div>
            <div>
              <label htmlFor="tradingPlatformWebhookUrl" className="block text-sm font-medium text-text-base mb-1">
                Trading Platform Webhook URL
              </label>
              <input
                type="url"
                id="tradingPlatformWebhookUrl"
                value={tradingPlatformWebhookUrl}
                onChange={(e) => setTradingPlatformWebhookUrl(e.target.value)}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.tradingPlatformWebhookUrl ? 'border-danger' : 'border-border-base'}`}
                placeholder="https://your-app.com/webhook/trading"
              />
              {formErrors.tradingPlatformWebhookUrl && <p className="text-danger text-xs mt-1">{formErrors.tradingPlatformWebhookUrl}</p>}
            </div>
          </div>

          {/* --- System Performance Settings (Placeholder) --- */}
          <h3 className="dashboard-widget-title mt-8 pt-4 border-t border-border-base flex items-center gap-2">
            <HardDrive className="w-5 h-5" /> System Performance
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch
              id="enableCache"
              label="Enable Caching"
              checked={enableCache}
              onChange={(e) => setEnableCache(e.target.checked)}
              helpText="Improve performance by caching frequently accessed data."
            />
            <div>
              <label htmlFor="cacheExpiryMinutes" className="block text-sm font-medium text-text-base mb-1">
                Cache Expiry (Minutes)
              </label>
              <input
                type="number"
                id="cacheExpiryMinutes"
                value={cacheExpiryMinutes}
                onChange={(e) => setCacheExpiryMinutes(parseInt(e.target.value) || 0)}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.cacheExpiryMinutes ? 'border-danger' : 'border-border-base'}`}
                min="0"
                disabled={!enableCache} // Disable if caching is not enabled
              />
              {formErrors.cacheExpiryMinutes && <p className="text-danger text-xs mt-1">{formErrors.cacheExpiryMinutes}</p>}
            </div>
            <ToggleSwitch
              id="maintenanceMode"
              label="Maintenance Mode"
              checked={maintenanceMode}
              onChange={(e) => setMaintenanceMode(e.target.checked)}
              helpText="Take the application offline for maintenance. Users will see a maintenance page."
            />
          </div>

          {/* Form Action Buttons */}
          <div className="form-actions-custom flex justify-end mt-8 pt-4 border-t border-border-base">
            {showSaveSuccess && (
              <span className="text-accent text-sm mr-4 flex items-center gap-1">
                <Save className="w-4 h-4" /> Settings saved successfully!
              </span>
            )}
            <button type="submit" className="action-button-custom">
              <Save className="w-5 h-5 mr-2" /> Save Changes
            </button>
            <button type="button" onClick={handleCancelChanges} className="action-button-custom cancel-button-custom">
              <X className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Settings;
