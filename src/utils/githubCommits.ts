interface CommitData {
  message: string;
  date: string;
  url: string;
}

export async function getLatestCommit(owner: string, repo: string): Promise<CommitData | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
      },
      // don't use force-cache, rely on on-demand revalidation from revalidatePath
    });

    if (!res.ok) {
      console.log(`Failed to fetch commits for ${repo}: ${res.statusText}`);
      return null;
    }

    const data = await res.json();
    const latest = data[0];

    return {
      message: latest.commit.message,
      date: latest.commit.author.date,
      url: latest.html_url,
    };
  } catch (error) {
    console.log('Error fetching commit:', error);
    return null;
  }
}

export function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const regex = /github\.com\/([^\/]+)\/([^\/]+?)(?:\.git)?\/?$/;
    const match = url.match(regex);

    if (match && match[1] && match[2]) {
      return { owner: match[1], repo: match[2] };
    }
    return null;
  } catch (error) {
    console.error("Invalid GitHub URL:", url, ", error:", error);
    return null;
  }
}