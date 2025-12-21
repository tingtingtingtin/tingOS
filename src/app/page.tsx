import GithubProfile from '@/components/GitHubProfile';
import ProjectsSection from '@/components/ProjectsSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <GithubProfile />
      <ProjectsSection />
    </main>
  );
}