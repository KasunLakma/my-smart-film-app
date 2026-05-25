import prisma from '../../lib/prisma';
import { getSession } from '../../lib/auth';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const session = await getSession();

  // Enforce session
  if (!session) {
    redirect('/login');
  }

  // Fetch the projects associated with the logged-in user
  const projects = await prisma.project.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      scripts: true,
      castCrew: true,
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Active Productions</h1>
        <p className="text-slate-450 text-sm">
          Monitor your storyboards, locations, budgets, and scripts in real-time.
        </p>
      </div>

      <DashboardClient initialProjects={projects} />
    </div>
  );
}
