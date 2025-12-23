"use client";

import DesktopIcon from "@/components/DesktopIcon";
import { apps } from "@/data/apps";
import { motion } from "motion/react";

const Desktop = () => {
  return (
    <main className="h-full w-full p-4">
      {/* Icon Grid Area */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="relative z-10 grid w-fit grid-flow-col auto-rows-[110px] content-start items-start gap-4 p-4"
      >
        {apps.map((app) => (
          <DesktopIcon
            key={app.id}
            id={app.id}
            label={app.label}
            icon={app.icon}
            route={app.route}
          />
        ))}
      </motion.div>
    </main>
  );
};

export default Desktop;
