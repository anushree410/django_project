import { useState, useRef, useEffect } from "react"
import { LuSendHorizontal } from "react-icons/lu"

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


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-[#252529]">
      <div className="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        {messages?.map((msg, idx) => (
          <div
            key={idx}
            className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap text-left ${
                msg.sender === "user"
                  ? "bg-[#343541] text-white rounded-br-none"
                  : "bg-[#343541] text-white rounded-bl-none"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t border-gray-700 p-4 bg-[#252529]">
        <div className="flex items-center gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Send a message..."
            rows={1}
            className="flex-1 resize-none rounded-lg px-4 py-2 bg-[#343541] focus:outline-none focus:ring focus:ring-[#19c37d]/50 text-white text-sm"
          />
          <button
            onClick={handleSend}
            className="bg-[#343541] hover:opacity-90 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <LuSendHorizontal />
          </button>
        </div>
      </div>
    </div>
  );
}
