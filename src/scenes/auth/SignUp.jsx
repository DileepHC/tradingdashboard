// src/scenes/auth/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { User, Mail, Lock, Eye, EyeOff, UserPlus } from 'lucide-react';
import MessageModal from '../../components/MessageModal.jsx'; // Import the new MessageModal

/**
 * SignUp component for user registration.
 * Handles user sign-up, form validation, and local storage management.
 *
 * @param {object} props - Component props.
 * @param {function} props.setActiveModule - Function to set the active module in App.js for navigation.
 */
function SignUp({ setActiveModule }) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // New states to track if input fields have been "touched" (interacted with)
  const [firstNameTouched, setFirstNameTouched] = useState(false);
  const [lastNameTouched, setLastNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);
  const [confirmPasswordTouched, setConfirmPasswordTouched] = useState(false);

  // State for the custom MessageModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const [modalTitle, setModalTitle] = useState('');

  // Utility to display modal messages
  const showMessage = (message, type = 'info', title = '') => {
    setModalMessage(message);
    setModalType(type);
    setModalTitle(title);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
    setModalType('info');
    setModalTitle('');
  };

  // --- Utility Functions ---
  const loadUsers = () => {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  };

  const saveUsers = (users) => {
    localStorage.setItem('users', JSON.stringify(users));
  };

  // --- Validation Functions for Each Field ---
  const validateName = (value, fieldName, setError) => {
    const namePattern = /^[a-zA-Z]{3,15}$/;
    if (!value.trim()) {
      setError(`${fieldName} cannot be empty.`);
      return false;
    } else if (!namePattern.test(value)) {
      setError(`${fieldName} must be 3-15 alphabetic characters.`);
      return false;
    } else {
      setError('');
      return true;
    }
  };

  const validateEmail = (value) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!value.trim()) {
      setEmailError('Email cannot be empty.');
      return false;
    } else if (!emailPattern.test(value)) {
      setEmailError('Invalid email format (e.g., example@domain.com)');
      return false;
    } else {
      setEmailError('');
      return true;
    }
  };

  const validatePassword = (value) => {
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!value.trim()) {
      setPasswordError('Password cannot be empty.');
      return false;
    } else if (!passwordPattern.test(value)) {
      setPasswordError('Password must be 8-12 chars, incl. uppercase, lowercase, number, and special char (@$!%*?&).');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  };

  const validateConfirmPassword = (passwordValue, confirmPasswordValue) => {
    if (!confirmPasswordValue.trim()) {
      setConfirmPasswordError('Confirm password cannot be empty.');
      return false;
    } else if (passwordValue !== confirmPasswordValue) {
      setConfirmPasswordError('Passwords do not match.');
      return false;
    } else {
      setConfirmPasswordError('');
      return true;
    }
  };

  // Real-time validation on input change, only if the field has been touched
  useEffect(() => {
    if (firstNameTouched) {
      validateName(firstName, 'First Name', setFirstNameError);
    }
  }, [firstName, firstNameTouched]);

  useEffect(() => {
    if (lastNameTouched) {
      validateName(lastName, 'Last Name', setLastNameError);
    }
  }, [lastName, lastNameTouched]);

  useEffect(() => {
    if (emailTouched) {
      validateEmail(email);
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (passwordTouched) {
      validatePassword(password);
    }
    if (confirmPasswordTouched) { // Re-validate confirm password if password changes and confirm is touched
      validateConfirmPassword(password, confirmPassword);
    }
  }, [password, passwordTouched, confirmPassword, confirmPasswordTouched]);

  useEffect(() => {
    if (confirmPasswordTouched) {
      validateConfirmPassword(password, confirmPassword);
    }
  }, [confirmPassword, confirmPasswordTouched, password]);


  // --- Form Submission Handler ---
  const handleSignUp = (e) => {
    e.preventDefault();

    // Mark all fields as touched on submission attempt to show all errors
    setFirstNameTouched(true);
    setLastNameTouched(true);
    setEmailTouched(true);
    setPasswordTouched(true);
    setConfirmPasswordTouched(true);

    const isFirstNameValid = validateName(firstName, 'First Name', setFirstNameError);
    const isLastNameValid = validateName(lastName, 'Last Name', setLastNameError);
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(password, confirmPassword);

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPasswordValid || !isConfirmPasswordValid) {
      showMessage('Please correct the errors in the form.', 'error', 'Validation Error');
      return;
    }

    const users = loadUsers();
    const userExists = users.some(user => user.email === email);
    if (userExists) {
      setEmailError("This email is already registered. Please sign in.");
      showMessage("This email is already registered. Please sign in.", 'error', 'Registration Failed');
      return;
    }

    const newUser = {
      firstName,
      lastName,
      email,
      password // In a real app, hash and store securely
    };
    users.push(newUser);
    saveUsers(users);

    showMessage('Registration successful! You can now sign in.', 'success', 'Success', () => {
      setActiveModule('signin'); // Navigate to sign-in page
      closeModal();
    });
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-f8f8ff bg-cover bg-no-repeat bg-fixed animate-fadeIn"
      style={{ backgroundImage: "url('/assets/4.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} // Set background image to 4.jpg
    >
      {/* Small Company Logo in top-left corner */}
      <div className="fixed top-4 left-4 z-10">
        <img
          src="/assets/Company logo.jpg" // Company logo image
          alt="Company Logo"
          className="w-24 h-auto" // Small size
        />
      </div>

      <div className="container max-w-md w-11/12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white/98 to-blue-50/98 shadow-2xl relative overflow-hidden animate-slideUpScale border border-white/60 backdrop-blur-sm flex flex-col justify-between items-center"> {/* Added items-center to center content */}
        {/* Header */}
        <h1 className="text-center text-3xl sm:text-4xl font-extrabold mt-0 mb-4 text-indigo-700 tracking-wide relative pb-3 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-indigo-700 after:rounded-full animate-fadeInDown">
          Sign Up
        </h1>
        <form onSubmit={handleSignUp} className="flex-grow w-full"> {/* Ensure form takes full width */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block mb-2 font-bold text-lg text-indigo-900">First Name</label>
            <div className="relative flex items-center">
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="Your first name"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setFirstNameTouched(true); // Mark as touched on change
                }}
                onFocus={() => setFirstNameTouched(true)} // Mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${firstNameError && firstNameTouched ? 'border-danger' : 'border-gray-300'}`}
              />
              {/* Icon is now positioned to the right of the input field */}
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-700 w-6 h-6" />
            </div>
            {firstNameError && firstNameTouched && <span className="text-danger text-xs mt-1 block">{firstNameError}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block mb-2 font-bold text-lg text-indigo-900">Last Name</label>
            <div className="relative flex items-center">
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Your last name"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setLastNameTouched(true); // Mark as touched on change
                }}
                onFocus={() => setLastNameTouched(true)} // Mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${lastNameError && lastNameTouched ? 'border-danger' : 'border-gray-300'}`}
              />
              {/* Icon is now positioned to the right of the input field */}
              <User className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-700 w-6 h-6" />
            </div>
            {lastNameError && lastNameTouched && <span className="text-danger text-xs mt-1 block">{lastNameError}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block mb-2 font-bold text-lg text-indigo-900">Email</label>
            <div className="relative flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Your email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailTouched(true); // Mark as touched on change
                }}
                onFocus={() => setEmailTouched(true)} // Mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${emailError && emailTouched ? 'border-danger' : 'border-gray-300'}`}
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-700 w-6 h-6" />
            </div>
            {emailError && emailTouched && <span className="text-danger text-xs mt-1 block">{emailError}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block mb-2 font-bold text-lg text-indigo-900">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Create your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true); // Mark as touched on change
                }}
                onFocus={() => setPasswordTouched(true)} // Mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${passwordError && passwordTouched ? 'border-danger' : 'border-gray-300'}`}
              />
              <Lock className="absolute right-12 top-1/2 -translate-y-1/2 text-indigo-700 w-6 h-6" />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-700 transition-colors duration-300"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {passwordError && passwordTouched && <span className="text-danger text-xs mt-1 block">{passwordError}</span>}
          </div>
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 font-bold text-lg text-indigo-900">Confirm Password</label>
            <div className="relative flex items-center">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setConfirmPasswordTouched(true); // Mark as touched on change
                }}
                onFocus={() => setConfirmPasswordTouched(true)} // Mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${confirmPasswordError && confirmPasswordTouched ? 'border-danger' : 'border-gray-300'}`}
              />
              <Lock className="absolute right-12 top-1/2 -translate-y-1/2 text-indigo-700 w-6 h-6" />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-700 transition-colors duration-300"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {confirmPasswordError && confirmPasswordTouched && <span className="text-danger text-xs mt-1 block">{confirmPasswordError}</span>}
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 tracking-wide flex items-center justify-center gap-2 mt-2"
          >
            <UserPlus className="w-6 h-6" /> Sign Up
          </button>
        </form>
        <div className="text-center mt-4 text-base text-gray-700">
          <p>Already have an account? <a href="#" onClick={() => setActiveModule('signin')} className="text-purple-700 hover:underline font-semibold transition-colors duration-300">Sign In</a></p>
        </div>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
        type={modalType}
        title={modalTitle}
      />
    </div>
  );
}

export default SignUp;
