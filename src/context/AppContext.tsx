import React, { createContext, useContext, useState, useEffect } from 'react';
import { ProtocolEntry, CreatorUser, SkillCategory, SkillItem } from '../types';
import { INITIAL_CANONICAL_ENTRIES } from '../data/canonicalEntries';
import { INITIAL_SKILL_CATEGORIES, INITIAL_SKILLS } from '../data/skillData';

interface AppContextType {
  currentPath: string;
  navigate: (path: string) => void;
  entries: ProtocolEntry[];
  getEntry: (idOrSlug: string) => ProtocolEntry | undefined;
  creatorUser: CreatorUser | null;
  loginCreator: (email: string) => boolean;
  signupCreator: (userData: { email: string; name?: string; organization?: string }) => boolean;
  logoutCreator: () => void;
  addProtocolEntry: (entry: ProtocolEntry) => void;
  updateProtocolEntry: (id: string, updates: Partial<ProtocolEntry>) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authReturnPath: string | null;
  openAuthModal: (returnPath?: string) => void;

  // Sabi Skill Directory & Verification Profile System
  skills: SkillItem[];
  categories: SkillCategory[];
  getSkill: (idOrSlug: string) => SkillItem | undefined;
  addSkill: (skill: SkillItem) => void;
  updateSkill: (id: string, updates: Partial<SkillItem>) => void;
  deleteSkill: (id: string) => void;
  addCategory: (category: SkillCategory) => void;
  updateCategory: (id: string, updates: Partial<SkillCategory>) => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  setAdminMode: (enabled: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_ENTRIES_KEY = 'arbientry_registered_entries_v1';
const LOCAL_STORAGE_USER_KEY = 'arbientry_creator_user_v1';
const LOCAL_STORAGE_SKILLS_KEY = 'sabi_skill_directory_v1';
const LOCAL_STORAGE_CATEGORIES_KEY = 'sabi_skill_categories_v1';
const LOCAL_STORAGE_ADMIN_MODE_KEY = 'sabi_admin_mode_enabled_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Path extraction supporting both browser history pushState and hash fallback
  const getInitialPath = () => {
    if (typeof window === 'undefined') return '/';
    if (window.location.hash && window.location.hash.startsWith('#')) {
      return window.location.hash.slice(1) || '/';
    }
    return window.location.pathname || '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getInitialPath);
  const [entries, setEntries] = useState<ProtocolEntry[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ENTRIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all default canonical entries exist
        const initialIds = new Set(INITIAL_CANONICAL_ENTRIES.map(e => e.id));
        const customOnly = parsed.filter((p: ProtocolEntry) => !initialIds.has(p.id));
        return [...INITIAL_CANONICAL_ENTRIES, ...customOnly];
      }
    } catch {
      // Fallback
    }
    return INITIAL_CANONICAL_ENTRIES;
  });

  const [creatorUser, setCreatorUser] = useState<CreatorUser | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return null;
  });

  // Sabi Skill Categories State
  const [categories, setCategories] = useState<SkillCategory[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_CATEGORIES_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaultIds = new Set(INITIAL_SKILL_CATEGORIES.map(c => c.id));
        const customCategories = parsed.filter((c: SkillCategory) => !defaultIds.has(c.id));
        return [...INITIAL_SKILL_CATEGORIES, ...customCategories];
      }
    } catch {
      // Fallback
    }
    return INITIAL_SKILL_CATEGORIES;
  });

  // Sabi Skills State
  const [skills, setSkills] = useState<SkillItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_SKILLS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaultIds = new Set(INITIAL_SKILLS.map(s => s.id));
        const customSkills = parsed.filter((s: SkillItem) => !defaultIds.has(s.id));
        return [...INITIAL_SKILLS, ...customSkills];
      }
    } catch {
      // Fallback
    }
    return INITIAL_SKILLS;
  });

  // Admin Mode State (can be toggled by the user in the header/settings)
  const [isAdminMode, setIsAdminMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_ADMIN_MODE_KEY);
      return saved === 'true';
    } catch {
      return false;
    }
  });

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem(LOCAL_STORAGE_ADMIN_MODE_KEY, String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  };

  const setAdminMode = (enabled: boolean) => {
    setIsAdminMode(enabled);
    try {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_MODE_KEY, String(enabled));
    } catch {
      // Ignore
    }
  };

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authReturnPath, setAuthReturnPath] = useState<string | null>(null);

  const openAuthModal = (returnPath?: string) => {
    if (returnPath) {
      setAuthReturnPath(returnPath);
    }
    setAuthModalOpen(true);
  };

  useEffect(() => {
    const handlePopState = () => {
      if (window.location.hash && window.location.hash.startsWith('#')) {
        setCurrentPath(window.location.hash.slice(1) || '/');
      } else {
        setCurrentPath(window.location.pathname || '/');
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (path: string) => {
    setCurrentPath(path);
    try {
      window.history.pushState({}, '', path);
    } catch {
      // If sandboxed iframe restricts pushState, fallback to hash
      window.location.hash = path;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getEntry = (idOrSlug: string): ProtocolEntry | undefined => {
    if (!idOrSlug) return undefined;
    const clean = decodeURIComponent(idOrSlug).toLowerCase().trim();
    return entries.find(
      e => e.id.toLowerCase() === clean || e.slug.toLowerCase() === clean || e.name.toLowerCase() === clean
    );
  };

  const loginCreator = (email: string): boolean => {
    const user: CreatorUser = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: email.split('@')[0] || 'Arbitrum Builder',
      organization: 'Arbitrum Ecosystem Contributor',
      role: 'Verified Protocol Creator',
      verifiedSigner: true,
      createdAt: new Date().toISOString()
    };
    setCreatorUser(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
    const dest = authReturnPath || '/create';
    setAuthReturnPath(null);
    setAuthModalOpen(false);
    navigate(dest);
    return true;
  };

  const signupCreator = (userData: { email: string; name?: string; organization?: string }): boolean => {
    const user: CreatorUser = {
      id: `usr_${Date.now()}`,
      email: userData.email.trim(),
      name: (userData.name && userData.name.trim()) || userData.email.split('@')[0] || 'Entera Creator',
      organization: (userData.organization && userData.organization.trim()) || 'Verified Ecosystem Partner',
      role: 'Verified Protocol Creator',
      verifiedSigner: true,
      createdAt: new Date().toISOString()
    };
    setCreatorUser(user);
    try {
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
    } catch {
      // Ignore
    }
    const dest = authReturnPath || '/create';
    setAuthReturnPath(null);
    setAuthModalOpen(false);
    navigate(dest);
    return true;
  };

  const logoutCreator = () => {
    setCreatorUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } catch {
      // Ignore
    }
    // If on creator-only routes, navigate back to home
    if (currentPath === '/create' || currentPath === '/dashboard') {
      navigate('/');
    }
  };

  const addProtocolEntry = (entry: ProtocolEntry) => {
    const updated = [entry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_ENTRIES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const updateProtocolEntry = (id: string, updates: Partial<ProtocolEntry>) => {
    const updated = entries.map(e => (e.id === id ? { ...e, ...updates } : e));
    setEntries(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_ENTRIES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  // Sabi Skill Directory Methods
  const getSkill = (idOrSlug: string): SkillItem | undefined => {
    if (!idOrSlug) return undefined;
    const clean = decodeURIComponent(idOrSlug).toLowerCase().trim();
    return skills.find(
      s => s.id.toLowerCase() === clean || s.slug.toLowerCase() === clean || s.name.toLowerCase() === clean
    );
  };

  const addSkill = (newSkill: SkillItem) => {
    const updated = [newSkill, ...skills];
    setSkills(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_SKILLS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const updateSkill = (id: string, updates: Partial<SkillItem>) => {
    const updated = skills.map(s => (s.id === id ? { ...s, ...updates, updatedAt: new Date().toISOString() } : s));
    setSkills(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_SKILLS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const deleteSkill = (id: string) => {
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_SKILLS_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const addCategory = (newCat: SkillCategory) => {
    const updated = [...categories, newCat];
    setCategories(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  const updateCategory = (id: string, updates: Partial<SkillCategory>) => {
    const updated = categories.map(c => (c.id === id ? { ...c, ...updates } : c));
    setCategories(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_CATEGORIES_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentPath,
        navigate,
        entries,
        getEntry,
        creatorUser,
        loginCreator,
        signupCreator,
        logoutCreator,
        addProtocolEntry,
        updateProtocolEntry,
        searchOpen,
        setSearchOpen,
        authModalOpen,
        setAuthModalOpen,
        authReturnPath,
        openAuthModal,

        // Sabi Skill Directory & Verification Profile System
        skills,
        categories,
        getSkill,
        addSkill,
        updateSkill,
        deleteSkill,
        addCategory,
        updateCategory,
        isAdminMode,
        toggleAdminMode,
        setAdminMode,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
