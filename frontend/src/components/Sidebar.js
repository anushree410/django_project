import {useEffect} from "react";
import { BsPencilSquare } from 'react-icons/bs';
export default function Sidebar({ sessions, activeId, onSelect, onNew, onDelete, collapsed}) {
  useEffect(() => {console.log('inside Side bar'); });
    return (
     <div className="bg-[#202123] text-white flex flex-col space-y-2 p-2">
           <button onClick={onNew}
             className="w-full truncate bg-transparent text-white text-sm rounded flex items-center justify-start hover:bg-gray-700 transition"
           >
             {collapsed ? <BsPencilSquare/> : <> <span className="ml-2"><BsPencilSquare /></span><span className="ml-2">New Chat</span></>}
           </button>

           {sessions.map((s) => (
             <div key={s.id} onClick={() => onSelect(s.id)}
              className={`cursor-pointer rounded text-white text-sm flex items-center justify-between hover:bg-gray-700 transition ${
                 activeId === s.id ? "bg-[#343541]" : "bg-transparent" }`}
             > {collapsed ? "💬" :
               <><span className="flex-1 truncate px-2">Session {s.id}</span>
                  <button onClick={() => onDelete(s.id)} className="px-2 text-gray-400" title="Delete">
                    ✖ </button></>}
             </div>
           ))}
         </div>
    );
  }
