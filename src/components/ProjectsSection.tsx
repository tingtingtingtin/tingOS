import { getLatestCommit, parseGitHubUrl } from '@/utils/githubCommits';
import { projects } from '@/data/projects';
import ProjectCard from '@/components/ProjectCard';

const ProjectsSection = async () => {
  const projectsWithCommits = await Promise.all(
    projects.map(async (project) => {
      if (!project.repoUrl) {
        return { ...project, commit: null };
      }

      const repoDetails = parseGitHubUrl(project.repoUrl);
      let commitData = null;

      if (repoDetails) {
        commitData = await getLatestCommit(repoDetails.owner, repoDetails.repo);
      }

      return {
        ...project,
        commit: commitData,
      };
    })
  );

  return (
    <section className="max-w-5xl mx-auto px-6 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projectsWithCommits.map((project, index) => (
          <ProjectCard
            key={`${project.title}-${index}`}
            title={project.title}
            description={project.description}
            repoUrl={project.repoUrl}
            demoUrl={project.demoUrl}
            commit={project.commit}
          />
        ))}
      </div>
    </section>
  );
}

export default ProjectsSection;