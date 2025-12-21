export interface GitHubProfile {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
  location: string;
}

export async function getUserProfile(
  username: string,
): Promise<GitHubProfile | null> {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github.v3+json",
      },
      next: { revalidate: 3600 }, // Cache profile data for 1 hour
    });

    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error("Error fetching profile:", error);
    return null;
  }
}
