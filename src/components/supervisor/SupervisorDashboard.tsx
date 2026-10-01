import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Search, 
  Filter, 
  Megaphone, 
  BarChart3, 
  PieChart, 
  Package, 
  ShieldCheck, 
  Phone, 
  ChevronRight,
  ArrowUpRight,
  Check,
  Send,
  Layers,
  Sparkles,
  HeartPulse,
  Syringe,
  Activity,
  Pill,
  Lock,
  UserCheck,
  Scale,
  Accessibility,
  CalendarCheck,
  Stethoscope,
  UtensilsCrossed,
  FileBarChart2,
  Settings,
  Printer
} from 'lucide-react';
import { AnganwadiCenter, StockRequisition, Announcement, Child, SidebarSection, HealthSubSection } from '../../types';
import { BroadcastNoticeModal } from '../modals/BroadcastNoticeModal';

interface SupervisorDashboardProps {
  centers: AnganwadiCenter[];
  requisitions: StockRequisition[];
  onApproveRequisition: (reqId: string) => void;
  onBroadcastNotice: (notice: Omit<Announcement, 'id'>) => void;
  childrenList?: Child[];
  activeSection?: SidebarSection;
  healthSubSection?: HealthSubSection;
  onNavigateSection?: (section: SidebarSection, subSection?: HealthSubSection) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  centers,
  requisitions,
  onApproveRequisition,
  onBroadcastNotice,
  childrenList = [],
  activeSection = 'home',
  healthSubSection = 'overview',
  onNavigateSection,
}) => {
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [centerFilter, setCenterFilter] = useState<string>('All');
  const [selectedCenter, setSelectedCenter] = useState<AnganwadiCenter | null>(null);

  // High-Level Stat Calculations
  const totalAnganwadis = centers.length;
  const totalEnrolled = centers.reduce((acc, c) => acc + c.totalEnrolledChildren, 0);
  const avgAttendance = (
    centers.reduce((acc, c) => acc + c.attendanceRatePercent, 0) / (totalAnganwadis || 1)
  ).toFixed(1);
  const lowStockCentersCount = centers.filter(
    (c) => c.stockStatus === 'Low' || c.stockStatus === 'Critical'
  ).length;

  const pendingRequisitions = requisitions.filter((r) => r.status === 'Pending');

  // Aggregated Health & Clinical Metrics
  const avgVaccineCoverage = Math.round(
    centers.reduce((acc, c) => acc + (c.vaccinationCoveragePercent || 90), 0) / (totalAnganwadis || 1)
  );

  const totalDeficienciesCount = centers.reduce(
    (acc, c) => acc + (c.deficiencyCasesCount || 3),
    0
  );

  const totalDisabilitiesCount = centers.reduce(
    (acc, c) => acc + (c.disabilityCasesCount || 0),
    0
  );

  // Filtered centers
  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.inChargeName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCenter = centerFilter === 'All' || center.id === centerFilter || center.code === centerFilter;
    return matchesSearch && matchesCenter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Supervisor Header */}
      <section className="bg-gradient-to-br from-indigo-900 via-slate-900 to-stone-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-indigo-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              📋
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold uppercase tracking-wider">
                  Child Development Project Officer (CDPO)
                </span>
                <span className="text-xs text-stone-300">Sector 4 Division</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                Supervisor Meera Rao • Sector 4 Command Center
              </h2>
              <p className="text-xs text-indigo-200/90 mt-0.5">
                Surveillance across {totalAnganwadis} Anganwadis • POSHAN 2.0 National Child Health Mission
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4 text-amber-300" />
              <span>Broadcast Sector Alert</span>
            </button>
          </div>
        </div>
      </section>

      {/* -------------------- SECTION: HOME -------------------- */}
      {activeSection === 'home' && (
        <div className="space-y-6">
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Supervised Centers</span>
              <span className="text-2xl font-bold text-stone-900 mt-1 block">{totalAnganwadis}</span>
              <span className="text-[10px] text-stone-500">Sector 4 Jurisdiction</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Total Children</span>
              <span className="text-2xl font-bold text-stone-900 mt-1 block">{totalEnrolled}</span>
              <span className="text-[10px] text-stone-500">Across 8 Centers</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Avg Attendance</span>
              <span className="text-2xl font-bold text-emerald-700 mt-1 block">{avgAttendance}%</span>
              <span className="text-[10px] text-emerald-600 font-semibold">Today's Check-in</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Pending Requisitions</span>
              <span className="text-2xl font-bold text-amber-600 mt-1 block">{pendingRequisitions.length}</span>
              <span className="text-[10px] text-amber-700 font-semibold">Needs Approval</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Deficiencies Total</span>
              <span className="text-2xl font-bold text-orange-600 mt-1 block">{totalDeficienciesCount}</span>
              <span className="text-[10px] text-stone-500">Anemia / Vit A Cases</span>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">Vaccine Coverage</span>
              <span className="text-2xl font-bold text-purple-700 mt-1 block">{avgVaccineCoverage}%</span>
              <span className="text-[10px] text-purple-600 font-semibold">UIP Sector Average</span>
            </div>
          </div>

          {/* Quick Action Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div
              onClick={() => onNavigateSection && onNavigateSection('stocks')}
              className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Package className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-amber-800">
                Stock Requisitions ({pendingRequisitions.length} Pending)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Review and approve grain, ration, and medicine dispatches requested by center workers.
              </p>
            </div>

            <div
              onClick={() => onNavigateSection && onNavigateSection('health', 'bmi')}
              className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 cursor-pointer hover:shadow-md transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-3 shadow-xs">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-stone-900 text-sm group-hover:text-indigo-800">
                Sector BMI Monitoring & Malnutrition
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Monitor Moderately Underweight (MAM) and Severely Acute Malnutrition (SAM) across centers.
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
                Sector Children Directory ({totalEnrolled} Children)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Filter and inspect enrolled children across all 8 supervised Anganwadis in Sector 4.
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
                Sector Children Directory & Center Filter
              </h3>
              <p className="text-xs text-stone-500">
                Authorized supervision view of children enrolled across Sector 4
              </p>
            </div>

            {/* Filter by Anganwadi Center */}
            <div className="flex items-center gap-2 text-xs">
              <span className="font-semibold text-stone-600">Filter Anganwadi:</span>
              <select
                value={centerFilter}
                onChange={(e) => setCenterFilter(e.target.value)}
                className="p-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900 cursor-pointer"
              >
                <option value="All">All 8 Centers</option>
                {centers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Child Name & ID</th>
                  <th className="p-3">Center Assigned</th>
                  <th className="p-3">Age / Gender</th>
                  <th className="p-3">Attendance</th>
                  <th className="p-3">Growth Category</th>
                  <th className="p-3">Deficiency Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {childrenList.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <span className="font-bold text-stone-900 block">{c.name}</span>
                      <span className="font-mono text-[10px] text-stone-400">ID: {c.id}</span>
                    </td>
                    <td className="p-3">
                      <span className="font-semibold text-stone-800">{c.centerName}</span>
                    </td>
                    <td className="p-3">
                      <span>{c.age}</span>
                      <span className="text-[10px] text-stone-400 block">{c.gender}</span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.attendanceToday === 'Present' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {c.attendanceToday}
                      </span>
                    </td>
                    <td className="p-3 font-semibold text-stone-800">
                      {c.growthHistory[c.growthHistory.length - 1]?.whoCategory || 'Normal'}
                    </td>
                    <td className="p-3">
                      {c.deficiencies && c.deficiencies.length > 0 ? (
                        <span className="px-2 py-0.5 rounded-md font-bold text-[10px] bg-amber-100 text-amber-800">
                          {c.deficiencies[0].type}
                        </span>
                      ) : (
                        <span className="text-stone-400 text-[11px]">Normal</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: HEALTH DETAILS -------------------- */}
      {activeSection === 'health' && (
        <div className="space-y-6">
          {/* Sub-view: Overview */}
          {healthSubSection === 'overview' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Sector 4 Consolidated Health & Clinical Overview
                </h3>
                <p className="text-xs text-stone-500">
                  Macro metrics for malnutrition, immunization, and nutritional deficiencies
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-semibold block text-[10px]">Normal Growth Prevalence</span>
                  <span className="text-2xl font-bold text-emerald-700 mt-1 block">82.2%</span>
                  <span className="text-stone-500 text-[11px]">227 of 276 children normal</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-semibold block text-[10px]">Moderate Malnutrition (MAM)</span>
                  <span className="text-2xl font-bold text-amber-600 mt-1 block">14.1%</span>
                  <span className="text-stone-500 text-[11px]">39 children under supplementary nutrition</span>
                </div>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-400 font-semibold block text-[10px]">Severe Acute Malnutrition (SAM)</span>
                  <span className="text-2xl font-bold text-rose-600 mt-1 block">3.6%</span>
                  <span className="text-stone-500 text-[11px]">10 children referred to NRC</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: BMI Monitoring */}
          {healthSubSection === 'bmi' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Sector-Wide Child BMI Monitoring & Malnutrition Surveillance
                </h3>
                <p className="text-xs text-stone-500">
                  Center-by-center comparison of WHO Child Growth Standards (Z-scores)
                </p>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-stone-200">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                    <tr>
                      <th className="p-3">Anganwadi Center</th>
                      <th className="p-3">Enrolled</th>
                      <th className="p-3">Normal BMI</th>
                      <th className="p-3">Underweight (MAM)</th>
                      <th className="p-3">Severe (SAM)</th>
                      <th className="p-3">NRC Referrals</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {centers.map((c) => (
                      <tr key={c.id} className="hover:bg-stone-50/50">
                        <td className="p-3 font-bold text-stone-900">{c.name}</td>
                        <td className="p-3 font-semibold">{c.totalEnrolledChildren}</td>
                        <td className="p-3 text-emerald-700 font-bold">
                          {Math.round(c.totalEnrolledChildren * 0.82)} (82%)
                        </td>
                        <td className="p-3 text-amber-700 font-bold">
                          {Math.round(c.totalEnrolledChildren * 0.14)} (14%)
                        </td>
                        <td className="p-3 text-rose-700 font-bold">
                          {Math.round(c.totalEnrolledChildren * 0.04)} (4%)
                        </td>
                        <td className="p-3 font-mono text-stone-600">Active Monitoring</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Sub-view: Deficiency */}
          {healthSubSection === 'deficiency' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Micronutrient Deficiency Surveillance Across Centers
                </h3>
                <p className="text-xs text-stone-500">
                  Tracking Anemia, Vitamin A deficiency, and therapeutic supplement supplies
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="font-bold text-amber-950 block">Iron Deficiency Anemia</span>
                  <span className="text-2xl font-bold text-amber-900 mt-1 block">15 Cases</span>
                  <span className="text-[10px] text-stone-600">Supplied with IFA Syrup</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="font-bold text-amber-950 block">Vitamin A Deficiency</span>
                  <span className="text-2xl font-bold text-amber-900 mt-1 block">6 Cases</span>
                  <span className="text-[10px] text-stone-600">Bi-annual Vitamin A dose</span>
                </div>
                <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200">
                  <span className="font-bold text-amber-950 block">Zinc / Other Deficiencies</span>
                  <span className="text-2xl font-bold text-amber-900 mt-1 block">3 Cases</span>
                  <span className="text-[10px] text-stone-600">Under therapeutic diet</span>
                </div>
              </div>
            </div>
          )}

          {/* Sub-view: Disability */}
          {healthSubSection === 'disability' && (
            <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
              <div className="pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">
                  Sector Disability Registry (Divyangjan Support)
                </h3>
                <p className="text-xs text-stone-500">
                  5 children with special healthcare needs registered across Sector 4
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-blue-950 text-sm">Inclusive Early Childhood Education Support</span>
                  <span className="px-2.5 py-0.5 rounded-full font-bold text-[10px] bg-blue-200 text-blue-900">
                    UDID Verified: 4 / 5
                  </span>
                </div>
                <p className="text-stone-700">
                  District Early Intervention Center (DEIC) mobile therapy teams visit centers on the 2nd Thursday of each month.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* -------------------- SECTION: ATTENDANCE DETAILS -------------------- */}
      {activeSection === 'attendance' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Center-Wise Attendance Comparison & Trends
            </h3>
            <p className="text-xs text-stone-500">
              Daily and monthly attendance statistics across all 8 Anganwadis
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-semibold border-b border-stone-200">
                <tr>
                  <th className="p-3">Anganwadi Name & Code</th>
                  <th className="p-3">Worker In-Charge</th>
                  <th className="p-3">Enrolled</th>
                  <th className="p-3">Attendance Rate</th>
                  <th className="p-3">Performance Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {centers.map((c) => (
                  <tr key={c.id} className="hover:bg-stone-50/50">
                    <td className="p-3">
                      <span className="font-bold text-stone-900 block">{c.name}</span>
                      <span className="text-[10px] text-stone-400 font-mono">{c.code}</span>
                    </td>
                    <td className="p-3 text-stone-800 font-medium">{c.inChargeName}</td>
                    <td className="p-3 font-semibold">{c.totalEnrolledChildren}</td>
                    <td className="p-3 font-bold text-emerald-700">{c.attendanceRatePercent}%</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        c.attendanceRatePercent >= 88 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                      }`}>
                        {c.attendanceRatePercent >= 88 ? 'High Attendance' : 'Follow-up Needed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: CONSULTATION -------------------- */}
      {activeSection === 'consultation' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              RBSK Mobile Health Team Inspection & Clinical Consultations
            </h3>
            <p className="text-xs text-stone-500">
              Sector pediatric checkup schedules and medical officer reviews
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
            <div className="font-bold text-stone-900 text-sm">Quarterly RBSK Inspection Cycle: Active</div>
            <p className="text-stone-600">
              Dr. Ananya Sen and medical health team have covered 6 of 8 centers this quarter. Next inspection scheduled for Rampur Center #12 and Bilaspur Center next Tuesday.
            </p>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: VACCINATION -------------------- */}
      {activeSection === 'vaccination' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Universal Immunization Programme (UIP) Sector Coverage
            </h3>
            <p className="text-xs text-stone-500">
              Center-by-center immunization targets and Village Health Sanitation Nutrition Days (VHSND)
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {centers.map((c) => (
              <div key={c.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
                <span className="font-bold text-stone-900 block truncate">{c.name}</span>
                <div className="flex items-baseline justify-between">
                  <span className="text-stone-500 text-[11px]">UIP Coverage:</span>
                  <span className="text-base font-bold text-purple-800">{c.vaccinationCoveragePercent || 92}%</span>
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
              Supplementary Nutrition Programme (SNP) Quality Audit
            </h3>
            <p className="text-xs text-stone-500">
              Monitoring hot cooked meals and take-home ration distributions
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs">
            <div className="font-bold text-emerald-950 text-sm">Meal Distribution Compliance: 100%</div>
            <p className="text-stone-700 mt-1">
              All 8 centers reported timely delivery of morning snacks and hot cooked fortified khichdi lunch.
            </p>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: STOCK MANAGEMENT (REQUISITIONS) -------------------- */}
      {activeSection === 'stocks' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Stock Requisitions & Restock Approval ({pendingRequisitions.length} Pending)
              </h3>
              <p className="text-xs text-stone-500">
                Review and approve ration supplies requested by Anganwadi workers
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            {requisitions.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-2xl border border-stone-200 bg-stone-50/50 flex flex-wrap items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-stone-900 text-sm">{req.itemName}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                      {req.quantityRequested} {req.unit}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      req.urgency === 'Emergency' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
                    }`}>
                      {req.urgency} Urgency
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Requested by: <strong>{req.workerName}</strong> ({req.centerName}) • {req.dateRequested}
                  </p>
                  <p className="text-[11px] text-stone-500 italic mt-0.5">"{req.reason}"</p>
                </div>

                <div>
                  {req.status === 'Pending' ? (
                    <button
                      onClick={() => onApproveRequisition(req.id)}
                      className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve & Dispatch</span>
                    </button>
                  ) : (
                    <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 font-bold text-xs">
                      Approved & Dispatched
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* -------------------- SECTION: ALERTS -------------------- */}
      {activeSection === 'alerts' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Sector Alerts & Critical Notifications
              </h3>
              <p className="text-xs text-stone-500">
                Broadcast emergency advisories to workers and parents across Sector 4
              </p>
            </div>
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Broadcast New Notice</span>
            </button>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs">
              <span className="font-bold text-amber-950 block">Rampur Center #12: Low Rice Stock</span>
              <p className="text-stone-700 mt-0.5">Requisition pending supervisor approval. Current stock: 24 kg.</p>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: REPORTS -------------------- */}
      {activeSection === 'reports' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                CDPO Sector 4 Inspection Summary & Compliance Reports
              </h3>
              <p className="text-xs text-stone-500">
                Quarterly performance scorecards and POSHAN Abhiyaan governance returns
              </p>
            </div>
            <button
              onClick={() => alert('Sector compliance report exported successfully!')}
              className="px-3.5 py-2 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export Sector Summary</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 font-semibold block text-[10px]">Center Compliance Score</span>
              <span className="text-2xl font-bold text-emerald-800 mt-1 block">96.4%</span>
              <span className="text-stone-500 text-[11px]">Rank 1 in District</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 font-semibold block text-[10px]">Total THR Dispatched</span>
              <span className="text-2xl font-bold text-stone-900 mt-1 block">1,240 kg</span>
              <span className="text-stone-500 text-[11px]">This month</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-stone-400 font-semibold block text-[10px]">Aadhaar Seeding Rate</span>
              <span className="text-2xl font-bold text-indigo-800 mt-1 block">98.2%</span>
              <span className="text-stone-500 text-[11px]">271 / 276 verified</span>
            </div>
          </div>
        </div>
      )}

      {/* -------------------- SECTION: PROFILE / SETTINGS -------------------- */}
      {activeSection === 'profile' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-2xs space-y-6">
          <div className="pb-4 border-b border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Supervisor Profile & Division Info
            </h3>
            <p className="text-xs text-stone-500">
              Child Development Project Officer jurisdiction details
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Supervisor Name</span>
              <span className="text-sm font-bold text-stone-900">Meera Rao</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Designation</span>
              <span className="text-sm font-bold text-stone-900">Child Development Project Officer (CDPO)</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Jurisdiction</span>
              <span className="text-sm font-bold text-stone-900">Sector 4 Division (8 Anganwadi Centers)</span>
            </div>
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] text-stone-400 block font-semibold">Official ID</span>
              <span className="text-sm font-bold font-mono text-stone-900">SUP-402</span>
            </div>
          </div>
        </div>
      )}

      {/* Broadcast Notice Modal */}
      <BroadcastNoticeModal
        isOpen={showBroadcastModal}
        onClose={() => setShowBroadcastModal(false)}
        onBroadcast={onBroadcastNotice}
      />
    </div>
  );
};
