"use client";

import WindowFrame from "@/components/WindowFrame";
import { Download, ExternalLink } from "lucide-react";

export default function ResumeApp() {
  return (
    <WindowFrame id="resume" title="resume.pdf - PDF Viewer">
      <div className="flex h-full flex-col">
        {/* PDF Viewer Toolbar */}
        <div className="flex items-center justify-end gap-2 border-b border-gray-200 bg-gray-100 p-2 dark:border-gray-700 dark:bg-gray-800">
          <a
            href="/resume.pdf"
            download="My_Resume.pdf"
            className="flex items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 text-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:hover:bg-gray-600"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
          <a
            href="/resume.pdf"
            target="_blank"
            className="flex items-center gap-2 rounded bg-blue-600 px-3 py-1.5 text-sm text-white transition-colors hover:bg-blue-500"
          >
            <ExternalLink size={14} />
            <span>Open Original</span>
          </a>
        </div>

        {/* The PDF Embed */}
        <div className="relative grow overflow-hidden bg-gray-500">
          {/* Object tag is slightly better than iframe for PDFs as it handles fallbacks better */}
          <object
            data="/resume.pdf"
            type="application/pdf"
            className="block h-full w-full"
          >
            {/* Fallback for mobile browsers that don't support inline PDF */}
            <div className="flex h-full flex-col items-center justify-center bg-white p-6 text-center dark:bg-gray-900">
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                This browser does not support inline PDFs.
              </p>
              <a
                href="/resume.pdf"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Download PDF
              </a>
            </div>
          </object>
        </div>
      </div>
    </WindowFrame>
  );
}
