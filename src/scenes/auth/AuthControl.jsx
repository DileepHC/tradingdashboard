import React, { useState, useEffect } from 'react';
import { Shield, Save, X } from 'lucide-react';

/**
 * AuthControl component for managing authentication-related settings (Admin Only).
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Auth control data.
 */
function AuthControl({ data = {} }) {
  // States for authentication settings
  const [showSignInPage, setShowSignInPage] = useState(data.showSignInPage || false);
  const [referralInputEnabled, setReferralInputEnabled] = useState(data.customizeSignUpFields?.referralInputEnabled || false);
  const [passwordResetFlowEnabled, setPasswordResetFlowEnabled] = useState(data.passwordResetFlowEnabled || false);

  // New states for advanced authentication features
  const [multiFactorAuthEnabled, setMultiFactorAuthEnabled] = useState(data.multiFactorAuthEnabled ?? false);
  const [otpViaEmailPhoneEnabled, setOtpViaEmailPhoneEnabled] = useState(data.otpViaEmailPhoneEnabled ?? false);

  // State to control the visibility of the save success message
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Effect to re-initialize form states if the `data` prop changes
  // Updated dependency array to include individual primitive values from data
  useEffect(() => {
    setShowSignInPage(data.showSignInPage ?? false);
    setReferralInputEnabled(data.customizeSignUpFields?.referralInputEnabled ?? false);
    setPasswordResetFlowEnabled(data.passwordResetFlowEnabled ?? false);
    setMultiFactorAuthEnabled(data.multiFactorAuthEnabled ?? false);
    setOtpViaEmailPhoneEnabled(data.otpViaEmailPhoneEnabled ?? false);
    setShowSaveSuccess(false); // Clear success message on data change
  }, [
    data.showSignInPage,
    data.customizeSignUpFields?.referralInputEnabled,
    data.passwordResetFlowEnabled,
    data.multiFactorAuthEnabled,
    data.otpViaEmailPhoneEnabled
  ]);

  /**
   * Handles saving the changes made in the authentication settings form.
   * Prevents default form submission, logs the updated settings, and shows a success message.
   * In a real application, this would send data to an API.
   * @param {Event} e - The form submission event.
   */
  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedAuthSettings = {
      showSignInPage,
      customizeSignUpFields: {
        referralInputEnabled,
      },
      passwordResetFlowEnabled,
      multiFactorAuthEnabled, // Include new MFA setting
      otpViaEmailPhoneEnabled, // Include new OTP setting
    };
    console.log('Saving Auth Control Settings:', updatedAuthSettings);
    // In a real app, send this data to an API
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000); // Hide success message after 3 seconds
  };

  /**
   * Handles canceling the changes made in the form.
   * Resets all form fields to their initial values from the `data` prop.
   */
  const handleCancelChanges = () => {
    setShowSignInPage(data.showSignInPage ?? false);
    setReferralInputEnabled(data.customizeSignUpFields?.referralInputEnabled ?? false);
    setPasswordResetFlowEnabled(data.passwordResetFlowEnabled ?? false);
    setMultiFactorAuthEnabled(data.multiFactorAuthEnabled ?? false);
    setOtpViaEmailPhoneEnabled(data.otpViaEmailPhoneEnabled ?? false);
    setShowSaveSuccess(false); // Hide any success message
    console.log('Changes cancelled. Form reset to original data.');
  };

  // Helper for toggle switches (re-defined locally as it's not globally available in this component's scope)
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
        <Shield className="w-8 h-8 text-primary" /> Auth Control (Admin Only)
      </h2>

      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6">Authentication Settings</h3>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Show/Hide Sign-In Page */}
          <ToggleSwitch
            id="showSignInPageToggle"
            label="Show Sign-In Page"
            checked={showSignInPage}
            onChange={(e) => setShowSignInPage(e.target.checked)}
            helpText="Control if the sign-in page is visible to users."
          />

          {/* Customize Sign-Up Fields */}
          <ToggleSwitch
            id="referralInputEnabledToggle"
            label="Enable Referral ID Input on Sign-Up"
            checked={referralInputEnabled}
            onChange={(e) => setReferralInputEnabled(e.target.checked)}
            helpText="Allow users to enter a referral ID during sign-up."
          />

          {/* Password Reset Flow */}
          <ToggleSwitch
            id="passwordResetFlowToggle"
            label="Enable Password Reset Flow"
            checked={passwordResetFlowEnabled}
            onChange={(e) => setPasswordResetFlowEnabled(e.target.checked)}
            helpText="Allow users to reset their forgotten passwords."
          />

          {/* NEW: Multi-Factor Auth (optional) */}
          <ToggleSwitch
            id="multiFactorAuthToggle"
            label="Enable Multi-Factor Authentication (MFA)"
            checked={multiFactorAuthEnabled}
            onChange={(e) => setMultiFactorAuthEnabled(e.target.checked)}
            helpText="Enhance security by requiring a second verification step during login."
          />

          {/* NEW: OTP via Email/Phone (optional) */}
          <ToggleSwitch
            id="otpViaEmailPhoneToggle"
            label="Enable OTP via Email/Phone"
            checked={otpViaEmailPhoneEnabled}
            onChange={(e) => setOtpViaEmailPhoneEnabled(e.target.checked)}
            helpText="Send One-Time Passwords (OTPs) to users' email or phone for verification."
          />

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

export default AuthControl;
