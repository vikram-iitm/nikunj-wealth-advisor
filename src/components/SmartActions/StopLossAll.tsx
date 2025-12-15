import React, { useState } from 'react';
import { X, Shield, CheckCircle, Loader2 } from 'lucide-react';
import { Holding } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface StopLossAllProps {
  holdings: Holding[];
  onConfirm: (stopLossOrders: Array<{ symbol: string; slPrice: number; quantity: number }>) => void;
  onCancel: () => void;
}

const StopLossAll: React.FC<StopLossAllProps> = ({ holdings, onConfirm, onCancel }) => {
  const [slPercentage, setSlPercentage] = useState(5);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set(holdings.map(h => h.symbol)));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const calculateSLPrice = (currentPrice: number) => {
    return currentPrice * (1 - slPercentage / 100);
  };

  const calculateLoss = (holding: Holding) => {
    const slPrice = calculateSLPrice(holding.currentPrice);
    return (slPrice - holding.currentPrice) * holding.quantity;
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

  const totalMaxLoss = holdings
    .filter(h => selectedStocks.has(h.symbol))
    .reduce((sum, h) => sum + calculateLoss(h), 0);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const orders = holdings
      .filter(h => selectedStocks.has(h.symbol))
      .map(h => ({
        symbol: h.symbol,
        slPrice: calculateSLPrice(h.currentPrice),
        quantity: h.quantity,
      }));
    onConfirm(orders);
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-amber-500/20 to-amber-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-amber-500" />
          <h3 className="font-semibold text-white">Set Stop-Loss for All Holdings</h3>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* SL Percentage Selection */}
        <div>
          <label className="text-sm text-slate-400 mb-2 block">Default SL: {slPercentage}% below current price</label>
          <div className="flex gap-2">
            {[5, 7, 10].map(pct => (
              <button
                key={pct}
                onClick={() => setSlPercentage(pct)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  slPercentage === pct
                    ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30'
                    : 'bg-navy-700/50 text-slate-400 border border-navy-600/30 hover:border-slate-500'
                }`}
              >
                {pct}%
              </button>
            ))}
            <input
              type="number"
              placeholder="Custom"
              className="w-20 px-3 py-2 rounded-lg bg-navy-700/50 border border-navy-600/30 text-white text-sm focus:outline-none focus:border-amber-500/50"
              onChange={(e) => setSlPercentage(parseFloat(e.target.value) || 5)}
            />
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-navy-900/50 rounded-lg overflow-hidden">
          <div className="grid grid-cols-5 gap-2 px-3 py-2 text-xs text-slate-500 border-b border-navy-700/50">
            <span>Stock</span>
            <span className="text-right">LTP</span>
            <span className="text-right">SL Price</span>
            <span className="text-right">Loss if Hit</span>
            <span></span>
          </div>
          <div className="max-h-48 overflow-y-auto">
            {holdings.map(holding => (
              <div
                key={holding.symbol}
                className={`grid grid-cols-5 gap-2 px-3 py-2.5 items-center border-b border-navy-700/30 ${
                  selectedStocks.has(holding.symbol) ? 'bg-navy-800/50' : 'opacity-50'
                }`}
              >
                <span className="text-sm text-white font-medium">{holding.symbol}</span>
                <span className="text-sm text-slate-300 text-right font-mono">
                  {formatCurrency(holding.currentPrice)}
                </span>
                <span className="text-sm text-amber-500 text-right font-mono">
                  {formatCurrency(calculateSLPrice(holding.currentPrice))}
                </span>
                <span className="text-sm text-red-400 text-right font-mono">
                  {formatCurrency(calculateLoss(holding))}
                </span>
                <div className="flex justify-end">
                  <input
                    type="checkbox"
                    checked={selectedStocks.has(holding.symbol)}
                    onChange={() => toggleStock(holding.symbol)}
                    className="w-4 h-4 rounded border-navy-600 bg-navy-700 text-amber-500 focus:ring-amber-500/20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-navy-900/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Holdings</span>
            <span className="text-white">{selectedStocks.size} stocks</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Max Loss if All SL Hit</span>
            <span className="text-red-400 font-mono">{formatCurrency(totalMaxLoss)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Order Type</span>
            <span className="text-slate-300">GTT (Good Till Triggered)</span>
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
            className="flex-1 py-3 rounded-lg bg-amber-500 text-navy-900 font-semibold hover:bg-amber-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Placing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Place All Stop-Loss ({selectedStocks.size})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StopLossAll;
