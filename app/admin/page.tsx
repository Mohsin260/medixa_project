import MedixaDashboard from '@/components/admin/medixa-dashboard';
import { requireAdmin } from '@/lib/auth/require-admin';

export const instant = false;

export default async function AdminPage() {
  const authCheck = await requireAdmin();
  const currentUser = authCheck.authorized ? authCheck.user : null;
  return <MedixaDashboard initialUser={currentUser} />;
}
