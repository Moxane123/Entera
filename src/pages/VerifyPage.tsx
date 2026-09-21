import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Search,
  Lock,
  Globe,
  FileCheck2,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { fetchOnChainEntry, OnChainVerificationResult, entryIdToBytes32 } from '../lib/arbitrumRegistry';

interface VerifyPageProps {
  targetId?: string;
}

/**
 * Normalizes a URL for canonical matching (protocol, trailing slash, www, lowercase host)
 */
function normalizeUrl(url: string): string {
  try {
    const trimmed = url.trim();
    if (!trimmed) return '';
    const withProtocol = /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
    const parsed = new URL(withProtocol);
    const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
    const pathname = parsed.pathname.replace(/\/+$/, '') || '';
    return `${parsed.protocol}//${host}${pathname}${parsed.search}`;
  } catch {
    return url.trim().toLowerCase().replace(/\/+$/, '');
  }
}

export const VerifyPage: React.FC<VerifyPageProps> = ({ targetId }) => {
  const { entries, navigate, currentPath } = useApp();

  // Extract any destination override from query params if passed, e.g. /verify/uniswap-v3-arbitrum?dest=...
  const queryParams = new URLSearchParams(
    typeof window !== 'undefined' ? window.location.search : ''
  );
  const queryDestination = queryParams.get('destination') || queryParams.get('dest') || queryParams.get('url');

  const [inputEntryId, setInputEntryId] = useState<string>(targetId || '');
  const [copied, setCopied] = useState(false);
  const [onChainResult, setOnChainResult] = useState<OnChainVerificationResult | null>(null);
  const [isQueryingRpc, setIsQueryingRpc] = useState(false);

  // Allow visitor to compare a custom link or test a URL against the registered record
  const [customDestinationInput, setCustomDestinationInput] = useState<string>('');
  const [showCustomComparison, setShowCustomComparison] = useState(false);

  // Sync state when targetId prop changes
  useEffect(() => {
    if (targetId) {
      setInputEntryId(targetId);
      setShowCustomComparison(Boolean(queryDestination));
      if (queryDestination) {
        setCustomDestinationInput(queryDestination);
      }
    }
  }, [targetId, queryDestination]);

  // Find corresponding canonical entry from off-chain registry
  const matchedEntry = entries.find((e) =>
    e.id.toLowerCase() === (targetId || inputEntryId).trim().toLowerCase() ||
    e.slug.toLowerCase() === (targetId || inputEntryId).trim().toLowerCase() ||
    e.contracts.some((c) => c.address.toLowerCase() === (targetId || inputEntryId).trim().toLowerCase())
  );

  const activeEntryId = targetId || matchedEntry?.id || inputEntryId.trim();

  // Fetch on-chain registry state when activeEntryId is available
  useEffect(() => {
    if (!activeEntryId) {
      setOnChainResult(null);
      return;
    }

    let isMounted = true;
    setIsQueryingRpc(true);

    fetchOnChainEntry(activeEntryId, 'arbitrum-one')
      .then((res) => {
        if (isMounted) {
          setOnChainResult(res);
          setIsQueryingRpc(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setOnChainResult({
            status: 'unavailable',
            networkKey: 'arbitrum-one',
            networkName: 'Arbitrum One',
            chainId: 42161,
            contractAddress: '0x7134A6Eb79eF7c6a0c5c306C92e3B80E6E92b774',
            entryIdString: activeEntryId,
            entryIdBytes32: entryIdToBytes32(activeEntryId),
            errorMessage: err?.message || 'Arbitrum RPC unavailable',
            queriedAt: new Date().toLocaleTimeString()
          });
          setIsQueryingRpc(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [activeEntryId]);

  // Extract Essential Properties
  const entryId = matchedEntry?.id || (targetId ? targetId : '');
  const registeredDestination =
    onChainResult?.data?.destinationHash ||
    matchedEntry?.entryDetails?.destinationUrl ||
    matchedEntry?.officialUrl ||
    '';

  const entryStatus: 'Active' | 'Inactive' | 'Draft' =
    onChainResult?.data !== undefined
      ? onChainResult.data.isActive
        ? 'Active'
        : 'Inactive'
      : matchedEntry?.entryStatus || 'Active';

  const version: string = onChainResult?.data?.version
    ? `v${onChainResult.data.version}.0`
    : 'v1.0';

  const registrationStatus: string =
    onChainResult?.status === 'verified'
      ? 'Published (Arbitrum Registry)'
      : matchedEntry?.registrationStatus || 'Published';

  // Compare destination
  const currentDestinationToCompare = customDestinationInput.trim()
    ? customDestinationInput.trim()
    : registeredDestination;

  const destinationMatches =
    Boolean(registeredDestination) &&
    normalizeUrl(currentDestinationToCompare) === normalizeUrl(registeredDestination);

  // Determine Verification Result Status
  let verificationOutcome: 'MATCH_ACTIVE' | 'INACTIVE' | 'UNABLE_TO_VERIFY';

  if (!entryId || (!matchedEntry && onChainResult?.status !== 'verified')) {
    verificationOutcome = 'UNABLE_TO_VERIFY';
  } else if (!destinationMatches) {
    verificationOutcome = 'UNABLE_TO_VERIFY';
  } else if (entryStatus === 'Inactive') {
    verificationOutcome = 'INACTIVE';
  } else if (entryStatus === 'Active' && destinationMatches) {
    verificationOutcome = 'MATCH_ACTIVE';
  } else {
    verificationOutcome = 'UNABLE_TO_VERIFY';
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Sample quick select IDs
  const quickSelectEntries = [
    { id: 'uniswap-v3-arbitrum', label: 'Uniswap v3' },
    { id: 'gmx-v2-arbitrum', label: 'GMX v2' },
    { id: 'aave-v3-arbitrum', label: 'Aave v3' },
    { id: 'camelot-v3-arbitrum', label: 'Camelot v3' },
    { id: 'arbitrum-bridge', label: 'Arbitrum Bridge' }
  ];

  // ----------------------------------------------------
  // Render: Search / Lookup Screen (When no ID is provided)
  // ----------------------------------------------------
  if (!targetId) {
    return (
      <div className="max-w-2xl mx-auto py-8 sm:py-12 space-y-8 animate-in fade-in duration-150">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-sky-600" />
            <span>Entera Registry • Destination Verification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Verify Protocol Destination
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            Verify official destination records before connecting your wallet or signing transactions. No wallet required.
          </p>
        </div>

        {/* Search / Entry ID Form */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-xs space-y-4">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
            Enter Entera Entry ID
          </label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={inputEntryId}
                onChange={(e) => setInputEntryId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && inputEntryId.trim()) {
                    navigate(`/verify/${inputEntryId.trim()}`);
                  }
                }}
                placeholder="e.g. uniswap-v3-arbitrum"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
            <button
              onClick={() => {
                if (inputEntryId.trim()) {
                  navigate(`/verify/${inputEntryId.trim()}`);
                }
              }}
              disabled={!inputEntryId.trim()}
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors disabled:opacity-50 shadow-xs"
            >
              Verify Record
            </button>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Canonical Registered Entries
            </span>
            <div className="flex flex-wrap gap-2">
              {quickSelectEntries.map((item) => (
                <button
                  key={item.id}
                  onClick={() => navigate(`/verify/${item.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-800 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <span>{item.label}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Neutral Disclaimer */}
        <div className="text-center text-xs text-slate-500 leading-relaxed px-4">
          Entera verifies the registered destination record only. Entera has not audited, approved, or declared any project safe.
        </div>
      </div>
    );
  }

  // ----------------------------------------------------
  // Render: Dedicated "/verify/:id" Destination Verification Screen
  // ----------------------------------------------------
  return (
    <div className="max-w-2xl mx-auto py-6 sm:py-10 space-y-6 animate-in fade-in duration-150">
      {/* Top Breadcrumb & Share */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <button
          onClick={() => navigate('/verify')}
          className="hover:text-slate-900 font-medium flex items-center gap-1 transition-colors"
        >
          <span>← Verify Another Entry</span>
        </button>

        <button
          onClick={handleCopyLink}
          className="p-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1.5 text-xs font-medium"
          title="Copy verification URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Share Verification'}</span>
        </button>
      </div>

      {/* Main Verification Card */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        {/* Header Ribbon */}
        <div className="p-5 sm:p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Entera Registry Destination Verification
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-0.5">
              {matchedEntry?.name || entryId}
            </h1>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 sm:p-7 space-y-6">
          {/* PRIMARY VERIFICATION RESULT BANNER */}
          {verificationOutcome === 'MATCH_ACTIVE' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50 border border-emerald-200/90 text-emerald-950 flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <Check className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-emerald-950 leading-tight">
                  Destination matches the active Entry record.
                </h2>
                <p className="text-xs text-emerald-800 leading-relaxed">
                  The verified URL matches the registered destination record for this active Entry in the Entera Registry.
                </p>
              </div>
            </div>
          )}

          {verificationOutcome === 'INACTIVE' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-950 flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <AlertCircle className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-amber-950 leading-tight">
                  This Entry is currently inactive.
                </h2>
                <p className="text-xs text-amber-800 leading-relaxed">
                  This protocol entry is marked inactive by its maintainer. Interactive usage is currently suspended.
                </p>
              </div>
            </div>
          )}

          {verificationOutcome === 'UNABLE_TO_VERIFY' && (
            <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border border-rose-200/90 text-rose-950 flex items-start gap-3.5 shadow-xs">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                <ShieldAlert className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-1">
                <h2 className="text-base sm:text-lg font-bold text-rose-950 leading-tight">
                  Unable to verify the current destination record.
                </h2>
                <p className="text-xs text-rose-800 leading-relaxed">
                  {!entryId || (!matchedEntry && onChainResult?.status !== 'verified')
                    ? `No entry matching "${activeEntryId}" was found in the Entera Registry.`
                    : 'The current destination does not match the registered destination reference.'}
                </p>
              </div>
            </div>
          )}

          {/* ESSENTIAL INFORMATION TABLE */}
          <div className="rounded-xl border border-slate-200/90 divide-y divide-slate-100 bg-white overflow-hidden text-xs">
            {/* 1. Entry ID */}
            <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/50 transition-colors">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Entry ID
              </span>
              <span className="font-mono font-semibold text-slate-900 text-xs sm:text-sm">
                {entryId || '—'}
              </span>
            </div>

            {/* 2. Status */}
            <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/50 transition-colors">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Status
              </span>
              <div>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full font-bold text-xs ${
                    entryStatus === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : entryStatus === 'Inactive'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                      entryStatus === 'Active'
                        ? 'bg-emerald-600'
                        : entryStatus === 'Inactive'
                        ? 'bg-amber-600'
                        : 'bg-slate-500'
                    }`}
                  />
                  {entryStatus}
                </span>
              </div>
            </div>

            {/* 3. Version */}
            <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/50 transition-colors">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Version
              </span>
              <span className="font-mono font-bold text-slate-900">
                {version}
              </span>
            </div>

            {/* 4. Registered Destination */}
            <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/50 transition-colors">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Registered Destination
              </span>
              <span className="font-mono font-semibold text-sky-700 break-all sm:text-right">
                {registeredDestination || 'Not registered'}
              </span>
            </div>

            {/* 5. Registration Status */}
            <div className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-1 hover:bg-slate-50/50 transition-colors">
              <span className="font-bold text-slate-500 uppercase tracking-wider text-[10px]">
                Registration Status
              </span>
              <span className="font-semibold text-slate-800">
                {registrationStatus}
              </span>
            </div>
          </div>

          {/* Optional Test URL Comparison Accordion */}
          <div className="pt-1">
            {!showCustomComparison ? (
              <button
                type="button"
                onClick={() => setShowCustomComparison(true)}
                className="text-xs text-sky-600 hover:text-sky-800 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>Compare a custom link against this record</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
                    Compare Incoming Link
                  </span>
                  <button
                    onClick={() => {
                      setShowCustomComparison(false);
                      setCustomDestinationInput('');
                    }}
                    className="text-slate-400 hover:text-slate-600 text-[11px]"
                  >
                    Reset to default
                  </button>
                </div>
                <input
                  type="text"
                  value={customDestinationInput}
                  onChange={(e) => setCustomDestinationInput(e.target.value)}
                  placeholder="Paste URL to test (e.g. https://app.uniswap.org)"
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
                <p className="text-[11px] text-slate-500">
                  Verify whether an external link matches the registered record before clicking.
                </p>
              </div>
            )}
          </div>

          {/* PRIMARY ACTION: Continue to Official Destination */}
          {verificationOutcome === 'MATCH_ACTIVE' && registeredDestination && (
            <div className="pt-2 space-y-3">
              <a
                href={registeredDestination}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-6 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm shadow-sm hover:shadow transition-all flex items-center justify-center gap-2"
              >
                <span>Continue to Official Destination</span>
                <ExternalLink className="w-4 h-4" />
              </a>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
                <span>The visitor manually chooses whether to continue.</span>
                <span>•</span>
                <span>No automatic redirect</span>
                <span>•</span>
                <span>No wallet connection required</span>
              </div>
            </div>
          )}

          {/* Secondary Action Link to Full Entry */}
          {matchedEntry && (
            <div className="pt-2 text-center">
              <button
                onClick={() => navigate(`/entry/${matchedEntry.id}`)}
                className="text-xs text-slate-600 hover:text-slate-900 font-semibold inline-flex items-center gap-1 transition-colors"
              >
                <span>View Full Protocol Step-by-Step Breakdown ({matchedEntry.name})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* MANDATORY LEGAL & SAFETY DISCLAIMER */}
        <div className="p-4 sm:p-5 bg-slate-50/80 border-t border-slate-100 text-[11px] text-slate-500 leading-relaxed space-y-1">
          <span className="font-bold uppercase tracking-wider text-slate-600 block text-[10px]">
            Verification Scope & Disclaimer
          </span>
          <p>
            Entera verifies the registered destination record only. Never claim that Entera has audited, approved, or declared a project safe. Users must conduct their own independent verification before connecting Web3 wallets or approving smart contract allowances.
          </p>
        </div>
      </div>
    </div>
  );
};
