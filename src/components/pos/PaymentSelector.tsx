import React, { useState, useEffect } from 'react';
import { Banknote, QrCode, Coins, Check, AlertCircle, RotateCcw } from 'lucide-react';
import { PaymentMethod } from '../../types/database.types';
import { AnimatedNumber } from '../common/AnimatedNumber';

interface PaymentSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
  totalAmount?: number;
  isQuickBilling?: boolean;
}

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
  totalAmount = 0,
  isQuickBilling = false,
}) => {
  const [tenderAmount, setTenderAmount] = useState<number | null>(null);
  const [customInput, setCustomInput] = useState<string>('');

  // Reset tender amount when total changes or payment method changes
  useEffect(() => {
    setTenderAmount(null);
    setCustomInput('');
  }, [totalAmount, selectedMethod]);

  const handleSelectQuickCash = (amount: number) => {
    setTenderAmount(amount);
    setCustomInput(amount.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/[^0-9]/g, '');
    setCustomInput(val);
    const num = parseInt(val, 10);
    setTenderAmount(isNaN(num) ? null : num);
  };

  const handleResetTender = () => {
    setTenderAmount(null);
    setCustomInput('');
  };

  // Generate sensible quick cash buttons based on total amount
  const quickCashPresets = React.useMemo(() => {
    if (totalAmount <= 0) return [];
    const presets: { label: string; amount: number }[] = [
      { label: 'Exact', amount: totalAmount },
    ];

    // Standard Indian denomination targets
    const standardNotes = [20, 50, 100, 200, 500];
    for (const note of standardNotes) {
      if (note > totalAmount && !presets.some((p) => p.amount === note)) {
        presets.push({ label: `₹${note}`, amount: note });
      }
    }

    // Limit to top 4 options to keep UI clean and compact
    return presets.slice(0, 4);
  }, [totalAmount]);

  const changeAmount = tenderAmount !== null ? tenderAmount - totalAmount : null;
  const isExactOrOver = changeAmount !== null && changeAmount >= 0;
  const isUnderpaid = changeAmount !== null && changeAmount < 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-500">
          Payment Method
        </label>
        {selectedMethod === 'Cash' && totalAmount > 0 && tenderAmount !== null && (
          <button
            type="button"
            onClick={handleResetTender}
            className="flex items-center gap-1 text-[10px] font-medium text-stone-400 hover:text-stone-700 transition-colors active:scale-95"
            title="Reset cash calculator"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset Tender</span>
          </button>
        )}
      </div>

      {/* Segmented Control with spring-like feel */}
      <div className="relative grid grid-cols-2 gap-1 bg-stone-100/90 p-0.5 rounded-xl border border-stone-200/80 shadow-2xs">
        {/* Cash Button */}
        <button
          type="button"
          onClick={() => onSelectMethod('Cash')}
          className={`relative z-10 h-8 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
            selectedMethod === 'Cash'
              ? 'bg-stone-900 text-amber-300 shadow-md ring-1 ring-stone-950 font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <Banknote
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              selectedMethod === 'Cash' ? 'scale-110 text-amber-400' : 'text-stone-400'
            }`}
          />
          <span>CASH</span>
          {isQuickBilling && (
            <kbd
              className={`hidden lg:inline-flex items-center justify-center px-1 py-0.2 rounded text-[9px] font-mono font-bold leading-none ${
                selectedMethod === 'Cash'
                  ? 'bg-stone-800 text-amber-200 border border-amber-400/30'
                  : 'bg-stone-200/80 text-stone-500 border border-stone-300/80'
              }`}
            >
              C
            </kbd>
          )}
        </button>

        {/* UPI Button */}
        <button
          type="button"
          onClick={() => onSelectMethod('UPI')}
          className={`relative z-10 h-8 rounded-lg flex items-center justify-center gap-1.5 font-bold text-xs transition-all duration-150 active:scale-95 cursor-pointer ${
            selectedMethod === 'UPI'
              ? 'bg-stone-900 text-amber-300 shadow-md ring-1 ring-stone-950 font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
          }`}
        >
          <QrCode
            className={`w-3.5 h-3.5 transition-transform duration-150 ${
              selectedMethod === 'UPI' ? 'scale-110 text-amber-400' : 'text-stone-400'
            }`}
          />
          <span>UPI</span>
          {isQuickBilling && (
            <kbd
              className={`hidden lg:inline-flex items-center justify-center px-1 py-0.2 rounded text-[9px] font-mono font-bold leading-none ${
                selectedMethod === 'UPI'
                  ? 'bg-stone-800 text-amber-200 border border-amber-400/30'
                  : 'bg-stone-200/80 text-stone-500 border border-stone-300/80'
              }`}
            >
              U
            </kbd>
          )}
        </button>
      </div>

      {/* Animated Cash Tender & Change Calculator (Shown only when Cash is selected & cart > 0) */}
      {selectedMethod === 'Cash' && totalAmount > 0 && (
        <div className="bg-stone-50 rounded-xl p-2 sm:p-2.5 border border-stone-200/80 space-y-2 animate-slide-down shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-stone-600">
              <Coins className="w-3.5 h-3.5 text-amber-700" />
              <span>Cash Tendered</span>
            </span>
            <div className="relative w-24">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-stone-400 font-mono text-[10px] font-bold">
                ₹
              </span>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder={totalAmount.toString()}
                value={customInput}
                onChange={handleCustomInputChange}
                className="w-full h-6.5 pl-5 pr-2 rounded-lg bg-white border border-stone-200 text-right font-mono font-bold text-xs text-stone-900 focus:outline-none focus:ring-1.5 focus:ring-stone-900 transition-all shadow-2xs tabular-nums"
              />
            </div>
          </div>

          {/* Quick Cash Chips */}
          <div className="flex items-center gap-1.5">
            {quickCashPresets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => handleSelectQuickCash(preset.amount)}
                className={`flex-1 py-1 px-1 rounded-lg text-[10px] font-mono font-bold transition-all duration-150 active:scale-95 shadow-2xs tabular-nums ${
                  tenderAmount === preset.amount
                    ? 'bg-stone-900 text-amber-300 shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200/80 hover:bg-stone-100/80'
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Animated Change Return Pill */}
          {tenderAmount !== null && (
            <div>
              {isExactOrOver ? (
                <div className="flex items-center justify-between bg-emerald-50 text-emerald-800 border border-emerald-200/90 rounded-lg py-1 px-2.5 text-[11px] font-medium animate-spring-bounce shadow-2xs">
                  <span className="flex items-center gap-1.5 font-bold">
                    <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                    <span>Change Return:</span>
                  </span>
                  <span className="font-mono font-black text-xs text-emerald-950 tabular-nums">
                    <AnimatedNumber value={changeAmount ?? 0} type="currency" duration={350} />
                  </span>
                </div>
              ) : isUnderpaid ? (
                <div className="flex items-center justify-between bg-amber-50 text-amber-900 border border-amber-200/90 rounded-lg py-1 px-2.5 text-[11px] font-medium animate-slide-down shadow-2xs">
                  <span className="flex items-center gap-1.5 font-bold">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Balance Due:</span>
                  </span>
                  <span className="font-mono font-black text-xs text-amber-950 tabular-nums">
                    <AnimatedNumber value={Math.abs(changeAmount ?? 0)} type="currency" duration={350} />
                  </span>
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
