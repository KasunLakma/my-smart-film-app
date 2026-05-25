"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import StoryboardView from './StoryboardView';
import BudgetView from './BudgetView';
import CrewView from './CrewView';
import LocationView from './LocationView';

interface Storyboard {
  id: string;
  imageUrl: string;
  promptUsed: string | null;
  createdAt: Date | string;
}

interface Scene {
  id: string;
  sceneNumber: number;
  title: string;
  description: string | null;
  storyboards?: Storyboard[];
}

interface Script {
  id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: Date | string;
  scenes?: Scene[];
}

interface Budget {
  id: string;
  totalEstimated: number;
  totalSpent: number;
}

interface CrewMember {
  id: string;
  name: string;
  type: 'CAST' | 'CREW';
  roleName: string;
  email: string | null;
  phone: string | null;
}

interface Location {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface Project {
  id: string;
  title: string;
  description: string | null;
  createdAt: Date | string;
  scripts: Script[];
  budget: Budget | null;
  castCrew: CrewMember[];
  locations: Location[];
}

interface ProjectClientProps {
  project: Project;
}

export default function ProjectClient({ project }: ProjectClientProps) {
  const router = useRouter();
  const [scripts, setScripts] = useState<Script[]>(project.scripts);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'scripts' | 'scenes' | 'storyboards' | 'budget' | 'crew' | 'locations'>('scripts');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/project/${project.id}/script/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to upload script.');
      }

      setSuccess(true);
      setFile(null);
      
      // Reset input element
      const fileInput = document.getElementById('script-file') as HTMLInputElement;
      if (fileInput) fileInput.value = '';

      // Reload project details to show newly created scripts/scenes
      router.refresh();
      
