import {useEffect} from "react";

export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete}) {
  useEffect(() => {console.log('inside Side bar'); });
    return (
      <div className="w-60 bg-gray-200 p-4 overflow-y-auto items-center">
        <button
          onClick={onNew}
          className="mb-4 w-full bg-blue-500 text-white text-sm py-2 rounded"
        >
          + New Chat
        </button>

        {Array.isArray(sessions) && sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={`cursor-pointer mb-2 p-2 rounded text-black text-sm ${ s.id === activeId ? "bg-white" : "bg-gray-300"} `}
          >
            Session {s.id}
             <button onClick={() => onDelete(s.id)} className="text-red-600 ml-2" title="Delete" >
                      ✖</button>
          </div>

        ))}
      </div>
    );
  }
