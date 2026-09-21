export type NetworkId = 'arbitrum-one' | 'arbitrum-nova';

export type VerificationStatus = 'verified' | 'audited' | 'pending' | 'flagged';

export interface AuditRecord {
  auditor: string;
  date: string;
  reportUrl: string;
  summary: string;
}

export interface ContractAddress {
  name: string;
  address: string;
  role: string; // e.g. "Router", "Factory", "Vault", "Bridge Gateway"
  proxyType?: 'None (Immutable)' | 'EIP-1967 Transparent' | 'UUPS' | 'Custom Proxy';
  verifiedOnArbiscan: boolean;
  timelockHours?: number;
  multisigThreshold?: string; // e.g. "4/7 Safe"
}

export interface InteractionSafety {
  approvalPolicy: 'Exact Amount Recommended' | 'Permit2 Supported' | 'Limited Approval' | 'Review Required';
  approvalWarning?: string;
  commonFunctions: {
    signature: string;
    description: string;
    riskLevel: 'Low' | 'Medium' | 'High';
  }[];
  emergencyPause: boolean;
  adminControls: string;
  knownRisks: string[];
}

export interface EnteraEntryDetails {
  // Project
  projectName: string;
  shortDescription: string;
  category: 'DEX & Liquidity' | 'Derivatives & Perps' | 'Lending' | 'Bridges' | 'Yield & Staking' | 'Infrastructure' | string;

  // Audience
  targetAudience: string;
  experienceLevel: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Experience Levels';

  // Understanding
  whatIsIt: string;
  problemSolved: string;
  howItHelps: string;

  // Preparation
  whatUsersShouldKnow: string;
  isWalletRequired: boolean;
  financialOrAssetInteraction: boolean;

  // Destination
  destinationUrl: string;
}

export interface ProtocolEntry {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  description: string;
  category: 'DEX & Liquidity' | 'Derivatives & Perps' | 'Lending' | 'Bridges' | 'Yield & Staking' | 'Infrastructure';
  network: NetworkId;
  chainId: number;
  officialUrl: string;
  docsUrl: string;
  arbiscanUrl: string;
  status: VerificationStatus;
  verificationBadge: string;
  verifiedTimestamp: string;
  audits: AuditRecord[];
  contracts: ContractAddress[];
  safety: InteractionSafety;
  creatorAddress?: string;
  entryStatus?: 'Active' | 'Inactive' | 'Draft';
  registrationStatus?: 'Published' | 'Pending registration' | 'Draft';
  lastUpdated?: string;
  entryDetails?: EnteraEntryDetails;
  changeLog?: {
    date: string;
    description: string;
    author: string;
  }[];
}

export interface CreatorUser {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: string;
  verifiedSigner: boolean;
  createdAt: string;
}

// ==========================================
// SABI SKILL DIRECTORY & VERIFICATION PROFILE TYPES
// ==========================================

export type SkillLevel =
  | 'Beginner / Foundational'
  | 'Intermediate'
  | 'Advanced'
  | 'Master / Specialist'
  | 'Executive / Authority';

export type SkillActiveStatus = 'active' | 'inactive';

export type SkillVerificationStatus =
  | 'verified'
  | 'draft'
  | 'under_review'
  | 'community_approved'
  | 'deprecated';

export type VerificationMethodType =
  | 'credential_document'
  | 'knowledge_assessment'
  | 'practical_task'
  | 'peer_confirmation'
  | 'supervisor_attestation'
  | 'portfolio_demonstration'
  | 'live_interview';

export interface VerificationMethodConfig {
  id: string;
  type: VerificationMethodType;
  name: string;
  description: string;
  isRequired: boolean; // required vs optional
  weightPercentage?: number;
}

export interface EvidenceRequirement {
  id: string;
  title: string;
  description: string;
  acceptedFormats: string[]; // e.g. ['PDF', 'Image (JPG/PNG)', 'Live URL', 'CAD / BIM / Figma']
  minFilesCount: number;
  maxFilesCount: number;
  requiresOfficialIssuerVerification: boolean;
  sampleDocumentDescription?: string;
  isMandatory: boolean;
}

export interface AssessmentRequirement {
  enabled: boolean;
  title: string;
  format: 'Multiple Choice & Case Study' | 'Scenario Simulation' | 'Proctored Coding / Technical Test' | 'Oral & Technical Exam' | 'Open Response Rubric';
  durationMinutes: number;
  questionCount: number;
  passingScorePercentage: number;
  maxAttemptsAllowed: number;
  coolingPeriodDays: number;
  isProctored: boolean;
  proctoringNotes?: string;
}

export interface PracticalTaskRequirement {
  enabled: boolean;
  taskTitle: string;
  taskDescription: string;
  expectedDeliverables: string[];
  evaluationRubric: {
    criteria: string;
    points: number;
    description: string;
  }[];
  submissionFormat: string; // e.g. "GitHub repository", "Video demonstration", "Architectural plan drawing", "Finished garment photos & tech pack"
  estimatedHoursToComplete: number;
  reviewedBy: 'Certified Master Verifier' | 'Independent Industry Assessor' | 'Automated Test Harness' | 'Peer Review Panel';
}

export interface ConfirmationRequirement {
  enabled: boolean;
  requiredConfirmationsCount: number;
  eligibleSignersDescription: string; // e.g., "Master Electrician with 5+ years licensed", "Head of Engineering", "Licensed Shop Foreman"
  requireIdentityVerification: boolean;
  attestationPrompt: string;
  verificationExpiryMonths?: number;
}

export interface PassingCriteria {
  overallMinScorePercentage: number;
  mustPassAllMandatoryEvidence: boolean;
  mustPassAssessment: boolean;
  mustPassPracticalTask: boolean;
  mustPassConfirmation: boolean;
  evaluatorConsensusRequired: 'Single Certified Reviewer' | '2 of 3 Consensus' | 'Unanimous Panel';
  rubricSummary: string;
}

export interface VerificationProfile {
  id: string;
  profileName: string;
  targetSkillLevel: SkillLevel;
  availableMethods: VerificationMethodConfig[];
  requiredMethods: VerificationMethodType[];
  optionalMethods: VerificationMethodType[];
  evidenceRequirements: EvidenceRequirement[];
  assessmentRequirements: AssessmentRequirement;
  practicalTaskRequirements: PracticalTaskRequirement;
  confirmationRequirements: ConfirmationRequirement;
  passingCriteria: PassingCriteria;
  validityPeriodMonths: number; // 0 = Lifetime / Non-expiring, 12 = 1 year, 24 = 2 years, etc.
  validityPeriodLabel: string; // e.g. "2 Years", "3 Years", "Non-expiring (Lifetime)"
  reVerificationRequirements: {
    requiresFullRetake: boolean;
    ceCreditsRequired?: number; // Continuing Education Units
    refresherAssessment: boolean;
    updatedWorkEvidenceRequired: boolean;
    instructions: string;
  };
}

export interface SkillCategory {
  id: string;
  name: string;
  iconName: string;
  description: string;
  subcategories: string[];
  badgeColor: string; // e.g. "sky", "emerald", "amber", "indigo", "rose", "violet"
  isCustom?: boolean;
}

export interface SkillItem {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  subcategory: string;
  description: string;
  availableLevels: SkillLevel[];
  activeStatus: SkillActiveStatus;
  verificationStatus: SkillVerificationStatus;
  verificationProfile: VerificationProfile;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
}

