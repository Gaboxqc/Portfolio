import AdminListPage from '../../components/admin/AdminListPage'
import { ADMIN_PATHS } from '../../services/admin/resources'
import { adminLabel } from '../../utils/adminLabel'
import type { Course } from '../../types'

const AdminCoursesPage = () => (
  <AdminListPage<Course>
    title='Courses'
    path={ADMIN_PATHS.courses}
    routeBase='/admin/courses'
    rowKey={(record) => record.id}
    describe={(record) => adminLabel(record.translations)}
    emptyMessage='No courses yet.'
    newLabel='New course'
    columns={[
      { header: 'Title', cell: (record) => adminLabel(record.translations) },
      { header: 'Year', cell: (record) => record.year },
      { header: 'Academy', cell: (record) => record.academy?.name ?? '—' },
      { header: 'Category', cell: (record) => record.category?.name ?? '—' },
      {
        header: 'Tags',
        cell: (record) =>
          record.tags.length > 0 ? record.tags.map((tag) => tag.name).join(', ') : '—',
      },
      {
        header: 'Languages',
        cell: (record) =>
          record.translations.length > 0
            ? record.translations.map((translation) => translation.language_code).join(', ')
            : '—',
      },
    ]}
  />
)

export default AdminCoursesPage
