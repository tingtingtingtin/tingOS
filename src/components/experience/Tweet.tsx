import Link from "next/link";
import {
  MessageCircle,
  Repeat2,
  Heart,
  Share,
  MoreHorizontal,
} from "lucide-react";
import { TweetData } from "@/data/tweets";
import Image from "next/image";

const Tweet = ({ data }: { data: TweetData }) => {
  return (
    <Link
      href={`/experience/${data.id}`}
      className="block cursor-pointer border-b border-gray-200 p-4 transition-colors hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-white/5"
    >
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="shrink-0">
          <div className="h-12 w-12 overflow-hidden rounded-full border border-gray-200 bg-gray-300 dark:border-gray-700 dark:bg-gray-700">
            <Image
              src={data.avatar}
              alt={data.name}
              width={48}
              height={48}
              className="object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 truncate text-sm">
              <span className="truncate font-bold text-gray-900 dark:text-white">
                {data.name}
              </span>
              <span className="truncate text-gray-500">{data.handle}</span>
              <span className="px-1 text-gray-500">·</span>
              <span className="text-gray-500 hover:underline">{data.date}</span>
            </div>
            <button className="text-gray-400 hover:text-blue-500">
              <MoreHorizontal size={18} />
            </button>
          </div>

          {/* Role/Subtitle */}
          <div className="mb-1 text-sm font-semibold text-gray-700 dark:text-gray-300">
            {data.role}
          </div>

          {/* Body */}
          <p className="mb-1 text-base leading-normal whitespace-pre-wrap text-gray-900 dark:text-white">
            {data.content}
          </p>
          <p className="mb-2 text-sm leading-normal text-blue-600 hover:underline">
            Show More
          </p>

          {/* Footer Actions (Visual only) */}
          <div className="mt-3 flex max-w-md justify-between text-sm text-gray-500">
            <div className="group flex items-center gap-2 transition-colors hover:text-blue-500">
              <div className="rounded-full p-2 group-hover:bg-blue-500/10">
                <MessageCircle size={16} />
              </div>
              <span>{data.stats.replies}</span>
            </div>
            <div className="group flex items-center gap-2 transition-colors hover:text-green-500">
              <div className="rounded-full p-2 group-hover:bg-green-500/10">
                <Repeat2 size={18} />
              </div>
              <span>{data.stats.retweets}</span>
            </div>
            <div className="group flex items-center gap-2 transition-colors hover:text-pink-500">
              <div className="rounded-full p-2 group-hover:bg-pink-500/10">
                <Heart size={18} />
              </div>
              <span>{data.stats.likes}</span>
            </div>
            <div className="group flex items-center gap-2 transition-colors hover:text-blue-500">
              <div className="rounded-full p-2 group-hover:bg-blue-500/10">
                <Share size={18} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Tweet;
