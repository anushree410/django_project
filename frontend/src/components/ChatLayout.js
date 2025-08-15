import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatLayout() {
  const API_BASE_URL = window.location.origin;
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);

  useEffect(() => {
    console.log('inside Chat layout');
    fetch(`${API_BASE_URL}/chatbot/session/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
      }
    })
      .then(r => r.json())
      .then(data => {
        console.log("Auth ",localStorage.getItem('accessToken'))
        console.log("fetched sessions - ",data)
        setSessions(data);
        if (data.length > 0) {
          setActiveSessionId(data[0].id);
          console.log("ACTIVE SESSION - ",data[0].id)
        }
      });
  }, []);

  const createSession = async () => {
  console.log("TOKEN :" +localStorage.getItem('accessToken'))
    const res = await fetch(`${API_BASE_URL}/chatbot/session/create/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    console.log("CREATE SESSION ",res)
    const data = await res.json();
    setSessions(prev => [data, ...prev]);
    setActiveSessionId(data.id);
  };
  useEffect(() => {
    if (activeSessionId !== null) {
      console.log("✅ New active session:", activeSessionId);
    }
  }, [activeSessionId]);
  return (
    <div className="flex h-screen">
      <Sidebar
        sessions={sessions}
        activeId={activeSessionId}
        onSelect={setActiveSessionId}
        onNew={createSession}
      />
      {activeSessionId && <ChatWindow sessionId={activeSessionId} />}
    </div>
  );
}
