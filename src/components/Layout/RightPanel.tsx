import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Zap,
  ArrowRight,
} from 'lucide-react';

interface RightPanelProps {
  onStockClick: (symbol: string) => void;
}

const RightPanel: React.FC<RightPanelProps> = ({ onStockClick }) => {
  const watchlist = [
    { symbol: 'RELIANCE', name: 'Reliance Industries', price: '2,847.55', change: '+1.2%', isUp: true },
    { symbol: 'TCS', name: 'Tata Consultancy', price: '4,156.80', change: '-0.5%', isUp: false },
    { symbol: 'INFY', name: 'Infosys Ltd', price: '1,892.35', change: '+0.8%', isUp: true },
    { symbol: 'HDFC', name: 'HDFC Bank', price: '1,654.20', change: '+0.3%', isUp: true },
  ];

  const topGainers = [
    { symbol: 'TATAMOTORS', change: '+4.2%' },
    { symbol: 'BAJFINANCE', change: '+3.1%' },
    { symbol: 'ADANIENT', change: '+2.8%' },
  ];

  const topLosers = [
    { symbol: 'WIPRO', change: '-2.1%' },
    { symbol: 'TECHM', change: '-1.8%' },
    { symbol: 'HCLTECH', change: '-1.5%' },
  ];

  const recentNews = [
    { title: 'RBI keeps repo rate unchanged at 6.5%', time: '2h ago' },
    { title: 'Nifty hits all-time high amid FII buying', time: '4h ago' },
    { title: 'IT stocks rally on strong Q3 guidance', time: '6h ago' },
  ];

  return (
    <div className="w-80 bg-navy-900/98 border-l border-purple-500/20 flex flex-col h-full backdrop-blur-xl overflow-y-auto">
      {/* Watchlist */}
      <div className="p-4 border-b border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-gold-400" />
            Watchlist
          </h3>
          <button className="text-xs text-purple-300 hover:text-purple-200">Edit</button>
        </div>
        <div className="space-y-2">
          {watchlist.map((stock) => (
            <button
              key={stock.symbol}
              onClick={() => onStockClick(stock.symbol)}
              className="w-full flex items-center justify-between p-3 bg-navy-800/60 hover:bg-purple-500/15 rounded-xl transition-all group border border-purple-500/20 hover:border-purple-400/40 hover:shadow-card"
            >
              <div className="text-left">
                <p className="text-sm font-medium text-white group-hover:text-purple-300 transition-colors">{stock.symbol}</p>
                <p className="text-xs text-slate-400">{stock.name}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-white">{stock.price}</p>
                <p className={`text-xs font-medium ${stock.isUp ? 'text-accent-emerald' : 'text-accent-rose'}`}>
                  {stock.change}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Top Movers */}
      <div className="p-4 border-b border-purple-500/20">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Zap className="w-4 h-4 text-gold-400" />
          Top Movers
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {/* Gainers */}
          <div className="bg-green-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-2">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Gainers</span>
            </div>
            <div className="space-y-1.5">
              {topGainers.map((stock) => (
                <div key={stock.symbol} className="flex justify-between">
                  <span className="text-xs text-slate-300">{stock.symbol}</span>
                  <span className="text-xs text-green-500 font-medium">{stock.change}</span>
                </div>
              ))}
            </div>
          </div>
          {/* Losers */}
          <div className="bg-red-500/10 rounded-xl p-3">
            <div className="flex items-center gap-1 mb-2">
              <TrendingDown className="w-3 h-3 text-red-500" />
              <span className="text-xs text-red-500 font-medium">Losers</span>
            </div>
            <div className="space-y-1.5">
              {topLosers.map((stock) => (
                <div key={stock.symbol} className="flex justify-between">
                  <span className="text-xs text-slate-300">{stock.symbol}</span>
                  <span className="text-xs text-red-500 font-medium">{stock.change}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market News */}
      <div className="p-4 flex-1">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-4">
          <Clock className="w-4 h-4 text-gold-400" />
          Market News
        </h3>
        <div className="space-y-3">
          {recentNews.map((news, index) => (
            <div
              key={index}
              className="p-3 bg-navy-800/50 hover:bg-purple-500/15 rounded-xl cursor-pointer transition-all group border border-purple-500/20 hover:border-purple-400/40"
            >
              <p className="text-sm text-slate-200 group-hover:text-white transition-colors line-clamp-2">
                {news.title}
              </p>
              <p className="text-xs text-slate-400 mt-1">{news.time}</p>
            </div>
          ))}
        </div>
        <button className="w-full mt-4 py-2 text-sm text-purple-300 hover:text-purple-200 flex items-center justify-center gap-1">
          View All News <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Ad Banner */}
      <div className="p-4 border-t border-purple-500/20">
        <div className="card-highlight rounded-xl p-4">
          <p className="text-xs text-purple-300 font-medium uppercase tracking-wider">Special Offer</p>
          <p className="text-sm text-white mt-1 font-medium">Open Demat Account</p>
          <p className="text-xs text-slate-300 mt-1">Zero brokerage for 30 days</p>
          <button className="mt-3 px-4 py-2 gradient-purple text-white text-xs font-semibold rounded-lg hover:shadow-glow-purple transition-all hover:scale-105">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
