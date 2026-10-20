import React from 'react';
import type { DietaryPreferences } from '../types';
import { Check, X, Info } from 'lucide-react';

interface DietaryFilterBarProps {
  selectedFilters: DietaryPreferences;
  onChange: (updated: DietaryPreferences) => void;
  className?: string;
}

interface FilterOption {
  key: keyof DietaryPreferences;
  label: string;
  shortDesc: string;
  badgeClass: string;
  activeClass: string;
}

const FILTER_OPTIONS: FilterOption[] = [
  {
    key: 'krishnaPrasadam',
    label: 'Krishna Prasadam',
    shortDesc: 'Offered to Lord Krishna with love and devotion',
    badgeClass: 'border-amber-300 text-amber-900 bg-amber-50/60',
    activeClass: 'bg-amber-600 text-white border-amber-600 shadow-sm',
  },
  {
    key: 'noOnionGarlic',
    label: 'No Onion, No Garlic',
    shortDesc: 'Pure Vaishnava food without alliums',
    badgeClass: 'border-emerald-300 text-emerald-900 bg-emerald-50/60',
    activeClass: 'bg-emerald-700 text-white border-emerald-700 shadow-sm',
  },
  {
    key: 'jainFriendly',
    label: 'Jain-Friendly',
    shortDesc: 'As declared by provider (no root vegetables)',
    badgeClass: 'border-blue-300 text-blue-900 bg-blue-50/60',
    activeClass: 'bg-blue-700 text-white border-blue-700 shadow-sm',
  },
  {
    key: 'sattvic',
    label: 'Sattvic Food',
    shortDesc: 'Pure, wholesome ingredients promoting calmness',
    badgeClass: 'border-teal-300 text-teal-900 bg-teal-50/60',
    activeClass: 'bg-teal-700 text-white border-teal-700 shadow-sm',
  },
  {
    key: 'ekadashiFriendly',
    label: 'Ekadashi-Friendly',
    shortDesc: 'Grain-free / vrat meal options for fasting days',
    badgeClass: 'border-purple-300 text-purple-900 bg-purple-50/60',
    activeClass: 'bg-purple-700 text-white border-purple-700 shadow-sm',
  },
];

export const DietaryFilterBar: React.FC<DietaryFilterBarProps> = ({
  selectedFilters,
  onChange,
  className = '',
}) => {
  const activeCount = Object.values(selectedFilters).filter(Boolean).length;

  const toggleFilter = (key: keyof DietaryPreferences) => {
    onChange({
      ...selectedFilters,
      [key]: !selectedFilters[key],
    });
  };

  const clearAll = () => {
    onChange({
      krishnaPrasadam: false,
      noOnionGarlic: false,
      jainFriendly: false,
      sattvic: false,
      ekadashiFriendly: false,
    });
  };

  return (
    <div className={`bg-white rounded-xl border border-[#e5dec9] p-4 shadow-xs ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#1b4332]">
            Dietary Standards & Criteria
          </span>
          <span className="text-xs text-[#716858]">
            (Select multiple — strict match)
          </span>
        </div>

        {activeCount > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-red-700 hover:text-red-900 font-medium flex items-center gap-1 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((opt) => {
          const isActive = selectedFilters[opt.key];
          return (
            <button
              key={opt.key}
              type="button"
              onClick={() => toggleFilter(opt.key)}
              title={opt.shortDesc}
              aria-pressed={isActive}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                isActive ? opt.activeClass : `${opt.badgeClass} hover:border-[#1b4332]`
              }`}
            >
              {isActive ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60" />
              )}
              {opt.label}
            </button>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-[#716858] flex items-center gap-1.5 bg-[#fbf9f4] p-2 rounded-md border border-[#eee7d8]">
        <Info className="w-3.5 h-3.5 text-[#c8963e] shrink-0" />
        <span>
          Dietary attributes are explicitly declared by each provider. A provider without onion/garlic
          is not assumed to be Jain or Ekadashi compliant unless explicitly confirmed.
        </span>
      </p>
    </div>
  );
};
