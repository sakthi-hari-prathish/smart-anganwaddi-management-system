import React, { useState } from 'react';
import { 
  Package, 
  Users, 
  AlertTriangle, 
  Plus, 
  MinusCircle, 
  Search, 
  Filter, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Utensils, 
  HeartPulse, 
  ChevronRight, 
  Calendar, 
  AlertCircle, 
  ShieldCheck, 
  Building2, 
  FileText, 
  Activity, 
  Pill, 
  Sparkles, 
  Scale, 
  Accessibility, 
  Stethoscope, 
  Syringe, 
  Check, 
  CalendarCheck, 
  FileBarChart2, 
  Settings, 
  Printer, 
  Award,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { 
  Child, 
  StockItem, 
  StockUsageLog, 
  GrowthRecord, 
  DeficiencyRecord, 
  DisabilityRecord,
  SidebarSection, 
  HealthSubSection 
} from '../../types';
import { LogDailyUsageModal } from '../modals/LogDailyUsageModal';
import { RequestStockModal } from '../modals/RequestStockModal';
import { ChildCareModal } from '../modals/ChildCareModal';
import { ChildProfileModal } from '../modals/ChildProfileModal';
import { EditChildHealthModal } from '../modals/EditChildHealthModal';
import { DigitalImmunizationCardModal } from '../modals/DigitalImmunizationCardModal';
import { ChildHealthDashboard } from '../health/ChildHealthDashboard';
import { calculateBMI, getWHOCategory, getBMIBadgeStyle } from '../../utils/healthUtils';

interface WorkerDashboardProps {
  childrenList: Child[];
  stockItems: StockItem[];
  usageLogs: StockUsageLog[];
  onUpdateChild: (child: Child) => void;
  onLogStockUsage: (stockId: string, quantity: number, purpose: string) => void;
  onRequestStock: (
    itemName: string,
    quantity: number,
    unit: string,
    urgency: 'Normal' | 'High' | 'Emergency',
    reason: string
  ) => void;
  activeSection?: SidebarSection;
  healthSubSection?: HealthSubSection;
  onNavigateSection?: (section: SidebarSection, subSection?: HealthSubSection) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  childrenList,
  stockItems,
  usageLogs,
  onUpdateChild,
  onLogStockUsage,
  onRequestStock,
  activeSection = 'home',
  healthSubSection = 'overview',
  onNavigateSection,
}) => {
  // Modals state
  const [showLogUsageModal, setShowLogUsageModal] = useState(false);
  const [showRequestStockModal, setShowRequestStockModal] = useState(false);
  const [selectedChildForEdit, setSelectedChildForEdit] = useState<Child | null>(null);
  const [selectedChildForProfile, setSelectedChildForProfile] = useState<Child | null>(null);
  const [selectedChildForHealthEdit, setSelectedChildForHealthEdit] = useState<Child | null>(null);
  const [selectedChildForMCP, setSelectedChildForMCP] = useState<Child | null>(null);

  // Active child for Health Dashboard tab
  const [activeHealthChildId, setActiveHealthChildId] = useState<string>(
    childrenList[0]?.id || 'ch-01'
  );

  // Search & Filters for children
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'All' | 'Present' | 'Absent' | 'Unmarked'>('All');
  const [nutritionFilter, setNutritionFilter] = useState<'All' | 'Normal' | 'Underweight' | 'Deficiency' | 'Disability'>('All');
  const [stockCategoryFilter, setStockCategoryFilter] = useState<string>('All');

  // Interactive Child BMI Calculator State (Worker tab)
  const [calcChildId, setCalcChildId] = useState<string>(childrenList[0]?.id || 'ch-01');
  const [calcHeight, setCalcHeight] = useState<string>('95');
  const [calcWeight, setCalcWeight] = useState<string>('14.2');
  const [calcDate, setCalcDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [calcNotes, setCalcNotes] = useState<string>('Quarterly growth measurement logged at center');
  const [calcSuccessMsg, setCalcSuccessMsg] = useState<string | null>(null);

  // Deficiency management state
  const [defChildId, setDefChildId] = useState<string>(childrenList[0]?.id || 'ch-01');
  const [defType, setDefType] = useState<DeficiencyRecord['type']>('Iron Deficiency (Anemia)');
  const [defSeverity, setDefSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Mild');
  const [defSupplement, setDefSupplement] = useState<string>('IFA Syrup 1ml bi-weekly');
  const [defDosage, setDefDosage] = useState<string>('1ml twice a week after food');
  const [defSuccessMsg, setDefSuccessMsg] = useState<string | null>(null);

  // Calculate metrics
  const lowStockItems = stockItems.filter((item) => item.currentlyAvailable <= item.thresholdLowStock);
  const presentCount = childrenList.filter((c) => c.attendanceToday === 'Present').length;
  const absentCount = childrenList.filter((c) => c.attendanceToday === 'Absent').length;
  const totalDeficiencyCount = childrenList.filter((c) => c.deficiencies && c.deficiencies.length > 0).length;
  const totalDisabilityCount = childrenList.filter((c) => c.disability?.hasDisability).length;

  // Selected child for calculations
  const calcChild = childrenList.find((c) => c.id === calcChildId) || childrenList[0];
  const activeHealthChild = childrenList.find((c) => c.id === activeHealthChildId) || childrenList[0];

  // Real-time BMI computation
  const numH = parseFloat(calcHeight);
  const numW = parseFloat(calcWeight);
  const liveBMI = numH > 0 && numW > 0 ? calculateBMI(numW, numH) : null;
  const liveCategory = liveBMI && calcChild ? getWHOCategory(liveBMI, calcChild.ageMonths) : null;
  const liveBadge = liveCategory ? getBMIBadgeStyle(liveCategory) : null;

  const handleSaveBMIRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!liveBMI || !liveCategory || !calcChild) return;

    const newRecord: GrowthRecord = {
      date: calcDate,
      month: new Date(calcDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      ageInMonths: calcChild.ageMonths,
      heightCm: numH,
      weightKg: numW,
      bmi: liveBMI,
      whoCategory: liveCategory,
      recordedBy: 'Sunita Devi (Worker)',
      notes: calcNotes,
    };

    const updated: Child = {
      ...calcChild,
      heightCm: numH,
      weightKg: numW,
      bmi: liveBMI,
      growthHistory: [...calcChild.growthHistory, newRecord],
    };

    onUpdateChild(updated);
    setCalcSuccessMsg(
      `Growth record saved for ${calcChild.name}! BMI: ${liveBMI} (${liveCategory}). Automatically updated in Parent Dashboard.`
    );
    setTimeout(() => setCalcSuccessMsg(null), 5000);
  };

  const handleSaveDeficiency = (e: React.FormEvent) => {
    e.preventDefault();
    const targetChild = childrenList.find((c) => c.id === defChildId);
    if (!targetChild) return;

    const newDef: DeficiencyRecord = {
      id: `def-${Date.now()}`,
      type: defType,
      severity: defSeverity,
      diagnosisDate: new Date().toISOString().split('T')[0],
      prescribedSupplement: defSupplement,
      dosage: defDosage,
      status: 'Active',
      notes: `Managed at Rampur Center under POSHAN anemia protocol`,
    };

    const existingDefs = targetChild.deficiencies || [];
    const updated: Child = {
      ...targetChild,
      deficiencies: [...existingDefs.filter((d) => d.type !== defType), newDef],
    };

    onUpdateChild(updated);
    setDefSuccessMsg(`Deficiency record updated for ${targetChild.name}! Synchronized with Parent portal.`);
    setTimeout(() => setDefSuccessMsg(null), 5000);
  };

  // Filter children
  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesAttendance =
      attendanceFilter === 'All' || child.attendanceToday === attendanceFilter;

    const latestGrowth = child.growthHistory[child.growthHistory.length - 1];
    let matchesNutrition = true;

    if (nutritionFilter === 'Normal') {
      matchesNutrition = latestGrowth?.whoCategory === 'Normal';
    } else if (nutritionFilter === 'Underweight') {
      matchesNutrition =
        latestGrowth?.whoCategory === 'Underweight' ||
        latestGrowth?.whoCategory === 'Severely Underweight';
    } else if (nutritionFilter === 'Deficiency') {
      matchesNutrition = Boolean(child.deficiencies && child.deficiencies.length > 0);
    } else if (nutritionFilter === 'Disability') {
      matchesNutrition = child.disability?.hasDisability === true;
    }

    return matchesSearch && matchesAttendance && matchesNutrition;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* -------------------- SECTION: HOME -------------------- */}
      {activeSection === 'home' && (
        <div className="space-y-6">
          {/* Welcome Center Banner */}
          <div className="bg-gradient-to-br from-emerald-600 via-teal-700 to-stone-900 text-white p-5 sm:p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-emerald-200 text-xs font-semibold">
                  <Building2 className="w-4 h-4" />
                  <span>Rampur Main Anganwadi Center (#12) • Sector 4</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                  Worker Station & Nutrition Care Lead
                </h2>
                <p className="text-xs text-stone-200 mt-1 max-w-xl">
                  Logged in as Sunita Devi (Worker ID: AWW-101). Manage child attendance, record BMI calculations with WHO age/sex standards, track deficiencies, and request stock rations.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setShowRequestStockModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-stone-100 transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Request Ration Stock</span>
                </button>
                <button
                  onClick={() => setShowLogUsageModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-800/80 hover:bg-emerald-800 text-white font-bold text-xs transition-colors border border-emerald-500/40 cursor-pointer flex items-center gap-1.5"
                >
                  <MinusCircle className="w-3.5 h-3.5 text-amber-300" />
                  <span>Log Daily Usage</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Enrolled</span>
              <span className="text-2xl font-bold text-stone-900 mt-1 block">{childrenList.length}</span>
              <span className="text-[10px] text-stone-500">Children in Center</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Today Present</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">{presentCount}</span>
              <span className="text-[10px] text-emerald-600 font-semibold">{((presentCount / (childrenList.length || 1)) * 100).toFixed(0)}% Attendance</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Today Absent</span>
              <span className="text-2xl font-bold text-rose-600 mt-1 block">{absentCount}</span>
              <span className="text-[10px] text-stone-500">Excused: 1</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Stock Status</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">{lowStockItems.length}</span>
              <span className="text-[10px] text-amber-700 font-semibold">Items Low Stock</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Deficiencies</span>
              <span className="text-2xl font-bold text-orange-600 mt-1 block">{totalDeficiencyCount}</span>
              <span className="text-[10px] text-stone-500">IFA/Vit A Tracked</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Disabilities</span>
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{totalDisabilityCount}</span>
              <span className="text-[10px] text-stone-500">Special Support</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigateSection && onNavigateSection('health', 'bmi')}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-800">
                Child BMI Calculator & Growth Recorder
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Calculate child BMI with WHO age/sex-specific Z-scores and save height, weight, and date directly into records.
              </p>
            </div>

            <div
              onClick={() => onNavigateSection && onNavigateSection('children')}
              className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-emerald-800">
                Manage Enrolled Children Directory
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                View complete child profiles, update attendance, log meals, and edit clinical health records.
              </p>
            </div>

            <div
              onClick={() => onNavigateSection && onNavigateSection('stocks')}
              className="p-5 rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-yellow-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-yellow-800">
                Center Stock & Inventory Management
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Track Fortified Rice, Pulses, Milk Powder, IFA syrup, and submit restock requisitions to CDPO Supervisor.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: CHILDREN -------------------- */}
      {activeSection === 'children' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Center Children Directory & Records ({filteredChildren.length} of {childrenList.length})
              </h3>
              <p className="text-xs text-stone-500">
                Manage personal profiles, clinical health entries, and daily care logs
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by child name, parent name, or child ID..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-semibold">Attendance:</span>
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value as any)}
                className="p-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
              >
                <option value="All">All Statuses</option>
                <option value="Present">Present Today</option>
                <option value="Absent">Absent Today</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-stone-500 font-semibold">Health Filter:</span>
              <select
                value={nutritionFilter}
                onChange={(e) => setNutritionFilter(e.target.value as any)}
                className="p-2 rounded-xl border border-stone-300 bg-white font-medium text-stone-800"
              >
                <option value="All">All Categories</option>
                <option value="Normal">WHO Normal</option>
                <option value="Underweight">Underweight</option>
                <option value="Deficiency">Has Deficiency</option>
                <option value="Disability">Has Disability</option>
              </select>
            </div>
          </div>

          {/* Children Table */}
          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Child Name & ID</th>
                  <th className="p-3">Age / Gender</th>
                  <th className="p-3">Parents / Contact</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">WHO Growth Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredChildren.map((child) => {
                  const latestG = child.growthHistory[child.growthHistory.length - 1];
                  const badge = latestG ? getBMIBadgeStyle(latestG.whoCategory) : { badge: 'bg-stone-100 text-stone-700' };

                  return (
                    <tr key={child.id} className="hover:bg-stone-50/50">
                      <td className="p-3">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xl">
                            {child.gender === 'Female' ? '👧' : '👦'}
                          </span>
                          <div>
                            <span className="font-bold text-stone-900 block">{child.name}</span>
                            <span className="font-mono text-[10px] text-stone-400">ID: {child.id}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3">
                        <span className="font-semibold text-stone-800">{child.age}</span>
                        <span className="text-[10px] text-stone-500 block">{child.gender} • {child.bloodGroup}</span>
                      </td>
                      <td className="p-3">
                        <span className="text-stone-800 font-medium block">{child.parentName}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{child.parentPhone}</span>
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            child.attendanceToday === 'Present'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {child.attendanceToday}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${badge.badge}`}>
                          {latestG?.whoCategory || 'Normal'}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono mt-0.5">
                          {latestG?.bmi} BMI
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setSelectedChildForProfile(child)}
                            className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] cursor-pointer"
                            title="View Full Profile"
                          >
                            Profile
                          </button>
                          <button
                            onClick={() => setSelectedChildForEdit(child)}
                            className="px-2 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-[11px] border border-emerald-200 cursor-pointer"
                            title="Update Daily Care"
                          >
                            Care Log
                          </button>
                          <button
                            onClick={() => setSelectedChildForHealthEdit(child)}
                            className="px-2 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 font-semibold text-[11px] border border-indigo-200 cursor-pointer"
                            title="Edit Clinical Health"
                          >
                            Edit Health
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: HEALTH DETAILS -------------------- */}
      {activeSection === 'health' && (
        <div className="space-y-6">
          {/* Sub-view: Health Overview */}
          {healthSubSection === 'overview' && (
            <div className="space-y-4">
              <div className="bg-white rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-800">Select Enrolled Child:</span>
                  <select
                    value={activeHealthChildId}
                    onChange={(e) => setActiveHealthChildId(e.target.value)}
                    className="p-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900 cursor-pointer"
                  >
                    {childrenList.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.id} - {c.age})
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={() => setSelectedChildForHealthEdit(activeHealthChild)}
                  className="px-3.5 py-2 rounded-xl bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit {activeHealthChild.name}'s Health Records</span>
                </button>
              </div>

              <ChildHealthDashboard
                child={activeHealthChild}
                canEdit={true}
                onOpenEditHealth={() => setSelectedChildForHealthEdit(activeHealthChild)}
                onAddGrowthRecord={(record) => {
                  const updated: Child = {
                    ...activeHealthChild,
                    growthHistory: [...activeHealthChild.growthHistory, record as GrowthRecord],
                  };
                  onUpdateChild(updated);
                }}
                onOpenVaccineSchedule={() => setSelectedChildForMCP(activeHealthChild)}
              />
            </div>
          )}

          {/* Sub-view: BMI CALCULATOR (CRITICAL REQUIREMENT) */}
          {healthSubSection === 'bmi' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Scale className="w-5 h-5 text-emerald-600" />
                    <span>Child BMI Calculator & Growth Recorder (WHO Child Standards)</span>
                  </h3>
                  <p className="text-xs text-stone-500">
                    Calculates Body Mass Index from Height and Weight using age/sex-specific references (not adult BMI categories). Automatically updates the child's record and parent portal.
                  </p>
                </div>
              </div>

              {/* Calculator Form */}
              <form onSubmit={handleSaveBMIRecord} className="p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {/* Select Child */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      1. Select Child <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={calcChildId}
                      onChange={(e) => setCalcChildId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900"
                    >
                      {childrenList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.gender}, {c.age})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Measurement Date */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      2. Measurement Date <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={calcDate}
                      onChange={(e) => setCalcDate(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900"
                      required
                    />
                  </div>

                  {/* Height in CM */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      3. Stature / Height (cm) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="40"
                      max="140"
                      value={calcHeight}
                      onChange={(e) => setCalcHeight(e.target.value)}
                      placeholder="e.g. 95.0"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900 font-mono"
                      required
                    />
                  </div>

                  {/* Weight in KG */}
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">
                      4. Weight (kg) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="2"
                      max="40"
                      value={calcWeight}
                      onChange={(e) => setCalcWeight(e.target.value)}
                      placeholder="e.g. 14.2"
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900 font-mono"
                      required
                    />
                  </div>
                </div>

                {/* Clinical Notes */}
                <div>
                  <label className="block font-bold text-stone-800 mb-1">
                    Worker Observations & Notes
                  </label>
                  <input
                    type="text"
                    value={calcNotes}
                    onChange={(e) => setCalcNotes(e.target.value)}
                    placeholder="e.g. Measured using infantometer / stadiometer, child cheerful"
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900"
                  />
                </div>

                {/* Real-time Computed Evaluation Preview */}
                <div className="p-4 rounded-xl bg-white border border-stone-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider block">
                      Computed Child BMI & WHO Z-Score Interpretation
                    </span>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-2xl font-bold font-mono text-emerald-800">
                        {liveBMI !== null ? liveBMI : '—'}
                      </span>
                      <span className="text-xs text-stone-500">kg/m²</span>
                      {liveBadge && (
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ml-2 ${liveBadge.badge}`}>
                          WHO {liveCategory}
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-stone-500 mt-1 block">
                      Child: {calcChild.name} • Age: {calcChild.ageMonths} Months • Gender: {calcChild.gender}
                    </span>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>Save Date, Height, Weight & BMI</span>
                  </button>
                </div>
              </form>

              {/* Success Notification Banner */}
              {calcSuccessMsg && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-2 text-xs font-semibold animate-in fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{calcSuccessMsg}</span>
                </div>
              )}

              {/* Child's Growth History Table */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                  Past Growth Records for {calcChild.name}
                </h4>
                <div className="overflow-x-auto rounded-2xl border border-stone-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                      <tr>
                        <th className="p-3">Date</th>
                        <th className="p-3">Height (cm)</th>
                        <th className="p-3">Weight (kg)</th>
                        <th className="p-3">Calculated BMI</th>
                        <th className="p-3">WHO Category</th>
                        <th className="p-3">Notes</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {calcChild.growthHistory.map((g, idx) => (
                        <tr key={idx} className="hover:bg-stone-50/50">
                          <td className="p-3 font-semibold text-stone-800">{g.date || g.month}</td>
                          <td className="p-3 font-mono">{g.heightCm} cm</td>
                          <td className="p-3 font-mono">{g.weightKg} kg</td>
                          <td className="p-3 font-bold font-mono text-emerald-800">{g.bmi}</td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${getBMIBadgeStyle(g.whoCategory).badge}`}>
                              {g.whoCategory}
                            </span>
                          </td>
                          <td className="p-3 text-stone-500 text-[11px]">{g.notes || 'Routine check'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: DEFICIENCY RECORDS */}
          {healthSubSection === 'deficiency' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Deficiency Records & Supplement Management
                </h3>
                <p className="text-xs text-stone-500">
                  Record and update nutritional deficiencies, iron deficiency anemia, Vitamin A, and dosage tracking
                </p>
              </div>

              {/* Add/Update Deficiency Form */}
              <form onSubmit={handleSaveDeficiency} className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-4 text-xs">
                <h4 className="font-bold text-amber-950 uppercase tracking-wider text-xs">
                  Add / Update Child Deficiency Record
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Select Child</label>
                    <select
                      value={defChildId}
                      onChange={(e) => setDefChildId(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900"
                    >
                      {childrenList.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.id})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Deficiency Type</label>
                    <select
                      value={defType}
                      onChange={(e) => setDefType(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900"
                    >
                      <option value="Iron Deficiency (Anemia)">Iron Deficiency (Anemia)</option>
                      <option value="Vitamin A Deficiency">Vitamin A Deficiency</option>
                      <option value="Protein Energy Malnutrition (PEM)">Protein Energy Malnutrition (PEM)</option>
                      <option value="Zinc Deficiency">Zinc Deficiency</option>
                      <option value="Iodine Deficiency">Iodine Deficiency</option>
                      <option value="Vitamin D">Vitamin D</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Severity</label>
                    <select
                      value={defSeverity}
                      onChange={(e) => setDefSeverity(e.target.value as any)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-800 mb-1">Prescribed Supplement</label>
                    <input
                      type="text"
                      value={defSupplement}
                      onChange={(e) => setDefSupplement(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900"
                      required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block font-bold text-stone-800 mb-1">Dosage Administration Schedule</label>
                    <input
                      type="text"
                      value={defDosage}
                      onChange={(e) => setDefDosage(e.target.value)}
                      className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-medium text-stone-900"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  Save Deficiency Record
                </button>
              </form>

              {defSuccessMsg && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                  {defSuccessMsg}
                </div>
              )}
            </div>
          )}

          {/* Sub-view: DISABILITY RECORDS */}
          {healthSubSection === 'disability' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Disability Records & Early Intervention
                </h3>
                <p className="text-xs text-stone-500">
                  Manage Divyangjan children records, UDID numbers, and assistive aids
                </p>
              </div>

              <div className="space-y-3">
                {childrenList.map((c) => {
                  const hasDis = c.disability?.hasDisability;
                  return (
                    <div
                      key={c.id}
                      className={`p-4 rounded-2xl border text-xs flex flex-wrap items-center justify-between gap-3 ${
                        hasDis ? 'bg-blue-50/60 border-blue-200' : 'bg-stone-50 border-stone-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{hasDis ? '♿' : '🧒'}</span>
                        <div>
                          <span className="font-bold text-stone-900 block">{c.name} ({c.id})</span>
                          <span className="text-[11px] text-stone-500">
                            {hasDis ? `${c.disability?.type} • ${c.disability?.severity} Severity` : 'No disability reported'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {hasDis && (
                          <span className="px-2 py-0.5 rounded-md font-mono text-[10px] bg-blue-100 text-blue-800">
                            UDID: {c.disability?.udidNumber || 'Pending'}
                          </span>
                        )}
                        <button
                          onClick={() => setSelectedChildForHealthEdit(c)}
                          className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold cursor-pointer"
                        >
                          Edit Disability Status
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------- SECTION: ATTENDANCE DETAILS -------------------- */}
      {activeSection === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Daily Center Attendance Register • Today ({presentCount} Present, {absentCount} Absent)
              </h3>
              <p className="text-xs text-stone-500">
                Rampur Anganwadi Center #12 • Toggle attendance and verify meal reception
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-100 text-xs">
            {childrenList.map((c) => (
              <div key={c.id} className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{c.gender === 'Female' ? '👧' : '👦'}</span>
                  <div>
                    <span className="font-bold text-stone-900 block">{c.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">ID: {c.id}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      const updated: Child = {
                        ...c,
                        attendanceToday: c.attendanceToday === 'Present' ? 'Absent' : 'Present',
                        checkInTime: c.attendanceToday === 'Present' ? undefined : '08:45 AM',
                      };
                      onUpdateChild(updated);
                    }}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs cursor-pointer transition-all ${
                      c.attendanceToday === 'Present'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                    }`}
                  >
                    {c.attendanceToday === 'Present' ? '✅ Marked Present' : '❌ Marked Absent'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION: CONSULTATION -------------------- */}
      {activeSection === 'consultation' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              PHC Doctor & Pediatric Consultations Log
            </h3>
            <p className="text-xs text-stone-500">
              Record findings and prescriptions from Rashtriya Bal Swasthya Karyakram (RBSK) visits
            </p>
          </div>

          <div className="space-y-4">
            {childrenList.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-stone-900 text-sm">{c.name} ({c.id})</span>
                  <button
                    onClick={() => setSelectedChildForHealthEdit(c)}
                    className="px-2.5 py-1 rounded-lg bg-white border border-stone-300 font-semibold hover:bg-stone-100 cursor-pointer"
                  >
                    Update Doctor Notes
                  </button>
                </div>
                <div className="p-3 rounded-xl bg-white border border-stone-200 text-stone-700">
                  <div className="font-semibold text-stone-800">
                    Doctor: {c.doctorConsultation?.doctorName || 'Dr. Ananya Sen, MBBS, DCH'}
                  </div>
                  <div className="text-[11px] text-stone-600 mt-1">
                    Findings: {c.doctorConsultation?.findings || 'Routine checkup completed. Normal growth.'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION: VACCINATION -------------------- */}
      {activeSection === 'vaccination' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Center Immunization Register (UIP Schedule)
              </h3>
              <p className="text-xs text-stone-500">
                Track Universal Immunization Programme progress and upcoming camp attendees
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {childrenList.map((c) => (
              <div key={c.id} className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-stone-900 text-sm block">{c.name} ({c.id})</span>
                  <span className="text-[11px] text-stone-500">
                    Vaccines: {c.vaccines.filter((v) => v.status === 'Completed').length} / {c.vaccines.length} Completed
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedChildForMCP(c)}
                    className="px-3 py-1.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold text-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Award className="w-3.5 h-3.5 text-amber-300" />
                    <span>Mamta MCP Card</span>
                  </button>
                  <button
                    onClick={() => setSelectedChildForHealthEdit(c)}
                    className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 hover:bg-stone-100 text-stone-800 font-semibold text-xs cursor-pointer"
                  >
                    Record Dose Given
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION: NUTRITION & FOOD -------------------- */}
      {activeSection === 'nutrition' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Center Food & Supplementary Nutrition Register
            </h3>
            <p className="text-xs text-stone-500">
              Daily meal distribution, Morning Snacks, and Hot Cooked Meals log
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
              <span className="font-bold text-amber-950 text-sm block">Morning Snack (09:30 AM)</span>
              <p className="text-stone-700 mt-1">Sprouts, Boiled Egg, or Seasonal Fruits with Milk</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                Served to {presentCount} children today
              </span>
            </div>
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200">
              <span className="font-bold text-emerald-950 text-sm block">Hot Cooked Lunch (12:30 PM)</span>
              <p className="text-stone-700 mt-1">Fortified Rice Khichdi with Mixed Lentils & Green Vegetables</p>
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-900">
                Prepared & Distributed
              </span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: STOCK MANAGEMENT -------------------- */}
      {activeSection === 'stocks' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Anganwadi Center Stock & Inventory Management
              </h3>
              <p className="text-xs text-stone-500">
                Track staples, therapeutic supplements, and educational supplies
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowRequestStockModal(true)}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Request New Stock</span>
              </button>
              <button
                onClick={() => setShowLogUsageModal(true)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <MinusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Log Daily Usage</span>
              </button>
            </div>
          </div>

          {/* Stock Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {stockItems.map((item) => {
              const isLow = item.currentlyAvailable <= item.thresholdLowStock;
              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border text-xs space-y-3 transition-all ${
                    isLow ? 'bg-amber-50/60 border-amber-300' : 'bg-stone-50/60 border-stone-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-bold text-stone-900 text-sm block">{item.name}</span>
                      <span className="text-[10px] text-stone-500 font-mono">Category: {item.category}</span>
                    </div>
                    {isLow && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500 text-white animate-pulse">
                        Low Stock
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/60">
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">Available</span>
                      <span className="text-base font-bold text-stone-900 font-mono">
                        {item.currentlyAvailable} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">Daily Rate</span>
                      <span className="font-semibold text-stone-700 font-mono">
                        {item.dailyConsumptionRate} {item.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-400 block font-semibold">Expiry</span>
                      <span className="font-semibold text-stone-700">{item.expiryDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -------------------- SECTION: ALERTS -------------------- */}
      {activeSection === 'alerts' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Center Alerts & Clinical Surveillance Reminders
            </h3>
            <p className="text-xs text-stone-500">
              Low inventory warnings, growth faltering flags, and overdue vaccinations
            </p>
          </div>

          <div className="space-y-3">
            {lowStockItems.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-amber-950 block">Low Stock Alert: {item.name}</span>
                    <span className="text-stone-600 text-[11px]">
                      Only {item.currentlyAvailable} {item.unit} remaining (Threshold: {item.thresholdLowStock} {item.unit}). Reorder immediately.
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowRequestStockModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold cursor-pointer shrink-0"
                >
                  Request Dispatch
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION: REPORTS -------------------- */}
      {activeSection === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                POSHAN 2.0 Monthly Progress Report (MPR)
              </h3>
              <p className="text-xs text-stone-500">
                Official Anganwadi center monthly statistical return for CDPO Sector 4
              </p>
            </div>
            <button
              onClick={() => alert('Monthly Progress Report (MPR) exported in government format!')}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Monthly Register</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 font-semibold block text-[10px]">Enrollment Metric</span>
              <span className="text-xl font-bold text-stone-900 mt-1 block">32 Children</span>
              <span className="text-stone-500 text-[11px]">18 Boys, 14 Girls</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 font-semibold block text-[10px]">Nutritional Summary</span>
              <span className="text-xl font-bold text-emerald-800 mt-1 block">84% Normal</span>
              <span className="text-stone-500 text-[11px]">16% Moderate Underweight</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 font-semibold block text-[10px]">Immunization Coverage</span>
              <span className="text-xl font-bold text-purple-800 mt-1 block">93.8%</span>
              <span className="text-stone-500 text-[11px]">UIP Target Met</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: PROFILE / SETTINGS -------------------- */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Worker Profile & Center Information
            </h3>
            <p className="text-xs text-stone-500">
              Assigned credentials and administrative jurisdiction
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Worker Name</span>
              <span className="text-sm font-bold text-stone-900">Sunita Devi</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Worker Registration ID</span>
              <span className="text-sm font-bold font-mono text-stone-900">AWW-101</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Assigned Center</span>
              <span className="text-sm font-bold text-stone-900">Rampur Main Anganwadi Center (#12)</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Supervisor</span>
              <span className="text-sm font-bold text-stone-900">Meera Rao (CDPO Sector 4)</span>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {selectedChildForProfile && (
        <ChildProfileModal
          isOpen={Boolean(selectedChildForProfile)}
          onClose={() => setSelectedChildForProfile(null)}
          child={selectedChildForProfile}
        />
      )}

      {selectedChildForEdit && (
        <ChildCareModal
          isOpen={Boolean(selectedChildForEdit)}
          onClose={() => setSelectedChildForEdit(null)}
          child={selectedChildForEdit}
          onSave={onUpdateChild}
        />
      )}

      {selectedChildForHealthEdit && (
        <EditChildHealthModal
          isOpen={Boolean(selectedChildForHealthEdit)}
          onClose={() => setSelectedChildForHealthEdit(null)}
          child={selectedChildForHealthEdit}
          onSave={onUpdateChild}
        />
      )}

      {selectedChildForMCP && (
        <DigitalImmunizationCardModal
          isOpen={Boolean(selectedChildForMCP)}
          onClose={() => setSelectedChildForMCP(null)}
          child={selectedChildForMCP}
        />
      )}

      <LogDailyUsageModal
        isOpen={showLogUsageModal}
        onClose={() => setShowLogUsageModal(false)}
        stockItems={stockItems}
        onLogUsage={onLogStockUsage}
      />

      <RequestStockModal
        isOpen={showRequestStockModal}
        onClose={() => setShowRequestStockModal(false)}
        stockItems={stockItems}
        onRequestStock={onRequestStock}
      />
    </div>
  );
};
