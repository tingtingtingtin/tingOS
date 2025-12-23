"use client";

import DesktopIcon from "@/components/DesktopIcon";
import { apps } from "@/data/apps";
import { motion } from "motion/react";

const Desktop = () => {
  return (
    <main className="h-full w-full p-4 overflow-hidden">
      {/* Icon Grid Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="relative z-10 grid w-full 
          grid-cols-3 justify-items-center gap-y-6 gap-x-2 
          md:w-fit md:grid-flow-col md:grid-cols-none md:auto-rows-[110px] md:content-start md:items-start md:gap-4 md:justify-items-start"
      >
        {apps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            label={app.label}
            icon={app.icon}
            route={app.route}
            url={app.url}
          />
        ))}
      </motion.div>
    </main>
  );
};

export default Desktop;