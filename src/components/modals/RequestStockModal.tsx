import React, { useState } from 'react';
import { X, Send, AlertCircle, ShoppingBag } from 'lucide-react';
import { StockItem } from '../../types';

interface RequestStockModalProps {
  isOpen: boolean;
  onClose: () => void;
  stockItems: StockItem[];
  onRequestStock: (itemName: string, quantity: number, unit: string, urgency: 'Normal' | 'High' | 'Emergency', reason: string) => void;
}

export const RequestStockModal: React.FC<RequestStockModalProps> = ({
  isOpen,
  onClose,
  stockItems,
  onRequestStock,
}) => {
  const [selectedItemName, setSelectedItemName] = useState<string>(stockItems[0]?.name || 'Fortified Parboiled Rice');
  const [quantity, setQuantity] = useState<string>('50');
  const [urgency, setUrgency] = useState<'Normal' | 'High' | 'Emergency'>('High');
  const [reason, setReason] = useState<string>('Current balance running low; required for next 2 weeks hot cooked meals.');

  if (!isOpen) return null;

  const currentItem = stockItems.find((s) => s.name === selectedItemName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qtyNum = parseFloat(quantity);
    if (!selectedItemName || isNaN(qtyNum) || qtyNum <= 0) return;
    const unit = currentItem?.unit || 'kg';
    onRequestStock(selectedItemName, qtyNum, unit, urgency, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-gradient-to-r from-amber-700 to-orange-800 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-white/10">
              <ShoppingBag className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Request Stock / Requisition Indent</h3>
              <p className="text-xs text-amber-200">Submit an official supply replenishment indent to the Sector Supervisor</p>
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
              Select Item to Reorder *
            </label>
            <select
              value={selectedItemName}
              onChange={(e) => setSelectedItemName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
            >
              {stockItems.map((item) => (
                <option key={item.id} value={item.name}>
                  {item.name} ({item.currentlyAvailable} {item.unit} left)
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Requested Quantity *
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="1"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-semibold"
                />
                <span className="absolute right-3.5 top-2.5 text-xs text-stone-400 font-medium">
                  {currentItem?.unit || 'kg'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                Urgency Level *
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm font-medium"
              >
                <option value="Normal">Normal (Routine refill)</option>
                <option value="High">High (&lt; 5 days stock left)</option>
                <option value="Emergency">Emergency (Immediate)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
              Reason / Justification for Supervisor *
            </label>
            <textarea
              rows={2}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State reasons such as increase in attendance, upcoming festival ration, or low stock"
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 text-xs text-stone-600 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p>
              Requisition will appear immediately in the Supervisor Dashboard pending queue with reference ID and timestamp.
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
              className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-amber-700 hover:bg-amber-800 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Indent to Supervisor</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
