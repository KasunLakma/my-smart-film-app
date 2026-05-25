"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Location {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
}

interface LocationViewProps {
  projectId: string;
  initialLocations: Location[];
}

export default function LocationView({ projectId, initialLocations }: LocationViewProps) {
  const router = useRouter();
  const [locations, setLocations] = useState<Location[]>(initialLocations);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim()) {
      setError('Location name is required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/project/${projectId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add location.');
      }

      setLocations((prev) => [...prev, data.location]);
      setFormData({ name: '', description: '' });
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteLocation = async (locationId: string) => {
    setActionLoadingMap((prev) => ({ ...prev, [locationId]: true }));
    try {
      const response = await fetch(`/api/project/${projectId}/location`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: locationId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete location.');
      }

      setLocations((prev) => prev.filter((loc) => loc.id !== locationId));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'An error occurred while deleting.');
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [locationId]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-200">Location Scouting Board</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Record potential shoot locations, keep track of scouting notes, and catalog cinematic landscape images.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-violet-600/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>➕</span>
          <span>Add Location</span>
        </button>
      </div>

      {/* Locations Grid */}
      {locations.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/10 border border-slate-800/50 rounded-xl space-y-3">
          <span className="text-3xl">📍</span>
          <h4 className="text-sm font-bold text-slate-300">No locations scouted yet</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Click "Add Location" to start cataloging potential movie sets and filming environments.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((loc) => {
            const isDeleting = actionLoadingMap[loc.id] || false;

            return (
              <div
                key={loc.id}
                className="bg-slate-900/30 border border-slate-800/80 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700/80 transition-all duration-300 flex flex-col justify-between group"
              >
                {/* Location Image Header */}
                <div className="relative aspect-[16/10] bg-slate-950 overflow-hidden">
                  <img
                    src={loc.imageUrl || 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=800&auto=format&fit=crop'}
                    alt={loc.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80"></div>
                </div>

                {/* Location Text Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-200 text-sm group-hover:text-violet-400 transition-colors line-clamp-1">
                      {loc.name}
                    </h4>
                    <p className="text-xs text-slate-450 leading-relaxed line-clamp-3">
                      {loc.description || 'No description or scouting notes provided.'}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-850 flex justify-between items-center mt-auto">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500">
                      Scouted Set
                    </span>
                    <button
                      onClick={() => handleDeleteLocation(loc.id)}
                      disabled={isDeleting}
                      className="px-2.5 py-1.5 text-[10px] text-slate-500 hover:text-red-400 transition-colors bg-slate-950 hover:bg-slate-900 border border-slate-850 hover:border-slate-800 rounded-lg cursor-pointer disabled:opacity-50"
                    >
                      {isDeleting ? '...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Location Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">Add Scouting Location</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-500 hover:text-slate-350 text-xl cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleAddLocation} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="name">
                  Location Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                  placeholder="e.g. Scifi Forest / Industrial Warehouse"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="description">
                  Scouting Notes / Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  disabled={loading}
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200 resize-none"
                  placeholder="Detail logistics, lighting features, permit requirements, and set vibe..."
                />
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-450 hover:text-slate-200 hover:bg-slate-800/40 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
                >
                  {loading ? 'Adding...' : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
