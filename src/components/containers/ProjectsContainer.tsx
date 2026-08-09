import ProjectCard from '../cards/ProjectCard'
import AsyncCollection from '../ui/AsyncCollection'
import useLanguage from '../../hooks/useLanguage'
import getTranslation from '../../utils/getTranslation'
import type { Project } from '../../types'

interface ProjectsContainerProps {
  projects?: Project[]
  loading?: boolean
  error?: string | null
}

function ProjectsContainer({
  projects = [],
  loading = false,
  error = null,
}: ProjectsContainerProps) {
  const { locale } = useLanguage()

  return (
    <AsyncCollection items={projects} loading={loading} error={error} emptyKey='state.no-projects'>
      {(project) => {
        const translation = getTranslation(project.translations, locale)
        return (
          <ProjectCard
            title={translation.title}
            description={translation.description ?? ''}
            year={project.year}
            difficulty={project.difficulty_level?.name ?? ''}
            type={project.project_type?.name ?? ''}
            tags={project.tags}
            image={project.image_url}
            gitUrl={project.git_url}
            projectUrl={project.deploy_url}
          />
        )
      }}
    </AsyncCollection>
  )
}

export default ProjectsContainer
