import { tweets } from "@/data/tweets";
import { notFound } from "next/navigation";
import TweetDetailView from "@/components/experience/TweetDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

// Ensure static generation for all tweet IDs
export async function generateStaticParams() {
  return tweets.map((tweet) => ({
    id: tweet.id,
  }));
}

export default async function TweetDetail({ params }: PageProps) {
  const { id: tweetId } = await params;

  const tweet = tweets.find((t) => t.id === tweetId);

  if (!tweet) {
    notFound();
  }

  return <TweetDetailView tweet={tweet} />;
}
