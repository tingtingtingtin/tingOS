"use client";

import { useState } from "react";
import WindowFrame from "@/components/WindowFrame";
import Tweet from "@/components/experience/Tweet";
import { tweets } from "@/data/tweets";

const ExperienceApp = () => {
  const [activeTab, setActiveTab] = useState<"experience" | "education">(
    "experience",
  );

  // Filter data based on tab
  const feedData = tweets.filter((t) => t.type === activeTab);

  return (
    <WindowFrame id="experience" title="Xperiences">
      <div className="flex min-h-full flex-col bg-white dark:bg-black">
        {/* Sticky Header / Tabs */}
        <div className="sticky top-0 z-10 border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
          <div className="flex">
            <button
              onClick={() => setActiveTab("experience")}
              className="relative flex-1 py-4 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`text-sm font-bold ${activeTab === "experience" ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                >
                  Experience
                </span>
                {activeTab === "experience" && (
                  <div className="absolute bottom-0 h-1 w-16 rounded-full bg-blue-500" />
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab("education")}
              className="relative flex-1 py-4 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
            >
              <div className="flex flex-col items-center">
                <span
                  className={`text-sm font-bold ${activeTab === "education" ? "text-gray-900 dark:text-white" : "text-gray-500"}`}
                >
                  Education
                </span>
                {activeTab === "education" && (
                  <div className="absolute bottom-0 h-1 w-16 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          </div>
        </div>

        {/* Feed Content */}
        <div>
          {feedData.map((tweet) => (
            <Tweet key={tweet.id} data={tweet} />
          ))}
          {/* End of feed indicator */}
          <div className="p-8 text-center text-sm text-gray-500">
            You&apos;re all caught up!
          </div>
        </div>
      </div>
    </WindowFrame>
  );
};

export default ExperienceApp;
