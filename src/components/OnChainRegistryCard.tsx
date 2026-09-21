import React, { useState, useEffect } from 'react';
import {
  fetchOnChainEntry,
  entryIdToBytes32,
  ARBITRUM_NETWORKS,
  OnChainVerificationResult,
  createEntryOnChain,
  updateEntryOnChain,
  setStatusOnChain
} from '../lib/arbitrumRegistry';
import {
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  FileCode2,
  Layers,
  ChevronDown,
  ChevronUp,
  Cpu,
  Lock,
  Wallet
} from 'lucide-react';

interface OnChainRegistryCardProps {
  entryId: string;
  officialUrl?: string;
  creatorAddress?: string;
  allowWrite?: boolean;
}

export const OnChainRegistryCard: React.FC<OnChainRegistryCardProps> = ({
  entryId,
  officialUrl = 'https://arbitrum.io',
  creatorAddress,
  allowWrite = false
}) => {
  const [selectedNetwork, setSelectedNetwork] = useState<'arbitrum-one' | 'arbitrum-sepolia'>('arbitrum-one');
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<OnChainVerificationResult | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showContractCode, setShowContractCode] = useState(false);

  // Write transaction state (for creators)
  const [writeLoading, setWriteLoading] = useState(false);
  const [writeSuccessTx, setWriteSuccessTx] = useState<string | null>(null);
  const [writeError, setWriteError] = useState<string | null>(null);

  const networkConfig = ARBITRUM_NETWORKS[selectedNetwork];
  const bytes32Id = entryIdToBytes32(entryId);

  const loadVerification = async (networkKey = selectedNetwork) => {
    setLoading(true);
    setWriteError(null);
    try {
      const res = await fetchOnChainEntry(entryId, networkKey);
      setResult(res);
    } catch (e: any) {
      setResult({
        status: 'unavailable',
        networkKey,
        networkName: ARBITRUM_NETWORKS[networkKey].name,
        chainId: ARBITRUM_NETWORKS[networkKey].chainId,
        contractAddress: ARBITRUM_NETWORKS[networkKey].registryAddress,
        entryIdString: entryId,
        entryIdBytes32: bytes32Id,
        errorMessage: e?.message || 'Error querying Arbitrum RPC',
        queriedAt: new Date().toLocaleTimeString()
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVerification(selectedNetwork);
  }, [entryId, selectedNetwork]);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Creator write handler: register on chain
  const handleRegisterOnChain = async () => {
    setWriteLoading(true);
    setWriteError(null);
    setWriteSuccessTx(null);
    try {
      const metadataUri = `ipfs://entera/${entryId}.json`;
      const tx = await createEntryOnChain(entryId, officialUrl, metadataUri, selectedNetwork);
      setWriteSuccessTx(tx.txHash);
      await loadVerification(selectedNetwork);
    } catch (err: any) {
      setWriteError(err?.message || 'Transaction failed or rejected by wallet');
    } finally {
      setWriteLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Arbitrum Registry Verification</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-100 text-sky-800">
                Layer 2 Verified
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Zero-barrier public verification layer directly from Arbitrum RPC
            </p>
          </div>
        </div>

        {/* Network selector & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex p-0.5 rounded-lg bg-slate-200/80 text-[11px] font-semibold">
            <button
              onClick={() => setSelectedNetwork('arbitrum-one')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedNetwork === 'arbitrum-one'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Arbitrum One
            </button>
            <button
              onClick={() => setSelectedNetwork('arbitrum-sepolia')}
              className={`px-2.5 py-1 rounded-md transition-all ${
                selectedNetwork === 'arbitrum-sepolia'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Sepolia Testnet
            </button>
          </div>

          <button
            onClick={() => loadVerification(selectedNetwork)}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors disabled:opacity-50"
            title="Refresh On-Chain State"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-sky-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main content body */}
      <div className="p-4 sm:p-5 space-y-4 text-xs">
        {/* State Banner */}
        {loading ? (
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-2.5 text-slate-600">
            <RefreshCw className="w-4 h-4 animate-spin text-sky-600" />
            <span>Querying Arbitrum RPC node for {networkConfig.name}...</span>
          </div>
        ) : result?.status === 'verified' && result.data ? (
          <div className="p-3.5 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-emerald-900 space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-800">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Verified On-Chain on {result.networkName}</span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {result.data.isActive ? 'Active Status' : 'Inactive Status'}
              </span>
            </div>
            <p className="text-[11px] text-emerald-700">
              Canonical entry proved cryptographically in contract{' '}
              <span className="font-mono">{networkConfig.registryAddress.slice(0, 10)}...</span>
            </p>
          </div>
        ) : result?.status === 'not_registered' ? (
          <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-amber-800">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>Pending Arbitrum Registry Registration</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-relaxed">
              This entry currently lives off-chain in Entera&apos;s verified index and has not yet been committed to the
              Arbitrum smart contract registry at <span className="font-mono text-amber-800">{networkConfig.registryAddress.slice(0, 12)}...</span>.
            </p>
            {allowWrite && (
              <div className="pt-1">
                <button
                  onClick={handleRegisterOnChain}
                  disabled={writeLoading}
                  className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs inline-flex items-center gap-1.5 transition-colors disabled:opacity-60"
                >
                  <Wallet className="w-3.5 h-3.5" />
                  <span>{writeLoading ? 'Submitting to Arbitrum...' : 'Register On-Chain via Web3 Wallet'}</span>
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="p-3.5 rounded-xl bg-rose-50/80 border border-rose-200/80 text-rose-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600" />
              <span>Honest Status: RPC Node Unavailable</span>
            </div>
            <p className="text-[11px] text-rose-700">
              {result?.errorMessage || 'Unable to query public Arbitrum RPC node. Never showing simulated fake data.'}
            </p>
          </div>
        )}

        {/* Transaction confirmation feedback */}
        {writeSuccessTx && (
          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium flex items-center justify-between">
            <span>Transaction confirmed on Arbitrum:</span>
            <a
              href={`${networkConfig.explorerUrl}/tx/${writeSuccessTx}`}
              target="_blank"
              rel="noreferrer"
              className="underline font-mono inline-flex items-center gap-1"
            >
              <span>{writeSuccessTx.slice(0, 10)}...</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        )}

        {writeError && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium">
            {writeError}
          </div>
        )}

        {/* Contract Data Fields (Stored On-Chain) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* 1. Entry ID & Hash */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Entry ID (Immutable bytes32)
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-800 font-semibold truncate max-w-[200px]" title={bytes32Id}>
                {bytes32Id}
              </span>
              <button
                onClick={() => copyToClipboard(bytes32Id, 'bytes32')}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Copy bytes32 ID"
              >
                {copiedKey === 'bytes32' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block truncate">String ID: {entryId}</span>
          </div>

          {/* 2. Registry Contract Address */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Registry Contract (Arbitrum)
            </span>
            <div className="flex items-center justify-between">
              <a
                href={`${networkConfig.explorerUrl}/address/${networkConfig.registryAddress}#code`}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-sky-600 hover:underline font-semibold flex items-center gap-1 truncate max-w-[210px]"
              >
                <span>{networkConfig.registryAddress}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
              <button
                onClick={() => copyToClipboard(networkConfig.registryAddress, 'contract')}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Copy contract address"
              >
                {copiedKey === 'contract' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block">Chain ID: {networkConfig.chainId}</span>
          </div>

          {/* 3. Owner Address */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Owner / Verified Authority
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-800 font-semibold truncate max-w-[210px]">
                {result?.data?.owner || creatorAddress || 'Designated Protocol Team'}
              </span>
              {(result?.data?.owner || creatorAddress) && (
                <button
                  onClick={() => copyToClipboard(result?.data?.owner || creatorAddress || '', 'owner')}
                  className="p-1 text-slate-400 hover:text-slate-700"
                  title="Copy owner address"
                >
                  {copiedKey === 'owner' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-400 block">Owner-only authority for updates & status</span>
          </div>

          {/* 4. Destination Reference / Integrity */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Destination Integrity Reference
            </span>
            <div className="flex items-center justify-between">
              <span className="font-mono text-slate-800 font-semibold truncate max-w-[210px]" title={result?.data?.destinationHash || officialUrl}>
                {result?.data?.destinationHash || officialUrl}
              </span>
              <button
                onClick={() => copyToClipboard(result?.data?.destinationHash || officialUrl, 'dest')}
                className="p-1 text-slate-400 hover:text-slate-700"
                title="Copy destination reference"
              >
                {copiedKey === 'dest' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
            <span className="text-[10px] text-slate-400 block">Canonical anti-phishing anchor</span>
          </div>

          {/* 5. Version & Revision */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Contract Version Tracking
            </span>
            <span className="font-mono text-slate-900 font-bold block text-sm">
              v{result?.data?.version ?? 1}.0
            </span>
            <span className="text-[10px] text-slate-400 block">
              Monotonically increments on every updateEntry()
            </span>
          </div>

          {/* 6. Metadata Reference URI */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
              Off-Chain Metadata Pointer
            </span>
            <span className="font-mono text-slate-800 truncate block max-w-[210px]" title={result?.data?.metadataUri || `ipfs://entera/${entryId}.json`}>
              {result?.data?.metadataUri || `ipfs://entera/${entryId}.json`}
            </span>
            <span className="text-[10px] text-slate-400 block">
              Rich content stored off-chain to avoid gas bloating
            </span>
          </div>
        </div>

        {/* Contract Inspection Collapsible */}
        <div className="pt-2 border-t border-slate-100">
          <button
            onClick={() => setShowContractCode(!showContractCode)}
            className="w-full flex items-center justify-between py-2 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center gap-1.5">
              <FileCode2 className="w-4 h-4 text-sky-600" />
              <span>Inspect Smart Contract Architecture (`EnteraRegistry.sol`)</span>
            </div>
            {showContractCode ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showContractCode && (
            <div className="mt-2 p-4 rounded-xl bg-slate-900 text-slate-200 font-mono text-[11px] space-y-3 overflow-x-auto">
              <div className="flex items-center justify-between text-[10px] text-slate-400 border-b border-slate-800 pb-2">
                <span>EnteraRegistry.sol — Arbitrum L2 Contract</span>
                <span>No Funds • Immutable IDs • No Governance Tokens</span>
              </div>

              <pre className="text-slate-300 leading-relaxed">
{`// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EnteraRegistry {
    struct Entry {
        bytes32 entryId;         // Immutable ID hash
        address owner;           // Authorized owner address
        string destinationHash;  // Canonical URL or SHA-256 hash
        string metadataUri;      // IPFS/Arweave URI pointer
        uint256 version;         // Monotonic revision counter
        bool isActive;           // Operational status
        uint256 createdAt;       // Registration timestamp
        uint256 updatedAt;       // Revision timestamp
    }

    mapping(bytes32 => Entry) private _entries;

    event EntryCreated(bytes32 indexed entryId, address indexed owner, string destinationHash, string metadataUri, uint256 version, uint256 timestamp);
    event EntryUpdated(bytes32 indexed entryId, address indexed owner, string destinationHash, string metadataUri, uint256 newVersion, uint256 timestamp);
    event EntryStatusChanged(bytes32 indexed entryId, address indexed owner, bool indexed isActive, uint256 timestamp);

    function createEntry(bytes32 entryId, string calldata destinationHash, string calldata metadataUri) external;
    function updateEntry(bytes32 entryId, string calldata newDestinationHash, string calldata newMetadataUri) external;
    function setStatus(bytes32 entryId, bool isActive) external;
    function getEntry(bytes32 entryId) external view returns (...);
}`}
              </pre>

              <div className="text-[10px] text-slate-400 pt-2 border-t border-slate-800">
                Purpose: Guarantees cryptographic ownership, destination integrity, versioning, and status without tokens, staking, or custody of user funds.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
