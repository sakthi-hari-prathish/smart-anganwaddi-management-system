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
  Languages
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
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  notifications,
  onMarkNotificationRead,
  onMarkAllRead,
  language,
  onToggleLanguage,
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentDate(
        now.toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      );
      setCurrentTime(
        now.toLocaleTimeString(language === 'hi' ? 'hi-IN' : 'en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        })
      );
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, [language]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleDetails: Record<
    UserRole,
    { title: string; subtitle: string; badge: string; color: string; bg: string }
  > = {
    parent: {
      title: 'Pooja Sharma',
      subtitle: language === 'hi' ? 'अभिभावक (आरव शर्मा)' : 'Parent (Child: Aarav)',
      badge: 'Parent Portal',
      color: 'text-amber-800',
      bg: 'bg-amber-100 border-amber-300',
    },
    worker: {
      title: 'Sunita Devi',
      subtitle: language === 'hi' ? 'आंगनवाड़ी कार्यकर्ता (केंद्र #12)' : 'Anganwadi Worker (Center #12)',
      badge: 'Worker Portal',
      color: 'text-emerald-800',
      bg: 'bg-emerald-100 border-emerald-300',
    },
    supervisor: {
      title: 'Meera Rao',
      subtitle: language === 'hi' ? 'सीडीपीओ पर्यवेक्षक (सेक्टर 4)' : 'CDPO Supervisor (Sector 4)',
      badge: 'Supervisor HQ',
      color: 'text-indigo-800',
      bg: 'bg-indigo-100 border-indigo-300',
    },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      {/* Top emergency & government banner */}
      <div className="bg-stone-900 text-stone-200 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Govt. of India • ICDS POSHAN 2.0
          </span>
          <span className="hidden sm:inline text-stone-400">|</span>
          <span className="hidden sm:inline text-stone-300 text-[11px]">
            Integrated Child Development Services e-Monitoring Portal
          </span>
        </div>

        <div className="flex items-center gap-4 text-[11px] ml-auto">
          <div className="flex items-center gap-1.5 text-amber-300">
            <PhoneCall className="w-3.5 h-3.5" />
            <span>Toll-Free POSHAN: <strong>14408</strong> / Childline: <strong>1098</strong></span>
          </div>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-500/20">
            <HeartHandshake className="w-6 h-6 text-white" />
            <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500 border-2 border-white"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 font-serif">
                Anganwadi <span className="text-emerald-700 font-extrabold">Care</span>
              </h1>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-2.5 h-2.5" /> Digital Seva
              </span>
            </div>
            <p className="text-xs text-stone-500 hidden sm:block">
              {language === 'hi' 
                ? 'मातृ एवं शिशु पोषण, स्वास्थ्य व प्री-स्कूल प्रबंधन' 
                : 'Maternal, Child Nutrition, Health & Early Childhood Tracker'}
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

        {/* Right Action controls: Notifications & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Notification Button & Drawer */}
          <div className="relative">
            <button
              id="notifications-button"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowRoleMenu(false);
              }}
              className="relative p-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors border border-stone-200/70 cursor-pointer"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold text-white bg-amber-600 rounded-full border-2 border-white shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-emerald-600" />
                    <h3 className="font-semibold text-stone-800 text-sm">Center Alerts & Notices</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                        {unreadCount} new
                      </span>
                    )}
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

            {/* Role Switcher Pill / Dropdown */}
            <div className="relative">
            <button
              id="role-switcher-toggle"
              onClick={() => {
                setShowRoleMenu(!showRoleMenu);
                setShowNotifications(false);
              }}
              className={`flex items-center gap-2.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl border transition-all cursor-pointer shadow-xs ${roleDetails[currentRole].bg}`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/90 shadow-2xs flex items-center justify-center font-bold text-xs">
                {currentRole === 'parent' && '👨‍👩‍👦'}
                {currentRole === 'worker' && '👩‍🏫'}
                {currentRole === 'supervisor' && '📋'}
              </div>

              <div className="text-left hidden sm:block">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-stone-900">{roleDetails[currentRole].title}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${roleDetails[currentRole].color}`}>
                    {roleDetails[currentRole].badge}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600 font-medium truncate max-w-[150px]">
                  {roleDetails[currentRole].subtitle}
                </p>
              </div>

              <ChevronDown className="w-4 h-4 text-stone-600 ml-0.5" />
            </button>

            {/* Dropdown menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-stone-200 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-stone-100">
                  <p className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    Switch Perspective (RBAC)
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Select a persona to preview the system
                  </p>
                </div>

                <div className="mt-1 space-y-1">
                  {/* Parent */}
                  <button
                    onClick={() => {
                      onRoleChange('parent');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === 'parent'
                        ? 'bg-amber-50 text-amber-900 border border-amber-200'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">👨‍👩‍👦</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Parent (Pooja Sharma)</span>
                        <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-medium">Child: Aarav</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Child health, WHO growth, vaccines, meal plan</p>
                    </div>
                  </button>

                  {/* Worker */}
                  <button
                    onClick={() => {
                      onRoleChange('worker');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === 'worker'
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">👩‍🏫</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">Anganwadi Worker / Helper</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">Sunita Devi</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Rampur Center #12: Inventory & child daily logs</p>
                    </div>
                  </button>

                  {/* Supervisor */}
                  <button
                    onClick={() => {
                      onRoleChange('supervisor');
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                      currentRole === 'supervisor'
                        ? 'bg-indigo-50 text-indigo-900 border border-indigo-200'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span className="text-xl">📋</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold">CDPO Supervisor</span>
                        <span className="text-[10px] bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded font-medium">Meera Rao</span>
                      </div>
                      <p className="text-[11px] text-stone-500">Sector 4 overview, cross-center analytics, supplies</p>
                    </div>
                  </button>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100 px-3 py-1 text-[11px] text-stone-500 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Secure POSHAN 2.0 Identity Protocol</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
