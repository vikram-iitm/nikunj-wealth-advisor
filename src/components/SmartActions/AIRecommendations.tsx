import React from 'react';
import { X, Lightbulb, Star, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatCurrency } from '../../services/mockData';

interface RecommendedStock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  change: number;
  matchScore: number;
  reasons: string[];
}

interface AIRecommendationsProps {
  recommendations: RecommendedStock[];
  onAddToWatchlist: (symbol: string) => void;
  onClose: () => void;
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({
  recommendations,
  onAddToWatchlist,
  onClose,
}) => {
  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-500/20 to-pink-500/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-white">AI Stock Recommendations</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-400">Based on your portfolio gaps and risk profile</p>

        {/* Recommendations */}
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {recommendations.map((stock, index) => (
            <div
              key={stock.symbol}
              className="bg-navy-900/50 rounded-lg p-4 border border-navy-700/50"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">#{index + 1}</span>
                    <span className="font-semibold text-white">{stock.symbol}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                      Match: {stock.matchScore}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">{stock.name}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-white">{formatCurrency(stock.currentPrice)}</p>
                  <p className={`text-xs ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Mini chart placeholder */}
              <div className="h-10 bg-navy-800/50 rounded mb-3 flex items-center justify-center">
                <svg viewBox="0 0 100 30" className="w-full h-full text-purple-500/50">
                  <path
                    d="M0,20 L20,15 L40,18 L60,10 L80,12 L100,5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-1.5">Why This Stock:</p>
                <div className="space-y-1">
                  {stock.reasons.map((reason, idx) => (
                    <p key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-green-500">✓</span>
                      {reason}
                    </p>
                  ))}
                </div>
              </div>

              <button
                onClick={() => onAddToWatchlist(stock.symbol)}
                className="w-full py-2 rounded-lg bg-navy-700/50 text-slate-300 text-sm font-medium border border-navy-600/30 hover:bg-navy-700 hover:text-white transition-colors flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add to Watchlist
              </button>
            </div>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="flex items-start gap-2 p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-amber-200/80">
            These are AI suggestions, not financial advice. Please do your own research before investing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AIRecommendations;
