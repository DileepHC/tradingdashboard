import React, { useState, useEffect } from 'react';
import { Shield, Save, X, Lock, Info, CheckCircle } from 'lucide-react';

/**
 * AuthControl component for managing authentication-related settings (Admin Only).
 * This component provides real-time updates to its internal state based on user interactions
 * and includes advanced authentication features like Multi-Factor Authentication (MFA)
 * and One-Time Passwords (OTP) via Email/Phone.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Initial authentication control data, typically fetched from a backend.
 */
function AuthControl({ data = {} }) {
  // --- Core Controls States ---
  const [enableSignUp, setEnableSignUp] = useState(data.enableSignUp ?? true);
  const [requireEmailVerification, setRequireEmailVerification] = useState(data.requireEmailVerification ?? false);
  const [requirePhoneVerification, setRequirePhoneVerification] = useState(data.requirePhoneVerification ?? false);
  const [enableSocialSignIn, setEnableSocialSignIn] = useState(data.enableSocialSignIn ?? false);
  const [maxLoginSessions, setMaxLoginSessions] = useState(data.maxLoginSessions || 3);
  const [sessionTimeoutMinutes, setSessionTimeoutMinutes] = useState(data.sessionTimeoutMinutes || 30);
  const [passwordMinLength, setPasswordMinLength] = useState(data.passwordComplexity?.minLength || 8);
  const [passwordRequireUppercase, setPasswordRequireUppercase] = useState(data.passwordComplexity?.requireUppercase ?? true);
  const [passwordRequireLowercase, setPasswordRequireLowercase] = useState(data.passwordComplexity?.requireLowercase ?? true);
  const [passwordRequireNumber, setPasswordRequireNumber] = useState(data.passwordComplexity?.requireNumber ?? true);
  const [passwordRequireSpecialChar, setPasswordRequireSpecialChar] = useState(data.passwordComplexity?.requireSpecialChar ?? true);
  const [forgotPasswordFlowEnabled, setForgotPasswordFlowEnabled] = useState(data.forgotPasswordFlowEnabled ?? true);
  const [twoFactorAuthEnabled, setTwoFactorAuthEnabled] = useState(data.twoFactorAuthEnabled ?? false);
  const [captchaOnSignUp, setCaptchaOnSignUp] = useState(data.captchaOnSignUp ?? true);
  const [authPageVisible, setAuthPageVisible] = useState(data.authPageVisible ?? true);
  const [maintenanceNoticeMessage, setMaintenanceNoticeMessage] = useState(data.maintenanceNoticeMessage || '');
  const [accountLockAttempts, setAccountLockAttempts] = useState(data.accountLockAttempts || 5);
  const [customRedirectAfterLogin, setCustomRedirectAfterLogin] = useState(data.customRedirectAfterLogin || '');
  const [allowAccountDeletion, setAllowAccountDeletion] = useState(data.allowAccountDeletion ?? true);

  // State for form validation errors, mapping field names to error messages.
  const [formErrors, setFormErrors] = useState({});
  // State to control the visibility of the "Settings saved successfully!" message.
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

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
   * Validates all form fields. This function is called on form submission
   * and can also be used for real-time validation as needed.
   * Updates the `formErrors` state with any validation messages.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateForm = () => {
    const errors = {};

    if (maxLoginSessions < 1) errors.maxLoginSessions = 'Must be at least 1 session.';
    if (sessionTimeoutMinutes < 1) errors.sessionTimeoutMinutes = 'Must be at least 1 minute.';
    if (passwordMinLength < 6) errors.passwordMinLength = 'Minimum length must be at least 6.';
    if (accountLockAttempts < 1) errors.accountLockAttempts = 'Must be at least 1 attempt.';
    if (customRedirectAfterLogin.trim() && !isValidUrl(customRedirectAfterLogin)) errors.customRedirectAfterLogin = 'Invalid URL format.';
    if (maintenanceNoticeMessage.length > 200) errors.maintenanceNoticeMessage = 'Message cannot exceed 200 characters.';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * useEffect hook to re-initialize form states when the `data` prop changes.
   * This ensures that if the initial data is loaded asynchronously or updated externally,
   * the form fields correctly reflect the latest values.
   */
  useEffect(() => {
    setEnableSignUp(data.enableSignUp ?? true);
    setRequireEmailVerification(data.requireEmailVerification ?? false);
    setRequirePhoneVerification(data.requirePhoneVerification ?? false);
    setEnableSocialSignIn(data.enableSocialSignIn ?? false);
    setMaxLoginSessions(data.maxLoginSessions || 3);
    setSessionTimeoutMinutes(data.sessionTimeoutMinutes || 30);
    setPasswordMinLength(data.passwordComplexity?.minLength || 8);
    setPasswordRequireUppercase(data.passwordComplexity?.requireUppercase ?? true);
    setPasswordRequireLowercase(data.passwordComplexity?.requireLowercase ?? true);
    setPasswordRequireNumber(data.passwordComplexity?.requireNumber ?? true);
    setPasswordRequireSpecialChar(data.passwordComplexity?.requireSpecialChar ?? true);
    setForgotPasswordFlowEnabled(data.forgotPasswordFlowEnabled ?? true);
    setTwoFactorAuthEnabled(data.twoFactorAuthEnabled ?? false);
    setCaptchaOnSignUp(data.captchaOnSignUp ?? true);
    setAuthPageVisible(data.authPageVisible ?? true);
    setMaintenanceNoticeMessage(data.maintenanceNoticeMessage || '');
    setAccountLockAttempts(data.accountLockAttempts || 5);
    setCustomRedirectAfterLogin(data.customRedirectAfterLogin || '');
    setAllowAccountDeletion(data.allowAccountDeletion ?? true);
    setFormErrors({});
    setShowSaveSuccess(false);
  }, [data]);

  /**
   * Handles saving the changes made in the authentication settings form.
   * This function simulates an API call to persist the updated settings.
   * In a real application, you would replace the console.log with a fetch or axios call.
   * @param {Event} e - The form submission event.
   */
  const handleSaveChanges = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior

    if (!validateForm()) {
      console.error('Form validation failed. Please correct the errors.');
      return;
    }

    // Construct an object with all the current authentication settings.
    const updatedAuthSettings = {
      enableSignUp,
      requireEmailVerification,
      requirePhoneVerification,
      enableSocialSignIn,
      maxLoginSessions,
      sessionTimeoutMinutes,
      passwordComplexity: {
        minLength: passwordMinLength,
        requireUppercase: passwordRequireUppercase,
        requireLowercase: passwordRequireLowercase,
        requireNumber: passwordRequireNumber,
        requireSpecialChar: passwordRequireSpecialChar,
      },
      forgotPasswordFlowEnabled,
      twoFactorAuthEnabled,
      captchaOnSignUp,
      authPageVisible,
      maintenanceNoticeMessage,
      accountLockAttempts,
      customRedirectAfterLogin,
      allowAccountDeletion,
    };

    console.log('Saving Auth Control Settings:', updatedAuthSettings); // Log the settings to be saved
    // Simulate API call success:
    setShowSaveSuccess(true); // Show the success message
    // Hide the success message after 3 seconds for user feedback.
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  /**
   * Handles canceling the changes made in the form.
   * This function resets all form fields to their initial values, effectively discarding
   * any unsaved modifications. It pulls the initial values directly from the `data` prop.
   */
  const handleCancelChanges = () => {
    // Reset all states to their initial values from the data prop
    setEnableSignUp(data.enableSignUp ?? true);
    setRequireEmailVerification(data.requireEmailVerification ?? false);
    setRequirePhoneVerification(data.requirePhoneVerification ?? false);
    setEnableSocialSignIn(data.enableSocialSignIn ?? false);
    setMaxLoginSessions(data.maxLoginSessions || 3);
    setSessionTimeoutMinutes(data.sessionTimeoutMinutes || 30);
    setPasswordMinLength(data.passwordComplexity?.minLength || 8);
    setPasswordRequireUppercase(data.passwordComplexity?.requireUppercase ?? true);
    setPasswordRequireLowercase(data.passwordComplexity?.requireLowercase ?? true);
    setPasswordRequireNumber(data.passwordComplexity?.requireNumber ?? true);
    setPasswordRequireSpecialChar(data.passwordComplexity?.requireSpecialChar ?? true);
    setForgotPasswordFlowEnabled(data.forgotPasswordFlowEnabled ?? true);
    setTwoFactorAuthEnabled(data.twoFactorAuthEnabled ?? false);
    setCaptchaOnSignUp(data.captchaOnSignUp ?? true);
    setAuthPageVisible(data.authPageVisible ?? true);
    setMaintenanceNoticeMessage(data.maintenanceNoticeMessage || '');
    setAccountLockAttempts(data.accountLockAttempts || 5);
    setCustomRedirectAfterLogin(data.customRedirectAfterLogin || '');
    setAllowAccountDeletion(data.allowAccountDeletion ?? true);
    setFormErrors({});
    setShowSaveSuccess(false); // Hide any success message that might be visible
    console.log('Changes cancelled. Form reset to original data.');
  };

  /**
   * A reusable ToggleSwitch component for boolean settings.
   * This component provides a visually appealing toggle switch with a label,
   * current status (Enabled/Disabled), help text, and optional error display.
   * It's defined locally here to be self-contained within AuthControl.
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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      {/* Page Title */}
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" /> Auth Control (Admin Only)
      </h2>

      {/* Authentication Settings Section Card */}
      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6">Authentication Settings</h3>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Core Controls */}
          <ToggleSwitch
            id="enableSignUp"
            label="Enable New User Sign-Up"
            checked={enableSignUp}
            onChange={(e) => setEnableSignUp(e.target.checked)}
            helpText="Control if new users can register for accounts."
          />
          <ToggleSwitch
            id="requireEmailVerification"
            label="Require Email Verification"
            checked={requireEmailVerification}
            onChange={(e) => setRequireEmailVerification(e.target.checked)}
            helpText="Users must confirm their email address via a link before logging in."
          />
          <ToggleSwitch
            id="requirePhoneVerification"
            label="Require Phone OTP Verification"
            checked={requirePhoneVerification}
            onChange={(e) => setRequirePhoneVerification(e.target.checked)}
            helpText="Require SMS-based One-Time Password (OTP) for phone number confirmation."
          />
          <ToggleSwitch
            id="enableSocialSignIn"
            label="Enable Social Sign-In (OAuth)"
            checked={enableSocialSignIn}
            onChange={(e) => setEnableSocialSignIn(e.target.checked)}
            helpText="Allow users to sign in using third-party services like Google, Facebook, or GitHub."
          />
          <div>
            <label htmlFor="maxLoginSessions" className="block text-sm font-medium text-text-base mb-1">
              Max Simultaneous Logins
            </label>
            <input
              type="number"
              id="maxLoginSessions"
              value={maxLoginSessions}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setMaxLoginSessions(isNaN(value) ? 1 : value);
                if (isNaN(value) || value < 1) {
                  setFormErrors(prev => ({ ...prev, maxLoginSessions: 'Must be at least 1 session.' }));
                } else {
                  setFormErrors(prev => ({ ...prev, maxLoginSessions: '' }));
                }
              }}
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.maxLoginSessions ? 'border-danger' : 'border-border-base'}`}
              min="1"
            />
            <p className="text-xs text-text-light mt-1">Limit the number of devices a user can be logged into simultaneously.</p>
            {formErrors.maxLoginSessions && <p className="text-danger text-xs mt-1">{formErrors.maxLoginSessions}</p>}
          </div>
          <div>
            <label htmlFor="sessionTimeoutMinutes" className="block text-sm font-medium text-text-base mb-1">
              Idle Session Timeout (Minutes)
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
            <p className="text-xs text-text-light mt-1">Automatically log out users after a period of inactivity.</p>
            {formErrors.sessionTimeoutMinutes && <p className="text-danger text-xs mt-1">{formErrors.sessionTimeoutMinutes}</p>}
          </div>

          {/* Password Complexity Rules */}
          <h4 className="text-lg font-semibold text-secondary pt-4 border-t border-border-base flex items-center gap-2">
            <Lock className="w-4 h-4" /> Password Complexity Rules
          </h4>
          <div>
            <label htmlFor="passwordMinLength" className="block text-sm font-medium text-text-base mb-1">
              Minimum Password Length
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
            id="passwordRequireUppercase"
            label="Require Uppercase Letter"
            checked={passwordRequireUppercase}
            onChange={(e) => setPasswordRequireUppercase(e.target.checked)}
            helpText="Enforce at least one uppercase letter in passwords."
          />
          <ToggleSwitch
            id="passwordRequireLowercase"
            label="Require Lowercase Letter"
            checked={passwordRequireLowercase}
            onChange={(e) => setPasswordRequireLowercase(e.target.checked)}
            helpText="Enforce at least one lowercase letter in passwords."
          />
          <ToggleSwitch
            id="passwordRequireNumber"
            label="Require Number"
            checked={passwordRequireNumber}
            onChange={(e) => setPasswordRequireNumber(e.target.checked)}
            helpText="Enforce at least one number in passwords."
          />
          <ToggleSwitch
            id="passwordRequireSpecialChar"
            label="Require Special Character"
            checked={passwordRequireSpecialChar}
            onChange={(e) => setPasswordRequireSpecialChar(e.target.checked)}
            helpText="Enforce at least one special character (@$!%*?&) in passwords."
          />

          <ToggleSwitch
            id="forgotPasswordFlowEnabled"
            label="Enable Forgot Password Flow"
            checked={forgotPasswordFlowEnabled}
            onChange={(e) => setForgotPasswordFlowEnabled(e.target.checked)}
            helpText="Allow users to reset their forgotten passwords via email or security questions."
          />
          <ToggleSwitch
            id="twoFactorAuthEnabled"
            label="Enable Two-Factor Authentication (2FA)"
            checked={twoFactorAuthEnabled}
            onChange={(e) => setTwoFactorAuthEnabled(e.target.checked)}
            helpText="Enhance security by requiring a second verification step (e.g., OTP, Authenticator App)."
          />
          <ToggleSwitch
            id="captchaOnSignUp"
            label="Enable CAPTCHA on Sign-Up"
            checked={captchaOnSignUp}
            onChange={(e) => setCaptchaOnSignUp(e.target.checked)}
            helpText="Protect against bot registrations by requiring CAPTCHA verification."
          />
          <ToggleSwitch
            id="authPageVisible"
            label="Auth Page Visibility"
            checked={authPageVisible}
            onChange={(e) => setAuthPageVisible(e.target.checked)}
            helpText="Control if the authentication (login/signup) page is publicly accessible."
          />
          <div>
            <label htmlFor="maintenanceNoticeMessage" className="block text-sm font-medium text-text-base mb-1">
              Maintenance Notice Message
            </label>
            <textarea
              id="maintenanceNoticeMessage"
              value={maintenanceNoticeMessage}
              onChange={(e) => {
                setMaintenanceNoticeMessage(e.target.value);
                if (e.target.value.length > 200) {
                  setFormErrors(prev => ({ ...prev, maintenanceNoticeMessage: 'Message cannot exceed 200 characters.' }));
                } else {
                  setFormErrors(prev => ({ ...prev, maintenanceNoticeMessage: '' }));
                }
              }}
              rows="2"
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.maintenanceNoticeMessage ? 'border-danger' : 'border-border-base'}`}
              maxLength="200"
              placeholder="e.g., Authentication services are temporarily down for maintenance. Please try again later."
            ></textarea>
            <p className="text-xs text-text-light mt-1">{maintenanceNoticeMessage.length}/200 characters. Message shown if authentication is unavailable.</p>
            {formErrors.maintenanceNoticeMessage && <p className="text-danger text-xs mt-1">{formErrors.maintenanceNoticeMessage}</p>}
          </div>
          <div>
            <label htmlFor="accountLockAttempts" className="block text-sm font-medium text-text-base mb-1">
              Account Lock After Failed Attempts
            </label>
            <input
              type="number"
              id="accountLockAttempts"
              value={accountLockAttempts}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                setAccountLockAttempts(isNaN(value) ? 1 : value);
                if (isNaN(value) || value < 1) {
                  setFormErrors(prev => ({ ...prev, accountLockAttempts: 'Must be at least 1 attempt.' }));
                } else {
                  setFormErrors(prev => ({ ...prev, accountLockAttempts: '' }));
                }
              }}
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.accountLockAttempts ? 'border-danger' : 'border-border-base'}`}
              min="1"
            />
            <p className="text-xs text-text-light mt-1">Number of failed login attempts before an account is temporarily locked.</p>
            {formErrors.accountLockAttempts && <p className="text-danger text-xs mt-1">{formErrors.accountLockAttempts}</p>}
          </div>
          <div>
            <label htmlFor="customRedirectAfterLogin" className="block text-sm font-medium text-text-base mb-1">
              Custom Redirect After Login URL
            </label>
            <input
              type="url"
              id="customRedirectAfterLogin"
              value={customRedirectAfterLogin}
              onChange={(e) => {
                setCustomRedirectAfterLogin(e.target.value);
                if (e.target.value.trim() && !isValidUrl(e.target.value)) {
                  setFormErrors(prev => ({ ...prev, customRedirectAfterLogin: 'Invalid URL format.' }));
                } else {
                  setFormErrors(prev => ({ ...prev, customRedirectAfterLogin: '' }));
                }
              }}
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${formErrors.customRedirectAfterLogin ? 'border-danger' : 'border-border-base'}`}
              placeholder="https://your-app.com/dashboard"
            />
            <p className="text-xs text-text-light mt-1">URL where users are redirected after successful login (e.g., Premium Dashboard).</p>
            {formErrors.customRedirectAfterLogin && <p className="text-danger text-xs mt-1">{formErrors.customRedirectAfterLogin}</p>}
          </div>
          <ToggleSwitch
            id="allowAccountDeletion"
            label="Allow User Account Deletion"
            checked={allowAccountDeletion}
            onChange={(e) => setAllowAccountDeletion(e.target.checked)}
            helpText="Enable or disable the option for users to delete their own accounts (GDPR compliance)."
          />

          {/* Form Action Buttons (Save and Cancel) */}
          <div className="form-actions-custom flex justify-end mt-8 pt-4 border-t border-border-base">
            {/* Success message display */}
            {showSaveSuccess && (
              <span className="text-accent text-sm mr-4 flex items-center gap-1">
                <CheckCircle className="w-4 h-4" /> Settings saved successfully!
              </span>
            )}
            {/* Save Changes button */}
            <button type="submit" className="action-button-custom">
              <Save className="w-5 h-5 mr-2" /> Save Changes
            </button>
            {/* Cancel Changes button */}
            <button type="button" onClick={handleCancelChanges} className="action-button-custom cancel-button-custom">
              <X className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthControl;
