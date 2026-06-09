"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | string;
  scripts?: any[];
  castCrew?: any[];
}

interface DashboardClientProps {
  initialProjects: Project[];
}

export default function DashboardClient({ initialProjects }: DashboardClientProps) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Filter projects by title
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.title.trim()) {
      setError('Project title is required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/project/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create project.');
      }

      // Add the new project to state
      setProjects((prev) => [data.project, ...prev]);
      setFormData({ title: '', description: '' });
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 relative z-10">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-white/[0.05]">
        <div className="relative w-full sm:max-w-xs group">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-zinc-500 group-focus-within:text-purple-400 transition-colors duration-300">
            🔍
          </span>
          <input
            type="text"
            placeholder="SEARCH PRODUCTIONS..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950/40 backdrop-blur-2xl border border-white/[0.08] hover:border-white/[0.12] focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5 rounded-full outline-none text-xs text-zinc-150 placeholder-zinc-500 transition-all duration-300 font-mono tracking-wider shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-fuchsia-700 hover:from-purple-600 hover:via-indigo-600 hover:to-fuchsia-600 text-white font-bold tracking-widest text-[9px] font-mono rounded-full glow-pill-shadow transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2 border border-white/[0.1]"
        >
          <span>➕</span>
          <span>CREATE PRODUCTION</span>
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="spatial-glass max-w-2xl mx-auto my-4 p-12 text-center space-y-6 rounded-3xl hover:border-purple-500/20 transition-all duration-500 ease-out">
          <span className="text-5xl drop-shadow-[0_4px_20px_rgba(168,85,247,0.45)]">🎬</span>
          <div className="space-y-2">
            <h3 className="text-xs font-black tracking-[0.25em] text-white uppercase font-mono">NO ACTIVE PRODUCTIONS</h3>
            <p className="text-xs text-zinc-450 max-w-md mx-auto leading-relaxed">
              {searchQuery ? "No matches found for your search query. Try typing another production title." : "Ready to direct your next masterpiece? Create your first production to start organizing scripts, crew, and shoot locations."}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-white/[0.08] hover:border-purple-500/30 text-[8px] font-mono font-bold tracking-widest uppercase rounded-full text-purple-300 hover:text-purple-200 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-md"
            >
              GET STARTED
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => {
            const dateStr = new Date(project.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group relative flex flex-col justify-between p-6 aspect-[16/9] spatial-glass spatial-hover-glow rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Subtle Cinematic Lens vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none z-0" />
                
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-start">
                    <span className="text-[8px] font-bold tracking-[0.2em] uppercase px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 shadow-[0_0_12px_rgba(168,85,247,0.1)] font-mono">
                      PRE-PROD
                    </span>
                    <span className="text-[8px] text-zinc-500 font-mono tracking-wider">
                      {dateStr}
                    </span>
                  </div>
                  <h3 className="text-sm font-black tracking-widest text-zinc-100 uppercase group-hover:text-purple-350 transition-colors duration-300 line-clamp-1 mt-1 font-mono">
                    {project.title}
                  </h3>
                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/[0.05] text-[9px] text-zinc-500 font-mono tracking-wide relative z-10">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      📄 <strong className="text-zinc-300">{project.scripts?.length || 0}</strong> SCRIPTS
                    </span>
                    <span className="flex items-center gap-1">
                      👥 <strong className="text-zinc-300">{project.castCrew?.length || 0}</strong> CREW
                    </span>
                  </div>
                  <span className="text-purple-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-300 font-bold tracking-widest uppercase">
                    OPEN ➔
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-3xl border border-white/[0.08] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.85)] rounded-3xl p-6 space-y-6 transition-all duration-300">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
              <h3 className="text-sm font-black tracking-[0.2em] text-white uppercase font-mono">CREATE PRODUCTION</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-500 hover:text-zinc-300 text-lg transition-colors duration-205 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-rose-500/10 border border-rose-500/20 text-rose-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2 shadow-[0_0_15px_rgba(244,63,94,0.05)] font-mono">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono" htmlFor="title">
                  PROJECT TITLE
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5 outline-none text-zinc-150 placeholder-zinc-500 text-xs transition-all duration-300 font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                  placeholder="E.G. INCEPTION SEQUEL"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-400 font-mono" htmlFor="description">
                  DESCRIPTION
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  disabled={loading}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-2xl bg-zinc-950/60 border border-white/[0.06] focus:border-purple-500/40 focus:ring-4 focus:ring-purple-500/5 outline-none text-zinc-150 placeholder-zinc-500 text-xs transition-all duration-300 resize-none font-mono shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
                  placeholder="Summarize the logline, premise, or production scope..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-5 border-t border-white/[0.05]">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-[9px] font-mono font-bold tracking-widest uppercase rounded-full text-zinc-450 hover:text-zinc-200 hover:bg-white/5 border border-transparent transition-all duration-300 cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white font-bold tracking-widest text-[9px] font-mono rounded-full glow-pill-shadow border border-white/[0.1] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'CREATING...' : 'CREATE PROJECT'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
