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
      budget: true,
      castCrew: true,
      locations: true,
      scripts: {
        orderBy: {
          uploadedAt: 'desc',
        },
        include: {
          scenes: {
            orderBy: {
              sceneNumber: 'asc',
            },
            include: {
              storyboards: true,
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

  // Format project dates and Decimal objects for serialization (to standard JS primitives)
  const formattedProject = {
    ...project,
    createdAt: project.createdAt.toISOString(),
    budget: project.budget
      ? {
          ...project.budget,
          totalEstimated: Number(project.budget.totalEstimated),
          totalSpent: Number(project.budget.totalSpent),
        }
      : null,
    castCrew: project.castCrew.map((c) => ({
      ...c,
    })),
    locations: project.locations.map((l) => ({
      ...l,
    })),
    scripts: project.scripts.map((script) => ({
      ...script,
      uploadedAt: script.uploadedAt.toISOString(),
      scenes: script.scenes.map((scene) => ({
        ...scene,
        storyboards: scene.storyboards.map((sb) => ({
          ...sb,
          createdAt: sb.createdAt.toISOString(),
        })),
      })),
    })),
  };

  return <ProjectClient project={formattedProject} />;
}
