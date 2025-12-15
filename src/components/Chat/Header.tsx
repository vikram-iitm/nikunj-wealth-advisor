import React from 'react';
import { TrendingUp, User, LogOut } from 'lucide-react';
import { MARKET_INDICES } from '../../services/mockData';

interface HeaderProps {
  isLoggedIn: boolean;
  userName?: string;
  onLogout?: () => void;
}

const Header: React.FC<HeaderProps> = ({ isLoggedIn, userName, onLogout }) => {
  return (
    <header className="bg-navy-800/90 backdrop-blur-sm border-b border-navy-700/50 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center shadow-lg">
            <span className="text-navy-900 font-bold text-lg">N</span>
          </div>
          <div>
            <h1 className="text-lg font-semibold text-white">Nikunj AI Wealth Advisor</h1>
            <p className="text-xs text-slate-400">Your 24/7 Investment Partner</p>
          </div>
        </div>

        {/* User Status */}
        {isLoggedIn && userName && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-navy-700/50 px-3 py-1.5 rounded-full">
              <User className="w-4 h-4 text-gold-500" />
              <span className="text-sm text-slate-300">{userName}</span>
            </div>
            <button
              onClick={onLogout}
              className="p-2 rounded-lg bg-navy-700/50 text-slate-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Market Ticker */}
      <div className="flex items-center gap-4 mt-3 overflow-x-auto pb-1 scrollbar-hide">
        {MARKET_INDICES.map((index) => (
          <div
            key={index.name}
            className="flex items-center gap-2 bg-navy-700/30 px-3 py-1.5 rounded-lg flex-shrink-0"
          >
            <TrendingUp
              className={`w-3 h-3 ${
                index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            />
            <span className="text-xs text-slate-400">{index.name}</span>
            <span className="text-xs font-mono text-slate-200">
              {index.value.toLocaleString('en-IN')}
            </span>
            <span
              className={`text-xs font-mono ${
                index.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              {index.changePercent >= 0 ? '+' : ''}
              {index.changePercent.toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </header>
  );
};

export default Header;
