import { getUserProfile } from "@/utils/gitHubUser";
import Link from "next/link";
import Image from "next/image";
import { Users, Book } from "lucide-react";

const GithubProfile = async () => {
  const username = "tingtingtingtin";
  const profile = await getUserProfile(username);

  if (!profile) return null;

  return (
    <section className="mb-12 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <div className="flex flex-col items-center gap-6 md:flex-row md:items-start">
          {/* Avatar */}
          <div className="shrink-0">
            <Link
              href={profile.html_url}
              target="_blank"
              className="mb-2 inline-block font-mono text-lg text-gray-500 hover:text-blue-500"
            >
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                width={128}
                height={128}
                className="h-32 w-32 rounded-full border-4 border-white shadow-lg dark:border-gray-800"
                priority
              />
            </Link>
          </div>

          {/* User Info */}
          <div className="grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Projects
            </h1>
            <Link
              href={profile.html_url}
              target="_blank"
              className="mb-2 inline-block font-mono text-lg text-gray-500 hover:text-blue-500"
            >
              @{profile.login}
            </Link>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600 md:justify-start dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Book size={16} />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {profile.public_repos}
                </span>
                <span>Repositories</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {profile.followers}
                </span>
                <span>Followers</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-900 dark:text-white">
                  {profile.following}
                </span>
                <span>Following</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GithubProfile;
