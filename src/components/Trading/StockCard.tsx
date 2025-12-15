import React from 'react';
import { TrendingUp, TrendingDown, BarChart3 } from 'lucide-react';
import { Stock, CandlestickData } from '../../types';
import { formatCurrency, formatNumber, formatPercent } from '../../services/mockData';
import CandlestickChart from './CandlestickChart';

interface StockCardProps {
  stock: Stock;
  candlestickData: CandlestickData[];
  onBuy?: () => void;
  onSell?: () => void;
}

const StockCard: React.FC<StockCardProps> = ({ stock, candlestickData, onBuy, onSell }) => {
  const priceChange = stock.currentPrice - stock.previousClose;
  const priceChangePercent = (priceChange / stock.previousClose) * 100;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-navy-800/90 rounded-xl border border-navy-700/50 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-navy-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-gold-500/20 to-gold-600/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-gold-500" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white">{stock.symbol}</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-navy-700 text-slate-400">
                  {stock.sector}
                </span>
              </div>
              <p className="text-sm text-slate-400">{stock.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold font-mono text-white">
              {formatCurrency(stock.currentPrice)}
            </p>
            <div className={`flex items-center justify-end gap-1 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
              {isPositive ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-mono">
                {isPositive ? '+' : ''}{formatCurrency(priceChange).replace('₹', '')} ({formatPercent(priceChangePercent)})
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-4 border-b border-navy-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-500">60-Day Performance</span>
          <div className="flex gap-2">
            {['1D', '1W', '1M', '3M'].map((period) => (
              <button
                key={period}
                className={`text-xs px-2 py-1 rounded ${
                  period === '3M'
                    ? 'bg-gold-500/20 text-gold-500'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>
        <CandlestickChart data={candlestickData} width={460} height={180} />
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-4 gap-px bg-navy-700/30">
        {[
          { label: 'Open', value: formatCurrency(stock.open) },
          { label: 'High', value: formatCurrency(stock.high) },
          { label: 'Low', value: formatCurrency(stock.low) },
          { label: 'Prev Close', value: formatCurrency(stock.previousClose) },
          { label: 'Volume', value: formatNumber(stock.volume) },
          { label: 'P/E Ratio', value: stock.pe.toFixed(1) },
          { label: '52W High', value: formatCurrency(stock.week52High) },
          { label: '52W Low', value: formatCurrency(stock.week52Low) },
        ].map((metric) => (
          <div key={metric.label} className="bg-navy-800 p-3">
            <p className="text-xs text-slate-500">{metric.label}</p>
            <p className="text-sm font-mono text-slate-200">{metric.value}</p>
          </div>
        ))}
      </div>

      {/* Market Cap */}
      <div className="px-4 py-2 bg-navy-800 border-t border-navy-700/30">
        <p className="text-xs text-slate-500">
          Market Cap: <span className="text-slate-300 font-mono">{stock.marketCap}</span>
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-px bg-navy-700/30">
        <button
          onClick={onBuy}
          className="flex-1 py-3 bg-green-500/10 text-green-500 font-semibold hover:bg-green-500/20 transition-colors"
        >
          BUY
        </button>
        <button
          onClick={onSell}
          className="flex-1 py-3 bg-red-500/10 text-red-500 font-semibold hover:bg-red-500/20 transition-colors"
        >
          SELL
        </button>
      </div>
    </div>
  );
};

export default StockCard;
