import './admin.css';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = { title: 'Administrácia – Farnosť Lokca' };

export default function AdminLayout({ children }) {
  return <AdminShell>{children}</AdminShell>;
}
