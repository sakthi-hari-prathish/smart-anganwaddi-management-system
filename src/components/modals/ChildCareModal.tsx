import React, { useState, useEffect } from 'react';
import { X, Check, Utensils, HeartPulse, UserCheck, Thermometer, Pill } from 'lucide-react';
import { Child } from '../../types';

interface ChildCareModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  onSave: (updatedChild: Child) => void;
}

export const ChildCareModal: React.FC<ChildCareModalProps> = ({
  isOpen,
  onClose,
  child,
  onSave,
}) => {
  const [attendance, setAttendance] = useState<'Present' | 'Absent'>('Present');
  const [morningSnack, setMorningSnack] = useState<'Full' | 'Half' | 'None' | 'Pending'>('Full');
  const [lunch, setLunch] = useState<'Full' | 'Half' | 'None' | 'Pending'>('Full');
  const [specialDiet, setSpecialDiet] = useState<string>('');
  const [tempF, setTempF] = useState<number>(98.4);
  const [observations, setObservations] = useState<string>('');
  const [medAdministered, setMedAdministered] = useState<boolean>(false);
  const [dosageTime, setDosageTime] = useState<string>('12:45 PM');

  useEffect(() => {
    if (child) {
      setAttendance(child.attendanceToday === 'Absent' ? 'Absent' : 'Present');
      setMorningSnack(child.foodIntakeToday.morningSnack);
      setLunch(child.foodIntakeToday.lunch);
      setSpecialDiet(child.foodIntakeToday.specialDietNotes || '');
      setTempF(child.healthToday.temperatureF || 98.4);
      setObservations(child.healthToday.observations || '');
      setMedAdministered(child.healthToday.medicationAdministered);
      setDosageTime(child.medications[0]?.timeAdministeredToday || '12:45 PM');
    }
  }, [child]);

  if (!isOpen || !child) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedMedications = child.medications.map((m) => ({
      ...m,
      statusToday: medAdministered ? ('Administered' as const) : ('Pending' as const),
      timeAdministeredToday: medAdministered ? dosageTime : undefined,
    }));

    const updatedChild: Child = {
      ...child,
      attendanceToday: attendance,
      checkInTime: attendance === 'Present' ? (child.checkInTime || '08:45 AM') : undefined,
      foodIntakeToday: {
        morningSnack: attendance === 'Absent' ? 'None' : morningSnack,
        lunch: attendance === 'Absent' ? 'None' : lunch,
        specialDietNotes: specialDiet,
      },
      healthToday: {
        temperatureF: tempF,
        observations: observations || 'Active, normal behavior observed.',
        hasMedication: child.healthToday.hasMedication,
        medicationAdministered: medAdministered,
        lastUpdated: `Today at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      },
      medications: updatedMedications,
    };

    onSave(updatedChild);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20">
              {child.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg">{child.name}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white font-medium">
                  {child.age} • {child.gender}
                </span>
              </div>
              <p className="text-xs text-emerald-200">
                Parent: {child.parentName} ({child.parentPhone})
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

        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Attendance */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-emerald-600" />
                1. Daily Attendance (Today)
              </label>
              <span className="text-[11px] text-stone-500">Center #12 Rampur</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttendance('Present')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  attendance === 'Present'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <Check className="w-4 h-4" /> Present (Checked-in)
              </button>

              <button
                type="button"
                onClick={() => setAttendance('Absent')}
                className={`py-2.5 px-4 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                  attendance === 'Absent'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                <X className="w-4 h-4" /> Absent
              </button>
            </div>
          </div>

          {/* Section 2: Food & Nutritional Intake */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80">
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <Utensils className="w-4 h-4 text-amber-600" />
                2. Food & Nutritional Intake
              </label>
              <span className="text-[11px] text-stone-500">POSHAN Tracker</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Morning Snack (Egg / Moong + Milk)
                </label>
                <select
                  value={morningSnack}
                  onChange={(e) => setMorningSnack(e.target.value as any)}
                  disabled={attendance === 'Absent'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="Full">Full Portion Eaten (100%)</option>
                  <option value="Half">Half Portion Eaten (50%)</option>
                  <option value="None">Refused / Not Eaten</option>
                  <option value="Pending">Pending / In Progress</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Lunch (Pushtahar Khichdi / Veg)
                </label>
                <select
                  value={lunch}
                  onChange={(e) => setLunch(e.target.value as any)}
                  disabled={attendance === 'Absent'}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-50"
                >
                  <option value="Full">Full Portion Eaten (100%)</option>
                  <option value="Half">Half Portion Eaten (50%)</option>
                  <option value="None">Refused / Not Eaten</option>
                  <option value="Pending">Pending / In Progress</option>
                </select>
              </div>
            </div>

            <div className="mt-3">
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Special Dietary Observations / Extra Ration Notes
              </label>
              <input
                type="text"
                value={specialDiet}
                onChange={(e) => setSpecialDiet(e.target.value)}
                placeholder="e.g. Liked extra lentils, mother requested mild spices"
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Health & Care Observations */}
          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                3. Health Observations & Daily Care
              </label>
              <span className="text-[11px] text-stone-500">Physical Check</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1 flex items-center gap-1">
                  <Thermometer className="w-3.5 h-3.5 text-rose-500" />
                  Recorded Temperature (°F)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="95"
                  max="106"
                  value={tempF}
                  onChange={(e) => setTempF(parseFloat(e.target.value) || 98.4)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-600 mb-1">
                  Health Condition Tag
                </label>
                <div className="flex items-center h-9 px-3 rounded-xl bg-white border border-stone-300 text-xs font-medium text-stone-700">
                  {tempF > 99.5 ? (
                    <span className="text-rose-600 font-bold">⚠️ Mild Fever Alert</span>
                  ) : (
                    <span className="text-emerald-700 font-bold">✓ Normal Temperature</span>
                  )}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-600 mb-1">
                Daily Behavioral & Physical Observations
              </label>
              <textarea
                rows={2}
                value={observations}
                onChange={(e) => setObservations(e.target.value)}
                placeholder="e.g. Active, energetic, participated in group rhymes. No complaints of pain."
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            {/* Prescribed Medicine Log */}
            {child.medications && child.medications.length > 0 && (
              <div className="mt-3 p-3 bg-amber-50/70 border border-amber-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Pill className="w-4 h-4 text-amber-700" />
                  <span>Prescription Medicine: {child.medications[0].medicineName}</span>
                </div>
                <p className="text-[11px] text-amber-800">
                  Dosage: <strong>{child.medications[0].dosage}</strong> ({child.medications[0].timing}) • Prescribed by {child.medications[0].prescribedBy}
                </p>

                <div className="flex items-center justify-between pt-2 border-t border-amber-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                    <input
                      type="checkbox"
                      checked={medAdministered}
                      onChange={(e) => setMedAdministered(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span>Medication administered at center today</span>
                  </label>

                  {medAdministered && (
                    <input
                      type="text"
                      value={dosageTime}
                      onChange={(e) => setDosageTime(e.target.value)}
                      className="text-xs px-2 py-1 rounded border border-amber-300 bg-white font-mono w-24 text-center"
                      placeholder="e.g. 12:45 PM"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Save & Sync Daily Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
