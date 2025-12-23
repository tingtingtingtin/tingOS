import { motion } from "motion/react";

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

export default TypingIndicator;
