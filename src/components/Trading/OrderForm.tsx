import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Stock, OrderType, OrderSide } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface OrderFormProps {
  stock: Stock;
  side: OrderSide;
  suggestedQuantity?: number;
  maxQuantity?: number;
  onSubmit: (order: {
    symbol: string;
    side: OrderSide;
    type: OrderType;
    quantity: number;
    price: number;
  }) => void;
  onCancel: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({
  stock,
  side,
  suggestedQuantity = 1,
  maxQuantity,
  onSubmit,
  onCancel,
}) => {
  const [quantity, setQuantity] = useState(suggestedQuantity);
  const [orderType, setOrderType] = useState<OrderType>('MARKET');
  const [limitPrice, setLimitPrice] = useState(stock.currentPrice);

  const totalValue = quantity * (orderType === 'MARKET' ? stock.currentPrice : limitPrice);
  const isBuy = side === 'BUY';

  const handleSubmit = () => {
    onSubmit({
      symbol: stock.symbol,
      side,
      type: orderType,
      quantity,
      price: orderType === 'MARKET' ? stock.currentPrice : limitPrice,
    });
  };

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        isBuy ? 'bg-green-500/10 border-b border-green-500/20' : 'bg-red-500/10 border-b border-red-500/20'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`font-bold ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
            {side}
          </span>
          <span className="font-semibold text-white">{stock.symbol}</span>
        </div>
        <button
          onClick={onCancel}
          className="p-1 rounded-lg hover:bg-navy-700/50 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Current Price */}
      <div className="px-4 py-3 border-b border-navy-700/50">
        <p className="text-xs text-slate-500">Current Market Price</p>
        <p className="text-xl font-bold font-mono text-white">
          {formatCurrency(stock.currentPrice)}
        </p>
      </div>

      {/* Order Type Selection */}
      <div className="px-4 py-3 border-b border-navy-700/50">
        <p className="text-xs text-slate-500 mb-2">Order Type</p>
        <div className="flex gap-2">
          {(['MARKET', 'LIMIT'] as OrderType[]).map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                orderType === type
                  ? 'bg-gold-500/20 text-gold-500 border border-gold-500/30'
                  : 'bg-navy-700/50 text-slate-400 border border-navy-600/30 hover:border-slate-500'
              }`}
            >
              {type === 'MARKET' ? 'Market Order' : 'Limit Order'}
            </button>
          ))}
        </div>
      </div>

      {/* Limit Price (if applicable) */}
      {orderType === 'LIMIT' && (
        <div className="px-4 py-3 border-b border-navy-700/50">
          <label className="text-xs text-slate-500 mb-2 block">Limit Price</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">₹</span>
            <input
              type="number"
              value={limitPrice}
              onChange={(e) => setLimitPrice(parseFloat(e.target.value) || 0)}
              className="w-full bg-navy-700/50 border border-navy-600/30 rounded-lg py-2 pl-8 pr-4 text-white font-mono focus:outline-none focus:border-gold-500/50"
              step="0.05"
            />
          </div>
        </div>
      )}

      {/* Quantity */}
      <div className="px-4 py-3 border-b border-navy-700/50">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs text-slate-500">Quantity</label>
          {maxQuantity && (
            <span className="text-xs text-slate-500">Max: {maxQuantity}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="w-10 h-10 rounded-lg bg-navy-700/50 text-slate-400 hover:text-white hover:bg-navy-700 transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            className="flex-1 bg-navy-700/50 border border-navy-600/30 rounded-lg py-2 px-4 text-center text-white font-mono focus:outline-none focus:border-gold-500/50"
            min="1"
            max={maxQuantity}
          />
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="w-10 h-10 rounded-lg bg-navy-700/50 text-slate-400 hover:text-white hover:bg-navy-700 transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Order Summary */}
      <div className="px-4 py-3 bg-navy-900/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-slate-400">Estimated Value</span>
          <span className="text-lg font-bold font-mono text-white">
            {formatCurrency(totalValue)}
          </span>
        </div>
        {orderType === 'MARKET' && (
          <div className="flex items-center gap-1 text-xs text-amber-500">
            <AlertCircle className="w-3 h-3" />
            <span>Market orders execute at current price</span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 p-4">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-lg bg-navy-700/50 text-slate-400 font-medium hover:bg-navy-700 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className={`flex-1 py-3 rounded-lg font-semibold transition-colors ${
            isBuy
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-red-500 text-white hover:bg-red-600'
          }`}
        >
          Confirm {side}
        </button>
      </div>
    </div>
  );
};

export default OrderForm;
