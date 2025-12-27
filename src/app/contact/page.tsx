"use client";

import { useState, useEffect, useRef } from "react";
import WindowFrame from "@/components/WindowFrame";
import ContactLinks from "../../components/contact/ContactLinks";
import MessagesList from "../../components/contact/MessagesList";
import SuggestedActions from "../../components/contact/SuggestedActions";
import InputBar from "../../components/contact/InputBar";

interface Message {
  id: string;
  sender: "bot" | "user";
  text: string;
}

type Step = "init" | "category" | "details" | "contact" | "complete";

const MessengerApp = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState<Step>("init");
  const [isSending, setIsSending] = useState(false);

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

  const handleSend = async (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: crypto.randomUUID(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    if (step === "category") {
      setFormData((prev) => ({ ...prev, category: text }));
      botReply(
        `Got it! Please provide any additional details.`,
        "details",
      );
    } else if (step === "details") {
      setFormData((prev) => ({ ...prev, message: text }));
      botReply(
        "Sounds exciting! Finally, please provide your name and contact info so I can get back to you.",
        "contact",
      );
    } else if (step === "contact") {
      const finalFormData = { ...formData, contact: text };
      setFormData((prev) => ({ ...prev, contact: text }));
      setIsTyping(true);
      setIsSending(true);

      try {
        const response = await fetch("/api/send", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(finalFormData),
        });

        setIsTyping(false);

        if (response.ok) {
          setMessages((prev) => [
            ...prev,
            {
              id: crypto.randomUUID(),
              sender: "bot",
              text: "System: Message delivered. I'll get back to you soon!",
            },
          ]);
          setStep("complete");
        } else {
          throw new Error("SMTP_FAIL");
        }
      } catch (err) {
        setIsTyping(false);
        console.log(err);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            sender: "bot",
            text: "⚠️ System Error: Failed to send message. Please try again or use the direct contact links above.",
          },
        ]);
      } finally {
        setIsSending(false);
      }
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
          <ContactLinks />
          <MessagesList
            messages={messages}
            isTyping={isTyping}
            messagesEndRef={messagesEndRef}
          />
        </div>

        {/* --- Input Area --- */}
        <div className="border-t border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900">
          {/* Suggested Actions */}
          <SuggestedActions
            visible={step === "category" && !isTyping}
            options={[
              "I want to hire you",
              "I have a suggestion",
              "I have a question",
            ]}
            onSelect={(opt: string) => handleSend(opt)}
          />

          {/* Text Input */}
          <InputBar
            inputValue={inputValue}
            onInputChange={setInputValue}
            onKeyDown={handleKeyDown}
            onSend={() => handleSend(inputValue)}
            placeholder={
              step === "complete" ? "Conversation closed." : "Type a message..."
            }
            disabledInput={step === "complete" || isTyping}
            disabledSend={
              !inputValue.trim() || step === "complete" || isTyping || isSending
            }
            isSending={isSending}
          />
        </div>
      </div>
    </WindowFrame>
  );
};

export default MessengerApp;
