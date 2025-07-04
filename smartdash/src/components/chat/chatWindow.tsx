"use client";

import React, { useState, useRef } from "react";
import ChatMessage from "./chatMessage";

interface Message {
  type: "user" | "bot";
  text: string;
}

export default function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const controllerRef = useRef<AbortController | null>(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { type: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const controller = new AbortController();
    controllerRef.current = controller;

    try {
      const res = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input }),
        signal: controller.signal,
        });

      if (!res.body) throw new Error("No response body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let botText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(line => line.trim() !== "");

        for (const line of lines) {
          try {
            const json = JSON.parse(line);
            if (json.response) {
              botText += json.response;
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];

                if (last?.type === "bot") {
                  updated[updated.length - 1] = { type: "bot", text: botText };
                } else {
                  updated.push({ type: "bot", text: botText });
                }

                return updated;
              });
            }
          } catch (err) {
            console.error("Stream parse error:", err);
          }
        }
      }
    } catch (err) {
      if ((err as any).name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Ollama error:", err);
        setMessages((prev) => [
          ...prev,
          { type: "bot", text: "⚠️ Error contacting the AI." },
        ]);
      }
    } finally {
      setLoading(false);
      controllerRef.current = null;
    }
  };

  const handleStop = () => {
    if (controllerRef.current) {
      controllerRef.current.abort();
    }
  };

  return (
    <div className="flex flex-col max-h-dvh min-h-100 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <ChatMessage
          key={index}
            type={msg.type}
            text={msg.text} />
        ))}
        {loading && <div className="text-sm text-gray-500">Thinking...</div>}
      </div>
      <div className="p-4 border-t flex gap-2">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2"
          type="text"
          placeholder="Ask something..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        {loading ? (
          <button
            className="bg-red-500 text-white px-4 py-2 rounded"
            onClick={handleStop}
          >
            Stop
          </button>
        ):<button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleSend}
          disabled={loading}
        >
          Send
        </button>}
      </div>
    </div>
  );
}
