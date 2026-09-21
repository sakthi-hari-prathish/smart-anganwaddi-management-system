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
  Award
} from 'lucide-react';
import { Child, MealItem, Announcement } from '../../types';
import { DigitalImmunizationCardModal } from '../modals/DigitalImmunizationCardModal';

interface ParentDashboardProps {
  child: Child;
  mealPlan: MealItem[];
  announcements: Announcement[];
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  child,
  mealPlan,
  announcements,
}) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'medical' | 'attendance'>('growth');
  const [showMCPModal, setShowMCPModal] = useState(false);

  // Latest measurements
  const latestGrowth = child.growthHistory[child.growthHistory.length - 1];
  const previousGrowth = child.growthHistory[child.growthHistory.length - 2];
  const weightGain = previousGrowth ? (latestGrowth.weightKg - previousGrowth.weightKg).toFixed(1) : '0.3';
  const heightGain = previousGrowth ? (latestGrowth.heightCm - previousGrowth.heightCm).toFixed(1) : '0.7';

  // Filter announcements relevant to parents
  const parentNotices = announcements.filter((a) => a.targetAudience === 'All' || a.targetAudience === 'Parents');

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. Header: Parent Profile & Child Profile Card */}
      <section className="bg-gradient-to-br from-amber-500/10 via-emerald-500/10 to-teal-500/10 p-4 sm:p-6 rounded-3xl border border-amber-200/80 shadow-xs relative overflow-hidden">
        {/* Subtle decorative background pattern */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-48 h-48 bg-emerald-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Child & Parent Basic Info */}
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-emerald-600 p-0.5 shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center text-3xl">
                  👦
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
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono text-stone-500 bg-stone-100">
                  DOB: {child.dob}
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium text-stone-800">{child.centerName}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Parents: <strong className="text-stone-800">{child.parentName}</strong></span>
                </div>
                <div className="flex items-center gap-1.5 text-stone-500">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{child.parentPhone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Status Badges & Quick Action */}
          <div className="flex flex-wrap items-center gap-3 bg-white/80 backdrop-blur-xs p-3.5 rounded-2xl border border-stone-200 shadow-2xs">
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
                    <span className="text-xs font-bold text-rose-800">Absent Today</span>
                  </>
                )}
              </div>
            </div>

            <div className="border-r border-stone-200 pr-3">
              <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
                Health Checkup Today
              </span>
              <span className="text-xs font-semibold text-stone-800 flex items-center gap-1 mt-0.5">
                <span className="text-emerald-600 font-bold">{child.healthToday.temperatureF}°F</span>
                <span className="text-stone-400 text-[11px]">(Normal)</span>
              </span>
            </div>

            <button
              onClick={() => setShowMCPModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 border border-emerald-300 transition-colors cursor-pointer shadow-2xs ml-auto"
            >
              <Award className="w-3.5 h-3.5 text-emerald-700" />
              <span>Digital MCP Card</span>
            </button>
          </div>
        </div>
      </section>

      {/* Navigation Tabs for Parent */}
      <div className="border-b border-stone-200 flex gap-2 sm:gap-4 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('growth')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'growth'
              ? 'border-emerald-600 text-emerald-800 bg-emerald-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Tab 1: Health & Growth Tracker</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold">
            WHO Standards
          </span>
        </button>

        <button
          onClick={() => setActiveTab('medical')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'medical'
              ? 'border-amber-600 text-amber-900 bg-amber-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Tab 2: Medical & Food Details</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 font-bold">
            Daily Menu
          </span>
        </button>

        <button
          onClick={() => setActiveTab('attendance')}
          className={`flex items-center gap-2 py-3 px-4 font-semibold text-sm rounded-t-xl transition-all border-b-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'attendance'
              ? 'border-teal-600 text-teal-900 bg-teal-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>Tab 3: Announcements & Attendance</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 text-stone-700 font-bold">
            {parentNotices.length} Alerts
          </span>
        </button>
      </div>

      {/* TAB 1: HEALTH & GROWTH TRACKER */}
      {activeTab === 'growth' && (
        <div className="space-y-6">
          {/* Key WHO Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Height Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase font-bold tracking-wider">Height (Stadiometer)</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  +{heightGain} cm this month
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900">{latestGrowth.heightCm}</span>
                <span className="text-stone-500 font-medium">cm</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                <span className="text-stone-600">WHO 50th Percentile: 96.1 cm</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Normal Height
                </span>
              </div>
            </div>

            {/* Weight Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase font-bold tracking-wider">Weight (Electronic Scale)</span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-bold">
                  +{weightGain} kg gain
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900">{latestGrowth.weightKg}</span>
                <span className="text-stone-500 font-medium">kg</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                <span className="text-stone-600">WHO Standard: 14.3 kg</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Healthy Range
                </span>
              </div>
            </div>

            {/* BMI & WHO Category Card */}
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="uppercase font-bold tracking-wider">BMI & Nutritional Grade</span>
                <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  {latestGrowth.whoCategory}
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-stone-900">{latestGrowth.bmi}</span>
                <span className="text-stone-500 font-medium">kg/m²</span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-stone-100">
                <span className="text-stone-600">WHO Z-score: Green Zone</span>
                <span className="text-emerald-700 font-semibold">Normal (Harit)</span>
              </div>
            </div>
          </div>

          {/* WHO Growth Trajectory History Chart / Table */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                  Monthly Growth Progress & WHO Benchmark Trajectory
                </h3>
                <p className="text-xs text-stone-500">
                  Recorded during monthly Vajan Divas by Worker Sunita Devi
                </p>
              </div>

              {/* WHO Indicator Legend */}
              <div className="flex items-center gap-2 text-[11px]">
                <span className="flex items-center gap-1 text-emerald-800 font-medium bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Normal (&gt; -2 SD)
                </span>
                <span className="flex items-center gap-1 text-amber-800 font-medium bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span> Underweight (MAM)
                </span>
                <span className="flex items-center gap-1 text-rose-800 font-medium bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-600"></span> SAM (&lt; -3 SD)
                </span>
              </div>
            </div>

            {/* Growth Visual Curve (Interactive SVG Trajectory) */}
            <div className="bg-stone-50/80 p-4 rounded-xl border border-stone-200">
              <div className="h-44 w-full flex items-end justify-between gap-3 pt-6 px-2">
                {child.growthHistory.map((rec, idx) => {
                  const weightHeightPercent = ((rec.weightKg - 12) / 6) * 100;
                  return (
                    <div key={rec.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] bg-stone-900 text-white px-1.5 py-0.5 rounded shadow whitespace-nowrap mb-1">
                        {rec.weightKg} kg • {rec.heightCm} cm
                      </div>

                      {/* Visual bar with gradient */}
                      <div className="w-full max-w-[36px] bg-stone-200 rounded-t-lg relative flex items-end justify-center overflow-hidden" style={{ height: '75%' }}>
                        <div
                          className="w-full bg-gradient-to-t from-emerald-600 to-teal-400 rounded-t-lg transition-all duration-500 flex items-center justify-center text-[10px] font-bold text-white pb-1"
                          style={{ height: `${Math.min(100, Math.max(25, weightHeightPercent))}%` }}
                        >
                          {rec.weightKg}
                        </div>
                      </div>

                      <div className="text-center">
                        <span className="text-[11px] font-bold text-stone-700 block">{rec.month}</span>
                        <span className="text-[10px] text-stone-400 block">{rec.heightCm} cm</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Data log table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Measurement Month</th>
                    <th className="py-2.5 px-3">Age in Mos</th>
                    <th className="py-2.5 px-3">Height (cm)</th>
                    <th className="py-2.5 px-3">Weight (kg)</th>
                    <th className="py-2.5 px-3">BMI</th>
                    <th className="py-2.5 px-3">WHO Category</th>
                    <th className="py-2.5 px-3">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {child.growthHistory.map((g) => (
                    <tr key={g.month} className="hover:bg-stone-50/60">
                      <td className="py-2.5 px-3 font-semibold text-stone-900">{g.month}</td>
                      <td className="py-2.5 px-3 text-stone-600">{g.ageInMonths} mos</td>
                      <td className="py-2.5 px-3 text-stone-800 font-medium">{g.heightCm} cm</td>
                      <td className="py-2.5 px-3 text-stone-800 font-bold">{g.weightKg} kg</td>
                      <td className="py-2.5 px-3 font-mono text-stone-700">{g.bmi}</td>
                      <td className="py-2.5 px-3">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {g.whoCategory}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">{g.recordedBy}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Vaccination Schedule & History Section */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <ShieldAlert className="w-5 h-5 text-emerald-600" />
                  Universal Immunization Programme (UIP) Record
                </h3>
                <p className="text-xs text-stone-500">
                  Comprehensive tracking of administered, due, and future childhood vaccines
                </p>
              </div>

              <button
                onClick={() => setShowMCPModal(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 transition-colors cursor-pointer shadow-xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>View Full Immunization Passbook</span>
              </button>
            </div>

            {/* Vaccines list with status tags */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {child.vaccines.map((v) => (
                <div
                  key={v.id}
                  className={`p-4 rounded-xl border transition-all ${
                    v.status === 'Completed'
                      ? 'bg-emerald-50/40 border-emerald-200'
                      : v.status === 'Due'
                      ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/20'
                      : 'bg-stone-50 border-stone-200 opacity-80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-stone-900">{v.name}</h4>
                      <p className="text-[11px] text-stone-500 mt-0.5">Target: {v.diseaseTarget}</p>
                      <span className="text-[10px] text-stone-400 block mt-1">Prescribed Age: {v.dueAge}</span>
                    </div>

                    <div>
                      {v.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                        </span>
                      )}
                      {v.status === 'Due' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-white shadow-xs animate-pulse">
                          <AlertCircle className="w-3 h-3" /> Due Now
                        </span>
                      )}
                      {v.status === 'Upcoming' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-200 text-stone-700">
                          <Clock className="w-3 h-3 text-stone-500" /> Upcoming
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px]">
                    {v.status === 'Completed' ? (
                      <span className="text-emerald-800 font-medium">
                        Given on <strong>{v.administeredDate}</strong> (Batch: {v.batchNumber})
                      </span>
                    ) : v.status === 'Due' ? (
                      <span className="text-amber-800 font-semibold">
                        Due Date: <strong>{v.dueDate}</strong> ({v.importantNote || 'At POSHAN Camp'})
                      </span>
                    ) : (
                      <span className="text-stone-500">
                        Scheduled for: <strong>{v.dueDate}</strong>
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MEDICAL & FOOD DETAILS */}
      {activeTab === 'medical' && (
        <div className="space-y-6">
          {/* Daily Nutritional Meal Plan Provided at the Center */}
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Apple className="w-5 h-5 text-amber-600" />
                  Today's Anganwadi Nutritional Meal Plan (Pushtahar)
                </h3>
                <p className="text-xs text-stone-500">
                  Government fortified hot cooked meals and supplementary rations provided at Center #12
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                  Total Daily Energy: ~775 kcal • 25.7g Protein
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {mealPlan.map((meal) => (
                <div
                  key={meal.id}
                  className="bg-stone-50 rounded-2xl p-4 border border-stone-200 hover:border-amber-300 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/70 px-2 py-0.5 rounded-md">
                        {meal.time}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                        {meal.status}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 mt-2.5">{meal.mealName}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{meal.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-stone-200">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="text-stone-500">Calories: <strong>{meal.caloriesKcal} kcal</strong></span>
                      <span className="text-emerald-700 font-semibold">Protein: <strong>{meal.proteinGrams}g</strong></span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {meal.nutrientsHighlighted.map((nut) => (
                        <span key={nut} className="text-[9px] bg-white text-stone-700 px-1.5 py-0.5 rounded border border-stone-200 font-medium">
                          {nut}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Child's actual consumption today recorded by helper */}
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 mt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-emerald-600 text-white shrink-0 mt-0.5">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wider">
                    Today's Recorded Meal Intake for {child.name}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 text-xs text-emerald-900">
                    <div>
                      Morning Snack: <strong>{child.foodIntakeToday.morningSnack} Portion Consumed (100%)</strong>
                    </div>
                    <div>
                      Hot Lunch: <strong>{child.foodIntakeToday.lunch} Portion Consumed (100%)</strong>
                    </div>
                  </div>
                  {child.foodIntakeToday.specialDietNotes && (
                    <p className="text-xs text-emerald-800 mt-2 bg-white/70 p-2 rounded-lg border border-emerald-200">
                      <strong>Worker Note:</strong> "{child.foodIntakeToday.specialDietNotes}"
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Medical History, Allergies, Prescriptions & Daily Dosage Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allergies & Medical Conditions */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-rose-600" />
                Allergies & Medical Health Profile
              </h3>

              <div className="space-y-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-rose-700 block mb-1">
                    Known Allergies
                  </label>
                  <div className="space-y-1.5">
                    {child.allergies.map((all, i) => (
                      <div key={i} className="text-xs p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        <span>{all}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 block mb-1">
                    General Health Conditions
                  </label>
                  <div className="space-y-1.5">
                    {child.medicalConditions.map((cond, i) => (
                      <div key={i} className="text-xs p-2.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                        <span>{cond}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-stone-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-500" />
                  <span>To update medical conditions or report an allergy, please inform Worker Sunita Devi.</span>
                </div>
              </div>
            </div>

            {/* Doctor's Prescribed Medicines & Helper Dosage Logs */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Pill className="w-5 h-5 text-emerald-600" />
                  Active Prescriptions & Helper Dosage Logs
                </h3>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                  Administered at Center
                </span>
              </div>

              <div className="space-y-3">
                {child.medications.map((med) => (
                  <div key={med.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/70 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-stone-900">{med.medicineName}</h4>
                        <p className="text-[11px] text-stone-600 mt-0.5">
                          Dosage: <strong>{med.dosage}</strong> • Frequency: {med.frequency}
                        </p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        med.statusToday === 'Administered'
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}>
                        {med.statusToday === 'Administered' ? '✓ Given Today' : 'Pending'}
                      </span>
                    </div>

                    <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-stone-200">
                      <p><strong>Instructions:</strong> {med.instructions}</p>
                      <p className="mt-1 text-stone-500"><strong>Prescribed by:</strong> {med.prescribedBy}</p>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 text-stone-500">
                      <span>Logged by: <strong>{med.recordedByHelper}</strong></span>
                      {med.timeAdministeredToday && (
                        <span className="font-mono text-emerald-700 font-bold">
                          Administered at {med.timeAdministeredToday}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS & ATTENDANCE */}
      {activeTab === 'attendance' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Monthly Attendance Calendar */}
            <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    Monthly Attendance Calendar • September 2026
                  </h3>
                  <p className="text-xs text-stone-500">
                    Daily check-in and attendance recorded at Center #12
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-stone-400 block">Monthly Rate</span>
                    <span className="text-base font-extrabold text-emerald-700">93.3%</span>
                  </div>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                    Regular
                  </span>
                </div>
              </div>

              {/* Attendance Legend */}
              <div className="flex flex-wrap items-center gap-3 text-xs pt-1">
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-3 h-3 rounded-md bg-emerald-600"></span> Present (14 days)
                </span>
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-3 h-3 rounded-md bg-rose-600"></span> Absent (1 day)
                </span>
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-3 h-3 rounded-md bg-amber-500"></span> Center Holiday (1 day)
                </span>
                <span className="flex items-center gap-1.5 text-stone-700">
                  <span className="w-3 h-3 rounded-md bg-stone-200"></span> Sunday / Weekend
                </span>
              </div>

              {/* Calendar Grid (Days 1 to 30) */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs pt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => (
                  <div key={day} className="font-bold text-stone-400 text-[10px] uppercase py-1">
                    {day}
                  </div>
                ))}

                {/* Day blocks */}
                {Array.from({ length: 30 }).map((_, i) => {
                  const dayNum = i + 1;
                  let bg = 'bg-stone-50 text-stone-400';
                  let label = '';

                  // Simulation based on realistic days
                  if (dayNum % 7 === 6) {
                    bg = 'bg-stone-100 text-stone-400'; // Weekend
                  } else if (dayNum === 9) {
                    bg = 'bg-amber-100 text-amber-900 border border-amber-300 font-bold'; // Holiday
                    label = 'Holiday';
                  } else if (dayNum === 15) {
                    bg = 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'; // Absent
                    label = 'Absent';
                  } else if (dayNum === 21) {
                    bg = 'bg-emerald-600 text-white font-extrabold ring-2 ring-emerald-500/50'; // Today
                    label = 'Today';
                  } else if (dayNum < 21) {
                    bg = 'bg-emerald-100/80 text-emerald-900 border border-emerald-200 font-semibold'; // Present
                  }

                  return (
                    <div
                      key={dayNum}
                      className={`h-12 sm:h-14 rounded-xl flex flex-col items-center justify-center p-1 transition-all ${bg}`}
                    >
                      <span className="text-xs sm:text-sm font-bold">{dayNum}</span>
                      {label && <span className="text-[9px] truncate max-w-full font-medium">{label}</span>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Important Notices from the Center */}
            <div className="bg-white p-5 sm:p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  Notices & Camp Alerts
                </h3>
                <p className="text-xs text-stone-500">
                  Direct notices from Rampur Anganwadi Center
                </p>
              </div>

              <div className="space-y-3">
                {parentNotices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      notice.priority === 'High'
                        ? 'bg-amber-50/80 border-amber-300'
                        : 'bg-stone-50 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        notice.priority === 'High'
                          ? 'bg-amber-200 text-amber-900 font-extrabold'
                          : 'bg-stone-200 text-stone-700'
                      }`}>
                        {notice.category}
                      </span>
                      <span className="text-stone-400 text-[10px] font-medium">{notice.date}</span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 mt-2">{notice.title}</h4>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{notice.description}</p>

                    {notice.location && (
                      <div className="mt-2 text-[10px] text-stone-500 flex items-center gap-1 font-medium">
                        <MapPin className="w-3 h-3 text-emerald-600" />
                        <span>Venue: {notice.location}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Digital MCP Immunization Passbook Modal */}
      <DigitalImmunizationCardModal
        isOpen={showMCPModal}
        onClose={() => setShowMCPModal(false)}
        child={child}
      />
    </div>
  );
};
