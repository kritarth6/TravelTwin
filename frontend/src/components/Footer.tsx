import React from 'react';
import { Compass, ShieldCheck, ExternalLink, Heart } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white">
                <Compass className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">
                TravelTwin<span className="text-brand-500">.ai</span>
              </span>
            </div>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              TravelTwin is an intelligent multi-agent travel assistant that empowers students, families, and solo explorers with multi-modal transport comparisons and transparent budget optimization.
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-200 w-fit">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Independent travel planning assistant. Real provider booking URLs provided directly.</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Navigation</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <button onClick={() => onNavigate('landing')} className="hover:text-brand-600 transition-colors">
                  Home & Explore
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('plan')} className="hover:text-brand-600 transition-colors">
                  AI Trip Planner
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('saved')} className="hover:text-brand-600 transition-colors">
                  Saved Itineraries
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-brand-600 transition-colors">
                  Multi-Agent Architecture
                </button>
              </li>
            </ul>
          </div>

          {/* Verified Providers & Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Integrated Research</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-center gap-1.5">
                <span>IRCTC & ConfirmTkt Trains</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>RedBus & InterCity Sleeper</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>Google Flights & Skyscanner</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>Booking.com & Zostel Hostels</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
              <li className="flex items-center gap-1.5">
                <span>Open-Meteo Live Forecasts</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} TravelTwin AI. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with LangGraph, Groq & Tavily for smart journeys</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

