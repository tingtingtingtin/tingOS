import { AnimatePresence, motion } from "motion/react";

const SuggestedActions = ({
  visible,
  options,
  onSelect,
}: {
  visible: boolean;
  options: string[];
  onSelect: (opt: string) => void;
}) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="scrollbar-hide mb-3 flex gap-2 overflow-x-auto pb-2"
      >
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium whitespace-nowrap text-blue-600 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300 dark:hover:bg-blue-900/40"
          >
            {opt}
          </button>
        ))}
      </motion.div>
    )}
  </AnimatePresence>
);

export default SuggestedActions;
