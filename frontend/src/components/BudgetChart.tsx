import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend 
} from 'recharts';
import { IndianRupee, ShieldCheck, AlertTriangle, Sparkles, CheckCircle2 } from 'lucide-react';
import { BudgetBreakdown } from '../types/trip';

interface BudgetChartProps {
  breakdown: BudgetBreakdown;
  travellers: number;
}

export const BudgetChart: React.FC<BudgetChartProps> = ({ breakdown, travellers }) => {
  const chartData = [
    { name: 'Intercity Transport', value: breakdown.intercity_transport, color: '#0284c7' }, // Sky
    { name: 'Accommodation', value: breakdown.accommodation, color: '#6366f1' }, // Indigo
    { name: 'Dining & Food', value: breakdown.food, color: '#f59e0b' }, // Amber
    { name: 'Local Mobility', value: breakdown.local_transport, color: '#0d9488' }, // Teal
    { name: 'Activities & Sights', value: breakdown.activities_sightseeing, color: '#ec4899' }, // Pink
    { name: 'Emergency Buffer', value: breakdown.emergency_buffer, color: '#10b981' }, // Emerald
  ].filter(item => item.value > 0);

  const formatINR = (val: number) => `₹${Math.round(val).toLocaleString('en-IN')}`;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      const percent = ((data.value / breakdown.total_estimated_cost) * 100).toFixed(1);
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-lg text-xs space-y-1">
          <p className="font-bold">{data.name}</p>
          <p className="text-amber-300 font-extrabold text-sm">{formatINR(data.value)}</p>
          <p className="text-slate-400 text-[10px]">{percent}% of estimated expenditure</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">Budget Breakdown & Allocation</h3>
          <p className="text-xs text-slate-500">
            Intelligently partitioned into 6 pillars with a built-in emergency safety buffer.
          </p>
        </div>

        {/* Status Badge */}
        {breakdown.is_within_budget ? (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Comfortably Within Budget</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl text-xs font-bold">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Budget Exceeded</span>
          </div>
        )}
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Allocated</span>
          <span className="text-xl font-extrabold text-slate-900">{formatINR(breakdown.total_budget)}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Budget limit specified by you</span>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Expenditure</span>
          <span className="text-xl font-extrabold text-brand-700">{formatINR(breakdown.total_estimated_cost)}</span>
          <span className="text-[11px] text-slate-500 block mt-0.5">Includes stay, transport, food & buffer</span>
        </div>

        <div className={`p-4 rounded-xl border ${
          breakdown.remaining_balance >= 0 
            ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
            : 'bg-rose-50/70 border-rose-200 text-rose-900'
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-wider block opacity-75">
            {breakdown.remaining_balance >= 0 ? 'Remaining Buffer' : 'Budget Deficit'}
          </span>
          <span className="text-xl font-extrabold">
            {formatINR(Math.abs(breakdown.remaining_balance))}
          </span>
          <span className="text-[11px] block mt-0.5 opacity-80">
            {breakdown.remaining_balance >= 0 ? 'Available for shopping / leisure' : 'Needs budget expansion'}
          </span>
        </div>
      </div>

      {/* Visualization Chart & Legend */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Recharts Donut Pie */}
        <div className="lg:col-span-6 h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend List */}
        <div className="lg:col-span-6 space-y-2">
          {chartData.map((item) => {
            const percent = ((item.value / breakdown.total_estimated_cost) * 100).toFixed(0);
            return (
              <div key={item.name} className="flex items-center justify-between text-xs p-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="font-semibold text-slate-800">{item.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-medium">{percent}%</span>
                  <span className="font-bold text-slate-900">{formatINR(item.value)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Optimization Notes */}
      {breakdown.optimization_notes && breakdown.optimization_notes.length > 0 && (
        <div className="p-4 bg-brand-50/60 border border-brand-200/80 rounded-xl space-y-1.5">
          <div className="flex items-center gap-1.5 text-brand-900 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Budget Agent Insights</span>
          </div>
          <ul className="space-y-1 text-xs text-brand-800 pl-4 list-disc">
            {breakdown.optimization_notes.map((note, idx) => (
              <li key={idx}>{note}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

