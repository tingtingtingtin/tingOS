import Link from 'next/link';
import { GitCommit, ExternalLink } from 'lucide-react';
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  title: string;
  description: string;
  repoUrl?: string;
  demoUrl?: string;
  commit: {
    message: string;
    date: string;
    url: string;
  } | null;
}

const ProjectCard = ({ title, description, repoUrl, demoUrl, commit }: ProjectCardProps) => {
  const formattedDate = commit 
    ? formatDistanceToNow(new Date(commit.date), { addSuffix: true })
    : '';

  return (
    <div className="flex flex-col h-full p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow dark:bg-gray-900 dark:border-gray-800">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
        <div className="flex space-x-3">
          {repoUrl && <Link href={repoUrl} target="_blank" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
            <FaGithub size={20} />
          </Link>}
          {demoUrl && (
            <Link href={demoUrl} target="_blank" className="text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ExternalLink size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-600 dark:text-gray-300 mb-6 grow">{description}</p>

      {/* Commit Footer */}
      {commit && ( 
      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800">
        <div className="flex items-start space-x-3 text-sm text-gray-500 dark:text-gray-400">
          <GitCommit className="w-5 h-5 shrink-0 mt-0.5 text-blue-500" />
            <div className="flex flex-col">
            
              <span className="font-medium text-gray-700 dark:text-gray-200 text-xs uppercase tracking-wider mb-1">
              Latest Activity
            </span>
            
              <>
                <Link href={commit.url} target="_blank" className="hover:underline hover:text-blue-500 transition-colors line-clamp-1">
                  {commit.message}
                </Link>
                <span className="text-xs text-gray-400 mt-1">{formattedDate}</span>
              </>
          </div>
        </div>
      </div>
      )}
    </div>
  );
}

export default ProjectCard;