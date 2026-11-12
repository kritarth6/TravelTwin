import React from 'react';
import { 
  Compass, ArrowRight, ShieldCheck, Sparkles, Train, Plane, Bus, 
  IndianRupee, MapPin, Calendar, HeartHandshake, Zap, CheckCircle2, ChevronRight 
} from 'lucide-react';
import { TripRequest } from '../types/trip';

interface LandingPageProps {
  onStartPlanning: (prefill?: Partial<TripRequest>) => void;
  onExploreTrip: (destination: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartPlanning, onExploreTrip }) => {
  const featuredDestinations = [
    {
      name: 'Goa',
      tagline: 'Sun, Golden Beaches & Heritage Forts',
      state: 'Goa, India',
      image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80',
      minBudget: '₹6,500',
      transit: 'Train / Bus / Flight',
      recommendedDays: '4 Days',
      prefill: { origin: 'Mumbai', destination: 'Goa', total_budget: 18000, travellers: 2 }
    },
    {
      name: 'Jaipur',
      tagline: 'Pink City Palaces & Royal Bazaars',
      state: 'Rajasthan, India',
      image: 'https://images.unsplash.com/photo-1603258849045-814bfbce0550?auto=format&fit=crop&w=800&q=80',
      minBudget: '₹4,500',
      transit: 'Superfast Train / AC Bus',
      recommendedDays: '3 Days',
      prefill: { origin: 'Delhi', destination: 'Jaipur', total_budget: 12000, travellers: 2 }
    },
    {
      name: 'Manali',
      tagline: 'Snow Peaks, Solang Valley & Pine Forests',
      state: 'Himachal Pradesh, India',
      image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800&q=80',
      minBudget: '₹7,500',
      transit: 'Overnight Volvo / Cab',
      recommendedDays: '4 Days',
      prefill: { origin: 'Delhi', destination: 'Manali', total_budget: 20000, travellers: 2 }
    },
    {
      name: 'Kochi & Munnar',
      tagline: 'Emerald Tea Gardens & Coastal Backwaters',
      state: 'Kerala, India',
      image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80',
      minBudget: '₹8,900',
      transit: 'Train / Flight / Scenic Cab',
      recommendedDays: '5 Days',
      prefill: { origin: 'Bengaluru', destination: 'Kerala', total_budget: 25000, travellers: 2 }
    }
  ];

  return (
    <div className="space-y-24">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Autonomous Multi-Agent AI Travel Architecture</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 max-w-4xl mx-auto leading-[1.1]">
            Your Journey, <span className="bg-gradient-to-r from-brand-600 to-blue-600 bg-clip-text text-transparent">Intelligently Planned</span> for Every Budget.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Most travel planners assume you want flights and 5-star resorts. 
            TravelTwin compares <strong>trains, sleeper buses, cabs, hostels, and standard hotels</strong> to curate real, affordable itineraries.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onStartPlanning()}
              className="w-full sm:w-auto px-8 py-4 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-brand-500/25 transition-all flex items-center justify-center gap-2.5"
            >
              <span>Plan Your Trip With AI</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => onExploreTrip('Goa')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-base rounded-2xl shadow-sm transition-all"
            >
              Explore Sample Itinerary
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl font-extrabold text-slate-900 block">5 Modes</span>
              <span className="text-xs text-slate-500 font-medium">Flight, Train, Bus, Cab, Self-Drive</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl font-extrabold text-slate-900 block">4 Stays</span>
              <span className="text-xs text-slate-500 font-medium">Hostels, Standard, Premium, Luxury</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl font-extrabold text-slate-900 block">6 Pillars</span>
              <span className="text-xs text-slate-500 font-medium">Transparent Budget Allocation</span>
            </div>
            <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-2xl font-extrabold text-slate-900 block">7 Agents</span>
              <span className="text-xs text-slate-500 font-medium">LangGraph Coordinated Engine</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Destinations Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Popular Getaways
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Featured TravelTwin Routes
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm">
            Click any destination to prefill real coordinates, multi-modal transport, and verified stays.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredDestinations.map((dest) => (
            <div
              key={dest.name}
              onClick={() => onStartPlanning(dest.prefill)}
              className="group cursor-pointer rounded-2xl border border-slate-200 overflow-hidden bg-white hover:border-brand-500 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden">
                  <img
                    src={dest.image}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-lg">
                    From {dest.minBudget}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {dest.recommendedDays}
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-brand-600" />
                    <span>{dest.state}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {dest.name}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {dest.tagline}
                  </p>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs font-bold text-brand-600 group-hover:text-brand-700">
                  <span>Plan this trip</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why TravelTwin: 4 Core Pillars */}
      <section className="bg-slate-100/70 border-y border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">
              Built for Real Travelers
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900">
              Why TravelTwin Outperforms Standard AI Chatbots
            </h2>
            <p className="text-sm text-slate-600">
              Generic LLMs guess flights and hallucinate prices. TravelTwin deploys dedicated LangGraph agents that verify and allocate real budgets.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-600 flex items-center justify-center">
                <Train className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Multi-Modal Transit Comparison</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Evaluates superfast trains, multi-axle sleeper buses, cabs, self-drive, and flights. Highlights affordable choices rather than defaulting to expensive flights.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <IndianRupee className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Autonomous Budget Optimizer</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If the plan exceeds your budget, our Budget Agent automatically explores cheaper transit, swaps stays to verified hostels, and reserves an emergency buffer.
              </p>
            </div>

            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900">Conversational Refinement</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Want to make the trip cheaper or swap a bus for a train? TravelTwin updates only the relevant sections without destroying your itinerary.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works (4 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block">The Workflow</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">How TravelTwin Operates</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: '01', title: 'Input Constraints', desc: 'Tell us starting city, destination, dates, traveler count, and total budget in INR.' },
            { step: '02', title: 'Multi-Agent Research', desc: 'Tavily, Open-Meteo, and Groq research live transit routes, stays, and weather.' },
            { step: '03', title: 'Budget Balancing', desc: 'Expenses are divided across stay, transit, food, local travel, and emergency buffer.' },
            { step: '04', title: 'Interactive Map & Links', desc: 'Review day-wise schedule, OpenStreetMap pins, and real IRCTC/Booking.com provider links.' }
          ].map((item) => (
            <div key={item.step} className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm space-y-2.5">
              <span className="text-3xl font-black text-brand-600/30 block font-mono">{item.step}</span>
              <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
              <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-brand-900 to-slate-900 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-2xl">
          <h2 className="text-3xl sm:text-4xl font-extrabold max-w-2xl mx-auto">
            Ready to plan your next journey without the guesswork?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto">
            Start planning with TravelTwin today. Zero signup required. Complete transparency on pricing and travel routes.
          </p>
          <div>
            <button
              onClick={() => onStartPlanning()}
              className="px-8 py-4 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-extrabold text-base rounded-2xl shadow-lg transition-all inline-flex items-center gap-2"
            >
              <span>Launch Trip Planner</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
