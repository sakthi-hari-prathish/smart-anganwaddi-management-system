import React, { useState } from 'react';
import { X, Send, Megaphone } from 'lucide-react';
import { Announcement } from '../../types';

interface BroadcastNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBroadcast: (notice: Omit<Announcement, 'id'>) => void;
}

export const BroadcastNoticeModal: React.FC<BroadcastNoticeModalProps> = ({
  isOpen,
  onClose,
  onBroadcast,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Health Camp' | 'Holiday' | 'Nutrition Drive' | 'Meeting' | 'Alert'>('Health Camp');
  const [targetAudience, setTargetAudience] = useState<'All' | 'Parents' | 'Workers'>('All');
  const [priority, setPriority] = useState<'High' | 'Normal'>('High');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('Saturday, 26 Sep 2026');
  const [location, setLocation] = useState('Sector 4 Anganwadi Centers');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onBroadcast({
      title,
      category,
      targetAudience,
      priority,
      description,
      date,
      location,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-indigo-800 to-blue-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <Megaphone className="w-5 h-5 text-indigo-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Broadcast Sector Notice</h3>
              <p className="text-xs text-indigo-200">Dispatch official notice to all workers and parents across Sector 4</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Notice Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Iron & Deworming Camp on Saturday"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs font-medium"
              >
                <option value="Health Camp">Health Camp</option>
                <option value="Nutrition Drive">Nutrition Drive</option>
                <option value="Meeting">Parent/Worker Meeting</option>
                <option value="Holiday">Center Holiday</option>
                <option value="Alert">Urgent Advisory</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Target Audience
              </label>
              <select
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs font-medium"
              >
                <option value="All">All (Parents & Workers)</option>
                <option value="Parents">Parents Only</option>
                <option value="Workers">Anganwadi Workers Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Event Date / Schedule
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white text-xs font-medium"
              >
                <option value="High">High Priority (Red Alert)</option>
                <option value="Normal">Normal Notice</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Notice Description / Guidelines *
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide exact instructions, required child documents, timings, and dietary advice..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-indigo-700 hover:bg-indigo-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Notice</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
