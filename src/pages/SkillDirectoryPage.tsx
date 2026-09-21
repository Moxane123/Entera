import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { SkillCategory, SkillItem, SkillLevel, SkillActiveStatus } from '../types';
import {
  Search,
  Filter,
  Layers,
  ShieldCheck,
  Award,
  Clock,
  Plus,
  ArrowRight,
  FolderPlus,
  SlidersHorizontal,
  CheckCircle2,
  AlertCircle,
  Settings,
  Sparkles,
  BookOpen,
  Wrench,
  Tag
} from 'lucide-react';
import { CategoryIcon } from '../components/CategoryIcon';
import { CategoryManagerModal } from '../components/CategoryManagerModal';

export const SkillDirectoryPage: React.FC = () => {
  const { skills, categories, navigate, isAdminMode, toggleAdminMode } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [categoryModalOpen, setCategoryModalOpen] = useState<boolean>(false);

  // Get active category object
  const currentCatObj = categories.find((c) => c.id === selectedCategory);

  // Filter skills
  const filteredSkills = useMemo(() => {
    return skills.filter((skill) => {
      // Category filter
      if (selectedCategory !== 'all' && skill.categoryId !== selectedCategory) {
        return false;
      }

      // Subcategory filter
      if (selectedSubcategory !== 'all' && skill.subcategory !== selectedSubcategory) {
        return false;
      }

      // Active status filter (if public, show active by default, or filtered)
      if (statusFilter !== 'all' && skill.activeStatus !== statusFilter) {
        return false;
      }

      // Skill level filter
      if (selectedLevel !== 'all' && !skill.availableLevels.some((l) => l.includes(selectedLevel))) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const inName = skill.name.toLowerCase().includes(q);
        const inDesc = skill.description.toLowerCase().includes(q);
        const inCat = skill.categoryName.toLowerCase().includes(q);
        const inSub = skill.subcategory.toLowerCase().includes(q);
        const inTags = skill.tags.some((t) => t.toLowerCase().includes(q));
        const inProfile = skill.verificationProfile.profileName.toLowerCase().includes(q);
        return inName || inDesc || inCat || inSub || inTags || inProfile;
      }

      return true;
    });
  }, [skills, selectedCategory, selectedSubcategory, statusFilter, selectedLevel, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-24">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider bg-sky-100 text-sky-800 rounded-md">
              Sabi Skill Directory
            </span>
            <span className="text-xs text-slate-400 font-mono">• Verification Profile Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-1">
            Standardized Skill Directory & Verification Profiles
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl">
            Explore verified professions, dynamic verification methods, rubrics, and passing criteria across
            technology, skilled trades, construction, fashion, agriculture, and practical disciplines.
          </p>
        </div>

        {/* Admin Controls & Actions */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={toggleAdminMode}
            className={`px-3 py-2 text-xs font-bold rounded-xl border transition-colors flex items-center gap-1.5 shadow-xs ${
              isAdminMode
                ? 'bg-purple-600 text-white border-purple-600'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle administrator configuration mode"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Admin Mode: {isAdminMode ? 'Active' : 'Off'}</span>
          </button>

          {isAdminMode && (
            <>
              <button
                onClick={() => setCategoryModalOpen(true)}
                className="px-3 py-2 text-xs font-semibold bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <FolderPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>Manage Categories</span>
              </button>

              <button
                onClick={() => navigate('/skills/new')}
                className="px-4 py-2 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Configure New Skill</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skills by title, subcategory, tags, or domain requirements..."
              className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
            />
          </div>

          {/* Level Filter */}
          <div className="sm:w-48">
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Skill Levels</option>
              <option value="Beginner">Beginner / Foundational</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Master">Master / Specialist</option>
            </select>
          </div>

          {/* Active Status Filter */}
          <div className="sm:w-36">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
        </div>

        {/* Category Pill Bar */}
        <div className="pt-2 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedSubcategory('all');
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            <span>All Categories</span>
            <span className="text-[10px] opacity-75 font-mono">({skills.length})</span>
          </button>

          {categories.map((cat) => {
            const count = skills.filter((s) => s.categoryId === cat.id).length;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setSelectedSubcategory('all');
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <CategoryIcon name={cat.iconName} className="w-3.5 h-3.5" />
                <span>{cat.name}</span>
                {count > 0 && <span className="text-[10px] opacity-80 font-mono">({count})</span>}
                {cat.isCustom && (
                  <span className="text-[9px] px-1 bg-white/20 rounded font-bold">Custom</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Subcategory Pill Bar if category selected */}
        {currentCatObj && currentCatObj.subcategories.length > 0 && (
          <div className="pt-2 flex items-center gap-1.5 overflow-x-auto text-xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
              Subcategories:
            </span>
            <button
              onClick={() => setSelectedSubcategory('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                selectedSubcategory === 'all'
                  ? 'bg-sky-100 text-sky-800 font-bold'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              All {currentCatObj.name}
            </button>
            {currentCatObj.subcategories.map((sub) => (
              <button
                key={sub}
                onClick={() => setSelectedSubcategory(sub)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap ${
                  selectedSubcategory === sub
                    ? 'bg-sky-100 text-sky-800 font-bold'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count & Meta */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong className="text-slate-800 font-bold">{filteredSkills.length}</strong> skills in directory
        </span>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="text-sky-600 hover:underline font-semibold"
          >
            Clear search filters
          </button>
        )}
      </div>

      {/* Skill Cards Grid */}
      {filteredSkills.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No matching skills found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try adjusting your search criteria, category selection, or level filters.
          </p>
          {isAdminMode && (
            <button
              onClick={() => navigate('/skills/new')}
              className="px-4 py-2 bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs"
            >
              Configure This Skill Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSkills.map((skill) => {
            const profile = skill.verificationProfile;
            return (
              <div
                key={skill.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 p-5 sm:p-6 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group"
              >
                <div className="space-y-3">
                  {/* Category and Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="px-2 py-0.5 text-[11px] font-bold bg-sky-50 text-sky-700 border border-sky-100 rounded-md flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{skill.categoryName}</span>
                      </span>
                      <span className="px-2 py-0.5 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-md">
                        {skill.subcategory}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider ${
                          skill.activeStatus === 'active'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {skill.activeStatus}
                      </span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3
                      onClick={() => navigate(`/skills/${skill.id}`)}
                      className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors cursor-pointer"
                    >
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                      {skill.description}
                    </p>
                  </div>

                  {/* Available Skill Levels */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Levels:
                    </span>
                    {skill.availableLevels.map((lvl) => (
                      <span
                        key={lvl}
                        className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                          lvl === profile.targetSkillLevel
                            ? 'bg-slate-900 text-white font-bold'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {lvl}
                      </span>
                    ))}
                  </div>

                  {/* Verification Profile Highlight Box */}
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/70 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-800 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-sky-600" />
                        <span>Profile: {profile.profileName}</span>
                      </span>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">
                        Target: {profile.targetSkillLevel.split('/')[0]}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-200/50">
                      <div>
                        <span className="text-slate-400 block">Required Methods:</span>
                        <span className="font-semibold text-slate-800">
                          {profile.requiredMethods.length} Mandatory Gates
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Passing Benchmark:</span>
                        <span className="font-bold text-slate-900 font-mono">
                          {profile.passingCriteria.overallMinScorePercentage}% Threshold
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Validity Horizon:</span>
                        <span className="font-semibold text-slate-800 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {profile.validityPeriodLabel}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block">Consensus Standard:</span>
                        <span className="font-semibold text-slate-800 truncate block">
                          {profile.passingCriteria.evaluatorConsensusRequired}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    {isAdminMode && (
                      <button
                        onClick={() => navigate(`/skills/edit/${skill.id}`)}
                        className="px-2.5 py-1 text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors"
                      >
                        Edit Profile
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => navigate(`/skills/${skill.id}`)}
                    className="px-4 py-2 bg-slate-900 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5 group-hover:bg-sky-600"
                  >
                    <span>View Verification Requirements</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Manager Modal */}
      <CategoryManagerModal
        isOpen={categoryModalOpen}
        onClose={() => setCategoryModalOpen(false)}
      />
    </div>
  );
};
