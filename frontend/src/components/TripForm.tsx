import React, { useState } from 'react';
import { 
  MapPin, Calendar, Users, IndianRupee, Compass, Sparkles, 
  Plane, Train, Bus, Car, Key, Tag, HelpCircle, AlertCircle 
} from 'lucide-react';
import { TripRequest } from '../types/trip';

interface TripFormProps {
  onSubmit: (data: TripRequest) => void;
  isLoading: boolean;
  initialValues?: Partial<TripRequest>;
}

export const TripForm: React.FC<TripFormProps> = ({ onSubmit, isLoading, initialValues }) => {
  const [origin, setOrigin] = useState(initialValues?.origin || 'Delhi');
  const [destination, setDestination] = useState(initialValues?.destination || 'Goa');
  
  // Default departure date to 10 days from now
  const defaultStartDate = new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0];
  const defaultEndDate = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];
  
  const [startDate, setStartDate] = useState(initialValues?.start_date || defaultStartDate);
  const [endDate, setEndDate] = useState(initialValues?.end_date || defaultEndDate);
  const [travellers, setTravellers] = useState(initialValues?.travellers || 2);
  const [totalBudget, setTotalBudget] = useState(initialValues?.total_budget || 24000);
  const [travelStyle, setTravelStyle] = useState<TripRequest['travel_style']>(initialValues?.travel_style || 'Standard');
  const [preferredTransport, setPreferredTransport] = useState<TripRequest['preferred_transport']>(initialValues?.preferred_transport || 'Any');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(
    initialValues?.interests || ['Sightseeing', 'Food', 'Culture']
  );
  const [specialReqs, setSpecialReqs] = useState(initialValues?.special_requirements || '');
  const [error, setError] = useState<string | null>(null);

  const interestOptions = [
    'Sightseeing', 'Food & Dining', 'Beaches', 'Adventure', 
    'Culture & Heritage', 'Nature & Wildlife', 'Shopping', 'Nightlife', 'Relaxation'
  ];

  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter(i => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!origin.trim() || !destination.trim()) {
      setError('Please enter both your starting city and destination.');
      return;
    }
    if (totalBudget < 2000) {
      setError('Please allocate a total budget of at least ₹2,000.');
      return;
    }

    const payload: TripRequest = {
      origin: origin.trim(),
      destination: destination.trim(),
      start_date: startDate,
      end_date: endDate,
      travellers: Number(travellers),
      total_budget: Number(totalBudget),
      travel_style: travelStyle,
      preferred_transport: preferredTransport,
      interests: selectedInterests,
      special_requirements: specialReqs.trim() || undefined,
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-brand-600 to-blue-700 px-6 sm:px-8 py-6 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
            <Compass className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">Configure Your TravelTwin Plan</h2>
            <p className="text-xs sm:text-sm text-blue-100">Intelligent multi-agent synthesis comparing multi-modal transport and stays</p>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-6">
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-center gap-2.5 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Origin & Destination Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-brand-600" />
              Starting City (Origin) *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Delhi, Mumbai, Bengaluru"
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-600" />
              Destination *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Goa, Manali, Jaipur, Kerala"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-800 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Dates & Travellers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              Departure Date *
            </label>
            <input
              type="date"
              required
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-800 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-500" />
              Return Date *
            </label>
            <input
              type="date"
              required
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-slate-800 font-medium text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-500" />
              Travellers *
            </label>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setTravellers(Math.max(1, travellers - 1))}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
              >
                -
              </button>
              <span className="flex-1 text-center font-bold text-slate-800 text-sm">
                {travellers} {travellers === 1 ? 'Person' : 'People'}
              </span>
              <button
                type="button"
                onClick={() => setTravellers(Math.min(20, travellers + 1))}
                className="px-3.5 py-2.5 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Total Budget Slider & Input */}
        <div className="bg-slate-50/80 p-5 rounded-xl border border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <IndianRupee className="w-4 h-4 text-emerald-600" />
              Total Budget (INR) *
            </label>
            <div className="flex items-center gap-1 bg-white px-3 py-1 rounded-lg border border-slate-200 shadow-sm">
              <span className="text-xs font-semibold text-slate-500">₹</span>
              <input
                type="number"
                min="2000"
                step="500"
                value={totalBudget}
                onChange={(e) => setTotalBudget(Number(e.target.value))}
                className="w-24 text-right font-extrabold text-slate-900 outline-none text-base"
              />
            </div>
          </div>
          <input
            type="range"
            min="3000"
            max="150000"
            step="1000"
            value={totalBudget}
            onChange={(e) => setTotalBudget(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-600"
          />
          <div className="flex justify-between text-[11px] font-semibold text-slate-400 mt-1.5">
            <span>₹3,000 (Student)</span>
            <span>₹25,000 (Standard)</span>
            <span>₹60,000 (Family)</span>
            <span>₹1,50,000+ (Luxury)</span>
          </div>
        </div>

        {/* Travel Style Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Travel Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {(['Budget', 'Standard', 'Premium', 'Luxury'] as const).map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setTravelStyle(style)}
                className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all ${
                  travelStyle === style
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        {/* Preferred Transport Mode */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
            Preferred Transportation
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {[
              { id: 'Any', label: 'Any (Best)', icon: Compass },
              { id: 'Train', label: 'Train', icon: Train },
              { id: 'Bus', label: 'Bus', icon: Bus },
              { id: 'Flight', label: 'Flight', icon: Plane },
              { id: 'Cab', label: 'Cab', icon: Car },
              { id: 'Self-Drive', label: 'Self Drive', icon: Key },
            ].map((item) => {
              const Icon = item.icon;
              const isSelected = preferredTransport === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setPreferredTransport(item.id as TripRequest['preferred_transport'])}
                  className={`py-2.5 px-2 rounded-xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                      : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-brand-600' : 'text-slate-500'}`} />
                  <span className="text-[11px] font-semibold">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Interests Badges */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            Interests & Trip Vibe
          </label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map((interest) => {
              const isSelected = selectedInterests.includes(interest);
              return (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleInterestToggle(interest)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {interest}
                </button>
              );
            })}
          </div>
        </div>

        {/* Special Requirements */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Special Notes or Dietary Preferences (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Vegetarian only, pet friendly, prefer night travel, scenic route"
            value={specialReqs}
            onChange={(e) => setSpecialReqs(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all text-sm text-slate-800 placeholder:text-slate-400 font-medium"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-4 px-6 rounded-xl text-base font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2.5 ${
              isLoading
                ? 'bg-slate-400 cursor-not-allowed'
                : 'bg-brand-600 hover:bg-brand-700 active:scale-[0.99] shadow-brand-500/25'
            }`}
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>LangGraph Agents Researching & Optimizing...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generate Intelligent Trip Plan</span>
              </>
            )}
          </button>
          <p className="text-center text-xs text-slate-500 mt-2.5">
            Compares 5 transit modes, 4 hotel tiers, and allocates budget into 6 pillars.
          </p>
        </div>
      </div>
    </form>
  );
};
