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
  Sparkles
} from 'lucide-react';
import { AnganwadiCenter, StockRequisition, Announcement } from '../../types';
import { BroadcastNoticeModal } from '../modals/BroadcastNoticeModal';

interface SupervisorDashboardProps {
  centers: AnganwadiCenter[];
  requisitions: StockRequisition[];
  onApproveRequisition: (reqId: string) => void;
  onBroadcastNotice: (notice: Omit<Announcement, 'id'>) => void;
}

export const SupervisorDashboard: React.FC<SupervisorDashboardProps> = ({
  centers,
  requisitions,
  onApproveRequisition,
  onBroadcastNotice,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'requisitions'>('overview');
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [stockStatusFilter, setStockStatusFilter] = useState<'All' | 'Low/Critical' | 'Pending Meal'>('All');
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

  // Filtered centers
  const filteredCenters = centers.filter((center) => {
    const matchesSearch =
      center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.inChargeName.toLowerCase().includes(searchQuery.toLowerCase());

    if (stockStatusFilter === 'Low/Critical') {
      return matchesSearch && (center.stockStatus === 'Low' || center.stockStatus === 'Critical');
    }
    if (stockStatusFilter === 'Pending Meal') {
      return matchesSearch && center.foodDistributionStatus !== 'Completed';
    }
    return matchesSearch;
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
                Monitoring 8 Gram Panchayat Anganwadi Centers • POSHAN 2.0 State Surveillance
              </p>
            </div>
          </div>

          {/* Supervisor Action Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBroadcastModal(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-400/40 transition-colors cursor-pointer shadow-md"
            >
              <Megaphone className="w-4 h-4" />
              <span>Broadcast Sector Notice</span>
            </button>
          </div>
        </div>
      </section>

      {/* 4 OVERVIEW STAT CARDS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Anganwadis Managed */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Total Centers Managed
            </span>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-700">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{totalAnganwadis}</span>
            <span className="text-xs text-emerald-700 font-semibold">100% Operational</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
            Sector 4 (Rampur & Kalyanpur blocks)
          </p>
        </div>

        {/* Card 2: Total Enrolled Children */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Total Enrolled Children
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-stone-900">{totalEnrolled}</span>
            <span className="text-xs text-stone-500 font-medium">Ages 0 - 6 yrs</span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
            Mother-child beneficiary registry synced
          </p>
        </div>

        {/* Card 3: Average Daily Attendance Rate */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Average Attendance Rate
            </span>
            <div className="p-2 rounded-xl bg-teal-50 text-teal-700">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-700">{avgAttendance}%</span>
            <span className="text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
              Above target
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
            Target minimum: 80% daily turnout
          </p>
        </div>

        {/* Card 4: Centers with Low Meal/Stock Supply */}
        <div className={`p-5 rounded-2xl border shadow-xs relative overflow-hidden transition-all ${
          lowStockCentersCount > 0 ? 'bg-amber-50/70 border-amber-300' : 'bg-white border-stone-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Stock Shortage Alerts
            </span>
            <div className="p-2 rounded-xl bg-amber-200 text-amber-900">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-900">{lowStockCentersCount}</span>
            <span className="text-xs text-rose-700 font-bold">Action Needed</span>
          </div>
          <p className="text-[11px] text-amber-800 mt-2 pt-2 border-t border-amber-200">
            {pendingRequisitions.length} pending supply indents submitted
          </p>
        </div>
      </section>

      {/* Tabs Switcher for Supervisor */}
      <div className="border-b border-stone-200 flex gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Anganwadi Center Overview</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-bold">
            {centers.length} Centers
          </span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'analytics'
              ? 'border-indigo-600 text-indigo-900 bg-indigo-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics & Reports Section</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 text-indigo-800 font-bold">
            WHO & Supply Metrics
          </span>
        </button>

        <button
          onClick={() => setActiveTab('requisitions')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'requisitions'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Pending Stock Indents</span>
          {pendingRequisitions.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-white font-bold animate-pulse">
              {pendingRequisitions.length} Pending
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: ANGANWADI CENTER OVERVIEW TABLE & CARDS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Search center by name, code or worker..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
              <span className="text-xs font-semibold text-stone-500">Filter:</span>
              {(['All', 'Low/Critical', 'Pending Meal'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setStockStatusFilter(f)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-medium cursor-pointer transition-colors whitespace-nowrap ${
                    stockStatusFilter === f
                      ? 'bg-indigo-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Centers Table */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Anganwadi Centers Directory ({filteredCenters.length} centers)
                </h3>
                <p className="text-xs text-stone-500">
                  Real-time synchronization of center operations, daily attendance, food distribution, and inventory.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Center Code & Name</th>
                    <th className="py-3 px-3">In-Charge (Worker)</th>
                    <th className="py-3 px-3">Enrolled / Today</th>
                    <th className="py-3 px-3">Today's Attendance %</th>
                    <th className="py-3 px-3">Food Distribution</th>
                    <th className="py-3 px-3">Stock Level Indicator</th>
                    <th className="py-3 px-4 text-right">Quick Contact</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredCenters.map((center) => (
                    <tr key={center.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* Code & Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded">
                            {center.code}
                          </span>
                          <div>
                            <div className="font-bold text-stone-900 text-xs sm:text-sm">
                              {center.name}
                            </div>
                            <div className="text-[11px] text-stone-500">
                              {center.villageBlock}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* In-Charge */}
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-stone-800">{center.inChargeName}</div>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {center.inChargePhone}
                        </span>
                      </td>

                      {/* Enrolled */}
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-stone-800">
                          {center.presentTodayCount} / {center.totalEnrolledChildren}
                        </div>
                        <span className="text-[10px] text-stone-500">present today</span>
                      </td>

                      {/* Attendance % with visual bar */}
                      <td className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                            <div
                              className={`h-full rounded-full ${
                                center.attendanceRatePercent >= 88 ? 'bg-emerald-600' : 'bg-amber-500'
                              }`}
                              style={{ width: `${center.attendanceRatePercent}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-stone-900">
                            {center.attendanceRatePercent}%
                          </span>
                        </div>
                      </td>

                      {/* Food Distribution */}
                      <td className="py-3.5 px-3">
                        {center.foodDistributionStatus === 'Completed' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                          </span>
                        )}
                        {center.foodDistributionStatus === 'In Progress' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <Clock className="w-3 h-3 text-amber-600" /> In Progress
                          </span>
                        )}
                        {center.foodDistributionStatus === 'Pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> Pending
                          </span>
                        )}
                      </td>

                      {/* Stock Level Indicator */}
                      <td className="py-3.5 px-3">
                        {center.stockStatus === 'Good' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            <Check className="w-3 h-3" /> Adequate Supply
                          </span>
                        )}
                        {center.stockStatus === 'Low' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                            <AlertTriangle className="w-3 h-3 text-amber-600" /> Low Buffer ({center.criticalItemsCount} items)
                          </span>
                        )}
                        {center.stockStatus === 'Critical' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                            <AlertTriangle className="w-3 h-3 text-rose-600" /> Critical Shortage
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3.5 px-4 text-right">
                        <a
                          href={`tel:${center.inChargePhone}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-indigo-300 text-stone-700 hover:text-indigo-700 bg-white text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                        >
                          <Phone className="w-3 h-3" />
                          <span>Call Worker</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ANALYTICS & REPORTS SECTION */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Attendance Trends across different Anganwadis */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-indigo-600" />
                    1. Attendance Rate Comparison Across Anganwadi Centers
                  </h3>
                  <p className="text-xs text-stone-500">
                    Daily percentage of enrolled children present today
                  </p>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Average: {avgAttendance}%
                </span>
              </div>

              {/* Bar comparison visualization */}
              <div className="space-y-3 pt-2">
                {centers.map((center) => (
                  <div key={center.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800 truncate max-w-[200px]">
                        {center.name} ({center.code})
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        {center.attendanceRatePercent}% ({center.presentTodayCount}/{center.totalEnrolledChildren})
                      </span>
                    </div>

                    <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden border border-stone-200 flex">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          center.attendanceRatePercent >= 90
                            ? 'bg-emerald-600'
                            : center.attendanceRatePercent >= 85
                            ? 'bg-teal-500'
                            : 'bg-amber-500'
                        }`}
                        style={{ width: `${center.attendanceRatePercent}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-100">
                <span>Benchmark threshold: 80%</span>
                <span className="text-emerald-700 font-semibold">All centers met minimum attendance</span>
              </div>
            </div>

            {/* Chart 2: Malnutrition / Health Status Breakdown */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-emerald-600" />
                    2. Child Nutritional Status (WHO Standards)
                  </h3>
                  <p className="text-xs text-stone-500">
                    Aggregated percentage across all 248 enrolled children
                  </p>
                </div>
                <span className="text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-full">
                  POSHAN Maah Data
                </span>
              </div>

              {/* Segmented breakdown bar */}
              <div className="space-y-4 pt-3">
                <div className="h-6 w-full rounded-xl overflow-hidden flex border border-stone-200 shadow-inner">
                  <div
                    className="bg-emerald-600 flex items-center justify-center text-[11px] font-bold text-white transition-all"
                    style={{ width: '83%' }}
                    title="Normal / Healthy: 83%"
                  >
                    83% Normal
                  </div>
                  <div
                    className="bg-amber-500 flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ width: '13%' }}
                    title="Moderate Acute Malnutrition: 13%"
                  >
                    13% MAM
                  </div>
                  <div
                    className="bg-rose-600 flex items-center justify-center text-[10px] font-bold text-white transition-all"
                    style={{ width: '4%' }}
                    title="Severe Acute Malnutrition: 4%"
                  >
                    4%
                  </div>
                </div>

                {/* Key indicators */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block mb-1"></span>
                    <div className="font-bold text-emerald-950 text-lg">206</div>
                    <div className="text-[11px] text-emerald-800 font-semibold">Healthy (Green Zone)</div>
                    <p className="text-[10px] text-stone-500 mt-1">Normal height & weight</p>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block mb-1"></span>
                    <div className="font-bold text-amber-950 text-lg">32</div>
                    <div className="text-[11px] text-amber-800 font-semibold">Moderate (MAM)</div>
                    <p className="text-[10px] text-stone-500 mt-1">Supplementary ration given</p>
                  </div>

                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block mb-1"></span>
                    <div className="font-bold text-rose-950 text-lg">10</div>
                    <div className="text-[11px] text-rose-800 font-semibold">Severe (SAM)</div>
                    <p className="text-[10px] text-stone-500 mt-1">Referred to NRC / PHC</p>
                  </div>
                </div>

                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-600">
                  <strong>Supervisor Guidance:</strong> Belgiri center has the highest concentration of MAM cases (22%). Schedule intensive visit with ANM and pediatric specialist this Thursday.
                </div>
              </div>
            </div>
          </div>

          {/* Chart 3: Food & Stock Consumption Rates across centers to prevent shortage */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-amber-600" />
                  3. Food & Stock Consumption Rates Across Centers (Buffer Days Remaining)
                </h3>
                <p className="text-xs text-stone-500">
                  Estimated supply run-out date based on current daily consumption to prevent kitchen stoppages
                </p>
              </div>

              <span className="text-xs text-stone-500 font-medium">
                Warehouse Resupply Target: 10 Days Minimum
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Food Item</span>
                <h4 className="font-bold text-sm text-stone-900 mt-0.5">Fortified Rice</h4>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-stone-500">Buffer Remaining:</span>
                  <span className="font-bold text-amber-700 font-mono text-sm">~4.9 Days (Low)</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '35%' }} />
                </div>
                <p className="text-[10px] text-stone-500 mt-2">
                  Daily Burn: <strong>58 kg</strong> across all 8 centers
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Food Item</span>
                <h4 className="font-bold text-sm text-stone-900 mt-0.5">Nutri-Millets (Ragi/Bajra)</h4>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-stone-500">Buffer Remaining:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">~16.2 Days (Safe)</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '80%' }} />
                </div>
                <p className="text-[10px] text-stone-500 mt-2">
                  Daily Burn: <strong>26 kg</strong> across all 8 centers
                </p>
              </div>

              <div className="p-4 rounded-xl border border-stone-200 bg-stone-50">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">Food Item</span>
                <h4 className="font-bold text-sm text-stone-900 mt-0.5">Lentils / Pulses (Dal)</h4>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-stone-500">Buffer Remaining:</span>
                  <span className="font-bold text-emerald-700 font-mono text-sm">~11.5 Days (Safe)</span>
                </div>
                <div className="w-full h-2 bg-stone-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-emerald-600 rounded-full" style={{ width: '65%' }} />
                </div>
                <p className="text-[10px] text-stone-500 mt-2">
                  Daily Burn: <strong>22 kg</strong> across all 8 centers
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-300 bg-rose-50/60 ring-2 ring-rose-400/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">Medical Item</span>
                <h4 className="font-bold text-sm text-rose-950 mt-0.5">Milk Powder & IFA Syrup</h4>
                <div className="mt-3 flex items-baseline justify-between text-xs">
                  <span className="text-rose-800">Buffer Remaining:</span>
                  <span className="font-bold text-rose-700 font-mono text-sm">~3.2 Days (Critical)</span>
                </div>
                <div className="w-full h-2 bg-rose-200 rounded-full mt-1.5 overflow-hidden">
                  <div className="h-full bg-rose-600 rounded-full" style={{ width: '22%' }} />
                </div>
                <p className="text-[10px] text-rose-800 mt-2">
                  Belgiri & Rampur centers require emergency dispatch
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STOCK REQUISITION REVIEW */}
      {activeTab === 'requisitions' && (
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                <Package className="w-4 h-4 text-amber-600" />
                Anganwadi Center Supply Indents & Requisitions
              </h3>
              <p className="text-xs text-stone-500">
                Review and approve replenishment requests submitted by Anganwadi workers
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {requisitions.map((req) => (
              <div
                key={req.id}
                className={`p-4 rounded-2xl border transition-all ${
                  req.status === 'Pending'
                    ? 'bg-amber-50/60 border-amber-300'
                    : 'bg-stone-50 border-stone-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        {req.itemName} • {req.quantityRequested} {req.unit}
                      </span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        req.urgency === 'Emergency'
                          ? 'bg-rose-600 text-white'
                          : req.urgency === 'High'
                          ? 'bg-amber-500 text-white'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {req.urgency} Urgency
                      </span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        req.status === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-900 font-bold'
                      }`}>
                        Status: {req.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-600 mt-1">
                      Center: <strong>{req.centerName}</strong> ({req.centerId}) • Requested on: {req.dateRequested}
                    </div>

                    <p className="text-xs text-stone-600 mt-2 bg-white/80 p-2 rounded-xl border border-stone-200">
                      <strong>Worker Reason:</strong> "{req.reason}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {req.status === 'Pending' ? (
                      <button
                        onClick={() => onApproveRequisition(req.id)}
                        className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-xs"
                      >
                        <Check className="w-4 h-4" />
                        <span>Approve & Dispatch Quota</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
                        <CheckCircle2 className="w-4 h-4" /> Approved for Dispatch
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
