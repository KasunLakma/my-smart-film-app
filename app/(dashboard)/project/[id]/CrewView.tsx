"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CrewMember {
  id: string;
  name: string;
  type: 'CAST' | 'CREW';
  roleName: string;
  email: string | null;
  phone: string | null;
}

interface CrewViewProps {
  projectId: string;
  initialCrew: CrewMember[];
}

export default function CrewView({ projectId, initialCrew }: CrewViewProps) {
  const router = useRouter();
  const [crew, setCrew] = useState<CrewMember[]>(initialCrew);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [actionLoadingMap, setActionLoadingMap] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'CAST', // default
    roleName: '',
    email: '',
    phone: '',
  });

  const castList = crew.filter((m) => m.type === 'CAST');
  const crewList = crew.filter((m) => m.type === 'CREW');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.name.trim() || !formData.roleName.trim()) {
      setError('Name and Role Name are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/project/${projectId}/crew`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add member.');
      }

      setCrew((prev) => [...prev, data.member]);
      setFormData({ name: '', type: 'CAST', roleName: '', email: '', phone: '' });
      setIsModalOpen(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    setActionLoadingMap((prev) => ({ ...prev, [memberId]: true }));
    try {
      const response = await fetch(`/api/project/${projectId}/crew`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: memberId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete member.');
      }

      setCrew((prev) => prev.filter((m) => m.id !== memberId));
      router.refresh();
    } catch (err: any) {
      alert(err.message || 'An error occurred while deleting.');
    } finally {
      setActionLoadingMap((prev) => ({ ...prev, [memberId]: false }));
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-200">Cast & Crew Directory</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Organize cast lists, assign technical department leads, and manage production member contact records.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-xs rounded-lg shadow-md hover:shadow-violet-600/10 transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>➕</span>
          <span>Add Member</span>
        </button>
      </div>

      {/* Directory Split Columns */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Cast Directory Card */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4 flex flex-col">
          <div className="flex justify-between items-center pb-3 border-b border-slate-850">
            <h4 className="text-sm font-extrabold text-violet-400 uppercase tracking-widest">
              🎭 Cast List ({castList.length})
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold">Actors / Performers</span>
          </div>

          {castList.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-8">
              No cast members added yet. Click "Add Member" to assign actors to your film.
            </p>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
              {castList.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-xl flex justify-between items-center group transition-colors"
                >
                  <div className="space-y-1 pr-4 min-w-0">
                    <span className="text-xs font-bold text-slate-200 block truncate">{member.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 block truncate uppercase">
                      as <strong className="text-slate-400">{member.roleName}</strong>
                    </span>
                    {(member.email || member.phone) && (
                      <span className="text-[9px] text-slate-500 block truncate">
                        {member.email ? `${member.email}` : ''} {member.phone ? `• ${member.phone}` : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={actionLoadingMap[member.id]}
                    className="p-2 text-[10px] text-slate-500 hover:text-red-400 transition-colors bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {actionLoadingMap[member.id] ? '...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Crew Directory Card */}
        <div className="bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-4 flex flex-col">
          <div className="flex justify-between items-center pb-3 border-b border-slate-850">
            <h4 className="text-sm font-extrabold text-indigo-400 uppercase tracking-widest">
              🛠️ Technical Crew ({crewList.length})
            </h4>
            <span className="text-[10px] text-slate-500 font-semibold">Production Staff</span>
          </div>

          {crewList.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-8">
              No technical staff added yet. Click "Add Member" to assign departments.
            </p>
          ) : (
            <div className="space-y-3 flex-1 overflow-y-auto max-h-[400px]">
              {crewList.map((member) => (
                <div
                  key={member.id}
                  className="p-4 bg-slate-950/40 border border-slate-900 hover:border-slate-800 rounded-xl flex justify-between items-center group transition-colors"
                >
                  <div className="space-y-1 pr-4 min-w-0">
                    <span className="text-xs font-bold text-slate-200 block truncate">{member.name}</span>
                    <span className="text-[10px] font-semibold text-slate-500 block truncate uppercase">
                      Dept: <strong className="text-slate-400">{member.roleName}</strong>
                    </span>
                    {(member.email || member.phone) && (
                      <span className="text-[9px] text-slate-500 block truncate">
                        {member.email ? `${member.email}` : ''} {member.phone ? `• ${member.phone}` : ''}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteMember(member.id)}
                    disabled={actionLoadingMap[member.id]}
                    className="p-2 text-[10px] text-slate-500 hover:text-red-400 transition-colors bg-slate-900 hover:bg-slate-850 border border-slate-850 rounded-lg cursor-pointer disabled:opacity-50"
                  >
                    {actionLoadingMap[member.id] ? '...' : 'Remove'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Member Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100">Add Cast / Crew Member</h3>
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

            <form onSubmit={handleAddMember} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 font-sans" htmlFor="name">
                  Full Name
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
                  placeholder="e.g. Leonardo DiCaprio"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="type">
                  Directory Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 text-sm transition-all duration-200"
                >
                  <option value="CAST">Cast (Actors, Performers)</option>
                  <option value="CREW">Crew (Directors, Camera, VFX, etc.)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="roleName">
                  Role / Department
                </label>
                <input
                  id="roleName"
                  name="roleName"
                  type="text"
                  required
                  disabled={loading}
                  value={formData.roleName}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                  placeholder="e.g. Cobb (Lead) or Director of Photography"
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="email">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    disabled={loading}
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                    placeholder="mail@domain.com"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    disabled={loading}
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                    placeholder="+1 555-0199"
                  />
                </div>
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
                  {loading ? 'Adding...' : 'Add Member'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
