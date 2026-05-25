import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function GlobalSchedulePage() {
  const session = await getSession();

  // Enforce session
  if (!session) {
    redirect('/login');
  }

  // Retrieve projects with scripts and scenes
  const projects = await prisma.project.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      scripts: {
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

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col space-y-1.5 border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Global Production Schedule</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Track scene shooting sequences, script timelines, and production milestones across active film workspaces.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/10 border border-slate-800/50 rounded-2xl space-y-4">
          <span className="text-4xl block">📅</span>
          <h3 className="text-md font-bold text-slate-300">No active schedules</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You must create a project workspace and upload a script to generate a shooting schedule.
          </p>
          <Link
            href="/"
            className="inline-block px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg transition-all"
          >
            Create New Project
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {projects.map((project) => {
            const allScenes = project.scripts.flatMap((s) => s.scenes || []).sort((a, b) => a.sceneNumber - b.sceneNumber);

            return (
              <div
                key={project.id}
                className="bg-slate-900/25 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-slate-750/80 transition-all duration-300 flex flex-col"
              >
                {/* Project Header */}
                <div className="p-5 border-b border-slate-900 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 text-base">{project.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>🎬 Shoot Schedule</span>
                      <span>•</span>
                      <span className="text-indigo-400 font-semibold">
                        {allScenes.length} Scheduled Scenes
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/project/${project.id}?tab=scenes`}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-xs font-bold rounded-lg text-slate-300 hover:text-white text-center transition-colors"
                  >
                    View Breakdown ➔
                  </Link>
                </div>

                {/* Timeline content */}
                {allScenes.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <p className="text-xs text-slate-500">
                      No script uploaded. Please upload a PDF or TXT script file inside the project workspace to parse its scenes and generate a timeline.
                    </p>
                    <Link
                      href={`/project/${project.id}?tab=scripts`}
                      className="inline-block px-3 py-1.5 bg-violet-650 hover:bg-violet-600 text-white font-semibold text-[10px] rounded-lg transition-colors"
                    >
                      Upload Script
                    </Link>
                  </div>
                ) : (
                  <div className="p-6">
                    <div className="relative pl-6 border-l border-slate-800 space-y-6 py-2">
                      {allScenes.map((scene, idx) => {
                        const hasStoryboard = scene.storyboards && scene.storyboards.length > 0;
                        return (
                          <div key={scene.id} className="relative group">
                            {/* Point on the timeline */}
                            <span className="absolute -left-[31px] top-1 w-3 h-3 rounded-full border-2 border-slate-850 bg-slate-950 group-hover:border-violet-500 group-hover:bg-violet-500/20 transition-all duration-300"></span>

                            <div className="p-4 bg-slate-950/40 border border-slate-900 rounded-xl hover:border-slate-800 transition-all duration-200 space-y-2">
                              <div className="flex justify-between items-center flex-wrap gap-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold tracking-wider text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded border border-violet-500/10">
                                    SEQ #{idx + 1}
                                  </span>
                                  <span className="text-xs font-bold text-slate-200">
                                    Scene {scene.sceneNumber}: {scene.title}
                                  </span>
                                </div>
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                                  hasStoryboard 
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/10'
                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/10'
                                }`}>
                                  {hasStoryboard ? '✓ Storyboard Ready' : '⚠ Storyboard Pending'}
                                </span>
                              </div>
                              <p className="text-xs text-slate-450 leading-relaxed line-clamp-2">
                                {scene.description || 'No scene details parsed.'}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
