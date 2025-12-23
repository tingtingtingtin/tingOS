"use client";

const TimeDisplay = () => {
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "America/Los_Angeles",
  });

  const date = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "America/Los_Angeles",
  });

  return (
    <div className="group relative ml-4 flex flex-col items-end">
      <span>{time}</span>
      <span className="text-xs text-gray-500 dark:text-gray-300">{date}</span>
      <span className="pointer-events-none absolute -top-10 right-0 z-50 rounded border border-gray-200 bg-white px-2 py-1 text-xs whitespace-nowrap text-gray-900 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
        My Local Time (PST)
      </span>
    </div>
  );
};

export default TimeDisplay;
