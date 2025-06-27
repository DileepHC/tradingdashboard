// src/components/AiChatIcon.jsx
import React, { useState, useEffect, useRef } from "react";
import { Box, IconButton, useTheme, Modal, Typography, TextField, Button } from "";
import SmartToyOutlinedIcon from ""; // AI icon
import CloseIcon from "";
import SendIcon from "";
import { tokens } from "../theme"; // Assuming tokens are imported correctly

const AiChatIcon = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [open, setOpen] = useState(false);
  // Initialize messages with the AI's first greeting
  const [messages, setMessages] = useState([
    { type: "ai", text: "Hello! How can I assist you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const chatMessagesRef = useRef(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Scroll to bottom of chat messages when new message arrives
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [messages, open]);

  const sendAIChatMessage = async () => {
    const userMessageText = inputValue.trim();
    if (userMessageText === "") return;

    // Add user message to chat window
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "user", text: userMessageText },
    ]);
    setInputValue(""); // Clear input field

    // Simulate AI typing/thinking
    setMessages((prevMessages) => [
      ...prevMessages,
      { type: "ai", text: "AI is thinking...", isTyping: true },
    ]);

    // Prepare prompt for Gemini API
    const prompt = `User query: "${userMessageText}". Provide a concise, helpful response for a Dairy CRM dashboard AI assistant. You can answer questions about dairy farming, milk quality, business metrics, or general information. Keep it under 100 words.`;

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

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.isTyping ? { ...msg, isTyping: false } : msg
        )
      ); // Remove typing indicator

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
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            type: "ai",
            text: "Sorry, I could not generate a response at this time due to an unexpected format.",
          },
        ]);
      }
    } catch (error) {
      console.error("Error calling Gemini API:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.isTyping ? { ...msg, isTyping: false } : msg
        )
      ); // Remove typing indicator on error
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
      <IconButton onClick={handleOpen}>
        <SmartToyOutlinedIcon />
      </IconButton>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="ai-assistant-modal-title"
        aria-describedby="ai-assistant-chat-window"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: { xs: '90%', sm: '60%', md: '40%' },
            maxWidth: '500px',
            bgcolor: colors.primary.main,
            borderRadius: "12px",
            boxShadow: `0 8px 30px ${colors.shadows.medium}`,
            p: 0,
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "450px",
            border: `1px solid ${colors.grey[700]}`,
          }}
          className="ai-chat-window"
        >
          {/* Modal Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: "15px 20px",
              borderBottom: `1px solid ${colors.grey[700]}`,
              bgcolor: colors.primary.dark,
            }}
          >
            {/* AI Icon and Title */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <SmartToyOutlinedIcon sx={{ color: colors.secondary.main, fontSize: "24px" }} />
              <Typography
                id="ai-assistant-modal-title"
                variant="h6"
                component="h2"
                color={colors.neutral.light}
              >
                AI Assistant
              </Typography>
            </Box>
            <IconButton onClick={handleClose} sx={{ color: colors.neutral.light }}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Chat Messages Area */}
          <Box
            ref={chatMessagesRef}
            sx={{
              flexGrow: 1,
              padding: "20px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: colors.primary[500],
              "&::-webkit-scrollbar": {
                display: "none",
              },
              scrollbarWidth: "none",
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
                  wordWrap: "break-word",
                  fontSize: "0.95em",
                  boxShadow: `0 2px 8px ${colors.shadows.light}`,
                  lineHeight: 1.6,
                  alignSelf: msg.type === "user" ? "flex-end" : "flex-start",
                  background:
                    msg.type === "user"
                      ? colors.blueAccent[500]
                      : colors.greenAccent[500],
                  color: colors.neutral.light,
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
              borderTop: `1px solid ${colors.grey[700]}`,
              bgcolor: colors.primary.dark,
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
                mr: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "25px",
                  backgroundColor: colors.primary[400],
                  color: colors.neutral.light,
                  "& fieldset": {
                    borderColor: colors.grey[700],
                  },
                  "&:hover fieldset": {
                    borderColor: colors.secondary.main,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.secondary.main,
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: colors.grey[400],
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
                borderRadius: "50%",
                p: 0,
                backgroundColor: colors.secondary.main,
                color: colors.primary.dark,
                boxShadow: `0 2px 8px ${colors.shadows.medium}`,
                "&:hover": {
                  backgroundColor: colors.secondary.light,
                  transform: "scale(1.05)",
                  boxShadow: `0 4px 12px ${colors.shadows.strong}`,
                },
              }}
              className="chat-input-area button"
            >
              <SendIcon sx={{ fontSize: "24px" }} />
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default AiAssistant;