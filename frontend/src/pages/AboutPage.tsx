import React from 'react';
import { 
  Compass, Cpu, Train, Building2, MapPin, Calendar, 
  IndianRupee, Search, ShieldCheck, CheckCircle2, ArrowRight 
} from 'lucide-react';

interface AboutPageProps {
  onStartPlanning: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onStartPlanning }) => {
  const agents = [
    {
      name: 'Travel Orchestrator Agent',
      role: 'Master Graph Coordinator',
      desc: 'Parses origin, destination, dates, group size, budget, and travel style. Sequentially triggers and synchronizes all downstream specialist agents using LangGraph StateGraph.',
      icon: Cpu,
      color: 'bg-blue-50 text-brand-600'
    },
    {
      name: 'Research & Verification Agent',
      role: 'Live Web Telemetry & Tavily Search',
      desc: 'Queries verified portals via Tavily Search API and Open-Meteo climate telemetry to source current transit schedules, routes, and regional weather conditions.',
      icon: Search,
      color: 'bg-emerald-50 text-emerald-600'
    },
    {
      name: 'Transportation Agent',
      role: 'Multi-Modal Route Evaluator',
      desc: 'Compares flights, superfast trains, multi-axle sleeper buses, private cabs, shared taxis, and self-drive. Never defaults to flights; selects the most practical, budget-aligned route.',
      icon: Train,
      color: 'bg-amber-50 text-amber-600'
    },
    {
      name: 'Accommodation Agent',
      role: '4-Tier Hospitality Benchmarker',
      desc: 'Surfaces stays across Budget (hostels, dorms), Standard (3-star hotels), Premium (boutique/heritage), and Luxury (5-star resorts) with real booking portal deep links.',
      icon: Building2,
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      name: 'Local Transportation Agent',
      role: 'Destination Mobility Guide',
      desc: 'Researches on-ground travel options: metros, auto-rickshaws, bike/scooter rentals, app cabs, and walking corridors to calculate realistic daily local commute costs.',
      icon: MapPin,
      color: 'bg-teal-50 text-teal-600'
    },
    {
      name: 'Itinerary Agent',
      role: 'Day-Wise Pacing & Food Curator',
      desc: 'Generates structured morning, afternoon, and evening timelines with verified attraction hours, regional culinary specialties, and geographically coherent stops.',
      icon: Calendar,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      name: 'Budget Optimization Agent',
      role: 'Core Fiscal Balancing Engine',
      desc: 'Allocates total budget across 6 pillars: Intercity transit, Accommodation, Food, Local travel, Sightseeing, and Emergency buffer. Automatically downgrades high-cost items if over budget.',
      icon: IndianRupee,
      color: 'bg-rose-50 text-rose-600'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider">
          <Compass className="w-4 h-4 text-brand-600" />
          <span>About TravelTwin AI</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Intelligent Travel Planning For Real Humans & Real Budgets
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          The majority of travel software is designed to sell high-margin flights and luxury hotel rooms. 
          TravelTwin was engineered on a different premise: <strong>empower everyone—students, families, backpackers, and middle-class travelers—with genuine, practical trip intelligence.</strong>
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-base font-bold text-slate-900">Multi-Modal First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We actively evaluate sleeper buses, Vande Bharat and superfast trains, shared cabs, and road trips alongside flights.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-base font-bold text-slate-900">Transparent Pricing</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every price is clearly tagged as Live Verified, Search-Result, or Heuristic Estimate. We never fabricate ticket confirmations.
          </p>
        </div>
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="text-base font-bold text-slate-900">Emergency Safety Buffer</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every plan reserves a 5-10% contingency buffer so unexpected local auto fares or food splurges never ruin your holiday.
          </p>
        </div>
      </div>

      {/* Architecture Showcase */}
      <div className="space-y-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
            Engineered with LangGraph & Groq
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            The 7-Agent Coordinated Multi-Agent Architecture
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Instead of a single monolithic prompt, TravelTwin distributes intelligence across 7 modular LangGraph agents that share a typed state.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => {
            const Icon = agent.icon;
            return (
              <div
                key={agent.name}
                className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${agent.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 leading-snug">{agent.name}</h4>
                      <span className="text-[11px] font-semibold text-slate-400 block">{agent.role}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{agent.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transparency & Disclaimer Box */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-2.5 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
          <span>Independent Research & Booking Integrity</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          TravelTwin AI is an independent research, comparison, and planning assistant. We provide deep search and verified booking links to official portals (IRCTC, RedBus, MakeMyTrip, Google Flights, Booking.com, and Zoomcar). We do not claim to directly issue tickets or process room reservations without a live booking API.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <button
          onClick={onStartPlanning}
          className="px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-brand-500/25 transition-all inline-flex items-center gap-2"
        >
          <span>Launch TravelTwin Trip Planner</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
