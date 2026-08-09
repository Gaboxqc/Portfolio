import AdminListPage from '../../components/admin/AdminListPage'
import { ADMIN_PATHS } from '../../services/admin/resources'
import { adminLabel } from '../../utils/adminLabel'
import type { Certification } from '../../types'

const AdminCertificationsPage = () => (
  <AdminListPage<Certification>
    title='Certifications'
    path={ADMIN_PATHS.certifications}
    routeBase='/admin/certifications'
    rowKey={(record) => record.id}
    describe={(record) => adminLabel(record.translations)}
    emptyMessage='No certifications yet.'
    newLabel='New certification'
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
        header: 'Featured',
        cell: (record) => (record.is_main ? <span className='text-accent'>Featured</span> : '—'),
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

export default AdminCertificationsPage