      // Update local state if needed (or let server refresh handle it)
      // Since router.refresh() updates the server component, we can wait a bit and sync
      setTimeout(() => {
        window.location.reload(); // Force full reload to rebuild state from refreshed server data
      }, 1000);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setUploading(false);
    }
  };

  // Get all scenes from all uploaded scripts
  const allScenes = scripts.flatMap((s) => s.scenes || []).sort((a, b) => a.sceneNumber - b.sceneNumber);

  return (
    <div className="space-y-8">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <Link href="/" className="hover:text-violet-400 transition-colors">Dashboard</Link>
        <span>/</span>
        <span className="text-slate-400">Projects</span>
        <span>/</span>
        <span className="text-slate-300 truncate max-w-[200px]">{project.title}</span>
      </div>

      {/* Hero Overview Header */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/20 border border-slate-800/80 shadow-xl space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <h1 className="text-3xl font-extrabold text-slate-100">{project.title}</h1>
            <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
              {project.description || 'No description provided.'}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
            Active Project
          </span>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="flex border-b border-slate-900 overflow-x-auto whitespace-nowrap">
        <button
          onClick={() => setActiveTab('scripts')}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'scripts'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          📄 Uploaded Scripts ({scripts.length})
        </button>
        <button
          onClick={() => setActiveTab('scenes')}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'scenes'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          🎬 Seeded Scenes ({allScenes.length})
        </button>
        <button
          onClick={() => setActiveTab('storyboards')}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'storyboards'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          🖼️ Storyboard Board ({allScenes.filter((s) => s.storyboards && s.storyboards.length > 0).length}/{allScenes.length})
        </button>
        <button
          onClick={() => setActiveTab('budget')}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'budget'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          💰 Budget Tracker
        </button>
        <button
          onClick={() => setActiveTab('crew')}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'crew'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          👥 Cast & Crew ({project.castCrew?.length || 0})
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`px-6 py-3.5 text-sm font-bold border-b-2 cursor-pointer transition-all duration-200 ${
            activeTab === 'locations'
              ? 'border-violet-500 text-violet-400'
              : 'border-transparent text-slate-500 hover:text-slate-350'
          }`}
        >
          📍 Scouting Board ({project.locations?.length || 0})
        </button>
      </div>

      {/* Render View based on Active Tab */}
      {activeTab === 'storyboards' ? (
        <div className="w-full animate-fadeIn">
          <StoryboardView scenes={allScenes} />
        </div>
      ) : activeTab === 'budget' ? (
        <div className="w-full animate-fadeIn">
          <BudgetView projectId={project.id} initialBudget={project.budget} />
        </div>
      ) : activeTab === 'crew' ? (
        <div className="w-full animate-fadeIn">
          <CrewView projectId={project.id} initialCrew={project.castCrew} />
        </div>
      ) : activeTab === 'locations' ? (
        <div className="w-full animate-fadeIn">
          <LocationView projectId={project.id} initialLocations={project.locations} />
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left/Middle Columns: Tab content */}
          <div className="lg:col-span-2 space-y-6">
            {activeTab === 'scripts' && (
              <div className="space-y-4">
                {scripts.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/10 border border-slate-800/50 rounded-xl space-y-2">
                    <span className="text-2xl">📄</span>
                    <h4 className="text-sm font-bold text-slate-300">No scripts uploaded yet</h4>
                    <p className="text-xs text-slate-500">Upload a script in the sidebar panel to generate scenes and start storyboard design.</p>
                  </div>
                ) : (
                  scripts.map((script) => {
                    const uploadedDate = new Date(script.uploadedAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    });

                    return (
                      <div
                        key={script.id}
                        className="p-5 bg-slate-900/35 border border-slate-800/60 rounded-xl flex items-center justify-between shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <span className="text-3xl p-2.5 bg-slate-950 rounded-lg border border-slate-850">📄</span>
                          <div className="space-y-1">
                            <h4 className="font-bold text-slate-200 text-sm truncate max-w-[200px] sm:max-w-md">
                              {script.fileName}
                            </h4>
                            <div className="flex gap-3 text-[10px] text-slate-500">
                              <span>Uploaded {uploadedDate}</span>
                              <span>•</span>
                              <span className="text-violet-400 font-semibold">
                                {script.scenes?.length || 0} scenes parsed
                              </span>
                            </div>
                          </div>
                        </div>

                        <a
                          href={script.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3.5 py-2 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xs font-semibold rounded-lg text-slate-300 hover:text-white transition-colors"
                        >
                          Download
                        </a>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {activeTab === 'scenes' && (
              <div className="space-y-4">
                {allScenes.length === 0 ? (
                  <div className="p-8 text-center bg-slate-900/10 border border-slate-800/50 rounded-xl space-y-2">
                    <span className="text-2xl">🎬</span>
                    <h4 className="text-sm font-bold text-slate-300">No scenes parsed yet</h4>
                    <p className="text-xs text-slate-500">Upload a script first, and we will automatically parse it into shooting scenes.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allScenes.map((scene) => (
                      <div
                        key={scene.id}
                        className="p-4 bg-slate-900/20 border border-slate-800/40 rounded-xl space-y-2"
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-violet-400">
                            SCENE {scene.sceneNumber}
                          </span>
                          <span className="text-xs font-bold text-slate-200">
                            {scene.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-450 leading-relaxed">
                          {scene.description}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column: Upload Panel */}
          <div className="space-y-6">
            <div className="p-6 bg-slate-900/40 border border-slate-800/80 rounded-2xl shadow-xl space-y-5">
              <div className="space-y-1">
                <h3 className="text-md font-bold text-slate-200">Upload Production Script</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Add a PDF, TXT, or script file. We will automatically analyze it and seed your shooting scenes.
                </p>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 px-3 py-2.5 rounded-lg text-xs flex items-center gap-2">
                  <span>✅</span>
                  <span>Script uploaded successfully!</span>
                </div>
              )}

              <form onSubmit={handleUpload} className="space-y-4">
                <div className="border-2 border-dashed border-slate-800 hover:border-violet-500/40 rounded-xl p-6 bg-slate-950/40 transition-colors flex flex-col items-center justify-center text-center relative group">
                  <input
                    id="script-file"
                    type="file"
                    accept=".pdf,.txt,.doc,.docx"
                    disabled={uploading}
                    onChange={handleFileChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-3xl mb-2">📁</span>
                  <span className="text-xs font-bold text-slate-300 truncate max-w-full">
                    {file ? file.name : 'Choose script file...'}
                  </span>
                  <span className="text-[10px] text-slate-550 mt-1">
                    PDF, TXT up to 10MB
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Parsing script...</span>
                    </>
                  ) : (
                    <span>Upload & Analyze</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
