import ReactMarkdown from "react-markdown";

export default function ChatMessage({ type, text }: { type: "user" | "bot"; text: string }) {
  return (
    <div
      className={`max-w-[60%] px-4 py-2 rounded-lg ${
        type === "user"
          ? "ml-auto bg-blue-500 text-white"
          : "mr-auto bg-gray-200 text-black"
      }`}
    >
      <ReactMarkdown>{text}</ReactMarkdown>
    </div>
  );
}
