import React, { useState } from 'react';
import { 
  Sun, Sunset, Moon, Utensils, Compass, Clock, MapPin, 
  IndianRupee, AlertCircle, Sparkles, Navigation 
} from 'lucide-react';
import { DayItinerary } from '../types/trip';

interface ItineraryTimelineProps {
  itinerary: DayItinerary[];
}

export const ItineraryTimeline: React.FC<ItineraryTimelineProps> = ({ itinerary }) => {
  const [activeDayIndex, setActiveDayIndex] = useState(0);

  if (!itinerary || itinerary.length === 0) {
    return <div className="text-slate-500 text-sm">No itinerary generated yet.</div>;
  }

  const currentDay = itinerary[activeDayIndex] || itinerary[0];

  return (
    <div className="space-y-6">
      {/* Header and Day Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Personalized Day-by-Day Itinerary</h3>
          <p className="text-xs text-slate-500">
            Geographically grouped schedule with realistic pacing and verified timing.
          </p>
        </div>

        {/* Day Switcher Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {itinerary.map((day, idx) => (
            <button
              key={day.day_number}
              onClick={() => setActiveDayIndex(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                activeDayIndex === idx
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Day {day.day_number}
            </button>
          ))}
        </div>
      </div>

      {/* Active Day Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 bg-brand-500 text-white rounded-md text-[11px] font-bold">
              {currentDay.date}
            </span>
            <span className="text-xs text-slate-300 font-medium">Day {currentDay.day_number} Plan</span>
          </div>
          <h4 className="text-lg font-extrabold mt-1">{currentDay.title}</h4>
          <p className="text-xs text-slate-300">{currentDay.theme}</p>
        </div>

        <div className="sm:text-right bg-white/10 px-3.5 py-2 rounded-xl backdrop-blur-sm self-start sm:self-auto">
          <span className="text-[11px] text-slate-300 block">Est. Daily Spend</span>
          <span className="text-base font-extrabold text-white">
            ₹{Math.round(currentDay.estimated_daily_expense).toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* 3-Time Slot Activity Timeline (Morning, Afternoon, Evening) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Morning */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
                <Sun className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Morning</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">{currentDay.morning.time}</span>
          </div>

          <h5 className="text-sm font-bold text-slate-900 leading-snug">{currentDay.morning.activity}</h5>
          
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentDay.morning.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{currentDay.morning.estimated_duration}</span>
            </div>
            {currentDay.morning.cost > 0 && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                <span>Entry fee: ₹{Math.round(currentDay.morning.cost)}</span>
              </div>
            )}
          </div>

          {currentDay.morning.tips && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              💡 {currentDay.morning.tips}
            </p>
          )}
        </div>

        {/* Afternoon */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-sky-50 text-sky-600 rounded-lg">
                <Sunset className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Afternoon</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">{currentDay.afternoon.time}</span>
          </div>

          <h5 className="text-sm font-bold text-slate-900 leading-snug">{currentDay.afternoon.activity}</h5>
          
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentDay.afternoon.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{currentDay.afternoon.estimated_duration}</span>
            </div>
            {currentDay.afternoon.cost > 0 && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                <span>Entry fee: ₹{Math.round(currentDay.afternoon.cost)}</span>
              </div>
            )}
          </div>

          {currentDay.afternoon.tips && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              💡 {currentDay.afternoon.tips}
            </p>
          )}
        </div>

        {/* Evening */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">Evening</span>
            </div>
            <span className="text-[11px] font-medium text-slate-500">{currentDay.evening.time}</span>
          </div>

          <h5 className="text-sm font-bold text-slate-900 leading-snug">{currentDay.evening.activity}</h5>
          
          <div className="space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{currentDay.evening.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>{currentDay.evening.estimated_duration}</span>
            </div>
            {currentDay.evening.cost > 0 && (
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold">
                <IndianRupee className="w-3.5 h-3.5 shrink-0" />
                <span>Est. Spend: ₹{Math.round(currentDay.evening.cost)}</span>
              </div>
            )}
          </div>

          {currentDay.evening.tips && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              💡 {currentDay.evening.tips}
            </p>
          )}
        </div>
      </div>

      {/* Regional Dining Spots & Mobility Advice */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Food Recommendations */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-lg">
              <Utensils className="w-4 h-4" />
            </div>
            <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Authentic Food & Dining</h5>
          </div>

          <div className="space-y-2.5">
            {currentDay.food_recommendations.map((food, i) => (
              <div key={i} className="flex items-center justify-between text-xs p-2.5 bg-slate-50 rounded-xl">
                <div>
                  <span className="font-bold text-slate-900 block">{food.meal}: {food.specialty}</span>
                  <span className="text-slate-500 text-[11px]">{food.spot_name}</span>
                </div>
                <span className="font-extrabold text-slate-800 text-xs shrink-0 bg-white px-2 py-1 rounded-md border border-slate-200">
                  ~₹{Math.round(food.approx_cost_per_person)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Local Transport Advice */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <div className="p-1.5 bg-teal-50 text-teal-600 rounded-lg">
                <Navigation className="w-4 h-4" />
              </div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Day Mobility & Transit</h5>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed mt-3">
              {currentDay.local_transport_advice}
            </p>
          </div>

          <div className="p-3 bg-teal-50/70 border border-teal-200/60 rounded-xl text-teal-900 text-xs flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
            <span>Optimal route grouped geographically to avoid counter-directional cab rides.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

