import React from 'react';
import { X, TrendingDown, TrendingUp, Newspaper, Lightbulb, Shield, ShoppingCart } from 'lucide-react';
import { Holding } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface ImpactStock {
  symbol: string;
  change: number;
  impact: number;
  contribution: number;
}

interface WhyDownTodayProps {
  totalChange: number;
  changePercent: number;
  impactBreakdown: ImpactStock[];
  newsItems: string[];
  suggestion: string;
  onAction: (action: string) => void;
  onClose: () => void;
}

const WhyDownToday: React.FC<WhyDownTodayProps> = ({
  totalChange,
  changePercent,
  impactBreakdown,
  newsItems,
  suggestion,
  onAction,
  onClose,
}) => {
  const isDown = totalChange < 0;

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between border-b border-navy-700/50 ${
        isDown ? 'bg-gradient-to-r from-red-500/20 to-red-600/10' : 'bg-gradient-to-r from-green-500/20 to-green-600/10'
      }`}>
        <div className="flex items-center gap-2">
          {isDown ? (
            <TrendingDown className="w-5 h-5 text-red-500" />
          ) : (
            <TrendingUp className="w-5 h-5 text-green-500" />
          )}
          <h3 className="font-semibold text-white">Today's Portfolio Impact</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Total Change */}
        <div className="text-center py-2">
          <p className="text-sm text-slate-400 mb-1">Your portfolio is {isDown ? 'down' : 'up'}</p>
          <p className={`text-3xl font-bold ${isDown ? 'text-red-500' : 'text-green-500'}`}>
            {isDown ? '' : '+'}{formatCurrency(totalChange)}
          </p>
          <p className={`text-sm ${isDown ? 'text-red-400' : 'text-green-400'}`}>
            ({isDown ? '' : '+'}{changePercent.toFixed(2)}%)
          </p>
        </div>

        {/* Impact Breakdown */}
        <div className="bg-navy-900/50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-3">Impact Breakdown</h4>
          <div className="space-y-2">
            {impactBreakdown.map(stock => (
              <div key={stock.symbol} className="flex items-center justify-between py-1.5 border-b border-navy-700/30 last:border-0">
                <div className="flex items-center gap-2">
                  {stock.impact < 0 ? (
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                  ) : (
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                  )}
                  <span className="text-sm text-slate-300">{stock.symbol}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`text-xs ${stock.change < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(1)}%
                  </span>
                  <span className={`text-sm font-mono ${stock.impact < 0 ? 'text-red-400' : 'text-green-400'}`}>
                    {stock.impact >= 0 ? '+' : ''}{formatCurrency(stock.impact)}
                  </span>
                  <span className="text-xs text-slate-500 w-16 text-right">
                    {stock.contribution > 0 ? `${stock.contribution}% of loss` : 'offset'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* News Section */}
        <div className="bg-navy-900/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-3">
            <Newspaper className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-medium text-white">Why This Happened</h4>
          </div>
          <ul className="space-y-2">
            {newsItems.map((news, index) => (
              <li key={index} className="text-xs text-slate-400 flex items-start gap-2">
                <span className="text-slate-500">•</span>
                {news}
              </li>
            ))}
          </ul>
          <button className="text-xs text-blue-400 hover:text-blue-300 mt-2">
            View Full News →
          </button>
        </div>

        {/* AI Suggestion */}
        <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg p-3 border border-purple-500/20">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-medium text-purple-400 mb-1">AI Suggestion</h4>
              <p className="text-xs text-slate-300">{suggestion}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onAction('BUY_THE_DIP')}
            className="flex-1 py-2.5 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium border border-blue-500/30 hover:bg-blue-500/30 transition-colors flex items-center justify-center gap-1"
          >
            <ShoppingCart className="w-4 h-4" />
            Buy the Dip
          </button>
          <button
            onClick={() => onAction('SET_STOP_LOSS')}
            className="flex-1 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 text-sm font-medium border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1"
          >
            <Shield className="w-4 h-4" />
            Set Stop-Loss
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhyDownToday;
