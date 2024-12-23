import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/auth/config';
import SurfslotLanding from '@/components/surfslot-landing';

export default async function HomePage() {
  const session = await getServerSession(authConfig);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div>
      <SurfslotLanding />
    </div>
  );
}