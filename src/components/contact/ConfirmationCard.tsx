import { motion } from "motion/react";
import { Bot, Send, RotateCcw, Loader2 } from "lucide-react";

type ConfirmationCardProps = {
  category: string;
  message: string;
  contact: string;
  isSending: boolean;
  onConfirm: () => void;
  onStartOver: () => void;
};

const ConfirmationCard = ({
  category,
  message,
  contact,
  isSending,
  onConfirm,
  onStartOver,
}: ConfirmationCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 10, scale: 0.9 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    className="flex w-full justify-start"
  >
    <div className="flex max-w-[80%] gap-2 md:max-w-[70%]">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600">
        <Bot size={16} className="text-white" />
      </div>

      <div className="rounded-2xl rounded-tl-none border border-gray-200 bg-gray-100 p-3 text-sm shadow-sm md:text-base dark:border-gray-700 dark:bg-gray-800">
        <p className="mb-3 text-gray-800 dark:text-gray-100">
          Here&apos;s a preview of your message:
        </p>

        <div className="mb-3 space-y-2 rounded-xl border border-blue-100 bg-white p-3 text-sm dark:border-blue-900 dark:bg-gray-900">
          <div>
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              Category:{" "}
            </span>
            <span className="text-gray-800 dark:text-gray-200">{category}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              Message:{" "}
            </span>
            <span className="text-gray-800 dark:text-gray-200">{message}</span>
          </div>
          <div>
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              Contact:{" "}
            </span>
            <span className="text-gray-800 dark:text-gray-200">{contact}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onConfirm}
            disabled={isSending}
            className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            {isSending ? "Sending..." : "Send"}
          </button>

          <button
            onClick={onStartOver}
            disabled={isSending}
            className="flex items-center gap-1.5 rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
          >
            <RotateCcw size={14} />
            Start Over
          </button>
        </div>
      </div>
    </div>
  </motion.div>
);

export default ConfirmationCard;
