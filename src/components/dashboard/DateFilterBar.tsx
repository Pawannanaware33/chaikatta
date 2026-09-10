import React, { useState } from 'react';
import { Calendar, Filter } from 'lucide-react';
import { DateFilterType } from '../../services/analyticsService';

interface DateFilterBarProps {
  currentFilter: DateFilterType;
  customStartDate: string;
  customEndDate: string;
  onSelectFilter: (filter: DateFilterType) => void;
  onCustomDateChange: (start: string, end: string) => void;
}

export const DateFilterBar: React.FC<DateFilterBarProps> = ({
  currentFilter,
  customStartDate,
  customEndDate,
  onSelectFilter,
  onCustomDateChange,
}) => {
  const [showCustomInputs, setShowCustomInputs] = useState(currentFilter === 'CUSTOM');

  const filterOptions: { type: DateFilterType; label: string }[] = [
    { type: 'TODAY', label: 'TODAY' },
    { type: 'YESTERDAY', label: 'YESTERDAY' },
    { type: 'THIS_WEEK', label: 'THIS WEEK' },
    { type: 'THIS_MONTH', label: 'THIS MONTH' },
    { type: 'CUSTOM', label: 'CUSTOM RANGE' },
  ];

  const handleFilterClick = (type: DateFilterType) => {
    onSelectFilter(type);
    setShowCustomInputs(type === 'CUSTOM');
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2 text-stone-500 text-xs font-semibold uppercase tracking-wider">
          <Filter className="w-3.5 h-3.5 text-stone-500" />
          <span>Filter</span>
        </div>

        {/* Minimal Segmented Filter Group */}
        <div className="flex items-center flex-wrap gap-1 bg-stone-100/80 p-1 rounded-xl border border-stone-200/70 transition-colors">
          {filterOptions.map((opt) => {
            const isActive = currentFilter === opt.type;
            return (
              <button
                key={opt.type}
                type="button"
                onClick={() => handleFilterClick(opt.type)}
                className={`px-3 py-1.5 rounded-lg text-xs transition-all duration-150 active:scale-95 ${
                  isActive
                    ? 'bg-white text-stone-900 font-bold shadow-xs border border-stone-200/60'
                    : 'text-stone-500 hover:text-stone-800 font-medium hover:bg-white/40'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {showCustomInputs && (
        <div className="flex items-center flex-wrap gap-3 bg-white p-3 rounded-xl border border-stone-200 shadow-xs animate-in fade-in slide-in-from-top-1 duration-150 transition-colors">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-stone-600">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <span>Range:</span>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <label htmlFor="start-date" className="text-xs text-stone-500 font-medium">From:</label>
              <input
                id="start-date"
                type="date"
                value={customStartDate}
                onChange={(e) => onCustomDateChange(e.target.value, customEndDate)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <label htmlFor="end-date" className="text-xs text-stone-500 font-medium">To:</label>
              <input
                id="end-date"
                type="date"
                value={customEndDate}
                onChange={(e) => onCustomDateChange(customStartDate, e.target.value)}
                className="text-xs font-medium px-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50 text-stone-800 focus:outline-none focus:ring-1 focus:ring-stone-400 transition-colors"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
