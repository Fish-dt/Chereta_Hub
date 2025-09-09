"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, MessageSquare, ArrowRight } from "lucide-react";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const toggleOpen = () => setOpen(!open);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([
        {
          sender: "bot",
          text: "Hi! I'm CheretaHub ChatBot. I can help you with auctions, bids, selling items, and more.",
        },
      ]);
    }
  }, [open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const botMessage: Message = { sender: "bot", text: data.reply };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Chatbot error:", error);
      const botMessage: Message = { sender: "bot", text: "Sorry, something went wrong." };
      setMessages((prev) => [...prev, botMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col items-end">
      {/* Full Chat Panel */}
      {open && (
        <div className="flex flex-col w-80 h-96 bg-background border shadow-lg rounded-xl overflow-hidden transform transition-transform duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-2 border-b bg-muted">
            <span className="font-medium text-foreground">CheretaHub ChatBot</span>
            <Button variant="ghost" size="icon" onClick={toggleOpen}>
              <X className="h-4 w-4 text-foreground" />
            </Button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-background">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-md max-w-[80%] ${
                  msg.sender === "user"
                    ? "bg-blue-500 text-white self-end"
                    : "bg-muted text-foreground self-start"
                }`}
              >
                {msg.text}
              </div>
            ))}
            {loading && <div className="text-muted-foreground text-sm">CheretaHub is typing...</div>}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="flex p-2 border-t bg-background">
            <input
              ref={inputRef}
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 border rounded-md px-2 py-1 bg-background text-foreground placeholder-muted-foreground focus:outline-none"
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <Button onClick={handleSend} className="ml-2">
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Icon */}
      {!open && (
        <Button
          variant="default"
          size="icon"
          onClick={toggleOpen}
          className="mt-2 bg-blue-500 text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-400"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
      )}
    </div>
  );
}
