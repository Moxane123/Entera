import React from 'react';
import { useApp } from '../context/AppContext';
import { EnteraLogo } from './EnteraLogo';
import { Search, Plus, User, LogOut, Compass, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { currentPath, navigate, setSearchOpen, creatorUser, logoutCreator, openAuthModal } = useApp();

  const handleCreateEntry = () => {
    if (creatorUser) {
      navigate('/create');
    } else {
      openAuthModal('/create');
    }
  };

  const isCurrent = (path: string) => {
    if (path === '/' && currentPath === '/') return true;
    if (path !== '/' && currentPath.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 text-left focus:outline-none group"
          >
            <div className="w-10 h-10 rounded-2xl bg-white border border-blue-100 flex items-center justify-center p-1.5 shadow-sm group-hover:scale-105 transition-transform">
              <EnteraLogo size={32} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">Entera</span>
                <span className="px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md border border-blue-200/60">
                  Verified
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">Understand before you interact</p>
            </div>
          </button>
        </div>

        {/* Desktop Nav Links (Public without authentication) */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          <button
            onClick={() => navigate('/explore')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isCurrent('/explore') ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Explore Entries
          </button>
          <button
            onClick={handleCreateEntry}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isCurrent('/create') ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Create Entry
          </button>
          <button
            onClick={() => navigate('/verify')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              isCurrent('/verify') ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Verify Destination
          </button>
          <button
            onClick={() => navigate('/skills')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              isCurrent('/skills') ? 'text-blue-700 font-bold bg-blue-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <span>Skill Directory</span>
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Search (Public) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/60"
            title="Search verified entries or contracts"
          >
            <Search className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Search entries...</span>
            <kbd className="hidden lg:inline px-1.5 py-0.5 text-[10px] bg-white border border-slate-300 rounded font-mono text-slate-400">
              /
            </kbd>
          </button>

          {/* Primary Action Button (Explore or Create) */}
          <button
            onClick={handleCreateEntry}
            className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Entry</span>
          </button>

          {/* Creator portal link if authenticated */}
          {creatorUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                title={creatorUser.email}
              >
                <div className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-bold text-[10px]">
                  {creatorUser.name.slice(0, 1).toUpperCase()}
                </div>
                <span className="max-w-[90px] truncate hidden md:inline">{creatorUser.name}</span>
              </button>

              <button
                onClick={logoutCreator}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuthModal('/dashboard')}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors"
            >
              <User className="w-3.5 h-3.5 text-slate-500" />
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
