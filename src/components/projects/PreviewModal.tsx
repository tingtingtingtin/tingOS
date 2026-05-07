"use client";

import { useState } from "react";
import { Eye, X, ExternalLink } from "lucide-react";

interface PreviewModalProps {
  title: string;
  demoUrl: string;
}

const PreviewModal = ({ title, demoUrl }: PreviewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => setIsOpen(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 transition-colors hover:cursor-pointer hover:text-gray-900 dark:hover:text-white"
        aria-label={`Preview ${title}`}
      >
        <Eye size={20} />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <div
            className="flex h-[85vh] w-full max-w-5xl flex-col rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-800 dark:bg-gray-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4 dark:border-gray-800">
              <span className="font-semibold text-gray-900 dark:text-white">
                {title}
              </span>
              <div className="flex items-center gap-3">
                <a
                  href={demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
                  aria-label="Open in new tab"
                >
                  <ExternalLink size={18} />
                </a>
                <button
                  onClick={handleClose}
                  className="text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
                  aria-label="Close preview"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="relative flex-1 overflow-hidden rounded-b-xl bg-gray-50 dark:bg-gray-950">
              <iframe
                src={demoUrl}
                title={`${title} preview`}
                className="h-full w-full"
                allow="fullscreen"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PreviewModal;
