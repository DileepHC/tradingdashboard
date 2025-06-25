// scenes/messages/index.jsx
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
  const messagesEndRef = useRef(null);

  const messageTemplates = [
    { id: 'welcome', text: 'Welcome to our platform! We are excited to have you here.' },
    { id: 'renewal', text: 'Your subscription is due for renewal soon. Please renew to continue enjoying our services.' },
    { id: 'offer', text: 'Special offer just for you! Get 20% off your next premium plan upgrade.' },
  ];

  // Dummy message history filtering
  const filteredMessages = data.filter(msg =>
    msg.sender.toLowerCase().includes(filterUser.toLowerCase()) ||
    msg.text.toLowerCase().includes(filterUser.toLowerCase())
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [filteredMessages]); // Scroll when messages change

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim() === '') return;

    const newMessage = {
      id: data.length + 1, // Simple ID generation
      sender: 'Admin', // Assuming admin is sending
      text: messageText,
      timestamp: new Date().toLocaleString(),
    };
    console.log('Sending Message:', newMessage);
    // In a real app, you'd send this to an API and update state
    setMessageText('');
    setSelectedTemplate(''); // Clear template selection
  };

  const handleTemplateSelect = (e) => {
    const templateId = e.target.value;
    setSelectedTemplate(templateId);
    const template = messageTemplates.find(t => t.id === templateId);
    if (template) {
      setMessageText(template.text);
    } else {
      setMessageText('');
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 bg-background-color text-text-base flex flex-col h-full">
      <h2 className="text-3xl font-bold text-secondary flex items-center gap-3">
        <MessageSquare className="w-8 h-8 text-primary" /> Messages
      </h2>

      {/* Message Filtering and Templates */}
      <div className="kpi-card-custom p-4 flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            placeholder="Search by User ID or message content..."
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="w-full p-3 pl-10 border border-border-base rounded-lg bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-light" />
        </div>
        <select
          value={selectedTemplate}
          onChange={handleTemplateSelect}
          className="p-3 border border-border-base rounded-lg bg-bg-base text-text-base focus:ring-primary focus:border-primary outline-none w-full sm:w-auto"
        >
          <option value="">Select Message Template (Optional)</option>
          {messageTemplates.map(template => (
            <option key={template.id} value={template.id}>{template.id.charAt(0).toUpperCase() + template.id.slice(1)}</option>
          ))}
        </select>
      </div>

      {/* Chatbox Interface */}
      <div className="kpi-card-custom flex-1 flex flex-col p-6 overflow-hidden">
        <h3 className="dashboard-widget-title mb-4">Message History</h3>
        <div className="flex-1 overflow-y-auto custom-scrollbar pr-2"> {/* Added pr-2 for scrollbar space */}
          {filteredMessages.length > 0 ? (
            filteredMessages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 pb-2 border-b border-border-base last:border-b-0 ${
                  msg.sender === 'Admin' ? 'text-right' : 'text-left'
                }`}
              >
                <p className="text-sm font-semibold text-secondary">
                  {msg.sender === 'Admin' ? 'You' : msg.sender}
                  <span className="text-xs font-normal text-text-light ml-2">{msg.timestamp}</span>
                </p>
                <p className={`text-text-base mt-1 inline-block p-2 rounded-lg ${
                    msg.sender === 'Admin' ? 'bg-primary text-white' : 'bg-bg-base'
                }`}>
                  {msg.text}
                </p>
              </div>
            ))
          ) : (
            <p className="text-text-light text-center py-10">No messages found.</p>
          )}
          <div ref={messagesEndRef} /> {/* For auto-scrolling */}
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex mt-4 space-x-4">
          <input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-grow p-3 border border-border-base rounded-lg bg-bg-base text-text-base focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button type="submit" className="action-button-custom">
            <Send className="w-5 h-5 mr-2" /> Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default Messages;
