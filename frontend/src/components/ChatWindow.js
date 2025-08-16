import React, { useEffect, useState } from "react";
import ChatbotUI from "./ChatbotUI";
export default function ChatWindow({ sessionId }) {
  const API_BASE_URL = window.location.origin;
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchHistory() {
      setLoading(true);
      const res = await fetch( `${API_BASE_URL}/chatbot/session/${sessionId}/history/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      const data = await res.json();
      setMessages(data);
      setLoading(false);
    }
    fetchHistory();
  }, [sessionId, API_BASE_URL]);

  const sendMessage = async (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
    console.log("Sending...");
    const res = await fetch(
      `${API_BASE_URL}/chatbot/session/${sessionId}/ask/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({ message: text }),
      }
    );
    const data = await res.json();
    setMessages((prev) => [...prev, { sender: "bot", text: data.answer }]);
  };

  if (loading) return <div className="flex-1 p-4">Loading...</div>;

  return (
   <div className="flex-1 h-screen flex flex-col bg-[#202123]">
     <ChatbotUI
       messages={messages}
       setMessages={setMessages}
       sendMessage={sendMessage}
     />
   </div>
  );
}
