import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  HeartPulse, 
  ChevronDown, 
  ChevronRight, 
  CalendarCheck, 
  Stethoscope, 
  Syringe, 
  UtensilsCrossed, 
  Package, 
  Bell, 
  FileBarChart2, 
  Settings, 
  ArrowLeftRight, 
  LogOut, 
  Activity, 
  Scale, 
  Pill, 
  Accessibility, 
  ShieldCheck, 
  X,
  Building2,
  Sparkles
} from 'lucide-react';
import { UserRole, UserProfile, SidebarSection, HealthSubSection } from '../types';

interface SidebarProps {
  currentUser: UserProfile;
  currentRole: UserRole;
  activeSection: SidebarSection;
  healthSubSection: HealthSubSection;
  onSelectSection: (section: SidebarSection, subSection?: HealthSubSection) => void;
  onSwitchAccount: () => void;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  badgeCounts?: {
    alerts?: number;
    pendingRequisitions?: number;
    lowStock?: number;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentUser,
  currentRole,
  activeSection,
  healthSubSection,
  onSelectSection,
  onSwitchAccount,
  onLogout,
  isMobileOpen,
  onCloseMobile,
  badgeCounts = {},
}) => {
  const [healthMenuExpanded, setHealthMenuExpanded] = useState<boolean>(true);

  // Determine authorized sections based on role
  // Parents must NOT see stock management or administrative reports
  const isSectionAuthorized = (section: SidebarSection): boolean => {
    if (currentRole === 'parent') {
      if (section === 'stocks' || section === 'reports') {
        return false;
      }
    }
    return true;
  };

  const handleNavClick = (section: SidebarSection, subSection?: HealthSubSection) => {
    if (section === 'health') {
      if (subSection) {
        onSelectSection('health', subSection);
      } else {
        // Toggle or open health overview
        setHealthMenuExpanded(true);
        onSelectSection('health', healthSubSection || 'overview');
      }
    } else {
      onSelectSection(section);
    }
    // Close mobile drawer on navigation
    if (isMobileOpen) {
      onCloseMobile();
    }
  };

  const roleBadgeConfig = {
    parent: {
      bg: 'bg-amber-100 text-amber-900 border-amber-300',
      label: 'Parent Account',
      avatarBg: 'from-amber-500 to-orange-600',
      tag: 'Beneficiary',
    },
    worker: {
      bg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      label: 'Anganwadi Worker',
      avatarBg: 'from-emerald-600 to-teal-700',
      tag: 'Lead Helper',
    },
    supervisor: {
      bg: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      label: 'CDPO Supervisor',
      avatarBg: 'from-indigo-600 to-blue-800',
      tag: 'Inspector',
    },
  }[currentRole];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile} 
          className="fixed inset-0 bg-stone-900/50 backdrop-blur-xs z-40 lg:hidden"
          aria-hidden="true"
        />
      )}

      {/* Vertical Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-stone-900 text-stone-200 flex flex-col border-r border-stone-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top-Left: Profile Photo, Name, Role, User ID */}
        <div className="p-4 sm:p-5 border-b border-stone-800 bg-gradient-to-b from-stone-900 to-stone-950">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              {/* Profile Photo / Avatar */}
              <div className="relative shrink-0">
                <div className={`w-13 h-13 rounded-2xl bg-gradient-to-tr ${roleBadgeConfig.avatarBg} p-0.5 shadow-md flex items-center justify-center text-white text-2xl`}>
                  <div className="w-full h-full bg-stone-800 rounded-[14px] flex items-center justify-center">
                    {currentUser.avatarIcon || (currentRole === 'parent' ? '👨‍👩‍👦' : currentRole === 'worker' ? '👩‍🏫' : '📋')}
                  </div>
                </div>
                <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-stone-900 ring-1 ring-emerald-400"></span>
              </div>

              {/* Name, Role, User ID */}
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white truncate font-serif tracking-tight">
                  {currentUser.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${roleBadgeConfig.bg}`}>
                    {roleBadgeConfig.label}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-stone-400 mt-1 flex items-center gap-1">
                  <span className="text-stone-500">ID:</span>
                  <span className="text-stone-300 font-semibold">{currentUser.id}</span>
                </div>
              </div>
            </div>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Context Tag (Center Name or Enrolled Child) */}
          <div className="mt-3.5 px-2.5 py-1.5 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center gap-2 text-[11px] text-stone-300">
            <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate">
              {currentRole === 'parent'
                ? `Child: ${currentUser.childId === 'ch-02' ? 'Priya Meena' : 'Aarav Sharma'}`
                : currentUser.centerName || 'Rampur Anganwadi Center #12'}
            </span>
          </div>
        </div>

        {/* Navigation Sections Area */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 text-xs select-none scrollbar-thin scrollbar-thumb-stone-700">
          <div className="px-3 py-1 text-[10px] font-semibold text-stone-300 uppercase tracking-wider">
            Main Navigation
          </div>

          {/* 1. Home */}
          {isSectionAuthorized('home') && (
            <button
              onClick={() => handleNavClick('home')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'home'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Home className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">Home</span>
            </button>
          )}

          {/* 2. Children */}
          {isSectionAuthorized('children') && (
            <button
              onClick={() => handleNavClick('children')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'children'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Users className="w-4 h-4 shrink-0" />
              <span className="flex-1 text-left">
                {currentRole === 'parent' ? 'Child Profile' : 'Children'}
              </span>
              {currentRole === 'worker' && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-800 text-stone-300 font-mono">
                  32
                </span>
              )}
              {currentRole === 'supervisor' && (
                <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-800 text-stone-300 font-mono">
                  276
                </span>
              )}
            </button>
          )}

          {/* 3. Health Details (with sub-sections: Health Overview, BMI, Deficiency, Disability) */}
          {isSectionAuthorized('health') && (
            <div className="space-y-0.5">
              <button
                onClick={() => {
                  setHealthMenuExpanded(!healthMenuExpanded);
                  handleNavClick('health', healthSubSection || 'overview');
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                  activeSection === 'health'
                    ? 'bg-stone-800 text-white border-l-4 border-emerald-500 font-semibold'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <HeartPulse className="w-4 h-4 text-rose-400 shrink-0" />
                  <span className="text-left">Health Details</span>
                </div>
                {healthMenuExpanded ? (
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                ) : (
                  <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                )}
              </button>

              {/* Sub-menu items */}
              {healthMenuExpanded && (
                <div className="pl-6 pr-1 py-1 space-y-1 bg-stone-950/40 rounded-xl border border-stone-800/50 my-1">
                  {/* Health Overview */}
                  <button
                    onClick={() => handleNavClick('health', 'overview')}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      activeSection === 'health' && healthSubSection === 'overview'
                        ? 'bg-emerald-600/90 text-white font-bold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5 shrink-0" />
                    <span>Health Overview</span>
                  </button>

                  {/* BMI */}
                  <button
                    onClick={() => handleNavClick('health', 'bmi')}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      activeSection === 'health' && healthSubSection === 'bmi'
                        ? 'bg-emerald-600/90 text-white font-bold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5 shrink-0 text-amber-400" />
                    <span>BMI {currentRole === 'worker' ? '& Calculator' : 'Monitoring'}</span>
                  </button>

                  {/* Deficiency */}
                  <button
                    onClick={() => handleNavClick('health', 'deficiency')}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      activeSection === 'health' && healthSubSection === 'deficiency'
                        ? 'bg-emerald-600/90 text-white font-bold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                    }`}
                  >
                    <Pill className="w-3.5 h-3.5 shrink-0 text-orange-400" />
                    <span>Deficiency</span>
                  </button>

                  {/* Disability */}
                  <button
                    onClick={() => handleNavClick('health', 'disability')}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors cursor-pointer ${
                      activeSection === 'health' && healthSubSection === 'disability'
                        ? 'bg-emerald-600/90 text-white font-bold'
                        : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
                    }`}
                  >
                    <Accessibility className="w-3.5 h-3.5 shrink-0 text-blue-400" />
                    <span>Disability</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* 4. Attendance Details */}
          {isSectionAuthorized('attendance') && (
            <button
              onClick={() => handleNavClick('attendance')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'attendance'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <CalendarCheck className="w-4 h-4 shrink-0 text-teal-400" />
              <span className="flex-1 text-left">Attendance Details</span>
            </button>
          )}

          {/* 5. Consultation */}
          {isSectionAuthorized('consultation') && (
            <button
              onClick={() => handleNavClick('consultation')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'consultation'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Stethoscope className="w-4 h-4 shrink-0 text-cyan-400" />
              <span className="flex-1 text-left">Consultation</span>
            </button>
          )}

          {/* 6. Vaccination */}
          {isSectionAuthorized('vaccination') && (
            <button
              onClick={() => handleNavClick('vaccination')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'vaccination'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Syringe className="w-4 h-4 shrink-0 text-purple-400" />
              <span className="flex-1 text-left">Vaccination</span>
            </button>
          )}

          {/* 7. Nutrition & Food */}
          {isSectionAuthorized('nutrition') && (
            <button
              onClick={() => handleNavClick('nutrition')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'nutrition'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <UtensilsCrossed className="w-4 h-4 shrink-0 text-amber-400" />
              <span className="flex-1 text-left">Nutrition & Food</span>
            </button>
          )}

          {/* 8. Stock Management (Workers & Supervisors Only) */}
          {isSectionAuthorized('stocks') && (
            <button
              onClick={() => handleNavClick('stocks')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'stocks'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Package className="w-4 h-4 shrink-0 text-yellow-400" />
              <span className="flex-1 text-left">Stock Management</span>
              {badgeCounts.lowStock ? (
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  {badgeCounts.lowStock} Low
                </span>
              ) : null}
            </button>
          )}

          {/* 9. Alerts */}
          {isSectionAuthorized('alerts') && (
            <button
              onClick={() => handleNavClick('alerts')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'alerts'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Bell className="w-4 h-4 shrink-0 text-red-400" />
              <span className="flex-1 text-left">Alerts</span>
              {badgeCounts.alerts ? (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-500 text-white">
                  {badgeCounts.alerts}
                </span>
              ) : null}
            </button>
          )}

          {/* 10. Reports (Workers & Supervisors Only) */}
          {isSectionAuthorized('reports') && (
            <button
              onClick={() => handleNavClick('reports')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'reports'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <FileBarChart2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span className="flex-1 text-left">Reports</span>
            </button>
          )}

          {/* 11. Profile/Settings */}
          {isSectionAuthorized('profile') && (
            <button
              onClick={() => handleNavClick('profile')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium transition-all cursor-pointer ${
                activeSection === 'profile'
                  ? 'bg-emerald-600 text-white font-bold shadow-md'
                  : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
              }`}
            >
              <Settings className="w-4 h-4 shrink-0 text-stone-400" />
              <span className="flex-1 text-left">Profile/Settings</span>
            </button>
          )}
        </nav>

        {/* Bottom Section: Switch Account & Logout */}
        <div className="p-3 border-t border-stone-800 bg-stone-950 space-y-2">
          {/* Switch Account Button (prompts for Role, Username, Password) */}
          <button
            onClick={() => {
              onSwitchAccount();
              if (isMobileOpen) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-stone-800/90 hover:bg-stone-800 text-stone-200 hover:text-white border border-stone-700/70 transition-all cursor-pointer text-xs font-semibold group shadow-xs"
          >
            <div className="flex items-center gap-2.5">
              <ArrowLeftRight className="w-4 h-4 text-emerald-400 group-hover:rotate-180 transition-transform duration-300 shrink-0" />
              <span>Switch Account</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-stone-700 text-stone-300 font-mono">
              Auth Required
            </span>
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              onLogout();
              if (isMobileOpen) onCloseMobile();
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer text-xs font-medium"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>

          {/* Compliance Tag */}
          <div className="pt-1 text-[10px] text-stone-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>POSHAN 2.0 • Secured RBAC</span>
          </div>
        </div>
      </aside>
    </>
  );
};
