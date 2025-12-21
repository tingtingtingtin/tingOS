import GithubProfile from '@/components/projects/GitHubProfile';
import ProjectsSection from '@/components/projects/ProjectsSection';
import WindowFrame from '@/components/WindowFrame';

const ProjectsApp = () => {
  return (
    <WindowFrame id="projects" title="GitHub - Projects Explorer">
      <div className="p-4 md:p-6">
        <GithubProfile />
        <ProjectsSection />
      </div>
    </WindowFrame>
  );
}

export default ProjectsApp;