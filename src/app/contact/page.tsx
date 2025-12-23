"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, User, Bot } from "lucide-react";
import WindowFrame from "@/components/WindowFrame";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

type Step = "init" | "category" | "details" | "contact" | "complete";

const TypingIndicator = () => (
  <div className="flex w-fit items-center gap-1 rounded-2xl rounded-tl-none bg-gray-200 p-3 dark:bg-gray-800">
    <motion.div
      className="h-2 w-2 rounded-full bg-gray-500"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.div
      className="h-2 w-2 rounded-full bg-gray-500"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
    <motion.div
      className="h-2 w-2 rounded-full bg-gray-500"
      animate={{ y: [0, -5, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
    />
  </div>
);

export default function MessengerApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<Step>("init");

  const [formData, setFormData] = useState({
    category: "",
    message: "",
    contact: "",
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const introRun = useRef(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- Bot Logic Engine ---
  const botReply = (text: string, nextStep: Step, delay = 1500) => {
    const id = crypto.randomUUID();
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { id: id, sender: "bot", text }]);
      setStep(nextStep);
    }, delay);
  };

  useEffect(() => {
    if (step === "init" && !introRun.current) {
      introRun.current = true;
      setTimeout(() => {
        botReply(
          "Thank you for taking the time to look through my portfolio site! What category would you like to contact me about today?",
          "category",
          1000,
        );
      }, 0);
    }
  }, [step]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    if (step === "category") {
      setFormData((prev) => ({ ...prev, category: text }));
      botReply(
        `Got it. Would you like to provide any further details?`,
        "details",
      );
    } else if (step === "details") {
      setFormData((prev) => ({ ...prev, message: text }));
      botReply(
        "Sounds exciting! Finally, what is your name and contact information so I can get back to you?",
        "contact",
      );
    } else if (step === "contact") {
      setFormData((prev) => ({ ...prev, contact: text }));
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            sender: "bot",
            text: "Message sent successfully! I hope to be in touch soon!",
          },
        ]);
        setStep("complete");
        console.log("FORM SUBMITTED:", { ...formData, contact: text }); // Replace with API call
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend(inputValue);
  };

  return (
    <WindowFrame id="contact" title="Messenger">
      <div className="flex h-full flex-col bg-white dark:bg-gray-900">
        {/* --- Chat Area --- */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex w-full ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-[80%] gap-2 md:max-w-[70%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      msg.sender === "bot" ? "bg-blue-600" : "bg-gray-500"
                    }`}
                  >
                    {msg.sender === "bot" ? (
                      <Bot size={16} className="text-white" />
                    ) : (
                      <User size={16} className="text-white" />
                    )}
                  </div>

                  <div
                    className={`rounded-2xl p-3 text-sm shadow-sm md:text-base ${
                      msg.sender === "user"
                        ? "rounded-tr-none bg-blue-600 text-white"
                        : "rounded-tl-none border border-gray-200 bg-gray-100 text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex w-full justify-start"
            >
              <div className="flex gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
                  <Bot size={16} className="text-white" />
                </div>
                <TypingIndicator />
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* --- Input Area --- */}
        <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          {/* Suggested Actions */}
          <AnimatePresence>
            {step === "category" && !isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="scrollbar-hide mb-3 flex gap-2 overflow-x-auto pb-2"
              >
                {[
                  "I want to hire you",
                  "I have a suggestion",
                  "I have a question",
                ].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSend(opt)}
                    className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
                  >
                    {opt}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Text Input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                step === "complete"
                  ? "Conversation closed."
                  : "Type a message..."
              }
              disabled={step === "complete" || isTyping}
              className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 dark:bg-gray-800 dark:text-white"
            />
            <button
              onClick={() => handleSend(inputValue)}
              disabled={!inputValue.trim() || step === "complete" || isTyping}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700"
            >
              <Send size={20} className={inputValue.trim() ? "ml-0.5" : ""} />
            </button>
          </div>
        </div>
      </div>
    </WindowFrame>
  );
}
