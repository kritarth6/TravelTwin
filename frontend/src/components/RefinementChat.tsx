import React, { useState } from 'react';
import { Sparkles, Send, MessageSquare, IndianRupee, RefreshCw, CheckCircle2 } from 'lucide-react';

interface RefinementChatProps {
  tripId: string;
  aiExplanation: string;
  onRefine: (prompt: string) => Promise<void>;
  isRefining: boolean;
}

export const RefinementChat: React.FC<RefinementChatProps> = ({ 
  tripId, 
  aiExplanation, 
  onRefine, 
  isRefining 
}) => {
  const [prompt, setPrompt] = useState('');

  const quickPrompts = [
    'Can you make this trip cheaper?',
    'Replace with train',
    'Switch to bus',
    'Suggest budget hostel stays',
    'Keep total budget under ₹20,000',
    'Add more adventure & beach spots'
  ];

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim() || isRefining) return;
    const text = prompt.trim();
    setPrompt('');
    await onRefine(text);
  };

  const handleQuickClick = async (qp: string) => {
    if (isRefining) return;
    await onRefine(qp);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
      {/* AI Explanation Banner */}
      <div className="bg-gradient-to-br from-brand-50 to-blue-50/40 border border-brand-200/80 rounded-xl p-5 space-y-2">
        <div className="flex items-center gap-2 text-brand-900 font-bold text-sm">
          <Sparkles className="w-4 h-4 text-brand-600" />
          <span>Why TravelTwin Selected This Plan</span>
        </div>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
          {aiExplanation}
        </p>
      </div>

      {/* Refinement Chat Header */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-brand-600" />
          <span>Conversational Plan Refinement</span>
        </h4>
        <p className="text-xs text-slate-500 mt-0.5">
          Ask TravelTwin to adjust transport, downgrade stays, or trim costs without regenerating the entire trip.
        </p>
      </div>

      {/* Quick Action Chips */}
      <div className="flex flex-wrap gap-1.5">
        {quickPrompts.map((qp, idx) => (
          <button
            key={idx}
            disabled={isRefining}
            onClick={() => handleQuickClick(qp)}
            className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSend} className="flex gap-2">
        <input
          type="text"
          disabled={isRefining}
          placeholder="e.g. Make it cheaper, switch to train, or suggest higher rated hotels..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="flex-1 px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-200 outline-none transition-all placeholder:text-slate-400 font-medium"
        />
        <button
          type="submit"
          disabled={isRefining || !prompt.trim()}
          className="px-4 py-2.5 bg-slate-900 hover:bg-brand-600 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-bold transition-all disabled:bg-slate-300 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
        >
          {isRefining ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin text-white" />
              <span className="hidden sm:inline">Refining...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Refine</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
