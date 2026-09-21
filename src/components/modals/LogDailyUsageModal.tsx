import React, { useState } from 'react';
import { X, PackageMinus, Calendar, ClipboardCheck } from 'lucide-react';
import { StockItem } from '../../types';

interface LogDailyUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockItem[];
  onLogUsage: (stockId: string, quantity: number, purpose: string) => void;
}

export const LogDailyUsageModal: React.FC<LogDailyUsageModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  onLogUsage,
}) => {
  const [selectedStockId, setSelectedStockId] = useState<string>(stockItems[0]?.id || '');
  const [quantity, setQuantity] = useState<string>('5');
  const [purpose, setPurpose] = useState<string>('Mid-day hot cooked meal for 29 enrolled children');

  if (!isOpen) return null;

  const currentItem = stockItems.find((s) => s.id === selectedStockId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(quantity);
    if (!selectedStockId || isNaN(qtyNum) || qtyNum <= 0) return;
    onLogUsage(selectedStockId, qtyNum, purpose);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <PackageMinus className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Log Daily Stock Consumption</h3>
              <p className="text-xs text-emerald-200">Deduct daily kitchen or healthcare usage from inventory</p>
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
              Select Inventory Item *
            </label>
            <select
              value={selectedStockId}
              onChange={(e) => setSelectedStockId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium"
            >
              {stockItems.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.currentlyAvailable} {item.unit} available)
                </option>
              ))}
            </select>
            {currentItem && (
              <p className="text-xs text-stone-500 mt-1 flex items-center gap-1.5">
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                Current stock: <strong>{currentItem.currentlyAvailable} {currentItem.unit}</strong> • Recommended daily rate: {currentItem.dailyConsumptionRate} {currentItem.unit}/day
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Quantity Consumed Today ({currentItem?.unit || 'units'}) *
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.1"
                min="0.1"
                max={currentItem ? currentItem.currentlyAvailable : 999}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-semibold"
              />
              <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-medium">
                {currentItem?.unit}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Purpose / Distribution Details *
            </label>
            <textarea
              rows={2}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g., Prepared nutritious khichdi for morning & lunch session"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800 flex items-start gap-2">
            <ClipboardCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              This entry automatically updates the center stock ledger and will be synchronized with the CDPO Supervisor portal for supply quota calculation.
            </p>
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
              className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Confirm & Deduct Stock
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
