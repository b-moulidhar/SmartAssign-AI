"use client";
import { useEffect, useState } from "react";
import ChatModal from "./chatModal";
import Cookie from "js-cookie";

export default function FacetSidebar() {
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null); // Holds selected session's data
  const user_id = Cookie.get("user_id") || "";

  const handleOpenModal = (chat: any) => {
    setSelectedChat(chat);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedChat(null);
  };

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/chat/history/${user_id}`, {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setChats(data.sessions || []); // Ensure sessions is an array
      } catch (error) {
        console.error("Error fetching chat history:", error);
      }
    };
    fetchChats();
  }, []);

  return (
    <aside className="w-64 bg-white p-4 rounded-lg shadow h-fit">
      <h2 className="text-lg font-semibold mb-4">History</h2>
      <ul className="space-y-2">
        {chats.map((chat: any, index: number) => {
          return (
            <li
              key={index}
              className="p-2 border rounded hover:bg-gray-100 cursor-pointer max-h-8 overflow-hidden"
              onClick={() => handleOpenModal(chat)}
            >
              <div className="text-sm font-medium overflow-ellipsis w-full flex">
                <span className="max-w-1/4">{chat.chats[0]?.user || "No user message"},</span>
                <span className="max-w-3 max-h-7 overflow-ellipsis">{chat.chats[0]?.bot || "No Bot message"}</span>
                {/* <span className="text-xs">{chat.chats[0]?.timestamp || "No timestamp"}</span> */}
              <span className="text-xs text-gray-500 ml-auto">
                 {chat.chats[0]?.timestamp?.split("T")[0] || "No date"},{chat.chats[0]?.timestamp?.split("T")[1]?.slice(0, 8) || "No time"}
              </span>
              
              </div>
            </li>
          );
        })}
      </ul>

      {/* ✅ Render modal once, outside loop */}
      {showModal && selectedChat && (
        <ChatModal
          sessionId={selectedChat.session_id}
          chats={selectedChat.chats}
          onClose={()=>handleCloseModal()}
        />
      )}
    </aside>
  );
}
