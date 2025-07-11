"use client";
import { useEffect, useState } from "react";
import ChatModal from "./chatModal";

export default function FacetSidebar() {
  const [chats, setChats] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState<any>(null); // Holds selected session's data

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
        const response = await fetch("http://127.0.0.1:8000/chat/history/all", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log("Fetched chat history:", data);
        setChats(data);
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
        {chats.map((chat: any, index: number) => (
          <li
            key={index}
            className="p-2 border rounded hover:bg-gray-100 cursor-pointer"
            onClick={() => handleOpenModal(chat)} // ✅ open modal with clicked session
          >
            <div className="text-sm font-medium">{chat.session_id}</div>
          </li>
        ))}
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
