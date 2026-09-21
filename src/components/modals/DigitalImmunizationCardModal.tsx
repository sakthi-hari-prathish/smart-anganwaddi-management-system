import React from 'react';
import { X, ShieldCheck, Printer, CheckCircle2, AlertCircle, Clock, Award } from 'lucide-react';
import { Child } from '../../types';

interface DigitalImmunizationCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: Child;
}

export const DigitalImmunizationCardModal: React.FC<DigitalImmunizationCardModalProps> = ({
  isOpen,
  onClose,
  child,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150 my-6">
        {/* Official Banner Header */}
        <div className="bg-emerald-900 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2 text-emerald-300 text-xs font-semibold tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" />
            <span>Ministry of Women & Child Development • POSHAN Abhiyaan</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold font-serif">
            Digital MCP Immunization Record Card
          </h2>
          <p className="text-xs text-emerald-200 mt-1">
            Universal Immunization Programme (UIP) • ICDS Verified Child Identity #MCTS-{child.id.toUpperCase()}-2026
          </p>

          {/* Child summary strip */}
          <div className="mt-4 pt-4 border-t border-emerald-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Child Name</span>
              <span className="font-semibold text-white text-sm">{child.name}</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Age & Gender</span>
              <span className="font-semibold text-white">{child.age} ({child.gender})</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Date of Birth</span>
              <span className="font-semibold text-white">{child.dob} (Blood: {child.bloodGroup})</span>
            </div>
            <div>
              <span className="text-emerald-300 block text-[10px] uppercase font-bold">Anganwadi Center</span>
              <span className="font-semibold text-white truncate block">{child.centerName}</span>
            </div>
          </div>
        </div>

        {/* Immunization Table */}
        <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              National Immunization Schedule Status
            </h4>
            <span className="text-xs text-stone-500">WHO & IAP Certified Regimen</span>
          </div>

          <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Vaccine & Target</th>
                  <th className="py-2.5 px-3">Age Prescribed</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Date Given / Due</th>
                  <th className="py-2.5 px-3">Batch / Center</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {child.vaccines.map((v) => (
                  <tr key={v.id} className="hover:bg-stone-50/60">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900">{v.name}</div>
                      <div className="text-[11px] text-stone-500">{v.diseaseTarget}</div>
                    </td>
                    <td className="py-3 px-3 text-stone-700 font-medium">{v.dueAge}</td>
                    <td className="py-3 px-3">
                      {v.status === 'Completed' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Completed
                        </span>
                      )}
                      {v.status === 'Due' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse">
                          <AlertCircle className="w-3 h-3 text-amber-600" /> Due Now
                        </span>
                      )}
                      {v.status === 'Upcoming' && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-600 border border-stone-200">
                          <Clock className="w-3 h-3" /> Upcoming
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 font-mono text-stone-700">
                      {v.administeredDate || v.dueDate}
                    </td>
                    <td className="py-3 px-3 text-stone-500 text-[11px]">
                      {v.batchNumber ? (
                        <span>#{v.batchNumber} • {v.administeredBy || 'PHC'}</span>
                      ) : (
                        <span>{v.importantNote || 'Scheduled at AW Camp'}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-xs text-emerald-800 flex items-start gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Digitally Signed & Validated for School Entry</p>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                This digital MCP card is recognized across all government health sub-centers, primary schools, and anganwadis under Mission POSHAN 2.0.
              </p>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="bg-stone-50 p-4 border-t border-stone-200 flex items-center justify-between">
          <div className="text-[11px] text-stone-500">
            Last authenticated by Auxiliary Nurse Midwife (ANM) on {new Date().toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-700 bg-white border border-stone-300 rounded-xl hover:bg-stone-100 transition-colors cursor-pointer shadow-2xs"
            >
              <Printer className="w-3.5 h-3.5" /> Print MCP Card
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
