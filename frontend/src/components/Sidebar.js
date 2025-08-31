import React, { useEffect, useState } from "react";
import { BsPencilSquare,BsSearch } from 'react-icons/bs';
import { LuSquareLibrary } from 'react-icons/lu';
import { HiDotsHorizontal } from "react-icons/hi";
import { RiPencilFill } from "react-icons/ri";
import { IoTrashOutline } from "react-icons/io5";
import { TbLogout } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
export default function Sidebar({ sessions,activeId,onSelect,onNew,onDelete,collapsed,onUpdate}) {
  const navigate=useNavigate();
  const [editingId, setEditingId] = useState(null);
  const [tempTopic, setTempTopic] = useState("");
  const [menuOpenId, setMenuOpenId] = useState(null);
  const handleUpdate = async (sessionId, newTopic) => {
      try {
        console.log("IN handle update");
        console.log("Session id"+sessionId);
        if (!newTopic.trim()) return;
        await onUpdate(sessionId, newTopic);
        setEditingId(null);
        setTempTopic("");
      } catch (err) {
        console.error(err);
      }
    };
  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    alert("Logged out!");
    navigate('/auth');
  };
  useEffect(() => {console.log('inside Side bar'); });
    return (
     <div className="bg-[#202123] text-white flex flex-col space-y-2 p-2">
       <button onClick={onNew}
         className="w-full truncate bg-transparent text-white text-sm rounded flex items-center justify-start hover:bg-gray-700 transition"
       >
         {collapsed ? <BsPencilSquare/> : <> <span className="ml-2"><BsPencilSquare /></span><span className="ml-2">New Chat</span></>}
       </button>
       <button// onClick={}
         className="w-full truncate bg-transparent text-white text-sm rounded flex items-center justify-start hover:bg-gray-700 transition"
       >
         {collapsed ? <BsSearch/> : <> <span className="ml-2"><BsSearch /></span><span className="ml-2">Search Chat</span></>}
       </button>
       <button //onClick={}
         className="w-full truncate bg-transparent text-white text-sm rounded flex items-center justify-start hover:bg-gray-700 transition"
       >
         {collapsed ? <LuSquareLibrary/> : <> <span className="ml-2"><LuSquareLibrary /></span><span className="ml-2">Library</span></>}
       </button>
       <button onClick={handleLogout}
         className="w-full truncate bg-transparent text-white text-sm rounded flex items-center justify-start hover:bg-gray-700 transition"
       >
         {collapsed ? <TbLogout/> : <> <span className="ml-2"><TbLogout /></span><span className="ml-2">Log out</span></>}
       </button>

     {sessions.map((s) => (
        <div key={s.id}
          className={`group cursor-pointer rounded text-white text-sm flex items-center justify-between hover:bg-gray-700 transition ${
            activeId === s.id ? "bg-[#343541]" : "bg-transparent"
          }`}
          onClick={() => onSelect(s.id)} >
          {collapsed ? ("💬") : (
            <>
              {editingId === s.id ? (
                <input autoFocus value={tempTopic} onChange={(e) => setTempTopic(e.target.value)}
                  onBlur={() => handleUpdate(s.id, tempTopic)}
                  onKeyDown={(e) => {if (e.key === "Enter") { handleUpdate(s.id, tempTopic)  }}}
                  className="flex-1 bg-transparent outline-none px-2" />
              ) : ( <span className="flex-1 truncate px-2">  { s.topic } </span>
              )}
              <div className="relative">
                <button onClick={(e) => {
                    e.stopPropagation(); setMenuOpenId(menuOpenId === s.id ? null : s.id);  }}
                  className="px-2 text-gray-400 opacity-0 group-hover:opacity-100 transition">
                  <HiDotsHorizontal />
                </button>
                {menuOpenId === s.id && (
                  <div className="absolute right-0 mt-1 w-28 bg-[#2c2d30] rounded shadow-lg z-10"
                    onClick={(e) => e.stopPropagation()} >
                    <button className="w-full text-left text-sm hover:bg-gray-700 flex items-center justify-start"
                      onClick={() => {  setEditingId(s.id); setTempTopic(s.topic || "");
                        setMenuOpenId(null);
                      }} > <span className="ml-2"><RiPencilFill/></span>
                      Rename
                    </button>
                    <button className="w-full text-left text-sm hover:bg-gray-700 flex items-center justify-start"
                      onClick={() => { onDelete(s.id); setMenuOpenId(null); }}  > <span className="ml-2"><IoTrashOutline/></span>
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      ))}
     </div>
    );
  }
