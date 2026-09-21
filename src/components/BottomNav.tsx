import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, Compass, ShieldCheck, PlusCircle, Sparkles } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { currentPath, navigate, creatorUser, openAuthModal } = useApp();

  const handleCreate = () => {
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
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 md:hidden pb-[max(env(safe-area-inset-bottom),8px)] pt-2">
      <div className="grid grid-cols-5 items-center justify-items-center px-2">
        {/* Home */}
        <button
          onClick={() => navigate('/')}
          className={`flex flex-col items-center gap-1 py-1 w-full text-center transition-colors ${
            isCurrent('/') && !currentPath.startsWith('/skills') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Home className={`w-5 h-5 ${isCurrent('/') && !currentPath.startsWith('/skills') ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight">Home</span>
        </button>

        {/* Explore Entries (Public) */}
        <button
          onClick={() => navigate('/explore')}
          className={`flex flex-col items-center gap-1 py-1 w-full text-center transition-colors ${
            isCurrent('/explore') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Compass className={`w-5 h-5 ${isCurrent('/explore') ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight">Explore</span>
        </button>

        {/* Center Prominent Verify Button (Inspired by CryptoRank's prominent middle action button) */}
        <button
          onClick={() => navigate('/verify')}
          className="flex flex-col items-center -mt-5 focus:outline-none group"
        >
          <div className="w-12 h-12 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 ring-4 ring-white transition-transform active:scale-95">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <span className={`text-[10px] font-semibold mt-1 ${isCurrent('/verify') ? 'text-blue-600' : 'text-slate-600'}`}>
            Verify
          </span>
        </button>

        {/* Create Entry */}
        <button
          onClick={handleCreate}
          className={`flex flex-col items-center gap-1 py-1 w-full text-center transition-colors ${
            isCurrent('/create') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <PlusCircle className={`w-5 h-5 ${isCurrent('/create') ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight">Create</span>
        </button>

        {/* Skills Directory (Public) */}
        <button
          onClick={() => navigate('/skills')}
          className={`flex flex-col items-center gap-1 py-1 w-full text-center transition-colors ${
            isCurrent('/skills') ? 'text-blue-600 font-bold' : 'text-slate-600 hover:text-slate-800'
          }`}
        >
          <Sparkles className={`w-5 h-5 ${isCurrent('/skills') ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium tracking-tight">Skills</span>
        </button>
      </div>
    </nav>
  );
};
