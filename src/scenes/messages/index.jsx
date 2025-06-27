import React, { useState, useRef, useEffect } from 'react';
import { Send, Search, MessageSquare, PlusCircle } from 'lucide-react';

/**
 * Messages component provides a chatbox interface for Admin to Users,
 * with message templates, history, and search functionality.
 *
 * @param {object} props - Component props.
 * @param {Array<object>} props.data - Array of message history data.
 */
function Messages({ data = [] }) {
  const [messageText, setMessageText] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom of messages

  // Predefined message templates for quick sending
  const messageTemplates = [
    { id: 'welcome', text: 'Welcome to our platform! We are excited to have you here.' },
    { id: 'renewal', text: 'Your subscription is due for renewal soon. Please renew to continue enjoying our services.' },
    { id: 'offer', text: 'Special offer just for you! Get 20% off your next premium plan upgrade.' },
  ];

  // Filters the message history based on the filterUser input
  const filteredMessages = data.filter(msg =>
    // Checks if sender or message text includes the filter text (case-insensitive)
    msg.sender.toLowerCase().includes(filterUser.toLowerCase()) ||
    msg.text.toLowerCase().includes(filterUser.toLowerCase())
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
   * Handles sending a new message.
   * Prevents sending empty messages, creates a new message object,
   * logs it to the console (in a real app, this would be an API call),
   * and clears the input fields.
   * @param {Event} e - The form submission event.
   */
  const handleSendMessage = (e) => {
    e.preventDefault(); // Prevent default form submission to avoid page reload
    if (messageText.trim() === '') return; // Do not send empty messages

    const newMessage = {
      id: data.length + 1, // Simple ID generation (for demo, in real app, backend assigns ID)
      sender: 'Admin', // Assuming the sender is always 'Admin' for this component
      text: messageText,
      timestamp: new Date().toLocaleString(), // Current local date and time
    };
    console.log('Sending Message:', newMessage); // Log the new message
    // In a real application, you would send this 'newMessage' object to your backend API
    // and then update the 'data' prop (or fetch new data) to reflect the sent message.

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

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-bg-base text-text-base flex flex-col h-full">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-primary" /> Messages {/* Icon for messages */}
      </h2>

      {/* Message Filtering and Templates Section */}
      <div className="kpi-card-custom p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          {/* Input for filtering messages */}
          <input
            type="text"
            placeholder="Search by User ID or message content..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full p-3 pl-10 border border-border-base rounded-lg bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
            aria-label="Search messages"
          />
          {/* Search icon inside the input field */}
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
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
        {/* Message display area, with custom scrollbar */}
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2"> {/* Added pr-2 for scrollbar space */}
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
              </div>
            ))
          ) : (
            // Message to display if no messages are found
            <p className="text-text-light text-center py-10">No messages found.</p>
          )}
          <div ref={messagesEndRef} /> {/* Invisible element for auto-scrolling to */}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSendMessage} className="flex mt-4 space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-grow p-3 border border-border-base rounded-lg bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label="Type your message"
          />
          {/* Send message button */}
          <button type="submit" className="action-button-custom">
            <Send className="w-5 h-5 mr-2" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
