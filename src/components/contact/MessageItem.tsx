import { motion } from "motion/react";
import { Bot, User } from "lucide-react";

export type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
};

const MessageItem = ({ msg }: { msg: Message }) => (
  <motion.div
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
);

export default MessageItem;
