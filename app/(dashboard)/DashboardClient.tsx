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
    <div className="space-y-8">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-6 border-b border-slate-900">
        <div className="relative w-full sm:max-w-xs">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-500">
            🔍
          </span>
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-violet-500 rounded-lg outline-none text-sm text-slate-100 placeholder-slate-500 transition-all duration-200"
          />
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-lg shadow-violet-600/20 hover:shadow-violet-600/30 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          <span>➕</span>
          <span>Create New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-slate-900/20 border border-dashed border-slate-800/80 rounded-2xl text-center space-y-4">
          <span className="text-4xl">🎬</span>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-200">No projects found</h3>
            <p className="text-sm text-slate-500 max-w-sm">
              {searchQuery ? "No matches for your search query." : "Get started by creating your first film production project."}
            </p>
          </div>
          {!searchQuery && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-sm font-semibold rounded-lg text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
            >
              Create Project
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
                className="group relative flex flex-col justify-between p-6 bg-slate-900/40 hover:bg-slate-900/80 border border-slate-800/60 hover:border-violet-500/50 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-violet-600/5 transition-all duration-300"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 border border-violet-500/20">
                      Pre-Production
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Created {dateStr}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-200 group-hover:text-violet-400 transition-colors line-clamp-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-slate-400 line-clamp-2 leading-relaxed">
                    {project.description || 'No description provided.'}
                  </p>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-slate-800/60 mt-6 text-xs text-slate-500">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                      📄 <strong className="text-slate-400">{project.scripts?.length || 0}</strong> script(s)
                    </span>
                    <span className="flex items-center gap-1">
                      👥 <strong className="text-slate-400">{project.castCrew?.length || 0}</strong> crew
                    </span>
                  </div>
                  <span className="text-violet-500 opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                    Open ➔
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Create Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">Create New Project</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-350 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="title">
                  Project Title
                </label>
                <input
                  id="title"
                  name="title"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                  placeholder="e.g. Inception Sequel"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  disabled={loading}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200 resize-none"
                  placeholder="Summarize the logline, premise, or production scope..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
