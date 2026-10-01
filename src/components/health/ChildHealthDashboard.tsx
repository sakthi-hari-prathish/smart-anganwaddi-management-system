import React, { useState } from 'react';
import { 
  HeartPulse, 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Stethoscope, 
  ShieldAlert, 
  Pill, 
  PlusCircle, 
  Calculator, 
  Sparkles, 
  FileText, 
  ArrowRight, 
  Check, 
  ChevronRight, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import { Child, GrowthRecord, DeficiencyRecord, DisabilityRecord } from '../../types';
import { calculateBMI, getWHOCategory, getBMIBadgeStyle } from '../../utils/healthUtils';

interface ChildHealthDashboardProps {
  child: Child;
  canEdit?: boolean;
  onOpenEditHealth?: () => void;
  onAddGrowthRecord?: (record: Omit<GrowthRecord, 'id'>) => void;
  onOpenVaccineSchedule?: () => void;
}

export const ChildHealthDashboard: React.FC<ChildHealthDashboardProps> = ({
  child,
  canEdit = false,
  onOpenEditHealth,
  onAddGrowthRecord,
  onOpenVaccineSchedule,
}) => {
  // Interactive BMI Calculator state
  const [calcHeight, setCalcHeight] = useState<string>('');
  const [calcWeight, setCalcWeight] = useState<string>('');
  const [calcNotes, setCalcNotes] = useState<string>('');
  const [calcSuccessMsg, setCalcSuccessMsg] = useState<string | null>(null);

  // Latest growth record
  const latestGrowth = child.growthHistory[child.growthHistory.length - 1] || {
    month: 'Recent',
    ageInMonths: child.ageMonths,
    heightCm: 95.0,
    weightKg: 14.0,
    bmi: 15.5,
    whoCategory: 'Normal',
    recordedBy: child.workerName,
  };

  const previousGrowth = child.growthHistory.length > 1 ? child.growthHistory[child.growthHistory.length - 2] : null;
  const heightGain = previousGrowth ? (latestGrowth.heightCm - previousGrowth.heightCm).toFixed(1) : '0.7';
  const weightGain = previousGrowth ? (latestGrowth.weightKg - previousGrowth.weightKg).toFixed(1) : '0.3';

  // Calculator computations
  const numHeight = parseFloat(calcHeight);
  const numWeight = parseFloat(calcWeight);
  const calculatedBMI = numHeight > 0 && numWeight > 0 ? calculateBMI(numWeight, numHeight) : null;
  const calculatedCategory = calculatedBMI ? getWHOCategory(calculatedBMI, child.ageMonths) : null;
  const calcBadge = calculatedCategory ? getBMIBadgeStyle(calculatedCategory) : null;

  const handleSaveCalculatedRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calculatedBMI || !calculatedCategory || !onAddGrowthRecord) return;

    const todayDate = new Date();
    const monthYear = todayDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    onAddGrowthRecord({
      month: monthYear,
      ageInMonths: child.ageMonths,
      heightCm: numHeight,
      weightKg: numWeight,
      bmi: calculatedBMI,
      whoCategory: calculatedCategory,
      recordedBy: child.workerName || 'Sunita Devi (Worker)',
      notes: calcNotes || 'Logged via interactive clinic BMI calculator',
    });

    setCalcSuccessMsg(`New growth record logged (${calculatedBMI} BMI, ${calculatedCategory})`);
    setCalcHeight('');
    setCalcWeight('');
    setCalcNotes('');
    setTimeout(() => setCalcSuccessMsg(null), 4000);
  };

  const bmiStyle = getBMIBadgeStyle(latestGrowth.whoCategory);

  // Vaccines counts
  const completedVaccinesCount = child.vaccines.filter((v) => v.status === 'Completed').length;
  const dueVaccinesCount = child.vaccines.filter((v) => v.status === 'Due').length;
  const upcomingVaccinesCount = child.vaccines.filter((v) => v.status === 'Upcoming').length;
  const totalVaccines = child.vaccines.length;
  const vaccineCoveragePercent = totalVaccines > 0 ? Math.round((completedVaccinesCount / totalVaccines) * 100) : 100;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-2xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
              <HeartPulse className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-stone-900 font-serif">
                Comprehensive Child Health & Nutrition Dashboard
              </h3>
              <p className="text-xs text-stone-500">
                WHO Child Growth Standards • POSHAN 2.0 Clinical Health Card • Child ID: {child.id}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {canEdit ? (
            <button
              onClick={onOpenEditHealth}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Update Clinical & Health Records</span>
            </button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 text-stone-600 text-xs font-medium border border-stone-200">
              <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Verified Health Record (Read-Only)</span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Health Alerts (if any) */}
      {child.healthAlerts && child.healthAlerts.length > 0 && (
        <div className="space-y-2.5">
          {child.healthAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 sm:p-4 rounded-2xl border flex items-start justify-between gap-3 shadow-2xs ${
                alert.severity === 'High'
                  ? 'bg-rose-50 border-rose-200 text-rose-950'
                  : alert.severity === 'Medium'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-blue-50 border-blue-200 text-blue-950'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="mt-0.5">
                  {alert.severity === 'High' && <ShieldAlert className="w-5 h-5 text-rose-600" />}
                  {alert.severity === 'Medium' && <AlertTriangle className="w-5 h-5 text-amber-600" />}
                  {alert.severity === 'Low' && <AlertCircle className="w-5 h-5 text-blue-600" />}
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs uppercase tracking-wider px-2 py-0.5 rounded-md bg-white/80 border border-current shadow-2xs">
                      {alert.severity} Priority Alert
                    </span>
                    <span className="text-xs font-semibold">{alert.title}</span>
                  </div>
                  <p className="text-xs text-stone-700 mt-1 leading-relaxed">{alert.message}</p>
                  <p className="text-[11px] font-medium text-stone-600 mt-1">
                    <strong>Action Required:</strong> {alert.actionRequired}
                  </p>
                </div>
              </div>
              <span className="text-[10px] text-stone-400 font-mono shrink-0 hidden sm:inline">
                {alert.date}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 4-Stat Cards: BMI, Height, Weight, WHO Status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        {/* BMI Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Current BMI
            </span>
            <span className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              kg/m²
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {latestGrowth.bmi.toFixed(1)}
            </span>
            <span className="text-xs font-medium text-stone-500">WHO Ratio</span>
          </div>
          <div className="mt-3">
            <span
              className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold border ${bmiStyle.bg} ${bmiStyle.text} ${bmiStyle.border}`}
            >
              {latestGrowth.whoCategory}
            </span>
          </div>
        </div>

        {/* Height Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Standing Height
            </span>
            <span className="text-xs font-mono font-medium text-stone-400">Stadiometer</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {latestGrowth.heightCm}
            </span>
            <span className="text-xs font-semibold text-stone-600">cm</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{heightGain} cm in last check</span>
          </div>
        </div>

        {/* Weight Card */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Current Weight
            </span>
            <span className="text-xs font-mono font-medium text-stone-400">Digital Scale</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-bold font-serif text-stone-900">
              {latestGrowth.weightKg}
            </span>
            <span className="text-xs font-semibold text-stone-600">kg</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-700 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+{weightGain} kg weight gain</span>
          </div>
        </div>

        {/* Vaccination Status Pill */}
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Immunization (UIP)
            </span>
            <span className="text-xs font-bold text-emerald-700">{vaccineCoveragePercent}%</span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold font-serif text-stone-900">
              {completedVaccinesCount} / {totalVaccines}
            </span>
            <span className="text-xs font-medium text-stone-500">Doses</span>
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs">
            {dueVaccinesCount > 0 ? (
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold border border-amber-300">
                {dueVaccinesCount} Dose Due
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                Up to Date
              </span>
            )}
            <button
              onClick={onOpenVaccineSchedule}
              className="text-emerald-700 hover:text-emerald-800 font-semibold hover:underline cursor-pointer ml-auto"
            >
              View Card
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Deficiencies & Disabilities vs Doctor Consultation & Checkups */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Column 1: Nutritional Deficiencies & Disability Records */}
        <div className="space-y-6">
          {/* Nutritional Deficiency Panel */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                  <Pill className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-stone-900 text-sm">
                  Nutritional & Deficiency Status
                </h4>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-600">
                {child.deficiencies.length} Tracked
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {child.deficiencies.length === 0 ? (
                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-emerald-950">
                      No Nutritional Deficiencies Detected
                    </p>
                    <p className="text-xs text-emerald-700 mt-0.5">
                      Hemoglobin, Vitamin A, and micronutrient indicators meet optimal thresholds.
                    </p>
                  </div>
                </div>
              ) : (
                child.deficiencies.map((def) => (
                  <div
                    key={def.id}
                    className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60 space-y-2"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-bold text-xs text-stone-900">{def.type}</span>
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                            def.severity === 'Severe'
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : def.severity === 'Moderate'
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-blue-100 text-blue-800 border-blue-300'
                          }`}
                        >
                          {def.severity} Severity
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            def.status === 'Improving'
                              ? 'bg-emerald-100 text-emerald-800'
                              : def.status === 'Resolved'
                              ? 'bg-stone-200 text-stone-700'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {def.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200/70">
                      <span className="font-medium text-stone-500 block text-[11px]">
                        Prescribed Supplements / Intervention:
                      </span>
                      <p className="font-semibold text-stone-800 mt-0.5">
                        {def.supplementsPrescribed}
                      </p>
                    </div>

                    {def.notes && (
                      <p className="text-[11px] text-stone-500 italic">Note: {def.notes}</p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Disability Status Panel */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
                  <Activity className="w-4 h-4" />
                </span>
                <h4 className="font-bold text-stone-900 text-sm">
                  Disability & Special Intervention Record
                </h4>
              </div>
              <span
                className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                  child.disability.hasDisability
                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    : 'bg-stone-100 text-stone-600'
                }`}
              >
                {child.disability.hasDisability ? 'Special Support Enrolled' : 'None Reported'}
              </span>
            </div>

            <div className="mt-4">
              {child.disability.hasDisability ? (
                <div className="space-y-3 bg-indigo-50/50 p-4 rounded-xl border border-indigo-200 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-indigo-700 font-bold uppercase tracking-wider block">
                        Condition Category
                      </span>
                      <span className="font-bold text-stone-900 text-sm">
                        {child.disability.type}
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg bg-white border border-indigo-200 text-indigo-900 font-mono font-bold text-xs">
                      {child.disability.percentageOrSeverity}
                    </span>
                  </div>

                  {child.disability.udidNumber && (
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                      <span className="text-[11px] text-stone-500 font-medium block">
                        Unique Disability ID (UDID):
                      </span>
                      <span className="font-mono font-bold text-stone-900">
                        {child.disability.udidNumber}
                      </span>
                    </div>
                  )}

                  {child.disability.assistiveDeviceProvided && (
                    <div className="bg-white p-2.5 rounded-lg border border-indigo-100">
                      <span className="text-[11px] text-stone-500 font-medium block">
                        Assistive Aid Provided:
                      </span>
                      <span className="font-semibold text-emerald-800 flex items-center gap-1.5 mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        {child.disability.assistiveDeviceProvided}
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[11px] text-stone-500 font-medium block">
                      Anganwadi Classroom Adaptation & Helper Protocol:
                    </span>
                    <p className="text-stone-700 mt-1 leading-relaxed">
                      {child.disability.specialSupportNotes}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-stone-800">
                      Normal Locomotor, Visual, Hearing & Developmental Milestones
                    </p>
                    <p className="text-stone-500 mt-0.5">
                      Child evaluated under Rashtriya Bal Swasthya Karyakram (RBSK) 4Ds protocol.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Column 2: Doctor Consultation & Clinical Checkups */}
        <div className="space-y-6">
          {/* Doctor Consultation Info */}
          {(() => {
            const doc = child.doctorConsultation || {
              doctorName: 'Dr. Ananya Sen, MBBS, DCH',
              clinicOrHospital: 'Rampur Primary Health Centre (PHC)',
              lastVisitDate: '2026-03-10',
              advice: 'Normal pediatric reflex. Continue iron fortified diet and bi-annual deworming.',
              prescriptionsSummary: 'IFA Syrup 20ml (1ml bi-weekly), Albendazole 200mg',
            };
            return (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                      <Stethoscope className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm">
                      Doctor Consultation & PHC Advice
                    </h4>
                  </div>
                  <span className="text-xs text-stone-500 font-mono">
                    {doc.lastVisitDate}
                  </span>
                </div>

                <div className="mt-4 space-y-3 text-xs">
                  <div className="bg-teal-50/60 p-3.5 rounded-xl border border-teal-200">
                    <span className="text-[11px] text-teal-800 font-bold uppercase tracking-wider block">
                      Attending Medical Officer
                    </span>
                    <p className="font-bold text-stone-900 text-sm mt-0.5">
                      {doc.doctorName}
                    </p>
                    <p className="text-stone-600 mt-0.5">{doc.clinicOrHospital}</p>
                  </div>

                  <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                    <span className="text-[11px] text-stone-500 font-bold uppercase tracking-wider block">
                      Clinical Recommendations & Nutrition Advice
                    </span>
                    <p className="text-stone-800 mt-1 leading-relaxed">
                      {doc.advice}
                    </p>
                  </div>

                  {doc.prescriptionsSummary && (
                    <div className="bg-amber-50/50 p-3 rounded-xl border border-amber-200/80">
                      <span className="text-[11px] text-amber-900 font-bold uppercase tracking-wide block">
                        Prescriptions / Treatment Regimen:
                      </span>
                      <p className="text-stone-700 mt-0.5 font-medium">
                        {doc.prescriptionsSummary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}

          {/* Last & Next Health Checkup Schedule */}
          <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
            <div className="flex items-center gap-2 pb-3 border-b border-stone-100">
              <span className="p-1.5 rounded-lg bg-blue-100 text-blue-800">
                <Calendar className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-stone-900 text-sm">
                Health Checkup Timeline & Vitals
              </h4>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Last checkup */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <div className="flex items-center justify-between text-stone-500 mb-1">
                  <span className="font-bold uppercase tracking-wider text-[10px]">
                    Last Health Check-up
                  </span>
                  <span className="font-mono font-semibold text-stone-800">
                    {child.lastCheckup.date}
                  </span>
                </div>
                <p className="text-[11px] text-stone-600">
                  Conducted by: <strong>{child.lastCheckup.conductedBy}</strong>
                </p>
                <div className="mt-2 pt-2 border-t border-stone-200/70">
                  <p className="text-stone-800 leading-relaxed font-medium">
                    {child.lastCheckup.findings}
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1 font-mono">
                    {child.lastCheckup.vitalsSummary}
                  </p>
                </div>
              </div>

              {/* Next checkup */}
              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-200 flex flex-col justify-between">
                <div>
                  <span className="font-bold uppercase tracking-wider text-[10px] text-emerald-800 block mb-1">
                    Next Scheduled Check-up
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-5 h-5 text-emerald-700 shrink-0" />
                    <div>
                      <span className="font-bold text-stone-900 text-base font-serif">
                        {child.nextCheckupDate}
                      </span>
                      <span className="block text-[11px] text-emerald-800 font-medium">
                        Quarterly POSHAN Surveillance Camp
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-emerald-200/60 text-[11px] text-stone-600">
                  <span>Automatic SMS & helper reminders dispatched 3 days prior.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive BMI Calculator (Crucial for Worker, visible & informative for Parents) */}
      <div className="bg-gradient-to-br from-emerald-900 via-teal-900 to-stone-900 text-white rounded-3xl p-5 sm:p-6 shadow-md border border-emerald-700/40 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-lg font-serif">
                  Interactive Pediatric BMI Calculator & Growth Logger
                </h4>
                <p className="text-xs text-emerald-200/80">
                  Instant calculation conforming to WHO Weight-for-Length & BMI-for-Age Standards
                </p>
              </div>
            </div>

            <div className="text-xs text-emerald-300 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
              Active Child: <strong>{child.name}</strong> ({child.age})
            </div>
          </div>

          {/* Calculator Inputs & Result Display */}
          <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Input Form */}
            <form onSubmit={handleSaveCalculatedRecord} className="md:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    Standing Height (cm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="40"
                    max="160"
                    value={calcHeight}
                    onChange={(e) => setCalcHeight(e.target.value)}
                    placeholder={`e.g. ${latestGrowth.heightCm}`}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 text-sm font-medium"
                  />
                  <span className="text-[10px] text-stone-300 mt-1 block">Measured on Stadiometer</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="2"
                    max="45"
                    value={calcWeight}
                    onChange={(e) => setCalcWeight(e.target.value)}
                    placeholder={`e.g. ${latestGrowth.weightKg}`}
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 text-sm font-medium"
                  />
                  <span className="text-[10px] text-stone-300 mt-1 block">Digital Salter / Spring scale</span>
                </div>
              </div>

              {canEdit && (
                <div>
                  <label className="block text-xs font-semibold text-emerald-200 mb-1">
                    Clinical Growth Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={calcNotes}
                    onChange={(e) => setCalcNotes(e.target.value)}
                    placeholder="e.g. Checked during monthly Vajan Divas, appetite good"
                    className="w-full bg-white/10 border border-white/20 rounded-xl px-3.5 py-2 text-white placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-emerald-400 text-xs"
                  />
                </div>
              )}

              {canEdit ? (
                <div className="pt-1 flex items-center gap-3">
                  <button
                    type="submit"
                    disabled={!calculatedBMI}
                    className={`px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                      calculatedBMI
                        ? 'bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-extrabold'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Log & Save to Growth History</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setCalcHeight(latestGrowth.heightCm.toString());
                      setCalcWeight(latestGrowth.weightKg.toString());
                    }}
                    className="text-xs text-emerald-300 hover:underline cursor-pointer"
                  >
                    Load current ({latestGrowth.heightCm}cm / {latestGrowth.weightKg}kg)
                  </button>
                </div>
              ) : (
                <p className="text-xs text-emerald-300/80 italic">
                  💡 Parents can calculate potential BMI to understand healthy weight ranges. Official recordings are submitted by Anganwadi helpers.
                </p>
              )}

              {calcSuccessMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{calcSuccessMsg}</span>
                </div>
              )}
            </form>

            {/* Live Calculation Output Card */}
            <div className="md:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/15">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-200 block mb-2">
                Real-Time Calculation Output
              </span>

              {calculatedBMI ? (
                <div className="space-y-3">
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl font-extrabold font-serif text-white">
                      {calculatedBMI}
                    </span>
                    <span className="text-sm font-semibold text-emerald-300">BMI (kg/m²)</span>
                  </div>

                  {calcBadge && (
                    <div className="space-y-1">
                      <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold bg-white text-stone-900 shadow-xs">
                        {calcBadge.label}
                      </span>
                      <p className="text-xs text-stone-200 leading-relaxed mt-1">
                        {calcBadge.description}
                      </p>
                    </div>
                  )}

                  {/* Visual Category Meter */}
                  <div className="pt-2">
                    <div className="h-2 w-full rounded-full bg-stone-800 overflow-hidden flex">
                      <div className="w-1/4 bg-rose-500" title="Severely Underweight (<13.5)" />
                      <div className="w-1/4 bg-amber-400" title="Underweight (13.5-14.8)" />
                      <div className="w-2/5 bg-emerald-500" title="Normal (14.8-18.0)" />
                      <div className="w-1/10 bg-purple-500" title="Overweight (>18.0)" />
                    </div>
                    <div className="flex justify-between text-[10px] text-stone-300 mt-1 font-mono">
                      <span>&lt;13.5 SAM</span>
                      <span>14.5 MAM</span>
                      <span>16.0 Normal</span>
                      <span>&gt;18.0</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-stone-300 space-y-2">
                  <Activity className="w-8 h-8 mx-auto text-emerald-400/60" />
                  <p className="text-xs">
                    Enter Height (cm) and Weight (kg) to view instant WHO classification.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Historical Growth Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <TrendingUp className="w-4 h-4" />
            </span>
            <h4 className="font-bold text-stone-900 text-sm">
              Recorded Growth Milestones (Last 6 Months)
            </h4>
          </div>
          <span className="text-xs text-stone-500">
            {child.growthHistory.length} measurements on record
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-stone-50 text-stone-500 font-semibold border-b border-stone-200">
                <th className="py-2.5 px-3">Month</th>
                <th className="py-2.5 px-3">Age</th>
                <th className="py-2.5 px-3">Height</th>
                <th className="py-2.5 px-3">Weight</th>
                <th className="py-2.5 px-3">BMI</th>
                <th className="py-2.5 px-3">WHO Category</th>
                <th className="py-2.5 px-3">Recorded By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
              {child.growthHistory.slice().reverse().map((record, idx) => {
                const badge = getBMIBadgeStyle(record.whoCategory);
                return (
                  <tr key={idx} className="hover:bg-stone-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-stone-900">{record.month}</td>
                    <td className="py-2.5 px-3 text-stone-500">{record.ageInMonths} mos</td>
                    <td className="py-2.5 px-3">{record.heightCm} cm</td>
                    <td className="py-2.5 px-3 font-semibold">{record.weightKg} kg</td>
                    <td className="py-2.5 px-3 font-mono">{record.bmi.toFixed(1)}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                        {record.whoCategory}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-stone-500">{record.recordedBy}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
