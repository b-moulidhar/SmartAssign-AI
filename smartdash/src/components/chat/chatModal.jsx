import { useEffect, useState } from "react";
import ChatMessage from "./chatMessage";

function chatModal() {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
    const timeout = setTimeout(() => {
      document.querySelectorAll(".hs-overlay").forEach((el) => {
        // Assuming HSOverlay is globally available
        if (typeof window !== "undefined" && window.HSOverlay) {
          window.HSOverlay.open(el);
        }
      });
    }, 0); // Optional: can add delay here if needed

    return () => clearTimeout(timeout); // cleanup
  }, []);

  return (
    <div>
      <div className="text-center">
        <button type="button" className="py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 focus:outline-hidden focus:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none" aria-haspopup="dialog" aria-expanded="false" aria-controls="hs-notifications" data-hs-overlay="#hs-notifications">
            Open modal
        </button>
        </div>

        <div id="hs-notifications" className="hs-overlay hidden size-full fixed top-0 start-0 z-80 overflow-x-hidden overflow-y-auto" role="dialog" tabindex="-1" aria-labelledby="hs-notifications-label">
        <div className="hs-overlay-open:mt-7 hs-overlay-open:opacity-100 hs-overlay-open:duration-500 mt-0 opacity-0 ease-out transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto">
            <div className="relative flex flex-col bg-white border border-gray-200 shadow-2xs rounded-xl overflow-hidden">
            <div className="absolute top-2 end-2">
                <button type="button" className="size-8 inline-flex justify-center items-center gap-x-2 rounded-full border border-transparent bg-gray-100 text-gray-800 hover:bg-gray-200 focus:outline-hidden focus:bg-gray-200 disabled:opacity-50 disabled:pointer-events-none" aria-label="Close" data-hs-overlay="#hs-notifications">
                <span className="sr-only">Close</span>
                <svg className="shrink-0 size-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
            </div>
                {messages.map((msg, index) => (
                <ChatMessage
                key={index}
                    type={msg.type}
                    text={msg.text} />
                ))}
            </div>
        </div>
        </div>
    </div>
    
  )
}

export default chatModal
