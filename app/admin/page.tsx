import MedixaDashboard from '@/components/admin/medixa-dashboard';
import { requireStaff } from '@/lib/auth/require-admin';

export const instant = false;

export default async function AdminPage() {
  const authCheck = await requireStaff();
  const currentUser = authCheck.authorized ? authCheck.user : null;
  return <MedixaDashboard initialUser={currentUser} />;
}
