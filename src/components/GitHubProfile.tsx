import { getUserProfile } from '@/utils/gitHubUser';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Users, Book } from 'lucide-react';
import { FaGithub } from 'react-icons/fa';

const GithubProfile = async () => {
  const username = "tingtingtingtin";
  const profile = await getUserProfile(username);

  if (!profile) return null;

  return (
    <section className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 mb-12">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Avatar */}
          <div className="shrink-0">
            <Link 
              href={profile.html_url} 
              target="_blank" 
              className="text-gray-500 hover:text-blue-500 text-lg mb-2 inline-block font-mono"
            >
              <Image
                src={profile.avatar_url}
                alt={profile.name}
                width={128}
                height={128}
                className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                priority
              />
            </Link>
          </div>

          {/* User Info */}
          <div className="grow text-center md:text-left">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Projects</h1>
            <Link 
              href={profile.html_url} 
              target="_blank" 
              className="text-gray-500 hover:text-blue-500 text-lg mb-2 inline-block font-mono"
            >
              @{profile.login}
            </Link>

            {/* Stats Row */}
            <div className="flex flex-wrap justify-center md:justify-start gap-6 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-1">
                <Book size={16} />
                <span className="font-semibold text-gray-900 dark:text-white">{profile.public_repos}</span>
                <span>Repositories</span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={16} />
                <span className="font-semibold text-gray-900 dark:text-white">{profile.followers}</span>
                <span>Followers</span>
              </div>
              <div className="flex items-center gap-1">
                 <span className="font-semibold text-gray-900 dark:text-white">{profile.following}</span>
                 <span>Following</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default GithubProfile;