import { useState, useRef, useEffect } from "react";

export default function ChatbotUI({ messages, setMessages, sendMessage }) {
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input;
    console.log("handle send",text);
    setInput("");
    sendMessage(text);
  };

  useEffect(() => {
    console.log("CHATBOT Ui",messages);
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);


  const API_BASE_URL = window.location.origin;


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-[#f7f7f8]">
      <div className="flex-1 overflow-y-auto px-4 py-6">
        { messages && messages.map((msg, idx) => (
          <div key={idx} className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                msg.sender === "user"
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-white text-gray-900 border rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-gray-200 p-4 bg-white sticky bottom-0">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();handleSend();} }}
            placeholder="Send a message..."
            rows={1}
            className="flex-1 resize-none border rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-blue-300 text-black"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
