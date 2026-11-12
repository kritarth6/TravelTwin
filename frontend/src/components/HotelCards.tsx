import React, { useState } from 'react';
import { Star, MapPin, Sparkles, ExternalLink, Wifi, Check, Building2, SlidersHorizontal } from 'lucide-react';
import { AccommodationOption } from '../types/trip';

interface HotelCardsProps {
  options: AccommodationOption[];
  nights: number;
}

export const HotelCards: React.FC<HotelCardsProps> = ({ options, nights }) => {
  const [tierFilter, setTierFilter] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);

  const tiers = ['All', 'Budget', 'Standard', 'Premium', 'Luxury'];

  const filteredOptions = options.filter((opt) => {
    if (tierFilter !== 'All' && opt.tier !== tierFilter) return false;
    if (opt.rating < minRating) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Header and Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Accommodation Across 4 Tiers</h3>
          <p className="text-xs text-slate-500">
            Priced for {nights} night{nights > 1 ? 's' : ''} with verified booking portals.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {tiers.map((t) => (
              <button
                key={t}
                onClick={() => setTierFilter(t)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  tierFilter === t
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="px-2.5 py-1 text-xs font-semibold rounded-xl border border-slate-200 bg-white text-slate-700 outline-none"
          >
            <option value="0">Any Rating</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="4.5">4.5+ Stars</option>
          </select>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredOptions.map((hotel) => {
          const isRec = hotel.recommended;
          return (
            <div
              key={hotel.id}
              className={`rounded-2xl border overflow-hidden bg-white flex flex-col justify-between transition-all ${
                isRec
                  ? 'border-brand-500 ring-2 ring-brand-500/20 shadow-md'
                  : 'border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              <div>
                {/* Image Container with Badges */}
                <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                  <img
                    src={hotel.image_url}
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold shadow-sm ${
                      hotel.tier === 'Budget' ? 'bg-emerald-600 text-white' :
                      hotel.tier === 'Standard' ? 'bg-blue-600 text-white' :
                      hotel.tier === 'Premium' ? 'bg-indigo-600 text-white' :
                      'bg-amber-600 text-white'
                    }`}>
                      {hotel.tier}
                    </span>
                    {isRec && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-400 text-slate-900 flex items-center gap-1 shadow-sm">
                        <Sparkles className="w-3 h-3" />
                        Selected
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 right-2.5 bg-slate-900/80 backdrop-blur-sm text-white px-2 py-0.5 rounded-md text-xs font-bold flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{hotel.rating.toFixed(1)}</span>
                    {hotel.reviews_count ? (
                      <span className="text-[10px] text-slate-300 font-normal">({hotel.reviews_count})</span>
                    ) : null}
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-4 space-y-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      {hotel.category}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                      {hotel.name}
                    </h4>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{hotel.location}</span>
                    </p>
                    <span className="inline-block mt-0.5 text-[11px] font-medium text-slate-600">
                      {hotel.distance_from_center}
                    </span>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {hotel.amenities.slice(0, 3).map((amenity, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-slate-50 text-slate-600 rounded text-[10px] font-medium border border-slate-100"
                      >
                        {amenity}
                      </span>
                    ))}
                    {hotel.amenities.length > 3 && (
                      <span className="px-1.5 py-0.5 bg-slate-50 text-slate-400 rounded text-[10px]">
                        +{hotel.amenities.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Footer */}
              <div className="p-4 pt-0">
                <div className="border-t border-slate-100 pt-3 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-medium">
                      ₹{Math.round(hotel.price_per_night).toLocaleString('en-IN')}/night
                    </span>
                    <span className="text-base font-extrabold text-slate-900">
                      ₹{Math.round(hotel.total_cost).toLocaleString('en-IN')}
                    </span>
                  </div>

                  <a
                    href={hotel.booking_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      isRec
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    <span>View Stay</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

