import React, { useState } from 'react';
import { X, Wallet, CheckCircle, Loader2, ShoppingCart } from 'lucide-react';
import { formatCurrency } from '../../services/mockData';

interface SuggestedStock {
  symbol: string;
  name: string;
  sector: string;
  currentPrice: number;
  suggestedQty: number;
  reason: string;
}

interface InvestIdleCashProps {
  cashAvailable: number;
  suggestions: SuggestedStock[];
  newSectorAllocation: Record<string, { before: number; after: number }>;
  onConfirm: (orders: Array<{ symbol: string; quantity: number; price: number }>) => void;
  onCancel: () => void;
}

const InvestIdleCash: React.FC<InvestIdleCashProps> = ({
  cashAvailable,
  suggestions,
  newSectorAllocation,
  onConfirm,
  onCancel,
}) => {
  const [investAmount, setInvestAmount] = useState(cashAvailable);
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set(suggestions.map(s => s.symbol)));
  const [isSubmitting, setIsSubmitting] = useState(false);

  const toggleStock = (symbol: string) => {
    const newSelected = new Set(selectedStocks);
    if (newSelected.has(symbol)) {
      newSelected.delete(symbol);
    } else {
      newSelected.add(symbol);
    }
    setSelectedStocks(newSelected);
  };

  const totalInvestment = suggestions
    .filter(s => selectedStocks.has(s.symbol))
    .reduce((sum, s) => sum + s.currentPrice * s.suggestedQty, 0);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const orders = suggestions
      .filter(s => selectedStocks.has(s.symbol))
      .map(s => ({
        symbol: s.symbol,
        quantity: s.suggestedQty,
        price: s.currentPrice,
      }));
    onConfirm(orders);
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-cyan-500/20 to-cyan-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <Wallet className="w-5 h-5 text-cyan-500" />
          <h3 className="font-semibold text-white">Invest Idle Cash</h3>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-400">
          You have <span className="text-cyan-400 font-medium">{formatCurrency(cashAvailable)}</span> uninvested cash
        </p>

        {/* Amount Selection */}
        <div className="bg-navy-900/50 rounded-lg p-3">
          <label className="text-xs text-slate-500 mb-2 block">Investment Amount</label>
          <div className="flex gap-2">
            {[10000, 25000, cashAvailable].map(amt => (
              <button
                key={amt}
                onClick={() => setInvestAmount(amt)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  investAmount === amt
                    ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/30'
                    : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
                }`}
              >
                {amt === cashAvailable ? 'Full Amount' : formatCurrency(amt)}
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-slate-500">AI Recommended Allocation (based on your portfolio gaps):</p>

        {/* Stock Suggestions */}
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {suggestions.map(stock => (
            <div
              key={stock.symbol}
              className={`bg-navy-900/50 rounded-lg p-3 border ${
                selectedStocks.has(stock.symbol) ? 'border-cyan-500/30' : 'border-navy-700/50 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStocks.has(stock.symbol)}
                    onChange={() => toggleStock(stock.symbol)}
                    className="w-4 h-4 rounded border-navy-600 bg-navy-700 text-cyan-500 focus:ring-cyan-500/20"
                  />
                  <div>
                    <span className="font-semibold text-white">{stock.symbol}</span>
                    <span className="text-xs text-slate-500 ml-2">({stock.sector} - Missing Sector)</span>
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-400 mb-1">
                Current Price: {formatCurrency(stock.currentPrice)}
              </div>
              <div className="text-xs text-slate-400 mb-2">
                Suggested: {stock.suggestedQty} shares = {formatCurrency(stock.currentPrice * stock.suggestedQty)}
              </div>
              <div className="text-xs text-cyan-400/80 bg-cyan-500/10 rounded px-2 py-1">
                Why: {stock.reason}
              </div>
            </div>
          ))}
        </div>

        {/* New Sector Allocation */}
        <div className="bg-navy-900/50 rounded-lg p-3">
          <h4 className="text-xs text-slate-500 mb-2">New Sector Allocation After Investment:</h4>
          <div className="space-y-2">
            {Object.entries(newSectorAllocation).map(([sector, values]) => (
              <div key={sector} className="flex items-center gap-2">
                <span className="text-xs text-slate-400 w-16 truncate">{sector}</span>
                <div className="flex-1 h-2 bg-navy-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      values.after > values.before ? 'bg-cyan-500' : 'bg-purple-500'
                    }`}
                    style={{ width: `${values.after}%` }}
                  />
                </div>
                <span className="text-xs font-mono text-slate-300 w-24 text-right">
                  {values.before}% → {values.after}%
                  {values.after > values.before && values.before === 0 && (
                    <span className="text-green-400 ml-1">NEW</span>
                  )}
                </span>
              </div>
            ))}
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
            disabled={selectedStocks.size === 0 || totalInvestment > cashAvailable || isSubmitting}
            className="flex-1 py-3 rounded-lg bg-cyan-500 text-navy-900 font-semibold hover:bg-cyan-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Investing...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Invest {formatCurrency(totalInvestment)}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvestIdleCash;
