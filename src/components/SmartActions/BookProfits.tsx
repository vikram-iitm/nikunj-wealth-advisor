import React, { useState } from 'react';
import { X, TrendingUp, Loader2, CheckCircle } from 'lucide-react';
import { Holding } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface BookProfitsProps {
  holdings: Holding[];
  onConfirm: (sellOrders: Array<{ symbol: string; quantity: number; price: number }>) => void;
  onCancel: () => void;
}

const BookProfits: React.FC<BookProfitsProps> = ({ holdings, onConfirm, onCancel }) => {
  // Filter holdings with gains > 5%
  const profitableHoldings = holdings.filter(h => {
    const pnlPercent = ((h.currentPrice - h.avgPrice) / h.avgPrice) * 100;
    return pnlPercent > 5;
  });

  const [sellPercentages, setSellPercentages] = useState<Record<string, number>>(
    Object.fromEntries(profitableHoldings.map(h => [h.symbol, 50]))
  );
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(
    new Set(profitableHoldings.map(h => h.symbol))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getProfit = (holding: Holding) => {
    return (holding.currentPrice - holding.avgPrice) * holding.quantity;
  };

  const getPnLPercent = (holding: Holding) => {
    return ((holding.currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
  };

  const getSellQuantity = (holding: Holding) => {
    const pct = sellPercentages[holding.symbol] || 50;
    return Math.floor(holding.quantity * (pct / 100));
  };

  const getSellValue = (holding: Holding) => {
    return getSellQuantity(holding) * holding.currentPrice;
  };

  const getProfitBooked = (holding: Holding) => {
    const sellQty = getSellQuantity(holding);
    return (holding.currentPrice - holding.avgPrice) * sellQty;
  };

  const toggleStock = (symbol: string) => {
    const newSelected = new Set(selectedStocks);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedStocks(newSelected);
  };

  const totalProfitBooked = profitableHoldings
    .filter(h => selectedStocks.has(h.symbol))
    .reduce((sum, h) => sum + getProfitBooked(h), 0);

  const totalSellValue = profitableHoldings
    .filter(h => selectedStocks.has(h.symbol))
    .reduce((sum, h) => sum + getSellValue(h), 0);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const orders = profitableHoldings
      .filter(h => selectedStocks.has(h.symbol))
      .map(h => ({
        symbol: h.symbol,
        quantity: getSellQuantity(h),
        price: h.currentPrice,
      }));
    onConfirm(orders);
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-green-500/20 to-green-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-green-500" />
          <h3 className="font-semibold text-white">Book Partial Profits</h3>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-400">Stocks with gains &gt; 5%</p>

        {/* Holdings Cards */}
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {profitableHoldings.map(holding => (
            <div
              key={holding.symbol}
              className={`bg-navy-900/50 rounded-lg p-3 border ${
                selectedStocks.has(holding.symbol) ? 'border-green-500/30' : 'border-navy-700/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStocks.has(holding.symbol)}
                    onChange={() => toggleStock(holding.symbol)}
                    className="w-4 h-4 rounded border-navy-600 bg-navy-700 text-green-500 focus:ring-green-500/20"
                  />
                  <span className="font-semibold text-white">{holding.symbol}</span>
                </div>
                <span className="text-green-500 font-medium">+{getPnLPercent(holding).toFixed(1)}%</span>
              </div>

              <div className="text-xs text-slate-400 mb-2">
                {holding.quantity} shares @ {formatCurrency(holding.currentPrice)} (Avg: {formatCurrency(holding.avgPrice)})
              </div>
              <div className="text-xs text-slate-400 mb-3">
                Unrealized Profit: <span className="text-green-400">{formatCurrency(getProfit(holding))}</span>
              </div>

              <div className="mb-2">
                <label className="text-xs text-slate-500 mb-1 block">Sell Quantity:</label>
                <div className="flex gap-2">
                  {[25, 50, 75, 100].map(pct => (
                    <button
                      key={pct}
                      onClick={() => setSellPercentages(prev => ({ ...prev, [holding.symbol]: pct }))}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        sellPercentages[holding.symbol] === pct
                          ? 'bg-green-500/20 text-green-500 border border-green-500/30'
                          : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
                      }`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-navy-700/50">
                <span className="text-slate-400">
                  Selling: {getSellQuantity(holding)} shares = {formatCurrency(getSellValue(holding))}
                </span>
                <span className="text-green-400">
                  Profit: {formatCurrency(getProfitBooked(holding))}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-navy-900/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Profit Being Booked</span>
            <span className="text-green-400 font-mono">{formatCurrency(totalProfitBooked)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Funds to be Credited</span>
            <span className="text-white font-mono">{formatCurrency(totalSellValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Remaining Holdings</span>
            <span className="text-slate-300">Partial of each</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 rounded-lg bg-navy-700/50 text-slate-400 font-medium hover:bg-navy-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selectedStocks.size === 0 || isSubmitting}
            className="flex-1 py-3 rounded-lg bg-green-500 text-white font-semibold hover:bg-green-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Selling...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Sell & Book Profits
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookProfits;
