import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, MessageSquare, Edit, Trash2, X } from 'lucide-react';

/**
 * Messages component provides a chatbox interface for Admin to Users,
 * with message templates, history, search, and message management (add, edit, delete).
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Initial array of message history data.
 */
function Messages({ data = [] }) {
  // State to manage the actual list of messages, allowing for additions, edits, and deletions.
  const [messagesData, setMessagesData] = useState(data);

  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom of messages

  // States for Add/Edit Message Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editMessage, setEditMessage] = useState(null); // Stores the message object being edited
  const [formMessageText, setFormMessageText] = useState(''); // Text for the form input
  const [formErrors, setFormErrors] = useState({});

  // State for Delete Confirmation Modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null); // Stores the ID of the message to delete

  // Predefined message templates for quick sending
  const messageTemplates = [
    { id: 'welcome', text: 'Welcome to our platform! We are excited to have you here.' },
    { id: 'renewal', text: 'Your subscription is due for renewal soon. Please renew to continue enjoying our services.' },
    { id: 'offer', text: 'Special offer just for you! Get 20% off your next premium plan upgrade.' },
  ];

  // Filters the message history based on the filterUser input
  const filteredMessages = messagesData.filter(msg =>
    // Checks if sender or message text includes the filter text (case-insensitive)
    String(msg.sender).toLowerCase().includes(filterUser.toLowerCase()) ||
    String(msg.text).toLowerCase().includes(filterUser.toLowerCase())
  );

  /**
   * Scrolls the messages container to the bottom smoothly.
   */
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Effect to scroll to the bottom whenever filteredMessages change
  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]);

  /**
   * Handles sending a new message from the main input field.
   * This is now primarily for adding new messages directly to the chat history.
   * @param {Event} e - The form submission event.
   */
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission to avoid page reload
    if (messageText.trim() === '') return; // Do not send empty messages

    const newMessage = {
      id: messagesData.length > 0 ? Math.max(...messagesData.map(m => m.id)) + 1 : 1, // Generate unique ID
      sender: 'Admin', // Assuming the sender is always 'Admin' for this component
      text: messageText,
      timestamp: new Date().toLocaleString(), // Current local date and time
    };

    setMessagesData((prevMessages) => [...prevMessages, newMessage]);
    console.log('New Message Added:', newMessage);

    setMessageText(''); // Clear message input field
    setSelectedTemplate(''); // Clear selected template
  };

  /**
   * Handles selecting a message template.
   * Sets the selected template ID and populates the message input with the template's text.
   * @param {Event} e - The change event from the select dropdown.
   */
  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId); // Update selected template state
    const template = messageTemplates.find(t => t.id === templateId); // Find the template object
    if (template) {
      setMessageText(template.text); // Set message text to template text
    } else {
      setMessageText(''); // Clear message text if no template is selected
    }
  };

  /**
   * Opens the add/edit message form modal.
   * If a message object is passed, it pre-fills the form for editing.
   * Otherwise, it prepares the form for adding a new message.
   * @param {object|null} message - The message object to edit, or null to add new.
   */
  const handleOpenForm = (message = null) => {
    setIsFormOpen(true);
    setEditMessage(message);
    setFormErrors({}); // Clear any previous form errors.

    if (message) {
      setFormMessageText(message.text);
    } else {
      setFormMessageText('');
    }
  };

  /**
   * Closes the add/edit message form modal and resets related states.
   */
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditMessage(null);
    setFormErrors({});
  };

  /**
   * Validates the message text field in real-time for the form.
   * @param {string} text - The current value of the message text input.
   */
  const validateFormMessageText = (text) => {
    setFormErrors(prevErrors => ({ ...prevErrors, text: text.trim() ? '' : 'Message text cannot be empty.' }));
  };

  /**
   * Handles the form submission for adding or updating a message.
   * @param {Event} e - The form submission event.
   */
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formMessageText.trim()) {
      setFormErrors({ text: 'Message text cannot be empty.' });
      return;
    }

    if (editMessage) {
      // Update existing message
      setMessagesData(messagesData.map(msg =>
        msg.id === editMessage.id ? { ...msg, text: formMessageText, timestamp: new Date().toLocaleString() } : msg
      ));
      console.log('Message Updated:', { ...editMessage, text: formMessageText });
    } else {
      // Add new message (from the modal, distinct from main chat input)
      const newMessage = {
        id: messagesData.length > 0 ? Math.max(...messagesData.map(m => m.id)) + 1 : 1,
        sender: 'Admin', // Assuming Admin adds messages via this form
        text: formMessageText,
        timestamp: new Date().toLocaleString(),
      };
      setMessagesData((prevMessages) => [...prevMessages, newMessage]);
      console.log('New Message Added from Form:', newMessage);
    }
    handleCloseForm();
  };

  /**
   * Opens the delete confirmation modal.
   * @param {string} messageId - The unique ID of the message to delete.
   */
  const handleDeleteClick = (messageId) => {
    setMessageToDelete(messageId);
    setShowDeleteConfirm(true);
  };

  /**
   * Confirms and performs the deletion of a message.
   */
  const confirmDelete = () => {
    setMessagesData(messagesData.filter(msg => msg.id !== messageToDelete));
    console.log('Deleting message with ID:', messageToDelete);
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  /**
   * Cancels the deletion process.
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setMessageToDelete(null);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base flex flex-col h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-primary" /> Messages
        </h2>
      </div>

      {/* Message Filtering and Templates Section */}
      <div className="kpi-card-custom p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          {/* Input for filtering messages */}
          <input
            type="text"
            placeholder="Search by User ID or message content..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full p-3 pr-10 border border-border-base rounded-lg bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
            aria-label="Search messages"
          />
          {/* Search icon inside the input field, positioned on the right */}
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        </div>
        {/* Dropdown for selecting message templates */}
        <select
          value={selectedTemplate}
          onChange={handleTemplateSelect}
          className="p-3 border border-border-base rounded-lg bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none w-full sm:w-auto"
          aria-label="Select message template"
        >
          <option value="">Select Message Template (Optional)</option>
          {/* Map through messageTemplates to create options */}
          {messageTemplates.map(template => (
            <option key={template.id} value={template.id}>{template.id.charAt(0).toUpperCase() + template.id.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Chatbox Interface Section */}
      <div className="kpi-card-custom flex-1 flex flex-col p-6 overflow-hidden">
        <h3 className="dashboard-widget-title mb-4">Message History</h3>

        {/* Message display area, now as a simple list */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
          {filteredMessages.length > 0 ? (
            // Map through filtered messages to display each one
            filteredMessages.map((msg) => (
              <div
                key={msg.id} // Unique key for each message
                className={`mb-4 pb-2 border-b border-border-base last:border-b-0 ${ // Add bottom border, remove for last item
                  msg.sender === 'Admin' ? 'text-right' : 'text-left' // Align messages based on sender
                }`}
              >
                <p className="text-sm font-semibold text-secondary">
                  {msg.sender === 'Admin' ? 'You' : msg.sender} {/* Display 'You' for Admin messages */}
                  <span className="text-xs font-normal text-text-light ml-2">{msg.timestamp}</span> {/* Timestamp */}
                </p>
                <p className={`text-text-base mt-1 inline-block p-2 rounded-lg ${ // Message text styling
                    msg.sender === 'Admin' ? 'bg-primary text-white' : 'bg-bg-base'
                }`}>
                  {msg.text}
                </p>
                {/* Edit and Delete buttons for individual messages */}
                <div className="mt-2 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenForm(msg)}
                    className="text-primary hover:text-primary-dark transition-colors text-sm flex items-center p-1 rounded-md"
                    aria-label={`Edit message ${msg.id}`}
                  >
                    <Edit className="w-4 h-4" /> {/* Only icon */}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(msg.id)}
                    className="text-danger hover:text-danger-dark transition-colors text-sm flex items-center p-1 rounded-md"
                    aria-label={`Delete message ${msg.id}`}
                  >
                    <Trash2 className="w-4 h-4" /> {/* Only icon */}
                  </button>
                </div>
              </div>
            ))
          ) : (
            // Message to display if no messages are found
            <p className="text-text-light text-center py-10">No messages found.</p>
          )}
          <div ref={messagesEndRef} /> {/* Invisible element for auto-scrolling to */}
        </div>

        {/* Message Input Form (for quick send) */}
        <form onSubmit={handleSendMessage} className="flex mt-4 space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-grow p-3 border border-border-base rounded-lg bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Type your message"
          />
          <button type="submit" className="action-button-custom">
            <Send className="w-5 h-5 mr-2" /> Send
          </button>
        </form>
      </div>

      {/* Add/Edit Message Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-lg w-full relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close form"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-6">
              {editMessage ? 'Edit Message' : 'Add New Message'}
            </h3>
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label htmlFor="messageContent" className="block text-sm font-medium text-text-base mb-1">
                  Message Content <span className="text-danger">*</span>
                </label>
                <textarea
                  id="messageContent"
                  value={formMessageText}
                  onChange={(e) => {
                    setFormMessageText(e.target.value);
                    validateFormMessageText(e.target.value);
                  }}
                  rows="4"
                  className={`w-full p-3 border rounded-md bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none resize-y ${formErrors.text ? 'border-danger' : 'border-border-base'}`}
                  required
                ></textarea>
                {formErrors.text && <p className="text-danger text-xs mt-1">{formErrors.text}</p>}
              </div>
              <div className="form-actions-custom flex justify-end">
                <button type="submit" className="action-button-custom">
                  {editMessage ? 'Update Message' : 'Add Message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-card-bg rounded-lg p-8 shadow-strong max-w-sm w-full relative text-center">
            <button
              onClick={cancelDelete}
              className="absolute top-4 right-4 text-text-light hover:text-danger transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </button>
            <h3 className="dashboard-widget-title mb-4">Confirm Deletion</h3>
            <p className="text-text-base mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={confirmDelete}
                className="action-button-custom bg-danger hover:bg-danger-dark"
              >
                Delete
              </button>
              <button
                onClick={cancelDelete}
                className="action-button-custom cancel-button-custom"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;
