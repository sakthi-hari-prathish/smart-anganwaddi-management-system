import React from 'react';
import { 
  X, 
  User, 
  MapPin, 
  Phone, 
  Calendar, 
  Building2, 
  Heart, 
  AlertCircle, 
  ShieldCheck, 
  Briefcase, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Sparkles,
  Info
} from 'lucide-react';
import { Child } from '../../types';
import { calculateAge, maskAadhaar } from '../../utils/healthUtils';

interface ChildProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child | null;
  viewerRole?: 'parent' | 'worker' | 'supervisor';
}

export const ChildProfileModal: React.FC<ChildProfileModalProps> = ({
  isOpen,
  onClose,
  child,
  viewerRole = 'worker',
}) => {
  if (!isOpen || !child) return null;

  const ageData = calculateAge(child.dob);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-emerald-500/10 rounded-full blur-xl pointer-events-none" />

          <div className="flex items-start justify-between gap-4 relative z-10">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border-2 border-white/20 p-1 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {child.gender === 'Female' ? '👧' : '👦'}
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-xl sm:text-2xl font-serif text-white tracking-tight">
                    {child.name}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                    ID: {child.id}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-amber-400/20 text-amber-200 border border-amber-300/30">
                    Blood: {child.bloodGroup}
                  </span>
                </div>

                <p className="text-xs text-emerald-100/90 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span>Age: <strong>{ageData.formatted}</strong> ({ageData.months} months)</span>
                  <span>•</span>
                  <span>Gender: <strong>{child.gender}</strong></span>
                  <span>•</span>
                  <span>DOB: <strong>{child.dob}</strong></span>
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-stone-800/60 text-stone-200 border border-stone-700">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" />
                    Aadhaar: {maskAadhaar(child.aadhaarNumber)}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-800/60 text-amber-300 border border-stone-700 font-semibold">
                    Category: {child.socioeconomicCategory}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-stone-800/60 text-stone-300 border border-stone-700">
                    Enrolled: {child.enrollmentDate}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors cursor-pointer border border-white/20"
                title="Print Official Record Card"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Profile</span>
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-stone-800 text-xs sm:text-sm">
          {/* Government Protocol Banner */}
          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <p className="font-semibold text-stone-900">
                Official Integrated Child Development Services (ICDS) Child Health Profile
              </p>
              <p className="text-stone-600 mt-0.5">
                {viewerRole === 'parent' 
                  ? 'Official records maintained by Rampur Anganwadi Center. Read-only parental access.'
                  : 'Authenticated record under POSHAN Abhiyaan 2.0 national child surveillance database.'}
              </p>
            </div>
          </div>

          {/* Grid Section 1: Personal & Family Information */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-stone-200">
              <User className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                1. Personal & Family Information
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Child Full Name</span>
                <span className="font-semibold text-stone-900 text-sm">{child.name}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Mother's Name</span>
                <span className="font-semibold text-stone-900">{child.motherName}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Father's Name</span>
                <span className="font-semibold text-stone-900">{child.fatherName}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Legal Guardian Name</span>
                <span className="font-semibold text-stone-900">{child.guardianName}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Primary Contact Number</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1 mt-0.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" />
                  {child.contactNumber}
                </span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Guardian Occupation</span>
                <span className="font-semibold text-stone-900 flex items-center gap-1 mt-0.5">
                  <Briefcase className="w-3.5 h-3.5 text-stone-500" />
                  {child.guardianOccupation}
                </span>
              </div>

              {/* Emergency Contact */}
              <div className="sm:col-span-2 md:col-span-3 bg-rose-50/70 p-3.5 rounded-xl border border-rose-200/80 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <div>
                    <span className="text-[11px] text-rose-700 font-bold uppercase tracking-wider block">
                      Designated Emergency Contact
                    </span>
                    <span className="font-semibold text-stone-900">
                      {child.emergencyContact.name} ({child.emergencyContact.relation})
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-rose-800 font-mono font-bold text-xs bg-white px-3 py-1 rounded-lg border border-rose-200 shadow-2xs">
                  <Phone className="w-3.5 h-3.5 text-rose-600" />
                  {child.emergencyContact.phone}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Residential Address */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-stone-200">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                2. Residential Address
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
              <div className="sm:col-span-2">
                <span className="text-[11px] text-stone-500 font-medium block">Address Line</span>
                <span className="font-semibold text-stone-900">{child.residentialAddress}</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 font-medium block">Village / Town</span>
                <span className="font-semibold text-stone-900">{child.villageTown}</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 font-medium block">District</span>
                <span className="font-semibold text-stone-900">{child.district}</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 font-medium block">State</span>
                <span className="font-semibold text-stone-900">{child.state}</span>
              </div>

              <div>
                <span className="text-[11px] text-stone-500 font-medium block">PIN Code</span>
                <span className="font-mono font-bold text-stone-900">{child.pinCode}</span>
              </div>
            </div>
          </div>

          {/* Section 3: Anganwadi Administration Information */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-stone-200">
              <Building2 className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                3. Anganwadi Center Administration
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/70">
                <span className="text-[11px] text-emerald-800 font-medium block">Anganwadi Name & Code</span>
                <span className="font-bold text-emerald-950 text-xs sm:text-sm">{child.centerName}</span>
                <span className="text-[10px] text-emerald-700 font-mono mt-0.5 block">Code: {child.centerId}</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Assigned Anganwadi Worker</span>
                <span className="font-semibold text-stone-900">{child.workerName}</span>
                <span className="text-[10px] text-stone-500 block">Daily care & health recording</span>
              </div>

              <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80">
                <span className="text-[11px] text-stone-500 font-medium block">Sector Supervisor (CDPO)</span>
                <span className="font-semibold text-stone-900">{child.supervisorName}</span>
                <span className="text-[10px] text-stone-500 block">ICDS Sector 4 Oversight</span>
              </div>

              <div className="sm:col-span-2 md:col-span-3 bg-stone-50 p-3 rounded-xl border border-stone-200/80 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
                <div>
                  <span className="text-[11px] text-stone-500 font-medium">Physical Location:</span>{' '}
                  <span className="font-semibold text-stone-800">{child.anganwadiLocation}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Health Background & Allergies */}
          <div>
            <div className="flex items-center gap-2 pb-2 mb-3 border-b border-stone-200">
              <Heart className="w-4 h-4 text-emerald-700" />
              <h4 className="font-bold text-stone-900 text-sm uppercase tracking-wider">
                4. Background Medical History & Special Notes
              </h4>
            </div>

            <div className="space-y-3">
              {/* Allergies */}
              <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200">
                <span className="text-xs font-bold text-amber-900 uppercase tracking-wide flex items-center gap-1.5 mb-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  Known Allergies & Food Sensitivities
                </span>
                {child.allergies && child.allergies.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1 text-xs text-stone-700">
                    {child.allergies.map((allergy, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {allergy}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500 italic">No allergies recorded.</p>
                )}
              </div>

              {/* Previous Health History */}
              <div className="bg-stone-50 p-3.5 rounded-xl border border-stone-200">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wide block mb-1.5">
                  Previous Clinical Milestones & Health History
                </span>
                {child.previousHealthHistory && child.previousHealthHistory.length > 0 ? (
                  <ul className="space-y-1 text-xs text-stone-700">
                    {child.previousHealthHistory.map((hist, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0" />
                        <span>{hist}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-xs text-stone-500 italic">No previous complications recorded.</p>
                )}
              </div>

              {/* Important Medical Notes */}
              <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-200 text-xs">
                <span className="font-bold text-blue-950 uppercase tracking-wide block mb-1">
                  Worker & Pediatrician Observations
                </span>
                <p className="text-stone-700 leading-relaxed">{child.medicalNotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 px-5 sm:px-6 py-3.5 border-t border-stone-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Govt. of India e-POSHAN 2.0 Child Profile Register</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
};
