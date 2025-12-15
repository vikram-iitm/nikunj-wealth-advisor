import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { Holding } from '../../types';
import { formatCurrency, formatPercent } from '../../services/mockData';

interface HoldingsTableProps {
  holdings: Holding[];
  onStockClick?: (symbol: string) => void;
}

const HoldingsTable: React.FC<HoldingsTableProps> = ({ holdings, onStockClick }) => {
  const calculatePnL = (holding: Holding) => {
    const currentValue = holding.quantity * holding.currentPrice;
    const investedValue = holding.quantity * holding.avgPrice;
    const pnl = currentValue - investedValue;
    const pnlPercent = (pnl / investedValue) * 100;
    return { pnl, pnlPercent, currentValue, investedValue };
  };

  // Calculate totals
  const totals = holdings.reduce(
    (acc, h) => {
      const { currentValue, investedValue } = calculatePnL(h);
      return {
        currentValue: acc.currentValue + currentValue,
        investedValue: acc.investedValue + investedValue,
      };
    },
    { currentValue: 0, investedValue: 0 }
  );

  const totalPnL = totals.currentValue - totals.investedValue;
  const totalPnLPercent = (totalPnL / totals.investedValue) * 100;

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="px-4 py-3 border-b border-navy-700/50 bg-navy-900/50">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-white">Your Holdings</h3>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total Value</p>
            <p className="font-bold font-mono text-white">{formatCurrency(totals.currentValue)}</p>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-xs text-slate-500 border-b border-navy-700/50">
              <th className="text-left py-3 px-4">Stock</th>
              <th className="text-right py-3 px-4">Qty</th>
              <th className="text-right py-3 px-4">Avg Price</th>
              <th className="text-right py-3 px-4">LTP</th>
              <th className="text-right py-3 px-4">P&L</th>
            </tr>
          </thead>
          <tbody>
            {holdings.map((holding) => {
              const { pnl, pnlPercent, currentValue } = calculatePnL(holding);
              const isProfit = pnl >= 0;

              return (
                <tr
                  key={holding.symbol}
                  onClick={() => onStockClick?.(holding.symbol)}
                  className="border-b border-navy-700/30 hover:bg-navy-700/30 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-white">{holding.symbol}</p>
                      <p className="text-xs text-slate-500">{holding.sector}</p>
                    </div>
                  </td>
                  <td className="text-right py-3 px-4 font-mono text-slate-300">
                    {holding.quantity}
                  </td>
                  <td className="text-right py-3 px-4 font-mono text-slate-300">
                    {formatCurrency(holding.avgPrice)}
                  </td>
                  <td className="text-right py-3 px-4 font-mono text-white">
                    {formatCurrency(holding.currentPrice)}
                  </td>
                  <td className="text-right py-3 px-4">
                    <div className={`flex items-center justify-end gap-1 ${isProfit ? 'text-green-500' : 'text-red-500'}`}>
                      {isProfit ? (
                        <TrendingUp className="w-3 h-3" />
                      ) : (
                        <TrendingDown className="w-3 h-3" />
                      )}
                      <div className="text-right">
                        <p className="font-mono text-sm">{formatCurrency(pnl)}</p>
                        <p className="text-xs opacity-75">{formatPercent(pnlPercent)}</p>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary Footer */}
      <div className="px-4 py-3 bg-navy-900/50 border-t border-navy-700/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500">Total Investment</p>
            <p className="font-mono text-slate-300">{formatCurrency(totals.investedValue)}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">Total P&L</p>
            <div className={`flex items-center justify-end gap-1 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {totalPnL >= 0 ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="font-bold font-mono">
                {formatCurrency(totalPnL)} ({formatPercent(totalPnLPercent)})
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HoldingsTable;
