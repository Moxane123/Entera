import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProtocolEntry, EnteraEntryDetails } from '../types';
import { EnteraLogo } from '../components/EnteraLogo';
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  ExternalLink,
  Save,
  Mail,
  User,
  Eye,
  Wallet,
  Coins,
  Compass,
  FileCheck,
  AlertCircle,
  Sparkles,
  Info,
  Check,
  Edit3
} from 'lucide-react';

const CATEGORIES = [
  'DEX & Liquidity',
  'Derivatives & Perps',
  'Lending',
  'Bridges',
  'Yield & Staking',
  'Infrastructure'
] as const;

const EXPERIENCE_LEVELS: EnteraEntryDetails['experienceLevel'][] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'All Experience Levels'
];

export const CreateEntryPage: React.FC = () => {
  const {
    creatorUser,
    loginCreator,
    signupCreator,
    addProtocolEntry,
    updateProtocolEntry,
    getEntry,
    navigate
  } = useApp();

  // Check if we are in Edit / Update mode
  const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
  const editId = searchParams ? searchParams.get('edit') : null;
  const existingEntry = editId ? getEntry(editId) : undefined;

  // Unauthenticated creator auth state
  const [authTab, setAuthTab] = useState<'signin' | 'signup'>('signin');
  const [authEmail, setAuthEmail] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Step state: 1 = Project & Audience, 2 = Understanding, 3 = Preparation & Destination, 4 = Preview & Register
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State according to prompt requirements
  // 1. Project
  const [projectName, setProjectName] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [category, setCategory] = useState<ProtocolEntry['category']>('DEX & Liquidity');

  // 2. Audience
  const [targetAudience, setTargetAudience] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<EnteraEntryDetails['experienceLevel']>('All Experience Levels');

  // 3. Understanding
  const [whatIsIt, setWhatIsIt] = useState('');
  const [problemSolved, setProblemSolved] = useState('');
  const [howItHelps, setHowItHelps] = useState('');

  // 4. Preparation
  const [whatUsersShouldKnow, setWhatUsersShouldKnow] = useState('');
  const [isWalletRequired, setIsWalletRequired] = useState<boolean>(true);
  const [financialOrAssetInteraction, setFinancialOrAssetInteraction] = useState<boolean>(true);

  // 5. Destination
  const [destinationUrl, setDestinationUrl] = useState('');

  // Feedback & Drafts
  const [formError, setFormError] = useState('');
  const [draftNotice, setDraftNotice] = useState('');
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Load existing entry if editing
  useEffect(() => {
    if (existingEntry) {
      if (existingEntry.entryDetails) {
        const ed = existingEntry.entryDetails;
        setProjectName(ed.projectName || existingEntry.name);
        setShortDescription(ed.shortDescription || existingEntry.tagline);
        setCategory((ed.category as ProtocolEntry['category']) || existingEntry.category);
        setTargetAudience(ed.targetAudience || '');
        setExperienceLevel(ed.experienceLevel || 'All Experience Levels');
        setWhatIsIt(ed.whatIsIt || existingEntry.description);
        setProblemSolved(ed.problemSolved || '');
        setHowItHelps(ed.howItHelps || '');
        setWhatUsersShouldKnow(ed.whatUsersShouldKnow || existingEntry.safety?.approvalWarning || '');
        setIsWalletRequired(ed.isWalletRequired !== undefined ? ed.isWalletRequired : true);
        setFinancialOrAssetInteraction(ed.financialOrAssetInteraction !== undefined ? ed.financialOrAssetInteraction : true);
        setDestinationUrl(ed.destinationUrl || existingEntry.officialUrl);
      } else {
        // Fallback to existing protocol entry fields
        setProjectName(existingEntry.name);
        setShortDescription(existingEntry.tagline);
        setCategory(existingEntry.category);
        setTargetAudience('Arbitrum Web3 users, liquidity providers, and builders');
        setExperienceLevel('All Experience Levels');
        setWhatIsIt(existingEntry.description);
        setProblemSolved('Provides high throughput, low gas cost liquidity and interactions on Arbitrum One.');
        setHowItHelps('Enables verified, reliable, and capital-efficient decentralized interactions.');
        setWhatUsersShouldKnow(existingEntry.safety?.approvalWarning || 'Verify contract allowances and network status before signing.');
        setIsWalletRequired(true);
        setFinancialOrAssetInteraction(true);
        setDestinationUrl(existingEntry.officialUrl);
      }
    } else {
      // Check for saved draft
      try {
        const savedDraft = localStorage.getItem('entera_entry_draft_v2');
        if (savedDraft) {
          const d = JSON.parse(savedDraft);
          if (d && !projectName) {
            setProjectName(d.projectName || '');
            setShortDescription(d.shortDescription || '');
            if (d.category) setCategory(d.category);
            setTargetAudience(d.targetAudience || '');
            if (d.experienceLevel) setExperienceLevel(d.experienceLevel);
            setWhatIsIt(d.whatIsIt || '');
            setProblemSolved(d.problemSolved || '');
            setHowItHelps(d.howItHelps || '');
            setWhatUsersShouldKnow(d.whatUsersShouldKnow || '');
            if (d.isWalletRequired !== undefined) setIsWalletRequired(d.isWalletRequired);
            if (d.financialOrAssetInteraction !== undefined) setFinancialOrAssetInteraction(d.financialOrAssetInteraction);
            setDestinationUrl(d.destinationUrl || '');
            if (d.savedAt) setLastSavedTime(d.savedAt);
            setDraftNotice('Restored your previously saved entry draft.');
          }
        }
      } catch {
        // Ignore
      }
    }
  }, [existingEntry]);

  // Auth Handlers for Unauthenticated Visitors
  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authEmail.includes('@')) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    setAuthError('');
    if (authTab === 'signin') {
      loginCreator(authEmail.trim());
    } else {
      signupCreator({
        email: authEmail.trim(),
        name: authName.trim() || authEmail.split('@')[0] || 'Entera Creator'
      });
    }
  };

  const handleQuickDemoAuth = () => {
    setAuthError('');
    loginCreator('maintainer@entera.app');
  };

  // If visitor is NOT authenticated, show the calm Entera Creator Access card
  if (!creatorUser) {
    return (
      <div className="max-w-md mx-auto py-8 px-4">
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl">
          {/* Ambient Curved Header Banner */}
          <div className="relative h-44 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex flex-col items-center justify-center p-6 text-center overflow-hidden">
            <div className="absolute -top-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
            <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-sky-300/20 rounded-3xl rotate-12 blur-md pointer-events-none" />

            <div className="relative z-10 w-14 h-14 rounded-2xl bg-white shadow-md flex items-center justify-center p-2 mb-2.5">
              <EnteraLogo size={42} />
            </div>

            <h1 className="relative z-10 text-xl font-extrabold text-white tracking-tight">
              Entera Creator Access
            </h1>
            <p className="relative z-10 text-xs text-blue-100 font-medium max-w-xs mt-0.5">
              Sign in or create an account to create, draft, or preview verified entries.
            </p>
          </div>

          <div className="p-6">
            {/* Minimal Segmented Tabs */}
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
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="maintainer@protocol.org"
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
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="e.g. Protocol Team"
                      className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                <span>Continue to Create Entry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-5 pt-3 border-t border-slate-100 flex flex-col items-center gap-2.5 text-center">
              <button
                type="button"
                onClick={handleQuickDemoAuth}
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

  // Save Draft Handler
  const handleSaveDraft = () => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const draftData = {
      projectName,
      shortDescription,
      category,
      targetAudience,
      experienceLevel,
      whatIsIt,
      problemSolved,
      howItHelps,
      whatUsersShouldKnow,
      isWalletRequired,
      financialOrAssetInteraction,
      destinationUrl,
      savedAt: now
    };
    try {
      localStorage.setItem('entera_entry_draft_v2', JSON.stringify(draftData));
      setLastSavedTime(now);
      setDraftNotice(`Draft saved successfully at ${now}`);
      setTimeout(() => setDraftNotice(''), 4000);
    } catch {
      // Ignore
    }
  };

  const handleClearDraft = () => {
    try {
      localStorage.removeItem('entera_entry_draft_v2');
      setLastSavedTime(null);
      setDraftNotice('Draft cleared.');
      setTimeout(() => setDraftNotice(''), 3000);
    } catch {
      // Ignore
    }
  };

  // Step Validation & Navigation
  const validateStep = (step: number): boolean => {
    setFormError('');
    if (step === 1) {
      if (!projectName.trim()) {
        setFormError('Please enter the project name.');
        return false;
      }
      if (!shortDescription.trim()) {
        setFormError('Please provide a short description for the project.');
        return false;
      }
      if (!targetAudience.trim()) {
        setFormError('Please specify who this application is for.');
        return false;
      }
    } else if (step === 2) {
      if (!whatIsIt.trim()) {
        setFormError('Please describe what the project is.');
        return false;
      }
      if (!problemSolved.trim()) {
        setFormError('Please explain what problem it solves.');
        return false;
      }
      if (!howItHelps.trim()) {
        setFormError('Please explain how it helps users.');
        return false;
      }
    } else if (step === 3) {
      if (!whatUsersShouldKnow.trim()) {
        setFormError('Please explain what users should know before interacting.');
        return false;
      }
      if (!destinationUrl.trim()) {
        setFormError('Please provide the official destination URL.');
        return false;
      }
      if (!destinationUrl.trim().startsWith('http')) {
        setFormError('The destination URL must start with https:// or http://');
        return false;
      }
    }
    return true;
  };

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 4) as any);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    setFormError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1) as any);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Registration / Submission Handler
  const handleRegisterEntry = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    // Full validation
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) {
      return;
    }

    const slug = projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const entryId = existingEntry ? existingEntry.id : `${slug}-arbitrum`;

    const structuredDetails: EnteraEntryDetails = {
      projectName: projectName.trim(),
      shortDescription: shortDescription.trim(),
      category,
      targetAudience: targetAudience.trim(),
      experienceLevel,
      whatIsIt: whatIsIt.trim(),
      problemSolved: problemSolved.trim(),
      howItHelps: howItHelps.trim(),
      whatUsersShouldKnow: whatUsersShouldKnow.trim(),
      isWalletRequired,
      financialOrAssetInteraction,
      destinationUrl: destinationUrl.trim()
    };

    const entryData: ProtocolEntry = {
      id: entryId,
      name: projectName.trim(),
      slug,
      tagline: shortDescription.trim(),
      description: whatIsIt.trim() || shortDescription.trim(),
      category,
      network: 'arbitrum-one',
      chainId: 42161,
      officialUrl: destinationUrl.trim(),
      docsUrl: destinationUrl.trim(),
      arbiscanUrl: existingEntry?.arbiscanUrl || `https://arbiscan.io`,
      status: 'verified',
      verificationBadge: 'Verified Canonical',
      verifiedTimestamp: existingEntry ? existingEntry.verifiedTimestamp : new Date().toISOString(),
      creatorAddress: creatorUser.email,
      entryDetails: structuredDetails,
      contracts: existingEntry?.contracts || [],
      safety: existingEntry?.safety || {
        approvalPolicy: financialOrAssetInteraction ? 'Exact Amount Recommended' : 'Limited Approval',
        approvalWarning: whatUsersShouldKnow.trim(),
        commonFunctions: [],
        emergencyPause: false,
        adminControls: 'Admin controls maintained by verified protocol team.',
        knownRisks: financialOrAssetInteraction ? ['Market & asset interaction risks apply.'] : []
      },
      audits: existingEntry?.audits || []
    };

    if (existingEntry) {
      updateProtocolEntry(existingEntry.id, entryData);
    } else {
      addProtocolEntry(entryData);
      try {
        localStorage.removeItem('entera_entry_draft_v2');
      } catch {
        // Ignore
      }
    }

    navigate(`/entry/${entryData.id}`);
  };

  const stepsList = [
    { num: 1, title: 'Project & Audience', desc: 'Identity and users' },
    { num: 2, title: 'Understanding', desc: 'Core purpose and value' },
    { num: 3, title: 'Preparation & Link', desc: 'Readiness and destination' },
    { num: 4, title: 'Preview & Register', desc: 'Verification check' }
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-24">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded-md border border-blue-200/60">
              Entera Creator Studio
            </span>
            <span className="text-xs text-slate-500">
              • Signed in as <span className="font-semibold text-slate-700">{creatorUser.name}</span>
            </span>
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {existingEntry ? 'Update Entera Entry' : 'Create Structured Entry'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Structured information layer: Project identity, audience, understanding, and interaction readiness.
          </p>
        </div>

        {/* Draft controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            title="Save draft to local session"
          >
            <Save className="w-3.5 h-3.5 text-blue-600" />
            <span>Save Draft</span>
          </button>

          {lastSavedTime && (
            <span className="hidden sm:inline text-[11px] text-slate-600 font-mono">
              Saved {lastSavedTime}
            </span>
          )}

          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors"
          >
            Dashboard
          </button>
        </div>
      </div>

      {/* Draft banner notice */}
      {draftNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-medium flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{draftNotice}</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearDraft}
              className="text-slate-500 hover:text-slate-800 text-xs underline"
            >
              Clear
            </button>
            <button
              onClick={() => setDraftNotice('')}
              className="text-emerald-700 hover:text-emerald-900 text-xs font-bold ml-2"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Form Error Notice */}
      {formError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl font-medium flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
          <span>{formError}</span>
        </div>
      )}

      {/* Stepped Progress Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-3 sm:p-4 shadow-xs">
        <div className="grid grid-cols-4 gap-2">
          {stepsList.map((step) => {
            const isCompleted = currentStep > step.num;
            const isCurrent = currentStep === step.num;
            return (
              <button
                key={step.num}
                type="button"
                onClick={() => {
                  // Allow jumping back to earlier steps or to preview if valid
                  if (step.num < currentStep) {
                    setCurrentStep(step.num as any);
                  } else if (step.num === 4) {
                    if (validateStep(1) && validateStep(2) && validateStep(3)) {
                      setCurrentStep(4);
                    }
                  }
                }}
                className={`p-2 rounded-xl text-left transition-all ${
                  isCurrent
                    ? 'bg-blue-50/80 border border-blue-200'
                    : isCompleted
                    ? 'bg-slate-50 hover:bg-slate-100 cursor-pointer border border-transparent'
                    : 'opacity-60 cursor-not-allowed border border-transparent'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-600 text-white'
                        : isCurrent
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3" /> : step.num}
                  </div>
                  <span
                    className={`text-xs font-bold truncate ${
                      isCurrent ? 'text-blue-950' : 'text-slate-700'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
                <p className="hidden md:block text-[10px] text-slate-600 truncate pl-6">
                  {step.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* STEP 1: Project & Audience */}
      {/* ======================================================== */}
      {currentStep === 1 && (
        <div className="space-y-6">
          {/* Section 1: Project */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded">
                Part 1 of 4
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Project Information</h2>
              <p className="text-xs text-slate-600">
                Identify the application or protocol and its primary category.
              </p>
            </div>

            <div className="space-y-4">
              {/* Project Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Project Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Camelot, GMX, Uniswap"
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Short Description <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="e.g. Ecosystem-focused decentralized exchange offering flexible and dynamic liquidity."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
                <p className="text-[11px] text-slate-600 mt-1">
                  A concise 1-sentence overview displayed on entry cards and explorer listings.
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCategory(cat)}
                      className={`px-3 py-2 text-xs font-semibold rounded-xl text-left border transition-all ${
                        category === cat
                          ? 'bg-blue-50 text-blue-700 border-blue-300 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Audience */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Audience Information</h2>
              <p className="text-xs text-slate-600">
                Define the intended users and required level of experience.
              </p>
            </div>

            <div className="space-y-4">
              {/* Who is it for? */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Who is it for? <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. DeFi traders seeking low-slippage execution and native liquidity providers."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Experience Level */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Experience Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {EXPERIENCE_LEVELS.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setExperienceLevel(level)}
                      className={`px-3 py-2.5 text-xs font-semibold rounded-xl text-center border transition-all ${
                        experienceLevel === level
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Step 1 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleSaveDraft}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Save Draft</span>
            </button>

            <button
              type="button"
              onClick={handleNextStep}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
            >
              <span>Next: Understanding</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 2: Understanding */}
      {/* ======================================================== */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded">
                Part 2 of 4
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Understanding</h2>
              <p className="text-xs text-slate-600">
                Help users understand what the project is, the problem it addresses, and how it delivers value.
              </p>
            </div>

            {/* What is it? */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                What is it? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={whatIsIt}
                onChange={(e) => setWhatIsIt(e.target.value)}
                placeholder="Explain the application simply and objectively in 2-3 clear sentences."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* What problem does it solve? */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                What problem does it solve? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={problemSolved}
                onChange={(e) => setProblemSolved(e.target.value)}
                placeholder="e.g. Traditional AMMs fracture ecosystem liquidity. This provides custom fee tiers and concentrated efficiency."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>

            {/* How does it help? */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                How does it help? <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                value={howItHelps}
                onChange={(e) => setHowItHelps(e.target.value)}
                placeholder="e.g. Users trade with lower slippage and minimal gas fees while liquidity providers gain directional fee control."
                className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* Step 2 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous: Project & Audience</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <span>Next: Preparation & Destination</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 3: Preparation & Destination */}
      {/* ======================================================== */}
      {currentStep === 3 && (
        <div className="space-y-6">
          {/* Preparation Information */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-700 rounded">
                Part 3 of 4
              </span>
              <h2 className="text-base font-bold text-slate-900 mt-1">Preparation</h2>
              <p className="text-xs text-slate-600">
                Inform users of required prerequisites and interaction safety before they engage.
              </p>
            </div>

            <div className="space-y-4">
              {/* What should users know? */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  What should users know? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={whatUsersShouldKnow}
                  onChange={(e) => setWhatUsersShouldKnow(e.target.value)}
                  placeholder="e.g. Always confirm token contract addresses before swapping; verify exact allowance requests in your wallet."
                  className="w-full px-3.5 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  required
                />
              </div>

              {/* Toggles: Wallet Required & Financial Interaction */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Wallet Required */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <label className="text-xs font-bold text-slate-900">
                      Is a wallet required?
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Does the application require connecting an EVM/Web3 wallet to function?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsWalletRequired(true)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        isWalletRequired
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Yes, Wallet Required
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsWalletRequired(false)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        !isWalletRequired
                          ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      No Wallet Needed
                    </button>
                  </div>
                </div>

                {/* Financial / Asset Interaction */}
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <label className="text-xs font-bold text-slate-900">
                      Financial or Asset Interaction?
                    </label>
                  </div>
                  <p className="text-[11px] text-slate-600">
                    Does it involve depositing, swapping, transferring, or approving tokens?
                  </p>
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setFinancialOrAssetInteraction(true)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        financialOrAssetInteraction
                          ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      Yes, Asset Risk
                    </button>
                    <button
                      type="button"
                      onClick={() => setFinancialOrAssetInteraction(false)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                        !financialOrAssetInteraction
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      No Financial Risk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Destination */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-base font-bold text-slate-900">Official Destination</h2>
              <p className="text-xs text-slate-600">
                The canonical website or application URL where verified interactions occur.
              </p>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Official Destination URL <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Compass className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="url"
                  value={destinationUrl}
                  onChange={(e) => setDestinationUrl(e.target.value)}
                  placeholder="https://app.camelot.exchange"
                  className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-mono transition-colors"
                  required
                />
              </div>
              <p className="text-[11px] text-slate-600 mt-1">
                Enter the exact canonical origin (starting with https://). This is verified on Entera's canonical link registry.
              </p>
            </div>
          </div>

          {/* Step 3 Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Previous: Understanding</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-blue-600" />
                <span className="hidden sm:inline">Save Draft</span>
              </button>

              <button
                type="button"
                onClick={handleNextStep}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4" />
                <span>Preview Structured Entry</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* STEP 4: Preview & Register */}
      {/* ======================================================== */}
      {currentStep === 4 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Top Banner indicating preview state */}
          <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-blue-950">
                  Pre-Registration Entry Preview
                </h2>
                <p className="text-xs text-blue-700 mt-0.5">
                  Review your structured Entera Entry below exactly as public visitors will see it.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="px-3 py-1.5 text-xs font-bold text-slate-700 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg flex items-center gap-1 shadow-xs transition-colors"
              >
                <Edit3 className="w-3 h-3 text-blue-600" />
                <span>Edit Fields</span>
              </button>

              <button
                type="button"
                onClick={() => handleRegisterEntry()}
                className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-600/25 transition-all flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{existingEntry ? 'Save Changes' : 'Register Entry'}</span>
              </button>
            </div>
          </div>

          {/* ======================================= */}
          {/* LIVE SIMULATED ENTERA ENTRY CARD VIEW   */}
          {/* ======================================= */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden divide-y divide-slate-100">
            {/* Entry Hero Header */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Verified Canonical Entry
                  </span>
                  <span className="px-2.5 py-1 text-xs font-mono font-medium text-slate-600 bg-slate-100 rounded-lg">
                    Arbitrum One (42161)
                  </span>
                </div>

                <span className="px-3 py-1 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200/60 rounded-full">
                  {category}
                </span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {projectName || 'Untitled Project'}
                </h1>
                <p className="text-sm sm:text-base text-slate-600 mt-1">
                  {shortDescription || 'No description provided.'}
                </p>
              </div>

              {/* Destination URL Bar */}
              <div className="pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-blue-600 shrink-0" />
                    <div>
                      <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600">
                        Canonical Destination
                      </span>
                      <a
                        href={destinationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-blue-600 hover:underline font-semibold flex items-center gap-1"
                      >
                        {destinationUrl || 'https://...'}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>

                  <span className="self-start sm:self-center px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded">
                    Official Origin Verified
                  </span>
                </div>
              </div>
            </div>

            {/* Audience Section */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span>Audience</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200/60">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Who is it for?
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                    {targetAudience || 'Not specified'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Experience Level
                  </span>
                  <span className="inline-block px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-800 text-center shadow-xs">
                    {experienceLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Understanding Section */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span>Understanding</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    What is it?
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {whatIsIt || 'No details provided'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    What problem does it solve?
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {problemSolved || 'No details provided'}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 block">
                    How does it help?
                  </span>
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {howItHelps || 'No details provided'}
                  </p>
                </div>
              </div>
            </div>

            {/* Preparation Section */}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <span>Preparation</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700 block">
                  What should users know?
                </span>
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed">
                  {whatUsersShouldKnow || 'No special requirements specified'}
                </p>
              </div>

              {/* Requirement Pills */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-blue-600" />
                    <span className="text-xs font-bold text-slate-800">Wallet Requirement</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                      isWalletRequired
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {isWalletRequired ? 'Wallet Required' : 'No Wallet Needed'}
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-slate-800">Financial / Asset Risk</span>
                  </div>
                  <span
                    className={`px-2.5 py-1 text-[11px] font-bold rounded-md ${
                      financialOrAssetInteraction
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {financialOrAssetInteraction ? 'Asset Interaction' : 'Informational Only'}
                  </span>
                </div>
              </div>
            </div>

            {/* Arbitrum Registry On-Chain Layer Preview */}
            <div className="p-6 sm:p-8 bg-sky-50/40 border-t border-slate-200/80 space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                  Arbitrum Registry Verification Specs (EnteraRegistry.sol)
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-sky-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Target Registry Chain</span>
                  <span className="font-semibold text-slate-800">Arbitrum One (Chain ID 42161)</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sky-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Immutable Entry ID</span>
                  <span className="font-mono font-semibold text-slate-800 truncate block">
                    {projectName ? `${projectName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-arbitrum` : 'pending-id'}
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sky-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Destination Proof</span>
                  <span className="font-mono text-slate-700 truncate block">{destinationUrl || 'https://arbitrum.io'}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-sky-100 space-y-0.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Initial Contract Version</span>
                  <span className="font-mono font-bold text-slate-900">v1.0 (Active)</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                Smart contract enforces immutable Entry ID assignment, owner-only revisions, and holds zero funds or governance tokens.
              </p>
            </div>

            {/* Creator Maintainer Signature Footer */}
            <div className="p-6 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-medium">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>Verified Creator: {creatorUser.name} ({creatorUser.email})</span>
              </span>
              <span className="font-mono text-[11px]">
                Ready to register on Entera
              </span>
            </div>
          </div>

          {/* Step 4 Bottom Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handlePrevStep}
              className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Preparation</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-3.5 h-3.5 text-blue-600" />
                <span>Save Draft</span>
              </button>

              <button
                type="button"
                onClick={() => handleRegisterEntry()}
                className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-600/25 transition-all active:scale-[0.98] flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{existingEntry ? 'Save & Publish Changes' : 'Confirm & Register Entry'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
