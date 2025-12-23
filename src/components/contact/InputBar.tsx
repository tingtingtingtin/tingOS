import { Send, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import React from "react";

const InputBar = ({
  inputValue,
  onInputChange,
  onKeyDown,
  onSend,
  placeholder,
  disabledInput,
  disabledSend,
  isSending,
}: {
  inputValue: string;
  onInputChange: (value: string) => void;
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>;
  onSend: () => void;
  placeholder: string;
  disabledInput: boolean;
  disabledSend: boolean;
  isSending: boolean;
}) => (
  <div className="flex gap-2">
    <input
      type="text"
      value={inputValue}
      onChange={(e) => onInputChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      disabled={disabledInput}
      className="flex-1 rounded-full bg-gray-100 px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50 dark:bg-gray-800 dark:text-white"
    />
    <button
      onClick={onSend}
      disabled={disabledSend}
      className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-sm transition-colors hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-gray-700"
    >
      {isSending ? (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <LoaderCircle size={20} />
        </motion.div>
      ) : (
        <Send size={20} className={inputValue.trim() ? "ml-0.5" : ""} />
      )}
    </button>
  </div>
);

export default InputBar;
