import React from 'react';
import { AlertTriangle, CheckCircle, TrendingUp, TrendingDown, PieChart as PieChartIcon } from 'lucide-react';
import { Portfolio } from '../../types';
import { formatCurrency, formatPercent } from '../../services/mockData';
import SectorChart from './SectorChart';

interface PortfolioAnalysisProps {
  portfolio: Portfolio;
  sectorAllocation: Record<string, number>;
}

const PortfolioAnalysis: React.FC<PortfolioAnalysisProps> = ({ portfolio, sectorAllocation }) => {
  // Find top performer and underperformer
  const holdingsWithPnL = portfolio.holdings.map((h) => {
    const pnlPercent = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
    return { ...h, pnlPercent };
  });

  const topPerformer = holdingsWithPnL.reduce((a, b) => (a.pnlPercent > b.pnlPercent ? a : b));
  const underPerformer = holdingsWithPnL.reduce((a, b) => (a.pnlPercent < b.pnlPercent ? a : b));

  // Check concentration risk
  const sortedSectors = Object.entries(sectorAllocation).sort((a, b) => b[1] - a[1]);
  const highestConcentration = sortedSectors[0];
  const hasConcentrationRisk = highestConcentration && highestConcentration[1] > 30;

  // Calculate diversification score
  const getDiversificationScore = () => {
    const sectorCount = Object.keys(sectorAllocation).length;
    const maxConcentration = highestConcentration?.[1] || 0;

    if (sectorCount >= 5 && maxConcentration <= 25) return { score: 5, label: 'Excellent', color: 'text-green-500' };
    if (sectorCount >= 4 && maxConcentration <= 35) return { score: 4, label: 'Good', color: 'text-green-400' };
    if (sectorCount >= 3 && maxConcentration <= 45) return { score: 3, label: 'Fair', color: 'text-yellow-500' };
    if (sectorCount >= 2) return { score: 2, label: 'Poor', color: 'text-orange-500' };
    return { score: 1, label: 'Very Poor', color: 'text-red-500' };
  };

  const diversification = getDiversificationScore();

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-navy-700/50 bg-gradient-to-r from-gold-500/10 to-transparent">
        <div className="flex items-center gap-2">
          <PieChartIcon className="w-5 h-5 text-gold-500" />
          <h3 className="font-semibold text-white">Portfolio Analysis</h3>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-px bg-navy-700/30">
        <div className="bg-navy-800 p-4 text-center">
          <p className="text-xs text-slate-500">Total Value</p>
          <p className="text-lg font-bold font-mono text-white">{formatCurrency(portfolio.totalValue)}</p>
        </div>
        <div className="bg-navy-800 p-4 text-center">
          <p className="text-xs text-slate-500">Investment</p>
          <p className="text-lg font-bold font-mono text-slate-300">{formatCurrency(portfolio.totalInvestment)}</p>
        </div>
        <div className="bg-navy-800 p-4 text-center">
          <p className="text-xs text-slate-500">Overall P&L</p>
          <p className={`text-lg font-bold font-mono ${portfolio.totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(portfolio.totalPnL)}
            <span className="text-sm ml-1">({formatPercent(portfolio.totalPnLPercent)})</span>
          </p>
        </div>
      </div>

      {/* Sector Allocation Chart */}
      <div className="p-4 border-b border-navy-700/50">
        <SectorChart data={sectorAllocation} />
      </div>

      {/* Risk Assessment */}
      <div className="p-4 space-y-3">
        {/* Concentration Risk */}
        {hasConcentrationRisk && (
          <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-amber-500">Concentration Risk: HIGH</p>
              <p className="text-xs text-slate-400 mt-1">
                {highestConcentration[0]} sector represents {highestConcentration[1].toFixed(1)}% of your portfolio.
                Consider diversifying to reduce sector-specific risk.
              </p>
            </div>
          </div>
        )}

        {/* Diversification Score */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-navy-700/30">
          <span className="text-sm text-slate-400">Diversification Score</span>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-6 rounded-sm ${
                    i <= diversification.score ? 'bg-gold-500' : 'bg-navy-600'
                  }`}
                />
              ))}
            </div>
            <span className={`text-sm font-medium ${diversification.color}`}>
              {diversification.label}
            </span>
          </div>
        </div>

        {/* Top Performer */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm text-slate-300">Top Performer</span>
          </div>
          <div className="text-right">
            <span className="font-medium text-white">{topPerformer.symbol}</span>
            <span className="text-green-500 font-mono ml-2">+{topPerformer.pnlPercent.toFixed(1)}%</span>
          </div>
        </div>

        {/* Needs Attention */}
        {underPerformer.pnlPercent < 10 && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-navy-700/30">
            <div className="flex items-center gap-2">
              {underPerformer.pnlPercent < 0 ? (
                <TrendingDown className="w-4 h-4 text-red-500" />
              ) : (
                <CheckCircle className="w-4 h-4 text-slate-500" />
              )}
              <span className="text-sm text-slate-300">Needs Attention</span>
            </div>
            <div className="text-right">
              <span className="font-medium text-white">{underPerformer.symbol}</span>
              <span className={`font-mono ml-2 ${underPerformer.pnlPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {underPerformer.pnlPercent >= 0 ? '+' : ''}{underPerformer.pnlPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Recommendations */}
      <div className="px-4 py-3 bg-navy-900/50 border-t border-navy-700/50">
        <h4 className="text-xs font-medium text-gold-500 mb-2">📊 RECOMMENDATIONS</h4>
        <ul className="space-y-1 text-xs text-slate-400">
          {hasConcentrationRisk && (
            <li>• Consider reducing {highestConcentration[0]} exposure below 30%</li>
          )}
          {diversification.score < 4 && (
            <li>• Add defensive sectors (FMCG, Pharma) for better stability</li>
          )}
          <li>• Your cash balance could be deployed in underweight sectors</li>
        </ul>
      </div>
    </div>
  );
};

export default PortfolioAnalysis;
