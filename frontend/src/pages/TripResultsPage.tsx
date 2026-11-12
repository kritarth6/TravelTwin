import React, { useState } from 'react';
import { 
  TripPlan 
} from '../types/trip';
import { 
  Compass, MapPin, Calendar, Users, IndianRupee, Sun, CloudRain, 
  Sparkles, Train, Building2, Clock, CheckCircle2, Share2, ArrowLeft, BookmarkCheck, FileText 
} from 'lucide-react';
import { TransportComparison } from '../components/TransportComparison';
import { HotelCards } from '../components/HotelCards';
import { ItineraryTimeline } from '../components/ItineraryTimeline';
import { BudgetChart } from '../components/BudgetChart';
import { TravelMap } from '../components/TravelMap';
import { AgentActivityIndicator } from '../components/AgentActivityIndicator';
import { RefinementChat } from '../components/RefinementChat';

interface TripResultsPageProps {
  plan: TripPlan;
  onBackToPlan: () => void;
  onRefine: (prompt: string) => Promise<void>;
  isRefining: boolean;
  onSaveNotice: () => void;
}

export const TripResultsPage: React.FC<TripResultsPageProps> = ({ 
  plan, 
  onBackToPlan, 
  onRefine, 
  isRefining,
  onSaveNotice
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'transport' | 'hotels' | 'itinerary' | 'budget' | 'map'>('all');

  const nights = Math.max(1, plan.duration_days - 1);
  const remainingBudget = plan.budget_breakdown.remaining_balance;
  const isWithinBudget = plan.budget_breakdown.is_within_budget;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <button
          onClick={onBackToPlan}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Modify Trip Parameters</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={onSaveNotice}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <BookmarkCheck className="w-4 h-4 text-emerald-600" />
            <span>Saved to Local Database</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm"
          >
            <FileText className="w-3.5 h-3.5 text-slate-500" />
            <span>Print / Export</span>
          </button>
        </div>
      </div>

      {/* Hero Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold tracking-wide uppercase text-brand-600">
              <Compass className="w-4 h-4" />
              <span>Multi-Agent Synthesized Itinerary</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              {plan.origin} <span className="text-slate-400 font-light">to</span> {plan.destination}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
              {plan.overview}
            </p>
          </div>

          {/* Budget & Cost Pill */}
          <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-2xl flex flex-col sm:flex-row lg:flex-col gap-4 min-w-[260px]">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Estimated Spend
              </span>
              <div className="flex items-baseline gap-1 mt-0.5">
                <span className="text-2xl font-black text-slate-900">
                  ₹{Math.round(plan.budget_breakdown.total_estimated_cost).toLocaleString('en-IN')}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  / ₹{Math.round(plan.total_budget).toLocaleString('en-IN')} max
                </span>
              </div>
            </div>

            <div className="border-t sm:border-t-0 sm:border-l lg:border-l-0 lg:border-t border-slate-200 pt-3 sm:pt-0 sm:pl-4 lg:pl-0 lg:pt-3">
              <span className="text-[11px] font-bold uppercase tracking-wider block text-slate-400">
                Budget Buffer Status
              </span>
              <span className={`text-xs font-extrabold inline-flex items-center gap-1 mt-0.5 ${
                isWithinBudget ? 'text-emerald-700' : 'text-amber-700'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                {isWithinBudget 
                  ? `₹${Math.round(remainingBudget).toLocaleString('en-IN')} surplus remaining` 
                  : `₹${Math.round(Math.abs(remainingBudget)).toLocaleString('en-IN')} over target`
                }
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Dates & Duration</span>
              <span className="text-xs font-bold text-slate-800">
                {plan.duration_days} Days ({nights} Nights)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Travel Group</span>
              <span className="text-xs font-bold text-slate-800">
                {plan.travellers} {plan.travellers === 1 ? 'Solo Traveller' : 'Travellers'} ({plan.travel_style})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              <Train className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Recommended Transit</span>
              <span className="text-xs font-bold text-slate-800 truncate max-w-[140px] block">
                {plan.recommended_transport.mode} ({plan.recommended_transport.provider})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-100 rounded-xl text-slate-700">
              {plan.weather_forecast?.rain_probability && plan.weather_forecast.rain_probability > 30 ? (
                <CloudRain className="w-4 h-4 text-blue-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-500" />
              )}
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Local Climate</span>
              <span className="text-xs font-bold text-slate-800">
                {plan.weather_forecast?.current_temp || 26}°C • {plan.weather_forecast?.condition || 'Pleasant'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Agent Execution Telemetry Log */}
      <AgentActivityIndicator 
        logs={plan.agent_execution_logs} 
        isDemoMode={plan.is_demo_mode} 
      />

      {/* Section Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'Complete Plan' },
          { id: 'transport', label: 'Transit Comparison' },
          { id: 'hotels', label: 'Accommodations' },
          { id: 'itinerary', label: 'Day-Wise Itinerary' },
          { id: 'budget', label: 'Budget Breakdown' },
          { id: 'map', label: 'Interactive Map' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Sections */}
      <div className="space-y-12">
        {/* Section 1: Transportation */}
        {(activeTab === 'all' || activeTab === 'transport') && (
          <section id="section-transport">
            <TransportComparison 
              options={plan.transportation_options} 
              travellers={plan.travellers} 
            />
          </section>
        )}

        {/* Section 2: Accommodation */}
        {(activeTab === 'all' || activeTab === 'hotels') && (
          <section id="section-hotels">
            <HotelCards 
              options={plan.accommodation_options} 
              nights={nights} 
            />
          </section>
        )}

        {/* Section 3: Day-Wise Itinerary */}
        {(activeTab === 'all' || activeTab === 'itinerary') && (
          <section id="section-itinerary">
            <ItineraryTimeline itinerary={plan.itinerary} />
          </section>
        )}

        {/* Section 4: Budget Breakdown Chart */}
        {(activeTab === 'all' || activeTab === 'budget') && (
          <section id="section-budget">
            <BudgetChart 
              breakdown={plan.budget_breakdown} 
              travellers={plan.travellers} 
            />
          </section>
        )}

        {/* Section 5: Interactive Map */}
        {(activeTab === 'all' || activeTab === 'map') && (
          <section id="section-map">
            <TravelMap 
              markers={plan.map_markers} 
              destinationName={plan.destination} 
            />
          </section>
        )}

        {/* Section 6: AI Explanation & Conversational Refinement */}
        <section id="section-refine">
          <RefinementChat 
            tripId={plan.id}
            aiExplanation={plan.ai_explanation}
            onRefine={onRefine}
            isRefining={isRefining}
          />
        </section>
      </div>
    </div>
  );
};

