import { tweets } from "@/data/tweets";
import WindowFrame from "@/components/WindowFrame";
import { ArrowLeft, MessageCircle, Repeat2, Heart, Share } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import Image from "next/image";

interface PageProps {
  params: { id: string };
}

// Ensure static generation for all tweet IDs
export async function generateStaticParams() {
  return tweets.map((tweet) => ({
    id: tweet.id,
  }));
}

const TweetDetail = async ({ params }: PageProps) => {
  const resolvedParams = await params;
  const tweetId = resolvedParams.id;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    notFound();
  }

  return (
    <WindowFrame id="experiences" title="Xperiences">
      <div className="min-h-full bg-white pb-20 dark:bg-black">
        {/* Sticky Header with Back Button */}
        <div className="sticky top-0 z-10 flex items-center gap-6 border-b border-gray-200 bg-white/80 px-4 py-3 backdrop-blur-md dark:border-gray-800 dark:bg-black/80">
          <Link
            href="/experience"
            className="rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </Link>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Post
          </h2>
        </div>

        {/* Main Tweet (Expanded) */}
        <div className="p-4">
          {/* User Info */}
          <div className="mb-4 flex gap-3">
            <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
              <Image
                src={tweet.avatar}
                alt={tweet.name}
                width={48}
                height={48}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col">
              <span className="flex flex-col md:flex-row">
                <span className="text-base font-bold text-gray-900 dark:text-white">
                  {tweet.name}
                </span>
                <p className="mb-1 text-base text-gray-500 md:ml-4">
                  {tweet.role}
                </p>
              </span>
              <span className="text-sm text-gray-500">{tweet.handle}</span>
            </div>
          </div>

          {/* Main Content */}
          <p className="mb-4 text-xl leading-normal text-gray-900 dark:text-white">
            {tweet.content}
          </p>

          {/* Timestamp & Role */}
          <div className="mb-4 border-b border-gray-200 pb-4 dark:border-gray-800">
            <p className="text-sm text-gray-500">
              {tweet.date} · Xperiences for LG Smart Fridge
            </p>
          </div>

          {/* Stats */}
          <div className="mb-4 flex gap-6 border-b border-gray-200 pb-4 text-sm text-gray-500 dark:border-gray-800">
            <p>
              <span className="font-bold text-gray-900 dark:text-white">
                {tweet.stats.retweets}
              </span>{" "}
              Retweets
            </p>
            <p>
              <span className="font-bold text-gray-900 dark:text-white">
                {tweet.stats.likes}
              </span>{" "}
              Likes
            </p>
          </div>

          {/* Action Icons */}
          <div className="mb-4 flex justify-around border-b border-gray-200 pb-4 text-gray-500 dark:border-gray-800">
            <MessageCircle
              size={24}
              className="cursor-pointer hover:text-blue-500"
            />
            <Repeat2
              size={24}
              className="cursor-pointer hover:text-green-500"
            />
            <Heart size={24} className="cursor-pointer hover:text-pink-500" />
            <Share size={24} className="cursor-pointer hover:text-blue-500" />
          </div>
        </div>

        {/* The "Replies" */}
        <div className="px-4">
          <h2 className="text-lg font-bold">Details</h2>
          {tweet.details.map((detail, index) => (
            <div
              key={index}
              className="flex gap-3 border-b border-gray-100 py-4 dark:border-gray-800"
            >
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-700">
                  <Image
                    src={tweet.avatar}
                    alt={tweet.name}
                    width={48}
                    height={48}
                    className="object-cover"
                  />
                </div>
                {/* Thread Line */}
                {index !== tweet.details.length - 1 && (
                  <div className="mt-2 w-0.5 grow bg-gray-200 dark:bg-gray-800" />
                )}
              </div>

              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">
                    {tweet.name}
                  </span>
                  <span className="text-sm text-gray-500">{tweet.handle}</span>
                </div>
                <p className="text-base leading-relaxed text-gray-800 dark:text-gray-200">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </WindowFrame>
  );
};

export default TweetDetail;
