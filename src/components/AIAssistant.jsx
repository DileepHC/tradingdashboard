// src/components/AIAssistant.jsx
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, useTheme, Modal, Typography, TextField, Button } from "@mui/material";
// Import Lucide React icons for consistency with the rest of the project
import { Bot, X, Send } from 'lucide-react';
// The path below is based on the provided VS Code explorer structure:
// AIAssistant.jsx is in 'src/components/', and theme.js is in 'src/'.
// Therefore, to go up one directory to 'src/' and then find 'theme.js', '../theme.js' is the correct relative path.
import { tokens } from "../theme.js"; 

/**
 * AiAssistant component provides an AI-powered chat interface within a modal.
 * It interacts with the Gemini API to provide responses related to trading and finance.
 *
 * @param {object} props - Component props.
 * @param {boolean} props.isOpen - Controls the visibility of the AI assistant modal.
 * @param {function} props.onClose - Function to call when the modal is requested to close.
 */
const AiAssistant = ({ isOpen, onClose }) => {
  const theme = useTheme();
  // Ensure colors object is safely accessed, providing a fallback for shadows if not defined in theme.js
  const colors = tokens(theme.palette.mode) || {};
  const shadows = colors.shadows || {
    light: 'rgba(0, 0, 0, 0.1)', // Default light shadow
    medium: 'rgba(0, 0, 0, 0.2)', // Default medium shadow
    strong: 'rgba(0, 0, 0, 0.3)', // Default strong shadow
  };

  // State to manage chat messages, initialized with an AI greeting
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hello! I'm your Trading Dashboard AI Assistant. How can I help you with trading analysis, market trends, or portfolio management today?" },
  ]);
  // State for the user's input message
  const [inputValue, setInputValue] = useState("");
  // Ref for scrolling the chat messages area to the bottom
  const chatMessagesRef = useRef(null);

  // Scroll to the bottom of chat messages whenever new messages arrive or the modal opens
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, isOpen]); // Depend on messages array and modal open state

  /**
   * Handles sending a message to the AI assistant.
   * Adds the user's message to the chat, simulates AI typing,
   * calls the Gemini API, and then adds the AI's response to the chat.
   */
  const sendAIChatMessage = async () => {
    const userMessageText = inputValue.trim();
    if (userMessageText === "") return; // Do not send empty messages

    // Add user message to chat window
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userMessageText },
    ]);
    setInputValue(""); // Clear input field immediately

    // Simulate AI typing/thinking
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "ai", text: "AI is thinking...", isTyping: true },
    ]);

    // Prepare prompt for Gemini API, tailored for a trading dashboard
    const prompt = `User query: "${userMessageText}". You are a Trading Dashboard AI Assistant. Provide a concise, helpful response related to trading analysis, market trends, portfolio management, financial data, or general investment information. Keep your response under 100 words.`;

    let chatHistory = [{ role: "user", parts: [{ text: prompt }] }];
    const payload = { contents: chatHistory };
    // IMPORTANT: In a production environment, NEVER expose your API key directly in client-side code.
    // Use a backend proxy to make API calls securely.
    const apiKey = ""; // Leave as empty string; Canvas runtime will inject the API key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `API Error: ${response.status} ${response.statusText} - ${
            errorData.error?.message || "Unknown error"
          }`
        );
      }

      const result = await response.json();

      // Remove the typing indicator before adding the actual AI response
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.isTyping ? { ...msg, isTyping: false } : msg
        )
      );

      if (
        result.candidates &&
        result.candidates.length > 0 &&
        result.candidates[0].content &&
        result.candidates[0].content.parts &&
        result.candidates[0].content.parts.length > 0
      ) {
        const aiResponseText = result.candidates[0].content.parts[0].text;
        setMessages((prevMessages) => [
          ...prevMessages,
          { type: "ai", text: aiResponseText },
        ]);
      } else {
        // Handle cases where the AI response structure is unexpected
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "ai",
            text: "Sorry, I could not generate a response at this time due to an unexpected format from the AI.",
            isError: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      // Remove typing indicator on error
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.isTyping ? { ...msg, isTyping: false } : msg
        )
      )
      // Add an error message to the chat
      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: "ai",
          text: `Error: ${error.message}. Please check your network or try again later.`,
          isError: true,
        },
      ]);
    }
  };

  return (
    <>
      {/* The IconButton to open the modal is now managed by the Header component */}
      {/* This component only renders the Modal itself */}

      <Modal
        open={isOpen} // Controlled by parent component's state
        onClose={onClose} // Controlled by parent component's state
        aria-labelledby="ai-assistant-modal-title"
        aria-describedby="ai-assistant-chat-window"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent overlay
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: '60%', md: '40%' }, // Responsive width
            maxWidth: '500px', // Max width for larger screens
            bgcolor: colors.card_bg, // Use card background color from theme
            borderRadius: "12px",
            boxShadow: `0 8px 30px ${shadows.medium}`, // Use local 'shadows' variable
            p: 0, // No padding on the box itself, padding is on inner elements
            overflow: "hidden", // Ensure content stays within rounded corners
            display: "flex",
            flexDirection: "column",
            height: "450px", // Fixed height for the chat window
            border: `1px solid ${colors.border_base}`, // Use border color from theme
          }}
          className="ai-chat-window"
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: "15px 20px", // Padding for header
              borderBottom: `1px solid ${colors.border_base}`, // Border color from theme
              bgcolor: colors.sidebar_bg, // Use sidebar background for header
            }}
          >
            {/* AI Icon and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Bot className="w-6 h-6" style={{ color: colors.accent }} /> {/* Lucide Bot icon */}
              <Typography
                id="ai-assistant-modal-title"
                variant="h6"
                component="h2"
                color={colors.text_base} // Use text color from theme
              >
                AI Assistant
              </Typography>
            </Box>
            <IconButton onClick={onClose} sx={{ color: colors.text_light }}> {/* Close button */}
              <X className="w-6 h-6" /> {/* Lucide X icon */}
            </IconButton>
          </Box>

          {/* Chat Messages Area */}
          <Box
            ref={chatMessagesRef}
            sx={{
              flexGrow: 1, // Allows chat area to expand
              padding: "20px",
              overflowY: "auto", // Enable vertical scrolling
              display: "flex",
              flexDirection: "column",
              gap: "12px", // Space between messages
              background: colors.bg_base, // Use background color from theme
              "&::-webkit-scrollbar": { // Hide scrollbar for Webkit browsers
                display: "none",
              },
              scrollbarWidth: "none", // Hide scrollbar for Firefox
            }}
            className="chat-messages"
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  padding: "12px 18px",
                  borderRadius: "20px",
                  maxWidth: "85%",
                  wordWrap: "break-word", // Ensure long words wrap
                  fontSize: "0.95em",
                  boxShadow: `0 2px 8px ${shadows.light}`, // Use local 'shadows' variable
                  lineHeight: 1.6,
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start", // Align messages
                  background:
                    msg.type === "user"
                      ? colors.primary // User messages with primary color
                      : colors.secondary, // AI messages with secondary color
                  color: colors.text_base, // Text color for messages
                  borderBottomLeftRadius: msg.type === "ai" ? "5px" : "20px",
                  borderBottomRightRadius: msg.type === "user" ? "5px" : "20px",
                }}
                className={`message ${msg.type}-message ${msg.isError ? 'error-message' : ''}`}
              >
                {msg.text}
              </Box>
            ))}
          </Box>

          {/* Chat Input Area */}
          <Box
            sx={{
              display: "flex",
              padding: "15px",
              borderTop: `1px solid ${colors.border_base}`, // Border color from theme
              bgcolor: colors.sidebar_bg, // Use sidebar background for input area
            }}
            className="chat-input-area"
          >
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Type your message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  sendAIChatMessage();
                }
              }}
              sx={{
                mr: 1, // Margin right for the text field
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px", // Rounded input field
                  backgroundColor: colors.card_bg, // Input field background
                  color: colors.text_base, // Input text color
                  "& fieldset": {
                    borderColor: colors.border_base, // Border color
                  },
                  "&:hover fieldset": {
                    borderColor: colors.primary, // Hover border color
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.primary, // Focus border color
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: colors.text_light, // Placeholder text color
                  opacity: 1,
                },
              }}
              className="chat-input-area input"
            />
            <Button
              variant="contained"
              onClick={sendAIChatMessage}
              sx={{
                minWidth: "45px",
                width: "45px",
                height: "45px",
                borderRadius: "50%", // Circular button
                p: 0, // No padding inside button
                backgroundColor: colors.primary, // Button background
                color: colors.text_base, // Button icon color
                boxShadow: `0 2px 8px ${shadows.medium}`, // Use local 'shadows' variable
                "&:hover": {
                  backgroundColor: colors.primary, // Hover background
                  transform: "scale(1.05)", // Slight scale on hover
                  boxShadow: `0 4px 12px ${shadows.strong}`, // Use local 'shadows' variable
                },
              }}
              className="chat-input-area button"
            >
              <Send className="w-6 h-6" /> {/* Lucide Send icon */}
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AiAssistant;
