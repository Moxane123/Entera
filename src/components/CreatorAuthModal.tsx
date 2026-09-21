import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { EnteraLogo } from './EnteraLogo';
import { X, ArrowRight, CheckCircle2, ShieldCheck, Mail, User } from 'lucide-react';

export const CreatorAuthModal: React.FC = () => {
  const { authModalOpen, setAuthModalOpen, loginCreator, signupCreator, authReturnPath } = useApp();
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!authModalOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    loginCreator(email.trim());
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    signupCreator({
      email: email.trim(),
      name: name.trim() || email.split('@')[0] || 'Entera Creator'
    });
  };

  const handleQuickDemo = () => {
    setError('');
    loginCreator('maintainer@entera.app');
  };

  const handleClose = () => {
    setError('');
    setAuthModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/80 hover:bg-white text-slate-500 hover:text-slate-800 transition-colors shadow-xs"
          title="Close and continue exploring publicly"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ambient Top Pattern matching reference Screenshot 1 */}
        <div className="relative h-44 bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 flex flex-col items-center justify-center overflow-hidden p-4 text-center">
          {/* Subtle curved background accents */}
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/10 rounded-full blur-xl pointer-events-none" />
          <div className="absolute -bottom-8 -right-8 w-52 h-52 bg-sky-300/20 rounded-3xl rotate-12 blur-md pointer-events-none" />

          {/* Entera Portal Emblem */}
          <div className="relative z-10 w-14 h-14 mb-2.5 rounded-2xl bg-white shadow-md flex items-center justify-center p-2">
            <EnteraLogo size={42} />
          </div>

          <h2 className="relative z-10 text-xl font-extrabold tracking-tight text-white">
            Entera Creator Access
          </h2>
          <p className="relative z-10 text-xs text-blue-100 mt-0.5 max-w-xs font-medium">
            {authReturnPath === '/dashboard'
              ? 'Sign in to access your Creator Dashboard'
              : 'Sign in to create, update, or save verified entries'}
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Minimal Tab Switcher (Modeled on Screenshot 3) */}
          <div className="grid grid-cols-2 p-1 mb-5 bg-slate-100 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => {
                setTab('signin');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'signin'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setTab('signup');
                setError('');
              }}
              className={`py-2 text-xs font-bold rounded-xl transition-all ${
                tab === 'signup'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Form */}
          <form onSubmit={tab === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {error}
              </div>
            )}

            {/* Email Input */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  autoFocus
                  required
                  className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Optional Name (Only on Signup) */}
            {tab === 'signup' && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Name / Team Handle <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Uniswap Protocol Team"
                    className="w-full pl-10 pr-4 py-3 text-sm bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-600/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              <span>{tab === 'signin' ? 'Sign In & Continue' : 'Create Account & Continue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick 1-Click Evaluation / Demo Access */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-2 text-center">
            <button
              type="button"
              onClick={handleQuickDemo}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 hover:underline"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-500" />
              <span>Instant Test: Sign in as Verified Creator</span>
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="text-[11px] text-slate-500 hover:text-slate-700 transition-colors"
            >
              Continue exploring public entries without signing in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
