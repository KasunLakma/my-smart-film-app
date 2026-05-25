"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

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

interface StoryboardViewProps {
  scenes: Scene[];
}

export default function StoryboardView({ scenes }: StoryboardViewProps) {
  const router = useRouter();
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});
  const [errorMap, setErrorMap] = useState<Record<string, string | null>>({});

  const handleGenerate = async (scene: Scene) => {
    const sceneId = scene.id;
    setLoadingMap((prev) => ({ ...prev, [sceneId]: true }));
    setErrorMap((prev) => ({ ...prev, [sceneId]: null }));

    try {
      const response = await fetch('/api/storyboard/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sceneId,
          description: scene.description || '',
          sceneNumber: scene.sceneNumber,
          title: scene.title,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate storyboard frame.');
      }

      // Success! Refresh the route data
      router.refresh();
      
      // Delay full reload slightly to let router.refresh write back to server page
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setErrorMap((prev) => ({ ...prev, [sceneId]: err.message || 'An error occurred.' }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [sceneId]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col space-y-1.5 border-b border-slate-900 pb-4">
        <h3 className="text-lg font-bold text-slate-200">Director's Storyboard Board</h3>
        <p className="text-xs text-slate-500 leading-relaxed">
          Create visual concept frames for each scene in your production script using generative film styling.
        </p>
      </div>

      {scenes.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/10 border border-slate-800/50 rounded-xl space-y-3">
          <span className="text-3xl">🎬</span>
          <h4 className="text-sm font-bold text-slate-300 font-sans">No scenes available for storyboarding</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Please make sure you have uploaded a script first so scenes can be analyzed and populated automatically.
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {scenes.map((scene) => {
            const isLoading = loadingMap[scene.id] || false;
            const error = errorMap[scene.id] || null;
            const storyboard = scene.storyboards && scene.storyboards[0];

            return (
              <div
                key={scene.id}
                className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg grid md:grid-cols-2 group hover:border-slate-700/80 transition-all duration-300"
              >
                {/* Left Side: Scene Details */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-6 border-b md:border-b-0 md:border-r border-slate-800/60">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold tracking-widest text-violet-400 uppercase">
                        Scene {scene.sceneNumber}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        Script ID: {scene.id.slice(0, 8)}...
                      </span>
                    </div>
                    <h4 className="text-lg font-extrabold text-slate-200">
                      {scene.title}
                    </h4>
                    <p className="text-xs text-slate-450 leading-relaxed font-mono bg-slate-950/40 p-4 border border-slate-900/60 rounded-xl">
                      "{scene.description || 'No description provided.'}"
                    </p>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-3.5 py-2.5 rounded-lg text-xs flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{error}</span>
                    </div>
                  )}

                  <div className="pt-2">
                    <button
                      onClick={() => handleGenerate(scene)}
                      disabled={isLoading}
                      className="px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-750 text-xs font-semibold rounded-lg text-slate-200 hover:text-white transition-all duration-200 cursor-pointer disabled:opacity-50 flex items-center gap-2"
                    >
                      {isLoading ? (
                        <>
                          <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>AI is painting...</span>
                        </>
                      ) : storyboard ? (
                        <>
                          <span>🔄</span>
                          <span>Regenerate Frame</span>
                        </>
                      ) : (
                        <>
                          <span>🎨</span>
                          <span>Generate Frame</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {/* Right Side: Storyboard Frame Visualization */}
                <div className="relative aspect-[16/10] md:aspect-auto bg-slate-950 flex flex-col items-center justify-center overflow-hidden min-h-[220px]">
                  {isLoading ? (
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3">
                      <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-violet-400">
                        Synthesizing Cinematic art...
                      </span>
                    </div>
                  ) : null}

                  {storyboard ? (
                    <div className="w-full h-full flex flex-col justify-between relative group/frame">
                      {/* Image Frame */}
                      <div className="relative flex-1 w-full min-h-0 aspect-[16/10] overflow-hidden">
                        <img
                          src={storyboard.imageUrl}
                          alt={`Storyboard for Scene ${scene.sceneNumber}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/frame:scale-105"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-90"></div>
                      </div>

                      {/* Prompt Citation Overlay */}
                      <div className="p-4 bg-slate-950/90 border-t border-slate-900 space-y-1.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-violet-500 block">
                          AI Prompt Used
                        </span>
                        <p className="text-[10px] text-slate-450 italic leading-relaxed line-clamp-2">
                          {storyboard.promptUsed}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 text-center space-y-3">
                      <span className="text-4xl text-slate-600 block">🖼️</span>
                      <div className="space-y-1">
                        <span className="text-xs font-bold text-slate-400 block">
                          No Visual Rendered
                        </span>
                        <p className="text-[10px] text-slate-500 max-w-[200px] mx-auto leading-relaxed">
                          Click the Generate button to render a cinematic storyboard frame.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
