import { AnimatePresence, motion } from "motion/react";
import { Bot } from "lucide-react";
import TypingIndicator from "./TypingIndicator";
import MessageItem, { Message } from "./MessageItem";
import { RefObject } from "react";

const MessagesList = ({
  messages,
  isTyping,
  messagesEndRef,
}: {
  messages: Message[];
  isTyping: boolean;
  messagesEndRef: RefObject<HTMLDivElement | null>;
}) => (
  <div className="space-y-4">
    <AnimatePresence initial={false}>
      {messages.map((msg) => (
        <MessageItem key={msg.id} msg={msg} />
      ))}
    </AnimatePresence>

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
);

export default MessagesList;
