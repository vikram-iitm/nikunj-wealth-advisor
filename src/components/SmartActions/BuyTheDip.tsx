import React, { useState } from 'react';
import { X, TrendingDown, Loader2, CheckCircle, ShoppingCart } from 'lucide-react';
import { Holding, Stock } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface DipStock {
  symbol: string;
  name: string;
  currentPrice: number;
  change: number;
  changePercent: number;
  support: number;
  avgPrice?: number;
  quantity?: number;
}

interface BuyTheDipProps {
  dipStocks: DipStock[];
  cashAvailable: number;
  onConfirm: (buyOrders: Array<{ symbol: string; quantity: number; price: number }>) => void;
  onCancel: () => void;
}

const BuyTheDip: React.FC<BuyTheDipProps> = ({ dipStocks, cashAvailable, onConfirm, onCancel }) => {
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(dipStocks.map(s => [s.symbol, 10]))
  );
  const [selectedStocks, setSelectedStocks] = useState<Set<string>>(new Set(dipStocks.map(s => s.symbol)));
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

  const getInvestment = (stock: DipStock) => {
    return quantities[stock.symbol] * stock.currentPrice;
  };

  const getNewAvg = (stock: DipStock) => {
    if (!stock.avgPrice || !stock.quantity) return stock.currentPrice;
    const totalQty = stock.quantity + quantities[stock.symbol];
    const totalValue = stock.quantity * stock.avgPrice + quantities[stock.symbol] * stock.currentPrice;
    return totalValue / totalQty;
  };

  const totalInvestment = dipStocks
    .filter(s => selectedStocks.has(s.symbol))
    .reduce((sum, s) => sum + getInvestment(s), 0);

  const handleConfirm = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const orders = dipStocks
      .filter(s => selectedStocks.has(s.symbol))
      .map(s => ({
        symbol: s.symbol,
        quantity: quantities[s.symbol],
        price: s.currentPrice,
      }));
    onConfirm(orders);
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-lg animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-blue-500/20 to-blue-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-white">Buy the Dip</h3>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <p className="text-sm text-slate-400">Quality stocks from your holdings down today</p>

        {/* Stock Cards */}
        <div className="space-y-3 max-h-72 overflow-y-auto">
          {dipStocks.map(stock => (
            <div
              key={stock.symbol}
              className={`bg-navy-900/50 rounded-lg p-3 border ${
                selectedStocks.has(stock.symbol) ? 'border-blue-500/30' : 'border-navy-700/50 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={selectedStocks.has(stock.symbol)}
                    onChange={() => toggleStock(stock.symbol)}
                    className="w-4 h-4 rounded border-navy-600 bg-navy-700 text-blue-500 focus:ring-blue-500/20"
                  />
                  <span className="font-semibold text-white">{stock.symbol}</span>
                </div>
                <span className="text-red-500 font-medium">{stock.changePercent.toFixed(1)}%</span>
              </div>

              {/* Mini price chart placeholder */}
              <div className="h-8 bg-navy-800/50 rounded mb-2 flex items-center justify-center">
                <svg viewBox="0 0 100 30" className="w-full h-full text-red-500/50">
                  <path
                    d="M0,15 L20,10 L40,20 L60,8 L80,25 L100,18"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-400 mb-3">
                <div>
                  Current: <span className="text-white">{formatCurrency(stock.currentPrice)}</span>
                </div>
                <div>
                  Support: <span className="text-slate-300">{formatCurrency(stock.support)}</span>
                </div>
                {stock.avgPrice && (
                  <>
                    <div>
                      Your Avg: <span className="text-white">{formatCurrency(stock.avgPrice)}</span>
                    </div>
                    <div>
                      {stock.currentPrice > stock.avgPrice ? (
                        <span className="text-green-400">Still in profit</span>
                      ) : (
                        <span className="text-red-400">Below avg</span>
                      )}
                    </div>
                  </>
                )}
              </div>

              <div className="mb-2">
                <label className="text-xs text-slate-500 mb-1 block">Add shares:</label>
                <div className="flex gap-2">
                  {[5, 10, 15].map(qty => (
                    <button
                      key={qty}
                      onClick={() => setQuantities(prev => ({ ...prev, [stock.symbol]: qty }))}
                      className={`px-3 py-1.5 rounded text-xs font-medium transition-all ${
                        quantities[stock.symbol] === qty
                          ? 'bg-blue-500/20 text-blue-500 border border-blue-500/30'
                          : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
                      }`}
                    >
                      {qty} shares
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-sm pt-2 border-t border-navy-700/50">
                <span className="text-slate-400">
                  Investment: {formatCurrency(getInvestment(stock))}
                </span>
                {stock.avgPrice && (
                  <span className="text-slate-300">
                    New Avg: {formatCurrency(stock.avgPrice)} → {formatCurrency(getNewAvg(stock))}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-navy-900/50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Total Investment</span>
            <span className="text-white font-mono">{formatCurrency(totalInvestment)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Cash Available</span>
            <span className="text-slate-300 font-mono">{formatCurrency(cashAvailable)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Remaining Cash</span>
            <span className={`font-mono ${cashAvailable - totalInvestment < 0 ? 'text-red-400' : 'text-green-400'}`}>
              {formatCurrency(cashAvailable - totalInvestment)}
            </span>
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
            className="flex-1 py-3 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-400 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Buying...
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                Buy Selected ({selectedStocks.size})
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BuyTheDip;
