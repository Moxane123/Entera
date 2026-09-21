import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { EnteraLogo } from '../components/EnteraLogo';
import { ProtocolEntry } from '../types';
import { OnChainRegistryCard } from '../components/OnChainRegistryCard';
import {
  Plus,
  Edit3,
  Eye,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  LogOut,
  Mail,
  User,
  ArrowRight,
  SlidersHorizontal,
  X,
  FileText,
  Trash2,
  Clock
} from 'lucide-react';

interface LocalDraft {
  projectName?: string;
  shortDescription?: string;
  category?: string;
  targetAudience?: string;
  savedAt?: string;
  destinationUrl?: string;
}

export const DashboardPage: React.FC = () => {
  const {
    creatorUser,
    loginCreator,
    signupCreator,
    logoutCreator,
    entries,
    addProtocolEntry,
    updateProtocolEntry,
    navigate
  } = useApp();

  // Auth form state if unauthenticated
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [authError, setAuthError] = useState('');

  // Status filtering (All, Active, Inactive, Draft, Pending registration)
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Copy feedback state (entryId -> boolean)
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Update Status Modal state
  const [editingEntry, setEditingEntry] = useState<ProtocolEntry | null>(null);
  const [modalEntryStatus, setModalEntryStatus] = useState<'Active' | 'Inactive' | 'Draft'>('Active');
  const [modalRegistrationStatus, setModalRegistrationStatus] = useState<'Published' | 'Pending registration' | 'Draft'>('Published');

  // Local draft state
  const [localDraft, setLocalDraft] = useState<LocalDraft | null>(null);

  // Success notice
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load saved draft from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('entera_entry_draft_v2');
      if (saved) {
        setLocalDraft(JSON.parse(saved));
      } else {
        setLocalDraft(null);
      }
    } catch {
      setLocalDraft(null);
    }
  }, []);

  // ----------------------------------------------------
  // Unauthenticated State (Creator Sign In)
  // ----------------------------------------------------
  if (!creatorUser) {
    const handleAuthSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!email.trim() || !email.includes('@')) {
        setAuthError('Please enter a valid email address.');
        return;
      }
      setAuthError('');
      if (authTab === 'signin') {
        loginCreator(email.trim());
      } else {
        signupCreator({
          email: email.trim(),
          name: name.trim() || email.split('@')[0] || 'Entera Creator'
        });
      }
    };

    const handleQuickDemo = () => {
      setAuthError('');
      loginCreator('maintainer@entera.app');
    };

    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          {/* Header Banner */}
          <div className="relative h-44 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-sky-300/20 rounded-3xl rotate-12 blur-md pointer-events-none" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 mb-2.5">
              <EnteraLogo size={42} />
            </div>

            <h1 className="relative z-10 text-xl font-extrabold text-white tracking-tight">
              Entera Creator Dashboard
            </h1>
            <p className="relative z-10 text-xs text-blue-100 font-medium max-w-xs mt-0.5">
              Sign in to manage and update your verified application entries.
            </p>
          </div>

          <div className="p-6">
            {/* Segmented Tabs */}
            <div className="grid grid-cols-2 p-1 mb-5 bg-slate-100 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signin');
                  setAuthError('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authTab === 'signin'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthTab('signup');
                  setAuthError('');
                }}
                className={`py-2 text-xs font-bold rounded-xl transition-all ${
                  authTab === 'signup'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Create Account
              </button>
            </div>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="maintainer@organization.com"
                    required
                    autoFocus
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>

              {authTab === 'signup' && (
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Name / Team Handle <span className="text-slate-400 font-normal">(Optional)</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Uniswap Protocol Team"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <span>Access Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-center gap-2.5 text-center">
              <button
                type="button"
                onClick={handleQuickDemo}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 hover:underline"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Instant Test: Sign in as Verified Creator</span>
              </button>

              <button
                type="button"
                onClick={() => navigate('/explore')}
                className="text-[11px] text-slate-500 hover:text-slate-700 transition-colors"
              >
                Explore existing verified entries without signing in
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Authenticated Creator Dashboard
  // ----------------------------------------------------

  // Format and resolve entry items with default statuses if not explicitly set
  interface DashboardEntryItem {
    id: string;
    projectName: string;
    entryStatus: 'Active' | 'Inactive' | 'Draft';
    registrationStatus: 'Published' | 'Pending registration' | 'Draft';
    lastUpdated: string;
    isLocalDraft?: boolean;
    rawEntry?: ProtocolEntry;
  }

  const registeredItems: DashboardEntryItem[] = entries.map((entry) => {
    // Default entry status based on verification status or explicit property
    const entryStatus: 'Active' | 'Inactive' | 'Draft' =
      entry.entryStatus || (entry.status === 'verified' ? 'Active' : 'Inactive');

    // Default registration status
    const registrationStatus: 'Published' | 'Pending registration' | 'Draft' =
      entry.registrationStatus || (entry.status === 'verified' ? 'Published' : 'Pending registration');

    // Last updated date
    const lastUpdated =
      entry.lastUpdated ||
      (entry.verifiedTimestamp
        ? new Date(entry.verifiedTimestamp).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
          })
        : 'Sep 20, 2026');

    return {
      id: entry.id,
      projectName: entry.name,
      entryStatus,
      registrationStatus,
      lastUpdated,
      rawEntry: entry
    };
  });

  // Include local draft if exists
  const allItems: DashboardEntryItem[] = [...registeredItems];
  if (localDraft && localDraft.projectName) {
    allItems.unshift({
      id: 'draft-local-arbitrum',
      projectName: localDraft.projectName,
      entryStatus: 'Draft',
      registrationStatus: 'Draft',
      lastUpdated: localDraft.savedAt ? `Draft (${localDraft.savedAt})` : 'Draft (Unsaved)',
      isLocalDraft: true
    });
  }

  // Filter items according to status filter
  const filteredItems = allItems.filter((item) => {
    if (statusFilter === 'all') return true;
    if (statusFilter === 'active') return item.entryStatus === 'Active';
    if (statusFilter === 'inactive') return item.entryStatus === 'Inactive';
    if (statusFilter === 'draft') return item.entryStatus === 'Draft' || item.registrationStatus === 'Draft';
    if (statusFilter === 'pending') return item.registrationStatus === 'Pending registration';
    return true;
  });

  // Action: Copy Link
  const handleCopyLink = (entryId: string) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://entera.app';
    const url = `${origin}/entry/${entryId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(entryId);
    showToast(`Copied public link for ${entryId}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Action: Register
  const handleRegister = (item: DashboardEntryItem) => {
    const nowFormatted = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    if (item.isLocalDraft && localDraft) {
      // Register local draft into canonical entries
      const slug = (localDraft.projectName || 'entry')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      const newId = `${slug}-arbitrum`;

      const newEntry: ProtocolEntry = {
        id: newId,
        name: localDraft.projectName || 'Custom Protocol',
        slug,
        tagline: localDraft.shortDescription || 'Verified protocol entry',
        description: localDraft.shortDescription || 'Verified protocol entry on Arbitrum.',
        category: (localDraft.category as any) || 'DEX & Liquidity',
        network: 'arbitrum-one',
        chainId: 42161,
        officialUrl: localDraft.destinationUrl || 'https://arbitrum.io',
        docsUrl: localDraft.destinationUrl || 'https://arbitrum.io',
        arbiscanUrl: 'https://arbiscan.io',
        status: 'verified',
        verificationBadge: 'Verified Canonical',
        verifiedTimestamp: new Date().toISOString(),
        creatorAddress: creatorUser.email,
        entryStatus: 'Active',
        registrationStatus: 'Published',
        lastUpdated: nowFormatted,
        contracts: [],
        audits: [],
        safety: {
          approvalPolicy: 'Exact Amount Recommended',
          approvalWarning: 'Verify destination URL and contract allowances.',
          commonFunctions: [],
          emergencyPause: false,
          adminControls: 'Admin controls maintained by verified protocol team.',
          knownRisks: []
        }
      };

      addProtocolEntry(newEntry);
      try {
        localStorage.removeItem('entera_entry_draft_v2');
      } catch {
        // Ignore
      }
      setLocalDraft(null);
      showToast(`Registered "${newEntry.name}" as Published and Active.`);
    } else if (item.rawEntry) {
      // Transition existing entry to Published and Active
      updateProtocolEntry(item.rawEntry.id, {
        entryStatus: 'Active',
        registrationStatus: 'Published',
        status: 'verified',
        lastUpdated: nowFormatted
      });
      showToast(`Registered "${item.projectName}" as Published.`);
    }
  };

  // Action: Open Update Status Modal
  const handleOpenUpdateModal = (entry: ProtocolEntry) => {
    setEditingEntry(entry);
    setModalEntryStatus(entry.entryStatus || 'Active');
    setModalRegistrationStatus(entry.registrationStatus || 'Published');
  };

  // Action: Save Status Update
  const handleSaveStatusUpdate = () => {
    if (!editingEntry) return;
    const nowFormatted = new Date().toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    updateProtocolEntry(editingEntry.id, {
      entryStatus: modalEntryStatus,
      registrationStatus: modalRegistrationStatus,
      lastUpdated: nowFormatted
    });

    showToast(`Updated status for "${editingEntry.name}".`);
    setEditingEntry(null);
  };

  // Discard Local Draft
  const handleDiscardDraft = () => {
    try {
      localStorage.removeItem('entera_entry_draft_v2');
    } catch {
      // Ignore
    }
    setLocalDraft(null);
    showToast('Draft discarded.');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Creator Identity and Primary "Create Entry" Action */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Creator Dashboard
            </h1>
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
              Authenticated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
            <span className="font-mono text-slate-700">{creatorUser.email}</span>
            <span>•</span>
            <span>{creatorUser.organization || 'Verified Creator'}</span>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Primary Action: Create Entry */}
          <button
            onClick={() => navigate('/create')}
            className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Create Entry</span>
          </button>

          <button
            onClick={logoutCreator}
            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-xl transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Status Filter Tabs (Draft, Published, Active, Inactive, Pending registration) */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setStatusFilter('all')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          All Entries ({allItems.length})
        </button>
        <button
          onClick={() => setStatusFilter('active')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            statusFilter === 'active'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Active ({allItems.filter((i) => i.entryStatus === 'Active').length})
        </button>
        <button
          onClick={() => setStatusFilter('inactive')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            statusFilter === 'inactive'
              ? 'bg-slate-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Inactive ({allItems.filter((i) => i.entryStatus === 'Inactive').length})
        </button>
        <button
          onClick={() => setStatusFilter('draft')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            statusFilter === 'draft'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Draft ({allItems.filter((i) => i.entryStatus === 'Draft' || i.registrationStatus === 'Draft').length})
        </button>
        <button
          onClick={() => setStatusFilter('pending')}
          className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
            statusFilter === 'pending'
              ? 'bg-violet-600 text-white shadow-xs'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Pending Registration ({allItems.filter((i) => i.registrationStatus === 'Pending registration').length})
        </button>
      </div>

      {/* Main Entries Management Table (Showing ONLY requested fields) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="text-sm font-bold text-slate-800">No Entries in this view</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              No protocol entries match the &ldquo;{statusFilter}&rdquo; status filter.
            </p>
            <button
              onClick={() => navigate('/create')}
              className="px-4 py-2 text-xs font-bold bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors inline-flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Entry</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200/80 bg-slate-50/70 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Project Name</th>
                  <th className="py-3.5 px-4">Entry ID</th>
                  <th className="py-3.5 px-4">Entry Status</th>
                  <th className="py-3.5 px-4">Registration Status</th>
                  <th className="py-3.5 px-4">Last Updated</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    {/* 1. Project Name */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-slate-100 border border-slate-200 text-slate-800 font-extrabold text-xs flex items-center justify-center shrink-0">
                          {item.projectName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 block">{item.projectName}</span>
                          {item.isLocalDraft && (
                            <span className="text-[10px] text-amber-600 font-semibold block">
                              Draft saved in local browser
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* 2. Entry ID */}
                    <td className="py-4 px-4 font-mono text-[11px] text-slate-600">
                      <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200/60 inline-block max-w-[160px] truncate">
                        {item.id}
                      </span>
                    </td>

                    {/* 3. Entry Status (Active, Inactive, Draft) */}
                    <td className="py-4 px-4">
                      {item.entryStatus === 'Active' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Active
                        </span>
                      )}
                      {item.entryStatus === 'Inactive' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                      {item.entryStatus === 'Draft' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* 4. Registration Status (Published, Pending registration, Draft) */}
                    <td className="py-4 px-4">
                      {item.registrationStatus === 'Published' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-200">
                          <CheckCircle2 className="w-3 h-3 text-sky-600" />
                          Published
                        </span>
                      )}
                      {item.registrationStatus === 'Pending registration' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-violet-50 text-violet-700 border border-violet-200">
                          <Clock className="w-3 h-3 text-violet-600" />
                          Pending registration
                        </span>
                      )}
                      {item.registrationStatus === 'Draft' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Draft
                        </span>
                      )}
                    </td>

                    {/* 5. Last Updated */}
                    <td className="py-4 px-4 text-[11px] text-slate-500 whitespace-nowrap">
                      {item.lastUpdated}
                    </td>

                    {/* Primary Actions: "Edit", "Preview", "Register", "Update", "Copy Link" */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* 1. Edit */}
                        <button
                          onClick={() => {
                            if (item.isLocalDraft) {
                              navigate('/create');
                            } else {
                              navigate(`/create?edit=${item.id}`);
                            }
                          }}
                          className="px-2 py-1 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 font-semibold text-xs transition-colors border border-slate-200"
                          title="Edit Entry"
                        >
                          Edit
                        </button>

                        {/* 2. Preview */}
                        <button
                          onClick={() => {
                            if (item.isLocalDraft) {
                              navigate('/create?step=4');
                            } else {
                              navigate(`/entry/${item.id}`);
                            }
                          }}
                          className="px-2 py-1 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 font-semibold text-xs transition-colors border border-slate-200"
                          title="Preview Public Experience"
                        >
                          Preview
                        </button>

                        {/* 2b. Verify Destination */}
                        {!item.isLocalDraft && (
                          <button
                            onClick={() => navigate(`/verify/${item.id}`)}
                            className="px-2 py-1 rounded-lg text-sky-700 hover:bg-sky-50 font-semibold text-xs transition-colors border border-sky-200"
                            title="Verify Registered Destination on Entera Registry"
                          >
                            Verify
                          </button>
                        )}

                        {/* 3. Register (if Draft or Pending registration) */}
                        {(item.registrationStatus === 'Draft' ||
                          item.registrationStatus === 'Pending registration' ||
                          item.entryStatus === 'Draft') && (
                          <button
                            onClick={() => handleRegister(item)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 font-bold text-xs transition-colors border border-emerald-200"
                            title="Register Entry"
                          >
                            Register
                          </button>
                        )}

                        {/* 4. Update (for registered entries to modify status/timestamp) */}
                        {!item.isLocalDraft && item.rawEntry && (
                          <button
                            onClick={() => handleOpenUpdateModal(item.rawEntry!)}
                            className="px-2 py-1 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 font-semibold text-xs transition-colors border border-slate-200"
                            title="Update Entry Status"
                          >
                            Update
                          </button>
                        )}

                        {/* 5. Copy Link */}
                        <button
                          onClick={() => handleCopyLink(item.id)}
                          className="px-2 py-1 rounded-lg text-slate-700 hover:text-sky-700 hover:bg-slate-100 font-semibold text-xs transition-colors border border-slate-200 flex items-center gap-1"
                          title="Copy Link to Entry"
                        >
                          {copiedId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700 font-bold">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-400" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>

                        {/* Discard Draft option if it's local */}
                        {item.isLocalDraft && (
                          <button
                            onClick={handleDiscardDraft}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-colors"
                            title="Discard local draft"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Status Modal */}
      {editingEntry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-2xl w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150 my-8">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <SlidersHorizontal className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Update Entry Status & Arbitrum Registry</h3>
                  <span className="text-[11px] text-slate-500 font-mono">{editingEntry.id}</span>
                </div>
              </div>

              <button
                onClick={() => setEditingEntry(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Entry Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Active', 'Inactive', 'Draft'] as const).map((st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setModalEntryStatus(st)}
                        className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                          modalEntryStatus === st
                            ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Registration Status
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['Published', 'Pending registration', 'Draft'] as const).map((reg) => (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => setModalRegistrationStatus(reg)}
                        className={`py-2 px-1 text-[10px] font-bold rounded-xl border transition-all text-center leading-tight ${
                          modalRegistrationStatus === reg
                            ? 'bg-sky-50 border-sky-500 text-sky-700 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                        }`}
                      >
                        {reg}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* On-Chain Verification Card for Creator */}
              <div className="pt-2">
                <OnChainRegistryCard
                  entryId={editingEntry.id}
                  officialUrl={editingEntry.officialUrl}
                  creatorAddress={editingEntry.creatorAddress}
                  allowWrite={true}
                />
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-400">
                Changes saved to Entera off-chain index and optional Arbitrum smart contract
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingEntry(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={handleSaveStatusUpdate}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs shadow-sm transition-colors"
                >
                  Save Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
