import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Mic,
  Sparkles,
  Shield,
  TrendingUp,
  TrendingDown,
  PieChart,
  Wallet,
  HelpCircle,
  Receipt,
  Lightbulb,
  Bell,
} from 'lucide-react';

interface SmartChip {
  icon: React.ElementType;
  label: string;
  action: string;
  color: string;
  highlight?: boolean;
}

interface InputBarProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoggedIn?: boolean;
  portfolioStats?: {
    totalPnL: number;
    todayChange: number;
    profitableStocks: number;
    losingStocks: number;
    cashAvailable: number;
    highestSectorPercent: number;
    highestSector: string;
  };
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const InputBar: React.FC<InputBarProps> = ({
  onSend,
  disabled = false,
  placeholder = 'Type your message...',
  isLoggedIn = false,
  portfolioStats,
}) => {
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  // Generate all chips in a single array
  const getAllChips = (): SmartChip[] => {
    if (!isLoggedIn) {
      return [
        { icon: TrendingUp, label: 'Explore Stocks', action: 'show reliance', color: 'text-green-400' },
        { icon: PieChart, label: 'Our Services', action: 'what services do you offer', color: 'text-purple-400' },
        { icon: Wallet, label: 'Login', action: 'login', color: 'text-gold-400', highlight: true },
        { icon: HelpCircle, label: 'Open Account', action: 'open account', color: 'text-cyan-400' },
      ];
    }

    const chips: SmartChip[] = [];

    // Feature chips first (always available)
    chips.push({ icon: PieChart, label: 'Analyze', action: 'analyze my portfolio', color: 'text-purple-400' });
    chips.push({ icon: Shield, label: 'Stop-loss', action: 'set stop loss for all', color: 'text-amber-400' });

    // Contextual chips based on portfolio state (highlighted)
    if (portfolioStats) {
      if (portfolioStats.profitableStocks > 0 && portfolioStats.totalPnL > 5000) {
        chips.push({
          icon: TrendingUp,
          label: `Book profits (${formatCurrency(portfolioStats.totalPnL)})`,
          action: 'book partial profits',
          color: 'text-green-400',
          highlight: true,
        });
      }

      if (portfolioStats.cashAvailable > 10000) {
        chips.push({
          icon: Wallet,
          label: `Invest cash (${formatCurrency(portfolioStats.cashAvailable)})`,
          action: 'invest idle cash',
          color: 'text-cyan-400',
          highlight: true,
        });
      }

      if (portfolioStats.highestSectorPercent > 35) {
        chips.push({
          icon: PieChart,
          label: `Reduce ${portfolioStats.highestSector} (${portfolioStats.highestSectorPercent}%)`,
          action: `reduce ${portfolioStats.highestSector} concentration`,
          color: 'text-orange-400',
          highlight: true,
        });
      }

      if (portfolioStats.todayChange < 0) {
        chips.push({
          icon: HelpCircle,
          label: `Why down?`,
          action: 'why is my portfolio down today',
          color: 'text-red-400',
          highlight: true,
        });
      }

      if (portfolioStats.losingStocks > 0) {
        chips.push({
          icon: TrendingDown,
          label: 'Buy Dip',
          action: 'buy the dip',
          color: 'text-blue-400',
        });
      }
    }

    // More feature chips
    chips.push({ icon: Receipt, label: 'Tax', action: 'show my tax liability', color: 'text-emerald-400' });
    chips.push({ icon: Lightbulb, label: 'What to buy?', action: 'what stocks should I buy', color: 'text-pink-400' });
    chips.push({ icon: TrendingUp, label: 'vs NIFTY', action: 'compare with nifty', color: 'text-indigo-400' });
    chips.push({ icon: Bell, label: 'Alerts', action: 'set price alerts', color: 'text-slate-400' });

    return chips;
  };

  const allChips = getAllChips();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSend(message.trim());
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-purple-500/20 glass">
      {/* Smart Action Chips - Single Row with Horizontal Scroll */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <Sparkles className="w-4 h-4 text-gold-400 flex-shrink-0 animate-glow" />
          {allChips.map((chip) => (
            <button
              key={chip.label}
              type="button"
              onClick={() => onSend(chip.action)}
              disabled={disabled}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full border transition-all duration-200 disabled:opacity-50 flex-shrink-0 group whitespace-nowrap ${
                chip.highlight
                  ? 'bg-gradient-to-r from-purple-500/25 to-gold-500/20 border-gold-400/50 text-gold-300 hover:border-gold-400 hover:shadow-glow-gold'
                  : 'bg-navy-800/80 text-slate-200 border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 hover:text-white'
              }`}
            >
              <chip.icon className={`w-3.5 h-3.5 ${chip.color} group-hover:scale-110 transition-transform`} />
              {chip.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="px-4 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className="w-full bg-navy-800/80 text-white placeholder-slate-400 px-4 py-3.5 rounded-2xl border border-purple-500/30 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-sm shadow-inner"
            />
          </div>

          <button
            type="button"
            className="p-3.5 rounded-2xl bg-navy-800/80 text-slate-300 hover:text-purple-300 border border-purple-500/30 hover:border-purple-400 hover:bg-purple-500/10 transition-all duration-200"
            title="Voice input (coming soon)"
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="p-3.5 rounded-2xl gradient-purple text-white hover:shadow-lg hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputBar;
