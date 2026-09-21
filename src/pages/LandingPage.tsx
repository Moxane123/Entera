import React from 'react';
import { useApp } from '../context/AppContext';
import { EnteraLogo } from '../components/EnteraLogo';
import {
  ArrowRight,
  ShieldCheck,
  Compass,
  AlertCircle,
  CheckCircle2,
  HelpCircle,
  DoorOpen,
  Eye,
  FileCheck2
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { navigate, creatorUser, openAuthModal } = useApp();

  const handleCreateClick = () => {
    if (creatorUser) {
      navigate('/create');
    } else {
      openAuthModal('/create');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] pb-16 flex flex-col items-center">
      {/* Organic Sky Blue Decorative Backing (Directly adapting reference Screenshot 1) */}
      <div className="absolute top-0 left-0 right-0 h-96 sm:h-[420px] overflow-hidden pointer-events-none -z-10">
        <svg
          className="w-full h-full object-cover"
          viewBox="0 0 1440 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EBF4FF" />
              <stop offset="50%" stopColor="#D8EAFD" />
              <stop offset="100%" stopColor="#F8FAFC" />
            </linearGradient>
            <linearGradient id="blobGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#60A5FA" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="blobGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2563EB" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.12" />
            </linearGradient>
          </defs>

          {/* Background Wash */}
          <rect width="1440" height="420" fill="url(#skyGrad)" />

          {/* Organic Fluid Curves inspired by CryptoRank Screen 1 */}
          <path
            d="M -60 0 C 140 180 340 240 560 160 C 720 100 860 140 1020 220 C 1220 320 1400 240 1520 180 L 1520 0 Z"
            fill="url(#blobGrad1)"
          />
          <path
            d="M 640 -50 C 780 80 960 180 1180 140 C 1320 110 1440 160 1500 210 L 1500 -50 Z"
            fill="url(#blobGrad2)"
          />
        </svg>
      </div>

      <div className="w-full max-w-2xl px-4 sm:px-6 pt-6 sm:pt-10 flex flex-col items-center">
        {/* HERO SECTION */}
        <section className="w-full text-center flex flex-col items-center pt-2 sm:pt-4">
          {/* Entera Gateway Portal Icon */}
          <div className="mb-5 relative group">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-white shadow-xl shadow-blue-500/10 border border-blue-100 flex items-center justify-center p-3 sm:p-4 transition-transform group-hover:scale-105">
              <EnteraLogo size={68} />
            </div>
            {/* Soft pulsing glow badge */}
            <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold tracking-wider uppercase shadow-xs">
              Verified
            </div>
          </div>

          {/* Brand Name */}
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mt-2">
            Entera
          </h1>

          {/* Subtitle */}
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 mt-3 max-w-lg">
            The verified entry layer for applications.
          </h2>

          {/* Short Supporting Line */}
          <p className="text-base sm:text-lg text-slate-600 mt-2.5 font-medium max-w-md">
            Understand before you interact.
          </p>

          {/* Primary & Secondary Actions (Modeled on Reference Screen 1) */}
          <div className="w-full max-w-md mt-8 space-y-3">
            {/* Primary Action */}
            <button
              id="hero-explore-btn"
              onClick={() => navigate('/explore')}
              className="w-full py-4 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Compass className="w-5 h-5 text-blue-100" />
              <span>Explore Entries</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </button>

            {/* Secondary Action */}
            <button
              id="hero-create-btn"
              onClick={handleCreateClick}
              className="w-full py-4 px-6 rounded-2xl bg-white hover:bg-blue-50/70 text-blue-600 font-bold text-base border-2 border-blue-600/20 hover:border-blue-600/40 shadow-xs transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Create Entry</span>
            </button>
          </div>
        </section>

        {/* PROBLEM SECTION: Visual Transition */}
        <section className="w-full mt-14 sm:mt-16 pt-10 border-t border-slate-200/80">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              The Entry Problem
            </span>
          </div>

          <div className="space-y-4">
            {/* Step 1: The Broken Journey */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-rose-100 shadow-xs">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-rose-600 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Standard Web Interaction
                </span>
                <span className="text-[11px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md">
                  Drop-off
                </span>
              </div>

              {/* Discover -> Confusion -> Leave */}
              <div className="grid grid-cols-3 items-center gap-2 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-xs text-slate-600 font-medium">1</span>
                  <span className="text-sm font-bold text-slate-800">Discover</span>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                  <div className="my-1 p-3 w-full rounded-xl bg-rose-50 border border-rose-200/80">
                    <span className="block text-xs text-rose-600 font-medium">2</span>
                    <span className="text-sm font-bold text-rose-800">Confusion</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300" />
                </div>

                <div className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-600">
                  <span className="block text-xs text-slate-600 font-medium">3</span>
                  <span className="text-sm font-bold text-slate-600">Leave</span>
                </div>
              </div>
            </div>

            {/* Step 2: The Entera Resolution */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border-2 border-blue-500/30 shadow-md shadow-blue-500/5 relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  With Entera
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200/60 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Safe Entry
                </span>
              </div>

              {/* Discover -> Entera -> Understand -> Enter */}
              <div className="grid grid-cols-4 items-center gap-2 text-center">
                <div className="p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <span className="block text-[10px] text-slate-600 font-medium">Step 1</span>
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Discover</span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-blue-600 text-white shadow-xs">
                  <span className="block text-[10px] text-blue-200 font-medium">Step 2</span>
                  <span className="text-xs sm:text-sm font-bold text-white flex items-center justify-center gap-1">
                    Entera
                  </span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-sky-50 border border-sky-200/80">
                  <span className="block text-[10px] text-sky-600 font-medium">Step 3</span>
                  <span className="text-xs sm:text-sm font-bold text-sky-900">Understand</span>
                </div>

                <div className="p-2.5 sm:p-3 rounded-xl bg-emerald-50 border border-emerald-200/80">
                  <span className="block text-[10px] text-emerald-600 font-medium">Step 4</span>
                  <span className="text-xs sm:text-sm font-bold text-emerald-900 flex items-center justify-center gap-1">
                    <DoorOpen className="w-3.5 h-3.5 text-emerald-600 hidden sm:inline" />
                    Enter
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section className="w-full mt-14 sm:mt-16 pt-10 border-t border-slate-200/80">
          <div className="text-center mb-6">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              How It Works
            </span>
          </div>

          {/* Understand -> Prepare -> Verify */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {/* 1. Understand */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3">
                <Eye className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Step 1</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">Understand</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Clear contract summaries, audited maintainers, and safety checks.
              </p>
            </div>

            {/* 2. Prepare */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
                <FileCheck2 className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Step 2</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">Prepare</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Review required permissions, prerequisites, and canonical addresses.
              </p>
            </div>

            {/* 3. Verify */}
            <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Step 3</span>
              <h3 className="text-lg font-extrabold text-slate-900 mt-1">Verify</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Instant cryptographic and registry validation to enter with confidence.
              </p>
            </div>
          </div>

          {/* FINISH WITH: "Explore Entries" */}
          <div className="mt-8 flex justify-center">
            <button
              id="bottom-explore-btn"
              onClick={() => navigate('/explore')}
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-600/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>Explore Entries</span>
              <ArrowRight className="w-4 h-4 text-blue-200" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
