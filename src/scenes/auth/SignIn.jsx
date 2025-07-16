// src/scenes/auth/SignIn.jsx
import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn } from 'lucide-react';
import MessageModal from '../../components/MessageModal.jsx'; // Import the new MessageModal

/**
 * SignIn component for user authentication.
 * Handles user login, form validation, and password reset simulation.
 *
 * @param {object} props - Component props.
 * @param {function} props.setActiveModule - Function to set the active module in App.js for navigation.
 */
function SignIn({ setActiveModule }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // New states to track if input fields have been "touched" (interacted with)
  const [emailTouched, setEmailTouched] = useState(false);
  const [passwordTouched, setPasswordTouched] = useState(false);

  // State for the custom MessageModal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('info');
  const [modalTitle, setModalTitle] = useState('');
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [onConfirmAction, setOnConfirmAction] = useState(null);
  const [promptForInput, setPromptForInput] = useState(false); // New state for modal input
  const [inputPlaceholder, setInputPlaceholder] = useState(''); // New state for modal input placeholder
  const [inputType, setInputType] = useState('text'); // New state for modal input type
  const [promptForSecondInput, setPromptForSecondInput] = useState(false); // New state for second modal input
  const [inputPlaceholder2, setInputPlaceholder2] = useState(''); // New state for second modal input placeholder
  const [inputType2, setInputType2] = useState('text'); // New state for second modal input type

  // State to manage the steps of the forgot password flow
  const [forgotPasswordStep, setForgotPasswordStep] = useState('none'); // 'none', 'emailPrompt', 'securityQuestion', 'resetPassword'
  const [tempUserEmail, setTempUserEmail] = useState(''); // Store email during forgot password flow

  // Utility to display modal messages
  const showMessage = (message, type = 'info', title = '', confirmAction = null, prompt = false, placeholder = '', inputT = 'text', prompt2 = false, placeholder2 = '', inputT2 = 'text') => {
    setModalMessage(message);
    setModalType(type);
    setModalTitle(title);
    setShowConfirmButton(!!confirmAction);
    setOnConfirmAction(() => confirmAction); // Store the function to be called on confirm
    setPromptForInput(prompt); // Set whether to show input
    setInputPlaceholder(placeholder); // Set input placeholder
    setInputType(inputT); // Set input type
    setPromptForSecondInput(prompt2); // Set whether to show second input
    setInputPlaceholder2(placeholder2); // Set second input placeholder
    setInputType2(inputT2); // Set second input type
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalMessage('');
    setModalType('info');
    setModalTitle('');
    setShowConfirmButton(false);
    setOnConfirmAction(null);
    setPromptForInput(false); // Reset input prompt state
    setInputPlaceholder(''); // Reset input placeholder
    setInputType('text'); // Reset input type
    setPromptForSecondInput(false); // Reset second input prompt state
    setInputPlaceholder2(''); // Reset second input placeholder
    setInputType2('text'); // Reset input type
    // Do not reset forgotPasswordStep here, it's managed by the flow
  };

  // --- Validation Functions ---
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

  // Real-time validation on input change, only if the field has been touched
  useEffect(() => {
    if (emailTouched) {
      validateEmail(email);
    }
  }, [email, emailTouched]);

  useEffect(() => {
    if (passwordTouched) {
      validatePassword(password);
    }
  }, [password, passwordTouched]);

  // --- Form Submission Handler ---
  const handleSignIn = (e) => {
    e.preventDefault();

    // Mark all fields as touched on submission attempt to show all errors
    setEmailTouched(true);
    setPasswordTouched(true);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (!isEmailValid || !isPasswordValid) {
      showMessage('Please correct the errors in the form.', 'error', 'Validation Error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      showMessage('Sign-in successful! Welcome to Astrolite Trading Dashboard.', 'success', 'Success', () => {
        // Simulate successful login and redirect to dashboard
        localStorage.setItem('currentUser', JSON.stringify(user)); // Store current user (simple simulation)
        setActiveModule('dashboard'); // Navigate to dashboard
        closeModal(); // Ensure modal is closed after action
      });
    } else {
      showMessage('Invalid email or password. Please try again or sign up.', 'error', 'Login Failed');
    }
  };

  // --- Forgot Password Flow Logic ---
  const startForgotPasswordFlow = () => {
    setForgotPasswordStep('emailPrompt');
  };

  useEffect(() => {
    if (forgotPasswordStep === 'emailPrompt') {
      showMessage(
        'Please enter your registered email address to reset your password:',
        'info',
        'Forgot Password (Step 1/3)',
        (inputEmail) => {
          if (!inputEmail) {
            showMessage('Password reset cancelled. Email not provided.', 'info', 'Cancelled');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
            return;
          }

          const users = JSON.parse(localStorage.getItem('users')) || [];
          const userFound = users.find(u => u.email.toLowerCase() === inputEmail.toLowerCase());

          if (userFound) {
            setTempUserEmail(userFound.email); // Store email for next steps
            closeModal(); // Close modal on successful email verification
            setForgotPasswordStep('securityQuestion'); // Proceed to next step
          } else {
            showMessage('Email not found. Please ensure you have registered.', 'error', 'Email Not Found');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
          }
        },
        true, // Prompt for input
        'Enter your email',
        'email' // Input type
      );
    } else if (forgotPasswordStep === 'securityQuestion') {
      showMessage(
        `Please enter your First Name for verification:`,
        'info',
        'Forgot Password (Step 2/3)',
        (inputFirstName) => {
          if (!inputFirstName) {
            showMessage('Verification cancelled. First Name not provided.', 'info', 'Cancelled');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
            return;
          }

          const users = JSON.parse(localStorage.getItem('users')) || [];
          const userFound = users.find(u => u.email.toLowerCase() === tempUserEmail.toLowerCase());

          if (userFound && userFound.firstName.toLowerCase() === inputFirstName.toLowerCase()) {
            closeModal(); // Close modal on successful first name verification
            setForgotPasswordStep('resetPassword'); // Proceed to next step
          } else {
            showMessage('Incorrect First Name. Verification failed.', 'error', 'Verification Failed');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
          }
        },
        true, // Prompt for input
        'Enter your First Name',
        'text' // Input type
      );
    } else if (forgotPasswordStep === 'resetPassword') {
      showMessage(
        'Please enter your new password and confirm it:',
        'info',
        'Reset Password (Step 3/3)',
        ({ input1: newPassword, input2: confirmNewPassword }) => { // Destructure input1 and input2
          // Validate new password and confirm password
          if (!newPassword || !confirmNewPassword) {
            showMessage('Password reset cancelled. Both password fields are required.', 'info', 'Cancelled');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
            return;
          }

          if (newPassword !== confirmNewPassword) {
            showMessage('New password and confirm password do not match.', 'error', 'Password Mismatch');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
            return;
          }

          const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
          if (!passwordPattern.test(newPassword)) {
            showMessage('New password does not meet the requirements. Password must be 8-12 chars, incl. uppercase, lowercase, number, and special char (@$!%*?&).', 'error', 'Password Invalid');
            // IMPORTANT: Do NOT change step or close modal here. Keep it open with the error.
            return;
          }

          // If all validations pass, update password and show success
          const users = JSON.parse(localStorage.getItem('users')) || [];
          const updatedUsers = users.map(u =>
            u.email.toLowerCase() === tempUserEmail.toLowerCase() ? { ...u, password: newPassword } : u
          );
          localStorage.setItem('users', JSON.stringify(updatedUsers));
          showMessage('Your password has been successfully reset. Please sign in with your new password.', 'success', 'Password Reset Successful');
          setForgotPasswordStep('none'); // Reset flow
          closeModal(); // Close modal only on final success
        },
        true, // Prompt for first input (new password)
        'Enter new password',
        'password', // Type for first input
        true, // Prompt for second input (confirm new password)
        'Confirm new password',
        'password' // Type for second input
      );
    }
  }, [forgotPasswordStep, tempUserEmail]); // Re-run effect when step or tempUserEmail changes

  const handleModalConfirm = (inputValue) => {
    // This handler simply passes the input value(s) to the stored action
    // The specific logic for each step is now within the useEffect
    if (onConfirmAction) {
      onConfirmAction(inputValue);
    }
    // closeModal() is NOT called here. It's handled by the onConfirmAction logic in useEffect.
  };


  return (
    <div
      className="flex items-center justify-center min-h-screen bg-f8f8ff bg-cover bg-no-repeat bg-fixed animate-fadeIn"
      style={{ backgroundImage: "url('/assets/4.jpg')", backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }} // Set background image
    >
      {/* Small Company Logo in top-left corner */}
      <div className="fixed top-4 left-4 z-10">
        <img
          src="/assets/Company logo.jpg" // Company logo image
          alt="Company Logo"
          className="w-24 h-auto" // Small size
        />
      </div>

      <div className="container max-w-md w-11/12 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-white/98 to-blue-50/98 shadow-2xl relative overflow-hidden animate-slideUpScale border border-white/60 backdrop-blur-sm flex flex-col items-center">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl font-extrabold mb-8 text-indigo-700 tracking-wide relative pb-3 after:content-[''] after:absolute after:left-1/2 after:bottom-0 after:-translate-x-1/2 after:w-16 after:h-1 after:bg-indigo-700 after:rounded-full animate-fadeInDown">
          Sign In
        </h1>
        <form onSubmit={handleSignIn} className="w-full"> {/* Ensure form takes full width */}
          <div className="mb-6">
            <label htmlFor="email" className="block mb-3 font-bold text-lg text-indigo-900">Email</label>
            <div className="relative flex items-center">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailTouched(true); // Mark as touched on change
                }}
                onFocus={() => setEmailTouched(true)} // Also mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${emailError && emailTouched ? 'border-red-500' : 'border-gray-300'}`}
                title="e.g., username@example.com"
              />
              <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-indigo-700 w-6 h-6" />
            </div>
            {emailError && emailTouched && <span className="text-red-500 text-xs mt-1 block">{emailError}</span>}
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block mb-3 font-bold text-lg text-indigo-900">Password</label>
            <div className="relative flex items-center">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordTouched(true); // Mark as touched on change
                }}
                onFocus={() => setPasswordTouched(true)} // Also mark as touched on focus
                className={`w-full pl-4 pr-12 py-4 border rounded-xl text-lg transition-all duration-300 focus:border-purple-600 focus:shadow-outline-purple bg-white text-gray-800 placeholder-text-light ${passwordError && passwordTouched ? 'border-red-500' : 'border-gray-300'}`}
                title="Password must be 8-12 characters with specific symbols"
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
            {passwordError && passwordTouched && <span className="text-red-500 text-xs mt-1 block">{passwordError}</span>}
          </div>
          <div className="text-right -mt-4 mb-6">
            <a href="#" onClick={startForgotPasswordFlow} className="text-purple-700 hover:underline font-semibold transition-colors duration-300">
              Forgot Password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-4 bg-gradient-to-r from-purple-700 to-purple-500 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 tracking-wide flex items-center justify-center gap-2"
          >
            <LogIn className="w-6 h-6" /> Sign In
          </button>
        </form>
        <div className="text-center mt-6 text-base text-gray-700">
          <p>Don't have an account? <a href="#" onClick={() => setActiveModule('signup')} className="text-purple-700 hover:underline font-semibold transition-colors duration-300">Sign Up</a></p>
        </div>
      </div>

      <MessageModal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
        type={modalType}
        title={modalTitle}
        showConfirmButton={showConfirmButton}
        onConfirm={handleModalConfirm}
        promptForInput={promptForInput}
        inputPlaceholder={inputPlaceholder}
        inputType={inputType}
        promptForSecondInput={promptForSecondInput}
        inputPlaceholder2={inputPlaceholder2}
        inputType2={inputType2}
      />
    </div>
  );
}

export default SignIn;
