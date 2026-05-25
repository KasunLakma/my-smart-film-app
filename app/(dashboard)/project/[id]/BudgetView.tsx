"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Budget {
  id: string;
  totalEstimated: number;
  totalSpent: number;
}

interface BudgetViewProps {
  projectId: string;
  initialBudget: Budget | null;
}

export default function BudgetView({ projectId, initialBudget }: BudgetViewProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    totalEstimated: initialBudget ? String(initialBudget.totalEstimated) : '0',
    totalSpent: initialBudget ? String(initialBudget.totalSpent) : '0',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const estimatedVal = parseFloat(formData.totalEstimated) || 0;
  const spentVal = parseFloat(formData.totalSpent) || 0;
  const remainingVal = estimatedVal - spentVal;
  
  // Calculate spent percentage
  const spentPercent = estimatedVal > 0 ? Math.min(Math.round((spentVal / estimatedVal) * 100), 100) : 0;
  
  // Color configuration based on budget safety
  const progressColor = spentPercent > 90 ? 'bg-red-500' : spentPercent > 70 ? 'bg-amber-500' : 'bg-violet-500';

  // Responsive mock breakdown list based on totalSpent
  const breakdownItems = [
    { name: 'Director & Production Staff', percentage: 15, label: 'Pre-Production & Admin' },
    { name: 'Cast Salaries & Fees', percentage: 35, label: 'Talent & Agencies' },
    { name: 'Camera, Grip & Lighting', percentage: 25, label: 'Gear Hire & Tech' },
    { name: 'Storyboard AI & Creative Art', percentage: 5, label: 'VFX & Previs' },
    { name: 'Locations & Permits', percentage: 20, label: 'Scouting & Rent' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch(`/api/project/${projectId}/budget`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          totalEstimated: estimatedVal,
          totalSpent: spentVal,
        }),
      });

      const data = await response.ok ? await response.json() : null;

      if (!response.ok || !data) {
        throw new Error(data?.error || 'Failed to update budget details.');
      }

      setSuccess(true);
      setEditing(false);
      router.refresh();
      
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (err: any) {
      setError(err.message || 'An error occurred.');
    } finally {
      setSaving(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-900 pb-4">
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-slate-200">Financial Budget Tracker</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Manage your project's estimates, track actual spending, and view automated production cost breakdowns.
          </p>
        </div>
        {!editing && (
          <button
            onClick={() => setEditing(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-xs font-semibold rounded-lg text-violet-400 hover:text-violet-300 transition-colors cursor-pointer"
          >
            ✏️ Update Budget
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit} className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 shadow-xl space-y-6">
          <h4 className="text-sm font-bold text-slate-350 uppercase tracking-wider pb-3 border-b border-slate-850">
            Edit Budget Options
          </h4>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 px-4 py-3 rounded-lg text-xs flex items-center gap-2">
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="totalEstimated">
                Total Estimated Budget ($)
              </label>
              <input
                id="totalEstimated"
                name="totalEstimated"
                type="number"
                min="0"
                step="any"
                required
                disabled={saving}
                value={formData.totalEstimated}
                onChange={e => setFormData(prev => ({ ...prev, totalEstimated: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                placeholder="e.g. 500000"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400" htmlFor="totalSpent">
                Total Spent Budget ($)
              </label>
              <input
                id="totalSpent"
                name="totalSpent"
                type="number"
                min="0"
                step="any"
                required
                disabled={saving}
                value={formData.totalSpent}
                onChange={e => setFormData(prev => ({ ...prev, totalSpent: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-lg bg-slate-950/60 border border-slate-800 focus:border-violet-500 focus:ring-1 focus:ring-violet-500/20 outline-none text-slate-100 placeholder-slate-650 text-sm transition-all duration-200"
                placeholder="e.g. 120000"
              />
            </div>
          </div>

          <div className="flex gap-3 justify-end pt-4 border-t border-slate-850">
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                setError(null);
                setFormData({
                  totalEstimated: initialBudget ? String(initialBudget.totalEstimated) : '0',
                  totalSpent: initialBudget ? String(initialBudget.totalSpent) : '0',
                });
              }}
              className="px-4 py-2 text-sm font-semibold rounded-lg text-slate-450 hover:text-slate-200 hover:bg-slate-800/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm rounded-lg shadow-md transition-all duration-200 cursor-pointer disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          {/* Financial summary blocks */}
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-md space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Estimated Budget</span>
              <p className="text-3xl font-extrabold text-slate-200">{formatCurrency(estimatedVal)}</p>
            </div>

            <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-md space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Total Spent</span>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-extrabold text-slate-200">{formatCurrency(spentVal)}</p>
                <span className="text-[10px] font-bold text-violet-400">({spentPercent}%)</span>
              </div>
            </div>

            <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-md space-y-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Remaining Balance</span>
              <p className={`text-3xl font-extrabold ${remainingVal < 0 ? 'text-rose-450' : 'text-emerald-400'}`}>
                {formatCurrency(remainingVal)}
              </p>
            </div>
          </div>

          {/* Progress bar card */}
          {estimatedVal > 0 && (
            <div className="p-6 bg-slate-900/30 border border-slate-800/80 rounded-2xl shadow-md space-y-4">
              <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider">
                <span className="text-slate-400">Production Spending Level</span>
                <span className="text-slate-200">{spentPercent}% Spent</span>
              </div>
              <div className="w-full h-3 bg-slate-950 border border-slate-900 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${progressColor} transition-all duration-500`}
                  style={{ width: `${spentPercent}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Cost breakdown list */}
          <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-6 shadow-md space-y-6">
            <h4 className="text-xs font-bold text-slate-350 uppercase tracking-wider block">
              Automated Cost Allocation Breakdown
            </h4>

            {spentVal === 0 ? (
              <div className="p-6 text-center text-xs text-slate-550 border border-dashed border-slate-850 rounded-xl">
                No spending logged. Update the budget above to review allocated categories.
              </div>
            ) : (
              <div className="space-y-4 divide-y divide-slate-850/60">
                {breakdownItems.map((item, idx) => {
                  const itemAmount = spentVal * (item.percentage / 100);
                  return (
                    <div
                      key={item.name}
                      className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 ${
                        idx === 0 ? 'pt-0' : ''
                      }`}
                    >
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-slate-200 block">{item.name}</span>
                        <span className="text-[10px] text-slate-500 block">{item.label}</span>
                      </div>
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-950 border border-slate-850 text-slate-400">
                          {item.percentage}%
                        </span>
                        <span className="text-sm font-bold text-slate-200 font-mono">
                          {formatCurrency(itemAmount)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
