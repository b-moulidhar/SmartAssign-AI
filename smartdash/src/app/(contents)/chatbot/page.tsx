import ChatWindow from "@/components/chat/chatWindow";
import FacetSidebar from "@/components/chat/facetSideBar";

export default function ChatbotPage() {
  return (
    <>
      <h1 className="text-2xl font-semibold mb-4 text-center">Ask SmartAssign AI</h1>
        <div className="min-h-screen bg-gray-100 p-4 gap-8 flex flex-col md:flex-row">
          <FacetSidebar />
          <ChatWindow />
        </div>
    </>
  );
}