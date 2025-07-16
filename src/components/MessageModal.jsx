// src/components/MessageModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';

/**
 * Reusable Message Modal Component.
 * Displays various types of messages (info, success, warning, error) with customizable titles,
 * and optional confirmation buttons with input fields.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {function} props.onClose - Function to call when the modal is closed.
 * @param {string} props.message - The main message content to display.
 * @param {string} [props.type='info'] - Type of message ('info', 'success', 'warning', 'error').
 * @param {string} [props.title=''] - Optional title for the modal.
 * @param {boolean} [props.showConfirmButton=false] - Whether to show a confirm button.
 * @param {function} [props.onConfirm=null] - Function to call when the confirm button is clicked.
 * @param {boolean} [props.promptForInput=false] - If true, an input field is shown in the modal.
 * @param {string} [props.inputPlaceholder=''] - Placeholder text for the first input field.
 * @param {string} [props.inputType='text'] - Type of the first input field (e.g., 'text', 'email', 'password').
 * @param {boolean} [props.promptForSecondInput=false] - If true, a second input field is shown.
 * @param {string} [props.inputPlaceholder2=''] - Placeholder text for the second input field.
 * @param {string} [props.inputType2='text'] - Type of the second input field.
 */
function MessageModal({
  isOpen,
  onClose,
  message,
  type = 'info',
  title = '',
  showConfirmButton = false,
  onConfirm = null,
  promptForInput = false,
  inputPlaceholder = '',
  inputType = 'text',
  promptForSecondInput = false, // New prop for second input
  inputPlaceholder2 = '',       // New prop for second input placeholder
  inputType2 = 'text'           // New prop for second input type
}) {
  const [inputValue, setInputValue] = useState('');
  const [inputValue2, setInputValue2] = useState(''); // State for second input
  const modalRef = useRef(null); // Ref for clicking outside

  // Reset input values when modal opens/closes
  useEffect(() => {
    if (isOpen) { // Only reset when opening
      setInputValue('');
      setInputValue2('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  let icon;
  let bgColor;
  let textColor;
  let borderColor;

  switch (type) {
    case 'success':
      icon = <CheckCircle className="w-8 h-8 text-green-600" />;
      bgColor = 'bg-green-50';
      textColor = 'text-green-800';
      borderColor = 'border-green-300';
      break;
    case 'error':
      icon = <XCircle className="w-8 h-8 text-red-600" />;
      bgColor = 'bg-red-50';
      textColor = 'text-red-800';
      borderColor = 'border-red-300';
      break;
    case 'warning':
      icon = <AlertTriangle className="w-8 h-8 text-yellow-600" />;
      bgColor = 'bg-yellow-50';
      textColor = 'text-yellow-800';
      borderColor = 'border-yellow-300';
      break;
    case 'info':
    default:
      icon = <Info className="w-8 h-8 text-blue-600" />;
      bgColor = 'bg-blue-50';
      textColor = 'text-blue-800';
      borderColor = 'border-blue-300';
      break;
  }

  const handleConfirm = () => {
    if (onConfirm) {
      if (promptForInput && promptForSecondInput) {
        onConfirm({ input1: inputValue, input2: inputValue2 }); // Return both inputs
      } else if (promptForInput) {
        onConfirm(inputValue); // Return single input
      } else {
        onConfirm(); // No input
      }
    }
    // IMPORTANT: Removed onClose() here. The parent component (SignIn) will now decide when to close the modal.
  };

  // Close modal if clicking outside of it
  const handleOverlayClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
      onClick={handleOverlayClick} // Allow closing by clicking outside
    >
      <div
        ref={modalRef} // Attach ref to the modal content
        className={`relative ${bgColor} rounded-lg shadow-xl p-6 sm:p-8 w-11/12 max-w-md border ${borderColor} transform transition-all duration-300 ease-out animate-scaleIn`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal content
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{icon}</div>
          {title && <h3 className={`text-xl sm:text-2xl font-bold mb-3 ${textColor}`}>{title}</h3>}
          <p className={`text-base sm:text-lg mb-5 ${textColor}`}>{message}</p>

          {promptForInput && (
            <input
              type={inputType}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={inputPlaceholder}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          {promptForSecondInput && (
            <input
              type={inputType2}
              value={inputValue2}
              onChange={(e) => setInputValue2(e.target.value)}
              placeholder={inputPlaceholder2}
              className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <div className="flex justify-center gap-4 w-full">
            {showConfirmButton && (
              <button
                onClick={handleConfirm}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-105
                  ${type === 'success' ? 'bg-green-600 hover:bg-green-700' :
                    type === 'error' ? 'bg-red-600 hover:bg-red-700' :
                    type === 'warning' ? 'bg-yellow-600 hover:bg-yellow-700' :
                    'bg-blue-600 hover:bg-blue-700'
                  }`}
              >
                Confirm
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all duration-300 transform hover:scale-105"
            >
              {showConfirmButton ? 'Cancel' : 'Close'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;
