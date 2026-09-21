import { ethers } from 'ethers';

export interface ArbitrumNetworkConfig {
  name: string;
  chainId: number;
  rpcUrl: string;
  explorerUrl: string;
  registryAddress: string;
}

export const ARBITRUM_NETWORKS: Record<string, ArbitrumNetworkConfig> = {
  'arbitrum-one': {
    name: 'Arbitrum One',
    chainId: 42161,
    rpcUrl: 'https://arb1.arbitrum.io/rpc',
    explorerUrl: 'https://arbiscan.io',
    registryAddress: '0x7134A6Eb79eF7c6a0c5c306C92e3B80E6E92b774'
  },
  'arbitrum-sepolia': {
    name: 'Arbitrum Sepolia (Testnet)',
    chainId: 421614,
    rpcUrl: 'https://sepolia-rollup.arbitrum.io/rpc',
    explorerUrl: 'https://sepolia.arbiscan.io',
    registryAddress: '0x2b874495c6418dDfc4fA689035B27dFFB8F899D4'
  }
};

export const ENTERA_REGISTRY_ABI = [
  'function createEntry(bytes32 entryId, string calldata destinationHash, string calldata metadataUri) external',
  'function updateEntry(bytes32 entryId, string calldata newDestinationHash, string calldata newMetadataUri) external',
  'function setStatus(bytes32 entryId, bool isActive) external',
  'function getEntry(bytes32 entryId) external view returns (bytes32 id, address owner, string destinationHash, string metadataUri, uint256 version, bool isActive, uint256 createdAt, uint256 updatedAt)',
  'function entryExists(bytes32 entryId) external view returns (bool)',
  'function totalEntries() external view returns (uint256)',
  'function entryIdAtIndex(uint256 index) external view returns (bytes32)',
  'event EntryCreated(bytes32 indexed entryId, address indexed owner, string destinationHash, string metadataUri, uint256 version, uint256 timestamp)',
  'event EntryUpdated(bytes32 indexed entryId, address indexed owner, string destinationHash, string metadataUri, uint256 newVersion, uint256 timestamp)',
  'event EntryStatusChanged(bytes32 indexed entryId, address indexed owner, bool indexed isActive, uint256 timestamp)'
];

export interface OnChainEntryData {
  id: string;
  owner: string;
  destinationHash: string;
  metadataUri: string;
  version: number;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
  blockNumber?: number;
  txHash?: string;
  source: 'live_rpc' | 'simulated_state';
}

export interface OnChainVerificationResult {
  status: 'verified' | 'not_registered' | 'unavailable' | 'loading';
  networkKey: 'arbitrum-one' | 'arbitrum-sepolia';
  networkName: string;
  chainId: number;
  contractAddress: string;
  entryIdString: string;
  entryIdBytes32: string;
  data?: OnChainEntryData;
  errorMessage?: string;
  queriedAt: string;
}

/**
 * Converts a human-readable entryId string into an immutable bytes32 representation
 */
export function entryIdToBytes32(entryId: string): string {
  const trimmed = entryId.trim();
  if (trimmed.startsWith('0x') && trimmed.length === 66) {
    return trimmed;
  }
  return ethers.keccak256(ethers.toUtf8Bytes(trimmed));
}

/**
 * Returns a read-only ethers JsonRpcProvider for the specified Arbitrum network
 */
export function getArbitrumProvider(networkKey: 'arbitrum-one' | 'arbitrum-sepolia' = 'arbitrum-one'): ethers.JsonRpcProvider {
  const config = ARBITRUM_NETWORKS[networkKey] || ARBITRUM_NETWORKS['arbitrum-one'];
  return new ethers.JsonRpcProvider(config.rpcUrl, config.chainId);
}

/**
 * Public function to fetch verified entry data directly from the Arbitrum blockchain
 * without requiring any wallet connection.
 */
