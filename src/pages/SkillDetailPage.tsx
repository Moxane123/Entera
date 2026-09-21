import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  SkillItem,
  SkillLevel,
  VerificationMethodType,
  VerificationProfile
} from '../types';
import {
  ShieldCheck,
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
  ChevronRight,
  Sparkles,
  ExternalLink,
  HelpCircle,
  Edit3,
  Calendar,
  Layers,
  FileText,
  BadgeCheck,
  Percent,
  Check,
  Info
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';

interface SkillDetailPageProps {
  skillId: string;
}

export const SkillDetailPage: React.FC<SkillDetailPageProps> = ({ skillId }) => {
  const { skills, getSkill, navigate, isAdminMode } = useApp();

  const skill = getSkill(skillId);

  // Tab or view inside skill detail
  const [activeTab, setActiveTab] = useState<'overview' | 'methods' | 'evidence' | 'tasks' | 'readiness'>('overview');

  // Interactive Candidate Readiness Simulator state
  const [candidateCompleted, setCandidateCompleted] = useState<{
    evidenceProvided: boolean[];
    examPassed: boolean;
    practicalSubmitted: boolean;
    confirmationObtained: boolean;
  }>({
    evidenceProvided: [false, false, false, false],
    examPassed: false,
    practicalSubmitted: false,
    confirmationObtained: false
  });

  const [simulationResultOpen, setSimulationResultOpen] = useState(false);

  if (!skill) {
    return (
      <div className="max-w-4xl mx-auto py-12 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Skill Not Found</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          The requested skill profile does not exist in the Sabi Skill Directory or may have been updated.
        </p>
        <button
          onClick={() => navigate('/skills')}
          className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs"
        >
          Return to Skill Directory
        </button>
      </div>
    );
  }

  const profile = skill.verificationProfile;
  const isTargetAdvancedOrMaster =
    profile.targetSkillLevel.includes('Advanced') || profile.targetSkillLevel.includes('Master');

  // Calculate simulated score
  let simScore = 0;
  let totalSimWeight = 0;

  profile.availableMethods.forEach((method) => {
    const weight = method.weightPercentage ?? 0;
    totalSimWeight += weight;
    if (method.type === 'credential_document' && candidateCompleted.evidenceProvided.some(Boolean)) {
      simScore += weight;
    } else if (method.type === 'knowledge_assessment' && candidateCompleted.examPassed) {
      simScore += weight;
    } else if (method.type === 'practical_task' && candidateCompleted.practicalSubmitted) {
      simScore += weight;
    } else if (method.type === 'peer_confirmation' && candidateCompleted.confirmationObtained) {
      simScore += weight;
    }
  });

  const meetsPassingScore = simScore >= profile.passingCriteria.overallMinScorePercentage;
  const meetsMandatoryGates =
    (!profile.passingCriteria.mustPassAssessment || candidateCompleted.examPassed) &&
    (!profile.passingCriteria.mustPassPracticalTask || candidateCompleted.practicalSubmitted);

  const isSimReady = meetsPassingScore && meetsMandatoryGates;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/skills')}
          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Skill Directory</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdminMode && (
            <button
              onClick={() => navigate(`/skills/edit/${skill.id}`)}
              className="px-3 py-1.5 text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 rounded-xl hover:bg-purple-100 flex items-center gap-1.5 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Configure This Profile (Admin)</span>
            </button>
          )}

          <span className="px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider bg-slate-100 text-slate-700 rounded-lg">
            Profile ID: {skill.id}
          </span>
        </div>
      </div>

      {/* Main Skill Card Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-50 text-sky-700 border border-sky-100 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{skill.categoryName}</span>
              </span>

              <span className="text-slate-300">•</span>

              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-50 text-slate-700 border border-slate-200">
                {skill.subcategory}
              </span>

              <span
                className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider ${
                  skill.activeStatus === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {skill.activeStatus}
              </span>

              <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 border border-sky-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                <span>{skill.verificationStatus.replace('_', ' ')}</span>
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {skill.name}
              </h1>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-3xl">
                {skill.description}
              </p>
            </div>

            {/* Available Skill Levels */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Available Skill Levels:
              </span>
              {skill.availableLevels.map((lvl) => {
                const isTarget = lvl === profile.targetSkillLevel;
                return (
                  <span
                    key={lvl}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      isTarget
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {lvl} {isTarget && '★ Verifying'}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Quick Verification Profile Summary Box */}
          <div className="w-full md:w-72 bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200/80 shrink-0 space-y-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Verification Spec</span>
              </span>
              <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                Level: {profile.targetSkillLevel.split('/')[0]}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-slate-600">
                <span>Passing Threshold:</span>
                <span className="font-bold font-mono text-slate-900">
                  {profile.passingCriteria.overallMinScorePercentage}% Score
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Validity Period:</span>
                <span className="font-semibold text-slate-900 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" />
                  {profile.validityPeriodLabel}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Consensus Standard:</span>
                <span className="font-semibold text-slate-900 text-right text-[11px]">
                  {profile.passingCriteria.evaluatorConsensusRequired}
                </span>
              </div>

              <div className="flex justify-between items-center text-slate-600">
                <span>Required Methods:</span>
                <span className="font-bold text-sky-700">
                  {profile.requiredMethods.length} Mandatory
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveTab('readiness');
                window.scrollTo({ top: 600, behavior: 'smooth' });
              }}
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Check Verification Readiness</span>
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 overflow-x-auto gap-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Info className="w-4 h-4" />
          <span>Verification Overview</span>
        </button>

        <button
          onClick={() => setActiveTab('methods')}
          className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'methods'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Verification Methods ({profile.availableMethods.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('evidence')}
          className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'evidence'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>Evidence & Credentials ({profile.evidenceRequirements.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tasks')}
          className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'tasks'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Wrench className="w-4 h-4" />
          <span>Assessment & Practical Tasks</span>
        </button>

        <button
          onClick={() => setActiveTab('readiness')}
          className={`px-4 py-2.5 text-xs font-bold tracking-tight border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
            activeTab === 'readiness'
              ? 'border-sky-600 text-sky-700'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Readiness Checklist & Simulator</span>
        </button>
      </div>

      {/* Tab 1: Automatic Explanation & Profile Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Automatic Explanation Banner */}
          <div className="bg-sky-50/60 border border-sky-100 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-sky-900">
                Automated Verification Profile Explanation
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              This skill utilizes a{' '}
              <strong className="text-slate-900 font-semibold">{profile.profileName}</strong> engineered specifically
              for candidate evaluation at the <strong className="text-slate-900 font-semibold">{profile.targetSkillLevel}</strong> tier.
              To achieve verified credential status, candidates must satisfy{' '}
              <strong className="text-slate-900 font-semibold">{profile.requiredMethods.length} mandatory verification methods</strong>{' '}
              and secure a minimum composite score of{' '}
              <strong className="text-slate-900 font-semibold">{profile.passingCriteria.overallMinScorePercentage}%</strong>.
            </p>
          </div>

          {/* Grid of Requirement Pillars */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Required vs Optional Methods Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-sky-600" />
                  <span>Mandatory vs. Optional Methods</span>
                </h4>
                <span className="text-[11px] text-slate-500">Method Split</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <span className="text-[11px] font-bold text-sky-800 uppercase tracking-wider block mb-1.5">
                    Mandatory Gates ({profile.requiredMethods.length})
                  </span>
                  <div className="space-y-1.5">
                    {profile.availableMethods
                      .filter((m) => m.isRequired)
                      .map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-sky-50/50 border border-sky-100 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                            <span className="font-semibold text-slate-800">{m.name}</span>
                          </div>
                          <span className="font-mono text-xs font-bold text-sky-700 bg-sky-100/80 px-2 py-0.5 rounded">
                            {m.weightPercentage}%
                          </span>
                        </div>
                      ))}
                  </div>
                </div>

                {profile.optionalMethods.length > 0 && (
                  <div className="pt-2">
                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1.5">
                      Optional / Supplementary ({profile.optionalMethods.length})
                    </span>
                    <div className="space-y-1.5">
                      {profile.availableMethods
                        .filter((m) => !m.isRequired)
                        .map((m) => (
                          <div
                            key={m.id}
                            className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 rounded-full bg-slate-400" />
                              <span className="font-medium text-slate-700">{m.name}</span>
                            </div>
                            <span className="font-mono text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                              +{m.weightPercentage}%
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Passing Criteria & Evaluation Card */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Passing Criteria & Standards</span>
                </h4>
                <span className="text-[11px] text-slate-500">Benchmark</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                    Minimum Benchmark
                  </span>
                  <p className="text-emerald-800 text-xs leading-relaxed">
                    {profile.passingCriteria.rubricSummary}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">All Mandatory Evidence Validated:</span>
                    <span className="font-bold text-slate-900">
                      {profile.passingCriteria.mustPassAllMandatoryEvidence ? 'Required (Strict)' : 'Flexible'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Assessment Score Threshold:</span>
                    <span className="font-bold text-slate-900">
                      {profile.assessmentRequirements.enabled
                        ? `${profile.assessmentRequirements.passingScorePercentage}% or Higher`
                        : 'Exempt'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Hands-on Practical Task:</span>
                    <span className="font-bold text-slate-900">
                      {profile.passingCriteria.mustPassPracticalTask ? 'Mandatory Rubric Pass' : 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Independent Confirmation:</span>
                    <span className="font-bold text-slate-900">
                      {profile.confirmationRequirements.enabled
                        ? `${profile.confirmationRequirements.requiredConfirmationsCount} Sign-off Required`
                        : 'None'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Validity & Re-Verification Protocol */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <RotateCcw className="w-4 h-4 text-amber-600" />
                <span>Validity Period & Re-Verification Protocol</span>
              </h4>
              <span className="text-[11px] font-semibold text-slate-500">
                Duration: {profile.validityPeriodLabel}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs pt-1">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Validity Horizon</span>
                <p className="text-slate-600 text-xs">
                  {profile.validityPeriodMonths === 0
                    ? 'Permanent / Lifetime certification. No expiration once verified.'
                    : `Verified credential is valid for ${profile.validityPeriodMonths} months (${profile.validityPeriodLabel}) from issuance date.`}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Continuing Education (CE)</span>
                <p className="text-slate-600 text-xs">
                  {(profile.reVerificationRequirements.ceCreditsRequired ?? 0) > 0
                    ? `${profile.reVerificationRequirements.ceCreditsRequired} Continuing Education Units (CEUs) required before renewal.`
                    : 'No ongoing CE credits mandated.'}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-800 block mb-1">Renewal Protocol</span>
                <p className="text-slate-600 text-xs">
                  {profile.reVerificationRequirements.instructions}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Verification Methods */}
      {activeTab === 'methods' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configured Verification Methods</h3>
              <p className="text-xs text-slate-500">
                Breakdown of how this skill assesses candidates across credentials, theory, tasks, and confirmations.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {profile.availableMethods.map((m) => (
              <div
                key={m.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                        m.isRequired ? 'bg-sky-100 text-sky-800' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {m.isRequired ? 'Mandatory Requirement' : 'Optional Supplementary'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">{m.description}</p>
                  <span className="inline-block text-[11px] font-mono text-slate-400">
                    Method Type: {m.type}
                  </span>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-auto shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] font-semibold text-slate-400 block uppercase">Weight</span>
                    <span className="text-base font-extrabold font-mono text-sky-700">
                      {m.weightPercentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Evidence & Credentials */}
      {activeTab === 'evidence' && (
        <div className="space-y-4 animate-in fade-in duration-200">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Evidence & Portfolio Requirements</h3>
            <p className="text-xs text-slate-500">
              Review acceptable documentation, licensing proofs, and portfolio artifacts required for this skill.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {profile.evidenceRequirements.map((ev) => (
              <div
                key={ev.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-3 shadow-xs"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{ev.title}</h4>
                      {ev.isMandatory ? (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded">
                          Mandatory
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded">
                          Optional
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-600 mt-1">{ev.description}</p>
                  </div>

                  <span className="px-2.5 py-1 text-xs font-mono bg-slate-100 text-slate-700 rounded-lg shrink-0">
                    {ev.minFilesCount} to {ev.maxFilesCount} File(s)
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100 text-xs">
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Accepted Formats:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {ev.acceptedFormats.map((fmt) => (
                        <span key={fmt} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-mono">
                          {fmt}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block mb-0.5">
                      Official Issuer Registry Check:
                    </span>
                    <span className="text-slate-800 font-medium">
                      {ev.requiresOfficialIssuerVerification
                        ? 'Yes — cross-referenced against governmental or accredited database.'
                        : 'No — direct artifact review by verifier.'}
                    </span>
                  </div>
                </div>

                {ev.sampleDocumentDescription && (
                  <div className="p-3 rounded-xl bg-slate-50 text-xs text-slate-600">
                    <strong className="text-slate-800 font-semibold">Sample Description: </strong>
                    {ev.sampleDocumentDescription}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Assessment & Practical Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Assessment Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>Knowledge Assessment Specification</span>
              </h3>
              <span
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  profile.assessmentRequirements.enabled
                    ? 'bg-indigo-50 text-indigo-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {profile.assessmentRequirements.enabled ? 'Active Assessment' : 'Disabled'}
              </span>
            </div>

            {profile.assessmentRequirements.enabled ? (
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {profile.assessmentRequirements.title}
                    </h4>
                    <p className="text-slate-600 mt-0.5">
                      Format: {profile.assessmentRequirements.format}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
                    Pass: {profile.assessmentRequirements.passingScorePercentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Duration</span>
                    <span className="font-bold text-slate-900">{profile.assessmentRequirements.durationMinutes} Minutes</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Questions</span>
                    <span className="font-bold text-slate-900">{profile.assessmentRequirements.questionCount} Scenarios</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Proctored</span>
                    <span className="font-bold text-slate-900">{profile.assessmentRequirements.isProctored ? 'Yes (Identity Guard)' : 'Self-Paced'}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Retake Policy</span>
                    <span className="font-bold text-slate-900">{profile.assessmentRequirements.maxAttemptsAllowed} Max Attempts</span>
                  </div>
                </div>

                {profile.assessmentRequirements.proctoringNotes && (
                  <p className="text-slate-500 text-[11px] italic">
                    Note: {profile.assessmentRequirements.proctoringNotes}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-xs text-slate-500">No standardized exam required for this verification profile.</p>
            )}
          </div>

          {/* Practical Task Section */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 space-y-4 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600" />
                <span>Practical Hands-On Evaluation & Rubric</span>
              </h3>
              <span
                className={`px-2 py-0.5 text-[11px] font-bold rounded ${
                  profile.practicalTaskRequirements.enabled
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {profile.practicalTaskRequirements.enabled ? 'Hands-On Benchmark' : 'Disabled'}
              </span>
            </div>

            {profile.practicalTaskRequirements.enabled ? (
              <div className="space-y-4 text-xs">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    {profile.practicalTaskRequirements.taskTitle}
                  </h4>
                  <p className="text-slate-700 mt-1 leading-relaxed">
                    {profile.practicalTaskRequirements.taskDescription}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">Submission Format</span>
                    <span className="text-slate-700">{profile.practicalTaskRequirements.submissionFormat}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[11px] font-bold text-slate-800 block mb-1">Evaluation Authority</span>
                    <span className="text-slate-700">{profile.practicalTaskRequirements.reviewedBy}</span>
                  </div>
                </div>

                {/* Rubric Table */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                    Detailed Evaluation Rubric
                  </span>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="p-2.5">Evaluation Criteria</th>
                          <th className="p-2.5">Standard Description</th>
                          <th className="p-2.5 text-right">Points</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {profile.practicalTaskRequirements.evaluationRubric.map((r, i) => (
                          <tr key={i} className="hover:bg-slate-50/50">
                            <td className="p-2.5 font-bold text-slate-900">{r.criteria}</td>
                            <td className="p-2.5 text-slate-600">{r.description}</td>
                            <td className="p-2.5 text-right font-mono font-bold text-amber-700">{r.points} pts</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500">No hands-on practical task required for this skill profile.</p>
            )}
          </div>
        </div>
      )}

      {/* Tab 5: Candidate Readiness Checklist & Simulator */}
      {activeTab === 'readiness' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Interactive Verification Simulator</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              Check Your Verification Eligibility for {skill.name}
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Test whether your credentials, knowledge scores, and practical deliverables meet this skill’s
              dynamic verification criteria ({profile.passingCriteria.overallMinScorePercentage}% required).
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 space-y-6 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Simulate Your Candidate Submissions
            </h4>

            {/* Checklist Items */}
            <div className="space-y-3">
              {/* Evidence Checklist */}
              {profile.evidenceRequirements.map((ev, idx) => (
                <div
                  key={ev.id}
                  className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`ev-chk-${idx}`}
                      checked={candidateCompleted.evidenceProvided[idx] || false}
                      onChange={(e) => {
                        const updated = [...candidateCompleted.evidenceProvided];
                        updated[idx] = e.target.checked;
                        setCandidateCompleted({ ...candidateCompleted, evidenceProvided: updated });
                      }}
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor={`ev-chk-${idx}`} className="text-xs cursor-pointer">
                      <span className="font-bold text-slate-900">{ev.title}</span>
                      <span className="text-slate-500 block text-[11px]">
                        {ev.isMandatory ? 'Required Evidence Gate' : 'Optional Portfolio Artifact'}
                      </span>
                    </label>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {candidateCompleted.evidenceProvided[idx] ? 'Uploaded ✓' : 'Pending'}
                  </span>
                </div>
              ))}

              {/* Exam Checklist */}
              {profile.assessmentRequirements.enabled && (
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="exam-chk"
                      checked={candidateCompleted.examPassed}
                      onChange={(e) =>
                        setCandidateCompleted({ ...candidateCompleted, examPassed: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="exam-chk" className="text-xs cursor-pointer">
                      <span className="font-bold text-slate-900">
                        {profile.assessmentRequirements.title} (Passed ≥ {profile.assessmentRequirements.passingScorePercentage}%)
                      </span>
                      <span className="text-slate-500 block text-[11px]">
                        Proctored scenario assessment ({profile.assessmentRequirements.questionCount} questions)
                      </span>
                    </label>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {candidateCompleted.examPassed ? 'Passed ✓' : 'Not Taken'}
                  </span>
                </div>
              )}

              {/* Practical Task Checklist */}
              {profile.practicalTaskRequirements.enabled && (
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="practical-chk"
                      checked={candidateCompleted.practicalSubmitted}
                      onChange={(e) =>
                        setCandidateCompleted({ ...candidateCompleted, practicalSubmitted: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="practical-chk" className="text-xs cursor-pointer">
                      <span className="font-bold text-slate-900">
                        Practical Deliverable: {profile.practicalTaskRequirements.taskTitle}
                      </span>
                      <span className="text-slate-500 block text-[11px]">
                        Benchmark submission satisfying evaluation rubric
                      </span>
                    </label>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {candidateCompleted.practicalSubmitted ? 'Approved ✓' : 'Pending'}
                  </span>
                </div>
              )}

              {/* Confirmation Checklist */}
              {profile.confirmationRequirements.enabled && (
                <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="conf-chk"
                      checked={candidateCompleted.confirmationObtained}
                      onChange={(e) =>
                        setCandidateCompleted({ ...candidateCompleted, confirmationObtained: e.target.checked })
                      }
                      className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
                    />
                    <label htmlFor="conf-chk" className="text-xs cursor-pointer">
                      <span className="font-bold text-slate-900">
                        Peer / Supervisor Attestation ({profile.confirmationRequirements.requiredConfirmationsCount} Signer)
                      </span>
                      <span className="text-slate-500 block text-[11px]">
                        Signed by: {profile.confirmationRequirements.eligibleSignersDescription}
                      </span>
                    </label>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    {candidateCompleted.confirmationObtained ? 'Attested ✓' : 'Unsigned'}
                  </span>
                </div>
              )}
            </div>

            {/* Score & Passing Calculation Bar */}
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Simulated Candidate Score
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-3xl font-extrabold font-mono text-slate-900">
                      {simScore}%
                    </span>
                    <span className="text-xs text-slate-500">
                      / {profile.passingCriteria.overallMinScorePercentage}% required threshold
                    </span>
                  </div>
                </div>

                <div className="shrink-0">
                  {isSimReady ? (
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5 shadow-xs">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Ready for Verification Issuance</span>
                    </span>
                  ) : (
                    <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1.5">
                      <AlertCircle className="w-4 h-4 text-amber-600" />
                      <span>Requirements Not Yet Met</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    isSimReady ? 'bg-emerald-500' : 'bg-sky-500'
                  }`}
                  style={{ width: `${Math.min(100, simScore)}%` }}
                />
              </div>

              <div className="text-xs text-slate-600 flex items-center justify-between">
                <span>Evaluator Consensus: {profile.passingCriteria.evaluatorConsensusRequired}</span>
                <span>Validity: {profile.validityPeriodLabel}</span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => {
                  alert(
                    isSimReady
                      ? `Candidate dossier successfully verified! Meets all gates for ${skill.name} (${profile.targetSkillLevel}).`
                      : `Candidate does not yet meet the mandatory requirements (${simScore}% / ${profile.passingCriteria.overallMinScorePercentage}%). Please complete missing mandatory gates.`
                  );
                }}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-2 ${
                  isSimReady
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-slate-900 hover:bg-slate-800 text-white'
                }`}
              >
                <BadgeCheck className="w-4 h-4" />
                <span>{isSimReady ? 'Submit Application Dossier' : 'Review Incomplete Gates'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
