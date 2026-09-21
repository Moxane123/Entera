import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { SearchModal } from './components/SearchModal';
import { CreatorAuthModal } from './components/CreatorAuthModal';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { EntryDetailPage } from './pages/EntryDetailPage';
import { VerifyPage } from './pages/VerifyPage';
import { CreateEntryPage } from './pages/CreateEntryPage';
import { DashboardPage } from './pages/DashboardPage';
import { SkillDirectoryPage } from './pages/SkillDirectoryPage';
import { SkillDetailPage } from './pages/SkillDetailPage';
import { AdminSkillConfigPage } from './pages/AdminSkillConfigPage';

const AppContent: React.FC = () => {
  const { currentPath } = useApp();

  // Route Dispatcher
  const renderRoute = () => {
    const cleanPath = currentPath.split('?')[0].split('#')[0];

    // Sabi Skill Directory & Verification Profile Routes
    if (cleanPath === '/skills' || cleanPath === '/skills/') {
      return <SkillDirectoryPage />;
    }

    if (cleanPath === '/skills/new') {
      return <AdminSkillConfigPage />;
    }

    if (cleanPath.startsWith('/skills/edit/')) {
      const editSkillId = cleanPath.replace('/skills/edit/', '');
      return <AdminSkillConfigPage editSkillId={editSkillId} />;
    }

    if (cleanPath.startsWith('/skills/')) {
      const skillId = cleanPath.replace('/skills/', '');
      return <SkillDetailPage skillId={skillId} />;
    }

    if (cleanPath === '/' || cleanPath === '') {
      return <LandingPage />;
    }

    if (cleanPath === '/explore') {
      return <ExplorePage />;
    }

    if (cleanPath.startsWith('/entry/')) {
      const entryId = cleanPath.replace('/entry/', '');
      return <EntryDetailPage entryId={entryId} />;
    }

    if (cleanPath.startsWith('/verify')) {
      const targetId = cleanPath.startsWith('/verify/') ? cleanPath.replace('/verify/', '') : undefined;
      return <VerifyPage targetId={targetId} />;
    }

    if (cleanPath === '/create') {
      return <CreateEntryPage />;
    }

    if (cleanPath === '/dashboard') {
      return <DashboardPage />;
    }

    // Default fallback
    return <LandingPage />;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top sticky navigation bar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-5 pb-24 md:pb-12">
        {renderRoute()}
      </main>

      {/* Mobile Bottom Navigation Dock (Inspired by CryptoRank reference app) */}
      <BottomNav />

      {/* Modals */}
      <SearchModal />
      <CreatorAuthModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
