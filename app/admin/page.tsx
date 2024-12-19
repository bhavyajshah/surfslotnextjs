import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { AdminDashboard } from '@/components/admin/dashboard';

export default async function AdminPage() {
  const session = await getServerSession(authConfig);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Only allow admin access
  if (session.user.email !== 'websitemaker923@gmail.com') {
    redirect('/dashboard');
  }

  return <AdminDashboard />;
}