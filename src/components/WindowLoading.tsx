import { Loader2 } from "lucide-react";
import { motion } from "motion/react";

const WindowLoading = () => (
  <div className="flex h-full w-full flex-col items-center justify-center bg-gray-50 dark:bg-gray-950">
    <Loader2 className="mb-4 animate-spin text-blue-500 opacity-50" size={32} />
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="font-mono text-xs tracking-widest text-gray-400 uppercase"
    >
      Loading...
    </motion.span>
  </div>
);

export default WindowLoading;
