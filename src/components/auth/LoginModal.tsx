import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldCheck, 
  User, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle, 
  KeyRound,
  Sparkles,
  Building2,
  Check
} from 'lucide-react';
import { UserRole, UserProfile } from '../../types';
import { DEMO_PROFILES, DEMO_CREDENTIALS } from '../../data/mockData';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginAs: (role: UserRole, userProfile: UserProfile) => void;
  currentRole: UserRole;
  isSwitchAccount?: boolean;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginAs,
  currentRole,
  isSwitchAccount = false,
}) => {
  // Required fields: Role, Username, Password
  const [role, setRole] = useState<UserRole>(currentRole || 'parent');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Set default initial username based on current role when opened
  useEffect(() => {
    if (isOpen) {
      setErrorMsg(null);
      setSuccessMsg(null);
      // Pre-fill demo suggestion or clear for clean auth
      if (role === 'parent') {
        setUsername('pooja.sharma');
        setPassword('password123');
      } else if (role === 'worker') {
        setUsername('sunita.devi');
        setPassword('password123');
      } else {
        setUsername('meera.rao');
        setPassword('password123');
      }
    }
  }, [isOpen, role]);

  if (!isOpen) return null;

  const handleRoleSelect = (newRole: UserRole) => {
    setRole(newRole);
    setErrorMsg(null);
    if (newRole === 'parent') {
      setUsername('pooja.sharma');
      setPassword('password123');
    } else if (newRole === 'worker') {
      setUsername('sunita.devi');
      setPassword('password123');
    } else {
      setUsername('meera.rao');
      setPassword('password123');
    }
  };

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanUsername = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanUsername) {
      setErrorMsg('Please enter your username, mobile, or ID.');
      return;
    }
    if (!cleanPassword) {
      setErrorMsg('Please enter your password.');
      return;
    }

    // Verify authentication against DEMO_CREDENTIALS for the selected role
    const matchedCred = DEMO_CREDENTIALS.find((cred) => {
      if (cred.role !== role) return false;
      const isUserMatch =
        cred.username.toLowerCase() === cleanUsername ||
        cred.altUsernames.some((alt) => alt.toLowerCase() === cleanUsername);
      const isPassMatch = cred.passwords.includes(cleanPassword);
      return isUserMatch && isPassMatch;
    });

    if (!matchedCred) {
      setErrorMsg(
        `Invalid credentials for ${role.toUpperCase()} role. Please check your username and password, or use the demo credentials below.`
      );
      return;
    }

    // Find profile
    const profile =
      DEMO_PROFILES.find((p) => p.id === matchedCred.profileId) ||
      DEMO_PROFILES.find((p) => p.role === role) ||
      DEMO_PROFILES[0];

    setSuccessMsg(`Authentication successful! Logging in as ${profile.name}...`);
    setTimeout(() => {
      onLoginAs(role, profile);
      onClose();
    }, 600);
  };

  const handleFillDemo = (targetRole: UserRole, user: string, pass: string) => {
    setRole(targetRole);
    setUsername(user);
    setPassword(pass);
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 flex flex-col">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-stone-900 text-white p-5 sm:p-6 relative overflow-hidden shrink-0">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-xl shadow-lg border border-white/20">
                🏛️
              </div>
              <div>
                <h3 className="font-bold text-lg font-serif">
                  {isSwitchAccount ? 'Switch Account Authentication' : 'Anganwadi Care • Official Login'}
                </h3>
                <p className="text-xs text-stone-300">
                  Government of India • Ministry of WCD • POSHAN 2.0
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Authentication Notice */}
        <div className="bg-stone-50 px-5 py-3 border-b border-stone-200 text-xs text-stone-600 flex items-center gap-2">
          <KeyRound className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            {isSwitchAccount
              ? 'Security Policy: Select Role, Username, and Password to verify identity before switching.'
              : 'Sign in to access your authorized role dashboard and services.'}
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleAuthenticate} className="p-5 sm:p-6 space-y-4 text-xs">
          {/* 1. ROLE SELECTION */}
          <div>
            <label className="block font-bold text-stone-800 mb-1.5">
              1. Select Authorized Role <span className="text-rose-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleRoleSelect('parent')}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  role === 'parent'
                    ? 'bg-amber-50 border-amber-400 text-amber-950 font-bold ring-2 ring-amber-400/30'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="text-lg">👨‍👩‍👦</span>
                <span className="text-xs font-semibold">Parent</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('worker')}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  role === 'worker'
                    ? 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold ring-2 ring-emerald-400/30'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="text-lg">👩‍🏫</span>
                <span className="text-xs font-semibold">Worker</span>
              </button>

              <button
                type="button"
                onClick={() => handleRoleSelect('supervisor')}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${
                  role === 'supervisor'
                    ? 'bg-indigo-50 border-indigo-400 text-indigo-950 font-bold ring-2 ring-indigo-400/30'
                    : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span className="text-lg">📋</span>
                <span className="text-xs font-semibold">Supervisor</span>
              </button>
            </div>
          </div>

          {/* 2. USERNAME */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              2. Username / Mobile / Registration ID <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={
                  role === 'parent'
                    ? 'pooja.sharma or 9876543210'
                    : role === 'worker'
                    ? 'sunita.devi or AWW-101'
                    : 'meera.rao or SUP-402'
                }
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* 3. PASSWORD */}
          <div>
            <label className="block font-bold text-stone-800 mb-1">
              3. Password / Security PIN <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-start gap-2 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2 text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Authenticate & Switch Account</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-3 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-500 block mb-2">
              ⚡ Quick Demo Credentials (Click to Auto-fill):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleFillDemo('parent', 'pooja.sharma', 'password123')}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-colors ${
                  role === 'parent' ? 'bg-amber-50/80 border-amber-300' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold text-stone-800 text-[11px]">Parent Demo</div>
                <div className="text-[10px] text-stone-500 font-mono">pooja.sharma</div>
                <div className="text-[10px] text-stone-400 font-mono">password123</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('worker', 'sunita.devi', 'password123')}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-colors ${
                  role === 'worker' ? 'bg-emerald-50/80 border-emerald-300' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold text-stone-800 text-[11px]">Worker Demo</div>
                <div className="text-[10px] text-stone-500 font-mono">sunita.devi</div>
                <div className="text-[10px] text-stone-400 font-mono">password123</div>
              </button>

              <button
                type="button"
                onClick={() => handleFillDemo('supervisor', 'meera.rao', 'password123')}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-colors ${
                  role === 'supervisor' ? 'bg-indigo-50/80 border-indigo-300' : 'bg-stone-50 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="font-bold text-stone-800 text-[11px]">Supervisor Demo</div>
                <div className="text-[10px] text-stone-500 font-mono">meera.rao</div>
                <div className="text-[10px] text-stone-400 font-mono">password123</div>
              </button>
            </div>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 text-[11px] text-stone-500 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Authenticated Sessions are Encrypted</span>
          </div>
          <button
            onClick={onClose}
            className="text-stone-500 hover:text-stone-800 font-semibold cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
