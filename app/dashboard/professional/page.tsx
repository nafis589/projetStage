"use client";
import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function ProfessionalDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      router.push('/login');
      return;
    }

    if (session.user.role !== 'professional') {
      router.push('/dashboard/client');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <div>Chargement...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Tableau de bord Professionnel</h1>
      {/* Ajoutez ici le contenu du tableau de bord professionnel */}
    </div>
  );
}