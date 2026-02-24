"use client";

import { useState } from "react";
import WindowFrame from "@/components/WindowFrame";
import { Download } from "lucide-react";

const ResumeApp = () => {
  const FILE_ID = "14sv3Ej12WkwxC-M8K7bGQB_WE8ZpZxtY";
  const viewUrl = `https://drive.google.com/file/d/${FILE_ID}/preview`;
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${FILE_ID}`;
  // const originalUrl = `https://drive.google.com/file/d/${FILE_ID}/view?usp=sharing`;

  const [loading, setLoading] = useState(true);
  return (
    <WindowFrame id="resume" title="resume.pdf - PDF Viewer">
      <div className="flex h-full flex-col">
        {/* PDF Viewer Toolbar */}
        <div className="flex items-center justify-end gap-2 border-b border-gray-200 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800">
          <a
            href={downloadUrl}
            className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
          {/* <a
            href={originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-500"
          >
            <ExternalLink size={14} />
            <span>Open Original</span>
          </a> */}
        </div>

        {loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <p className="mb-4 text-gray-600 dark:text-gray-400">
              Loading Resume...
            </p>
          </div>
        )}

        {/* PDF Embed */}
        <div className="relative grow overflow-hidden bg-gray-500">
          <iframe
            src={viewUrl}
            className="block h-full w-full"
            title="Resume Preview"
            onLoad={() => setLoading(false)}
            allow="autoplay"
          />
        </div>
      </div>
    </WindowFrame>
  );
};

export default ResumeApp;
