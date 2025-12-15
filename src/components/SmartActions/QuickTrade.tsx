import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Stock, OrderType } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface QuickTradeProps {
  stock: Stock;
  marginAvailable: number;
  onSubmit: (order: { symbol: string; side: 'BUY' | 'SELL'; type: OrderType; quantity: number; price: number }) => void;
  onCancel: () => void;
}

const QuickTrade: React.FC<QuickTradeProps> = ({ stock, marginAvailable, onSubmit, onCancel }) => {
  const [side, setSide] = useState<'BUY' | 'SELL'>('BUY');
  const [quantity, setQuantity] = useState(10);
  const [orderType, setOrderType] = useState<OrderType>('LIMIT');
  const [limitPrice, setLimitPrice] = useState(stock.currentPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const orderValue = quantity * (orderType === 'MARKET' ? stock.currentPrice : limitPrice);
  const changePercent = ((stock.currentPrice - stock.previousClose) / stock.previousClose) * 100;
  const isUp = changePercent >= 0;

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    onSubmit({
      symbol: stock.symbol,
      side,
      type: orderType,
      quantity,
      price: orderType === 'MARKET' ? stock.currentPrice : limitPrice,
    });
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl w-full max-w-sm animate-slide-up">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-gradient-to-r from-gold-500/20 to-gold-600/10 border-b border-navy-700/50">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚡</span>
          <h3 className="font-semibold text-white">Quick Trade: {stock.symbol}</h3>
        </div>
        <button onClick={onCancel} className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Price Display */}
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-mono">{formatCurrency(stock.currentPrice)}</span>
          <span className={`text-sm font-medium ${isUp ? 'text-green-500' : 'text-red-500'}`}>
            {isUp ? '+' : ''}{(stock.currentPrice - stock.previousClose).toFixed(2)} ({isUp ? '+' : ''}{changePercent.toFixed(2)}%)
          </span>
        </div>

        {/* Buy/Sell Toggle */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setSide('BUY')}
            className={`py-2.5 rounded-lg font-semibold transition-all ${
              side === 'BUY'
                ? 'bg-green-500 text-white'
                : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
            }`}
          >
            BUY
          </button>
          <button
            onClick={() => setSide('SELL')}
            className={`py-2.5 rounded-lg font-semibold transition-all ${
              side === 'SELL'
                ? 'bg-red-500 text-white'
                : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
            }`}
          >
            SELL
          </button>
        </div>

        {/* Quantity & Order Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              min="1"
              className="w-full bg-navy-700/50 border border-navy-600/30 rounded-lg py-2 px-3 text-white font-mono focus:outline-none focus:border-gold-500/50"
            />
          </div>
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Order Type</label>
            <div className="flex gap-1">
              <button
                onClick={() => setOrderType('MARKET')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  orderType === 'MARKET'
                    ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                    : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
                }`}
              >
                Market
              </button>
              <button
                onClick={() => setOrderType('LIMIT')}
                className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${
                  orderType === 'LIMIT'
                    ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                    : 'bg-navy-700/50 text-slate-400 border border-navy-600/30'
                }`}
              >
                Limit
              </button>
            </div>
          </div>
        </div>

        {/* Limit Price */}
        {orderType === 'LIMIT' && (
          <div>
            <label className="text-xs text-slate-500 mb-1 block">Limit Price</label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
              <input
                type="number"
                value={limitPrice}
                onChange={(e) => setLimitPrice(parseFloat(e.target.value) || stock.currentPrice)}
                className="w-full bg-navy-700/50 border border-navy-600/30 rounded-lg py-2 pl-8 pr-3 text-white font-mono focus:outline-none focus:border-gold-500/50"
                step="0.05"
              />
            </div>
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-navy-900/50 rounded-lg p-3 space-y-1">
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Order Value</span>
            <span className="text-white font-mono">{formatCurrency(orderValue)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Available Margin</span>
            <span className="text-slate-300 font-mono">{formatCurrency(marginAvailable)}</span>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || (side === 'BUY' && orderValue > marginAvailable)}
          className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
            side === 'BUY'
              ? 'bg-green-500 text-white hover:bg-green-400'
              : 'bg-red-500 text-white hover:bg-red-400'
          } disabled:opacity-50`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Placing...
            </>
          ) : (
            <>
              🟢 Place {side} Order
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default QuickTrade;
