import React, { useState } from 'react';
import { 
  Heart, 
  Activity, 
  Utensils, 
  Calendar, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Phone, 
  MapPin, 
  TrendingUp, 
  Pill, 
  ShieldAlert, 
  Apple, 
  Sparkles, 
  Info, 
  Award,
  User,
  ShieldCheck,
  Building2,
  ChevronRight,
  Scale,
  Accessibility,
  Stethoscope,
  Syringe,
  CalendarCheck,
  ExternalLink,
  Lock,
  Printer
} from 'lucide-react';
import { Child, MealItem, Announcement, SidebarSection, HealthSubSection } from '../../types';
import { DigitalImmunizationCardModal } from '../modals/DigitalImmunizationCardModal';
import { ChildProfileModal } from '../modals/ChildProfileModal';
import { ChildHealthDashboard } from '../health/ChildHealthDashboard';
import { MONTH_ATTENDANCE_DAYS } from '../../data/mockData';
import { calculateBMI, getWHOCategory, getBMIBadgeStyle } from '../../utils/healthUtils';

interface ParentDashboardProps {
  child: Child;
  mealPlan: MealItem[];
  announcements: Announcement[];
  availableChildren?: Child[];
  onSelectChild?: (childId: string) => void;
  activeSection?: SidebarSection;
  healthSubSection?: HealthSubSection;
  onNavigateSection?: (section: SidebarSection, subSection?: HealthSubSection) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  child,
  mealPlan,
  announcements,
  availableChildren = [],
  onSelectChild,
  activeSection = 'home',
  healthSubSection = 'overview',
  onNavigateSection,
}) => {
  const [showMCPModal, setShowMCPModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Latest growth record
  const latestGrowth = child.growthHistory[child.growthHistory.length - 1] || {
    month: 'Recent',
    ageInMonths: child.ageMonths,
    heightCm: 95.0,
    weightKg: 14.0,
    bmi: 15.5,
    whoCategory: 'Normal',
    recordedBy: child.workerName,
    date: '2026-03-15',
  };

  const bmiBadge = getBMIBadgeStyle(latestGrowth.whoCategory);

  // Filter announcements relevant to parents
  const parentNotices = announcements.filter(
    (a) => a.targetAudience === 'All' || a.targetAudience === 'Parents'
  );

  const completedVaccines = child.vaccines.filter((v) => v.status === 'Completed');
  const dueVaccines = child.vaccines.filter((v) => v.status === 'Due' || v.status === 'Upcoming');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header: Parent Profile & Child Profile Card */}
      <section className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 p-4 sm:p-6 rounded-3xl border border-amber-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Child & Parent Basic Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl">
                  {child.gender === 'Female' ? '👧' : '👦'}
                </div>
              </div>
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-700 text-white border-2 border-white shadow-xs">
                {child.bloodGroup}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900 font-serif">
                  {child.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {child.age} • {child.gender}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-stone-600 bg-stone-100 border border-stone-200">
                  ID: {child.id}
                </span>

                {/* Multiple children switcher if available */}
                {availableChildren.length > 1 && onSelectChild && (
                  <select
                    value={child.id}
                    onChange={(e) => onSelectChild(e.target.value)}
                    className="text-xs bg-white border border-stone-300 rounded-lg px-2 py-0.5 font-medium text-stone-700 cursor-pointer shadow-2xs hover:border-amber-400"
                  >
                    {availableChildren.map((c) => (
                      <option key={c.id} value={c.id}>
                        Switch Child: {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-stone-800">{child.centerName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>
                    Parents: <strong className="text-stone-800">{child.parentName}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{child.parentPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Status Badges & Quick Action */}
          <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-xs p-3 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="border-r border-stone-200 pr-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Today's Center Attendance
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                {child.attendanceToday === 'Present' ? (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-emerald-800">
                      Present ({child.checkInTime || '08:45 AM'})
                    </span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                    <span className="text-xs font-bold text-rose-700">Absent</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>View Full Child Profile</span>
              </button>

              <button
                onClick={() => setShowMCPModal(true)}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-amber-300" />
                <span>Immunization Card</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* -------------------- SECTION 1: HOME -------------------- */}
      {activeSection === 'home' && (
        <div className="space-y-6">
          {/* Quick Vital Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Growth & BMI */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">Growth & BMI</span>
                <Scale className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">{latestGrowth.bmi}</span>
                <span className="text-xs text-stone-500">kg/m²</span>
              </div>
              <div className="mt-2 flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${bmiBadge.badge}`}>
                  WHO {latestGrowth.whoCategory}
                </span>
                <span className="text-[11px] text-stone-400">
                  {latestGrowth.heightCm}cm / {latestGrowth.weightKg}kg
                </span>
              </div>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('health', 'bmi')}
                  className="mt-3 text-[11px] font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Child Growth Details</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Attendance Status */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">Monthly Attendance</span>
                <CalendarCheck className="w-4 h-4 text-teal-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">91.7%</span>
                <span className="text-xs text-stone-500">22 / 24 Days</span>
              </div>
              <p className="mt-2 text-[11px] text-stone-500">
                Today: <strong className="text-emerald-700">Present (08:45 AM)</strong>
              </p>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('attendance')}
                  className="mt-3 text-[11px] font-semibold text-teal-700 hover:text-teal-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Monthly Calendar</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Nutrition Today */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">Today's Nutrition</span>
                <Utensils className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-bold text-stone-800 truncate">Fortified Khichdi</span>
              </div>
              <p className="mt-2 text-[11px] text-stone-500">
                Morning: <span className="font-semibold text-stone-700">Boiled Sprouts & Milk</span>
              </p>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('nutrition')}
                  className="mt-3 text-[11px] font-semibold text-amber-700 hover:text-amber-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View Full Meal Plan</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Vaccination Status */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between text-stone-500 mb-2">
                <span className="text-xs font-semibold">Vaccination Status</span>
                <Syringe className="w-4 h-4 text-purple-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-stone-900">
                  {completedVaccines.length} / {child.vaccines.length}
                </span>
                <span className="text-xs text-emerald-700 font-semibold">UIP Verified</span>
              </div>
              <p className="mt-2 text-[11px] text-amber-800 font-semibold truncate">
                Next: {dueVaccines[0]?.name || 'DPT Booster 1'} (Due soon)
              </p>
              {onNavigateSection && (
                <button
                  onClick={() => onNavigateSection('vaccination')}
                  className="mt-3 text-[11px] font-semibold text-purple-700 hover:text-purple-900 flex items-center gap-1 cursor-pointer"
                >
                  <span>View UIP Schedule</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Quick Action Shortcuts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div 
              onClick={() => onNavigateSection && onNavigateSection('health', 'overview')}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800">
                Health & Growth Overview
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                View doctor consultations, height/weight charts, WHO categories, and clinical status.
              </p>
            </div>

            <div 
              onClick={() => onNavigateSection && onNavigateSection('health', 'deficiency')}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Pill className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-800">
                Nutritional Deficiencies & Supplements
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Track Iron, Vitamin A, IFA syrup dosage, and dietary guidelines for your child.
              </p>
            </div>

            <div 
              onClick={() => onNavigateSection && onNavigateSection('consultation')}
              className="p-5 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Stethoscope className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-indigo-800">
                Doctor Consultations & Prescriptions
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Official check-up notes, pediatrician findings, and scheduled health visits.
              </p>
            </div>
          </div>

          {/* Center Announcements for Parents */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-stone-900 text-sm">
                  Anganwadi Center Notices & Camps
                </h3>
              </div>
              <span className="text-xs text-stone-400">Rampur Center #12</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parentNotices.map((notice) => (
                <div
                  key={notice.id}
                  className="p-3.5 rounded-2xl border border-stone-200 hover:border-emerald-200 transition-colors bg-stone-50/50 flex items-start gap-3 text-xs"
                >
                  <span className="text-2xl shrink-0 mt-0.5">
                    {notice.type === 'Vaccination Camp' ? '💉' : notice.type === 'Holiday' ? '🚩' : '📢'}
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold text-stone-800 truncate">{notice.title}</span>
                      <span className="text-[10px] font-mono text-stone-400 shrink-0">
                        {notice.date}
                      </span>
                    </div>
                    <p className="text-stone-600 text-[11px] mt-1 line-clamp-2">
                      {notice.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION 2: CHILDREN (COMPLETE CHILD PROFILE) -------------------- */}
      {activeSection === 'children' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-lg font-bold text-stone-900 font-serif">
                Complete Child Profile & Family Record
              </h3>
              <p className="text-xs text-stone-500">
                Official Child Profile registered under Integrated Child Development Services (ICDS)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowProfileModal(true)}
                className="px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5 text-stone-600" />
                <span>Print Card</span>
              </button>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
              <User className="w-4 h-4 text-emerald-600" />
              <span>1. Child Personal & Family Information</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Child Full Name</span>
                <span className="font-bold text-stone-900 text-sm">{child.name}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Child ID / Reg Number</span>
                <span className="font-bold font-mono text-stone-900">{child.id}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Date of Birth (DOB)</span>
                <span className="font-semibold text-stone-800">{child.dob}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Age (Calculated)</span>
                <span className="font-bold text-stone-800">{child.age} ({child.ageMonths} Months)</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Gender</span>
                <span className="font-semibold text-stone-800">{child.gender}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Blood Group</span>
                <span className="font-bold text-emerald-700">{child.bloodGroup}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Father's Name</span>
                <span className="font-semibold text-stone-800">{child.fatherName || 'Ramesh Sharma'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Mother's Name</span>
                <span className="font-semibold text-stone-800">{child.motherName || 'Pooja Sharma'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Guardian / Contact</span>
                <span className="font-semibold text-stone-800">{child.guardianName || 'Pooja Sharma'} • {child.parentPhone}</span>
              </div>
            </div>
          </div>

          {/* Residential Address */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>2. Residential Address & Location</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 sm:col-span-2">
                <span className="text-[10px] text-stone-400 block font-semibold">Residential Address</span>
                <span className="font-semibold text-stone-800">{child.residentialAddress || 'House #42, Ward No. 3, Near Village Panchayat'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Village / Town</span>
                <span className="font-semibold text-stone-800">{child.villageTown || 'Rampur Village'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">District & State</span>
                <span className="font-semibold text-stone-800">{child.district || 'Rampur'}, {child.state || 'Uttar Pradesh'} - {child.pinCode || '244901'}</span>
              </div>
            </div>
          </div>

          {/* Anganwadi Center Information */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 text-emerald-800">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>3. Assigned Anganwadi Center & Officials</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Anganwadi Name & ID</span>
                <span className="font-bold text-stone-900">{child.centerName}</span>
                <span className="text-[10px] font-mono text-stone-500 block">ID: {child.centerId || 'AW-101'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Center Location</span>
                <span className="font-semibold text-stone-800">{child.centerLocation || 'Rampur North Ward'}</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">Assigned Helper / Worker</span>
                <span className="font-bold text-emerald-800">{child.workerName || 'Sunita Devi'}</span>
                <span className="text-[10px] text-stone-500 block">Lead Nutrition Helper</span>
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                <span className="text-[10px] text-stone-400 block font-semibold">CDPO Supervisor</span>
                <span className="font-bold text-indigo-900">{child.supervisorName || 'Meera Rao'}</span>
                <span className="text-[10px] text-stone-500 block">Sector 4 Inspection Lead</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION 3: HEALTH DETAILS -------------------- */}
      {activeSection === 'health' && (
        <div className="space-y-4">
          {/* Read-Only Notice for Parents */}
          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs text-amber-900">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                <strong>Official Health Records:</strong> Clinical logs and growth measurements are recorded by authorized Anganwadi Workers and Medical Officers. Read-only for parents.
              </span>
            </div>
          </div>

          {/* Sub-view: Health Overview */}
          {healthSubSection === 'overview' && (
            <ChildHealthDashboard
              child={child}
              canEdit={false}
              onOpenVaccineSchedule={() => setShowMCPModal(true)}
            />
          )}

          {/* Sub-view: BMI */}
          {healthSubSection === 'bmi' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <div>
                  <h3 className="text-base font-bold text-stone-900">
                    Child BMI & Growth Tracker (WHO Age/Sex-Specific Standards)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Child Body Mass Index is evaluated using WHO Child Growth Reference Curves (Z-scores)
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${bmiBadge.badge}`}>
                  WHO Category: {latestGrowth.whoCategory}
                </span>
              </div>

              {/* Current Status Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-400 block font-semibold">Current Height</span>
                  <span className="text-2xl font-bold text-stone-900">{latestGrowth.heightCm}</span>
                  <span className="text-xs text-stone-500 ml-1">cm</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-400 block font-semibold">Current Weight</span>
                  <span className="text-2xl font-bold text-stone-900">{latestGrowth.weightKg}</span>
                  <span className="text-xs text-stone-500 ml-1">kg</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-400 block font-semibold">Calculated BMI</span>
                  <span className="text-2xl font-bold text-stone-900">{latestGrowth.bmi}</span>
                  <span className="text-xs text-stone-500 ml-1">kg/m²</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] text-stone-400 block font-semibold">Last Recorded By</span>
                  <span className="font-bold text-stone-800 text-sm block">{latestGrowth.recordedBy || 'Sunita Devi'}</span>
                  <span className="text-[10px] text-stone-500">{latestGrowth.date || latestGrowth.month}</span>
                </div>
              </div>

              {/* Growth History Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Growth Measurement History
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Date / Month</th>
                        <th className="p-3">Age</th>
                        <th className="p-3">Height (cm)</th>
                        <th className="p-3">Weight (kg)</th>
                        <th className="p-3">BMI</th>
                        <th className="p-3">WHO Category</th>
                        <th className="p-3">Recorded By</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {child.growthHistory.map((g, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="p-3 font-semibold text-stone-800">{g.date || g.month}</td>
                          <td className="p-3 text-stone-600">{g.ageInMonths} Mo</td>
                          <td className="p-3 font-mono">{g.heightCm} cm</td>
                          <td className="p-3 font-mono">{g.weightKg} kg</td>
                          <td className="p-3 font-bold font-mono text-emerald-800">{g.bmi}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBMIBadgeStyle(g.whoCategory).badge}`}>
                              {g.whoCategory}
                            </span>
                          </td>
                          <td className="p-3 text-stone-500 text-[11px]">{g.recordedBy}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Deficiency */}
          {healthSubSection === 'deficiency' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Nutritional Deficiency & Micronutrient Records
                </h3>
                <p className="text-xs text-stone-500">
                  Active deficiency diagnoses, prescribed supplements, and daily dosage logs
                </p>
              </div>

              {child.deficiencies && child.deficiencies.length > 0 ? (
                <div className="space-y-4">
                  {child.deficiencies.map((def) => (
                    <div
                      key={def.id}
                      className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-xs space-y-3"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">💊</span>
                          <span className="font-bold text-amber-950 text-sm">{def.type}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-amber-200 text-amber-900">
                          Severity: {def.severity}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-stone-700">
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Diagnosis Date</span>
                          <span className="font-semibold">{def.diagnosisDate}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Prescribed Supplement</span>
                          <span className="font-bold text-emerald-800">{def.prescribedSupplement}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-stone-400 block font-semibold">Dosage Schedule</span>
                          <span className="font-semibold">{def.dosage}</span>
                        </div>
                      </div>
                      {def.notes && (
                        <p className="text-[11px] text-stone-600 bg-white/70 p-2.5 rounded-xl border border-amber-100">
                          <strong>Caregiver Notes:</strong> {def.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-stone-800">No Nutritional Deficiencies Detected</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    {child.name}'s micronutrient intake is verified normal by the Anganwadi healthcare team.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Sub-view: Disability */}
          {healthSubSection === 'disability' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Disability Information & Early Intervention Support
                </h3>
                <p className="text-xs text-stone-500">
                  Special healthcare tracking, assistive aids, and early rehabilitation services
                </p>
              </div>

              {child.disability?.hasDisability ? (
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-950 text-sm">
                      {child.disability.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-200 text-blue-900">
                      Severity: {child.disability.severity}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">UDID Registration Number</span>
                      <span className="font-mono font-bold text-stone-800">{child.disability.udidNumber || 'Pending Issuance'}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">Assistive Devices</span>
                      <span className="font-semibold text-stone-800">{child.disability.assistiveDeviceRequired || 'Under Evaluation'}</span>
                    </div>
                  </div>
                  {child.disability.notes && (
                    <p className="text-[11px] text-stone-600 bg-white/70 p-2.5 rounded-xl border border-blue-100">
                      <strong>Support Plan:</strong> {child.disability.notes}
                    </p>
                  )}
                </div>
              ) : (
                <div className="p-8 text-center rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-500">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                  <p className="font-bold text-stone-800">No Physical or Developmental Disability</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Child's motor and sensory milestones meet POSHAN age-appropriate benchmarks.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* -------------------- SECTION 4: ATTENDANCE DETAILS -------------------- */}
      {activeSection === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Monthly Attendance Register • {child.name}
              </h3>
              <p className="text-xs text-stone-500">
                Rampur Anganwadi Center #12 • Current Month Tracking
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-xl bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
                22 Days Present
              </span>
              <span className="px-2.5 py-1 rounded-xl bg-rose-50 text-rose-800 font-bold border border-rose-200">
                2 Days Absent
              </span>
            </div>
          </div>

          {/* Calendar Grid Representation */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-stone-700 block">
              Daily Attendance Calendar (Past 30 Days)
            </span>
            <div className="grid grid-cols-5 sm:grid-cols-7 md:grid-cols-10 gap-2 text-center text-xs">
              {MONTH_ATTENDANCE_DAYS.map((day) => (
                <div
                  key={day.day}
                  className={`p-2 rounded-xl border flex flex-col items-center justify-center transition-all ${
                    day.status === 'Present' || day.status === 'present'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                      : day.status === 'Absent' || day.status === 'absent'
                      ? 'bg-rose-50 border-rose-300 text-rose-950 font-bold'
                      : 'bg-stone-50 border-stone-200 text-stone-400'
                  }`}
                >
                  <span className="text-[10px] text-stone-400">Day {day.day}</span>
                  <span className="text-xs mt-0.5">
                    {day.status === 'Present' || day.status === 'present' ? '✅' : day.status === 'Absent' || day.status === 'absent' ? '❌' : '🏖️'}
                  </span>
                  <span className="text-[9px] mt-0.5">{day.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION 5: CONSULTATION -------------------- */}
      {activeSection === 'consultation' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Doctor Consultations & Health Checkup History
              </h3>
              <p className="text-xs text-stone-500">
                Quarterly clinical examinations conducted by PHC Pediatric Specialists & RBSK team
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
              Read-Only
            </span>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-600" />
                  <span className="font-bold text-stone-900 text-sm">
                    {child.doctorConsultation?.doctorName || 'Dr. Ananya Sen, MBBS, DCH'}
                  </span>
                  <span className="text-stone-400 text-xs">• Pediatric Specialist, Rampur PHC</span>
                </div>
                <span className="text-[11px] font-mono text-stone-500 font-semibold">
                  Date: {child.doctorConsultation?.date || '2026-03-10'}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-2 text-stone-700">
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Clinical Findings</span>
                  <p className="text-xs font-medium text-stone-800 mt-0.5">
                    {child.doctorConsultation?.findings || 'Child active, alert, age-appropriate reflexes. Mild conjunctival pallor noted; lungs clear to auscultation.'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Prescriptions & Medical Orders</span>
                  <p className="text-xs font-medium text-emerald-800 mt-0.5">
                    {child.doctorConsultation?.medications || 'IFA Syrup 1ml bi-weekly, Albendazole 200mg single dose administered, continue fortified supplementary ration.'}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-stone-400 block font-semibold">Next Scheduled Health Visit</span>
                  <p className="text-xs font-semibold text-stone-800 mt-0.5">
                    {child.doctorConsultation?.nextConsultation || '2026-06-10 (Quarterly Follow-up)'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION 6: VACCINATION -------------------- */}
      {activeSection === 'vaccination' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Universal Immunization Programme (UIP) Record
              </h3>
              <p className="text-xs text-stone-500">
                National Immunization Schedule verified under Mother & Child Protection (MCP) card
              </p>
            </div>
            <button
              onClick={() => setShowMCPModal(true)}
              className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Award className="w-3.5 h-3.5 text-amber-300" />
              <span>Digital MCP Mamta Card</span>
            </button>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Vaccine Name</th>
                  <th className="p-3">Target Age</th>
                  <th className="p-3">Protects Against</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Administered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {child.vaccines.map((v, i) => (
                  <tr key={i} className="hover:bg-stone-50/50">
                    <td className="p-3 font-bold text-stone-900">{v.name}</td>
                    <td className="p-3 text-stone-600">{v.recommendedAge}</td>
                    <td className="p-3 text-stone-500 text-[11px]">{v.protectsAgainst || 'Pediatric Disease'}</td>
                    <td className="p-3">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          v.status === 'Completed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : v.status === 'Due'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-stone-600">{v.dateGiven || v.dueDate || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- SECTION 7: NUTRITION & FOOD -------------------- */}
      {activeSection === 'nutrition' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Daily Nutritional Meal Plan & Food Details
              </h3>
              <p className="text-xs text-stone-500">
                Supplementary Nutrition Programme (SNP) menu provided at Rampur Anganwadi Center
              </p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
              500 kcal • 15g Protein / Day
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mealPlan.map((meal) => (
              <div
                key={meal.id}
                className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-950 text-sm">{meal.mealType}</span>
                  <span className="text-[10px] font-mono text-stone-500">{meal.time}</span>
                </div>
                <p className="font-bold text-stone-800">{meal.name}</p>
                <p className="text-[11px] text-stone-600">{meal.description}</p>
                <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px] text-stone-500">
                  <span>Calories: <strong className="text-stone-800">{meal.calories}</strong></span>
                  <span>Protein: <strong className="text-stone-800">{meal.protein}</strong></span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION 8: ALERTS -------------------- */}
      {activeSection === 'alerts' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Health Alerts & Important Notifications
              </h3>
              <p className="text-xs text-stone-500">
                Personal child health notices and Anganwadi center broadcasts
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {parentNotices.map((n) => (
              <div
                key={n.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50 flex items-start gap-3 text-xs"
              >
                <span className="text-2xl mt-0.5">📢</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 text-sm">{n.title}</span>
                    <span className="text-[11px] font-mono text-stone-400">{n.date}</span>
                  </div>
                  <p className="text-stone-600 text-xs mt-1">{n.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION 9: PROFILE / SETTINGS -------------------- */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Parent Profile & Settings
            </h3>
            <p className="text-xs text-stone-500">
              Manage contact details, emergency notifications, and language preference
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Registered Parent Name</span>
              <span className="text-sm font-bold text-stone-900">{child.parentName}</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Registered Mobile</span>
              <span className="text-sm font-bold text-stone-900">{child.parentPhone}</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Anganwadi Center</span>
              <span className="text-sm font-bold text-stone-900">{child.centerName}</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Emergency Helpline</span>
              <span className="text-sm font-bold text-emerald-700">POSHAN Toll-Free 14408 • Childline 1098</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      <ChildProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        child={child}
      />

      <DigitalImmunizationCardModal
        isOpen={showMCPModal}
        onClose={() => setShowMCPModal(false)}
        child={child}
      />
    </div>
  );
};
