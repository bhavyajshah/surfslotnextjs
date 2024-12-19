import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import { LocationForm } from '@/components/admin/location-form';

export default async function AdminPage() {
  const session = await getServerSession(authConfig);
  
  if (!session?.user?.email || session.user.email !== 'websitemaker923@gmail.com') {
    redirect('/');
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Add New Location</h2>
        <LocationForm />
      </div>
    </div>
  );
}