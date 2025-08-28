import {useEffect} from "react";

export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete, collapsed}) {
  useEffect(() => {console.log('inside Side bar'); });
    return (
     <div className="bg-[#202123] text-white flex flex-col space-y-2 p-2">
           <button
             onClick={onNew}
             className="w-full truncate bg-transparent text-white text-sm py-2 rounded"
           >
             {collapsed ? "+" : "New Chat"}
           </button>

           {sessions.map((s) => (
             <div
               key={s.id}
               onClick={() => onSelect(s.id)}
               className={`cursor-pointer rounded text-white text-sm flex items-center justify-between ${
                 activeId === s.id ? "bg-[#343541]" : "bg-transparent"
               }`}
             >
               {collapsed ? "💬" :
               <><span className="flex-1 truncate px-2">Session {s.id}</span>
                              <button
                                onClick={() => onDelete(s.id)}
                                className="px-2 text-gray-400"
                                title="Delete"
                              >
                                ✖
                              </button></>}
             </div>
           ))}
         </div>

    );
  }
