import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import {
  SkillItem,
  SkillLevel,
  SkillActiveStatus,
  SkillVerificationStatus,
  VerificationMethodType,
  VerificationMethodConfig,
  EvidenceRequirement,
  VerificationProfile
} from '../types';
import {
  ShieldCheck,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  BookOpen,
  Wrench,
  Users,
  Award,
  Clock,
  RotateCcw,
  ArrowLeft,
  Settings,
  FolderPlus
} from 'lucide-react';
import { CategoryManagerModal } from '../components/CategoryManagerModal';

interface AdminSkillConfigPageProps {
  editSkillId?: string;
}

export const AdminSkillConfigPage: React.FC<AdminSkillConfigPageProps> = ({ editSkillId }) => {
  const { skills, categories, addSkill, updateSkill, navigate, isAdminMode, setAdminMode } = useApp();

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Find skill if editing
  const existingSkill = editSkillId ? skills.find((s) => s.id === editSkillId) : undefined;

  // Form State - Structured Information
  const [name, setName] = useState(existingSkill?.name || '');
  const [categoryId, setCategoryId] = useState(existingSkill?.categoryId || categories[0]?.id || 'tech');
  const [subcategory, setSubcategory] = useState(existingSkill?.subcategory || '');
  const [description, setDescription] = useState(existingSkill?.description || '');
  const [activeStatus, setActiveStatus] = useState<SkillActiveStatus>(existingSkill?.activeStatus || 'active');
  const [verificationStatus, setVerificationStatus] = useState<SkillVerificationStatus>(
    existingSkill?.verificationStatus || 'verified'
  );
  const [tagsInput, setTagsInput] = useState(existingSkill?.tags.join(', ') || '');

  // Available Skill Levels
  const allLevels: SkillLevel[] = [
    'Beginner / Foundational',
    'Intermediate',
    'Advanced',
    'Master / Specialist',
    'Executive / Authority'
  ];
  const [selectedLevels, setSelectedLevels] = useState<SkillLevel[]>(
    existingSkill?.availableLevels || ['Intermediate', 'Advanced']
  );

  // Verification Profile State
  const defaultProfile = existingSkill?.verificationProfile;
  const [profileName, setProfileName] = useState(defaultProfile?.profileName || '');
  const [targetSkillLevel, setTargetSkillLevel] = useState<SkillLevel>(
    defaultProfile?.targetSkillLevel || 'Advanced'
  );

  // Methods configuration
  const defaultAvailableMethods: VerificationMethodConfig[] = defaultProfile?.availableMethods || [
    {
      id: 'vm-cred',
      type: 'credential_document',
      name: 'Verified Credential / License Documentation',
      description: 'Official diploma, governmental license, or accredited credential validation.',
      isRequired: true,
      weightPercentage: 25
    },
    {
      id: 'vm-prac',
      type: 'practical_task',
      name: 'Hands-On Practical Work Execution',
      description: 'Submission or live demonstration of authentic domain task against strict rubrics.',
      isRequired: true,
      weightPercentage: 45
    },
    {
      id: 'vm-exam',
      type: 'knowledge_assessment',
      name: 'Standardized Knowledge Assessment',
      description: 'Proctored scenario evaluation testing domain theory, calculations, and safety.',
      isRequired: true,
      weightPercentage: 20
    },
    {
      id: 'vm-peer',
      type: 'peer_confirmation',
      name: 'Supervisor / Master Peer Attestation',
      description: 'Confirmation from licensed practitioner or workplace supervisor.',
      isRequired: false,
      weightPercentage: 10
    }
  ];
  const [methods, setMethods] = useState<VerificationMethodConfig[]>(defaultAvailableMethods);

  // Evidence Requirements
  const defaultEvidence: EvidenceRequirement[] = defaultProfile?.evidenceRequirements || [
    {
      id: 'ev-req-1',
      title: 'Official License or Institutional Credential',
      description: 'Clear official copy of active credential or formal portfolio link.',
      acceptedFormats: ['PDF', 'Credential URL', 'High-Res Photo'],
      minFilesCount: 1,
      maxFilesCount: 3,
      requiresOfficialIssuerVerification: true,
      sampleDocumentDescription: 'State board license or accredited certification transcript.',
      isMandatory: true
    }
  ];
  const [evidenceList, setEvidenceList] = useState<EvidenceRequirement[]>(defaultEvidence);

  // Assessment Requirements
  const [assessmentEnabled, setAssessmentEnabled] = useState(
    defaultProfile?.assessmentRequirements.enabled ?? true
  );
  const [assessmentTitle, setAssessmentTitle] = useState(
    defaultProfile?.assessmentRequirements.title || 'Domain Competency Assessment'
  );
  const [assessmentFormat, setAssessmentFormat] = useState<any>(
    defaultProfile?.assessmentRequirements.format || 'Scenario Simulation'
  );
  const [assessmentDuration, setAssessmentDuration] = useState(
    defaultProfile?.assessmentRequirements.durationMinutes ?? 60
  );
  const [assessmentQuestions, setAssessmentQuestions] = useState(
    defaultProfile?.assessmentRequirements.questionCount ?? 35
  );
  const [assessmentPassingScore, setAssessmentPassingScore] = useState(
    defaultProfile?.assessmentRequirements.passingScorePercentage ?? 80
  );
  const [assessmentMaxAttempts, setAssessmentMaxAttempts] = useState(
    defaultProfile?.assessmentRequirements.maxAttemptsAllowed ?? 2
  );
  const [assessmentCoolingDays, setAssessmentCoolingDays] = useState(
    defaultProfile?.assessmentRequirements.coolingPeriodDays ?? 14
  );
  const [assessmentProctored, setAssessmentProctored] = useState(
    defaultProfile?.assessmentRequirements.isProctored ?? true
  );

  // Practical Task Requirements
  const [practicalEnabled, setPracticalEnabled] = useState(
    defaultProfile?.practicalTaskRequirements.enabled ?? true
  );
  const [practicalTitle, setPracticalTitle] = useState(
    defaultProfile?.practicalTaskRequirements.taskTitle || 'Core Practical Benchmark Task'
  );
  const [practicalDesc, setPracticalDesc] = useState(
    defaultProfile?.practicalTaskRequirements.taskDescription ||
      'Execute a representative real-world project demonstrating technical proficiency.'
  );
  const [practicalFormat, setPracticalFormat] = useState(
    defaultProfile?.practicalTaskRequirements.submissionFormat || 'Digital Repository / Video Demonstration'
  );
  const [practicalHours, setPracticalHours] = useState(
    defaultProfile?.practicalTaskRequirements.estimatedHoursToComplete ?? 4
  );
  const [practicalReviewer, setPracticalReviewer] = useState<any>(
    defaultProfile?.practicalTaskRequirements.reviewedBy || 'Certified Master Verifier'
  );

  // Confirmation Requirements
  const [confirmationEnabled, setConfirmationEnabled] = useState(
    defaultProfile?.confirmationRequirements.enabled ?? true
  );
  const [confirmationCount, setConfirmationCount] = useState(
    defaultProfile?.confirmationRequirements.requiredConfirmationsCount ?? 1
  );
  const [confirmationSigners, setConfirmationSigners] = useState(
    defaultProfile?.confirmationRequirements.eligibleSignersDescription ||
      'Licensed Supervisor, Shop Foreman, or Senior Director with 5+ years experience.'
  );
  const [confirmationPrompt, setConfirmationPrompt] = useState(
    defaultProfile?.confirmationRequirements.attestationPrompt ||
      'I confirm under penalty of de-certification that the applicant exhibits verified competence.'
  );

  // Passing Criteria
  const [overallScore, setOverallScore] = useState(
    defaultProfile?.passingCriteria.overallMinScorePercentage ?? 80
  );
  const [mustPassEvidence, setMustPassEvidence] = useState(
    defaultProfile?.passingCriteria.mustPassAllMandatoryEvidence ?? true
  );
  const [mustPassExam, setMustPassExam] = useState(
    defaultProfile?.passingCriteria.mustPassAssessment ?? true
  );
  const [mustPassPractical, setMustPassPractical] = useState(
    defaultProfile?.passingCriteria.mustPassPracticalTask ?? true
  );
  const [evaluatorConsensus, setEvaluatorConsensus] = useState<any>(
    defaultProfile?.passingCriteria.evaluatorConsensusRequired || 'Single Certified Reviewer'
  );
  const [rubricSummary, setRubricSummary] = useState(
    defaultProfile?.passingCriteria.rubricSummary ||
      'Applicant must achieve minimum threshold score across all mandatory assessment components.'
  );

  // Validity Period & Re-Verification
  const [validityMonths, setValidityMonths] = useState(
    defaultProfile?.validityPeriodMonths ?? 24
  );
  const [validityLabel, setValidityLabel] = useState(
    defaultProfile?.validityPeriodLabel || '2 Years'
  );
  const [reVerifCECredits, setReVerifCECredits] = useState(
    defaultProfile?.reVerificationRequirements.ceCreditsRequired ?? 16
  );
  const [reVerifRefresherExam, setReVerifRefresherExam] = useState(
    defaultProfile?.reVerificationRequirements.refresherAssessment ?? true
  );
  const [reVerifWorkEvidence, setReVerifWorkEvidence] = useState(
    defaultProfile?.reVerificationRequirements.updatedWorkEvidenceRequired ?? true
  );
  const [reVerifInstructions, setReVerifInstructions] = useState(
    defaultProfile?.reVerificationRequirements.instructions ||
      'Submit verification of ongoing practice and complete required continuing education hours.'
  );

  // Ensure selected subcategory belongs to chosen category
  const activeCategory = categories.find((c) => c.id === categoryId);
  useEffect(() => {
    if (activeCategory && !activeCategory.subcategories.includes(subcategory)) {
      setSubcategory(activeCategory.subcategories[0] || 'General');
    }
  }, [categoryId, activeCategory]);

  const handleToggleLevel = (level: SkillLevel) => {
    if (selectedLevels.includes(level)) {
      if (selectedLevels.length > 1) {
        setSelectedLevels(selectedLevels.filter((l) => l !== level));
      }
    } else {
      setSelectedLevels([...selectedLevels, level]);
    }
  };

  const handleAddEvidenceReq = () => {
    const newReq: EvidenceRequirement = {
      id: `ev-req-${Date.now()}`,
      title: 'Additional Supporting Artifact',
      description: 'Provide relevant documentation demonstrating practical experience.',
      acceptedFormats: ['PDF', 'Image (JPG/PNG)'],
      minFilesCount: 1,
      maxFilesCount: 2,
      requiresOfficialIssuerVerification: false,
      sampleDocumentDescription: 'Client testimonial, project plan, or safety certification.',
      isMandatory: true
    };
    setEvidenceList([...evidenceList, newReq]);
  };

  const handleRemoveEvidenceReq = (index: number) => {
    if (evidenceList.length <= 1) return;
    setEvidenceList(evidenceList.filter((_, i) => i !== index));
  };

  const handleToggleMethodRequired = (index: number) => {
    const updated = [...methods];
    updated[index].isRequired = !updated[index].isRequired;
    setMethods(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMessage('Please enter a valid skill name.');
      return;
    }
    if (!description.trim()) {
      setErrorMessage('Please enter a description for the skill.');
      return;
    }

    const currentCat = categories.find((c) => c.id === categoryId);
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const skillId = existingSkill?.id || `skill-${categoryId}-${slug}`;

    const requiredMethodTypes = methods.filter((m) => m.isRequired).map((m) => m.type);
    const optionalMethodTypes = methods.filter((m) => !m.isRequired).map((m) => m.type);

    const configuredProfile: VerificationProfile = {
      id: existingSkill?.verificationProfile.id || `vp-${slug}`,
      profileName: profileName.trim() || `${name} Verification Profile`,
      targetSkillLevel,
      availableMethods: methods,
      requiredMethods: requiredMethodTypes,
      optionalMethods: optionalMethodTypes,
      evidenceRequirements: evidenceList,
      assessmentRequirements: {
        enabled: assessmentEnabled,
        title: assessmentTitle.trim() || `${name} Assessment`,
        format: assessmentFormat,
        durationMinutes: Number(assessmentDuration),
        questionCount: Number(assessmentQuestions),
        passingScorePercentage: Number(assessmentPassingScore),
        maxAttemptsAllowed: Number(assessmentMaxAttempts),
        coolingPeriodDays: Number(assessmentCoolingDays),
        isProctored: assessmentProctored,
        proctoringNotes: 'Proctored under Sabi Verification Engine protocol.'
      },
      practicalTaskRequirements: {
        enabled: practicalEnabled,
        taskTitle: practicalTitle.trim() || `${name} Practical Task`,
        taskDescription: practicalDesc.trim(),
        expectedDeliverables: [
          'Deliverable package matching evaluation criteria',
          'Self-reflection and methodology report'
        ],
        evaluationRubric: [
          { criteria: 'Technical Rigor & Execution', points: 40, description: 'Meets industry professional standard without procedural error.' },
          { criteria: 'Safety & Compliance Conformance', points: 30, description: 'Zero safety or code violations.' },
          { criteria: 'Deliverable Quality & Organization', points: 30, description: 'Clear documentation, clean presentation, and completeness.' }
        ],
        submissionFormat: practicalFormat,
        estimatedHoursToComplete: Number(practicalHours),
        reviewedBy: practicalReviewer
      },
      confirmationRequirements: {
        enabled: confirmationEnabled,
        requiredConfirmationsCount: Number(confirmationCount),
        eligibleSignersDescription: confirmationSigners.trim(),
        requireIdentityVerification: true,
        attestationPrompt: confirmationPrompt.trim()
      },
      passingCriteria: {
        overallMinScorePercentage: Number(overallScore),
        mustPassAllMandatoryEvidence: mustPassEvidence,
        mustPassAssessment: mustPassExam,
        mustPassPracticalTask: mustPassPractical,
        mustPassConfirmation: confirmationEnabled,
        evaluatorConsensusRequired: evaluatorConsensus,
        rubricSummary: rubricSummary.trim()
      },
      validityPeriodMonths: Number(validityMonths),
      validityPeriodLabel: validityMonths === 0 ? 'Non-expiring (Lifetime)' : validityLabel,
      reVerificationRequirements: {
        requiresFullRetake: false,
        ceCreditsRequired: Number(reVerifCECredits),
        refresherAssessment: reVerifRefresherExam,
        updatedWorkEvidenceRequired: reVerifWorkEvidence,
        instructions: reVerifInstructions.trim()
      }
    };

    const finalSkill: SkillItem = {
      id: skillId,
      name: name.trim(),
      slug,
      categoryId,
      categoryName: currentCat?.name || 'Professional',
      subcategory: subcategory || currentCat?.subcategories[0] || 'General',
      description: description.trim(),
      availableLevels: selectedLevels,
      activeStatus,
      verificationStatus,
      verificationProfile: configuredProfile,
      tags: tagsInput
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      createdAt: existingSkill?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'Administrator'
    };

    if (existingSkill) {
      updateSkill(existingSkill.id, finalSkill);
      setSuccessMessage('Skill and Verification Profile updated successfully!');
    } else {
      addSkill(finalSkill);
      setSuccessMessage('New Skill and Verification Profile registered in Sabi Directory!');
    }

    setTimeout(() => {
      navigate(`/skills/${finalSkill.id}`);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/skills')}
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-700 rounded">
                Sabi Admin Engine
              </span>
              <span className="text-xs text-slate-500 font-mono">• No Code Required</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {existingSkill ? `Edit Skill: ${existingSkill.name}` : 'Configure New Skill & Verification Profile'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
              Define custom skill requirements, dynamic verification methods, rubrics, and passing criteria.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setCategoryModalOpen(true)}
            className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
            <span>Manage Categories</span>
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Structured Skill Information */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[11px] flex items-center justify-center font-mono">1</span>
              <span>Structured Skill Information</span>
            </h2>
            <span className="text-[11px] text-slate-500 font-medium">Core Metadata</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Skill Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Master Industrial Electrician, AI Model Safety Auditor"
                required
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category *
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} {cat.isCustom ? '(Custom)' : ''}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => setCategoryModalOpen(true)}
                  className="p-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl"
                  title="Add new category"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subcategory *
              </label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                {activeCategory?.subcategories.map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Active / Inactive Status
                </label>
                <select
                  value={activeStatus}
                  onChange={(e) => setActiveStatus(e.target.value as SkillActiveStatus)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verification Status
                </label>
                <select
                  value={verificationStatus}
                  onChange={(e) => setVerificationStatus(e.target.value as SkillVerificationStatus)}
                  className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                >
                  <option value="verified">Verified Official</option>
                  <option value="draft">Draft Protocol</option>
                  <option value="under_review">Under Industry Review</option>
                  <option value="community_approved">Community Approved</option>
                  <option value="deprecated">Deprecated</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description & Scope of Practice *
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the competencies, tools, codes, and responsibilities associated with this skill."
              required
              className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Available Skill Levels (Select all applicable)
            </label>
            <div className="flex flex-wrap gap-2 pt-1">
              {allLevels.map((lvl) => {
                const isSelected = selectedLevels.includes(lvl);
                return (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => handleToggleLevel(lvl)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors border ${
                      isSelected
                        ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                        : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lvl} {isSelected && '✓'}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Search Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="e.g. NEC, High-Voltage, CAD, Diagnostics, NFPA 70E"
              className="w-full px-3.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
            />
          </div>
        </div>

        {/* Section 2: Verification Profile - Methods & Target Level */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-sky-600 text-white text-[11px] flex items-center justify-center font-mono">2</span>
              <span>Verification Profile Configuration</span>
            </h2>
            <span className="text-[11px] text-sky-700 font-semibold bg-sky-50 px-2 py-0.5 rounded">Dynamic Engine</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Verification Profile Name
              </label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                placeholder="e.g. Master Diagnostic Verification Profile"
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Skill Level Being Verified *
              </label>
              <select
                value={targetSkillLevel}
                onChange={(e) => setTargetSkillLevel(e.target.value as SkillLevel)}
                className="w-full px-3.5 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white"
              >
                {selectedLevels.map((lvl) => (
                  <option key={lvl} value={lvl}>
                    {lvl}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Verification Methods Matrix */}
          <div className="space-y-2 pt-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Verification Methods Matrix (Required vs. Optional)
            </label>
            <p className="text-xs text-slate-500">
              Configure which verification methods are mandatory gates vs. optional supplementary credit for this specific skill.
            </p>

            <div className="grid grid-cols-1 gap-2.5 pt-2">
              {methods.map((method, idx) => (
                <div
                  key={method.id}
                  className={`p-3.5 rounded-xl border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    method.isRequired ? 'bg-sky-50/40 border-sky-200' : 'bg-slate-50/70 border-slate-200'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">{method.name}</span>
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                          method.isRequired ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                        }`}
                      >
                        {method.isRequired ? 'Required' : 'Optional / Supplementary'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5">{method.description}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
                    <div className="flex items-center gap-1.5">
                      <label className="text-[11px] text-slate-500 font-medium">Weight %:</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={method.weightPercentage || 0}
                        onChange={(e) => {
                          const updated = [...methods];
                          updated[idx].weightPercentage = Number(e.target.value);
                          setMethods(updated);
                        }}
                        className="w-14 px-2 py-1 text-xs border border-slate-200 rounded-lg bg-white text-center font-mono"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleMethodRequired(idx)}
                      className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                        method.isRequired
                          ? 'bg-sky-600 text-white border-sky-600'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {method.isRequired ? 'Mark Optional' : 'Mark Required'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Evidence Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] flex items-center justify-center font-mono">3</span>
                <span>Evidence & Credential Requirements</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Define acceptable document formats, license proof, portfolio artifacts, and issuer verification.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddEvidenceReq}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg flex items-center gap-1 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Evidence Item</span>
            </button>
          </div>

          <div className="space-y-3">
            {evidenceList.map((ev, idx) => (
              <div key={ev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">Evidence Requirement #{idx + 1}</span>
                  {evidenceList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveEvidenceReq(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Evidence Title *
                    </label>
                    <input
                      type="text"
                      value={ev.title}
                      onChange={(e) => {
                        const updated = [...evidenceList];
                        updated[idx].title = e.target.value;
                        setEvidenceList(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="e.g. Master License, GitHub Repository, Tech Pack"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Sample Description for Candidate
                    </label>
                    <input
                      type="text"
                      value={ev.sampleDocumentDescription || ''}
                      onChange={(e) => {
                        const updated = [...evidenceList];
                        updated[idx].sampleDocumentDescription = e.target.value;
                        setEvidenceList(updated);
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                      placeholder="e.g. Official government-issued card showing active expiration date"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Guidance / Instructions
                  </label>
                  <input
                    type="text"
                    value={ev.description}
                    onChange={(e) => {
                      const updated = [...evidenceList];
                      updated[idx].description = e.target.value;
                      setEvidenceList(updated);
                    }}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-lg bg-white"
                    placeholder="Instructions explaining what must be visible on the artifact"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1 border-t border-slate-200/60">
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={ev.isMandatory}
                        onChange={(e) => {
                          const updated = [...evidenceList];
                          updated[idx].isMandatory = e.target.checked;
                          setEvidenceList(updated);
                        }}
                        className="rounded text-sky-600"
                      />
                      <span>Mandatory Evidence</span>
                    </label>

                    <label className="flex items-center gap-1.5 text-slate-700 cursor-pointer font-medium">
                      <input
                        type="checkbox"
                        checked={ev.requiresOfficialIssuerVerification}
                        onChange={(e) => {
                          const updated = [...evidenceList];
                          updated[idx].requiresOfficialIssuerVerification = e.target.checked;
                          setEvidenceList(updated);
                        }}
                        className="rounded text-sky-600"
                      />
                      <span>Requires Official Issuer Registry Verification</span>
                    </label>
                  </div>

                  <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                    <span>Accepted: {ev.acceptedFormats.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 4: Assessment & Examination Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[11px] flex items-center justify-center font-mono">4</span>
              <span>Knowledge Assessment & Exam Requirements</span>
            </h2>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={assessmentEnabled}
                onChange={(e) => setAssessmentEnabled(e.target.checked)}
                className="rounded text-indigo-600 w-4 h-4"
              />
              <span>Enable Assessment</span>
            </label>
          </div>

          {assessmentEnabled ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assessment Title
                  </label>
                  <input
                    type="text"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Exam Format
                  </label>
                  <select
                    value={assessmentFormat}
                    onChange={(e) => setAssessmentFormat(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Scenario Simulation">Scenario Simulation</option>
                    <option value="Multiple Choice & Case Study">Multiple Choice & Case Study</option>
                    <option value="Proctored Coding / Technical Test">Proctored Coding / Technical Test</option>
                    <option value="Oral & Technical Exam">Oral & Technical Exam</option>
                    <option value="Open Response Rubric">Open Response Rubric</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    min="10"
                    value={assessmentDuration}
                    onChange={(e) => setAssessmentDuration(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Question Count
                  </label>
                  <input
                    type="number"
                    min="5"
                    value={assessmentQuestions}
                    onChange={(e) => setAssessmentQuestions(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Passing Score %
                  </label>
                  <input
                    type="number"
                    min="50"
                    max="100"
                    value={assessmentPassingScore}
                    onChange={(e) => setAssessmentPassingScore(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Max Retakes Allowed
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={assessmentMaxAttempts}
                    onChange={(e) => setAssessmentMaxAttempts(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-4 pt-1 text-xs">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 font-medium">
                  <input
                    type="checkbox"
                    checked={assessmentProctored}
                    onChange={(e) => setAssessmentProctored(e.target.checked)}
                    className="rounded text-indigo-600"
                  />
                  <span>Proctored Assessment Session (Identity & Screen Monitoring)</span>
                </label>
                <span className="text-slate-500 font-mono text-[11px]">
                  Cooling period: {assessmentCoolingDays} days between failed attempts
                </span>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Standardized examination is disabled for this skill; verification relies on practical tasks, portfolios, and confirmations.
            </p>
          )}
        </div>

        {/* Section 5: Practical Task Requirements */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-600 text-white text-[11px] flex items-center justify-center font-mono">5</span>
              <span>Practical Task & Hands-On Rubrics</span>
            </h2>
            <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                checked={practicalEnabled}
                onChange={(e) => setPracticalEnabled(e.target.checked)}
                className="rounded text-amber-600 w-4 h-4"
              />
              <span>Enable Practical Task</span>
            </label>
          </div>

          {practicalEnabled ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Practical Task Title
                  </label>
                  <input
                    type="text"
                    value={practicalTitle}
                    onChange={(e) => setPracticalTitle(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Evaluator Role
                  </label>
                  <select
                    value={practicalReviewer}
                    onChange={(e) => setPracticalReviewer(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    <option value="Certified Master Verifier">Certified Master Verifier</option>
                    <option value="Independent Industry Assessor">Independent Industry Assessor</option>
                    <option value="Automated Test Harness">Automated Test Harness</option>
                    <option value="Peer Review Panel">Peer Review Panel</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Practical Task Scenario Description
                </label>
                <textarea
                  rows={2}
                  value={practicalDesc}
                  onChange={(e) => setPracticalDesc(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Submission Format
                  </label>
                  <input
                    type="text"
                    value={practicalFormat}
                    onChange={(e) => setPracticalFormat(e.target.value)}
                    placeholder="e.g. Git Repository link + Loom video, In-Person Board Demonstration"
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Estimated Time (Hours)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={practicalHours}
                    onChange={(e) => setPracticalHours(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                  />
                </div>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              Hands-on practical task is disabled; candidates are evaluated via theory and credential verification.
            </p>
          )}
        </div>

        {/* Section 6: Confirmation, Validity & Passing Criteria */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[11px] flex items-center justify-center font-mono">6</span>
              <span>Confirmation, Validity & Re-Verification Protocol</span>
            </h2>
            <span className="text-[11px] text-slate-500">Governance Gates</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Validity Period (Months)
              </label>
              <select
                value={validityMonths}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setValidityMonths(val);
                  if (val === 0) setValidityLabel('Non-expiring (Lifetime)');
                  else if (val === 12) setValidityLabel('1 Year');
                  else if (val === 24) setValidityLabel('2 Years');
                  else if (val === 36) setValidityLabel('3 Years');
                }}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value={0}>0 (Non-expiring / Lifetime)</option>
                <option value={12}>12 Months (1 Year)</option>
                <option value={24}>24 Months (2 Years)</option>
                <option value={36}>36 Months (3 Years)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Overall Minimum Passing %
              </label>
              <input
                type="number"
                min="50"
                max="100"
                value={overallScore}
                onChange={(e) => setOverallScore(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Evaluator Consensus Model
              </label>
              <select
                value={evaluatorConsensus}
                onChange={(e) => setEvaluatorConsensus(e.target.value as any)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white"
              >
                <option value="Single Certified Reviewer">Single Certified Reviewer</option>
                <option value="2 of 3 Consensus">2 of 3 Consensus</option>
                <option value="Unanimous Panel">Unanimous Panel</option>
              </select>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Re-Verification & Continuing Practice Rules
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Required Continuing Education (CE) Hours
                </label>
                <input
                  type="number"
                  min="0"
                  value={reVerifCECredits}
                  onChange={(e) => setReVerifCECredits(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Re-Verification Instructions
                </label>
                <input
                  type="text"
                  value={reVerifInstructions}
                  onChange={(e) => setReVerifInstructions(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg bg-white"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={reVerifRefresherExam}
                  onChange={(e) => setReVerifRefresherExam(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span>Refresher Quiz Required on Renewal</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
                <input
                  type="checkbox"
                  checked={reVerifWorkEvidence}
                  onChange={(e) => setReVerifWorkEvidence(e.target.checked)}
                  className="rounded text-sky-600"
                />
                <span>Fresh Work Evidence Submission Required</span>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => navigate('/skills')}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            Cancel & Discard
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{existingSkill ? 'Save Profile Updates' : 'Publish Skill to Sabi Directory'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
};