export async function fetchOnChainEntry(
  entryId: string,
  networkKey: 'arbitrum-one' | 'arbitrum-sepolia' = 'arbitrum-one'
): Promise<OnChainVerificationResult> {
  const config = ARBITRUM_NETWORKS[networkKey] || ARBITRUM_NETWORKS['arbitrum-one'];
  const bytes32Id = entryIdToBytes32(entryId);
  const queriedAt = new Date().toLocaleTimeString();

  const baseResult: OnChainVerificationResult = {
    status: 'unavailable',
    networkKey,
    networkName: config.name,
    chainId: config.chainId,
    contractAddress: config.registryAddress,
    entryIdString: entryId,
    entryIdBytes32: bytes32Id,
    queriedAt
  };

  try {
    const provider = getArbitrumProvider(networkKey);

    // Timeout safety for public RPC nodes
    const providerTimeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Arbitrum RPC query timed out after 5000ms')), 5000)
    );

    const contract = new ethers.Contract(config.registryAddress, ENTERA_REGISTRY_ABI, provider);

    // Fetch bytecode first to verify contract existence at address
    const codePromise = provider.getCode(config.registryAddress);
    const code = await Promise.race([codePromise, providerTimeout]);

    if (!code || code === '0x' || code === '0x0') {
      // Contract is not deployed yet at this specific address on this live chain
      return {
        ...baseResult,
        status: 'not_registered',
        errorMessage: `Contract not yet deployed at ${config.registryAddress} on ${config.name}`
      };
    }

    // Call getEntry on the contract
    const entryPromise = contract.getEntry(bytes32Id);
    const result = await Promise.race([entryPromise, providerTimeout]);

    return {
      ...baseResult,
      status: 'verified',
      data: {
        id: result[0],
        owner: result[1],
        destinationHash: result[2],
        metadataUri: result[3],
        version: Number(result[4]),
        isActive: Boolean(result[5]),
        createdAt: Number(result[6]),
        updatedAt: Number(result[7]),
        source: 'live_rpc'
      }
    };
  } catch (err: any) {
    // Discriminate between "entry does not exist" vs "RPC unreachable"
    const message = err?.message || String(err);

    if (
      message.includes('EntryDoesNotExist') ||
      message.includes('revert') ||
      message.includes('execution reverted') ||
      message.includes('CALL_EXCEPTION')
    ) {
      return {
        ...baseResult,
        status: 'not_registered',
        errorMessage: 'Entry has not been registered in the Entera Arbitrum Registry smart contract yet.'
      };
    }

    // Connection or network error
    return {
      ...baseResult,
      status: 'unavailable',
      errorMessage: `Arbitrum RPC network node unreachable: ${message.slice(0, 100)}`
    };
  }
}

/**
 * Creator Write Action: Register entry on-chain using a browser wallet (MetaMask, Rabby, etc.)
 */
export async function createEntryOnChain(
  entryId: string,
  destinationHash: string,
  metadataUri: string,
  networkKey: 'arbitrum-one' | 'arbitrum-sepolia' = 'arbitrum-one'
): Promise<{ txHash: string; blockNumber?: number }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No Web3 wallet extension found. Please install MetaMask, Rabby, or an EIP-1193 compatible wallet.');
  }

  const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await browserProvider.getSigner();
  const config = ARBITRUM_NETWORKS[networkKey];

  // Request chain switch if needed
  try {
    await (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${config.chainId.toString(16)}` }]
    });
  } catch (switchError: any) {
    // If chain has not been added to MetaMask
    if (switchError.code === 4902) {
      await (window as any).ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [
          {
            chainId: `0x${config.chainId.toString(16)}`,
            chainName: config.name,
            rpcUrls: [config.rpcUrl],
            blockExplorerUrls: [config.explorerUrl],
            nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 }
          }
        ]
      });
    }
  }

  const contract = new ethers.Contract(config.registryAddress, ENTERA_REGISTRY_ABI, signer);
  const bytes32Id = entryIdToBytes32(entryId);

  const tx = await contract.createEntry(bytes32Id, destinationHash, metadataUri);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber
  };
}

/**
 * Creator Write Action: Update entry on-chain (Owner-only)
 */
export async function updateEntryOnChain(
  entryId: string,
  newDestinationHash: string,
  newMetadataUri: string,
  networkKey: 'arbitrum-one' | 'arbitrum-sepolia' = 'arbitrum-one'
): Promise<{ txHash: string; blockNumber?: number }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No Web3 wallet extension found.');
  }

  const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await browserProvider.getSigner();
  const config = ARBITRUM_NETWORKS[networkKey];

  const contract = new ethers.Contract(config.registryAddress, ENTERA_REGISTRY_ABI, signer);
  const bytes32Id = entryIdToBytes32(entryId);

  const tx = await contract.updateEntry(bytes32Id, newDestinationHash, newMetadataUri);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber
  };
}

/**
 * Creator Write Action: Set entry status on-chain (Owner-only)
 */
export async function setStatusOnChain(
  entryId: string,
  isActive: boolean,
  networkKey: 'arbitrum-one' | 'arbitrum-sepolia' = 'arbitrum-one'
): Promise<{ txHash: string; blockNumber?: number }> {
  if (typeof window === 'undefined' || !(window as any).ethereum) {
    throw new Error('No Web3 wallet extension found.');
  }

  const browserProvider = new ethers.BrowserProvider((window as any).ethereum);
  const signer = await browserProvider.getSigner();
  const config = ARBITRUM_NETWORKS[networkKey];

  const contract = new ethers.Contract(config.registryAddress, ENTERA_REGISTRY_ABI, signer);
  const bytes32Id = entryIdToBytes32(entryId);

  const tx = await contract.setStatus(bytes32Id, isActive);
  const receipt = await tx.wait();

  return {
    txHash: receipt.hash,
    blockNumber: receipt.blockNumber
  };
}
