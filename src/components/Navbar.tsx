import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  Bell, 
  UserCheck, 
  ChevronDown, 
  Calendar, 
  Clock, 
  PhoneCall, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldCheck,
  Languages,
  LogIn,
  KeyRound,
  Menu,
  ArrowLeftRight
} from 'lucide-react';
import { UserRole, NotificationAlert } from '../types';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  notifications: NotificationAlert[];
  onMarkNotificationRead: (id: string) => void;
  onMarkAllRead: () => void;
  language: 'en' | 'hi';
  onToggleLanguage: () => void;
  onOpenLoginModal?: () => void;
  onToggleMobileSidebar?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  notifications,
  onMarkNotificationRead,
  onMarkAllRead,
  language,
  onToggleLanguage,
  onOpenLoginModal,
  onToggleMobileSidebar,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      );
      setCurrentTime(
        now.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: true,
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleDetails = {
    parent: {
      title: 'Parent View',
      badge: 'Family Portal',
      subtitle: 'Pooja Sharma (Aarav)',
      color: 'bg-amber-100 text-amber-900 border-amber-300',
      bg: 'bg-amber-500/10 text-amber-900 border-amber-300',
      icon: '👨‍👩‍👦',
    },
    worker: {
      title: 'Anganwadi Worker',
      badge: 'Center Lead',
      subtitle: 'Sunita Devi (AW-101)',
      color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      bg: 'bg-emerald-500/10 text-emerald-900 border-emerald-300',
      icon: '👩‍🏫',
    },
    supervisor: {
      title: 'CDPO Supervisor',
      badge: 'Sector Head',
      subtitle: 'Meera Rao (Sector 4)',
      color: 'bg-indigo-100 text-indigo-900 border-indigo-300',
      bg: 'bg-indigo-500/10 text-indigo-900 border-indigo-300',
      icon: '📋',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-2xs">
      {/* Top micro-bar: Government of India & POSHAN branding */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-1 px-4 sm:px-6 lg:px-8 flex items-center justify-between border-b border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-100 flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            Ministry of Women & Child Development
          </span>
          <span className="text-stone-500 hidden sm:inline">•</span>
          <span className="text-stone-400 hidden sm:inline">
            POSHAN Abhiyaan 2.0 • ICDS Digital Mission
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="hidden md:inline text-stone-400">
            Toll-Free POSHAN Helpline: <strong className="text-stone-200">14408</strong>
          </span>
          <button
            onClick={onToggleLanguage}
            className="flex items-center gap-1 px-2 py-0.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors cursor-pointer"
            title="Switch Language"
          >
            <Languages className="w-3 h-3 text-emerald-400" />
            <span className="font-medium">{language === 'en' ? 'हिन्दी' : 'English'}</span>
          </button>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        {/* Left: Mobile hamburger menu toggle + Brand identity */}
        <div className="flex items-center gap-3">
          {onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          )}

          <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
            <HeartHandshake className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
                Anganwadi <span className="text-emerald-700 font-extrabold">Care</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5" /> Digital Seva
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              {language === 'hi' 
                ? 'मातृ एवं शिशु पोषण, स्वास्थ्य व बाल विकास प्रबंधन' 
                : 'Maternal, Child Nutrition, Health & Early Development Portal'}
            </p>
          </div>
        </div>

        {/* Center Live Date & Time pill */}
        <div className="hidden lg:flex items-center gap-3 bg-stone-50 border border-stone-200/80 px-3.5 py-1.5 rounded-full text-xs text-stone-600 shadow-2xs">
          <div className="flex items-center gap-1.5 text-stone-700 font-medium">
            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
            <span>{currentDate || 'Today'}</span>
          </div>
          <span className="text-stone-300">•</span>
          <div className="flex items-center gap-1.5 text-stone-700 font-mono font-medium">
            <Clock className="w-3.5 h-3.5 text-amber-600" />
            <span>{currentTime || 'Live'}</span>
          </div>
        </div>

        {/* Right Action controls: Switch Account, Notifications & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Switch Account (Auth Required) button */}
          {onOpenLoginModal && (
            <button
              onClick={onOpenLoginModal}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-300 transition-all cursor-pointer shadow-2xs"
              title="Switch Account (requires Role, Username, Password)"
            >
              <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-600" />
              <span>Switch Account</span>
            </button>
          )}

          {/* Notifications bell button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleMenu(false);
              }}
              className="relative p-2 sm:p-2.5 rounded-xl border border-stone-200 hover:border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 transition-colors cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-stone-600" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-rose-600 text-white text-[10px] font-bold ring-2 ring-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900">
                      Notifications & Alerts
                    </h3>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {unreadCount} new
                    </span>
                  </div>
                  {unreadCount > 0 && (
                    <button
                      onClick={onMarkAllRead}
                      className="text-xs text-emerald-700 hover:text-emerald-800 font-medium hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="mt-3 max-h-72 overflow-y-auto space-y-2.5 divide-y divide-stone-50">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => onMarkNotificationRead(item.id)}
                      className={`pt-2.5 first:pt-0 cursor-pointer rounded-lg p-2 transition-colors ${
                        item.read ? 'bg-white hover:bg-stone-50 opacity-80' : 'bg-emerald-50/50 hover:bg-emerald-50 border border-emerald-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {item.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                          {item.type === 'alert' && <AlertTriangle className="w-4 h-4 text-rose-600" />}
                          {item.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {item.type === 'info' && <Info className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-stone-900">{item.title}</p>
                          <p className="text-xs text-stone-600 mt-0.5 line-clamp-2 leading-relaxed">
                            {item.message}
                          </p>
                          <span className="text-[10px] text-stone-400 mt-1 block">
                            {item.timestamp}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Role Indicator Pill / Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer shadow-xs ${roleDetails[currentRole].bg}`}
            >
              <div className="w-7 h-7 rounded-lg bg-white/90 shadow-2xs flex items-center justify-center font-bold text-xs">
                {roleDetails[currentRole].icon}
              </div>

              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">{roleDetails[currentRole].title}</span>
                </div>
              </div>

              <ChevronDown className="w-3.5 h-3.5 text-stone-600 ml-0.5" />
            </button>

            {/* Dropdown menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Switch Active Role
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Fast preview toggle or authenticate
                  </p>
                </div>

                <div className="mt-1 space-y-1">
                  <button
                    onClick={() => {
                      onRoleChange('parent');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === 'parent'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200 font-bold'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">👨‍👩‍👦</span>
                    <div>
                      <span className="text-xs font-bold block">Parent View</span>
                      <span className="text-[11px] text-stone-500">Child profile, growth, vaccines</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('worker');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === 'worker'
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200 font-bold'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">👩‍🏫</span>
                    <div>
                      <span className="text-xs font-bold block">Anganwadi Worker</span>
                      <span className="text-[11px] text-stone-500">BMI calc, records, stock rations</span>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      onRoleChange('supervisor');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === 'supervisor'
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">📋</span>
                    <div>
                      <span className="text-xs font-bold block">CDPO Supervisor</span>
                      <span className="text-[11px] text-stone-500">Sector surveillance & requisitions</span>
                    </div>
                  </button>

                  {/* Switch Account with Credentials */}
                  {onOpenLoginModal && (
                    <div className="pt-2 border-t border-stone-100">
                      <button
                        onClick={() => {
                          setShowRoleMenu(false);
                          onOpenLoginModal();
                        }}
                        className="w-full py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Authenticate with Credentials</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
