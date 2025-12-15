import React from 'react';
import { CheckCircle, Clock, Hash, Wallet } from 'lucide-react';
import { Order } from '../../types';
import { formatCurrency } from '../../services/mockData';

interface OrderConfirmationProps {
  order: Order;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order }) => {
  const totalValue = order.quantity * order.price;
  const isBuy = order.side === 'BUY';

  return (
    <div className="bg-navy-800/90 rounded-xl border border-green-500/30 overflow-hidden shadow-xl">
      {/* Success Header */}
      <div className="px-4 py-4 bg-green-500/10 border-b border-green-500/20 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-500" />
        </div>
        <div>
          <h3 className="font-bold text-green-500">Order Executed Successfully!</h3>
          <p className="text-sm text-slate-400">Your order has been processed</p>
        </div>
      </div>

      {/* Order Details */}
      <div className="p-4 space-y-3">
        {/* Side and Symbol */}
        <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
          <span className="text-slate-400">Order</span>
          <span className={`font-semibold ${isBuy ? 'text-green-500' : 'text-red-500'}`}>
            {order.side} {order.quantity} {order.symbol}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
          <span className="text-slate-400 flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            Price per Share
          </span>
          <span className="font-mono text-white">{formatCurrency(order.price)}</span>
        </div>

        {/* Total Value */}
        <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
          <span className="text-slate-400">Total Value</span>
          <span className="text-lg font-bold font-mono text-white">{formatCurrency(totalValue)}</span>
        </div>

        {/* Order ID */}
        <div className="flex items-center justify-between py-2 border-b border-navy-700/50">
          <span className="text-slate-400 flex items-center gap-2">
            <Hash className="w-4 h-4" />
            Order ID
          </span>
          <span className="font-mono text-gold-500">{order.orderId}</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between py-2">
          <span className="text-slate-400 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Time
          </span>
          <span className="font-mono text-slate-300">
            {new Date(order.timestamp).toLocaleTimeString('en-IN', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            })}{' '}
            IST
          </span>
        </div>
      </div>

      {/* Status Badge */}
      <div className="px-4 py-3 bg-navy-900/50 flex items-center justify-center">
        <span className="px-4 py-1.5 rounded-full bg-green-500/20 text-green-500 text-sm font-medium">
          ✓ {order.status}
        </span>
      </div>
    </div>
  );
};

export default OrderConfirmation;
