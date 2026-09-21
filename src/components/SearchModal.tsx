import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const { searchOpen, setSearchOpen, entries, navigate } = useApp();
  const [query, setQuery] = useState('');

  if (!searchOpen) return null;

  const cleanQuery = query.trim().toLowerCase();

  const filtered = cleanQuery
    ? entries.filter(entry => {
        const nameMatch = entry.name.toLowerCase().includes(cleanQuery);
        const slugMatch = entry.slug.toLowerCase().includes(cleanQuery);
        const categoryMatch = entry.category.toLowerCase().includes(cleanQuery);
        const contractMatch = entry.contracts.some(c =>
          c.address.toLowerCase().includes(cleanQuery) || c.name.toLowerCase().includes(cleanQuery)
        );
        const urlMatch = entry.officialUrl.toLowerCase().includes(cleanQuery);
        return nameMatch || slugMatch || categoryMatch || contractMatch || urlMatch;
      })
    : entries.slice(0, 4);

  const isAddressQuery = cleanQuery.startsWith('0x');

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-slate-100 flex items-center gap-3">
          <Search className="w-5 h-5 text-sky-500 shrink-0 ml-1" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verified protocol, 0x contract address, or category..."
            className="w-full text-sm text-slate-800 placeholder-slate-400 bg-transparent focus:outline-none"
            autoFocus
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline px-2 py-0.5 text-[11px] bg-slate-100 text-slate-400 border border-slate-200 rounded font-mono">
              ESC
            </kbd>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-700 rounded-lg ml-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1 divide-y divide-slate-50">
          {/* Quick Arbitrum Address Check prompt */}
          {isAddressQuery && (
            <div className="p-3 mb-2 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold text-sky-900">Run Verification on Contract Address</p>
                <p className="text-[11px] text-sky-700 font-mono truncate max-w-sm">{query}</p>
              </div>
              <button
                onClick={() => {
                  setSearchOpen(false);
                  navigate(`/verify/${query.trim()}`);
                }}
                className="px-3 py-1.5 text-xs font-semibold bg-sky-600 hover:bg-sky-700 text-white rounded-lg flex items-center gap-1 shadow-sm shrink-0"
              >
                <span>Verify</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="py-10 text-center text-slate-400">
              <ShieldCheck className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm font-medium text-slate-600">No matching canonical entry found</p>
              <p className="text-xs text-slate-600 mt-0.5">Try searching by protocol name (e.g. Uniswap, GMX, Camelot, Aave) or contract address.</p>
            </div>
          ) : (
            filtered.map(entry => (
              <div
                key={entry.id}
                onClick={() => {
                  setSearchOpen(false);
                  navigate(`/entry/${entry.id}`);
                }}
                className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer flex items-center justify-between gap-3 transition-colors group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-100 text-sky-600 flex items-center justify-center font-bold text-xs shrink-0 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                    {entry.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">{entry.name}</span>
                      <span className="px-1.5 py-0.2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 rounded">
                        Verified
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 truncate">{entry.tagline}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-600 font-mono mt-0.5">
                      <span>{entry.category}</span>
                      <span>•</span>
                      <span>{entry.contracts.length} contracts</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className="text-xs font-semibold text-sky-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                    Understand
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 px-4">
          <span>Canonical Arbitrum Layer • No Wallet Required</span>
          <button
            onClick={() => {
              setSearchOpen(false);
              navigate('/explore');
            }}
            className="text-sky-600 hover:text-sky-700 font-semibold"
          >
            View all entries
          </button>
        </div>
      </div>
    </div>
  );
};
