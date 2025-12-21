import GithubProfile from '@/components/GitHubProfile';
import ProjectsSection from '@/components/ProjectsSection';
import Link from 'next/link';
import { X } from 'lucide-react';

export default function ProjectsApp() {

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <div className="bg-gray-200 dark:bg-gray-800 p-2 flex justify-between items-center border-b border-gray-300 dark:border-gray-700">
        <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 px-2">
          Projects Explorer
        </div>
        <Link 
          href="/" 
          className="p-1 hover:bg-red-500 hover:text-white rounded transition-colors text-gray-500"
          title="Close App (Return to Desktop)"
        >
          <X size={18} />
        </Link>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-auto">
        <GithubProfile />
        <ProjectsSection />
      </div>
    </div>
  );
}