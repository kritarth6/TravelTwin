import React from 'react';
import { Plane, Train, Bus, Car, Key, Sparkles, ExternalLink, CheckCircle2, XCircle, Clock, ShieldAlert } from 'lucide-react';
import { TransportOption } from '../types/trip';

interface TransportComparisonProps {
  options: TransportOption[];
  travellers: number;
}

export const TransportComparison: React.FC<TransportComparisonProps> = ({ options, travellers }) => {
  const getModeIcon = (mode: string) => {
    switch (mode) {
      case 'Flight': return <Plane className="w-5 h-5 text-sky-600" />;
      case 'Train': return <Train className="w-5 h-5 text-emerald-600" />;
      case 'Bus': return <Bus className="w-5 h-5 text-amber-600" />;
      case 'Cab': return <Car className="w-5 h-5 text-indigo-600" />;
      case 'Self-Drive': return <Key className="w-5 h-5 text-purple-600" />;
      default: return <Car className="w-5 h-5 text-slate-600" />;
    }
  };

  const getPriceBadge = (priceType: string) => {
    switch (priceType) {
      case 'Live Verified':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">Live Verified</span>;
      case 'Search-Result':
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">Live Portal Search</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 rounded-md">Heuristic Est.</span>;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Multi-Modal Transportation Comparison</h3>
          <p className="text-xs text-slate-500">
            Intelligently evaluated for {travellers} traveller{travellers > 1 ? 's' : ''}. Does not default to flights.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {options.map((option) => {
          const isRecommended = option.recommended;
          return (
            <div
              key={option.id}
              className={`rounded-2xl p-5 border transition-all flex flex-col justify-between ${
                isRecommended
                  ? 'border-brand-500 bg-gradient-to-b from-brand-50/40 via-white to-white ring-2 ring-brand-500/20 shadow-md'
                  : 'border-slate-200 bg-white hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-slate-100 rounded-xl">
                      {getModeIcon(option.mode)}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block">{option.mode}</span>
                      <span className="text-[11px] text-slate-500 truncate max-w-[140px] block">{option.provider}</span>
                    </div>
                  </div>
                  {getPriceBadge(option.price_type)}
                </div>

                {/* Recommended Banner */}
                {isRecommended && (
                  <div className="mb-3 px-3 py-1.5 bg-brand-50 border border-brand-200 text-brand-800 rounded-xl text-xs font-semibold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="line-clamp-2">{option.recommendation_reason || 'TravelTwin Recommended Pick'}</span>
                  </div>
                )}

                {/* Title & Timing */}
                <h4 className="text-sm font-bold text-slate-900 mb-1">{option.title}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-600 mb-3">
                  <span className="flex items-center gap-1 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    <Clock className="w-3 h-3 text-slate-500" />
                    {option.duration_display}
                  </span>
                  <span className="font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    {option.comfort_level}
                  </span>
                </div>

                {/* Pros & Cons */}
                <div className="space-y-1.5 my-3 text-xs">
                  {option.pros.slice(0, 2).map((pro, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-emerald-700">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5 text-emerald-600" />
                      <span className="leading-tight">{pro}</span>
                    </div>
                  ))}
                  {option.cons.slice(0, 1).map((con, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 text-slate-500">
                      <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                      <span className="leading-tight">{con}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & Action */}
              <div className="border-t border-slate-100 pt-3 mt-2 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">
                    {travellers > 1 ? `₹${intFormat(option.price_per_person)} / person` : 'Total fare'}
                  </span>
                  <span className="text-lg font-extrabold text-slate-900">
                    ₹{intFormat(option.total_price)}
                  </span>
                </div>

                {option.booking_url ? (
                  <a
                    href={option.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isRecommended
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-sm'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <span>Check Fare</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-400 font-medium">Offline Booking</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

function intFormat(val: number): string {
  return Math.round(val).toLocaleString('en-IN');
}
