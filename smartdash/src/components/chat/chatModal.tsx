import { useEffect, useState } from "react";
import ChatMessage from "./chatMessage";

function ChatModal({ chats, onClose, sessionId }: any) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    setMessages(chats);
  }, [chats]); // ✅ Only update when props.chats changes

  return (
    <div className="fixed inset-0 z-80 flex items-center justify-center overflow-y-auto bg-black/40">
      <div className="w-full sm:max-w-2xl mx-3 sm:mx-auto transition-all duration-500 ease-out">

        <div className="relative flex flex-col bg-white border border-gray-200 shadow-2xl rounded-xl overflow-hidden">
          <h3 className="text-center text-lg font-semibold">{chats[0].user}</h3>

          {/* Close button */}
          <div className="absolute top-2 end-2">
            <button
              type="button"
              onClick={onClose} // ✅ Hook up close handler
              className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>

          {/* Chat content */}
          <div className="p-4 space-y-2 max-h-[80vh] overflow-y-auto">
            {messages.map((msg: any, index: number) =>
              <div key={index}>
                {msg.user && (
                  <ChatMessage type="user" text={msg.user} />
                )}
                {msg.bot && (
                  <ChatMessage type="bot" text={msg.bot} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatModal;
