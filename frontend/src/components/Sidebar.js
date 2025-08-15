import {useEffect} from "react";

export default function Sidebar({ sessions, activeId, onSelect, onNew }) {
  useEffect(() => {console.log('inside Side bar'); });
    return (
      <div className="w-60 bg-gray-200 p-4 overflow-y-auto">
        <button
          onClick={onNew}
          className="mb-4 w-full bg-blue-500 text-white py-2 rounded"
        >
          + New Chat
        </button>

        {Array.isArray(sessions) && sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`cursor-pointer mb-2 p-2 rounded ${
              s.id === activeId ? "bg-white" : "bg-gray-300"
            } text-black`}
          >
            Session {s.id}
          </div>
        ))}
      </div>
    );
  }
