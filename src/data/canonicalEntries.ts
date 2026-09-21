import { ProtocolEntry } from '../types';

export const INITIAL_CANONICAL_ENTRIES: ProtocolEntry[] = [
  {
    id: 'uniswap-v3-arbitrum',
    name: 'Uniswap v3',
    slug: 'uniswap-v3',
    tagline: 'Concentrated liquidity automated market maker protocol',
    description: 'Uniswap v3 introduces concentrated liquidity and multiple fee tiers on Arbitrum One, offering high capital efficiency and low gas routing.',
    category: 'DEX & Liquidity',
    network: 'arbitrum-one',
    chainId: 42161,
    officialUrl: 'https://app.uniswap.org',
    docsUrl: 'https://docs.uniswap.org',
    arbiscanUrl: 'https://arbiscan.io/address/0xE592427A0AEce92De3Edee1F18E0157C05861564',
    status: 'verified',
    verificationBadge: 'Verified Canonical',
    verifiedTimestamp: '2023-08-14T00:00:00Z',
    audits: [
      {
        auditor: 'OpenZeppelin',
        date: 'March 2021',
        reportUrl: 'https://blog.openzeppelin.com/uniswap-v3-audit',
        summary: 'Comprehensive audit of core pool math and position management.'
      },
      {
        auditor: 'Trail of Bits',
        date: 'April 2021',
        reportUrl: 'https://github.com/trailofbits/publications/blob/master/reviews/UniswapV3.pdf',
        summary: 'Static analysis and formal verification of tick transitions and invariant preservation.'
      }
    ],
    contracts: [
      {
        name: 'SwapRouter02',
        address: '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
        role: 'Primary Swap Router',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Immutable Core'
      },
      {
        name: 'SwapRouter',
        address: '0xE592427A0AEce92De3Edee1F18E0157C05861564',
        role: 'Legacy v3 Router',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Immutable Core'
      },
      {
        name: 'UniswapV3Factory',
        address: '0x1F98431c8aD98523631AE4a59f267346ea31F984',
        role: 'Pool Deployer & Factory',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Uniswap Governance Timelock'
      },
      {
        name: 'NonfungiblePositionManager',
        address: '0xC36442b4a4522E871399CD717aBDD847Ab11FE88',
        role: 'LP NFT Position Manager',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Immutable Core'
      }
    ],
    safety: {
      approvalPolicy: 'Exact Amount Recommended',
      approvalWarning: 'While Permit2 is supported on Uniswap v3, avoid signing unlimited token approvals on unknown token pairs.',
      commonFunctions: [
        {
          signature: 'exactInputSingle((address,address,uint24,address,uint256,uint256,uint160))',
          description: 'Direct trade of an exact token amount through a single pool',
          riskLevel: 'Low'
        },
        {
          signature: 'exactInput((bytes,address,uint256,uint256))',
          description: 'Multi-hop swap across several pools with slippage protection',
          riskLevel: 'Low'
        },
        {
          signature: 'mint((address,address,uint24,int24,int24,uint256,uint256,uint256,uint256,address,uint256))',
          description: 'Creates a concentrated liquidity position returning an ERC-721 token',
          riskLevel: 'Medium'
        }
      ],
      emergencyPause: false,
      adminControls: 'Uniswap v3 core pools are non-upgradable and immutable. Factory fee governance has zero custody over user assets.',
      knownRisks: [
        'Slippage loss on volatile pairs without strict minAmountOut parameters',
        'Impermanent loss for concentrated liquidity providers'
      ]
    },
    entryDetails: {
      projectName: 'Uniswap v3',
      shortDescription: 'Concentrated liquidity automated market maker protocol on Arbitrum One.',
      category: 'DEX & Liquidity',
      targetAudience: 'DeFi traders, token swappers, and automated liquidity providers.',
      experienceLevel: 'All Experience Levels',
      whatIsIt: 'A decentralized exchange protocol that allows direct, non-custodial swaps of ERC-20 tokens on Arbitrum One.',
      problemSolved: 'Eliminates reliance on centralized brokers or exchanges, removing withdrawal limits and single points of custody failure.',
      howItHelps: 'Lets users swap tokens at low fees with custom concentrated liquidity ranges for maximal capital efficiency.',
      whatUsersShouldKnow: 'Token swaps require an ERC-20 token approval before executing. Review slippage settings on volatile token pairs.',
      isWalletRequired: true,
      financialOrAssetInteraction: true,
      destinationUrl: 'https://app.uniswap.org'
    }
  },
  {
    id: 'gmx-v2-arbitrum',
    name: 'GMX v2',
    slug: 'gmx-v2',
    tagline: 'Decentralized perpetual and spot exchange on Arbitrum',
    description: 'GMX v2 provides low swap fees and zero price impact trades for perpetual contracts and spot assets with isolated GM liquidity pools.',
    category: 'Derivatives & Perps',
    network: 'arbitrum-one',
    chainId: 42161,
    officialUrl: 'https://app.gmx.io',
    docsUrl: 'https://docs.gmx.io',
    arbiscanUrl: 'https://arbiscan.io/address/0x7452c558d45f8afC8c83dAe62C3f86874049311e',
    status: 'verified',
    verificationBadge: 'Verified Canonical',
    verifiedTimestamp: '2023-08-01T00:00:00Z',
    audits: [
      {
        auditor: 'ABDK Consulting',
        date: 'July 2023',
        reportUrl: 'https://github.com/gmx-io/gmx-synthetics/tree/main/audits',
        summary: 'Security review of GMX synthetics and isolated GM market contracts.'
      }
    ],
    contracts: [
      {
        name: 'ExchangeRouter',
        address: '0x7452c558d45f8afC8c83dAe62C3f86874049311e',
        role: 'Primary Exchange Router',
        proxyType: 'EIP-1967 Transparent',
        verifiedOnArbiscan: true,
        timelockHours: 24,
        multisigThreshold: '4/7 GMX Governance Safe'
      },
      {
        name: 'OrderVault',
        address: '0xC8ee487B228B02613dC26075dB2F062c3f84F667',
        role: 'Collateral & Order Execution Vault',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 24,
        multisigThreshold: '4/7 GMX Governance Safe'
      },
      {
        name: 'Reader',
        address: '0x2b8A21A111005b63486c476A8D00c30aC74F05A8',
        role: 'State & Price Query Reader',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Read Only'
      }
    ],
    safety: {
      approvalPolicy: 'Exact Amount Recommended',
      approvalWarning: 'Deposit approvals should only be given to the verified ExchangeRouter on Arbitrum One.',
      commonFunctions: [
        {
          signature: 'createOrder((address,address,uint256,uint256,uint8,uint8,bool,uint256))',
          description: 'Submits a limit, market, or trigger position order to the OrderVault',
          riskLevel: 'Medium'
        },
        {
          signature: 'cancelOrder(bytes32)',
          description: 'Cancels an unexecuted pending order and returns collateral to the user',
          riskLevel: 'Low'
        }
      ],
      emergencyPause: true,
      adminControls: 'GMX admin keys are held by a 4/7 multi-sig with a 24-hour timelock on key market parameters.',
      knownRisks: [
        'Liquidation risk if collateral value falls below maintenance threshold',
        'Oracle pricing latency during severe market dislocations'
      ]
    },
    entryDetails: {
      projectName: 'GMX v2',
      shortDescription: 'Decentralized spot and perpetual exchange with isolated liquidity pools.',
      category: 'Derivatives & Perps',
      targetAudience: 'Perpetual traders, hedgers, and GM liquidity providers.',
      experienceLevel: 'Intermediate',
      whatIsIt: 'A non-custodial derivatives exchange allowing up to 50x leveraged long and short positions directly on Arbitrum One.',
      problemSolved: 'Solves high liquidation slippage and counterparty risk common in opaque offshore centralized derivatives platforms.',
      howItHelps: 'Offers zero price impact execution via Chainlink low-latency oracles with segregated risk pools.',
      whatUsersShouldKnow: 'Leveraged positions carry liquidation risk if margin falls below maintenance requirements. Never trade with funds you cannot afford to lose.',
      isWalletRequired: true,
      financialOrAssetInteraction: true,
      destinationUrl: 'https://app.gmx.io'
    }
  },
  {
    id: 'aave-v3-arbitrum',
    name: 'Aave v3',
    slug: 'aave-v3',
    tagline: 'Non-custodial liquidity protocol for earning interest and borrowing assets',
    description: 'Aave v3 on Arbitrum One features high-efficiency mode (eMode), isolation mode, and cross-chain portal capabilities with minimal L2 gas fees.',
    category: 'Lending',
    network: 'arbitrum-one',
    chainId: 42161,
    officialUrl: 'https://app.aave.com',
    docsUrl: 'https://docs.aave.com',
    arbiscanUrl: 'https://arbiscan.io/address/0x794a61358D6845594F94dc1DB02A252b5b4814aD',
    status: 'verified',
    verificationBadge: 'Verified Canonical',
    verifiedTimestamp: '2022-03-16T00:00:00Z',
    audits: [
      {
        auditor: 'SigmaPrime',
        date: 'January 2022',
        reportUrl: 'https://github.com/aave/aave-v3-core/tree/master/audits',
        summary: 'Security assessment of the core Aave v3 pool and interest rate calculation engine.'
      },
      {
        auditor: 'OpenZeppelin',
        date: 'February 2022',
        reportUrl: 'https://blog.openzeppelin.com/aave-v3-audit',
        summary: 'Audit of isolated collateral mechanics, risk parameters, and flashloans.'
      }
    ],
    contracts: [
      {
        name: 'Pool (Aave v3 Proxy)',
        address: '0x794a61358D6845594F94dc1DB02A252b5b4814aD',
        role: 'Core Lending Pool',
        proxyType: 'EIP-1967 Transparent',
        verifiedOnArbiscan: true,
        timelockHours: 72,
        multisigThreshold: 'Aave Governance Executor Timelock'
      },
      {
        name: 'PoolAddressesProvider',
        address: '0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb',
        role: 'Canonical Address Registry',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 72,
        multisigThreshold: 'Aave Governance'
      },
      {
        name: 'AaveOracle',
        address: '0xb56c2F0B653B2e0b10C9b928C8580Ac5Df02C7c7',
        role: 'Chainlink Price Feeds Adapter',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Aave Risk Admin'
      }
    ],
    safety: {
      approvalPolicy: 'Exact Amount Recommended',
      approvalWarning: 'Approvals are granted to the Pool address. Never authorize approvals to unverified periphery wrappers.',
      commonFunctions: [
        {
          signature: 'supply(address,uint256,address,uint16)',
          description: 'Deposits specified asset as collateral and mints interest-bearing aTokens',
          riskLevel: 'Low'
        },
        {
          signature: 'borrow(address,uint256,uint256,uint16,address)',
          description: 'Borrows assets against deposited collateral at variable or stable interest',
          riskLevel: 'Medium'
        },
        {
          signature: 'repay(address,uint256,uint256,address)',
          description: 'Repays a borrowed debt position in whole or in part',
          riskLevel: 'Low'
        }
      ],
      emergencyPause: true,
      adminControls: 'Emergency admin multisig can freeze specific assets or borrow operations; upgrades require Aave DAO on-chain vote.',
      knownRisks: [
        'Collateral liquidation when Health Factor drops below 1.0',
        'Interest rate spikes during extreme utilization periods'
      ]
    },
    entryDetails: {
      projectName: 'Aave v3',
      shortDescription: 'Non-custodial liquidity protocol for earning interest and borrowing assets.',
      category: 'Lending',
      targetAudience: 'Crypto asset holders, borrowers, and automated yield strategists.',
      experienceLevel: 'All Experience Levels',
      whatIsIt: 'A decentralized lending market where suppliers earn variable interest and borrowers draw liquidity against collateral.',
      problemSolved: 'Enables users to unlock liquidity against their crypto holdings without selling their assets or triggering tax events.',
      howItHelps: 'Offers isolated risk markets and High-Efficiency Mode (eMode) for correlated asset borrowing with minimal Arbitrum gas fees.',
      whatUsersShouldKnow: 'Borrowing requires maintaining a Health Factor safely above 1.0. If collateral value drops, debt may be partially liquidated.',
      isWalletRequired: true,
      financialOrAssetInteraction: true,
      destinationUrl: 'https://app.aave.com'
    }
  },
  {
    id: 'arbitrum-official-bridge',
    name: 'Arbitrum Official Bridge',
    slug: 'arbitrum-bridge',
    tagline: 'Canonical trustless rollup bridge between Ethereum L1 and Arbitrum',
    description: 'The native bridge operated by Offchain Labs connecting Ethereum Mainnet directly to Arbitrum One and Arbitrum Nova with fraud-proof validation.',
    category: 'Bridges',
    network: 'arbitrum-one',
    chainId: 42161,
    officialUrl: 'https://bridge.arbitrum.io',
    docsUrl: 'https://docs.arbitrum.io/build-decentralized-apps/cross-chain-messaging',
    arbiscanUrl: 'https://arbiscan.io/address/0x0000000000000000000000000000000000000064',
    status: 'verified',
    verificationBadge: 'Verified Canonical',
    verifiedTimestamp: '2021-08-31T00:00:00Z',
    audits: [
      {
        auditor: 'Trail of Bits',
        date: 'August 2021',
        reportUrl: 'https://github.com/OffchainLabs/nitro/tree/master/audits',
        summary: 'Security assessment of Arbitrum Nitro rollup inbox and outbox contracts.'
      },
      {
        auditor: 'OpenZeppelin',
        date: 'October 2022',
        reportUrl: 'https://blog.openzeppelin.com/arbitrum-nitro-audit',
        summary: 'Verification of state transition fraud-proof machinery and L1/L2 messaging.'
      }
    ],
    contracts: [
      {
        name: 'ArbSys (Precompile)',
        address: '0x0000000000000000000000000000000000000064',
        role: 'Native System Precompile for L2->L1 exits',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Arbitrum Nitro Precompile'
      },
      {
        name: 'L1GatewayRouter (Ethereum L1)',
        address: '0x72Ce9c8467894Db6fA0534741E007a109C4Ed820',
        role: 'L1 Token Gateway Router',
        proxyType: 'EIP-1967 Transparent',
        verifiedOnArbiscan: true,
        timelockHours: 168,
        multisigThreshold: 'Arbitrum Security Council 9/12'
      },
      {
        name: 'L2GatewayRouter (Arbitrum One)',
        address: '0x5288551E842475032c6302483842845610264Fa7',
        role: 'L2 Gateway Router',
        proxyType: 'EIP-1967 Transparent',
        verifiedOnArbiscan: true,
        timelockHours: 168,
        multisigThreshold: 'Arbitrum Security Council 9/12'
      }
    ],
    safety: {
      approvalPolicy: 'Exact Amount Recommended',
      approvalWarning: 'Native withdrawals from Arbitrum One to Ethereum L1 undergo a 7-day challenge period before finalization.',
      commonFunctions: [
        {
          signature: 'withdrawEth(uint256)',
          description: 'Initiates a native ETH exit from Arbitrum One back to Ethereum L1',
          riskLevel: 'Medium'
        },
        {
          signature: 'outboundTransfer(address,address,uint256,bytes)',
          description: 'Bridges ERC-20 tokens through the standard gateway',
          riskLevel: 'Low'
        }
      ],
      emergencyPause: true,
      adminControls: 'Arbitrum Security Council (9-of-12 emergency multisig) has emergency response authority; all non-emergency changes pass through Arbitrum DAO.',
      knownRisks: [
        '7-day withdrawal finality period on the native rollup exit path',
        'Gas estimation on retryable tickets for cross-chain execution'
      ]
    },
    entryDetails: {
      projectName: 'Arbitrum Official Bridge',
      shortDescription: 'Canonical trustless rollup bridge between Ethereum L1 and Arbitrum.',
      category: 'Bridges',
      targetAudience: 'Ethereum holders transferring assets between Layer 1 and Arbitrum rollups.',
      experienceLevel: 'All Experience Levels',
      whatIsIt: 'The official canonical bridge infrastructure operated by Offchain Labs for moving ETH and tokens to Arbitrum One.',
      problemSolved: 'Allows users to move assets into high-speed, sub-cent L2 execution while preserving Ethereum base-layer security.',
      howItHelps: 'Provides guaranteed trust-minimized asset deposits and withdrawals validated by fraud-proof rollups.',
      whatUsersShouldKnow: 'Depositing from Ethereum L1 takes ~10 minutes. Standard native withdrawals from Arbitrum L2 back to Ethereum L1 undergo a 7-day challenge period.',
      isWalletRequired: true,
      financialOrAssetInteraction: true,
      destinationUrl: 'https://bridge.arbitrum.io'
    }
  },
  {
    id: 'camelot-dex-arbitrum',
    name: 'Camelot DEX',
    slug: 'camelot-dex',
    tagline: 'Arbitrum-native decentralized exchange and liquidity hub',
    description: 'Camelot is an ecosystem-focused DEX tailored for Arbitrum One, offering dual AMM models (volatile and stable) with customizable dynamic directional fees.',
    category: 'DEX & Liquidity',
    network: 'arbitrum-one',
    chainId: 42161,
    officialUrl: 'https://app.camelot.exchange',
    docsUrl: 'https://docs.camelot.exchange',
    arbiscanUrl: 'https://arbiscan.io/address/0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
    status: 'verified',
    verificationBadge: 'Verified Canonical',
    verifiedTimestamp: '2022-12-05T00:00:00Z',
    audits: [
      {
        auditor: 'Paladin Blockchain Security',
        date: 'November 2022',
        reportUrl: 'https://paladinsec.co/projects/camelot-exchange/',
        summary: 'Security audit of Camelot Router, Factory, and customized xGRAIL yield contracts.'
      }
    ],
    contracts: [
      {
        name: 'CamelotRouter',
        address: '0xc873fEcbd354f5A56E00E710B90EF4201db2448d',
        role: 'Swap & Liquidity Router',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Immutable Core'
      },
      {
        name: 'CamelotFactory',
        address: '0x6EcDa835E8AB35a17547372F7E41e4d87f7b32B6',
        role: 'Pair Deployer Factory',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Camelot Multisig'
      },
      {
        name: 'AlgebraPoolDeployer',
        address: '0x42969f62E12f94689E28f9A61972CEf381f9b16F',
        role: 'Camelot v3 Concentrated Liquidity Deployer',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Camelot Multisig'
      }
    ],
    safety: {
      approvalPolicy: 'Exact Amount Recommended',
      approvalWarning: 'Grant token allowances only to the official Camelot Router. Check contract address before confirming.',
      commonFunctions: [
        {
          signature: 'swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,address,uint256)',
          description: 'Executes trades across Camelot liquidity pools with fee-on-transfer compatibility',
          riskLevel: 'Low'
        },
        {
          signature: 'addLiquidity(address,address,uint256,uint256,uint256,uint256,address,uint256)',
          description: 'Deposits token pairs into Camelot AMM liquidity pools',
          riskLevel: 'Low'
        }
      ],
      emergencyPause: false,
      adminControls: 'Standard AMM router and pool logic is immutable. Dynamic fees are bounded within strictly defined protocol maximums.',
      knownRisks: [
        'Impermanent loss on volatile AMM liquidity positions',
        'Front-running / MEV on public mempool trades without private RPC'
      ]
    },
    entryDetails: {
      projectName: 'Camelot DEX',
      shortDescription: 'Arbitrum-native decentralized exchange and customized liquidity hub.',
      category: 'DEX & Liquidity',
      targetAudience: 'Arbitrum ecosystem builders, native token swappers, and liquidity farmers.',
      experienceLevel: 'All Experience Levels',
      whatIsIt: 'A community-driven DEX customized specifically for the Arbitrum ecosystem with dynamic directional fees.',
      problemSolved: 'Offers tailored launchpad liquidity and sustainable incentive loops for Arbitrum-native projects.',
      howItHelps: 'Enables dual-AMM models with customizable fee tiers and yield staking via xGRAIL tokens.',
      whatUsersShouldKnow: 'Always verify pair contracts and set conservative slippage when trading newly launched ecosystem tokens.',
      isWalletRequired: true,
      financialOrAssetInteraction: true,
      destinationUrl: 'https://app.camelot.exchange'
    }
  },
  {
    id: 'pendle-finance-arbitrum',
    name: 'Pendle Finance',
    slug: 'pendle',
    tagline: 'Tokenized future yield trading protocol on Arbitrum',
    description: 'Pendle separates yield-bearing tokens into Principal Tokens (PT) and Yield Tokens (YT), allowing fixed yield locking and yield speculation.',
    category: 'Yield & Staking',
    network: 'arbitrum-one',
    chainId: 42161,
    officialUrl: 'https://app.pendle.finance',
    docsUrl: 'https://docs.pendle.finance',
    arbiscanUrl: 'https://arbiscan.io/address/0x00000000005BBB0EF59571E58418F9a4357b68A0',
    status: 'verified',
    verificationBadge: 'Verified Canonical',
    verifiedTimestamp: '2023-03-01T00:00:00Z',
    audits: [
      {
        auditor: 'Ackee Blockchain',
        date: 'February 2023',
        reportUrl: 'https://github.com/pendle-finance/pendle-core-v2-public/tree/main/audits',
        summary: 'Audit of Pendle v2 AMM mathematics, expiry redemption, and SY standard.'
      },
      {
        auditor: 'Dedaub',
        date: 'January 2023',
        reportUrl: 'https://github.com/pendle-finance/pendle-core-v2-public/tree/main/audits',
        summary: 'Comprehensive review of bytecode optimizations and flash loan safety.'
      }
    ],
    contracts: [
      {
        name: 'PendleRouter',
        address: '0x00000000005BBB0EF59571E58418F9a4357b68A0',
        role: 'Primary Yield Swap Router',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Immutable Core'
      },
      {
        name: 'PendleLimitRouter',
        address: '0x00000000000045166C45cF0167D48a2123292542',
        role: 'Limit Order Settlement Router',
        proxyType: 'None (Immutable)',
        verifiedOnArbiscan: true,
        timelockHours: 0,
        multisigThreshold: 'Immutable Core'
      }
    ],
    safety: {
      approvalPolicy: 'Exact Amount Recommended',
      approvalWarning: 'Ensure approvals are granted to the canonical Pendle Router 0x00000000005BBB0EF59571E58418F9a4357b68A0.',
      commonFunctions: [
        {
          signature: 'swapExactPtForYt(address,address,uint256,uint256,(uint256,uint256,uint256))',
          description: 'Exchanges Principal Tokens for Yield Tokens on Pendle AMM',
          riskLevel: 'Medium'
        },
        {
          signature: 'redeemPyToToken(address,address,uint256,(address,uint256,bytes))',
          description: 'Redeems matured PT tokens for the underlying asset at par',
          riskLevel: 'Low'
        }
      ],
      emergencyPause: false,
      adminControls: 'Core trading and redemption contracts are immutable. Markets automatically settle at scheduled maturity dates.',
      knownRisks: [
        'Maturity expiration mechanics: YT value amortizes to 0 at maturity',
        'Underlying yield rate fluctuation before maturity'
      ]
    },
    entryDetails: {
      projectName: 'Pendle Finance',
      shortDescription: 'Tokenized future yield trading protocol on Arbitrum.',
      category: 'Yield & Staking',
      targetAudience: 'Fixed yield seekers, DeFi yield farmers, and interest rate speculators.',
      experienceLevel: 'Advanced',
      whatIsIt: 'A protocol that tokenizes future yields into Principal Tokens (PT) and Yield Tokens (YT) on an automated AMM.',
      problemSolved: 'Traditional DeFi variable yields fluctuate unpredictably; Pendle lets users lock in guaranteed fixed rates or speculate on APY.',
      howItHelps: 'Lets users buy discounted assets with fixed APY or trade pure yield without needing underlying principal.',
      whatUsersShouldKnow: 'Principal Tokens (PT) and Yield Tokens (YT) have fixed maturity dates. YT value amortizes toward zero as expiration approaches.',
      isWalletRequired: true,
      financialOrAssetInteraction: true,
      destinationUrl: 'https://app.pendle.finance'
    }
  }
];
