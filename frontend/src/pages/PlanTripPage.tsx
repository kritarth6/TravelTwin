import React from 'react';
import { TripForm } from '../components/TripForm';
import { TripRequest, TripPlan } from '../types/trip';
import { Sparkles, ShieldCheck, Zap } from 'lucide-react';

interface PlanTripPageProps {
  onSubmit: (request: TripRequest) => void;
  isLoading: boolean;
  prefillValues?: Partial<TripRequest>;
}

export const PlanTripPage: React.FC<PlanTripPageProps> = ({ 
  onSubmit, 
  isLoading, 
  prefillValues 
}) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 text-brand-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Autonomous AI Travel Architect</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Configure Your Perfect Itinerary
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Provide your constraints below. TravelTwin coordinates 7 dedicated AI agents to compare multi-modal transport, research verified stays, and balance your budget.
        </p>
      </div>

      {/* Main Form Component */}
      <TripForm 
        onSubmit={onSubmit} 
        isLoading={isLoading} 
        initialValues={prefillValues} 
      />

      {/* Trust Badges */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-900 block mb-0.5">Real Provider Links</span>
          <span className="text-[11px] text-slate-500">IRCTC, RedBus, Booking.com search urls</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-900 block mb-0.5">Budget Optimization</span>
          <span className="text-[11px] text-slate-500">Automatic downgrades to prevent overspending</span>
        </div>
        <div className="p-4 bg-white rounded-xl border border-slate-200/80 shadow-sm">
          <span className="text-xs font-bold text-slate-900 block mb-0.5">Conversational Updates</span>
          <span className="text-[11px] text-slate-500">Refine transport or stays without restarting</span>
        </div>
      </div>
    </div>
  );
};

