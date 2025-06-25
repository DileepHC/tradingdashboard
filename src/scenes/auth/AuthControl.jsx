// scenes/auth/AuthControl.jsx
import React, { useState } from 'react';
import { Shield, Save } from 'lucide-react';

/**
 * AuthControl component for managing authentication-related settings (Admin Only).
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Auth control data.
 */
function AuthControl({ data = {} }) {
  const [showSignInPage, setShowSignInPage] = useState(data.showSignInPage || false);
  const [referralInputEnabled, setReferralInputEnabled] = useState(data.customizeSignUpFields?.referralInputEnabled || false);
  const [passwordResetFlowEnabled, setPasswordResetFlowEnabled] = useState(data.passwordResetFlowEnabled || false);

  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  const handleSaveChanges = (e) => {
    e.preventDefault();
    const updatedAuthSettings = {
      showSignInPage,
      customizeSignUpFields: {
        referralInputEnabled,
      },
      passwordResetFlowEnabled,
    };
    console.log('Saving Auth Control Settings:', updatedAuthSettings);
    // In a real app, send this data to an API
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000); // Hide success message after 3 seconds
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <Shield className="w-8 h-8 text-primary" /> Auth Control (Admin Only)
      </h2>

      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6">Authentication Settings</h3>
        <form onSubmit={handleSaveChanges} className="space-y-6">
          {/* Show/Hide Sign-In Page */}
          <div>
            <label htmlFor="showSignInPageToggle" className="block text-sm font-medium text-text-base mb-2">
              Show Sign-In Page
            </label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="showSignInPageToggle"
                  className="sr-only"
                  checked={showSignInPage}
                  onChange={(e) => setShowSignInPage(e.target.checked)}
                />
                <div className="block bg-border-base w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition dot-shadow"></div>
              </div>
              <div className="ml-3 text-text-base font-medium">{showSignInPage ? 'Visible' : 'Hidden'}</div>
            </label>
          </div>

          {/* Customize Sign-Up Fields */}
          <div>
            <label htmlFor="referralInputEnabledToggle" className="block text-sm font-medium text-text-base mb-2">
              Enable Referral ID Input on Sign-Up
            </label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="referralInputEnabledToggle"
                  className="sr-only"
                  checked={referralInputEnabled}
                  onChange={(e) => setReferralInputEnabled(e.target.checked)}
                />
                <div className="block bg-border-base w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition dot-shadow"></div>
              </div>
              <div className="ml-3 text-text-base font-medium">{referralInputEnabled ? 'Enabled' : 'Disabled'}</div>
            </label>
          </div>

          {/* Password Reset Flow */}
          <div>
            <label htmlFor="passwordResetFlowToggle" className="block text-sm font-medium text-text-base mb-2">
              Enable Password Reset Flow
            </label>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  id="passwordResetFlowToggle"
                  className="sr-only"
                  checked={passwordResetFlowEnabled}
                  onChange={(e) => setPasswordResetFlowEnabled(e.target.checked)}
                />
                <div className="block bg-border-base w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition dot-shadow"></div>
              </div>
              <div className="ml-3 text-text-base font-medium">{passwordResetFlowEnabled ? 'Enabled' : 'Disabled'}</div>
            </label>
          </div>

          <style jsx>{`
            .dot {
              box-shadow: 0 0 0 2px rgba(0,0,0,0.1);
            }
            input:checked + .block {
              background-color: var(--primary-color);
            }
            input:checked + .block + .dot {
              transform: translateX(120%);
            }
          `}</style>

          <div className="form-actions-custom">
            {showSaveSuccess && (
              <span className="text-accent text-sm mr-4 flex items-center gap-1">
                <Save className="w-4 h-4" /> Settings saved successfully!
              </span>
            )}
            <button type="submit" className="action-button-custom">
              <Save className="w-5 h-5 mr-2" /> Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthControl;
