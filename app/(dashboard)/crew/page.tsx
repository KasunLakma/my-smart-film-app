import prisma from '../../../lib/prisma';
import { getSession } from '../../../lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function GlobalCrewPage() {
  const session = await getSession();

  // Enforce session
  if (!session) {
    redirect('/login');
  }

  // Retrieve projects and associated cast/crew members for the user
  const projects = await prisma.project.findMany({
    where: {
      userId: session.id,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      castCrew: true,
    },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col space-y-1.5 border-b border-slate-900 pb-4">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-100">Global Production Directory</h1>
        <p className="text-slate-400 text-sm leading-relaxed">
          Manage actor rosters and technical production staff across all active workspaces.
        </p>
      </div>

      {projects.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/10 border border-slate-800/50 rounded-2xl space-y-4">
          <span className="text-4xl block">👥</span>
          <h3 className="text-md font-bold text-slate-300">No projects found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You must create a project workspace before you can add actors or production crew members.
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
            const cast = project.castCrew.filter((c) => c.type === 'CAST');
            const crew = project.castCrew.filter((c) => c.type === 'CREW');

            return (
              <div
                key={project.id}
                className="bg-slate-900/25 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-slate-750/80 transition-all duration-300 flex flex-col"
              >
                {/* Project Section Header */}
                <div className="p-5 border-b border-slate-900 bg-slate-900/40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-bold text-slate-200 text-base">{project.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span>🎬 Active Production</span>
                      <span>•</span>
                      <span className="text-violet-400 font-semibold">
                        {project.castCrew.length} Members Total
                      </span>
                    </div>
                  </div>

                  <Link
                    href={`/project/${project.id}?tab=crew`}
                    className="w-full sm:w-auto px-4 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 text-xs font-bold rounded-lg text-slate-300 hover:text-white text-center transition-colors"
                  >
                    Manage Roster ➔
                  </Link>
                </div>

                {/* Directory Content */}
                {project.castCrew.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No actors or technical production members have been added to this roster yet.
                  </div>
                ) : (
                  <div className="p-6 grid gap-6 md:grid-cols-2">
                    {/* Cast List */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="p-1 bg-rose-500/10 text-rose-400 rounded-md">🎭</span>
                        Cast / Actors ({cast.length})
                      </h4>
                      {cast.length === 0 ? (
                        <p className="text-xs text-slate-600 italic pl-6">No actors assigned.</p>
                      ) : (
                        <div className="space-y-2.5 pl-2 border-l border-slate-900">
                          {cast.map((member) => (
                            <div key={member.id} className="text-xs flex justify-between py-1 border-b border-slate-900/40">
                              <span className="font-semibold text-slate-300">{member.name}</span>
                              <span className="text-slate-500 italic">{member.roleName}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Crew List */}
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-1.5">
                        <span className="p-1 bg-indigo-500/10 text-indigo-400 rounded-md">🛠️</span>
                        Technical Crew ({crew.length})
                      </h4>
                      {crew.length === 0 ? (
                        <p className="text-xs text-slate-600 italic pl-6">No crew members assigned.</p>
                      ) : (
                        <div className="space-y-2.5 pl-2 border-l border-slate-900">
                          {crew.map((member) => (
                            <div key={member.id} className="text-xs flex justify-between py-1 border-b border-slate-900/40">
                              <span className="font-semibold text-slate-300">{member.name}</span>
                              <span className="text-slate-500 italic">{member.roleName}</span>
                            </div>
                          ))}
                        </div>
                      )}
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
