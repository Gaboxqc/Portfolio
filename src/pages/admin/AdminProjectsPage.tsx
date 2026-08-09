import AdminListPage from '../../components/admin/AdminListPage'
import { ADMIN_PATHS } from '../../services/admin/resources'
import { adminLabel } from '../../utils/adminLabel'
import type { Project } from '../../types'

const AdminProjectsPage = () => (
  <AdminListPage<Project>
    title='Projects'
    path={ADMIN_PATHS.projects}
    routeBase='/admin/projects'
    rowKey={(project) => project.id}
    describe={(project) => adminLabel(project.translations)}
    emptyMessage='No projects yet.'
    newLabel='New project'
    columns={[
      { header: 'Title', cell: (project) => adminLabel(project.translations) },
      { header: 'Year', cell: (project) => project.year },
      { header: 'Type', cell: (project) => project.project_type?.name ?? '—' },
      { header: 'Difficulty', cell: (project) => project.difficulty_level?.name ?? '—' },
      {
        header: 'Tags',
        cell: (project) =>
          project.tags.length > 0 ? project.tags.map((tag) => tag.name).join(', ') : '—',
      },
      {
        header: 'Featured',
        cell: (project) => (project.is_main ? <span className='text-accent'>Featured</span> : '—'),
      },
      {
        header: 'Languages',
        cell: (project) =>
          project.translations.length > 0
            ? project.translations.map((translation) => translation.language_code).join(', ')
            : '—',
      },
    ]}
  />
)

export default AdminProjectsPage
