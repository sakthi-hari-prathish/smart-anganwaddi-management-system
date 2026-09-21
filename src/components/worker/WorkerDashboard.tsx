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
  Sparkles,
  Layers,
  Thermometer,
  ShieldCheck,
  Send
} from 'lucide-react';
import { Child, StockItem, StockUsageLog } from '../../types';
import { LogDailyUsageModal } from '../modals/LogDailyUsageModal';
import { RequestStockModal } from '../modals/RequestStockModal';
import { ChildCareModal } from '../modals/ChildCareModal';

interface WorkerDashboardProps {
  childrenList: Child[];
  stockItems: StockItem[];
  usageLogs: StockUsageLog[];
  onUpdateChild: (child: Child) => void;
  onLogStockUsage: (stockId: string, quantity: number, purpose: string) => void;
  onRequestStock: (itemName: string, quantity: number, unit: string, urgency: 'Normal' | 'High' | 'Emergency', reason: string) => void;
}

export const WorkerDashboard: React.FC<WorkerDashboardProps> = ({
  childrenList,
  stockItems,
  usageLogs,
  onUpdateChild,
  onLogStockUsage,
  onRequestStock,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'children'>('inventory');
  
  // Modals state
  const [showLogUsageModal, setShowLogUsageModal] = useState(false);
  const [showRequestStockModal, setShowRequestStockModal] = useState(false);
  const [selectedChildForEdit, setSelectedChildForEdit] = useState<Child | null>(null);

  // Search & Filters for children
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState<'All' | 'Present' | 'Absent' | 'Unmarked'>('All');
  const [nutritionFilter, setNutritionFilter] = useState<'All' | 'Normal' | 'Underweight'>('All');

  // Filter for stock categories
  const [stockCategoryFilter, setStockCategoryFilter] = useState<string>('All');

  // Calculate metrics
  const lowStockItems = stockItems.filter((item) => item.currentlyAvailable <= item.thresholdLowStock);
  const presentCount = childrenList.filter((c) => c.attendanceToday === 'Present').length;
  const absentCount = childrenList.filter((c) => c.attendanceToday === 'Absent').length;
  const mealsLoggedCount = childrenList.filter(
    (c) => c.foodIntakeToday.morningSnack !== 'Pending' && c.foodIntakeToday.lunch !== 'Pending'
  ).length;

  // Filter children
  const filteredChildren = childrenList.filter((child) => {
    const matchesSearch =
      child.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      child.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAttendance = attendanceFilter === 'All' || child.attendanceToday === attendanceFilter;
    const latestGrowth = child.growthHistory[child.growthHistory.length - 1];
    const matchesNutrition =
      nutritionFilter === 'All' ||
      (nutritionFilter === 'Normal' && latestGrowth?.whoCategory === 'Normal') ||
      (nutritionFilter === 'Underweight' && latestGrowth?.whoCategory !== 'Normal');

    return matchesSearch && matchesAttendance && matchesNutrition;
  });

  // Filter stocks
  const filteredStocks = stockItems.filter(
    (item) => stockCategoryFilter === 'All' || item.category === stockCategoryFilter
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Worker Header & Quick Center Summary Card */}
      <section className="bg-gradient-to-br from-emerald-800 via-teal-900 to-stone-900 text-white p-5 sm:p-6 rounded-3xl shadow-sm border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              👩‍🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold uppercase tracking-wider">
                  Anganwadi Center In-Charge
                </span>
                <span className="text-xs text-stone-300">#AW-101</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-serif mt-1">
                Sunita Devi • Rampur Main Center (#12)
              </h2>
              <p className="text-xs text-emerald-200/90 mt-0.5">
                Sector 4, Rampur Gram Panchayat • CDPO Supervised Unit
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center">
            <div className="px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Enrolled</span>
              <span className="text-xl font-bold text-white">{childrenList.length}</span>
            </div>
            <div className="px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Present</span>
              <span className="text-xl font-bold text-emerald-300">{presentCount}</span>
            </div>
            <div className="px-3 border-r border-white/10">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Meals Logged</span>
              <span className="text-xl font-bold text-amber-300">{mealsLoggedCount}</span>
            </div>
            <div className="px-3">
              <span className="text-[10px] uppercase font-bold text-emerald-200 block">Stock Alerts</span>
              <span className={`text-xl font-bold ${lowStockItems.length > 0 ? 'text-rose-400' : 'text-emerald-300'}`}>
                {lowStockItems.length}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs Switcher for Worker */}
      <div className="border-b border-stone-200 flex gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'inventory'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Tab 1: Inventory & Stock Management</span>
          {lowStockItems.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold border border-rose-200">
              {lowStockItems.length} Low Stock
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('children')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'children'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Tab 2: Individual Child Profile & Health Log</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-700 font-bold">
            {childrenList.length} Children
          </span>
        </button>
      </div>

      {/* TAB 1: INVENTORY & STOCK MANAGEMENT */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          {/* Low Stock Warning Alert Banner (if any) */}
          {lowStockItems.length > 0 && (
            <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/10 to-amber-500/15 border-2 border-amber-300 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500 text-white shrink-0 mt-0.5 shadow-xs">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-amber-950">
                    Low Stock Supply Alert: {lowStockItems.length} item(s) below reserve buffer
                  </h3>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Items: {lowStockItems.map((i) => `${i.name} (${i.currentlyAvailable} ${i.unit} left)`).join(', ')}.
                    Submit a stock request to the CDPO supervisor immediately to avoid kitchen disruption.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => setShowRequestStockModal(true)}
                  className="px-4 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer shadow-xs"
                >
                  Request Supply Indent Now
                </button>
              </div>
            </div>
          )}

          {/* Action Toolbar & Category Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
            <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-xs font-bold text-stone-400 uppercase tracking-wider mr-1">
                Category:
              </span>
              {['All', 'Food Grains', 'Dairy & Nutrition', 'Medical', 'Educational Supplies'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setStockCategoryFilter(cat)}
                  className={`text-xs px-3 py-1.5 rounded-xl font-semibold transition-all cursor-pointer whitespace-nowrap ${
                    stockCategoryFilter === cat
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLogUsageModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <MinusCircle className="w-4 h-4 text-emerald-700" />
                <span>Log Daily Usage</span>
              </button>

              <button
                onClick={() => setShowRequestStockModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-amber-700 hover:bg-amber-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Request New Stock</span>
              </button>
            </div>
          </div>

          {/* Stock Cards Grid (Rice, Millets, Pulses, Milk Powder, Prescribed Medicines, Educational Supplies) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStocks.map((item) => {
              const isLow = item.currentlyAvailable <= item.thresholdLowStock;
              const bufferDaysRemaining = (item.currentlyAvailable / (item.dailyConsumptionRate || 1)).toFixed(1);
              const percentRemaining = Math.min(100, Math.round((item.currentlyAvailable / item.totalReceived) * 100));

              return (
                <div
                  key={item.id}
                  className={`bg-white rounded-2xl p-5 border transition-all shadow-xs flex flex-col justify-between ${
                    isLow ? 'border-amber-300 ring-2 ring-amber-400/20' : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                          {item.category}
                        </span>
                        <h3 className="text-sm font-bold text-stone-900 mt-0.5 line-clamp-1">
                          {item.name}
                        </h3>
                      </div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          isLow
                            ? 'bg-amber-100 text-amber-800 border-amber-300 animate-pulse'
                            : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        }`}
                      >
                        {isLow ? 'Low Stock' : 'Good Supply'}
                      </span>
                    </div>

                    {/* Progress Bar of Available vs Total Received */}
                    <div className="mt-4">
                      <div className="flex items-baseline justify-between text-xs mb-1.5">
                        <span className="text-stone-500 font-medium">Currently Available:</span>
                        <span className="text-stone-900 font-extrabold text-base">
                          {item.currentlyAvailable} <span className="text-xs font-normal text-stone-500">{item.unit}</span>
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden border border-stone-200">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            isLow ? 'bg-amber-500' : 'bg-emerald-600'
                          }`}
                          style={{ width: `${percentRemaining}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-400 mt-1">
                        <span>Total Received: {item.totalReceived} {item.unit}</span>
                        <span>{percentRemaining}% left</span>
                      </div>
                    </div>

                    {/* Metrics List */}
                    <div className="mt-4 pt-3 border-t border-stone-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Daily Consumption Rate:</span>
                        <span className="font-semibold text-stone-800">
                          {item.dailyConsumptionRate} {item.unit}/day
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Estimated Buffer Left:</span>
                        <span className={`font-bold ${isLow ? 'text-amber-700' : 'text-emerald-700'}`}>
                          ~{bufferDaysRemaining} days remaining
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-stone-500">Expiry Date:</span>
                        <span className="font-mono text-stone-700 font-medium">{item.expiryDate}</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-stone-400">
                        <span>Batch: {item.batchNumber}</span>
                        <span>Updated: {item.lastUpdated}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card footer action */}
                  <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-[11px] text-stone-400 truncate max-w-[150px]">
                      {item.supplier}
                    </span>
                    <button
                      onClick={() => setShowLogUsageModal(true)}
                      className="text-xs font-bold text-emerald-700 hover:text-emerald-800 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <span>Log Usage</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recent Usage Log History */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h3 className="text-sm font-bold text-stone-900 mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" />
              Recent Consumption Entries Logged Today
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Item Name</th>
                    <th className="py-2.5 px-3">Quantity Deducted</th>
                    <th className="py-2.5 px-3">Purpose & Details</th>
                    <th className="py-2.5 px-3">Logged By</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {usageLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-stone-50/50">
                      <td className="py-2.5 px-3 font-semibold text-stone-800">{log.stockItemName}</td>
                      <td className="py-2.5 px-3 font-mono font-bold text-amber-700">
                        -{log.quantityUsed} {log.unit}
                      </td>
                      <td className="py-2.5 px-3 text-stone-600">{log.purpose}</td>
                      <td className="py-2.5 px-3 text-stone-500">{log.loggedBy}</td>
                      <td className="py-2.5 px-3 text-stone-400 font-mono text-[11px]">{log.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: INDIVIDUAL CHILD PROFILE & HEALTH LOG */}
      {activeTab === 'children' && (
        <div className="space-y-6">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              {/* Search box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-3 text-stone-400" />
                <input
                  type="text"
                  placeholder="Search by child or parent name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
                <span className="text-xs font-semibold text-stone-500 flex items-center gap-1">
                  <Filter className="w-3.5 h-3.5" /> Attendance:
                </span>
                {(['All', 'Present', 'Absent'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setAttendanceFilter(filter)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      attendanceFilter === filter
                        ? 'bg-emerald-700 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}

                <span className="text-xs font-semibold text-stone-500 ml-2">WHO Status:</span>
                {(['All', 'Normal', 'Underweight'] as const).map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setNutritionFilter(filter)}
                    className={`text-xs px-2.5 py-1 rounded-lg font-medium cursor-pointer transition-colors ${
                      nutritionFilter === filter
                        ? 'bg-amber-700 text-white shadow-2xs'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Directory of Children Table & Cards */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-stone-900">
                  Enrolled Children Registry ({filteredChildren.length} of {childrenList.length})
                </h3>
                <p className="text-xs text-stone-500">
                  Click "Update Daily Log" to record attendance, nutrition intake, temperature, and medicine.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-semibold uppercase tracking-wider text-[10px] border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">Child Details</th>
                    <th className="py-3 px-3">Age & Blood</th>
                    <th className="py-3 px-3">Today's Attendance</th>
                    <th className="py-3 px-3">Meal Intake</th>
                    <th className="py-3 px-3">Temperature & Health</th>
                    <th className="py-3 px-3">Medicine Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredChildren.map((child) => {
                    const isPresent = child.attendanceToday === 'Present';
                    const hasFever = child.healthToday.temperatureF > 99.0;
                    const latestGrowth = child.growthHistory[child.growthHistory.length - 1];

                    return (
                      <tr key={child.id} className="hover:bg-stone-50/70 transition-colors">
                        {/* Child Details */}
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                              {child.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-stone-900 text-xs sm:text-sm">
                                {child.name}
                              </div>
                              <div className="text-[11px] text-stone-500">
                                Parent: {child.parentName}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Age & Blood */}
                        <td className="py-3 px-3">
                          <div className="font-medium text-stone-800">{child.age}</div>
                          <span className="text-[10px] text-stone-500 font-mono">
                            {child.gender} • {child.bloodGroup}
                          </span>
                        </td>

                        {/* Attendance Toggle */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            {isPresent ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Present
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                <XCircle className="w-3 h-3 text-rose-600" /> Absent
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Meal Intake */}
                        <td className="py-3 px-3">
                          <div className="space-y-0.5 text-[11px]">
                            <div className="flex items-center gap-1 text-stone-700">
                              <span className="text-stone-400">Snack:</span>
                              <span className="font-semibold">{child.foodIntakeToday.morningSnack}</span>
                            </div>
                            <div className="flex items-center gap-1 text-stone-700">
                              <span className="text-stone-400">Lunch:</span>
                              <span className="font-semibold">{child.foodIntakeToday.lunch}</span>
                            </div>
                          </div>
                        </td>

                        {/* Temperature & Health */}
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1.5">
                            <Thermometer className={`w-3.5 h-3.5 ${hasFever ? 'text-rose-500' : 'text-emerald-600'}`} />
                            <span className={`font-mono text-xs font-semibold ${hasFever ? 'text-rose-600' : 'text-stone-800'}`}>
                              {child.healthToday.temperatureF}°F
                            </span>
                          </div>
                          <p className="text-[10px] text-stone-500 truncate max-w-[140px] mt-0.5">
                            {child.healthToday.observations}
                          </p>
                        </td>

                        {/* Medicine */}
                        <td className="py-3 px-3">
                          {child.medications && child.medications.length > 0 ? (
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              child.healthToday.medicationAdministered
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {child.healthToday.medicationAdministered ? 'Administered' : 'Pending'}
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[10px]">None required</span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setSelectedChildForEdit(child)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Update Daily Log</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
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

      <ChildCareModal
        isOpen={selectedChildForEdit !== null}
        onClose={() => setSelectedChildForEdit(null)}
        child={selectedChildForEdit}
        onSave={onUpdateChild}
      />
    </div>
  );
};
