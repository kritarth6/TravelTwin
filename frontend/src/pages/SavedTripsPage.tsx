import React from 'react';
import { TripSummary } from '../types/trip';
import { 
  Bookmark, Calendar, Users, IndianRupee, Trash2, ArrowRight, 
  MapPin, Clock, Sparkles, FolderOpen 
} from 'lucide-react';

interface SavedTripsPageProps {
  trips: TripSummary[];
  onSelectTrip: (tripId: string) => void;
  onDeleteTrip: (tripId: string) => void;
  onPlanNewTrip: () => void;
}

export const SavedTripsPage: React.FC<SavedTripsPageProps> = ({ 
  trips, 
  onSelectTrip, 
  onDeleteTrip, 
  onPlanNewTrip 
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider">
            <Bookmark className="w-4 h-4" />
            <span>SQLite Local Storage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Saved Trip Itineraries
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            View, reload, or refine any previously generated travel plan stored in your database.
          </p>
        </div>

        <button
          onClick={onPlanNewTrip}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-brand-600 hover:bg-brand-700 active:scale-95 text-white rounded-xl text-xs font-bold transition-all shadow-sm w-fit"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Plan New Journey</span>
        </button>
      </div>

      {/* Empty State */}
      {trips.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 max-w-md mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FolderOpen className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No Saved Itineraries Yet</h3>
            <p className="text-xs text-slate-500">
              Plans you generate are automatically saved to your SQLite database for future reference.
            </p>
          </div>
          <button
            onClick={onPlanNewTrip}
            className="px-5 py-2.5 bg-slate-900 hover:bg-brand-600 text-white rounded-xl text-xs font-bold transition-all"
          >
            Create Your First Trip
          </button>
        </div>
      ) : (
        /* Trips Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {trips.map((trip) => (
            <div
              key={trip.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-brand-500 hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-50 text-brand-700 border border-brand-200">
                    {trip.travel_style}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteTrip(trip.id);
                    }}
                    title="Delete itinerary"
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                    {trip.origin} → {trip.destination}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{trip.start_date} ({trip.duration_days} Days)</span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Travel Group</span>
                    <span className="font-bold text-slate-800">{trip.travellers} Person{trip.travellers > 1 ? 's' : ''}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-medium block">Total Estimate</span>
                    <span className="font-bold text-emerald-700">₹{Math.round(trip.total_estimated_cost).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {trip.overview && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                    "{trip.overview}"
                  </p>
                )}
              </div>

              <div className="border-t border-slate-100 pt-3 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  Updated {new Date(trip.updated_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => onSelectTrip(trip.id)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 group-hover:text-brand-700"
                >
                  <span>Open Dashboard</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
