import prisma from '../../../../lib/prisma';
import { getSession } from '../../../../lib/auth';
import { redirect } from 'next/navigation';
import ProjectClient from './ProjectClient';

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  // Enforce session
  if (!session) {
    redirect('/login');
  }

  const { id } = await params;

  // Retrieve the project details from the database (ensuring user owns it)
  const project = await prisma.project.findFirst({
    where: {
      id,
      userId: session.id,
    },
    include: {
      scripts: {
        orderBy: {
          uploadedAt: 'desc',
        },
        include: {
          scenes: {
            orderBy: {
              sceneNumber: 'asc',
            },
          },
        },
      },
    },
  });

  // If the project doesn't exist or isn't accessible, redirect back to the main dashboard
  if (!project) {
    redirect('/');
  }

  // Format project dates for serialization (Date to ISO string)
  const formattedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    scripts: project.scripts.map((script) => ({
      ...script,
      uploadedAt: script.uploadedAt.toISOString(),
      scenes: script.scenes.map((scene) => ({
        ...scene,
      })),
    })),
  };

  return <ProjectClient project={formattedProject} />;
}
