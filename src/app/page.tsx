"use client";

import DesktopIcon from "@/components/DesktopIcon";
import { apps } from "@/data/apps";
import { motion } from "motion/react";

const Desktop = () => {
  return (
    <main className="h-full w-full overflow-hidden p-4">
      {/* Icon Grid Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 grid w-full grid-cols-3 justify-items-center gap-x-2 gap-y-6 md:w-fit md:grid-flow-col md:auto-rows-[110px] md:grid-cols-none md:content-start md:items-start md:justify-items-start md:gap-4"
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
