import { useState } from "react";
import axios from "axios";
import { MessageCircle, X, User, Bot } from "lucide-react";

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hi! Welcome to ServiceLink. How can I assist you today?", sender: "bot" }
  ]);

  const handleUserMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message to chat
    const userMessage = { text, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    try {
      // Send user message to backend
      const response = await axios.post("http://localhost:5000/api/message", {
        message: text,
        sessionId: "12345", // Replace with dynamic session ID if needed
      });

      // Get bot response
      const botResponse = response.data.reply;
      setMessages((prev) => [...prev, { text: botResponse, sender: "bot" }]);
    } catch (error) {
      console.error("Error fetching response:", error);
      setMessages((prev) => [...prev, { text: "Oops! Something went wrong.", sender: "bot" }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all flex items-center"
          aria-label="Open Chatbot"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[400px] md:w-[450px] bg-white rounded-xl shadow-2xl border border-gray-300 overflow-hidden animate-fade-in">
          {/* Chat Header */}
          <div className="bg-blue-600 text-white px-5 py-4 flex justify-between items-center">
            <span className="text-lg font-semibold">Chat with ServiceLink</span>
            <button onClick={() => setIsOpen(false)} aria-label="Close Chat">
              <X size={24} />
            </button>
          </div>

          {/* Chat Body */}
          <div className="h-[400px] p-4 overflow-y-auto flex flex-col space-y-3 scrollbar-hide">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center ${
                  msg.sender === "bot" ? "justify-start" : "justify-end"
                }`}
              >
                {msg.sender === "bot" && (
                  <Bot size={28} className="text-blue-500 mr-2" />
                )}
                <div
                  className={`px-4 py-2 rounded-lg max-w-[80%] text-sm shadow ${
                    msg.sender === "bot"
                      ? "bg-gray-200 text-black self-start"
                      : "bg-blue-600 text-white self-end"
                  }`}
                >
                  {msg.text}
                </div>
                {msg.sender === "user" && (
                  <User size={28} className="text-gray-500 ml-2" />
                )}
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 border-t flex items-center">
            <input
              type="text"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none"
              placeholder="Type your message..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleUserMessage((e.target as HTMLInputElement).value);
                  (e.target as HTMLInputElement).value = "";
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
