import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  ArrowLeft,
  ShieldCheck,
  ExternalLink,
  Copy,
  Check,
  Lock,
  AlertTriangle,
  FileCheck2,
  CheckCircle2,
  Info,
  ChevronRight,
  ChevronDown,
  Sparkles,
  Edit3,
  Wallet,
  Coins,
  Compass,
  UserCheck,
  Globe,
  HelpCircle,
  Eye,
  SlidersHorizontal,
  X,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { ProtocolEntry, EnteraEntryDetails } from '../types';
import { OnChainRegistryCard } from '../components/OnChainRegistryCard';

interface EntryDetailPageProps {
  entryId: string;
}

type AudienceMode = 'newbie' | 'familiar';

export const EntryDetailPage: React.FC<EntryDetailPageProps> = ({ entryId }) => {
  const { getEntry, navigate, creatorUser, openAuthModal } = useApp();
  const entry = getEntry(entryId);

  // Audience Presentation Mode (New to Web3 vs Familiar with Web3)
  const [audienceMode, setAudienceMode] = useState<AudienceMode>('newbie');
  const [selectedCreatorAudience, setSelectedCreatorAudience] = useState<string | null>(null);

  // Interaction & Verification States
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);
  const [isDestinationModalOpen, setIsDestinationModalOpen] = useState(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const scrollToStep = (stepNumber: number) => {
    setActiveStep(stepNumber);
    const element = document.getElementById(`step-${stepNumber}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!entry) {
    return (
      <div className="py-20 text-center space-y-4">
        <ShieldCheck className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Protocol Entry Not Found</h2>
        <p className="text-xs text-slate-500">
          The requested entry ID <code className="text-sky-600 font-mono">{entryId}</code> is not in the verified registry.
        </p>
        <button
          onClick={() => navigate('/explore')}
          className="px-4 py-2 text-xs font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-700 transition-colors"
        >
          Return to Explore
        </button>
      </div>
    );
  }

  // Resolve structured entry details with fallback to canonical fields
  const details: EnteraEntryDetails = entry.entryDetails || {
    projectName: entry.name,
    shortDescription: entry.tagline || entry.description,
    category: entry.category,
    targetAudience: 'DeFi traders, ecosystem participants, and on-chain liquidity providers.',
    experienceLevel: 'All Experience Levels',
    whatIsIt: entry.description,
    problemSolved: 'Provides trust-minimized, gas-efficient decentralized infrastructure on Arbitrum One.',
    howItHelps: 'Enables users to interact directly with audited smart contracts with low fees and instant settlement.',
    whatUsersShouldKnow: entry.safety.approvalWarning || 'Verify contract addresses, slippage settings, and wallet signing requests.',
    isWalletRequired: true,
    financialOrAssetInteraction: true,
    destinationUrl: entry.officialUrl
  };

  // Extract creator-specified audiences for the interactive selector
  const creatorAudiences = details.targetAudience
    .split(/[,•;]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const destinationDomain = (() => {
    try {
      return new URL(details.destinationUrl || entry.officialUrl).hostname;
    } catch {
      return details.destinationUrl || entry.officialUrl;
    }
  })();

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(null), 2000);
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  const handleOpenDestination = () => {
    const targetUrl = details.destinationUrl || entry.officialUrl;
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
    setIsDestinationModalOpen(false);
  };

  const handleUpdateEntry = () => {
    if (creatorUser) {
      navigate(`/create?edit=${entry.id}`);
    } else {
      openAuthModal(`/create?edit=${entry.id}`);
    }
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Top Utility Header & Zero-Barrier Trust Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/explore')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors self-start"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Registry</span>
        </button>

        {/* Public Access Badge */}
        <div className="flex items-center gap-2 flex-wrap text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200/80">
            <Eye className="w-3 h-3 text-slate-500" />
            Public Entry • No Wallet or Account Required
          </span>

          <span className="font-mono text-slate-500">
            Chain ID: {entry.chainId} (Arbitrum One)
          </span>

          {creatorUser && (
            <button
              onClick={handleUpdateEntry}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white hover:bg-slate-100 text-slate-700 font-semibold border border-slate-200 transition-colors"
            >
              <Edit3 className="w-3 h-3 text-blue-600" />
              <span>Update Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header & Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-sky-500/20 shrink-0">
              {entry.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">{entry.name}</h1>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Canonical
                </span>
                <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                  {entry.category}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">{details.shortDescription}</p>
              
              <div className="flex items-center gap-2 mt-2 text-xs text-slate-500">
                <span className="font-medium text-slate-700">Verified: {new Date(entry.verifiedTimestamp).toLocaleDateString()}</span>
                <span>•</span>
                <span>Registry ID: #{entry.id.toUpperCase().slice(0, 10)}</span>
              </div>
            </div>
          </div>

          {/* Quick jump to verified destination button */}
          <button
            onClick={() => setIsDestinationModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm shadow-sky-600/20 transition-colors shrink-0 self-start"
          >
            <span>Continue to Official Destination</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Audience Selector Bar: New to Web3 vs Familiar with Web3 */}
        <div className="pt-4 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Audience Mode:
            </span>
            <div className="inline-flex p-0.5 bg-slate-100 rounded-xl border border-slate-200">
              <button
                onClick={() => setAudienceMode('newbie')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  audienceMode === 'newbie'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                New to Web3
              </button>
              <button
                onClick={() => setAudienceMode('familiar')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  audienceMode === 'familiar'
                    ? 'bg-white text-sky-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Familiar with Web3
              </button>
            </div>
          </div>

          {/* Creator Tagged Audiences */}
          {creatorAudiences.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-medium text-slate-500">Creator Tagged:</span>
              {creatorAudiences.map((aud, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedCreatorAudience(selectedCreatorAudience === aud ? null : aud)}
                  className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                    selectedCreatorAudience === aud
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                  title="Filter context by creator audience"
                >
                  {aud}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Progressive Step Navigator Indicator */}
      <div className="bg-slate-100/70 p-2 rounded-2xl border border-slate-200/80 flex items-center justify-between text-[11px] font-semibold text-slate-600 overflow-x-auto gap-1.5 sticky top-16 z-20 backdrop-blur-md">
        <button
          onClick={() => scrollToStep(1)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeStep === 1
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
            activeStep === 1 ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-700'
          }`}>1</span>
          What is it?
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <button
          onClick={() => scrollToStep(2)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeStep === 2
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
            activeStep === 2 ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-700'
          }`}>2</span>
          Who is it for?
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <button
          onClick={() => scrollToStep(3)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeStep === 3
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
            activeStep === 3 ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-700'
          }`}>3</span>
          How does it help?
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <button
          onClick={() => scrollToStep(4)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeStep === 4
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
            activeStep === 4 ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-700'
          }`}>4</span>
          What should I know?
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <button
          onClick={() => scrollToStep(5)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeStep === 5
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center font-bold ${
            activeStep === 5 ? 'bg-white text-sky-700' : 'bg-sky-100 text-sky-700'
          }`}>5</span>
          Verify destination
        </button>
        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
        <button
          onClick={() => scrollToStep(6)}
          className={`px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shrink-0 transition-all ${
            activeStep === 6
              ? 'bg-sky-600 text-white shadow-xs font-bold'
              : 'bg-slate-800 text-white hover:bg-slate-700'
          }`}
        >
          <span className="w-4 h-4 rounded-full bg-white text-slate-900 text-[10px] flex items-center justify-center font-bold">6</span>
          Continue
        </button>
      </div>

      {/* 1. What is it? */}
      <section id="step-1" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center justify-center">
            1
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">What is it?</h2>
          <span className="text-xs text-slate-400 font-medium">• Core Definition</span>
        </div>

        {/* Presentation tailored by audience mode */}
        {audienceMode === 'newbie' ? (
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
              {details.whatIsIt}
            </p>
            <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/60 flex items-start gap-2.5 text-xs text-sky-900">
              <Info className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
              <span>
                <strong>Plain Terms:</strong> Think of this as a direct digital service on the Arbitrum network that you use straight from your personal wallet. There is no bank, company broker, or central server holding your assets.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                ✓ 100% Self-Custodial
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                ✓ No Account Registration Required
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold">
                ✓ Direct On-Chain Execution
              </span>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm sm:text-base text-slate-800 font-medium leading-relaxed">
              {details.whatIsIt}
            </p>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start gap-2.5 text-xs text-slate-700">
              <Compass className="w-4 h-4 text-slate-600 shrink-0 mt-0.5" />
              <span>
                <strong>Architecture:</strong> Smart contract protocol deployed on Arbitrum One rollup (Chain ID: 42161). Interacts directly via EVM calls with verifiable canonical bytecode and decentralized liquidity routing.
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap pt-1 font-mono text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                Network: Arbitrum One
              </span>
              <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-800">
                Category: {entry.category}
              </span>
              <span className="px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                Source: Verified on Arbiscan
              </span>
            </div>
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => scrollToStep(2)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Next: Who is it for?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 2. Who is it for? */}
      <section id="step-2" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center justify-center">
            2
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Who is it for?</h2>
          <span className="text-xs text-slate-400 font-medium">• Intended Audience</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Primary Audience
            </span>
            <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
              {details.targetAudience}
            </p>
            {audienceMode === 'newbie' && (
              <p className="text-xs text-slate-600 pt-1">
                You do not need any coding or technical finance expertise to start. Basic wallet familiarity is all that is required.
              </p>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 flex flex-col justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Experience Level
            </span>
            <div>
              <span className="inline-block px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-xs">
                {details.experienceLevel}
              </span>
              <span className="block text-[10px] text-slate-500 mt-1">Designated by creator</span>
            </div>
          </div>
        </div>

        {creatorAudiences.length > 0 && (
          <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/60 flex items-center gap-2 flex-wrap text-xs">
            <span className="font-semibold text-slate-700">Creator Target Profiles:</span>
            {creatorAudiences.map((aud, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-md bg-white border border-slate-200 font-medium text-slate-800 shadow-xs">
                {aud}
              </span>
            ))}
          </div>
        )}

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => scrollToStep(3)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Next: How does it help?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 3. How does it help? */}
      <section id="step-3" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center justify-center">
            3
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">How does it help?</h2>
          <span className="text-xs text-slate-400 font-medium">• Purpose & Utility</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/60 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
              What Problem Does It Solve?
            </span>
            <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
              {details.problemSolved}
            </p>
          </div>

          <div className="p-4 rounded-xl bg-sky-50/50 border border-sky-200/60 space-y-1.5">
            <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 block">
              How Does It Help You?
            </span>
            <p className="text-xs sm:text-sm text-sky-950 leading-relaxed font-medium">
              {details.howItHelps}
            </p>
          </div>
        </div>

        {/* 3 Key Benefit Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
            <span className="text-xs font-bold text-slate-800 block">Sub-Cent Gas Fees</span>
            <span className="text-[11px] text-slate-500 block leading-tight">Leverages Arbitrum Layer 2 rollup efficiency</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
            <span className="text-xs font-bold text-slate-800 block">No Custodial Intermediaries</span>
            <span className="text-[11px] text-slate-500 block leading-tight">You hold private keys and funds at all times</span>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-white space-y-0.5">
            <span className="text-xs font-bold text-slate-800 block">24/7 Global Liquidity</span>
            <span className="text-[11px] text-slate-500 block leading-tight">Autonomous smart contracts without business hours</span>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => scrollToStep(4)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Next: What should I know?</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 4. What should I know? */}
      <section id="step-4" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center justify-center">
            4
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">What should I know?</h2>
          <span className="text-xs text-slate-400 font-medium">• Preparation & Precautions</span>
        </div>

        {/* Core preparation cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Wallet required card */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-600" />
                <span className="text-xs font-bold text-slate-800">Wallet Prerequisite</span>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  details.isWalletRequired
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-slate-200 text-slate-700'
                }`}
              >
                {details.isWalletRequired ? 'Wallet Required' : 'No Wallet Needed'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {audienceMode === 'newbie'
                ? 'To interact on the destination app, you will need a Web3 wallet (such as MetaMask, Rabby, or Coinbase Wallet) containing a small amount of ETH on Arbitrum to cover network gas.'
                : 'Direct interactions require an EVM-compatible wallet connected to Arbitrum One RPC (Chain ID: 42161).'}
            </p>
          </div>

          {/* Asset & Financial Interaction */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Coins className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-slate-800">Financial Interaction</span>
              </div>
              <span
                className={`px-2 py-0.5 text-[10px] font-bold rounded ${
                  details.financialOrAssetInteraction
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}
              >
                {details.financialOrAssetInteraction ? 'Asset Risk Involved' : 'Non-Financial'}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {audienceMode === 'newbie'
                ? 'Moving, swapping, or staking tokens carries price volatility risk. Never execute transactions with funds you cannot afford to lose.'
                : 'Transactions involve smart contract asset transfer, allowance approvals, and market liquidity risk.'}
            </p>
          </div>
        </div>

        {/* What users should know advisory box */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="text-xs font-bold text-slate-800">Important Safety Notice</span>
          </div>
          <p className="text-xs text-slate-700 leading-relaxed">
            {details.whatUsersShouldKnow}
          </p>
        </div>

        {/* Approval Policy Advisory */}
        <div className="p-4 rounded-xl bg-sky-50/70 border border-sky-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="font-bold text-sky-950 block">
              Recommended Approval Policy: {entry.safety.approvalPolicy}
            </span>
            <p className="text-sky-900 text-[11px] leading-relaxed">
              {audienceMode === 'newbie'
                ? 'When a Web3 app asks to "approve" a token, it is asking for permission to spend it. Always select the exact amount you want to trade rather than infinite.'
                : entry.safety.approvalWarning || 'Restrict allowances to verified canonical Router deployments on Arbitrum One.'}
            </p>
          </div>
          <span className="px-2.5 py-1 text-[10px] font-bold bg-white text-sky-700 border border-sky-200 rounded-md shrink-0 self-start sm:self-center shadow-xs">
            Strict Allowance
          </span>
        </div>

        {/* Expandable Technical Details: Smart Contracts, Audits & Bytecode Inspection */}
        <div className="pt-2">
          <button
            onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center justify-between transition-colors"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-slate-600" />
              <span>
                {showTechnicalDetails ? 'Hide' : 'Show'} Advanced Verification Details ({entry.contracts.length} Contracts, {entry.audits.length} Audits)
              </span>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                showTechnicalDetails ? 'rotate-180' : ''
              }`}
            />
          </button>

          {showTechnicalDetails && (
            <div className="mt-3 space-y-4 pt-2 border-t border-slate-100">
              {/* Canonical Contracts */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Canonical Smart Contracts
                </span>
                <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden text-xs">
                  {entry.contracts.map((c) => (
                    <div key={c.address} className="p-3 hover:bg-slate-50 transition-colors space-y-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{c.name}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded">
                            {c.role}
                          </span>
                        </div>
                        <button
                          onClick={() => navigate(`/verify/${c.address}`)}
                          className="text-[11px] text-sky-600 hover:underline font-semibold flex items-center gap-1"
                        >
                          <span>Inspect Bytecode</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[11px] text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-200/60">
                        <span className="break-all">{c.address}</span>
                        <button
                          onClick={() => handleCopy(c.address)}
                          className="ml-auto text-slate-400 hover:text-slate-800 shrink-0"
                          title="Copy address"
                        >
                          {copiedAddress === c.address ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audits */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Security Audits
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {entry.audits.map((audit, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{audit.auditor}</span>
                        <span className="text-[10px] font-mono text-slate-500">{audit.date}</span>
                      </div>
                      <p className="text-[11px] text-slate-600">{audit.summary}</p>
                      <a
                        href={audit.reportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[10px] font-semibold text-sky-600 hover:underline inline-flex items-center gap-1 pt-0.5"
                      >
                        <span>Audit Report</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="pt-2 flex justify-end">
          <button
            onClick={() => scrollToStep(5)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Next: Verify destination</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 5. Verify destination */}
      <section id="step-5" className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-7 shadow-xs space-y-4 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-100 text-sky-700 text-xs font-extrabold flex items-center justify-center">
            5
          </span>
          <h2 className="text-base sm:text-lg font-bold text-slate-900">Verify destination</h2>
          <span className="text-xs text-slate-400 font-medium">• Anti-Phishing Guard</span>
        </div>

        <p className="text-xs sm:text-sm text-slate-600">
          Confirm that the web address you are visiting matches the canonical official domain registered on Entera.
        </p>

        {/* High-visibility Canonical Domain Box */}
        <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Official Canonical URL
              </span>
              <div className="flex items-center gap-2 mt-0.5">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="text-base sm:text-lg font-bold font-mono text-slate-900 break-all select-all">
                  {details.destinationUrl || entry.officialUrl}
                </span>
              </div>
            </div>

            <button
              onClick={() => handleCopyUrl(details.destinationUrl || entry.officialUrl)}
              className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-center"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>

          {/* Verification parameters grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs pt-2 border-t border-slate-200/60">
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/60">
              <span className="text-[10px] text-slate-500 block font-medium">Domain Host</span>
              <span className="font-mono font-semibold text-slate-800">{destinationDomain}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/60">
              <span className="text-[10px] text-slate-500 block font-medium">Security Protocol</span>
              <span className="font-mono font-semibold text-emerald-700">HTTPS (TLS Encrypted)</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-slate-200/60">
              <span className="text-[10px] text-slate-500 block font-medium">Registry Status</span>
              <span className="font-semibold text-emerald-700">Verified Canonical ✓</span>
            </div>
          </div>

          {/* Anti-phishing notice */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Phishing Warning:</strong> Fake clones and Google search ads frequently impersonate Web3 protocols. Entera will never redirect you automatically. Bookmark this verified URL and check your address bar before signing any transaction.
            </p>
          </div>
        </div>

        {/* Real Arbitrum Registry Blockchain Verification Layer */}
        <OnChainRegistryCard
          entryId={entry.id}
          officialUrl={details.destinationUrl || entry.officialUrl}
          creatorAddress={entry.creatorAddress}
        />

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <button
            onClick={() => navigate(`/verify/${entry.id}`)}
            className="text-xs font-semibold text-slate-700 hover:text-sky-700 bg-white border border-slate-200 px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-2xs w-fit"
          >
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Open Dedicated Destination Verification Screen (/verify/{entry.id})</span>
          </button>

          <button
            onClick={() => scrollToStep(6)}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors"
          >
            <span>Next: Continue to Official Destination</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* 6. Continue (Final Action) */}
      <section id="step-6" className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-6 sm:p-8 shadow-md space-y-4 scroll-mt-28">
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg bg-sky-500 text-white text-xs font-extrabold flex items-center justify-center">
            6
          </span>
          <h2 className="text-lg font-bold text-white">Continue to Destination</h2>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
          You are ready to access {entry.name}. By continuing, you will open the verified destination in a new browser tab.
        </p>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 pt-2">
          {/* Final Action Button: "Continue to Official Destination" */}
          <button
            onClick={() => setIsDestinationModalOpen(true)}
            className="px-6 py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 transition-all transform active:scale-95"
          >
            <span>Continue to Official Destination</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>

          <span className="text-xs text-slate-400">
            Destination: <code className="text-sky-300 font-mono">{destinationDomain}</code>
          </span>
        </div>
      </section>

      {/* Destination Confirmation Safe Modal (Guarantees no automatic redirect) */}
      {isDestinationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Destination Verification</h3>
                  <span className="text-[11px] text-slate-500">Leaving Entera Registry</span>
                </div>
              </div>

              <button
                onClick={() => setIsDestinationModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Destination summary */}
            <div className="space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                You are opening the verified destination for <strong>{entry.name}</strong>. Please confirm the URL matches the protocol you wish to interact with:
              </p>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-slate-900 font-bold break-all flex items-center gap-2">
                <Globe className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{details.destinationUrl || entry.officialUrl}</span>
              </div>

              {/* Safety checklist */}
              <div className="space-y-2 text-xs text-slate-700 pt-1">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Verified Canonical domain recorded on Entera Arbitrum registry.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Entera does not connect to your wallet or store private keys.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Opens securely in a new browser tab with strict referral isolation.</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDestinationModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
              >
                Stay on Entera
              </button>

              <button
                onClick={handleOpenDestination}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm shadow-sky-600/20 transition-colors"
              >
                <span>Open Verified Destination</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
