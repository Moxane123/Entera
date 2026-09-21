import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Lock,
  FileCheck2,
  Layers
} from 'lucide-react';

export const ExplorePage: React.FC = () => {
  const { entries, navigate, creatorUser, openAuthModal } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [safetyFilter, setSafetyFilter] = useState<'all' | 'audited' | 'immutable' | 'timelock'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCreateEntry = () => {
    if (creatorUser) {
      navigate('/create');
    } else {
      openAuthModal('/create');
    }
  };

  const categories = [
    'All',
    'DEX & Liquidity',
    'Derivatives & Perps',
    'Lending',
    'Bridges',
    'Yield & Staking'
  ];

  const filteredEntries = entries.filter((entry) => {
    // Category match
    if (selectedCategory !== 'All' && entry.category !== selectedCategory) {
      return false;
    }
    // Safety filter match
    if (safetyFilter === 'audited' && entry.audits.length === 0) return false;
    if (
      safetyFilter === 'immutable' &&
      !entry.contracts.some((c) => c.proxyType === 'None (Immutable)')
    )
      return false;
    if (
      safetyFilter === 'timelock' &&
      !entry.contracts.some((c) => (c.timelockHours ?? 0) > 0)
    )
      return false;

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = entry.name.toLowerCase().includes(q);
      const matchCategory = entry.category.toLowerCase().includes(q);
      const matchContracts = entry.contracts.some(
        (c) => c.address.toLowerCase().includes(q) || c.name.toLowerCase().includes(q)
      );
      const matchUrl = entry.officialUrl.toLowerCase().includes(q);
      return matchName || matchCategory || matchContracts || matchUrl;
    }
    return true;
  });

  return (
    <div className="space-y-6 pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Explore Verified Entries</h1>
            <span className="px-2 py-0.5 text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
              {filteredEntries.length} Active
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600">
            Public registry of verified application contracts and interaction parameters. Completely public without authentication.
          </p>
        </div>

        {/* Quick Verify contract button */}
        <button
          onClick={() => navigate('/verify/0xE592427A0AEce92De3Edee1F18E0157C05861564')}
          className="self-start sm:self-auto px-3.5 py-2 text-xs font-semibold bg-white hover:bg-slate-50 border border-slate-300 rounded-xl text-slate-700 flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
        >
          <ShieldCheck className="w-4 h-4 text-sky-600" />
          <span>Verify Address Directly</span>
        </button>
      </div>

      {/* Search and Filter Bar */}
      <div className="space-y-3">
        {/* Search Input Box */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by protocol name, contract address (0x...), or official domain..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 placeholder-slate-400 shadow-xs"
          />
        </div>

        {/* Category Pill Tabs (Modeled after reference screenshot 3 & 4) */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedCategory === cat
                  ? 'bg-sky-500 text-white shadow-xs font-semibold'
                  : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Safety Filter Pills */}
        <div className="flex items-center gap-1 text-[11px] overflow-x-auto no-scrollbar pt-0.5">
          <span className="text-slate-600 font-semibold uppercase tracking-wider mr-1 shrink-0">
            Security Filter:
          </span>
          {[
            { id: 'all', label: 'All Verified' },
            { id: 'audited', label: 'Formally Audited' },
            { id: 'immutable', label: 'Immutable Core' },
            { id: 'timelock', label: 'Timelock Active' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSafetyFilter(f.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                safetyFilter === f.id
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Entries List / Table View (Modeled after reference screenshot 3) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 divide-y divide-slate-100 overflow-hidden shadow-xs">
        {filteredEntries.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Layers className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-semibold text-slate-700">No protocol entries match your filters</p>
            <p className="text-xs text-slate-600 mt-1">Try resetting search query or selecting "All" categories.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSafetyFilter('all');
                setSearchQuery('');
              }}
              className="mt-3 px-3 py-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredEntries.map((entry) => (
            <div
              key={entry.id}
              onClick={() => navigate(`/entry/${entry.id}`)}
              className="p-4 sm:p-5 hover:bg-slate-50/80 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              {/* Left Column: Icon + Name + Description */}
              <div className="flex items-start gap-3.5 min-w-0">
                <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  {entry.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {entry.name}
                    </h2>
                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-2.5 h-2.5" />
                      Verified
                    </span>
                    <span className="text-[11px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                      Arbitrum One
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">{entry.tagline}</p>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-600 font-mono mt-1.5">
                    <span className="text-slate-700 font-medium">{entry.category}</span>
                    <span>•</span>
                    <span>{entry.contracts.length} verified contracts</span>
                    <span>•</span>
                    <span>{entry.audits.length} audits</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Interaction Policy + Action Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 shrink-0">
                <div className="text-left sm:text-right">
                  <span className="block text-[11px] font-mono text-slate-600 uppercase">
                    Approval Policy
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {entry.safety.approvalPolicy}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 group-hover:bg-sky-600 group-hover:text-white text-slate-700 font-semibold text-xs transition-all shrink-0">
                  <span>Understand</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Creator Registration Prompt */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Are you an application maintainer?</h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Register a verified entry layer with canonical contracts, security guidelines, and verified audit reports.
          </p>
        </div>
        <button
          onClick={handleCreateEntry}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0 transition-colors"
        >
          <span>Create Entry</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
