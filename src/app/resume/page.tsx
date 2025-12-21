"use client";

import WindowFrame from '@/components/WindowFrame';
import { Download, ExternalLink } from 'lucide-react';

export default function ResumeApp() {
  return (
    <WindowFrame id="resume" title="resume.pdf - PDF Viewer">
      <div className="flex flex-col h-full">
        {/* PDF Viewer Toolbar */}
        <div className="bg-gray-100 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 flex gap-2 items-center justify-end">
          <a 
            href="/resume.pdf" 
            download="My_Resume.pdf"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
          >
            <Download size={14} />
            <span>Download</span>
          </a>
          <a
            href="/resume.pdf" 
            target="_blank"
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          >
            <ExternalLink size={14} />
            <span>Open Original</span>
          </a>
        </div>

        {/* The PDF Embed */}
        <div className="grow bg-gray-500 overflow-hidden relative">
          {/* Object tag is slightly better than iframe for PDFs as it handles fallbacks better */}
          <object 
            data="/resume.pdf" 
            type="application/pdf" 
            className="w-full h-full block"
          >
            {/* Fallback for mobile browsers that don't support inline PDF */}
            <div className="flex flex-col items-center justify-center h-full bg-white dark:bg-gray-900 text-center p-6">
              <p className="mb-4 text-gray-600 dark:text-gray-300">
                This browser does not support inline PDFs.
              </p>
              <a 
                href="/resume.pdf" 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
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