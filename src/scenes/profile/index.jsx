import React, { useState, useEffect } from 'react';
import { User, Camera, Lock, Save, X, KeyRound, Info } from 'lucide-react'; // Removed Mail, Phone, NotebookPen

/**
 * Profile component for users to view and manage their profile information.
 * Includes sections for personal details and password updates.
 *
 * @param {object} props - Component props.
 * @param {object} props.data - Initial profile data (e.g., from a user API).
 */
function Profile({ data = {} }) {
  // --- Profile Details States ---
  const [username, setUsername] = useState(data.username || '');
  const [fullName, setFullName] = useState(data.fullName || '');
  const [email, setEmail] = useState(data.email || '');
  const [phoneNumber, setPhoneNumber] = useState(data.phoneNumber || '');
  const [profilePicture, setProfilePicture] = useState(data.profilePicture || '/assets/John.jpg'); // For display
  const [profilePictureFile, setProfilePictureFile] = useState(null); // For actual file upload
  const [area, setArea] = useState(data.area || '');
  const [notes, setNotes] = useState(data.notes || '');

  // --- Password Update States ---
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // --- Form Control States ---
  const [profileFormErrors, setProfileFormErrors] = useState({});
  const [passwordFormErrors, setPasswordFormErrors] = useState({});
  const [showProfileSaveSuccess, setShowProfileSaveSuccess] = useState(false);
  const [showPasswordSaveSuccess, setShowPasswordSaveSuccess] = useState(false);

  // Effect to re-initialize profile details if the `data` prop changes
  useEffect(() => {
    setUsername(data.username ?? '');
    setFullName(data.fullName ?? '');
    setEmail(data.email ?? '');
    setPhoneNumber(data.phoneNumber ?? '');
    setProfilePicture(data.profilePicture ?? '/assets/John.jpg');
    setProfilePictureFile(null); // Clear file input on data change
    setArea(data.area ?? '');
    setNotes(data.notes ?? '');
    setProfileFormErrors({});
    setShowProfileSaveSuccess(false);
  }, [data]);

  // Effect to clear password fields when component mounts or data changes
  useEffect(() => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFormErrors({});
    setShowPasswordSaveSuccess(false);
  }, [data]); // Depend on data to reset when the profile data itself changes

  /**
   * Real-time validation for Username field.
   * @param {string} value - The current value of the username input.
   */
  const validateUsernameField = (value) => {
    setProfileFormErrors(prevErrors => ({
      ...prevErrors,
      username: value.trim() ? '' : 'Username is required.',
    }));
  };

  /**
   * Real-time validation for Full Name field.
   * @param {string} value - The current value of the full name input.
   */
  const validateFullNameField = (value) => {
    setProfileFormErrors(prevErrors => ({
      ...prevErrors,
      fullName: value.trim() ? '' : 'Full Name is required.',
    }));
  };

  /**
   * Real-time validation for Email field.
   * @param {string} value - The current value of the email input.
   */
  const validateEmailField = (value) => {
    let error = '';
    if (!value.trim()) {
      error = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(value)) {
      error = 'Invalid email format.';
    }
    setProfileFormErrors(prevErrors => ({ ...prevErrors, email: error }));
  };

  /**
   * Real-time validation for Phone Number field.
   * @param {string} value - The current value of the phone number input.
   */
  const validatePhoneNumberField = (value) => {
    let error = '';
    // Only validate if a value is entered. If optional and empty, no error.
    if (value.trim() && !/^\+?[0-9]{10,15}$/.test(value)) {
      error = 'Invalid phone number format (10-15 digits, optional +).';
    }
    setProfileFormErrors(prevErrors => ({ ...prevErrors, phoneNumber: error }));
  };

  /**
   * Handles the profile picture file selection and performs real-time validation.
   * @param {Event} e - The change event from the file input.
   */
  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    setProfilePictureFile(file); // Set the file object regardless for display

    let error = '';
    if (file) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (!allowedTypes.includes(file.type)) {
        error = 'Only PNG/JPG images are allowed.';
      } else if (file.size > maxSize) {
        error = 'Image size cannot exceed 2MB.';
      }
    }
    setProfileFormErrors(prevErrors => ({ ...prevErrors, profilePictureFile: error }));
  };

  /**
   * Performs comprehensive validation for profile details form submission.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validateProfileFormOnSubmit = () => {
    const errors = {};
    if (!username.trim()) errors.username = 'Username is required.';
    if (!fullName.trim()) errors.fullName = 'Full Name is required.';

    if (!email.trim()) {
      errors.email = 'Email is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format.';
    }

    if (phoneNumber.trim() && !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number format.';
    }

    if (profilePictureFile) {
      const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      const maxSize = 2 * 1024 * 1024; // 2 MB
      if (!allowedTypes.includes(profilePictureFile.type)) {
        errors.profilePictureFile = 'Only PNG/JPG images are allowed.';
      }
      if (profilePictureFile.size > maxSize) {
        errors.profilePictureFile = 'Image size cannot exceed 2MB.';
      }
    }

    setProfileFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles saving the profile details.
   * @param {Event} e - The form submission event.
   */
  const handleProfileSaveChanges = (e) => {
    e.preventDefault();
    if (!validateProfileFormOnSubmit()) {
      console.log('Profile form validation failed.');
      return;
    }

    // Simulate API call to save profile
    const updatedProfile = {
      username,
      fullName,
      email,
      phoneNumber,
      area,
      notes,
      // In a real app, you'd upload profilePictureFile and get a new URL
      profilePicture: profilePictureFile ? URL.createObjectURL(profilePictureFile) : profilePicture,
    };
    console.log('Saving Profile Changes:', updatedProfile);

    // Update the displayed profile picture immediately if a new file was selected
    if (profilePictureFile) {
      setProfilePicture(URL.createObjectURL(profilePictureFile));
    }

    setShowProfileSaveSuccess(true);
    setTimeout(() => setShowProfileSaveSuccess(false), 3000);
  };

  /**
   * Handles canceling changes in the profile details form.
   */
  const handleCancelProfileChanges = () => {
    setUsername(data.username || '');
    setFullName(data.fullName || '');
    setEmail(data.email || '');
    setPhoneNumber(data.phoneNumber || '');
    setProfilePicture(data.profilePicture || '/assets/John.jpg'); // Revert to initial or default
    setProfilePictureFile(null);
    setArea(data.area || '');
    setNotes(data.notes || '');
    setProfileFormErrors({});
    setShowProfileSaveSuccess(false);
    console.log('Profile changes cancelled.');
  };

  /**
   * Real-time validation for Current Password field.
   * @param {string} value - The current value of the current password input.
   */
  const validateCurrentPasswordField = (value) => {
    setPasswordFormErrors(prevErrors => ({
      ...prevErrors,
      currentPassword: value.trim() ? '' : 'Current password is required.',
    }));
  };

  /**
   * Real-time validation for New Password field.
   * @param {string} value - The current value of the new password input.
   */
  const validateNewPasswordField = (value) => {
    let error = '';
    if (!value.trim()) {
      error = 'New password is required.';
    } else if (value.length < 8) {
      error = 'New password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(value) || !/[a-z]/.test(value) || !/[0-9]/.test(value) || !/[!@#$%^&*]/.test(value)) {
      error = 'Password must include uppercase, lowercase, number, and special character.';
    }
    setPasswordFormErrors(prevErrors => ({ ...prevErrors, newPassword: error }));
    // Also re-validate confirm password if new password changes
    if (confirmPassword.trim() && value !== confirmPassword) {
      setPasswordFormErrors(prevErrors => ({ ...prevErrors, confirmPassword: 'Passwords do not match.' }));
    } else if (confirmPassword.trim() && value === confirmPassword) {
      setPasswordFormErrors(prevErrors => ({ ...prevErrors, confirmPassword: '' }));
    }
  };

  /**
   * Real-time validation for Confirm New Password field.
   * @param {string} value - The current value of the confirm password input.
   * @param {string} newPassValue - The current value of the new password input.
   */
  const validateConfirmPasswordField = (value, newPassValue) => {
    setPasswordFormErrors(prevErrors => ({
      ...prevErrors,
      confirmPassword: value === newPassValue ? '' : 'Passwords do not match.',
    }));
  };

  /**
   * Performs comprehensive validation for password update form submission.
   * @returns {boolean} True if the form is valid, false otherwise.
   */
  const validatePasswordFormOnSubmit = () => {
    const errors = {};
    if (!currentPassword.trim()) errors.currentPassword = 'Current password is required.';
    if (!newPassword.trim()) {
      errors.newPassword = 'New password is required.';
    } else if (newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters long.';
    } else if (!/[A-Z]/.test(newPassword) || !/[a-z]/.test(newPassword) || !/[0-9]/.test(newPassword) || !/[!@#$%^&*]/.test(newPassword)) {
      errors.newPassword = 'Password must include uppercase, lowercase, number, and special character.';
    }
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match.';
    }
    setPasswordFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  /**
   * Handles updating the password.
   * @param {Event} e - The form submission event.
   */
  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!validatePasswordFormOnSubmit()) {
      console.log('Password form validation failed.');
      return;
    }

    // Simulate API call to change password
    console.log('Changing Password:', { currentPassword, newPassword });
    setShowPasswordSaveSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setShowPasswordSaveSuccess(false), 3000);
  };

  /**
   * Handles canceling changes in the password update form.
   */
  const handleCancelPasswordChange = () => {
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordFormErrors({});
    setShowPasswordSaveSuccess(false);
    console.log('Password change cancelled.');
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <User className="w-8 h-8 text-primary" /> My Profile
      </h2>

      {/* Profile Details Section */}
      <div className="kpi-card-custom p-6">
        <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
          <Info className="w-5 h-5" /> Personal Information
        </h3>
        <form onSubmit={handleProfileSaveChanges} className="space-y-6">
          <div className="flex flex-col items-center mb-6">
            <img
              src={profilePictureFile ? URL.createObjectURL(profilePictureFile) : profilePicture}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-md mb-4"
              onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/100x100/gray/white?text=User'; }}
            />
            <label htmlFor="profilePictureUpload" className="action-button-custom cursor-pointer flex items-center gap-2">
              <Camera className="w-5 h-5" /> Change Picture
            </label>
            <input
              type="file"
              id="profilePictureUpload"
              accept=".png, .jpg, .jpeg"
              onChange={handleProfilePictureChange}
              className="hidden"
            />
            {profilePictureFile && <p className="text-xs text-text-light mt-2">Selected: {profilePictureFile.name}</p>}
            {profileFormErrors.profilePictureFile && <p className="text-danger text-xs mt-1">{profileFormErrors.profilePictureFile}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-text-base mb-1">
                Username <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  validateUsernameField(e.target.value);
                }}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${profileFormErrors.username ? 'border-danger' : 'border-border-base'}`}
                required
              />
              {profileFormErrors.username && <p className="text-danger text-xs mt-1">{profileFormErrors.username}</p>}
            </div>
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-text-base mb-1">
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  validateFullNameField(e.target.value);
                }}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${profileFormErrors.fullName ? 'border-danger' : 'border-border-base'}`}
                required
              />
              {profileFormErrors.fullName && <p className="text-danger text-xs mt-1">{profileFormErrors.fullName}</p>}
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-base mb-1">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  validateEmailField(e.target.value);
                }}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${profileFormErrors.email ? 'border-danger' : 'border-border-base'}`}
                required
              />
              {profileFormErrors.email && <p className="text-danger text-xs mt-1">{profileFormErrors.email}</p>}
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-text-base mb-1">
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => {
                  setPhoneNumber(e.target.value);
                  validatePhoneNumberField(e.target.value);
                }}
                className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${profileFormErrors.phoneNumber ? 'border-danger' : 'border-border-base'}`}
              />
              {profileFormErrors.phoneNumber && <p className="text-danger text-xs mt-1">{profileFormErrors.phoneNumber}</p>}
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-text-base mb-1">
                Area (Optional)
              </label>
              <input
                type="text"
                id="area"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
              />
            </div>
            <div>
              <label htmlFor="notes" className="block text-sm font-medium text-text-base mb-1">
                Notes (Optional)
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows="3"
                className="w-full p-3 border border-border-base rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y"
              ></textarea>
            </div>
          </div>

          <div className="form-actions-custom flex justify-end mt-8 pt-4 border-t border-border-base">
            {showProfileSaveSuccess && (
              <span className="text-accent text-sm mr-4 flex items-center gap-1">
                <Save className="w-4 h-4" /> Profile updated successfully!
              </span>
            )}
            <button type="submit" className="action-button-custom">
              <Save className="w-5 h-5 mr-2" /> Save Changes
            </button>
            <button type="button" onClick={handleCancelProfileChanges} className="action-button-custom cancel-button-custom">
              <X className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>

      {/* Password Update Section */}
      <div className="kpi-card-custom p-6 mt-8">
        <h3 className="dashboard-widget-title mb-6 flex items-center gap-2">
          <Lock className="w-5 h-5" /> Change Password
        </h3>
        <form onSubmit={handleChangePassword} className="space-y-6">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-text-base mb-1">
              Current Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="currentPassword"
              value={currentPassword}
              onChange={(e) => {
                setCurrentPassword(e.target.value);
                validateCurrentPasswordField(e.target.value);
              }}
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${passwordFormErrors.currentPassword ? 'border-danger' : 'border-border-base'}`}
              required
            />
            {passwordFormErrors.currentPassword && <p className="text-danger text-xs mt-1">{passwordFormErrors.currentPassword}</p>}
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-text-base mb-1">
              New Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="newPassword"
              value={newPassword}
              onChange={(e) => {
                setNewPassword(e.target.value);
                validateNewPasswordField(e.target.value);
              }}
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${passwordFormErrors.newPassword ? 'border-danger' : 'border-border-base'}`}
              required
            />
            {passwordFormErrors.newPassword && <p className="text-danger text-xs mt-1">{passwordFormErrors.newPassword}</p>}
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-base mb-1">
              Confirm New Password <span className="text-danger">*</span>
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                validateConfirmPasswordField(e.target.value, newPassword);
              }}
              className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none ${passwordFormErrors.confirmPassword ? 'border-danger' : 'border-border-base'}`}
              required
            />
            {passwordFormErrors.confirmPassword && <p className="text-danger text-xs mt-1">{passwordFormErrors.confirmPassword}</p>}
          </div>

          <div className="form-actions-custom flex justify-end mt-8 pt-4 border-t border-border-base">
            {showPasswordSaveSuccess && (
              <span className="text-accent text-sm mr-4 flex items-center gap-1">
                <KeyRound className="w-4 h-4" /> Password updated successfully!
              </span>
            )}
            <button type="submit" className="action-button-custom">
              <Save className="w-5 h-5 mr-2" /> Update Password
            </button>
            <button type="button" onClick={handleCancelPasswordChange} className="action-button-custom cancel-button-custom">
              <X className="w-5 h-5 mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Profile;
