import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from 'react-icons/tb';
const API_BASE_URL = window.location.origin;

export default function ChatLayout() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState(null);
  const [collapsed, setCollapsed]=useState(false);
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

  const deleteSession = async (sessionId) => {
    const res = await fetch(`${API_BASE_URL}/chatbot/session/${sessionId}/delete/`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    if (res.ok) {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (activeSessionId === sessionId) {
        setActiveSessionId(null);
      }
    }
  };

  useEffect(() => {
    if (activeSessionId !== null) {
      console.log("✅ New active session:", activeSessionId);
    }
  }, [activeSessionId]);

  const updateSessionTopic = async (sessionId, newTopic) => {
    const response = await fetch(`${API_BASE_URL}/chatbot/session/${sessionId}/update/`, {
    method: "PATCH",
    headers: {Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
    "Content-Type": "application/json",},
    body: JSON.stringify({ topic: newTopic }),
    });
    if (!response.ok) {
      throw new Error("Failed to update topic");
    }
    const updatedSession = await response.json();
    setSessions((prevSessions) =>
      prevSessions.map((s) => (s.id === sessionId ? updatedSession : s))
    );
    return updatedSession;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#202123]">
      <aside className={`${
          collapsed ? "w-16" : "w-60"
        } bg-[#202123] text-white border-r border-gray-800 sticky top-0 h-screen transition-all duration-300`}
      >
        <div className="flex items-center justify-between p-2 border-b border-gray-700">
          <button onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded hover:bg-gray-700 transition"
          >
            {collapsed ? <TbLayoutSidebarLeftExpand/> : <TbLayoutSidebarLeftCollapse/>}
          </button>
        </div>
        <div className="h-full overflow-y-auto overflow-x-hidden">
          <Sidebar
            sessions={sessions}
            activeId={activeSessionId}
            onSelect={setActiveSessionId}
            onNew={createSession}
            onDelete={deleteSession}
            collapsed={collapsed}
            onUpdate={updateSessionTopic}
          />
        </div>
      </aside>
      <main className="flex-1 flex flex-col min-h-0">
        {activeSessionId ? (
          <ChatWindow sessionId={activeSessionId} />
        ) : (
          <div className="flex-1 min-h-0 flex items-center justify-center text-gray-400">
            Select or create a session to start chatting
          </div>
        )}
      </main>
    </div>

  );
}
