import React from 'react';
import { X, PieChart, AlertTriangle, CheckCircle, TrendingUp, TrendingDown, Shield } from 'lucide-react';
import { Portfolio } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface PortfolioDeepAnalysisProps {
  portfolio: Portfolio;
  sectorAllocation: Record<string, number>;
  onAction: (action: string) => void;
  onClose: () => void;
}

const PortfolioDeepAnalysis: React.FC<PortfolioDeepAnalysisProps> = ({
  portfolio,
  sectorAllocation,
  onAction,
  onClose,
}) => {
  const topPerformers = [...portfolio.holdings]
    .sort((a, b) => {
      const pnlA = ((a.currentPrice - a.avgPrice) / a.avgPrice) * 100;
      const pnlB = ((b.currentPrice - b.avgPrice) / b.avgPrice) * 100;
      return pnlB - pnlA;
    })
    .slice(0, 3);

  const needsAttention = [...portfolio.holdings]
    .sort((a, b) => {
      const pnlA = ((a.currentPrice - a.avgPrice) / a.avgPrice) * 100;
      const pnlB = ((b.currentPrice - b.avgPrice) / b.avgPrice) * 100;
      return pnlA - pnlB;
    })
    .slice(0, 2);

  const highestSector = Object.entries(sectorAllocation).sort((a, b) => b[1] - a[1])[0];
  const hasConcentrationRisk = highestSector && highestSector[1] > 30;

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-purple-500/20 to-purple-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <PieChart className="w-5 h-5 text-purple-500" />
          <h3 className="font-semibold text-white">Portfolio Analysis</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Portfolio Value</p>
            <p className="text-xl font-bold text-white">{formatCurrency(portfolio.totalValue)}</p>
          </div>
          <div className="bg-navy-900/50 rounded-lg p-3">
            <p className="text-xs text-slate-500 mb-1">Overall P&L</p>
            <p className={`text-xl font-bold ${portfolio.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {portfolio.totalPnL >= 0 ? '+' : ''}{formatCurrency(portfolio.totalPnL)}
            </p>
            <p className={`text-xs ${portfolio.totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ({portfolio.totalPnLPercent >= 0 ? '+' : ''}{portfolio.totalPnLPercent.toFixed(2)}%)
            </p>
          </div>
        </div>

        {/* Sector Allocation */}
        <div className="bg-navy-900/50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-white mb-3">Sector Allocation</h4>
          <div className="space-y-2">
            {Object.entries(sectorAllocation)
              .sort((a, b) => b[1] - a[1])
              .map(([sector, percentage]) => (
                <div key={sector} className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 w-20 truncate">{sector}</span>
                  <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        percentage > 30 ? 'bg-amber-500' : 'bg-purple-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono w-12 text-right ${
                    percentage > 30 ? 'text-amber-500' : 'text-slate-300'
                  }`}>
                    {percentage}%
                    {percentage > 30 && ' ⚠️'}
                  </span>
                </div>
              ))}
          </div>
        </div>

        {/* Risk Assessment */}
        <div className="bg-navy-900/50 rounded-lg p-3 space-y-3">
          <h4 className="text-sm font-medium text-white">Risk Assessment</h4>

          {hasConcentrationRisk ? (
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-amber-500 font-medium">Concentration Risk: HIGH</p>
                <p className="text-xs text-slate-400">
                  {highestSector[0]} sector is {highestSector[1]}% (recommended: &lt;30%)
                </p>
              </div>
            </div>
          ) : (
            <div className="flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-green-500 font-medium">Concentration Risk: LOW</p>
                <p className="text-xs text-slate-400">Well diversified across sectors</p>
              </div>
            </div>
          )}

          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-500 font-medium">Diversification: MODERATE</p>
              <p className="text-xs text-slate-400">
                {Object.keys(sectorAllocation).length} sectors covered, consider adding Pharma/FMCG
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-green-500 font-medium">Stock Quality: GOOD</p>
              <p className="text-xs text-slate-400">100% large-cap blue chips</p>
            </div>
          </div>
        </div>

        {/* Top Performers & Needs Attention */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-navy-900/50 rounded-lg p-3">
            <h4 className="text-xs text-slate-500 mb-2">Top Performers</h4>
            {topPerformers.map(h => {
              const pnl = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
              return (
                <div key={h.symbol} className="flex justify-between items-center py-1">
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-green-500" />
                    {h.symbol}
                  </span>
                  <span className="text-xs text-green-500 font-mono">+{pnl.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
          <div className="bg-navy-900/50 rounded-lg p-3">
            <h4 className="text-xs text-slate-500 mb-2">Needs Attention</h4>
            {needsAttention.map(h => {
              const pnl = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
              return (
                <div key={h.symbol} className="flex justify-between items-center py-1">
                  <span className="text-xs text-slate-300 flex items-center gap-1">
                    {pnl < 0 ? (
                      <TrendingDown className="w-3 h-3 text-red-500" />
                    ) : (
                      <TrendingUp className="w-3 h-3 text-amber-500" />
                    )}
                    {h.symbol}
                  </span>
                  <span className={`text-xs font-mono ${pnl < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                    {pnl >= 0 ? '+' : ''}{pnl.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2">
          {hasConcentrationRisk && (
            <button
              onClick={() => onAction('REDUCE_CONCENTRATION')}
              className="flex-1 py-2.5 rounded-lg bg-amber-500/20 text-amber-500 text-sm font-medium border border-amber-500/30 hover:bg-amber-500/30 transition-colors flex items-center justify-center gap-1"
            >
              <TrendingDown className="w-4 h-4" />
              Reduce {highestSector[0]}
            </button>
          )}
          <button
            onClick={() => onAction('SET_STOP_LOSS')}
            className="flex-1 py-2.5 rounded-lg bg-navy-700/50 text-slate-300 text-sm font-medium border border-navy-600/30 hover:bg-navy-700 transition-colors flex items-center justify-center gap-1"
          >
            <Shield className="w-4 h-4" />
            Set Stop-Loss
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioDeepAnalysis;
