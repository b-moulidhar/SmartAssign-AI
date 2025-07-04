import ChatWindow from "@/components/chat/chatWindow";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-semibold mb-4 text-center">Ask SmartAssign AI</h1>
      <ChatWindow />
    </div>
  );
}