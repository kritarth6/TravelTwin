import React, { useState } from 'react';
import { 
  Bot, CheckCircle, Sparkles, ChevronDown, ChevronUp, 
  Terminal, ShieldCheck, Activity, Cpu 
} from 'lucide-react';
import { AgentLog } from '../types/trip';

interface AgentActivityIndicatorProps {
  logs: AgentLog[];
  isDemoMode?: boolean;
}

export const AgentActivityIndicator: React.FC<AgentActivityIndicatorProps> = ({ logs, isDemoMode }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!logs || logs.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all">
      {/* Header bar */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3.5 bg-slate-50/80 hover:bg-slate-100/80 flex items-center justify-between text-left transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-brand-100 text-brand-700 rounded-lg">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">LangGraph Multi-Agent Telemetry</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                {logs.length} Agents Executed
              </span>
              {isDemoMode && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                  Sample Sandbox Mode
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500">
              Coordinated orchestration across transport, stay, weather, itinerary & budget agents.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span>{isOpen ? 'Hide Trace' : 'View Agent Trace'}</span>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expandable Trace Logs */}
      {isOpen && (
        <div className="p-5 bg-slate-900 text-slate-200 border-t border-slate-200 font-mono text-xs space-y-3 max-h-80 overflow-y-auto">
          <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-2">
            <span>AGENT IDENTIFIER & ACTION</span>
            <span>STATUS / TIME</span>
          </div>

          {logs.map((log, idx) => (
            <div key={idx} className="space-y-1 bg-slate-950/50 p-2.5 rounded-lg border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="text-brand-400 font-bold flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-slate-500" />
                  {log.agent}
                </span>
                <div className="flex items-center gap-2">
                  <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold ${
                    log.status === 'optimized' ? 'bg-amber-500/20 text-amber-300' :
                    log.status === 'warning' ? 'bg-rose-500/20 text-rose-300' :
                    'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {log.status}
                  </span>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                </div>
              </div>
              <p className="text-slate-300 text-[11px] font-sans">{log.action}</p>
              {log.details && (
                <p className="text-slate-500 text-[10px] font-sans italic border-l-2 border-slate-700 pl-2 mt-1">
                  {log.details}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
