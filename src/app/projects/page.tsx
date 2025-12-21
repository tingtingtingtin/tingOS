import GithubProfile from '@/components/GitHubProfile';
import ProjectsSection from '@/components/ProjectsSection';
import Header from '@/components/Header';

const ProjectsApp = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      <Header id="projects" title='Project Explorer'/>
      <div className="flex-1 overflow-auto">
        <GithubProfile />
        <ProjectsSection />
      </div>
    </div>
  );
}

export default ProjectsApp;