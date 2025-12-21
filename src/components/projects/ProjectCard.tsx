import Link from "next/link";
import { GitCommit, ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

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
  tech?: string[];
}

const ProjectCard = ({
  title,
  description,
  repoUrl,
  demoUrl,
  commit,
  tech = [],
}: ProjectCardProps) => {
  const formattedDate = commit
    ? formatDistanceToNow(new Date(commit.date), { addSuffix: true })
    : "";

  return (
    <div className="flex h-full flex-col rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900">
      {/* Header */}
      <div className="mb-4 flex items-start justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {title}
        </h3>
        <div className="flex space-x-3">
          {repoUrl && (
            <Link
              href={repoUrl}
              target="_blank"
              className="text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              <FaGithub size={20} />
            </Link>
          )}
          {demoUrl && (
            <Link
              href={demoUrl}
              target="_blank"
              className="text-gray-500 transition-colors hover:text-gray-900 dark:hover:text-white"
            >
              <ExternalLink size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="mb-4 grow text-gray-600 dark:text-gray-300">
        {description}
      </p>

      {/* Tech pills */}
      {tech && tech.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-100 px-2 py-1 text-sm text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
            >
              {t}
            </span>
          ))}
        </div>
      )}

      {/* Commit Footer */}
      {commit && (
        <div className="mt-auto border-t border-gray-100 pt-4 dark:border-gray-800">
          <div className="flex items-start space-x-3 text-sm text-gray-500 dark:text-gray-400">
            <GitCommit className="mt-0.5 h-5 w-5 shrink-0 text-blue-500" />
            <div className="flex flex-col">
              <span className="mb-1 text-xs font-medium tracking-wider text-gray-700 uppercase dark:text-gray-200">
                Latest Activity
              </span>

              <>
                <Link
                  href={commit.url}
                  target="_blank"
                  className="line-clamp-1 transition-colors hover:text-blue-500 hover:underline"
                >
                  {commit.message}
                </Link>
                <span className="mt-1 text-xs text-gray-400">
                  {formattedDate}
                </span>
              </>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;
