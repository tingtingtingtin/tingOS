import { MetadataRoute } from "next";
import { apps } from "@/data/apps";
import { tweets } from "@/data/tweets";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tingwu.dev";

  const appRoutes = apps
    .filter((app) => !app.url)
    .map((app) => ({
      url: `${baseUrl}${app.route}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  const tweetRoutes = tweets.map((tweet) => ({
    url: `${baseUrl}/experience/${tweet.id}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 1.0,
    },
    ...appRoutes,
    ...tweetRoutes,
  ];
}
