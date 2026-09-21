import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { SkillCategory } from '../types';
import { X, Plus, Trash2, FolderPlus, CheckCircle2, Sparkles } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

interface CategoryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CategoryManagerModal: React.FC<CategoryManagerModalProps> = ({ isOpen, onClose }) => {
  const { categories, addCategory } = useApp();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Award');
  const [badgeColor, setBadgeColor] = useState('sky');
  const [subcategoriesText, setSubcategoriesText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  if (!isOpen) return null;

  const availableIcons = [
    { label: 'Award', value: 'Award' },
    { label: 'Technology / Cpu', value: 'Cpu' },
    { label: 'Engineering / Gear', value: 'Settings' },
    { label: 'Trades / Wrench', value: 'Wrench' },
    { label: 'Construction / Helmet', value: 'HardHat' },
    { label: 'Fashion / Scissors', value: 'Scissors' },
    { label: 'Beauty / Sparkles', value: 'Sparkles' },
    { label: 'Creative / Palette', value: 'Palette' },
    { label: 'Business / Briefcase', value: 'Briefcase' },
    { label: 'Marketing / Megaphone', value: 'Megaphone' },
    { label: 'Events / Calendar', value: 'CalendarCheck' },
    { label: 'Education / Cap', value: 'GraduationCap' },
    { label: 'Finance / Dollar', value: 'DollarSign' },
    { label: 'Agriculture / Sprout', value: 'Sprout' },
    { label: 'Automotive / Car', value: 'Car' },
    { label: 'Hospitality / Utensils', value: 'Utensils' },
    { label: 'Practical / Compass', value: 'Compass' }
  ];

  const availableColors = [
    { label: 'Sky Blue', value: 'sky' },
    { label: 'Emerald Green', value: 'emerald' },
    { label: 'Amber Gold', value: 'amber' },
    { label: 'Indigo Purple', value: 'indigo' },
    { label: 'Rose Pink', value: 'rose' },
    { label: 'Teal Cyan', value: 'teal' },
    { label: 'Orange', value: 'orange' },
    { label: 'Slate Gray', value: 'slate' }
  ];

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please provide a category name.');
      return;
    }

    const categoryId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    if (categories.some((c) => c.id === categoryId)) {
      setError('A category with this name or identifier already exists.');
      return;
    }

    const subcats = subcategoriesText
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const newCat: SkillCategory = {
      id: categoryId,
      name: name.trim(),
      iconName,
      description: description.trim() || `Specialized skill category for ${name.trim()}.`,
      subcategories: subcats.length > 0 ? subcats : ['General', 'Advanced Practice'],
      badgeColor,
      isCustom: true
    };

    addCategory(newCat);
    setSuccess(`Category "${name}" created successfully!`);
    setName('');
    setDescription('');
    setSubcategoriesText('');
    setError('');

    setTimeout(() => {
      setSuccess('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Manage & Add Skill Categories
              </h2>
              <p className="text-xs text-slate-500">
                Expand Sabi beyond default professions with custom categories and subcategories.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 sm:p-6 space-y-6 flex-1">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{success}</span>
            </div>
          )}

          {/* New Category Form */}
          <form onSubmit={handleCreateCategory} className="bg-slate-50/70 p-4 sm:p-5 rounded-2xl border border-slate-200/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5 text-sky-600" />
              <span>Create New Skill Category</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Healthcare & Nursing, Maritime, Aviation"
                  className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Icon & Visual Accent
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <select
                    value={iconName}
                    onChange={(e) => setIconName(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {availableIcons.map((ic) => (
                      <option key={ic.value} value={ic.value}>
                        {ic.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={badgeColor}
                    onChange={(e) => setBadgeColor(e.target.value)}
                    className="w-full px-2.5 py-2 text-xs border border-slate-200 rounded-xl bg-white"
                  >
                    {availableColors.map((col) => (
                      <option key={col.value} value={col.value}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Description / Scope
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly define the scope of professions under this category"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subcategories (comma separated)
              </label>
              <input
                type="text"
                value={subcategoriesText}
                onChange={(e) => setSubcategoriesText(e.target.value)}
                placeholder="e.g. Critical Care, Pediatric Nursing, Clinical Pharmacology"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Separate multiple subcategories with commas.
              </p>
            </div>

            <div className="flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Save Category</span>
              </button>
            </div>
          </form>

          {/* Existing Categories List */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Existing Registered Categories ({categories.length})
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-64 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="p-3 rounded-xl border border-slate-200/80 bg-white hover:border-slate-300 flex items-start gap-2.5 transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CategoryIcon name={cat.iconName} className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">{cat.name}</span>
                      {cat.isCustom && (
                        <span className="px-1 py-0.2 text-[9px] font-bold bg-purple-100 text-purple-700 rounded">
                          Custom
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">{cat.description}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      {cat.subcategories.length} subcategories
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-white border border-slate-200 text-slate-700 rounded-xl hover:bg-slate-100 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
