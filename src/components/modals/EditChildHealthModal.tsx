import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  HeartPulse, 
  Pill, 
  Activity, 
  Stethoscope, 
  Calendar, 
  ShieldCheck, 
  Plus, 
  Trash2,
  Syringe
} from 'lucide-react';
import { Child, DeficiencyRecord, DisabilityRecord, VaccineRecord } from '../../types';
import { calculateBMI, getWHOCategory } from '../../utils/healthUtils';

interface EditChildHealthModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  onSave: (updatedChild: Child) => void;
}

export const EditChildHealthModal: React.FC<EditChildHealthModalProps> = ({
  isOpen,
  onClose,
  child,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'growth' | 'deficiency' | 'disability' | 'vaccines' | 'doctor'>('growth');

  // Growth form
  const [heightCm, setHeightCm] = useState<number>(95);
  const [weightKg, setWeightKg] = useState<number>(14.5);
  const [growthNotes, setGrowthNotes] = useState<string>('');

  // Deficiencies
  const [deficiencies, setDeficiencies] = useState<DeficiencyRecord[]>([]);
  const [newDefType, setNewDefType] = useState<DeficiencyRecord['type']>('Iron Deficiency (Anemia)');
  const [newDefSeverity, setNewDefSeverity] = useState<DeficiencyRecord['severity']>('Mild');
  const [newDefSupplements, setNewDefSupplements] = useState<string>('');

  // Disability
  const [hasDisability, setHasDisability] = useState<boolean>(false);
  const [disabilityType, setDisabilityType] = useState<DisabilityRecord['type']>('None');
  const [disabilitySeverity, setDisabilitySeverity] = useState<string>('');
  const [udidNumber, setUdidNumber] = useState<string>('');
  const [assistiveDevice, setAssistiveDevice] = useState<string>('');
  const [specialSupportNotes, setSpecialSupportNotes] = useState<string>('');

  // Doctor consultation
  const [doctorName, setDoctorName] = useState<string>('');
  const [clinicName, setClinicName] = useState<string>('');
  const [doctorAdvice, setDoctorAdvice] = useState<string>('');
  const [nextCheckup, setNextCheckup] = useState<string>('');

  // Vaccines
  const [vaccinesList, setVaccinesList] = useState<VaccineRecord[]>([]);

  useEffect(() => {
    if (child) {
      const latest = child.growthHistory[child.growthHistory.length - 1];
      if (latest) {
        setHeightCm(latest.heightCm);
        setWeightKg(latest.weightKg);
      }
      setDeficiencies(child.deficiencies || []);
      setHasDisability(child.disability?.hasDisability || false);
      setDisabilityType(child.disability?.type || 'None');
      setDisabilitySeverity(child.disability?.percentageOrSeverity || '');
      setUdidNumber(child.disability?.udidNumber || '');
      setAssistiveDevice(child.disability?.assistiveDeviceProvided || '');
      setSpecialSupportNotes(child.disability?.specialSupportNotes || '');
      setDoctorName(child.doctorConsultation?.doctorName || '');
      setClinicName(child.doctorConsultation?.clinicOrHospital || '');
      setDoctorAdvice(child.doctorConsultation?.advice || '');
      setNextCheckup(child.nextCheckupDate || '');
      setVaccinesList(child.vaccines || []);
    }
  }, [child]);

  if (!isOpen || !child) return null;

  const handleAddDeficiency = () => {
    if (!newDefSupplements.trim()) return;
    const newDef: DeficiencyRecord = {
      id: `def-${Date.now()}`,
      type: newDefType,
      severity: newDefSeverity,
      diagnosedDate: new Date().toISOString().split('T')[0],
      supplementsPrescribed: newDefSupplements,
      status: 'Active',
      notes: 'Added during routine Anganwadi health review',
    };
    setDeficiencies([...deficiencies, newDef]);
    setNewDefSupplements('');
  };

  const handleRemoveDeficiency = (id: string) => {
    setDeficiencies(deficiencies.filter((d) => d.id !== id));
  };

  const handleToggleVaccine = (vaccineId: string) => {
    setVaccinesList((prev) =>
      prev.map((v) => {
        if (v.id === vaccineId) {
          const isCompleted = v.status === 'Completed';
          return {
            ...v,
            status: isCompleted ? 'Due' : 'Completed',
            administeredDate: isCompleted ? undefined : new Date().toISOString().split('T')[0],
            administeredBy: isCompleted ? undefined : child.workerName,
          };
        }
        return v;
      })
    );
  };

  const handleSaveAll = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if new growth entry needs to be appended
    const latest = child.growthHistory[child.growthHistory.length - 1];
    let updatedGrowthHistory = [...child.growthHistory];

    if (heightCm !== latest?.heightCm || weightKg !== latest?.weightKg) {
      const computedBmi = calculateBMI(weightKg, heightCm);
      const computedCat = getWHOCategory(computedBmi, child.ageMonths);
      const newMonth = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

      updatedGrowthHistory.push({
        date: new Date().toISOString().split('T')[0],
        month: newMonth,
        ageInMonths: child.ageMonths,
        heightCm,
        weightKg,
        bmi: computedBmi,
        whoCategory: computedCat,
        recordedBy: child.workerName || 'Sunita Devi (Worker)',
        notes: growthNotes || 'Updated from Health Management Portal',
      });
    }

    const updatedChild: Child = {
      ...child,
      growthHistory: updatedGrowthHistory,
      deficiencies,
      disability: {
        id: child.disability?.id || `dis-${Date.now()}`,
        hasDisability,
        type: hasDisability ? disabilityType : 'None',
        percentageOrSeverity: hasDisability ? disabilitySeverity || 'Under Evaluation' : 'None',
        udidNumber: hasDisability ? udidNumber : undefined,
        assistiveDeviceProvided: hasDisability ? assistiveDevice : undefined,
        specialSupportNotes: hasDisability
          ? specialSupportNotes
          : 'Screened normal at RBSK clinic.',
      },
      doctorConsultation: {
        doctorName: doctorName || child.doctorConsultation?.doctorName || 'Dr. Ananya Sen',
        clinicOrHospital: clinicName || child.doctorConsultation?.clinicOrHospital || 'Rampur PHC',
        lastVisitDate: new Date().toISOString().split('T')[0],
        advice: doctorAdvice || child.doctorConsultation?.advice || 'Regular checkup',
        prescriptionsSummary: child.doctorConsultation?.prescriptionsSummary || 'Nutritional supplements',
      },
      nextCheckupDate: nextCheckup || child.nextCheckupDate,
      vaccines: vaccinesList,
    };

    onSave(updatedChild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl border border-white/20">
              🩺
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">Update Health Records: {child.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                  {child.id}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Official Clinical Entry • Anganwadi Worker: {child.workerName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 text-xs font-semibold text-stone-600 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('growth')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'growth'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <HeartPulse className="w-3.5 h-3.5" />
            <span>Growth & BMI</span>
          </button>
          <button
            onClick={() => setActiveTab('deficiency')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'deficiency'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            <span>Deficiencies ({deficiencies.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('disability')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'disability'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Disability Status</span>
          </button>
          <button
            onClick={() => setActiveTab('vaccines')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'vaccines'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Syringe className="w-3.5 h-3.5" />
            <span>Vaccines</span>
          </button>
          <button
            onClick={() => setActiveTab('doctor')}
            className={`py-3 px-3 border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'doctor'
                ? 'border-emerald-600 text-emerald-700 bg-white font-bold'
                : 'border-transparent hover:text-stone-900'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Doctor & Checkup</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveAll} className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Growth & BMI Tab */}
          {activeTab === 'growth' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block text-xs">
                  Physical Growth Measurements
                </span>
                <p className="text-emerald-700 text-[11px] mt-0.5">
                  Updating these values will automatically calculate BMI and assign WHO classification.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={heightCm}
                    onChange={(e) => setHeightCm(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={weightKg}
                    onChange={(e) => setWeightKg(parseFloat(e.target.value) || 0)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-bold text-stone-900 text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {heightCm > 0 && weightKg > 0 && (
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 text-[11px] block">Calculated Result:</span>
                    <span className="text-lg font-bold text-stone-900 font-serif">
                      {calculateBMI(weightKg, heightCm)} BMI
                    </span>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 text-xs">
                    {getWHOCategory(calculateBMI(weightKg, heightCm), child.ageMonths)}
                  </span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-stone-700 mb-1">
                  Measurement Notes / Circumstances
                </label>
                <input
                  type="text"
                  value={growthNotes}
                  onChange={(e) => setGrowthNotes(e.target.value)}
                  placeholder="e.g. Measured during monthly Vajan Divas with digital stadiometer"
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* Deficiency Tab */}
          {activeTab === 'deficiency' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200">
                <span className="font-bold text-amber-950 block text-xs">
                  Active Nutritional Deficiencies
                </span>
                <p className="text-stone-600 text-[11px] mt-0.5">
                  Track anemia, vitamin A, zinc, or protein deficiency with prescribed therapeutic supplements.
                </p>
              </div>

              {/* Existing Deficiencies List */}
              <div className="space-y-2">
                {deficiencies.map((def) => (
                  <div
                    key={def.id}
                    className="p-3 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between gap-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-900">{def.type}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                          {def.severity}
                        </span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-100 text-emerald-800 font-semibold">
                          {def.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-600 mt-1">
                        <strong>Supplements:</strong> {def.supplementsPrescribed}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveDeficiency(def.id)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add New Deficiency Sub-form */}
              <div className="p-3.5 bg-stone-50/80 border border-stone-200 rounded-2xl space-y-3">
                <span className="font-bold text-stone-800 block text-xs">
                  Add New Deficiency Diagnosis
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-600 mb-1 font-medium">Deficiency Type</label>
                    <select
                      value={newDefType}
                      onChange={(e) => setNewDefType(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-stone-300 bg-white font-medium"
                    >
                      <option value="Iron Deficiency (Anemia)">Iron Deficiency (Anemia)</option>
                      <option value="Vitamin A Deficiency">Vitamin A Deficiency</option>
                      <option value="Protein Energy Malnutrition (PEM)">Protein Energy Malnutrition (PEM)</option>
                      <option value="Zinc Deficiency">Zinc Deficiency</option>
                      <option value="Iodine Deficiency">Iodine Deficiency</option>
                      <option value="Vitamin D Deficiency">Vitamin D Deficiency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-medium">Severity</label>
                    <select
                      value={newDefSeverity}
                      onChange={(e) => setNewDefSeverity(e.target.value as any)}
                      className="w-full p-2 rounded-xl border border-stone-300 bg-white font-medium"
                    >
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-600 mb-1 font-medium">
                    Prescribed Supplements & Dietary Protocol
                  </label>
                  <input
                    type="text"
                    value={newDefSupplements}
                    onChange={(e) => setNewDefSupplements(e.target.value)}
                    placeholder="e.g. IFA Syrup 1ml bi-weekly + fortified khichdi"
                    className="w-full p-2 rounded-xl border border-stone-300 bg-white text-stone-900"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddDeficiency}
                  disabled={!newDefSupplements.trim()}
                  className="px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Deficiency Record</span>
                </button>
              </div>
            </div>
          )}

          {/* Disability Tab */}
          {activeTab === 'disability' && (
            <div className="space-y-4 animate-in fade-in duration-100">
              <div className="p-3.5 rounded-2xl bg-indigo-50/60 border border-indigo-200">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-indigo-950 block text-xs">
                      Disability & Divyangjan Inclusion Protocol
                    </span>
                    <p className="text-indigo-800 text-[11px] mt-0.5">
                      Identify children requiring special aids, UDID certificates, or adaptive classroom support.
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasDisability}
                      onChange={(e) => setHasDisability(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-stone-300 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>

              {hasDisability && (
                <div className="space-y-3 p-3.5 bg-stone-50 border border-stone-200 rounded-2xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Disability Category</label>
                      <select
                        value={disabilityType}
                        onChange={(e) => setDisabilityType(e.target.value as any)}
                        className="w-full p-2 rounded-xl border border-stone-300 bg-white font-medium"
                      >
                        <option value="Locomotor">Locomotor</option>
                        <option value="Hearing Impairment">Hearing Impairment</option>
                        <option value="Visual Impairment">Visual Impairment</option>
                        <option value="Speech & Language">Speech & Language</option>
                        <option value="Intellectual / Developmental">Intellectual / Developmental</option>
                        <option value="Multiple Disabilities">Multiple Disabilities</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Severity / Percentage</label>
                      <input
                        type="text"
                        value={disabilitySeverity}
                        onChange={(e) => setDisabilitySeverity(e.target.value)}
                        placeholder="e.g. 40% (Moderate Bilateral)"
                        className="w-full p-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">UDID Number (If issued)</label>
                      <input
                        type="text"
                        value={udidNumber}
                        onChange={(e) => setUdidNumber(e.target.value)}
                        placeholder="e.g. UP-VAR-2024-00918"
                        className="w-full p-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-600 mb-1 font-medium">Assistive Device Provided</label>
                      <input
                        type="text"
                        value={assistiveDevice}
                        onChange={(e) => setAssistiveDevice(e.target.value)}
                        placeholder="e.g. Behind-the-Ear Hearing Aid, Splints"
                        className="w-full p-2 rounded-xl border border-stone-300 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-600 mb-1 font-medium">
                      Helper Protocol / Classroom Adaptations
                    </label>
                    <textarea
                      rows={2}
                      value={specialSupportNotes}
                      onChange={(e) => setSpecialSupportNotes(e.target.value)}
                      placeholder="e.g. Seat in front circle, use visual learning aids, assist with meal utensils."
                      className="w-full p-2 rounded-xl border border-stone-300 bg-white"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Vaccines Tab */}
          {activeTab === 'vaccines' && (
            <div className="space-y-3 animate-in fade-in duration-100">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
                <span className="font-bold text-emerald-950 block text-xs">
                  UIP Immunization Dose Log
                </span>
                <p className="text-stone-600 text-[11px] mt-0.5">
                  Click on any vaccine to toggle between Completed and Due status.
                </p>
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {vaccinesList.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => handleToggleVaccine(v.id)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      v.status === 'Completed'
                        ? 'bg-emerald-50/50 border-emerald-200 text-stone-900'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{v.name}</span>
                        <span className="text-[10px] text-stone-500 font-mono">({v.dueAge})</span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Target: {v.diseaseTarget} • Due: {v.dueDate}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border ${
                        v.status === 'Completed'
                          ? 'bg-emerald-600 text-white border-emerald-700'
                          : 'bg-amber-100 text-amber-900 border-amber-300'
                      }`}
                    >
                      {v.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Doctor & Checkup Tab */}
          {activeTab === 'doctor' && (
            <div className="space-y-3 animate-in fade-in duration-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    placeholder="e.g. Dr. Anita Roy (MO Rampur PHC)"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Clinic / Hospital</label>
                  <input
                    type="text"
                    value={clinicName}
                    onChange={(e) => setClinicName(e.target.value)}
                    placeholder="e.g. Rampur Primary Health Centre"
                    className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Doctor Clinical Advice & Dietary Plan
                </label>
                <textarea
                  rows={2}
                  value={doctorAdvice}
                  onChange={(e) => setDoctorAdvice(e.target.value)}
                  placeholder="e.g. Increase pulse intake, continue IFA syrup after lunch, avoid cold foods."
                  className="w-full p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Next Scheduled Health Camp Date
                </label>
                <input
                  type="date"
                  value={nextCheckup}
                  onChange={(e) => setNextCheckup(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 font-medium"
                />
              </div>
            </div>
          )}

          {/* Footer Save Button */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-between shrink-0">
            <span className="text-[11px] text-stone-500 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Saves to official child health card
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save All Health Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
