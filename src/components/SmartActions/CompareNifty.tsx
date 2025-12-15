import React from 'react';
import { X, TrendingUp, Trophy, Share2 } from 'lucide-react';
import { formatCurrency } from '../../services/mockData';

interface CompareNiftyProps {
  portfolioReturns: { period: string; return: number }[];
  niftyReturns: { period: string; return: number }[];
  alphaGenerated: number;
  alphaValue: number;
  onClose: () => void;
}

const CompareNifty: React.FC<CompareNiftyProps> = ({
  portfolioReturns,
  niftyReturns,
  alphaGenerated,
  alphaValue,
  onClose,
}) => {
  const periods = ['1 Month', '3 Months', '6 Months', '1 Year'];

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-indigo-500/20 to-indigo-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-indigo-500" />
          <h3 className="font-semibold text-white">Portfolio vs NIFTY 50</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Performance Chart */}
        <div className="bg-navy-900/50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-3">Performance Comparison (1 Year)</h4>
          <div className="h-40 relative">
            {/* Simple chart visualization */}
            <svg viewBox="0 0 300 100" className="w-full h-full">
              {/* Grid lines */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#334155" strokeWidth="0.5" strokeDasharray="4" />

              {/* NIFTY line */}
              <path
                d="M0,70 C50,65 100,55 150,50 C200,45 250,35 300,40"
                fill="none"
                stroke="#6366f1"
                strokeWidth="2"
                opacity="0.7"
              />

              {/* Portfolio line */}
              <path
                d="M0,75 C50,60 100,45 150,35 C200,25 250,15 300,20"
                fill="none"
                stroke="#22c55e"
                strokeWidth="2.5"
              />

              {/* Legend */}
              <g transform="translate(200, 10)">
                <line x1="0" y1="5" x2="15" y2="5" stroke="#22c55e" strokeWidth="2" />
                <text x="20" y="8" fill="#94a3b8" fontSize="8">Your Portfolio</text>
              </g>
              <g transform="translate(200, 22)">
                <line x1="0" y1="5" x2="15" y2="5" stroke="#6366f1" strokeWidth="2" />
                <text x="20" y="8" fill="#94a3b8" fontSize="8">NIFTY 50</text>
              </g>

              {/* Y-axis labels */}
              <text x="5" y="28" fill="#64748b" fontSize="8">+20%</text>
              <text x="5" y="53" fill="#64748b" fontSize="8">+10%</text>
              <text x="5" y="78" fill="#64748b" fontSize="8">0%</text>

              {/* X-axis labels */}
              <text x="30" y="95" fill="#64748b" fontSize="8">Jan</text>
              <text x="90" y="95" fill="#64748b" fontSize="8">Apr</text>
              <text x="150" y="95" fill="#64748b" fontSize="8">Jul</text>
              <text x="210" y="95" fill="#64748b" fontSize="8">Oct</text>
              <text x="270" y="95" fill="#64748b" fontSize="8">Dec</text>
            </svg>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="bg-navy-900/50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-3 gap-2 px-4 py-2 text-xs text-slate-500 border-b border-navy-700/50">
            <span>Period</span>
            <span className="text-right text-green-400">Your Portfolio</span>
            <span className="text-right text-indigo-400">NIFTY 50</span>
          </div>
          {periods.map((period, idx) => (
            <div key={period} className="grid grid-cols-3 gap-2 px-4 py-2.5 text-sm border-b border-navy-700/30 last:border-0">
              <span className="text-slate-300">{period}</span>
              <span className={`text-right font-mono ${portfolioReturns[idx]?.return >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {portfolioReturns[idx]?.return >= 0 ? '+' : ''}{portfolioReturns[idx]?.return.toFixed(1)}%
              </span>
              <span className={`text-right font-mono ${niftyReturns[idx]?.return >= 0 ? 'text-indigo-400' : 'text-red-400'}`}>
                {niftyReturns[idx]?.return >= 0 ? '+' : ''}{niftyReturns[idx]?.return.toFixed(1)}%
              </span>
            </div>
          ))}
        </div>

        {/* Alpha Generated */}
        <div className={`rounded-lg p-4 border ${
          alphaGenerated >= 0
            ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30'
            : 'bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-500/30'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Trophy className={`w-5 h-5 ${alphaGenerated >= 0 ? 'text-green-400' : 'text-red-400'}`} />
            <span className={`text-lg font-bold ${alphaGenerated >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              Alpha Generated: {alphaGenerated >= 0 ? '+' : ''}{alphaGenerated.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-slate-300">
            {alphaGenerated >= 0 ? (
              <>
                You're outperforming the market! Your stock selection has added{' '}
                <span className="text-green-400 font-medium">{formatCurrency(alphaValue)}</span> in value
                compared to just investing in NIFTY 50 index.
              </>
            ) : (
              <>
                Your portfolio is underperforming the market. Consider reviewing your holdings
                or investing in a NIFTY 50 index fund for better returns.
              </>
            )}
          </p>
        </div>

        {/* Share Button */}
        <button className="w-full py-3 rounded-lg bg-indigo-500 text-white font-semibold hover:bg-indigo-400 transition-colors flex items-center justify-center gap-2">
          <Share2 className="w-5 h-5" />
          Share Performance Report
        </button>
      </div>
    </div>
  );
};

export default CompareNifty;
