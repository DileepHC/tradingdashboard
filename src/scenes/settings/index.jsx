import React, { useState, useEffect, useRef } from 'react';
import {
  Settings as SettingsIcon, Save, X,
  SlidersHorizontal, UserCheck, BarChart2, Plug, Cpu, Link, Lock, Zap, Info
} from 'lucide-react';

/**
 * Settings component allows admin to control various application settings.
 * This module provides a comprehensive interface for managing general application behavior,
 * user management, data & reporting, integrations, and system performance.
 * All settings update in real-time as the user interacts with the form.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Initial settings data, typically fetched from a backend.
 */
function Settings({ data = {} }) {
  // --- General Settings States ---
  const [appName, setAppName] = useState(data.appName || '');
  const [heroBannerText, setHeroBannerText] = useState(data.heroBannerText || '');
  const [footerDisclaimer, setFooterDisclaimer] = useState(data.footerDisclaimer || '');
  const [defaultCurrency, setDefaultCurrency] = useState(data.defaultCurrency || 'INR');
  const [languageDefaults, setLanguageDefaults] = useState(data.languageDefaults || 'English');
  const [demoModeVisible, setDemoModeVisible] = useState(data.demoModeVisible ?? false);
  const [authPageVisible, setAuthPageVisible] = useState(data.authPageVisible ?? false);
  const [termsOfServiceLink, setTermsOfServiceLink] = useState(data.termsOfServiceLink || '');
  const [privacyPolicyLink, setPrivacyPolicyLink] = useState(data.privacyPolicyLink || '');
  const [timezoneDefault, setTimezoneDefault] = useState(data.timezoneDefault || 'Auto Detect');
  const [commissionPercentage, setCommissionPercentage] = useState(data.commissionPercentage || 0);
  const [basicPlanDesc, setBasicPlanDesc] = useState(data.planDescriptions?.basic || '');
  const [premiumPlanDesc, setPremiumPlanDesc] = useState(data.planDescriptions?.premium || '');


  // --- User Management Settings States ---
  const [enableUserRegistration, setEnableUserRegistration] = useState(data.userManagement?.enableUserRegistration ?? true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(data.userManagement?.requireEmailVerification ?? false);
  const [requirePhoneVerification, setRequirePhoneVerification] = useState(data.userManagement?.requirePhoneVerification ?? false);
  const [defaultUserRole, setDefaultUserRole] = useState(data.userManagement?.defaultUserRole || 'User');
  const [maxAllowedDevices, setMaxAllowedDevices] = useState(data.userManagement?.maxAllowedDevices || 5);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(data.userManagement?.sessionTimeoutMinutes || 30);
  const [passwordMinLength, setPasswordMinLength] = useState(data.userManagement?.passwordComplexity?.minLength || 8);
  const [passwordRequireSpecialChar, setPasswordRequireSpecialChar] = useState(data.userManagement?.passwordComplexity?.requireSpecialChar ?? true);
  const [enableLoginAlerts, setEnableLoginAlerts] = useState(data.userManagement?.enableLoginAlerts ?? false);
  const [enableUserDataDownload, setEnableUserDataDownload] = useState(data.userManagement?.enableUserDataDownload ?? false);

  // --- Data & Reporting Settings States ---
  const [dataRetentionDays, setDataRetentionDays] = useState(data.dataReporting?.dataRetentionDays || 365);
  const [enableAutomatedReports, setEnableAutomatedReports] = useState(data.dataReporting?.enableAutomatedReports ?? false);
  const [reportFrequency, setReportFrequency] = useState(data.dataReporting?.reportFrequency || 'Monthly');
  const [reportEmailRecipients, setReportEmailRecipients] = useState(data.dataReporting?.reportEmailRecipients || ''); // Comma-separated emails
  const [enableAuditLogs, setEnableAuditLogs] = useState(data.dataReporting?.enableAuditLogs ?? false);
  const [gdprComplianceMode, setGdprComplianceMode] = useState(data.dataReporting?.gdprComplianceMode ?? false);
  const [enableUserActivityDownload, setEnableUserActivityDownload] = useState(data.dataReporting?.enableUserActivityDownload ?? false);
  const [enableAnonymousAnalytics, setEnableAnonymousAnalytics] = useState(data.dataReporting?.enableAnonymousAnalytics ?? false);
  const [reportWebhookUrl, setReportWebhookUrl] = useState(data.dataReporting?.reportWebhookUrl || '');

  // --- Integrations Settings States ---
  const [paymentGatewayApiKey, setPaymentGatewayApiKey] = useState(data.integrations?.paymentGatewayApiKey || '');
  const [upiQrCodeUrl, setUpiQrCodeUrl] = useState(data.integrations?.upiQrCodeUrl || ''); // URL for UPI QR Code image
  const [tradingPlatformWebhookUrl, setTradingPlatformWebhookUrl] = useState(data.integrations?.tradingPlatformWebhookUrl || '');
  const [emailServiceApiKey, setEmailServiceApiKey] = useState(data.integrations?.emailServiceApiKey || '');
  const [smsGatewayApiKey, setSmsGatewayApiKey] = useState(data.integrations?.smsGatewayApiKey || '');
  const [slackTeamsWebhookUrl, setSlackTeamsWebhookUrl] = useState(data.integrations?.slackTeamsWebhookUrl || '');
  const [thirdPartyAnalyticsKey, setThirdPartyAnalyticsKey] = useState(data.integrations?.thirdPartyAnalyticsKey || '');
  const [webhookSecretToken, setWebhookSecretToken] = useState(data.integrations?.webhookSecretToken || '');

  // --- System Performance Settings States ---
  const [enableCache, setEnableCache] = useState(data.systemPerformance?.enableCache ?? true);
  const [cacheExpiryMinutes, setCacheExpiryMinutes] = useState(data.systemPerformance?.cacheExpiryMinutes || 60);
  const [enableCdn, setEnableCdn] = useState(data.systemPerformance?.enableCdn ?? false);
  const [apiRateLimitRequests, setApiRateLimitRequests] = useState(data.systemPerformance?.apiRateLimitRequests || 1000);
  const [maintenanceMode, setMaintenanceMode] = useState(data.systemPerformance?.maintenanceMode ?? false);
  const [backupFrequency, setBackupFrequency] = useState(data.systemPerformance?.backupFrequency || 'Daily');
  const [rollbackPoint, setRollbackPoint] = useState(data.systemPerformance?.rollbackPoint || ''); // e.g., 'Latest', '2023-01-01'
  const [enableErrorTracking, setEnableErrorTracking] = useState(data.systemPerformance?.enableErrorTracking ?? false);
  const [systemHealthEmailRecipients, setSystemHealthEmailRecipients] = useState(data.systemPerformance?.systemHealthEmailRecipients || '');


  // State for form validation errors, mapping field names to error messages.
  const [formErrors, setFormErrors] = useState({});
  // State to control the visibility of the save success message.
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // State to manage the currently active section for tabbed navigation
  const [activeSection, setActiveSection] = useState('general'); // 'general', 'users', 'data-reports', 'integrations', 'performance'

  // Refs for each section to enable scrolling to them
  const generalSettingsRef = useRef(null);
  const userManagementRef = useRef(null);
  const dataReportingRef = useRef(null);
  const integrationsRef = useRef(null);
  const systemPerformanceRef = useRef(null);

  /**
   * useEffect hook to re-initialize all form states when the `data` prop changes.
   * This is crucial for ensuring that if the settings data is loaded asynchronously
   * or updated from an external source, the form fields always reflect the latest values.
   */
  useEffect(() => {
    // General Settings
    setAppName(data.appName || '');
    setHeroBannerText(data.heroBannerText || '');
    setFooterDisclaimer(data.footerDisclaimer || '');
    setDefaultCurrency(data.defaultCurrency || 'INR');
    setLanguageDefaults(data.languageDefaults || 'English');
    setDemoModeVisible(data.demoModeVisible ?? false);
    setAuthPageVisible(data.authPageVisible ?? false);
    setTermsOfServiceLink(data.termsOfServiceLink || '');
    setPrivacyPolicyLink(data.privacyPolicyLink || '');
    setTimezoneDefault(data.timezoneDefault || 'Auto Detect');
    setCommissionPercentage(data.commissionPercentage || 0);
    setBasicPlanDesc(data.planDescriptions?.basic || '');
    setPremiumPlanDesc(data.planDescriptions?.premium || '');

    // User Management Settings
    setEnableUserRegistration(data.userManagement?.enableUserRegistration ?? true);
    setRequireEmailVerification(data.userManagement?.requireEmailVerification ?? false);
    setRequirePhoneVerification(data.userManagement?.requirePhoneVerification ?? false);
    setDefaultUserRole(data.userManagement?.defaultUserRole || 'User');
    setMaxAllowedDevices(data.userManagement?.maxAllowedDevices || 5);
    setSessionTimeoutMinutes(data.userManagement?.sessionTimeoutMinutes || 30);
    setPasswordMinLength(data.userManagement?.passwordComplexity?.minLength || 8);
    setPasswordRequireSpecialChar(data.userManagement?.passwordComplexity?.requireSpecialChar ?? true);
    setEnableLoginAlerts(data.userManagement?.enableLoginAlerts ?? false);
    setEnableUserDataDownload(data.userManagement?.enableUserDataDownload ?? false);

    // Data & Reporting Settings
    setDataRetentionDays(data.dataReporting?.dataRetentionDays || 365);
    setEnableAutomatedReports(data.dataReporting?.enableAutomatedReports ?? false);
    setReportFrequency(data.dataReporting?.reportFrequency || 'Monthly');
    setReportEmailRecipients(data.dataReporting?.reportEmailRecipients || '');
    setEnableAuditLogs(data.dataReporting?.enableAuditLogs ?? false);
    setGdprComplianceMode(data.dataReporting?.gdprComplianceMode ?? false);
    setEnableUserActivityDownload(data.dataReporting?.enableUserActivityDownload ?? false);
    setEnableAnonymousAnalytics(data.dataReporting?.enableAnonymousAnalytics ?? false);
    setReportWebhookUrl(data.dataReporting?.reportWebhookUrl || '');

    // Integrations Settings
    setPaymentGatewayApiKey(data.integrations?.paymentGatewayApiKey || '');
    setUpiQrCodeUrl(data.integrations?.upiQrCodeUrl || '');
    setTradingPlatformWebhookUrl(data.integrations?.tradingPlatformWebhookUrl || '');
    setEmailServiceApiKey(data.integrations?.emailServiceApiKey || '');
    setSmsGatewayApiKey(data.integrations?.smsGatewayApiKey || '');
    setSlackTeamsWebhookUrl(data.integrations?.slackTeamsWebhookUrl || '');
    setThirdPartyAnalyticsKey(data.integrations?.thirdPartyAnalyticsKey || '');
    setWebhookSecretToken(data.integrations?.webhookSecretToken || '');

    // System Performance Settings
    setEnableCache(data.systemPerformance?.enableCache ?? true);
    setCacheExpiryMinutes(data.systemPerformance?.cacheExpiryMinutes || 60);
    setEnableCdn(data.systemPerformance?.enableCdn ?? false);
    setApiRateLimitRequests(data.systemPerformance?.apiRateLimitRequests || 1000);
    setMaintenanceMode(data.systemPerformance?.maintenanceMode ?? false);
    setBackupFrequency(data.systemPerformance?.backupFrequency || 'Daily');
    setRollbackPoint(data.systemPerformance?.rollbackPoint || '');
    setEnableErrorTracking(data.systemPerformance?.enableErrorTracking ?? false);
    setSystemHealthEmailRecipients(data.systemPerformance?.systemHealthEmailRecipients || '');

    setFormErrors({}); // Clear any validation errors when data changes
  }, [data]);

  /**
   * Helper function to validate URL format.
   * @param {string} url - The URL string to validate.
   * @returns {boolean} True if valid URL, false otherwise.
   */
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  /**
   * Helper function to validate comma-separated emails.
   * @param {string} emailString - The string containing comma-separated emails.
   * @returns {string[]} An array of invalid emails, or empty array if all are valid.
   */
  const validateEmails = (emailString) => {
    if (!emailString.trim()) return [];
    const emails = emailString.split(',').map(email => email.trim()).filter(email => email);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.filter(email => !emailRegex.test(email));
  };

  /**
   * Validates all form fields. This function is called on form submission
   * and can also be used for real-time validation as needed.
   * Updates the `formErrors` state with any validation messages.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};

    // --- General Settings Validation ---
    if (!appName.trim()) errors.appName = 'App Name is required.';
    else if (appName.length > 50) errors.appName = 'App Name cannot exceed 50 characters.';

    if (commissionPercentage < 0 || commissionPercentage > 100) {
      errors.commissionPercentage = 'Commission percentage must be between 0 and 100.';
    }
    if (!heroBannerText.trim()) {
      errors.heroBannerText = 'Hero Banner Text is required.';
    } else if (heroBannerText.length > 100) {
      errors.heroBannerText = `Hero Banner Text cannot exceed 100 characters. Current: ${heroBannerText.length}`;
    }
    if (!footerDisclaimer.trim()) {
      errors.footerDisclaimer = 'Footer Disclaimer is required.';
    } else if (footerDisclaimer.length > 200) {
      errors.footerDisclaimer = `Footer Disclaimer cannot exceed 200 characters. Current: ${footerDisclaimer.length}`;
    }
    if (!basicPlanDesc.trim()) {
      errors.basicPlanDesc = 'Basic Plan Description is required.';
    } else if (basicPlanDesc.length > 150) {
      errors.basicPlanDesc = `Basic Plan Description cannot exceed 150 characters. Current: ${basicPlanDesc.length}`;
    }
    if (!premiumPlanDesc.trim()) {
      errors.premiumPlanDesc = 'Premium Plan Description is required.';
    } else if (premiumPlanDesc.length > 150) {
      errors.premiumPlanDesc = `Premium Plan Description cannot exceed 150 characters. Current: ${premiumPlanDesc.length}`;
    }
    if (termsOfServiceLink.trim() && !isValidUrl(termsOfServiceLink)) errors.termsOfServiceLink = 'Invalid URL format.';
    if (privacyPolicyLink.trim() && !isValidUrl(privacyPolicyLink)) errors.privacyPolicyLink = 'Invalid URL format.';


    // --- User Management Validation ---
    if (maxAllowedDevices < 1) errors.maxAllowedDevices = 'Max allowed devices must be at least 1.';
    if (sessionTimeoutMinutes < 1) errors.sessionTimeoutMinutes = 'Session timeout must be at least 1 minute.';
    if (passwordMinLength < 6) errors.passwordMinLength = 'Password minimum length must be at least 6.'; // Common minimum

    // --- Data & Reporting Validation ---
    if (dataRetentionDays < 0) errors.dataRetentionDays = 'Data retention days cannot be negative.';
    if (enableAutomatedReports) {
      const invalidReportEmails = validateEmails(reportEmailRecipients);
      if (!reportEmailRecipients.trim()) errors.reportEmailRecipients = 'Email recipients are required if automated reports are enabled.';
      else if (invalidReportEmails.length > 0) errors.reportEmailRecipients = `Invalid email format(s): ${invalidReportEmails.join(', ')}`;
    }
    if (reportWebhookUrl.trim() && !isValidUrl(reportWebhookUrl)) errors.reportWebhookUrl = 'Invalid Webhook URL format.';


    // --- Integrations Validation ---
    if (paymentGatewayApiKey.trim() && paymentGatewayApiKey.length < 10) errors.paymentGatewayApiKey = 'API Key seems too short. Minimum 10 characters recommended.';
    if (upiQrCodeUrl.trim() && !isValidUrl(upiQrCodeUrl)) errors.upiQrCodeUrl = 'Invalid URL format for UPI QR Code.';
    if (tradingPlatformWebhookUrl.trim() && !isValidUrl(tradingPlatformWebhookUrl)) errors.tradingPlatformWebhookUrl = 'Invalid Webhook URL format.';
    if (emailServiceApiKey.trim() && emailServiceApiKey.length < 10) errors.emailServiceApiKey = 'Email Service API Key seems too short. Minimum 10 characters recommended.';
    if (smsGatewayApiKey.trim() && smsGatewayApiKey.length < 10) errors.smsGatewayApiKey = 'SMS Gateway Key seems too short. Minimum 10 characters recommended.';
    if (slackTeamsWebhookUrl.trim() && !isValidUrl(slackTeamsWebhookUrl)) errors.slackTeamsWebhookUrl = 'Invalid Slack/Teams Webhook URL format.';
    if (webhookSecretToken.trim() && webhookSecretToken.length < 20) errors.webhookSecretToken = 'Webhook Secret Token seems too short. Minimum 20 characters recommended.';


    // --- System Performance Validation ---
    if (enableCache && cacheExpiryMinutes < 0) errors.cacheExpiryMinutes = 'Cache expiry minutes cannot be negative when caching is enabled.';
    if (apiRateLimitRequests < 0) errors.apiRateLimitRequests = 'API Rate Limit must be non-negative.';
    if (enableErrorTracking) {
      const invalidSystemHealthEmails = validateEmails(systemHealthEmailRecipients);
      if (!systemHealthEmailRecipients.trim()) errors.systemHealthEmailRecipients = 'System Health Email recipients are required if error tracking is enabled.';
      else if (invalidSystemHealthEmails.length > 0) errors.systemHealthEmailRecipients = `Invalid email format(s): ${invalidSystemHealthEmails.join(', ')}`;
    }


    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles saving the changes made in the settings form.
   * Prevents default form submission, validates the form, and if valid,
   * constructs the updated settings object and simulates sending it to an API.
   * Displays a success message upon successful (simulated) save.
   * @param {Event} e - The form submission event.
   */
  const handleSaveChanges = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error('Form validation failed. Please correct the errors.');
      return;
    }

    const updatedSettings = {
      // General Settings
      appName,
      heroBannerText,
      footerDisclaimer,
      defaultCurrency,
      languageDefaults,
      demoModeVisible,
      authPageVisible,
      termsOfServiceLink,
      privacyPolicyLink,
      timezoneDefault,
      commissionPercentage,
      planDescriptions: {
        basic: basicPlanDesc,
        premium: premiumPlanDesc,
      },
      // User Management
      userManagement: {
        enableUserRegistration,
        requireEmailVerification,
        requirePhoneVerification,
        defaultUserRole,
        maxAllowedDevices,
        sessionTimeoutMinutes,
        passwordComplexity: {
          minLength: passwordMinLength,
          requireSpecialChar: passwordRequireSpecialChar,
        },
        enableLoginAlerts,
        enableUserDataDownload,
      },
      // Data & Reporting
      dataReporting: {
        dataRetentionDays,
        enableAutomatedReports,
        reportFrequency,
        reportEmailRecipients: reportEmailRecipients.split(',').map(email => email.trim()).filter(email => email).join(', '),
        enableAuditLogs,
        gdprComplianceMode,
        enableUserActivityDownload,
        enableAnonymousAnalytics,
        reportWebhookUrl,
      },
      // Integrations
      integrations: {
        paymentGatewayApiKey,
        upiQrCodeUrl,
        tradingPlatformWebhookUrl,
        emailServiceApiKey,
        smsGatewayApiKey,
        slackTeamsWebhookUrl,
        thirdPartyAnalyticsKey,
        webhookSecretToken,
      },
      // System Performance
      systemPerformance: {
        enableCache,
        cacheExpiryMinutes,
        enableCdn,
        apiRateLimitRequests,
        maintenanceMode,
        backupFrequency,
        rollbackPoint,
        enableErrorTracking,
        systemHealthEmailRecipients: systemHealthEmailRecipients.split(',').map(email => email.trim()).filter(email => email).join(', '),
      },
    };

    console.log('Saving Settings:', updatedSettings);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  /**
   * Handles canceling the changes made in the form.
   * This function resets all form fields to their initial values as loaded from the `data` prop,
   * effectively discarding any unsaved modifications. It also clears any validation errors.
   */
  const handleCancelChanges = () => {
    // General Settings
    setAppName(data.appName || '');
    setHeroBannerText(data.heroBannerText || '');
    setFooterDisclaimer(data.footerDisclaimer || '');
    setDefaultCurrency(data.defaultCurrency || 'INR');
    setLanguageDefaults(data.languageDefaults || 'English');
    setDemoModeVisible(data.demoModeVisible ?? false);
    setAuthPageVisible(data.authPageVisible ?? false);
    setTermsOfServiceLink(data.termsOfServiceLink || '');
    setPrivacyPolicyLink(data.privacyPolicyLink || '');
    setTimezoneDefault(data.timezoneDefault || 'Auto Detect');
    setCommissionPercentage(data.commissionPercentage || 0);
    setBasicPlanDesc(data.planDescriptions?.basic || '');
    setPremiumPlanDesc(data.planDescriptions?.premium || '');

    // User Management Settings
    setEnableUserRegistration(data.userManagement?.enableUserRegistration ?? true);
    setRequireEmailVerification(data.userManagement?.requireEmailVerification ?? false);
    setRequirePhoneVerification(data.userManagement?.requirePhoneVerification ?? false);
    setDefaultUserRole(data.userManagement?.defaultUserRole || 'User');
    setMaxAllowedDevices(data.userManagement?.maxAllowedDevices || 5);
    setSessionTimeoutMinutes(data.userManagement?.sessionTimeoutMinutes || 30);
    setPasswordMinLength(data.userManagement?.passwordComplexity?.minLength || 8);
    setPasswordRequireSpecialChar(data.userManagement?.passwordComplexity?.requireSpecialChar ?? true);
    setEnableLoginAlerts(data.userManagement?.enableLoginAlerts ?? false);
    setEnableUserDataDownload(data.userManagement?.enableUserDataDownload ?? false);

    // Data & Reporting Settings
    setDataRetentionDays(data.dataReporting?.dataRetentionDays || 365);
    setEnableAutomatedReports(data.dataReporting?.enableAutomatedReports ?? false);
    setReportFrequency(data.dataReporting?.reportFrequency || 'Monthly');
    setReportEmailRecipients(data.dataReporting?.reportEmailRecipients || '');
    setEnableAuditLogs(data.dataReporting?.enableAuditLogs ?? false);
    setGdprComplianceMode(data.dataReporting?.gdprComplianceMode ?? false);
    setEnableUserActivityDownload(data.dataReporting?.enableUserActivityDownload ?? false);
    setEnableAnonymousAnalytics(data.dataReporting?.enableAnonymousAnalytics ?? false);
    setReportWebhookUrl(data.dataReporting?.reportWebhookUrl || '');

    // Integrations Settings
    setPaymentGatewayApiKey(data.integrations?.paymentGatewayApiKey || '');
    setUpiQrCodeUrl(data.integrations?.upiQrCodeUrl || '');
    setTradingPlatformWebhookUrl(data.integrations?.tradingPlatformWebhookUrl || '');
    setEmailServiceApiKey(data.integrations?.emailServiceApiKey || '');
    setSmsGatewayApiKey(data.integrations?.smsGatewayApiKey || '');
    setSlackTeamsWebhookUrl(data.integrations?.slackTeamsWebhookUrl || '');
    setThirdPartyAnalyticsKey(data.integrations?.thirdPartyAnalyticsKey || '');
    setWebhookSecretToken(data.integrations?.webhookSecretToken || '');

    // System Performance Settings
    setEnableCache(data.systemPerformance?.enableCache ?? true);
    setCacheExpiryMinutes(data.systemPerformance?.cacheExpiryMinutes || 60);
    setEnableCdn(data.systemPerformance?.enableCdn ?? false);
    setApiRateLimitRequests(data.systemPerformance?.apiRateLimitRequests || 1000);
    setMaintenanceMode(data.systemPerformance?.maintenanceMode ?? false);
    setBackupFrequency(data.systemPerformance?.backupFrequency || 'Daily');
    setRollbackPoint(data.systemPerformance?.rollbackPoint || '');
    setEnableErrorTracking(data.systemPerformance?.enableErrorTracking ?? false);
    setSystemHealthEmailRecipients(data.systemPerformance?.systemHealthEmailRecipients || '');

    setFormErrors({}); // Clear any validation errors
    setShowSaveSuccess(false); // Hide any success message
    console.log('Changes cancelled. Form reset to original data.');
  };

  /**
   * A reusable ToggleSwitch component for boolean settings.
   * This component provides a visually appealing toggle switch with a label,
   * current status (Enabled/Disabled), help text, and optional error display.
   * It's defined locally here to be self-contained within Settings.
   *
   * @param {object} props - Component props.
   * @param {string} props.id - Unique ID for the input and label association.
   * @param {string} props.label - The main label text for the toggle.
   * @param {boolean} props.checked - The current checked state of the toggle.
   * @param {function} props.onChange - Callback function when the toggle state changes.
   * @param {string} [props.helpText] - Optional descriptive text for the setting.
   * @param {string} [props.error] - Optional error message to display.
   */
  const ToggleSwitch = ({ id, label, checked, onChange, helpText, error }) => (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-text-base mb-2">
        {label}
      </label>
      <label className="flex items-center cursor-pointer">
        <div className="relative">
          {/* Hidden checkbox input, styled visually by the divs below */}
          <input
            type="checkbox"
            id={id}
            className="sr-only peer" // sr-only hides it visually but keeps it accessible
            checked={checked}
            onChange={onChange}
          />
          {/* The visual track of the toggle switch */}
          <div className="block bg-border-base w-14 h-8 rounded-full transition-colors peer-checked:bg-primary"></div>
          {/* The draggable 'dot' of the toggle switch */}
          <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform peer-checked:translate-x-[120%]" style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.1)' }}></div>
        </div>
        {/* Display the current status (Enabled/Disabled) next to the toggle */}
        <div className="ml-3 text-text-base font-medium">{checked ? 'Enabled' : 'Disabled'}</div>
      </label>
      {/* Optional help text and error message */}
      {helpText && <p className="text-xs text-text-light mt-1 flex items-center gap-1"><Info className="w-3 h-3 inline-block" /> {helpText}</p>}
      {error && <p className="text-danger text-xs mt-1">{error}</p>}
    </div>
  );

  /**
   * Handles navigation to a specific section and sets it as active.
   * @param {string} sectionName - The name of the section to activate and scroll to.
   * @param {React.RefObject} ref - The ref object pointing to the section's DOM element.
   */
  const handleSectionNavigation = (sectionName, ref) => {
    setActiveSection(sectionName); // Set the active section state
    // No need to scroll if we are hiding/showing sections
  };


  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <SettingsIcon className="w-8 h-8 text-primary" /> Application Settings
      </h2>

      {/* Navigation Bar for Settings Sections */}
      <nav className="sticky top-0 bg-bg-base z-10 py-4 border-b border-border-base shadow-sm -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 sm:gap-4 justify-center">
          <button
            type="button"
            onClick={() => handleSectionNavigation('general', generalSettingsRef)}
            className={`action-button-custom flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${activeSection === 'general' ? 'bg-primary text-white shadow-md' : 'bg-card-bg text-secondary hover:bg-primary hover:text-white'}`}
          >
            <SlidersHorizontal className="w-4 h-4" /> General
          </button>
          <button
            type="button"
            onClick={() => handleSectionNavigation('users', userManagementRef)}
            className={`action-button-custom flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${activeSection === 'users' ? 'bg-primary text-white shadow-md' : 'bg-card-bg text-secondary hover:bg-primary hover:text-white'}`}
          >
            <UserCheck className="w-4 h-4" /> Users
          </button>
          <button
            type="button"
            onClick={() => handleSectionNavigation('data-reports', dataReportingRef)}
            className={`action-button-custom flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${activeSection === 'data-reports' ? 'bg-primary text-white shadow-md' : 'bg-card-bg text-secondary hover:bg-primary hover:text-white'}`}
          >
            <BarChart2 className="w-4 h-4" /> Data & Reports
          </button>
          <button
            type="button"
            onClick={() => handleSectionNavigation('integrations', integrationsRef)}
            className={`action-button-custom flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${activeSection === 'integrations' ? 'bg-primary text-white shadow-md' : 'bg-card-bg text-secondary hover:bg-primary hover:text-white'}`}
          >
            <Plug className="w-4 h-4" /> Integrations
          </button>
          <button
            type="button"
            onClick={() => handleSectionNavigation('performance', systemPerformanceRef)}
            className={`action-button-custom flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 ease-in-out ${activeSection === 'performance' ? 'bg-primary text-white shadow-md' : 'bg-card-bg text-secondary hover:bg-primary hover:text-white'}`}
          >
            <Cpu className="w-4 h-4" /> Performance
          </button>
        </div>
      </nav>

      <form onSubmit={handleSaveChanges} className="space-y-8">
        {/* General Settings Section Card */}
        {activeSection === 'general' && (
          <div ref={generalSettingsRef} className="kpi-card-custom p-6">
            <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
              <SlidersHorizontal className="w-6 h-6 text-accent" /> General Settings
            </h3>
            <div className="space-y-6">
              {/* App Name */}
              <div>
                <label htmlFor="appName" className="block text-sm font-medium text-text-base mb-1">
                  App Name
                </label>
                <input
                  type="text"
                  id="appName"
                  value={appName}
                  onChange={(e) => {
                    setAppName(e.target.value);
                    if (!e.target.value.trim()) {
                      setFormErrors(prev => ({ ...prev, appName: 'App Name is required.' }));
                    } else if (e.target.value.length > 50) {
                      setFormErrors(prev => ({ ...prev, appName: 'App Name cannot exceed 50 characters.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, appName: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.appName ? 'border-danger' : 'border-border-base'}`}
                  maxLength="50"
                />
                <p className="text-xs text-text-light mt-1">{appName.length}/50 characters.</p>
                {formErrors.appName && <p className="text-danger text-xs mt-1">{formErrors.appName}</p>}
              </div>

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
                  onChange={(e) => {
                    setHeroBannerText(e.target.value);
                    if (!e.target.value.trim()) {
                      setFormErrors(prev => ({ ...prev, heroBannerText: 'Hero Banner Text is required.' }));
                    } else if (e.target.value.length > 100) {
                      setFormErrors(prev => ({ ...prev, heroBannerText: `Hero Banner Text cannot exceed 100 characters. Current: ${e.target.value.length}` }));
                    } else {
                      setFormErrors(prev => ({ ...prev, heroBannerText: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.heroBannerText ? 'border-danger' : 'border-border-base'}`}
                  maxLength="100"
                />
                <p className="text-xs text-text-light mt-1">{heroBannerText.length}/100 characters.</p>
                {formErrors.heroBannerText && <p className="text-danger text-xs mt-1">{formErrors.heroBannerText}</p>}
              </div>
              <div>
                <label htmlFor="footerDisclaimer" className="block text-sm font-medium text-text-base mb-1">
                  Footer Disclaimer
                </label>
                <textarea
                  id="footerDisclaimer"
                  value={footerDisclaimer}
                  onChange={(e) => {
                    setFooterDisclaimer(e.target.value);
                    if (!e.target.value.trim()) {
                      setFormErrors(prev => ({ ...prev, footerDisclaimer: 'Footer Disclaimer is required.' }));
                    } else if (e.target.value.length > 200) {
                      setFormErrors(prev => ({ ...prev, footerDisclaimer: `Footer Disclaimer cannot exceed 200 characters. Current: ${e.target.value.length}` }));
                    } else {
                      setFormErrors(prev => ({ ...prev, footerDisclaimer: '' }));
                    }
                  }}
                  rows="3"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.footerDisclaimer ? 'border-danger' : 'border-border-base'}`}
                  maxLength="200"
                ></textarea>
                <p className="text-xs text-text-light mt-1">{footerDisclaimer.length}/200 characters.</p>
                {formErrors.footerDisclaimer && <p className="text-danger text-xs mt-1">{formErrors.footerDisclaimer}</p>}
              </div>

              {/* Plan Descriptions Section */}
              <h4 className="text-lg font-semibold text-secondary pt-4 border-t border-border-base flex items-center gap-2">
                <Zap className="w-4 h-4" /> Plan Descriptions
              </h4>
              <div>
                <label htmlFor="basicPlanDesc" className="block text-sm font-medium text-text-base mb-1">
                  Basic Plan Description
                </label>
                <textarea
                  id="basicPlanDesc"
                  value={basicPlanDesc}
                  onChange={(e) => {
                    setBasicPlanDesc(e.target.value);
                    if (!e.target.value.trim()) {
                      setFormErrors(prev => ({ ...prev, basicPlanDesc: 'Basic Plan Description is required.' }));
                    } else if (e.target.value.length > 150) {
                      setFormErrors(prev => ({ ...prev, basicPlanDesc: `Basic Plan Description cannot exceed 150 characters. Current: ${e.target.value.length}` }));
                    } else {
                      setFormErrors(prev => ({ ...prev, basicPlanDesc: '' }));
                    }
                  }}
                  rows="2"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.basicPlanDesc ? 'border-danger' : 'border-border-base'}`}
                  maxLength="150"
                ></textarea>
                <p className="text-xs text-text-light mt-1">{basicPlanDesc.length}/150 characters.</p>
                {formErrors.basicPlanDesc && <p className="text-danger text-xs mt-1">{formErrors.basicPlanDesc}</p>}
              </div>
              <div>
                <label htmlFor="premiumPlanDesc" className="block text-sm font-medium text-text-base mb-1">
                  Premium Plan Description
                </label>
                <textarea
                  id="premiumPlanDesc"
                  value={premiumPlanDesc}
                  onChange={(e) => {
                    setPremiumPlanDesc(e.target.value);
                    if (!e.target.value.trim()) {
                      setFormErrors(prev => ({ ...prev, premiumPlanDesc: 'Premium Plan Description is required.' }));
                    } else if (e.target.value.length > 150) {
                      setFormErrors(prev => ({ ...prev, premiumPlanDesc: `Premium Plan Description cannot exceed 150 characters. Current: ${e.target.value.length}` }));
                    } else {
                      setFormErrors(prev => ({ ...prev, premiumPlanDesc: '' }));
                    }
                  }}
                  rows="2"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.premiumPlanDesc ? 'border-danger' : 'border-border-base'}`}
                  maxLength="150"
                ></textarea>
                <p className="text-xs text-text-light mt-1">{premiumPlanDesc.length}/150 characters.</p>
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
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      setCommissionPercentage(isNaN(value) ? 0 : value);
                      if (isNaN(value) || value < 0 || value > 100) {
                        setFormErrors(prev => ({ ...prev, commissionPercentage: 'Commission percentage must be between 0 and 100.' }));
                      } else {
                        setFormErrors(prev => ({ ...prev, commissionPercentage: '' }));
                      }
                    }}
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

              {/* Currency and Timezone Defaults */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="defaultCurrency" className="block text-sm font-medium text-text-base mb-1">
                    Default Currency
                  </label>
                  <select
                    id="defaultCurrency"
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="INR">INR</option>
                    <option value="USD">USD</option>
                    {/* Add more currencies as needed */}
                  </select>
                </div>
                <div>
                  <label htmlFor="timezoneDefault" className="block text-sm font-medium text-text-base mb-1">
                    Default Timezone
                  </label>
                  <select
                    id="timezoneDefault"
                    value={timezoneDefault}
                    onChange={(e) => setTimezoneDefault(e.target.value)}
                    className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  >
                    <option value="Auto Detect">Auto Detect</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                    <option value="America/New_York">America/New_York (EST)</option>
                    {/* Add more timezones as needed */}
                  </select>
                </div>
              </div>

              {/* Legal Links */}
              <h4 className="text-lg font-semibold text-secondary pt-4 border-t border-border-base flex items-center gap-2">
                <Link className="w-4 h-4" /> Legal Links
              </h4>
              <div>
                <label htmlFor="termsOfServiceLink" className="block text-sm font-medium text-text-base mb-1">
                  Terms of Service Link
                </label>
                <input
                  type="url"
                  id="termsOfServiceLink"
                  value={termsOfServiceLink}
                  onChange={(e) => {
                    setTermsOfServiceLink(e.target.value);
                    if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                      setFormErrors(prev => ({ ...prev, termsOfServiceLink: 'Invalid URL format.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, termsOfServiceLink: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.termsOfServiceLink ? 'border-danger' : 'border-border-base'}`}
                  placeholder="https://your-app.com/terms"
                />
                {formErrors.termsOfServiceLink && <p className="text-danger text-xs mt-1">{formErrors.termsOfServiceLink}</p>}
              </div>
              <div>
                <label htmlFor="privacyPolicyLink" className="block text-sm font-medium text-text-base mb-1">
                  Privacy Policy Link
                </label>
                <input
                  type="url"
                  id="privacyPolicyLink"
                  value={privacyPolicyLink}
                  onChange={(e) => {
                    setPrivacyPolicyLink(e.target.value);
                    if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                      setFormErrors(prev => ({ ...prev, privacyPolicyLink: 'Invalid URL format.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, privacyPolicyLink: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.privacyPolicyLink ? 'border-danger' : 'border-border-base'}`}
                  placeholder="https://your-app.com/privacy"
                />
                {formErrors.privacyPolicyLink && <p className="text-danger text-xs mt-1">{formErrors.privacyPolicyLink}</p>}
              </div>

            </div>
          </div>
        )}

        {/* --- User Management Settings --- */}
        {activeSection === 'users' && (
          <div ref={userManagementRef} className="kpi-card-custom p-6">
            <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-accent" /> User Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                id="enableUserRegistration"
                label="Enable User Registration"
                checked={enableUserRegistration}
                onChange={(e) => setEnableUserRegistration(e.target.checked)}
                helpText="Allow new users to sign up for accounts."
              />
              <ToggleSwitch
                id="requireEmailVerification"
                label="Require Email Verification"
                checked={requireEmailVerification}
                onChange={(e) => setRequireEmailVerification(e.target.checked)}
                helpText="New users must verify their email address before logging in."
              />
              <ToggleSwitch
                id="requirePhoneVerification"
                label="Require Phone Verification"
                checked={requirePhoneVerification}
                onChange={(e) => setRequirePhoneVerification(e.target.checked)}
                helpText="Require phone number verification (SMS OTP) during sign-up or login."
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
                  <option value="Admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="maxAllowedDevices" className="block text-sm font-medium text-text-base mb-1">
                  Max Allowed Devices
                </label>
                <input
                  type="number"
                  id="maxAllowedDevices"
                  value={maxAllowedDevices}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setMaxAllowedDevices(isNaN(value) ? 1 : value);
                    if (isNaN(value) || value < 1) {
                      setFormErrors(prev => ({ ...prev, maxAllowedDevices: 'Must be at least 1 device.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, maxAllowedDevices: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.maxAllowedDevices ? 'border-danger' : 'border-border-base'}`}
                  min="1"
                />
                <p className="text-xs text-text-light mt-1">Number of simultaneous logins allowed per user.</p>
                {formErrors.maxAllowedDevices && <p className="text-danger text-xs mt-1">{formErrors.maxAllowedDevices}</p>}
              </div>
              <div>
                <label htmlFor="sessionTimeoutMinutes" className="block text-sm font-medium text-text-base mb-1">
                  Session Timeout (Minutes)
                </label>
                <input
                  type="number"
                  id="sessionTimeoutMinutes"
                  value={sessionTimeoutMinutes}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setSessionTimeoutMinutes(isNaN(value) ? 1 : value);
                    if (isNaN(value) || value < 1) {
                      setFormErrors(prev => ({ ...prev, sessionTimeoutMinutes: 'Must be at least 1 minute.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, sessionTimeoutMinutes: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.sessionTimeoutMinutes ? 'border-danger' : 'border-border-base'}`}
                  min="1"
                />
                <p className="text-xs text-text-light mt-1">Idle time before user is automatically logged out.</p>
                {formErrors.sessionTimeoutMinutes && <p className="text-danger text-xs mt-1">{formErrors.sessionTimeoutMinutes}</p>}
              </div>

              {/* Password Complexity Rules */}
              <h4 className="text-lg font-semibold text-secondary pt-4 border-t border-border-base flex items-center gap-2">
                <Lock className="w-4 h-4" /> Password Rules
              </h4>
              <div>
                <label htmlFor="passwordMinLength" className="block text-sm font-medium text-text-base mb-1">
                  Min Password Length
                </label>
                <input
                  type="number"
                  id="passwordMinLength"
                  value={passwordMinLength}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setPasswordMinLength(isNaN(value) ? 6 : value);
                    if (isNaN(value) || value < 6) {
                      setFormErrors(prev => ({ ...prev, passwordMinLength: 'Minimum length must be at least 6.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, passwordMinLength: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.passwordMinLength ? 'border-danger' : 'border-border-base'}`}
                  min="6"
                />
                {formErrors.passwordMinLength && <p className="text-danger text-xs mt-1">{formErrors.passwordMinLength}</p>}
              </div>
              <ToggleSwitch
                id="passwordRequireSpecialChar"
                label="Require Special Characters"
                checked={passwordRequireSpecialChar}
                onChange={(e) => setPasswordRequireSpecialChar(e.target.checked)}
                helpText="Enforce inclusion of special characters in passwords."
              />
              <ToggleSwitch
                id="enableLoginAlerts"
                label="Enable Login Alerts"
                checked={enableLoginAlerts}
                onChange={(e) => setEnableLoginAlerts(e.target.checked)}
                helpText="Notify users on new device or unusual login attempts."
              />
              <ToggleSwitch
                id="enableUserDataDownload"
                label="Allow User Data Download"
                checked={enableUserDataDownload}
                onChange={(e) => setEnableUserDataDownload(e.target.checked)}
                helpText="Allow users to download their personal data (GDPR compliance)."
              />
            </div>
          </div>
        )}

        {/* --- Data & Reporting Settings --- */}
        {activeSection === 'data-reports' && (
          <div ref={dataReportingRef} className="kpi-card-custom p-6">
            <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
              <BarChart2 className="w-6 h-6 text-accent" /> Data & Reporting
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setDataRetentionDays(isNaN(value) ? 0 : value);
                    if (isNaN(value) || value < 0) {
                      setFormErrors(prev => ({ ...prev, dataRetentionDays: 'Data retention days cannot be negative.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, dataRetentionDays: '' }));
                    }
                  }}
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
                onChange={(e) => {
                  setEnableAutomatedReports(e.target.checked);
                  if (!e.target.checked) {
                    setFormErrors(prev => ({ ...prev, reportEmailRecipients: '' }));
                  }
                }}
                helpText="Automatically generate and send performance reports."
              />
              <div>
                <label htmlFor="reportFrequency" className="block text-sm font-medium text-text-base mb-1">
                  Report Frequency
                </label>
                <select
                  id="reportFrequency"
                  value={reportFrequency}
                  onChange={(e) => setReportFrequency(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                  disabled={!enableAutomatedReports}
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
              </div>
              <div>
                <label htmlFor="reportEmailRecipients" className="block text-sm font-medium text-text-base mb-1">
                  Report Email Recipients
                </label>
                <textarea
                  id="reportEmailRecipients"
                  value={reportEmailRecipients}
                  onChange={(e) => {
                    setReportEmailRecipients(e.target.value);
                    if (enableAutomatedReports) {
                      const invalidEmails = validateEmails(e.target.value);
                      if (!e.target.value.trim()) {
                        setFormErrors(prev => ({ ...prev, reportEmailRecipients: 'Email recipients are required if automated reports are enabled.' }));
                      } else if (invalidEmails.length > 0) {
                        setFormErrors(prev => ({ ...prev, reportEmailRecipients: `Invalid email format(s): ${invalidEmails.join(', ')}` }));
                      } else {
                        setFormErrors(prev => ({ ...prev, reportEmailRecipients: '' }));
                      }
                    } else {
                      setFormErrors(prev => ({ ...prev, reportEmailRecipients: '' }));
                    }
                  }}
                  rows="2"
                  placeholder="email1@example.com, email2@example.com"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.reportEmailRecipients ? 'border-danger' : 'border-border-base'}`}
                  disabled={!enableAutomatedReports}
                ></textarea>
                <p className="text-xs text-text-light mt-1">Comma-separated email addresses for report delivery.</p>
                {formErrors.reportEmailRecipients && <p className="text-danger text-xs mt-1">{formErrors.reportEmailRecipients}</p>}
              </div>
              <ToggleSwitch
                id="enableAuditLogs"
                label="Enable Audit Logs"
                checked={enableAuditLogs}
                onChange={(e) => setEnableAuditLogs(e.target.checked)}
                helpText="Keep a detailed history of all user actions for compliance and debugging."
              />
              <ToggleSwitch
                id="gdprComplianceMode"
                label="GDPR Compliance Mode"
                checked={gdprComplianceMode}
                onChange={(e) => setGdprComplianceMode(e.target.checked)}
                helpText="Activate stricter data handling and privacy features to comply with GDPR."
              />
              <ToggleSwitch
                id="enableUserActivityDownload"
                label="Allow User Activity Download"
                checked={enableUserActivityDownload}
                onChange={(e) => setEnableUserActivityDownload(e.target.checked)}
                helpText="Allow admins to download detailed user activity logs."
              />
              <ToggleSwitch
                id="enableAnonymousAnalytics"
                label="Enable Anonymous Analytics"
                checked={enableAnonymousAnalytics}
                onChange={(e) => setEnableAnonymousAnalytics(e.target.checked)}
                helpText="Collect anonymous usage data to improve the application."
              />
              <div>
                <label htmlFor="reportWebhookUrl" className="block text-sm font-medium text-text-base mb-1">
                  Report Webhook URL
                </label>
                <input
                  type="url"
                  id="reportWebhookUrl"
                  value={reportWebhookUrl}
                  onChange={(e) => {
                    setReportWebhookUrl(e.target.value);
                    if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                      setFormErrors(prev => ({ ...prev, reportWebhookUrl: 'Invalid Webhook URL format.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, reportWebhookUrl: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.reportWebhookUrl ? 'border-danger' : 'border-border-base'}`}
                  placeholder="https://your-app.com/report-webhook"
                />
                {formErrors.reportWebhookUrl && <p className="text-danger text-xs mt-1">{formErrors.reportWebhookUrl}</p>}
              </div>
            </div>
          </div>
        )}

        {/* --- Integrations Settings --- */}
        {activeSection === 'integrations' && (
          <div ref={integrationsRef} className="kpi-card-custom p-6">
            <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
              <Plug className="w-6 h-6 text-accent" /> Integrations
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
                  onChange={(e) => {
                    setPaymentGatewayApiKey(e.target.value);
                    if (e.target.value.trim() && e.target.value.length < 10) {
                      setFormErrors(prev => ({ ...prev, paymentGatewayApiKey: 'API Key seems too short. Minimum 10 characters recommended.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, paymentGatewayApiKey: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.paymentGatewayApiKey ? 'border-danger' : 'border-border-base'}`}
                  placeholder="e.g., sk_live_xxxxxxxxxxxx"
                />
                {formErrors.paymentGatewayApiKey && <p className="text-danger text-xs mt-1">{formErrors.paymentGatewayApiKey}</p>}
              </div>
              <div>
                <label htmlFor="upiQrCodeUrl" className="block text-sm font-medium text-text-base mb-1">
                  UPI/QR Code Image URL
                </label>
                <input
                  type="url"
                  id="upiQrCodeUrl"
                  value={upiQrCodeUrl}
                  onChange={(e) => {
                    setUpiQrCodeUrl(e.target.value);
                    if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                      setFormErrors(prev => ({ ...prev, upiQrCodeUrl: 'Invalid URL format for UPI QR Code.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, upiQrCodeUrl: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.upiQrCodeUrl ? 'border-danger' : 'border-border-base'}`}
                  placeholder="https://your-app.com/qr.png"
                />
                <p className="text-xs text-text-light mt-1">URL to the UPI QR code image.</p>
                {formErrors.upiQrCodeUrl && <p className="text-danger text-xs mt-1">{formErrors.upiQrCodeUrl}</p>}
              </div>
              <div>
                <label htmlFor="tradingPlatformWebhookUrl" className="block text-sm font-medium text-text-base mb-1">
                  Trading Platform Webhook URL
                </label>
                <input
                  type="url"
                  id="tradingPlatformWebhookUrl"
                  value={tradingPlatformWebhookUrl}
                  onChange={(e) => {
                    setTradingPlatformWebhookUrl(e.target.value);
                    if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                      setFormErrors(prev => ({ ...prev, tradingPlatformWebhookUrl: 'Invalid Webhook URL format.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, tradingPlatformWebhookUrl: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.tradingPlatformWebhookUrl ? 'border-danger' : 'border-border-base'}`}
                  placeholder="https://your-app.com/webhook/trading"
                />
                {formErrors.tradingPlatformWebhookUrl && <p className="text-danger text-xs mt-1">{formErrors.tradingPlatformWebhookUrl}</p>}
              </div>
              <div>
                <label htmlFor="emailServiceApiKey" className="block text-sm font-medium text-text-base mb-1">
                  Email Service API Key
                </label>
                <input
                  type="text"
                  id="emailServiceApiKey"
                  value={emailServiceApiKey}
                  onChange={(e) => {
                    setEmailServiceApiKey(e.target.value);
                    if (e.target.value.trim() && e.target.value.length < 10) {
                      setFormErrors(prev => ({ ...prev, emailServiceApiKey: 'API Key seems too short. Minimum 10 characters recommended.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, emailServiceApiKey: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.emailServiceApiKey ? 'border-danger' : 'border-border-base'}`}
                  placeholder="e.g., SG.xxxxxxxxxxxx"
                />
                {formErrors.emailServiceApiKey && <p className="text-danger text-xs mt-1">{formErrors.emailServiceApiKey}</p>}
              </div>
              <div>
                <label htmlFor="smsGatewayApiKey" className="block text-sm font-medium text-text-base mb-1">
                  SMS Gateway Key
                </label>
                <input
                  type="text"
                  id="smsGatewayApiKey"
                  value={smsGatewayApiKey}
                  onChange={(e) => {
                    setSmsGatewayApiKey(e.target.value);
                    if (e.target.value.trim() && e.target.value.length < 10) {
                      setFormErrors(prev => ({ ...prev, smsGatewayApiKey: 'API Key seems too short. Minimum 10 characters recommended.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, smsGatewayApiKey: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.smsGatewayApiKey ? 'border-danger' : 'border-border-base'}`}
                  placeholder="e.g., ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                />
                {formErrors.smsGatewayApiKey && <p className="text-danger text-xs mt-1">{formErrors.smsGatewayApiKey}</p>}
              </div>
              <div>
                <label htmlFor="slackTeamsWebhookUrl" className="block text-sm font-medium text-text-base mb-1">
                  Slack/Teams Webhook URL
                </label>
                <input
                  type="url"
                  id="slackTeamsWebhookUrl"
                  value={slackTeamsWebhookUrl}
                  onChange={(e) => {
                    setSlackTeamsWebhookUrl(e.target.value);
                    if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                      setFormErrors(prev => ({ ...prev, slackTeamsWebhookUrl: 'Invalid Webhook URL format.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, slackTeamsWebhookUrl: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.slackTeamsWebhookUrl ? 'border-danger' : 'border-border-base'}`}
                  placeholder="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXX"
                />
                {formErrors.slackTeamsWebhookUrl && <p className="text-danger text-xs mt-1">{formErrors.slackTeamsWebhookUrl}</p>}
              </div>
              <div>
                <label htmlFor="thirdPartyAnalyticsKey" className="block text-sm font-medium text-text-base mb-1">
                  3rd-Party Analytics Key
                </label>
                <input
                  type="text"
                  id="thirdPartyAnalyticsKey"
                  value={thirdPartyAnalyticsKey}
                  onChange={(e) => setThirdPartyAnalyticsKey(e.target.value)}
                  className="w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none border-border-base"
                  placeholder="e.g., G-XXXXXXXXXX"
                />
                <p className="text-xs text-text-light mt-1">e.g., Google Analytics, Hotjar tracking ID.</p>
              </div>
              <div>
                <label htmlFor="webhookSecretToken" className="block text-sm font-medium text-text-base mb-1">
                  Webhook Secret Token
                </label>
                <input
                  type="text"
                  id="webhookSecretToken"
                  value={webhookSecretToken}
                  onChange={(e) => {
                    setWebhookSecretToken(e.target.value);
                    if (e.target.value.trim() && e.target.value.length < 20) {
                      setFormErrors(prev => ({ ...prev, webhookSecretToken: 'Secret Token seems too short. Minimum 20 characters recommended.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, webhookSecretToken: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.webhookSecretToken ? 'border-danger' : 'border-border-base'}`}
                  placeholder="e.g., whsec_xxxxxxxxxxxxxxxxxxxxxx"
                />
                <p className="text-xs text-text-light mt-1">Token to validate incoming webhook requests.</p>
                {formErrors.webhookSecretToken && <p className="text-danger text-xs mt-1">{formErrors.webhookSecretToken}</p>}
              </div>
            </div>
          </div>
        )}

        {/* --- System Performance Settings --- */}
        {activeSection === 'performance' && (
          <div ref={systemPerformanceRef} className="kpi-card-custom p-6">
            <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
              <Cpu className="w-6 h-6 text-accent" /> System Performance
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ToggleSwitch
                id="enableCache"
                label="Enable Caching"
                checked={enableCache}
                onChange={(e) => {
                  setEnableCache(e.target.checked);
                  if (!e.target.checked) {
                    setFormErrors(prev => ({ ...prev, cacheExpiryMinutes: '' }));
                  }
                }}
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
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setCacheExpiryMinutes(isNaN(value) ? 0 : value);
                    if (enableCache && (isNaN(value) || value < 0)) {
                      setFormErrors(prev => ({ ...prev, cacheExpiryMinutes: 'Cache expiry minutes cannot be negative when caching is enabled.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, cacheExpiryMinutes: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.cacheExpiryMinutes ? 'border-danger' : 'border-border-base'}`}
                  min="0"
                  disabled={!enableCache}
                />
                {formErrors.cacheExpiryMinutes && <p className="text-danger text-xs mt-1">{formErrors.cacheExpiryMinutes}</p>}
              </div>
              <ToggleSwitch
                id="enableCdn"
                label="Enable CDN"
                checked={enableCdn}
                onChange={(e) => setEnableCdn(e.target.checked)}
                helpText="Serve static assets through a Content Delivery Network for faster loading."
              />
              <div>
                <label htmlFor="apiRateLimitRequests" className="block text-sm font-medium text-text-base mb-1">
                  API Rate Limit (Requests/Min/User)
                </label>
                <input
                  type="number"
                  id="apiRateLimitRequests"
                  value={apiRateLimitRequests}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    setApiRateLimitRequests(isNaN(value) ? 0 : value);
                    if (isNaN(value) || value < 0) {
                      setFormErrors(prev => ({ ...prev, apiRateLimitRequests: 'API Rate Limit must be non-negative.' }));
                    } else {
                      setFormErrors(prev => ({ ...prev, apiRateLimitRequests: '' }));
                    }
                  }}
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.apiRateLimitRequests ? 'border-danger' : 'border-border-base'}`}
                  min="0"
                />
                <p className="text-xs text-text-light mt-1">Maximum API requests allowed per user per minute.</p>
                {formErrors.apiRateLimitRequests && <p className="text-danger text-xs mt-1">{formErrors.apiRateLimitRequests}</p>}
              </div>
              <ToggleSwitch
                id="maintenanceMode"
                label="Maintenance Mode"
                checked={maintenanceMode}
                onChange={(e) => setMaintenanceMode(e.target.checked)}
                helpText="Take the application offline for maintenance. Users will see a maintenance page."
              />
              <div>
                <label htmlFor="backupFrequency" className="block text-sm font-medium text-text-base mb-1">
                  Backup Frequency
                </label>
                <select
                  id="backupFrequency"
                  value={backupFrequency}
                  onChange={(e) => setBackupFrequency(e.target.value)}
                  className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
                >
                  <option value="Daily">Daily</option>
                  <option value="Weekly">Weekly</option>
                  <option value="Monthly">Monthly</option>
                </select>
                <p className="text-xs text-text-light mt-1">How often database snapshots are taken.</p>
              </div>
              <div>
                <label htmlFor="rollbackPoint" className="block text-sm font-medium text-text-base mb-1">
                  Rollback Point
                </label>
                <input
                  type="text"
                  id="rollbackPoint"
                  value={rollbackPoint}
                  onChange={(e) => setRollbackPoint(e.target.value)}
                  className="w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none border-border-base"
                  placeholder="e.g., Latest, 2023-01-01"
                />
                <p className="text-xs text-text-light mt-1">Specific date or version for potential system rollback.</p>
              </div>
              <ToggleSwitch
                id="enableErrorTracking"
                label="Enable Error Tracking"
                checked={enableErrorTracking}
                onChange={(e) => {
                  setEnableErrorTracking(e.target.checked);
                  if (!e.target.checked) {
                    setFormErrors(prev => ({ ...prev, systemHealthEmailRecipients: '' }));
                  }
                }}
                helpText="Integrate with error tracking services (e.g., Sentry) for real-time error monitoring."
              />
              <div>
                <label htmlFor="systemHealthEmailRecipients" className="block text-sm font-medium text-text-base mb-1">
                  System Health Email Recipients
                </label>
                <textarea
                  id="systemHealthEmailRecipients"
                  value={systemHealthEmailRecipients}
                  onChange={(e) => {
                    setSystemHealthEmailRecipients(e.target.value);
                    if (enableErrorTracking) {
                      const invalidEmails = validateEmails(e.target.value);
                      if (!e.target.value.trim()) {
                        setFormErrors(prev => ({ ...prev, systemHealthEmailRecipients: 'Email recipients are required if error tracking is enabled.' }));
                      } else if (invalidEmails.length > 0) {
                        setFormErrors(prev => ({ ...prev, systemHealthEmailRecipients: `Invalid email format(s): ${invalidEmails.join(', ')}` }));
                      } else {
                        setFormErrors(prev => ({ ...prev, systemHealthEmailRecipients: '' }));
                      }
                    } else {
                      setFormErrors(prev => ({ ...prev, systemHealthEmailRecipients: '' }));
                    }
                  }}
                  rows="2"
                  placeholder="dev1@example.com, dev2@example.com"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.systemHealthEmailRecipients ? 'border-danger' : 'border-border-base'}`}
                  disabled={!enableErrorTracking}
                ></textarea>
                <p className="text-xs text-text-light mt-1">Comma-separated email addresses for system health alerts.</p>
                {formErrors.systemHealthEmailRecipients && <p className="text-danger text-xs mt-1">{formErrors.systemHealthEmailRecipients}</p>}
              </div>
            </div>
          </div>
        )}

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
  );
}

export default Settings;
